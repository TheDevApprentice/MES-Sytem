import type { TableHeader } from '@components/tables/types/types'
import { Phone } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const phoneData: Phone[] = [
  {
    id: 1,
    number: '123-456-7801',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 2,
    number: '123-456-7802',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 3,
    number: '123-456-7803',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }
]

export const headersPhones: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Number', value: 'number', sortable: false, type: 'text' },
  { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
  { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]
