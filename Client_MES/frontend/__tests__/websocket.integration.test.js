const WebSocket = require('ws');
const http = require('http');

let server, wss;

describe('WebSocket integration', () => {
  beforeAll((done) => {
    const fs = require('fs');
    const path = require('path');
    const logDir = path.join(__dirname, 'test_logs');
    const logFile = path.join(logDir, 'websocket_test_result.txt');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.writeFileSync(logFile, `--- NOUVEAU TEST ---\n`);

    // Logging pour le serveur
    function log(...args) {
      fs.appendFileSync(logFile, '[SERVER] ' + args.join(' ') + '\n');
      // eslint-disable-next-line no-console
      console._realLog ? console._realLog(...args) : console.log(...args);
    }
    global.serverLog = log;

    server = http.createServer();
    wss = new WebSocket.Server({ server });

    wss.on('connection', ws => {
      log('Serveur : client connecté');
      ws.on('message', message => {
        log('Serveur : message reçu du client :', message.toString());
        ws.send('Echo: ' + message);
      });
      ws.send('Bienvenue, client WebSocket !');
    });

    server.listen(8081, () => {
      log('Serveur WebSocket démarré sur ws://localhost:8081');
      done();
    });
  });

  afterAll((done) => {
    wss.close(() => {
      server.close(done);
    });
  });

  test('WebSocket client can connect and exchange messages', (done) => {
    const fs = require('fs');
    const path = require('path');
    const logDir = path.join(__dirname, 'test_logs');
    const logFile = path.join(logDir, 'websocket_test_result.txt');

    // Surcharge console pour capturer tout côté client
    const realLog = console.log;
    const realWarn = console.warn;
    const realError = console.error;
    console._realLog = realLog; // Pour le log serveur
    function logToFileAndConsole(method, ...args) {
      const text = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a, null, 2))).join(' ');
      fs.appendFileSync(logFile, `[CLIENT][${method.toUpperCase()}] ${text}\n`);
      if (method === 'log') realLog(...args);
      else if (method === 'warn') realWarn(...args);
      else if (method === 'error') realError(...args);
    }
    console.log = (...args) => logToFileAndConsole('log', ...args);
    console.warn = (...args) => logToFileAndConsole('warn', ...args);
    console.error = (...args) => logToFileAndConsole('error', ...args);

    console.log('Début du test WebSocket');

    const client = new WebSocket('ws://localhost:8081');

    let receivedWelcome = false;
    let receivedEcho = false;

    client.on('open', () => {
      console.log('Client : connexion ouverte');
      try {
        client.send(JSON.stringify({ type: 'PING', payload: { message: 'Hello test' } }));
        console.log('Client : message envoyé');
      } catch (err) {
        console.error('Erreur lors de l\'envoi du message', err);
        fail('Erreur lors de l\'envoi du message');
        cleanup();
      }
    });

    client.on('message', (data) => {
      const msg = data.toString();
      console.log('Client : message reçu', msg);
      if (msg.includes('Bienvenue')) {
        receivedWelcome = true;
        console.log('Client : message de bienvenue reçu');
      }
      if (msg.startsWith('Echo:')) {
        receivedEcho = true;
        try {
          expect(receivedWelcome).toBe(true);
          expect(msg).toContain('PING');
          console.log('Client : assertions réussies');
        } catch (err) {
          console.error('Assertion échouée', err);
          fail('Assertion échouée : ' + err.message);
        }
        cleanup();
      }
    });

    client.on('error', (err) => {
      console.error('Erreur client WebSocket', err);
      fail('Erreur client WebSocket : ' + err.message);
      cleanup();
    });

    function cleanup() {
      try {
        if (client && client.readyState === WebSocket.OPEN) client.close();
      } catch (e) {}
      // Restaure les consoles
      console.log = realLog;
      console.warn = realWarn;
      console.error = realError;
      done();
    }

    // Timeout de sécurité pour éviter les tests qui pendent
    setTimeout(() => {
      if (!receivedWelcome) {
        console.error('Timeout : message de bienvenue non reçu');
        fail('Timeout : message de bienvenue non reçu');
      } else if (!receivedEcho) {
        console.error('Timeout : echo non reçu');
        fail('Timeout : echo non reçu');
      }
      cleanup();
    }, 5000);
  });
});