import type { TableHeader } from '@components/tables'

export type TenantAddress = {
    tenantId: number,
    addressId: number
}
export type TenantContact = {
    tenantId: number,
    contactId: number
}

export const tenantsAddressesData: TenantAddress[] = [
    {
        tenantId: 1,
        addressId: 1
    },
    {
        tenantId: 2,
        addressId: 2
    },
    {
        tenantId: 3,
        addressId: 3
    }
]

export const tenantsContactsData: TenantContact[] = [
    {
        tenantId: 1,
        contactId: 1
    },
    {
        tenantId: 2,
        contactId: 2
    },
    {
        tenantId: 3,
        contactId: 3
    }
]

export const headersTenantsAddresses: TableHeader[] = [
    { text: 'Tenant Id', value: 'tenantId', sortable: false, type: 'number' },
    { text: 'Address Id', value: 'addressId', sortable: false, type: 'number' }
]

export const headersTenantsContacts: TableHeader[] = [
    { text: 'Tenant Id', value: 'tenantId', sortable: false, type: 'number' },
    { text: 'Contact Id', value: 'contactId', sortable: false, type: 'number' }
]
