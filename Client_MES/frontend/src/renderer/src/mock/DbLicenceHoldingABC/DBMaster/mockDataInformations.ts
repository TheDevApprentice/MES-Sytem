import type { TableHeader } from '@components/tables/types/types'

export type Informations = {
  id: number
  name: string
}

export type InformationsUser = {
  informationId: number
  userId: number
}


export const informationsData: Informations[] = [
  {
    id: 1,
    name: 'Holding Company A .inc'
  },
  {
    id: 2,
    name: 'Holding Company B .inc'
  },
  {
    id: 3,
    name: 'Holding Company C .inc'
  }
]

export const informationsUserData: InformationsUser[] = [
  {
    informationId: 1,
    userId: 1
  },
  {
    informationId: 2,
    userId: 1
  },
  {
    informationId: 3,
    userId: 1
  }
]

export const headersInformations: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Name', value: 'name', sortable: false, type: 'text' }
]

export const headersInformationsUser: TableHeader[] = [
  { text: 'Information ID', value: 'informationId', sortable: false, type: 'number' },
  { text: 'User ID', value: 'userId', sortable: false, type: 'number' }
]
