import * as XLSX from 'xlsx'

/**
 * Convert Univer workbook structure back to SheetJS workbook (keeps basic styles)
 */
export const convertUniverToExcel = (univerData: any): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new()

  Object.values(univerData.sheets).forEach((sheet: any) => {
    const worksheet = convertSheetToExcel(sheet)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
  })

  return workbook
}

const convertSheetToExcel = (univerSheet: any) => {
  const cellData = univerSheet.cellData || {}
  const worksheet: any = {}

  let maxRow = 0
  let maxCol = 0

  Object.keys(cellData).forEach((rowKey) => {
    const row = parseInt(rowKey)
    maxRow = Math.max(maxRow, row)

    Object.keys(cellData[row]).forEach((colKey) => {
      const col = parseInt(colKey)
      maxCol = Math.max(maxCol, col)

      const univerCell = cellData[row][col]
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })

      const excelCell: any = {
        v: univerCell.v,
        t: getExcelCellType(univerCell.v),
      }

      if (univerCell.f) excelCell.f = univerCell.f

      if (univerCell.s) excelCell.s = convertStyleToExcel(univerCell.s)

      worksheet[cellAddress] = excelCell
    })
  })

  if (maxRow >= 0 && maxCol >= 0) {
    worksheet['!ref'] = XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: maxCol, r: maxRow },
    })
  }

  return worksheet
}

// -------- Style mapping (advanced) --------
import { univerStyleToExcelStyle } from './styleMapping'

const convertStyleToExcel = univerStyleToExcelStyle;


const getExcelCellType = (value: any): string => {
  if (typeof value === 'number') return 'n'
  if (typeof value === 'boolean') return 'b'
  if (value instanceof Date) return 'd'
  return 's'
}
