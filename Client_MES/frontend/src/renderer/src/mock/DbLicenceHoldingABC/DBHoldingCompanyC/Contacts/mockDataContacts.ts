import { TableHeader } from "@renderer/components/tables"
import { Contact } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const contactData: Contact[] = [
  {
    id: 1,
    name: 'Directeur Financier',
    emailsId: [1, 2],
    phonesId: [1, 2],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 2,
    name: 'Directeur Vente',
    emailsId: [3, 4],
    phonesId: [3, 4],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 3,
    name: 'Directeur CEO',
    emailsId: [5, 6],
    phonesId: [5, 6],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 4,
    name: 'Directeur Marketing',
    emailsId: [7, 8],
    phonesId: [7, 8],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 5,
    name: 'Directeur CTO',
    emailsId: [9, 10],
    phonesId: [9, 10],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 6,
    name: 'Directeur Production',
    emailsId: [11, 12],
    phonesId: [11, 12],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 7,
    name: 'Directeur Comptable',
    emailsId: [13, 14],
    phonesId: [13, 14],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 8,
    name: 'Directeur Marketing',
    emailsId: [15, 16],
    phonesId: [15, 16],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 9,
    name: 'Directeur Marketing',
    emailsId: [17, 18],
    phonesId: [17, 18],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 10,
    name: 'Directeur Vente',
    emailsId: [19, 20],
    phonesId: [19, 20],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },

  {
    id: 11,
    name: 'Directeur Financier',
    emailsId: [21, 22],
    phonesId: [21, 22],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 12,
    name: 'Directeur Vente',
    emailsId: [23, 24],
    phonesId: [23, 24],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 13,
    name: 'Directeur Vente',
    emailsId: [25, 26],
    phonesId: [25, 26],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 14,
    name: 'Directeur Vente',
    emailsId: [27, 28],
    phonesId: [27, 28],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 15,
    name: 'Directeur Vente',
    emailsId: [29, 30],
    phonesId: [29, 30],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 16,
    name: 'Directeur Vente',
    emailsId: [31, 32],
    phonesId: [31, 32],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 17,
    name: 'Directeur Vente',
    emailsId: [33, 34],
    phonesId: [33, 34],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 18,
    name: 'Directeur Vente',
    emailsId: [35, 36],
    phonesId: [35, 36],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 19,
    name: 'Directeur Vente',
    emailsId: [37, 38],
    phonesId: [37, 38],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 20,
    name: 'Directeur Vente',
    emailsId: [39, 40],
    phonesId: [39, 40],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 21,
    name: 'Directeur Vente',
    emailsId: [41, 42],
    phonesId: [41, 42],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 22,
    name: 'Directeur Vente',
    emailsId: [43, 44],
    phonesId: [43, 44],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }
]

export const headersContacts: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Name', value: 'name', sortable: false, type: 'text' },
  { text: 'Emails', value: 'emailsId', sortable: false, type: 'text' },
  { text: 'Phones', value: 'phonesId', sortable: false, type: 'text' },
  { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
  { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]
