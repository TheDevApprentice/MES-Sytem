import { TableHeader } from "@renderer/components/tables"
import { Contact } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const contactData: Contact[] = [
  {
    id: 1,
    name: 'Directeur Financier',
    emailsId: [1],
    phonesId: [1],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 2,
    name: 'Directeur Vente',
    emailsId: [2],
    phonesId: [2],
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 3,
    name: 'Directeur Marketing',
    emailsId: [3],
    phonesId: [3],
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
