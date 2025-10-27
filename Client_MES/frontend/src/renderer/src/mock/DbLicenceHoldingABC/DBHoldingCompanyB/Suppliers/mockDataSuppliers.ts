import type { TableHeader } from '@components/tables/types/types'
import { contractType } from '@renderer/mock/Types/types'

export type Supplier = {
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

export type SupplierAddress = {
  idSupplier: number
  idAddress: number
}

export type SupplierContact = {
  idSupplier: number
  idContact: number
}

// (Représente la futur table en base de donnée)
// Données mock inline des fournisseurs
export const supplierData: Supplier[] = [
  {
    id: 1,
    name: 'Fournisseur A',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 92,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 2,
    name: 'Fournisseur B',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 85,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 3,
    name: 'Fournisseur C',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 70,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 4,
    name: 'Fournisseur D',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 78,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 5,
    name: 'Fournisseur E',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 65,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 6,
    name: 'Fournisseur F',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 88,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 7,
    name: 'Fournisseur G',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 95,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 8,
    name: 'Fournisseur H',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 55,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 9,
    name: 'Fournisseur I',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 90,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 10,
    name: 'Fournisseur J',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 80,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 11,
    name: 'Fournisseur K',
    type: contractType.Supplier,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 60,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }
]

// (Représente la futur table en base de donnée)
export const supplierAddressData: SupplierAddress[] = [
  {
    idSupplier: 1,
    idAddress: 12
  },
  {
    idSupplier: 2,
    idAddress: 13
  },
  {
    idSupplier: 3,
    idAddress: 14
  },
  {
    idSupplier: 4,
    idAddress: 15
  },
  {
    idSupplier: 5,
    idAddress: 16
  },
  {
    idSupplier: 6,
    idAddress: 17
  },
  {
    idSupplier: 7,
    idAddress: 18
  },
  {
    idSupplier: 8,
    idAddress: 19
  },
  {
    idSupplier: 9,
    idAddress: 20
  },
  {
    idSupplier: 10,
    idAddress: 21
  },
  {
    idSupplier: 11,
    idAddress: 22
  }
]

// (Représente la futur table en base de donnée)
export const supplierContactData: SupplierContact[] = [
  {
    idSupplier: 1,
    idContact: 12
  },
  {
    idSupplier: 2,
    idContact: 13
  },
  {
    idSupplier: 3,
    idContact: 14
  },
  {
    idSupplier: 4,
    idContact: 15
  },
  {
    idSupplier: 5,
    idContact: 16
  },
  {
    idSupplier: 6,
    idContact: 17
  },
  {
    idSupplier: 7,
    idContact: 18
  },
  {
    idSupplier: 8,
    idContact: 19
  },
  {
    idSupplier: 9,
    idContact: 20
  },
  {
    idSupplier: 10,
    idContact: 21
  },
  {
    idSupplier: 11,
    idContact: 22
  }
]

export const headersSuppliers: TableHeader[] = [
  { text: 'Nom', value: 'name', sortable: true, width: '20%', type: 'text' },
  {
    text: 'Actif',
    value: 'active',
    sortable: true,
    type: 'status',
    width: '11%',
    activeDisplay: 'tag'
  },
  { text: '(%) Satisfaction', value: 'satisfaction', sortable: true, type: 'percentage' },
  { text: 'Cmd', value: 'ordersCount', sortable: true, type: 'number' },
  { text: 'Dernière cmd', value: 'lastOrder', sortable: true, type: 'date' },
  { text: 'Total dépensé', value: 'totalSpend', type: 'currency', sortable: true },
  { text: 'Région', value: 'region', sortable: true, type: 'text' }
]
