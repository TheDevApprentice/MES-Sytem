// styleMapping.ts
// Centralise la conversion avancée des styles entre Excel (SheetJS) et Univer

/**
 * Convertit un style SheetJS (Excel) en style Univer
 */
export function excelStyleToUniverStyle(excelStyle: any): any {
  const univerStyle: any = {}

  // Font
  if (excelStyle.font) {
    const font = excelStyle.font
    if (font.bold) univerStyle.bl = 1
    if (font.italic) univerStyle.it = 1
    if (font.underline) univerStyle.ul = { s: 1 }
    if (font.strike) univerStyle.st = 1
    if (font.sz) univerStyle.fs = font.sz
    if (font.name) univerStyle.ff = font.name
    if (font.color) {
      const fontColor = extractColorFromExcel(font.color)
      if (fontColor) univerStyle.cl = { rgb: fontColor }
    }
  }

  // Background fill
  if (excelStyle.fill) {
    const fill = excelStyle.fill
    const fg = fill.fgColor || fill.bgColor
    if (fg) {
      const bgColor = extractColorFromExcel(fg)
      if (bgColor) univerStyle.bgRGB = bgColor
    }
  }

  // Alignment
  if (excelStyle.alignment) {
    const align = excelStyle.alignment
    if (align.horizontal) univerStyle.ha = align.horizontal
    if (align.vertical) univerStyle.va = align.vertical
    if (align.wrapText) univerStyle.tb = 1
  }

  // Borders
  if (excelStyle.border) {
    univerStyle.bd = {}
    ;['left', 'right', 'top', 'bottom'].forEach((side) => {
      if (excelStyle.border[side]) {
        univerStyle.bd[side] = {
          style: excelStyle.border[side].style || 'thin',
          color: extractColorFromExcel(excelStyle.border[side].color) || '#000000',
        }
      }
    })
  }

  // Number format
  if (excelStyle.numFmt) {
    univerStyle.nf = excelStyle.numFmt
  }

  return univerStyle
}

/**
 * Convertit un style Univer en style SheetJS (Excel)
 */
export function univerStyleToExcelStyle(univerStyle: any): any {
  const excelStyle: any = {}

  // Font
  const font: any = {}
  if (univerStyle.bl) font.bold = true
  if (univerStyle.it) font.italic = true
  if (univerStyle.ul) font.underline = true
  if (univerStyle.st) font.strike = true
  if (univerStyle.fs) font.sz = univerStyle.fs
  if (univerStyle.ff) font.name = univerStyle.ff
  if (univerStyle.cl?.rgb) font.color = { rgb: univerStyle.cl.rgb.replace('#', '') }
  if (Object.keys(font).length) excelStyle.font = font

  // Fill
  if (univerStyle.bgRGB) {
    excelStyle.fill = { fgColor: { rgb: univerStyle.bgRGB.replace('#', '') } }
  }

  // Alignment
  if (univerStyle.ha || univerStyle.va || univerStyle.tb) {
    excelStyle.alignment = {}
    if (univerStyle.ha) excelStyle.alignment.horizontal = univerStyle.ha
    if (univerStyle.va) excelStyle.alignment.vertical = univerStyle.va
    if (univerStyle.tb) excelStyle.alignment.wrapText = true
  }

  // Borders
  if (univerStyle.bd) {
    excelStyle.border = {}
    ;['left', 'right', 'top', 'bottom'].forEach((side) => {
      if (univerStyle.bd[side]) {
        excelStyle.border[side] = {
          style: univerStyle.bd[side].style || 'thin',
          color: { rgb: (univerStyle.bd[side].color || '#000000').replace('#', '') },
        }
      }
    })
  }

  // Number format
  if (univerStyle.nf) {
    excelStyle.numFmt = univerStyle.nf
  }

  return excelStyle
}

/**
 * Utilitaire pour extraire la couleur SheetJS au format hex
 */
function extractColorFromExcel(colorObj: any): string | null {
  if (!colorObj) return null
  if (colorObj.rgb) {
    return `#${colorObj.rgb.replace(/^([0-9A-Fa-f]{2})/, '')}` // retire alpha éventuel
  }
  if (colorObj.theme !== undefined && colorObj.tint !== undefined) {
    // Mapping de thème possible, fallback gris
    return '#cccccc'
  }
  return null
}
