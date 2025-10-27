import type { TableHeader } from '@components/tables'

export type RevokedTenantMasterLicence = {
    id: number,
    licenceNumber: string,
    revokedDate: string,
    revokedTime: string,
    createdAt: string,
    updatedAt: string
}

export const revokedTenantMasterLicenceData: RevokedTenantMasterLicence[] = [

]

export const headersRevokedTenantMasterLicence: TableHeader[] = [
    { text: 'Id', value: 'id', sortable: false, type: 'number' },
    { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' },
    { text: 'Revoked Date', value: 'revokedDate', sortable: false, type: 'date' },
    { text: 'Revoked Time', value: 'revokedTime', sortable: false, type: 'time' },
    { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
    { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]
