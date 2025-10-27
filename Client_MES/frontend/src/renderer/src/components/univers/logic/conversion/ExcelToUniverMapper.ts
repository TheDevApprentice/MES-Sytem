// ExcelToUniverMapper.ts
// Classe orientée objet pour transformer un workbook Excel (SheetJS) en UniverWorkbook
import * as XLSX from 'xlsx'
import { excelStyleToUniverStyle } from './styleMapping'
import type { IWorkbookData } from '../model/UniverWorkbookModel'
import type { IWorksheetData } from '../model/UniverWorksheetModel'
import type { ICellData, IStyleData } from '../model/UniverCellModel'

export class ExcelToUniverMapper {
  private stylePool: Map<string, IStyleData> = new Map()
  private styleIdCounter = 1

  toUniverWorkbook(excelWorkbook: XLSX.WorkBook, fileName: string): IWorkbookData {
    const univer: IWorkbookData = {
      id: `import-${Date.now()}`,
      name: fileName.replace(/\.(xlsx|xls)$/i, ''),
      sheetOrder: [],
      sheets: {},
      styles: {},
    }

    excelWorkbook.SheetNames.forEach((sheetName) => {
      const worksheet = excelWorkbook.Sheets[sheetName]
      const univerSheet = this.toUniverSheet(worksheet, sheetName, excelWorkbook)
      univer.sheets[univerSheet.id] = univerSheet
      univer.sheetOrder.push(univerSheet.id)
    })
    // Générer la pool de styles globale
    let styleIndex = 1
    for (const [styleKey, styleObj] of this.stylePool.entries()) {
      const styleId = `s${styleIndex++}`
      univer.styles[styleId] = styleObj
    }
    return univer
  }

  private toUniverSheet(worksheet: XLSX.WorkSheet, sheetName: string, workbook: XLSX.WorkBook): IWorksheetData {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
    const cellData: Record<number, Record<number, ICellData>> = {}
    for (let row = range.s.r; row <= range.e.r; row++) {
      cellData[row] = {}
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        const excelCell: any = worksheet[cellAddress]
        if (excelCell) {
          const univerCell: ICellData = {
            v: excelCell.v,
            t: excelCell.t,
          }
          // Formule
          if (excelCell.f) univerCell.f = excelCell.f
          // Style avancé
          let styleObj = null
          if (excelCell.s) {
            if (typeof excelCell.s === 'object') {
              styleObj = excelCell.s
            } else if (typeof excelCell.s === 'number' && (workbook as any).Styles && (workbook as any).Styles.CellXf) {
              const styleIndex = excelCell.s
              styleObj = (workbook as any).Styles.CellXf[styleIndex]
            }
          }
          if (styleObj) {
            const univerStyle = excelStyleToUniverStyle(styleObj)
            const styleKey = JSON.stringify(univerStyle)
            let styleId = this.findStyleId(styleKey)
            if (!styleId) {
              styleId = `s${this.styleIdCounter++}`
              this.stylePool.set(styleKey, univerStyle)
            }
            univerCell.s = styleId
          }
          cellData[row][col] = univerCell
        }
      }
    }
    return {
      id: `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: sheetName,
      cellData,
      // merges, rowData, columnData à ajouter si besoin
    }
  }

  private findStyleId(styleKey: string): string | undefined {
    let idx = 1
    for (const key of this.stylePool.keys()) {
      if (key === styleKey) return `s${idx}`
      idx++
    }
    return undefined
  }
}
