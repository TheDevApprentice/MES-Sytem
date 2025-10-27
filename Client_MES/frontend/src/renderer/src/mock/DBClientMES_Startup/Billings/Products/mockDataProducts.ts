import { TableHeader } from "@renderer/components/tables"

export enum ProductLicenceType {
    company = 'company',
    holding = 'holding',
    multiCompany = 'multiCompany'
}

export type ProductLicence = {
    id: number,
    name: ProductLicenceType,
    price: number,
    createdAt: string,
    updatedAt: string
}

export const productLicenceData: ProductLicence[] = [
    {
        id: 1,
        name: ProductLicenceType.company,
        price: 10,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    },
    {
        id: 2,
        name: ProductLicenceType.holding,
        price: 20,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    },
    {
        id: 3,
        name: ProductLicenceType.multiCompany,
        price: 30,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    }
]

export const headersProductLicence: TableHeader[] = [
    { text: 'Id', value: 'id', sortable: false, type: 'number' },
    { text: 'Name', value: 'name', sortable: false, type: 'text' },
    { text: 'Price', value: 'price', sortable: false, type: 'number' },
    { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
    { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]