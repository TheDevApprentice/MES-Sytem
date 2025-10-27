import type { IWorkbookData } from '../model/UniverWorkbookModel';
import type { IWorksheetData } from '../model/UniverWorksheetModel';
import type { ICellData, IStyleData } from '../model/UniverCellModel';

/**
 * Convert arbitrary JS data into a UniverJS workbook format.
 * Supports arrays of objects, primitive arrays, nested objects, and primitives.
 * @param data Any JSON-compatible data
 * @param options Optional workbook id/name
 */
export function convertDataToUniver(
  data: any,
  options?: { workbookId?: string; workbookName?: string }
): IWorkbookData {
  const sheets: Record<string, IWorksheetData> = {};
  const sheetOrder: string[] = [];
  // Define header style
  const styles: Record<string, IStyleData> = {
    header: { bl: 1, fs: 12, ha: 'center' },
  };

  function createSheet(id: string, name: string, rows: any[][]) {
    const sheet: IWorksheetData = {
      id,
      name,
      rowCount: rows.length,
      columnCount: rows[0]?.length || 0,
      cellData: {},
      defaultRowHeight: 24,
      defaultColumnWidth: 100,
    };
    rows.forEach((row, r) => {
      const rowIndex = r;
      sheet.cellData[rowIndex] = {};
      row.forEach((val, c) => {
        const cell: ICellData = {
          v: val,
          t: typeof val === 'number' ? 'n' : 's',
        };
        // Apply header style to first row
        if (r === 0) {
          cell.s = 'header';
        } else {
          // Apply cell background based on type/value
          const style: IStyleData = {};
          if (typeof val === 'number') {
            style.bg = { rgb: '#e6f7ff' };
          } else if (typeof val === 'boolean') {
            style.bg = { rgb: val ? '#d9f7be' : '#ffa39e' };
          } else {
            style.bg = { rgb: '#f5f5f5' };
          }
          cell.s = style;
        }
        sheet.cellData[rowIndex][c] = cell;
      });
    });
    sheets[id] = sheet;
    sheetOrder.push(id);
  }

  const urlRegex = /^https?:\/\//i;
  const isUrl = (val: any): boolean => typeof val === 'string' && urlRegex.test(val);

  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) {
      createSheet('sheet-1', 'Sheet1', [['No data']]);
    } else if (typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
      const rawHeaders = Object.keys(data[0]);
      const keys = rawHeaders.filter(h => !isUrl((data[0] as any)[h]));
      const headerLabels = keys.map(h => h.charAt(0).toUpperCase() + h.slice(1));
      const rows = [headerLabels];
      (data as object[]).forEach(item => {
        rows.push(keys.map(k => (item as any)[k]));
      });
      createSheet('sheet-1', options?.workbookName || 'Sheet1', rows);
    } else {
      const rows = [['Value']];
      (data as any[]).forEach(item => rows.push([item]));
      createSheet('sheet-1', options?.workbookName || 'Sheet1', rows);
    }
  }
  // Handle objects
  else if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, val], i) => {
      const id = `sheet-${i + 1}`;
      if (Array.isArray(val)) {
        if (val.length && typeof val[0] === 'object' && val[0] !== null && !Array.isArray(val[0])) {
          const rawHeaders = Object.keys(val[0] as object);
          const keys = rawHeaders.filter(h => !isUrl((val as any)[0][h]));
          const headerLabels = keys.map(h => h.charAt(0).toUpperCase() + h.slice(1));
          const rows = [headerLabels];
          (val as object[]).forEach(item => rows.push(keys.map(k => (item as any)[k])));
          createSheet(id, key, rows);
        } else {
          const rows = [[key]];
          (val as any[]).forEach(item => rows.push([item]));
          createSheet(id, key, rows);
        }
      } else {
        createSheet(id, key, [[key, val]]);
      }
    });
  }
  // Primitive
  else {
    createSheet('sheet-1', 'Value', [[data]]);
  }

  return {
    id: options?.workbookId || 'workbook-1',
    name: options?.workbookName || 'Workbook',
    styles,
    sheetOrder,
    sheets,
  };
}
