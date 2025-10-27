import * as XLSX from 'xlsx'
import { ExcelToUniverMapper } from './ExcelToUniverMapper'
import type { IWorkbookData } from '../model/UniverWorkbookModel'

/**
 * Convert a SheetJS workbook to Univer data structure (including styles, multi-tab, style pool)
 */
export const convertExcelToUniver = (
  excelWorkbook: XLSX.WorkBook,
  fileName: string
): IWorkbookData => {
  const mapper = new ExcelToUniverMapper()
  return mapper.toUniverWorkbook(excelWorkbook, fileName)
}
