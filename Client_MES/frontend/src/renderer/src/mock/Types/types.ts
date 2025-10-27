export type User = {
    id: number,
    name: string,
    username: string,
    email: string,
    password: string, // temporaire le temps de test mock et création de l'authentification api cloud central
    role?: Role,
    permissions?: Permission[],
}
export type Role = {
    id: number,
    name: string,
}

export type Permission = {
    id: number,
    name: string,
}
export type LicenceRole = {
    licenceNumber: string,
    roleId: number,
}

export type LicencePermission = {
    licenceNumber: string,
    permissionId: number,
}

export type Address = {
    id: number
    street: string
    city: string
    state: string
    zipCode: string
    country?: string
    region?: string
  }
  
  export type AddresseCountry = {
    addressId: number
    countryId: number
  }

  export type Country = {
    id: number
    name: string
    region?: string // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
  }
  
  export type CountryRegion = {
    countryId: number
    regionId: number
  }

  export type Region = {
    id: number
    name: string
  }
  


  export type Order = {
    id: number
    contractName?: string // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    contractType?: contractType // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    name: string
    date: string
    cost: number
  }
  
  export type OrderLine = {
    id: number
    orderId: number
    productId: number
    price?: number
    quantity: number
    discount: number | null
    total: number
  }

  export type Product = {
    id: number
    name: string
    discount: number | null
    price: number
    productTypeId: number
  }
  
  export type ProductType = {
    id: number
    name: string
  }

  export type Billing = {
    id: number
    contractName?: string // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    contractType?: contractType // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    nbOrders?: number // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    date: string
    total: number
  }
  
  export type BillingOrder = {
    billingId: number
    orderId: number
  }

  export enum contractType {
    Client = 'client',
    Supplier = 'supplier',
  }
  
  export type Contract = {
    contractId: number
    billingId: number
    type: contractType
  }
  
  export type Client = {
    id: number
    name: string
    type: contractType
    image: string
    active: boolean
    satisfaction: number
    ordersCount?: number // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    lastOrder?: string // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    totalSpend?: number // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    region?: string // champs présent car dans la logique futur l'info en string sera présent dans la donnée recu de l'api
    createdAt: string
    updatedAt: string
  }
  
  export type ClientAddress = {
    idClient: number
    idAddress: number
  }
  
  export type ClientContact = {
    idClient: number
    idContact: number
  }

  export type Contact = {
    id: number
    name: string
    emailsId: number[]
    phonesId: number[]
    createdAt: string
    updatedAt: string
  }

  export type Email = {
    id: number
    email: string
    createdAt: string
    updatedAt: string
  }
  

  
export type Phone = {
    id: number
    number: string
    createdAt: string
    updatedAt: string
  }