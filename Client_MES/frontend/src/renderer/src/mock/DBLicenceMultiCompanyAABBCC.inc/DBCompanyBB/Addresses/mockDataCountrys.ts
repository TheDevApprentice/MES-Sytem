import { TableHeader } from "@renderer/components/tables"
import { Country, CountryRegion } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const countryData: Country[] = [
  { id: 1, name: 'USA' },
  { id: 2, name: 'Canada' },
  { id: 3, name: 'UK' },
  { id: 4, name: 'France' },
  { id: 5, name: 'Germany' },
  { id: 6, name: 'Japan' },
  { id: 7, name: 'Australia' },
  { id: 8, name: 'Brazil' },
  { id: 9, name: 'India' },
  { id: 10, name: 'Egypt' },
  { id: 11, name: 'South Africa' },
  { id: 12, name: 'Russia' },
  { id: 13, name: 'Spain' },
  { id: 14, name: 'Italy' },
  { id: 15, name: 'China' },
  { id: 16, name: 'Mexico' },
  { id: 17, name: 'South Korea' },
  { id: 18, name: 'Argentina' },
  { id: 19, name: 'Sweden' },
  { id: 20, name: 'Netherlands' }
]

// (Représente la futur table en base de donnée)
export const countryRegionData: CountryRegion[] = [
  { countryId: 1, regionId: 1 },
  { countryId: 2, regionId: 1 },
  { countryId: 3, regionId: 2 },
  { countryId: 4, regionId: 2 },
  { countryId: 5, regionId: 2 },
  { countryId: 6, regionId: 3 },
  { countryId: 7, regionId: 4 },
  { countryId: 8, regionId: 5 },
  { countryId: 9, regionId: 3 },
  { countryId: 10, regionId: 6 },
  { countryId: 11, regionId: 6 },
  { countryId: 12, regionId: 2 },
  { countryId: 13, regionId: 2 },
  { countryId: 14, regionId: 2 },
  { countryId: 15, regionId: 3 },
  { countryId: 16, regionId: 1 },
  { countryId: 17, regionId: 3 },
  { countryId: 18, regionId: 5 },
  { countryId: 19, regionId: 2 },
  { countryId: 20, regionId: 2 }
]

export const headersCountries: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Name', value: 'name', sortable: false, type: 'text' },
  { text: 'Region', value: 'region', sortable: false, type: 'text' }
]

