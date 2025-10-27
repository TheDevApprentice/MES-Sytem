import type { TableHeader } from '@components/tables/types/types'
import { LicencePermission, LicenceRole, Permission, Role } from '@renderer/mock/Types/types'

export type LicenceType = {
  id: number
  name: string
}

export type Licence = {
  licenceNumber: string // primary key
  startDate: string
  endDate: string
  active?: boolean | null
  revokedDate?: string
  revokedTime?: string
  effectiveTimeUserAllowedAfterRevocation?: string
}

export type LicenceLicenseType = {
  licenceNumber: string
  licenceTypeId: number
}
export type UserLicence = {
  userId: number
  licenceNumber: string
}

export const licenceTypeData: LicenceType[] = [
  {
    id: 1,
    name: 'Master'
  },
  {
    id: 2,
    name: 'User'
  }
]

export const licenceData: Licence[] = [
  {
    licenceNumber: '1011121314',  // Master licence
    startDate: '2022-01-01',
    endDate: '2022-12-31'
  },
  {
    licenceNumber: '10111213141233233233', // la licence user est une enfant de la master, les entreprises on un nombre de licence qu'elles achete qui leur permet de créer des utilisateur = une licence par user
    startDate: '2022-01-01',
    endDate: '2022-12-31',
    active: true // Seul les licence user peuvent être marqué active car les licence master sont géré par la startup et l'activer ou le desactiver n'a aucune incidence dans le code car pour ce type de licence ce n'est pas pris en compte dans la logique volontairement
  }
]

export const userLicenceData: UserLicence[] = [
  {
    userId: 1,
    licenceNumber: '10111213141233233233'
  }
]

export const licenceRevokedData: Licence[] = [
  // l'entreprise peut revoke l'accès à un employé (user) si elle le veut sans supprimer l'user de la base de donnée, si l'entreprise veut libérer la licence elle devras supprimer l'user
]

export const licenceLicenseTypeData: LicenceLicenseType[] = [
  {
    licenceNumber: '1234567891', // Master licence
    licenceTypeId: 1
  },
  {
    licenceNumber: '12345678911233233233', // User licence
    licenceTypeId: 2
  }
]

export const licenceRoleData: LicenceRole[] = [
  {
    licenceNumber: '12345678911233233233',
    roleId: 1
  }
]

export const licencePermissionData: LicencePermission[] = [
  {
    licenceNumber: '12345678911233233233',
    permissionId: 1
  }
]

export const rolesData: Role[] = [
  {
    id: 1,
    name: 'admin'
  },
  {
    id: 2,
    name: 'user'
  },
  {
    id: 3,
    name: 'support'
  },
  {
    id: 4,
    name: 'technician'
  }
]

export const permissionsData: Permission[] = [
  {
    id: 1,
    name: 'all'
  },
  {
    id: 2,
    name: 'read'
  },
  {
    id: 3,
    name: 'write'
  },
  {
    id: 4,
    name: 'delete'
  }
]

export const headersLicenceType: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Name', value: 'name', sortable: false, type: 'text' }
]

export const headersLicence: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' },
  { text: 'Type', value: 'type', sortable: false, type: 'text' },
  { text: 'Start Date', value: 'startDate', sortable: false, type: 'date' },
  { text: 'End Date', value: 'endDate', sortable: false, type: 'date' },
  { text: 'Active', value: 'active', sortable: false, type: 'boolean' }
]

export const headersUserLicence: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'User Id', value: 'userId', sortable: false, type: 'number' },
  { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' }
]

export const headersLicenceRevoked: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' },
  { text: 'User Id', value: 'userId', sortable: false, type: 'number' },
  { text: 'Revoked Date', value: 'revokedDate', sortable: false, type: 'date' },
  { text: 'Revoked Time', value: 'revokedTime', sortable: false, type: 'time' },
  {
    text: 'Effective Time User Allowed After Revocation',
    value: 'effectiveTimeUserAllowedAfterRevocation',
    sortable: false,
    type: 'time'
  }
]

export const headersLicenceRole: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' },
  { text: 'Role Id', value: 'roleId', sortable: false, type: 'number' }
]

export const headersLicencePermission: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Licence Number', value: 'licenceNumber', sortable: false, type: 'text' },
  { text: 'Permission Id', value: 'permissionId', sortable: false, type: 'number' }
]
