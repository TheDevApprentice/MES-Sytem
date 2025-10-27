import * as XLSX from 'xlsx'

/**
 * Read a File object (xlsx/xls) and return a SheetJS workbook.
 * Keeps cell styles, formulas, dates, etc.
 */
export const readWorkbookFromFile = (file: File): Promise<XLSX.WorkBook> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) return reject(new Error('Empty file data'))

        const workbook = XLSX.read(data, {
          type: 'array',
          cellStyles: true,
          cellNF: true,
          cellDates: true,
          sheetStubs: true,
          cellFormula: true,
          cellHTML: true,
        })
        resolve(workbook)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Trigger download of a SheetJS workbook to the user.
 */
export const saveWorkbookToFile = (
  workbook: XLSX.WorkBook,
  filename = 'export.xlsx'
) => {
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}
