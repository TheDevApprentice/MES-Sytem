import type { TableHeader } from '@components/tables/types/types'
import { Address, AddresseCountry } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const addressData: Address[] = [
  { id: 1, street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '12345' },
  { id: 2, street: '456 Elm St', city: 'Springfield', state: 'IL', zipCode: '62704' },
  { id: 3, street: '789 Oak Ave', city: 'Dallas', state: 'TX', zipCode: '75201' },
  { id: 4, street: '101 Maple Rd', city: 'Toronto', state: 'ON', zipCode: 'M4B 1B3' },
  { id: 5, street: '202 Pine St', city: 'London', state: 'Greater London', zipCode: 'SW1A 1AA' },
  { id: 6, street: '303 Cedar Blvd', city: 'Paris', state: 'Île-de-France', zipCode: '75001' },
  { id: 7, street: '404 Birch Ln', city: 'Berlin', state: 'Berlin', zipCode: '10115' },
  { id: 8, street: '505 Walnut Dr', city: 'Tokyo', state: 'Tokyo Prefecture', zipCode: '100-0001' },
  { id: 9, street: '606 Cherry Cir', city: 'Sydney', state: 'NSW', zipCode: '2000' },
  { id: 10, street: '707 Aspen Ct', city: 'São Paulo', state: 'SP', zipCode: '01000-000' },
  { id: 11, street: '808 Poplar St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
  {
    id: 12,
    street: '909 Magnolia Pl',
    city: 'Cairo',
    state: 'Cairo Governorate',
    zipCode: '11511'
  },
  { id: 13, street: '111 Willow Pkwy', city: 'Cape Town', state: 'Western Cape', zipCode: '8001' },
  { id: 14, street: '222 Redwood St', city: 'Moscow', state: 'Moscow', zipCode: '101000' },
  {
    id: 15,
    street: '333 Dogwood Rd',
    city: 'Madrid',
    state: 'Community of Madrid',
    zipCode: '28001'
  },
  { id: 16, street: '444 Spruce Ave', city: 'Rome', state: 'Lazio', zipCode: '00100' },
  { id: 17, street: '555 Sycamore Rd', city: 'Beijing', state: 'Beijing', zipCode: '100000' },
  { id: 18, street: '666 Palm St', city: 'Mexico City', state: 'CDMX', zipCode: '01000' },
  { id: 19, street: '777 Cypress Ln', city: 'Seoul', state: 'Seoul', zipCode: '04524' },
  { id: 20, street: '888 Juniper Ct', city: 'Buenos Aires', state: 'CABA', zipCode: 'C1002' },
  { id: 21, street: '999 Elm St', city: 'Stockholm', state: 'Stockholm County', zipCode: '111 23' },
  {
    id: 22,
    street: '123 Chestnut Blvd',
    city: 'Amsterdam',
    state: 'North Holland',
    zipCode: '1012 WX'
  }
]
// (Représente la futur table en base de donnée)
export const addressCountryData: AddresseCountry[] = [
  { addressId: 1, countryId: 1 },
  { addressId: 2, countryId: 1 },
  { addressId: 3, countryId: 1 },
  { addressId: 4, countryId: 2 },
  { addressId: 5, countryId: 3 },
  { addressId: 6, countryId: 4 },
  { addressId: 7, countryId: 5 },
  { addressId: 8, countryId: 6 },
  { addressId: 9, countryId: 7 },
  { addressId: 10, countryId: 8 },
  { addressId: 11, countryId: 9 },
  { addressId: 12, countryId: 10 },
  { addressId: 13, countryId: 11 },
  { addressId: 14, countryId: 12 },
  { addressId: 15, countryId: 13 },
  { addressId: 16, countryId: 14 },
  { addressId: 17, countryId: 15 },
  { addressId: 18, countryId: 16 },
  { addressId: 19, countryId: 17 },
  { addressId: 20, countryId: 18 },
  { addressId: 21, countryId: 19 },
  { addressId: 22, countryId: 20 }
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