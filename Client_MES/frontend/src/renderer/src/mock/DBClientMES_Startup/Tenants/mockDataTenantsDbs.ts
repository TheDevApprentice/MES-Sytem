import { TableHeader } from "@renderer/components/tables"

export type TenantDatabase = {
    tenantId: number,
    dbId: number
}

export type TenantDatabaseInformations = {
    id: number,
    url: string,
    port: number,
    databaseName: string,
    username: string,
    password: string
}

export const tenantsDbsData: TenantDatabase[] = [
    {
        tenantId: 1,
        dbId: 1
    },
    {
        tenantId: 1,
        dbId: 2
    },
    {
        tenantId: 1,
        dbId: 3
    },
    {
        tenantId: 1,
        dbId: 4
    },
    {
        tenantId: 2,
        dbId: 5
    },
    {
        tenantId: 2,
        dbId: 6
    },
    {
        tenantId: 3,
        dbId: 7
    },
    {
        tenantId: 3,
        dbId: 8
    },
    {
        tenantId: 3,
        dbId: 9
    },
    {
        tenantId: 3,
        dbId: 10
    }
]

export const tenantsDatabasesData: TenantDatabaseInformations[] = [
    {
        id: 1,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbHoldingCompanyA',
        username: 'root',
        password: 'root'
    },
    {
        id: 2,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbHoldingCompanyB',
        username: 'root',
        password: 'root'
    },
    {
        id: 3,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbHoldingCompanyC',
        username: 'root',
        password: 'root'
    },
    {
        id: 4,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbMasterHoldingCompanyABC',
        username: 'root',
        password: 'root'
    },
    {
        id: 5,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbCompanyE',
        username: 'root',
        password: 'root'
    },
    {
        id: 6,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbMasterCompanyE',
        username: 'root',
        password: 'root'
    },
    {
        id: 7,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbCompanyAA',
        username: 'root',
        password: 'root'
    },
    {
        id: 8,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbCompanyBB',
        username: 'root',
        password: 'root'
    },
    {
        id: 9,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbCompanyCC',
        username: 'root',
        password: 'root'
    },
    {
        id: 10,
        url: 'localhost',
        port: 3306,
        databaseName: 'DbMasterCompagnyAABBCC',
        username: 'root',
        password: 'root'
    }
]

export const headersTenantsDbs: TableHeader[] = [
    { text: 'Tenant Id', value: 'tenantId', sortable: false, type: 'number' },
    { text: 'DB Id', value: 'dbId', sortable: false, type: 'number' }
]