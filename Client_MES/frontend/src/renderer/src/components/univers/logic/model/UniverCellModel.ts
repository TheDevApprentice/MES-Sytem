// UniverCellModel.ts
// Structure conforme à https://docs.univer.ai/guides/sheets/model/cell-data

// https://reference.univer.ai/en-US/interfaces/ICellData
export interface ICellData {
  v?: string | number | boolean | null // Cell value
  t?: string // Cell type (n, s, b, d, e, etc.)
  f?: string // Formula
  m?: string // Displayed value (for formula cells)
  s?: string | IStyleData // Style id or inline style
  p?: string // Hyperlink
  ct?: { fa: string; t: string } // CellType, e.g. { fa: 'General', t: 'n' }
  r?: ICellRichText[] // Rich text array
  si?: string // Formula id
  custom?: any // Custom field
  // ... autres champs avancés Univer
}

// https://reference.univer.ai/en-US/interfaces/ICellRichText
export interface ICellRichText {
  t: string // text
  s?: IStyleData // style
}


// https://reference.univer.ai/en-US/interfaces/IStyleData
export interface IStyleData {
  ff?: string // Font family
  fs?: number // Font size
  it?: number // Italic (0|1)
  bl?: number // Bold (0|1)
  ul?: { s: number; c?: number; cl?: IColorData; t?: number } // Underline
  st?: { s: number; c?: number; cl?: IColorData; t?: number } // Strikethrough
  ol?: { s: number; c?: number; cl?: IColorData; t?: number } // Overline
  bg?: IColorData // Background color
  cl?: IColorData // Font color
  ha?: string // Horizontal align
  va?: string // Vertical align
  tb?: number // Wrap text (0|1)
  bd?: IBorderData // Border
  nf?: string // Number format
  ls?: number // Font size (legacy)
  // ... autres propriétés avancées Univer
}

// https://reference.univer.ai/en-US/interfaces/IBorderData
export interface IBorderData {
  l?: IBorderStyle
  r?: IBorderStyle
  t?: IBorderStyle
  b?: IBorderStyle
  // diagonal, etc.
}

export interface IBorderStyle {
  style?: string // e.g. 'thin', 'medium', 'dashed', etc.
  color?: IColorData
}

// https://reference.univer.ai/en-US/interfaces/IColorData
export interface IColorData {
  rgb: string // '#RRGGBB'
}

