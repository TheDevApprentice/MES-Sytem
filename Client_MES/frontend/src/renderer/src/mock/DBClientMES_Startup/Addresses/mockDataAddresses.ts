import type { TableHeader } from '@components/tables/types/types'
import { Address, AddresseCountry } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const addressData: Address[] = [
  { id: 1, street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '12345' },
  { id: 2, street: '456 Elm St', city: 'Springfield', state: 'IL', zipCode: '62704' },
  { id: 3, street: '789 Oak St', city: 'Springfield', state: 'IL', zipCode: '62704' },
]

// (Représente la futur table en base de donnée)
export const addressCountryData: AddresseCountry[] = [
  { addressId: 1, countryId: 1 },
  { addressId: 2, countryId: 1 },
  { addressId: 3, countryId: 1 },
]

export const headersAddresses: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Street', value: 'street', sortable: false, type: 'text' },
  { text: 'City', value: 'city', sortable: false, type: 'text' },
  { text: 'State', value: 'state', sortable: false, type: 'text' },
  { text: 'Zip Code', value: 'zipCode', sortable: false, type: 'text' },
  { text: 'Country', value: 'country', sortable: false, type: 'text' },
  { text: 'Region', value: 'region', sortable: false, type: 'text' }
]