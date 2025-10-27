import type { IWorkbookData } from './model/UniverWorkbookModel'

export const sampleData: IWorkbookData = {
  id: 'workbook-01',
  name: 'Sample Workbook',
  sheetOrder: ['sheet-01', 'sheet-02'],
  styles: {
    s1: { bl: 1, bg: { rgb: '#f0f0f0' }, fs: 12, ha: 'center' }, // header
    s2: { cl: { rgb: '#1976d2' }, fs: 11 }, // nom
    s3: { ha: 'center', fs: 11, bg: { rgb: '#fffde7' } }, // âge
    s4: { ha: 'left', fs: 11, bg: { rgb: '#e3f2fd' } }, // ville
    s5: { ha: 'right', nf: '#,##0', fs: 11, bg: { rgb: '#fce4ec' } }, // salaire
    s6: { bl: 1, bg: { rgb: '#e0f7fa' }, fs: 12, ha: 'center' }, // header sheet 2
    s7: { cl: { rgb: '#388e3c' }, fs: 11, bg: { rgb: '#e8f5e9' } }, // produit
    s8: { ha: 'center', fs: 11, bg: { rgb: '#fff3e0' } }, // quantité
    s9: { ha: 'right', nf: '#,##0.00', fs: 11, bg: { rgb: '#f3e5f5' } }, // prix
    s10: { ha: 'right', nf: '#,##0.00', fs: 11, bg: { rgb: '#e1bee7' } }, // total
    s11: { ha: 'right', nf: '#,##0.00', fs: 11, bg: { rgb: '#ffe0b2' } }, // tva
    s12: { ha: 'right', nf: '#,##0.00', fs: 11, bg: { rgb: '#b2ebf2' } }, // ttc
  },
  sheets: {
    'sheet-01': {
      id: 'sheet-01',
      name: 'Feuille 1',
      cellData: {
        0: {
          0: { v: 'Nom', s: 's1' },
          1: { v: 'Âge', s: 's1' },
          2: { v: 'Ville', s: 's1' },
          3: { v: 'Salaire', s: 's1' },
          4: { v: 'Prime', s: 's1' },
          5: { v: 'Total', s: 's1' }
        },
        1: {
          0: { v: 'Alice Dupont', s: 's2' },
          1: { v: 25, t: 'number', s: 's3' },
          2: { v: 'Paris', s: 's4' },
          3: { v: 45000, t: 'number', s: 's5' },
          4: { v: 2000, t: 'number', s: 's8' },
          5: { f: '=D2+E2', t: 'number', s: 's10' }
        },
        2: {
          0: { v: 'Bob Martin', s: 's2' },
          1: { v: 30, t: 'number', s: 's3' },
          2: { v: 'Lyon', s: 's4' },
          3: { v: 52000, t: 'number', s: 's5' },
          4: { v: 3000, t: 'number', s: 's8' },
          5: { f: '=D3+E3', t: 'number', s: 's10' }
        },
        3: {
          0: { v: 'Charlie Durand', s: 's2' },
          1: { v: 28, t: 'number', s: 's3' },
          2: { v: 'Marseille', s: 's4' },
          3: { v: 48000, t: 'number', s: 's5' },
          4: { v: 1500, t: 'number', s: 's8' },
          5: { f: '=D4+E4', t: 'number', s: 's10' }
        }
      }
    },
    'sheet-02': {
      id: 'sheet-02',
      name: 'Feuille 2',
      cellData: {
        0: {
          0: { v: 'Produit', s: 's6' },
          1: { v: 'Quantité', s: 's6' },
          2: { v: 'Prix', s: 's6' },
          3: { v: 'Total', s: 's6' },
          4: { v: 'TVA', s: 's6' },
          5: { v: 'TTC', s: 's6' }
        },
        1: {
          0: { v: 'Pommes', s: 's7' },
          1: { v: 15, t: 'number', s: 's8' },
          2: { v: 2.5, t: 'number', s: 's9' },
          3: { f: '=B2*C2', t: 'number', s: 's10' }, // Total = Quantité * Prix
          4: { f: '=D2*0.2', t: 'number', s: 's11' }, // TVA = Total * 0.2
          5: { f: '=D2+E2', t: 'number', s: 's12' }  // TTC = Total + TVA
        },
        2: {
          0: { v: 'Poires', s: 's7' },
          1: { v: 8, t: 'number', s: 's8' },
          2: { v: 3.1, t: 'number', s: 's9' },
          3: { f: '=B3*C3', t: 'number', s: 's10' },
          4: { f: '=D3*0.2', t: 'number', s: 's11' },
          5: { f: '=D3+E3', t: 'number', s: 's12' }
        }
      }
    }
  }
}