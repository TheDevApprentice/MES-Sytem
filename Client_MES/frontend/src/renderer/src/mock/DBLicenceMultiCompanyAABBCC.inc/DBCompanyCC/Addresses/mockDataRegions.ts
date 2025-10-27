import { TableHeader } from "@renderer/components/tables"
import { Region } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const regionData: Region[] = [
  {
    id: 1,
    name: 'North America'
  },
  {
    id: 2,
    name: 'Europe'
  },
  {
    id: 3,
    name: 'Asia'
  },
  {
    id: 4,
    name: 'Asia-Pacific'
  },
  {
    id: 5,
    name: 'South America'
  },
  {
    id: 6,
    name: 'Africa'
  }
]

export const headersRegions: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Name', value: 'name', sortable: false, type: 'text' }
]

