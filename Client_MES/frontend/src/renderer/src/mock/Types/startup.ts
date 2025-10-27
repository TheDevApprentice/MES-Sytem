export enum TenantsTypes {
    company = "company", 
    holding = "holding"
}

export type TenantsType = {
    id: number,
    name: TenantsTypes,
}
export type Tenant = {
    id: number,
    name: string,
    type: TenantsTypes,
    createdAt: string,
    updatedAt: string
}
