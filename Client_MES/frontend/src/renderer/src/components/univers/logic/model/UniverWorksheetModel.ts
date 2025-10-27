// UniverWorksheetModel.ts
// Structure conforme à https://docs.univer.ai/guides/sheets/model/worksheet-data
import type { ICellData } from './UniverCellModel'

// Types utilitaires à déclarer AVANT usage
export type IObjectMatrixPrimitiveType<T> = {
  [row: number]: {
    [col: number]: T
  }
}

export type IObjectArrayPrimitiveType<T> = {
  [index: number]: T
}

// https://reference.univer.ai/en-US/interfaces/IWorksheetData
export interface IWorksheetData {
  id: string
  name: string
  status?: number // 1=visible, 0=hidden
  order?: number
  tabColor?: string
  hidden?: number
  freeze?: IFreeze
  rowCount?: number
  columnCount?: number
  defaultColumnWidth?: number
  defaultRowHeight?: number
  mergeData?: IMerge[]
  cellData: IObjectMatrixPrimitiveType<ICellData>
  rowData?: IObjectArrayPrimitiveType<Partial<IRowData>>
  columnData?: IObjectArrayPrimitiveType<Partial<IColumnData>>
  rowHeader?: { width: number; hidden?: number }
  columnHeader?: { height: number; hidden?: number }
  showGridlines?: number
  rightToLeft?: number
  selections?: ISelectionData[]
  zoomRatio?: number
  scrollTop?: number
  scrollLeft?: number
  protection?: IProtection
  autoFilter?: IAutoFilter
  conditionalFormats?: IConditionalFormat[]
  // ... autres propriétés avancées Univer
}

export interface ISelectionData {
  startRow: number
  endRow: number
  startColumn: number
  endColumn: number
  // ... autres propriétés de sélection
}

export interface IFreeze {
  xSplit?: number
  ySplit?: number
  startRow?: number
  startColumn?: number
}

export interface IMerge {
  startRow: number
  startColumn: number
  endRow: number
  endColumn: number
}


export interface IRowData {
  h?: number // height
  hd?: number // hidden
  // ... autres propriétés de ligne
}

export interface IColumnData {
  w?: number // width
  hd?: number // hidden
  // ... autres propriétés de colonne
}

export interface IProtection {
  password?: string
  sheet?: boolean
  objects?: boolean
  scenarios?: boolean
}

export interface IAutoFilter {
  ref: string // e.g. 'A1:D10'
  // ... autres propriétés d'autofilter
}

export interface IConditionalFormat {
  type: string
  // ... autres propriétés de format conditionnel
}


export interface IFreeze {
  xSplit?: number
  ySplit?: number
  startRow?: number
  startColumn?: number
}

export interface IMerge {
  startRow: number
  startColumn: number
  endRow: number
  endColumn: number
}


export interface IRowData {
  h?: number
  hd?: number
}

export interface IColumnData {
  w?: number
  hd?: number
}
