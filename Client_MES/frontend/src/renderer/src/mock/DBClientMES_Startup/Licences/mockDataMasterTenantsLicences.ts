import type { TableHeader } from '@components/tables'

export type MasterLicence = {
    id: number // primary key
    masterLicenceNumber: string 
    productLicenceId: number
    startDate: string
    endDate: string
    maxUserLicences: number
    userLicencesNb: number
    active: boolean
    createdAt: string,
    updatedAt: string
}

export type TenantMasterLicence = {
    tenantId: number,
    masterLicenceId: number,
}

export const masterLicenceData: MasterLicence[] = [
    {
        id: 1,
        productLicenceId: 1,
        masterLicenceNumber: '1234567891',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        maxUserLicences: 10,
        userLicencesNb: 1,
        active: true,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    },
    {
        id: 2,
        productLicenceId: 2,
        masterLicenceNumber: '1011121314',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        maxUserLicences: 10,
        userLicencesNb: 1,
        active: true,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    },
    {
        id: 3,
        productLicenceId: 3,
        masterLicenceNumber: '1516171819',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        maxUserLicences: 10,
        userLicencesNb: 1,
        active: true,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01'
    }
]

export const tenantMasterLicenceData: TenantMasterLicence[] = [
    {
        tenantId: 1,
        masterLicenceId: 1,
    },
    {
        tenantId: 2,
        masterLicenceId: 2,
    },
    {
        tenantId: 3,
        masterLicenceId: 3,
    }
]

export const headersTenantLicence: TableHeader[] = [
    { text: 'Tenant Id', value: 'tenantId', sortable: false, type: 'number' },
    { text: 'Master Licence Number', value: 'masterLicenceNumber', sortable: false, type: 'text' },
    { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
    { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]

export const headersMasterLicence: TableHeader[] = [
    { text: 'Id', value: 'id', sortable: false, type: 'number' },
    { text: 'Product Licence Id', value: 'productLicenceId', sortable: false, type: 'number' },
    { text: 'Master Licence Number', value: 'masterLicenceNumber', sortable: false, type: 'text' },
    { text: 'Start Date', value: 'startDate', sortable: false, type: 'date' },
    { text: 'End Date', value: 'endDate', sortable: false, type: 'date' },
    { text: 'Max User Licences', value: 'maxUserLicences', sortable: false, type: 'number' },
    { text: 'Active', value: 'active', sortable: false, type: 'boolean' }
]
