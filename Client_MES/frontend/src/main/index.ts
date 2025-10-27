import { app, session, shell, BrowserWindow, ipcMain } from 'electron'

import type { Server } from 'https'
import https from 'https'
import serveStatic from 'serve-static'
import finalhandler from 'finalhandler'
import { join } from 'path'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let backend: ChildProcess | null = null
let mainWin: BrowserWindow | null = null
let staticServer: Server | null = null
let staticServerPort: number | null = null

import fs from 'fs'
// Ajoute ceci juste après les imports
const caCertPath = app.isPackaged
  ? path.join(process.resourcesPath, 'certs', 'mes-local.crt')
  : path.join(__dirname, '../../certs', 'mes-local.crt');
process.env.NODE_EXTRA_CA_CERTS = caCertPath

function startBackend(): void {
  const backendDir = path.join(process.resourcesPath, 'backend')
  const jarFile = fs
    .readdirSync(backendDir)
    .find((f) => f.endsWith('.jar') && !f.includes('-plain'))
  if (!jarFile) {
    console.error('Backend JAR introuvable dans ', backendDir)
    return
  }
  const jarPath = path.join(backendDir, jarFile)
  const javaCmd = process.platform === 'win32' ? 'java.exe' : 'java'
  const logPath = path.join(app.getPath('userData'), 'backend.log')
  const logFd = fs.openSync(logPath, 'a')
  backend = spawn(javaCmd, ['-jar', jarPath], {
    detached: true,
    stdio: ['ignore', logFd, logFd]
  })
  backend.unref()
  backend.on('exit', (code) => {
    console.error('Backend process exited with code', code)
  })
}

function createWindow(port?: number): void {
  if (mainWin && !mainWin.isDestroyed()) {
    mainWin.focus()
    return
  }
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false, // Désactive la barre native pour activer la custom
    fullscreen: true, // Ouvre en plein écran
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWin = mainWindow

  mainWindow.on('closed', () => {
    mainWin = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  mainWindow.webContents.openDevTools()
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else if (port != null) {
    mainWindow.loadURL(`https://localhost:${port}`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  
  // Forcer l'acceptation du certificat pour localhost
  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    if (
      request.hostname === 'localhost' ||
      request.hostname === '127.0.0.1'
    ) {
      callback(0) // 0 = accepte le certificat
    } else {
      callback(-3) // -3 = comportement par défaut
    }
  })

  // Ce Bloc de console log doit être laisser là afin que l'on examine plus en détail session et ses objets
  // console.log('process.env.NODE_EXTRA_CA_CERTS', process.env.NODE_EXTRA_CA_CERTS)
  // console.log("session.defaultSession", session.defaultSession)
  // console.log("session.defaultSession.availableSpellCheckerLanguages", session.defaultSession.availableSpellCheckerLanguages)
  // console.log("session.defaultSession.spellCheckerEnabled", session.defaultSession.spellCheckerEnabled)
  // console.log("session.defaultSession.storagePath", session.defaultSession.storagePath)
  // console.log("session.defaultSession.cookies", session.defaultSession.cookies)
  // console.log("session.defaultSession.webRequest", session.defaultSession.webRequest)
  
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Démarre le backend et le serveur statique uniquement en production
  if (app.isPackaged) {
    startBackend()

    // Start lightweight static server (http-server) on fixed port to serve renderer files over HTTP
    const rendererDist = path.join(__dirname, '../renderer')
    console.log('Renderer dist path:', rendererDist)
    console.log('Index.html exists:', fs.existsSync(path.join(rendererDist, 'index.html')))
    const certPath = path.join(process.resourcesPath, 'certs', 'mes-local.crt')
    const keyPath = path.join(process.resourcesPath, 'certs', 'mes-local.key')
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    }
    const serve = serveStatic(rendererDist)
    staticServer = https.createServer(options, (req, res) => {
      serve(req, res, finalhandler(req, res))
    }) as Server
    staticServer.listen(5135, '127.0.0.1', () => {
      staticServerPort = 5135
      createWindow(staticServerPort)
    })
  } else {
    createWindow()
  }

  // IPC pour la barre custom
  ipcMain.on('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })
  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.isMaximized() ? win.unmaximize() : win?.maximize()
  })
  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Ouvre la fenêtre uniquement en développement pour éviter les doublons
  if (!app.isPackaged && BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }

  // IPC handler pour ping-backend
  ipcMain.handle('ping-backend', async () => {
    console.log('[ping-backend] IPC handler called');
    return new Promise<boolean>((resolve) => {
      const https = require('https');
      console.log('[ping-backend] Sending HTTPS request to https://localhost:8443/api/hello');
      const req = https.request({
        hostname: 'localhost',
        port: 8443,
        path: '/api/hello',
        method: 'GET',
        rejectUnauthorized: false
      }, (res) => {
        console.log(`[ping-backend] Response received: status=${res.statusCode}`);
        resolve(true);
        res.resume();
      });
      req.on('error', (err) => {
        console.log('[ping-backend] Request error:', err);
        resolve(false);
      });
      req.on('close', () => {
        console.log('[ping-backend] Request closed');
      });
      req.end();
    });
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('before-quit', () => {
  backend?.kill()
  staticServer?.close()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
