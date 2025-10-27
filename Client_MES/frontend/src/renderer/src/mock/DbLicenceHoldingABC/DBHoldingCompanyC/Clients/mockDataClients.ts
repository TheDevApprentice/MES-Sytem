import type { TableHeader } from '@components/tables/types/types'
import { Client, ClientAddress, ClientContact, contractType } from '@renderer/mock/Types/types'


// Données mock inline des fournisseurs (Représente la futur table en base de donnée)
export const clientData: Client[] = [
  {
    id: 1,
    name: 'Client A',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 92,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 2,
    name: 'Client B',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 85,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 3,
    name: 'Client C',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 70,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 4,
    name: 'Client D',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 78,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 5,
    name: 'Client E',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 65,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 6,
    name: 'Client F',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 88,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 7,
    name: 'Client G',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 95,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 8,
    name: 'Client H',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 55,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 9,
    name: 'Client I',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 90,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 10,
    name: 'Client J',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: true,
    satisfaction: 80,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 11,
    name: 'Client K',
    type: contractType.Client,
    image:
      'https://img.freepik.com/vecteurs-premium/illustration-logo-vectoriel-dans-style-colore-degrade-entreprise_116762-2527.jpg?semt=ais_hybrid&w=740',
    active: false,
    satisfaction: 60,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }
]

// (Représente la futur table en base de donnée)
export const clientAddressData: ClientAddress[] = [
  {
    idClient: 1,
    idAddress: 1
  },
  {
    idClient: 2,
    idAddress: 2
  },
  {
    idClient: 3,
    idAddress: 3
  },
  {
    idClient: 4,
    idAddress: 4
  },
  {
    idClient: 5,
    idAddress: 5
  },
  {
    idClient: 6,
    idAddress: 6
  },
  {
    idClient: 7,
    idAddress: 7
  },
  {
    idClient: 8,
    idAddress: 8
  },
  {
    idClient: 9,
    idAddress: 9
  },
  {
    idClient: 10,
    idAddress: 10
  },
  {
    idClient: 11,
    idAddress: 11
  }
]

// (Représente la futur table en base de donnée)
export const clientContactData: ClientContact[] = [
  {
    idClient: 1,
    idContact: 1
  },
  {
    idClient: 2,
    idContact: 2
  },
  {
    idClient: 3,
    idContact: 3
  },
  {
    idClient: 4,
    idContact: 4
  },
  {
    idClient: 5,
    idContact: 5
  },
  {
    idClient: 6,
    idContact: 6
  },
  {
    idClient: 7,
    idContact: 7
  },
  {
    idClient: 8,
    idContact: 8
  },
  {
    idClient: 9,
    idContact: 9
  },
  {
    idClient: 10,
    idContact: 10
  },
  {
    idClient: 11,
    idContact: 11
  }
]

export const headersClients: TableHeader[] = [
  { text: 'Nom', value: 'name', sortable: true, width: '20%', type: 'text' },
  {
    text: 'Actif',
    value: 'active',
    sortable: true,
    type: 'status',
    width: '11%',
    activeDisplay: 'tag'
  },
  { text: 'Satisfaction (%)', value: 'satisfaction', sortable: true, type: 'percentage' },
  { text: 'Commandes', value: 'ordersCount', sortable: true, type: 'number' },
  { text: 'Dernière commande', value: 'lastOrder', sortable: true, type: 'date' },
  { text: 'Total dépensé', value: 'totalSpend', type: 'currency', sortable: true },
  { text: 'Région', value: 'region', sortable: true, type: 'text' }
]
