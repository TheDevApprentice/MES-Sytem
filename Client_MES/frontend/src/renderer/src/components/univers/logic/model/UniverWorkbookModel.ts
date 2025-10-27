// UniverWorkbookModel.ts
// Structure conforme à https://docs.univer.ai/guides/sheets/model/workbook-data
// https://reference.univer.ai/en-US/interfaces/IWorkbookData
import type { IWorksheetData, IProtection } from './UniverWorksheetModel'
import type { IStyleData } from './UniverCellModel'
import type { IWorkbookData } from '@univerjs/presets'

export interface IWorkbookData extends IWorkbookData {
  id: string // Workbook unique id
  name: string // Workbook name
  appVersion?: string // Application version
  locale?: string // Locale string (e.g. 'fr-FR')
  creator?: string // Creator name
  createdTime?: string // ISO date
  lastModifiedBy?: string // Last modifier
  lastModifiedTime?: string // ISO date
  styles?: Record<string, IStyleData | null> // Global style pool
  resources?: IResource[] // Embedded resources (images, etc.)
  definedNames?: IDefinedName[] // Named ranges
  calcChain?: ICalcChainEntry[] // Calculation chain
  protection?: IProtection // Workbook protection
  plugins?: IPluginInfo[] // Plugins
  sheetOrder: string[] // Sheet id order
  sheets: { [sheetId: string]: IWorksheetData } // All sheets
  // ... autres propriétés avancées Univer
}

export interface IResource {
  id: string
  type: string // e.g. 'image/png'
  data: string // base64 or url
}

export interface IDefinedName {
  name: string
  refersTo: string // e.g. 'Sheet1!$A$1:$A$10'
  scope?: string // workbook or sheet id
}

export interface ICalcChainEntry {
  sheetId: string
  row: number
  col: number
}

export interface IPluginInfo {
  name: string
  version?: string
  options?: any
}


