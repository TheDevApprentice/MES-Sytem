import { TableHeader } from "@renderer/components/tables"
import { TenantsType, Tenant, TenantsTypes } from '@renderer/mock/Types/startup'

export const tenantsTypeData: TenantsType[] = [
    {
        id: 1,
        name: TenantsTypes.company
    },
    {
        id: 2,
        name: TenantsTypes.holding
    }
]

export const headersTenantsType: TableHeader[] = [
    { text: 'Id', value: 'id', sortable: false, type: 'number' },
    { text: 'Name', value: 'name', sortable: false, type: 'text' }
]

export const tenantsData: Tenant[] = [
    {
        id: 1,
        name: 'Holding ABC',
        type: TenantsTypes.holding,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    },
    {
        id: 2,
        name: 'Compagny E .inc',
        type: TenantsTypes.company,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    },
    {
        id: 3,
        name: 'Compagny AABBCC .inc',
        type: TenantsTypes.company,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    }
]

export const headersTenants: TableHeader[] = [
    { text: 'Id', value: 'id', sortable: false, type: 'number' },
    { text: 'Name', value: 'name', sortable: false, type: 'text' },
    { text: 'Type', value: 'type', sortable: false, type: 'text' },
    { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' },
    { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
    { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]
