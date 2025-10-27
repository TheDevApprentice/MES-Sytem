// UniverWorkbook.ts
// ⚠️ Ce fichier ne fait que réexporter les modèles stricts Univer pour usage POO/interop.

import type { IWorkbookData } from './UniverWorkbookModel'
import type { IWorksheetData, IRowData, IColumnData, IMerge } from './UniverWorksheetModel'
import type { ICellData, IStyleData } from './UniverCellModel'

export type UniverWorkbook = IWorkbookData
export type UniverSheet = IWorksheetData
export type UniverCell = ICellData
export type UniverStyle = IStyleData
export type UniverRow = IRowData
export type UniverColumn = IColumnData
export type UniverMerge = IMerge
