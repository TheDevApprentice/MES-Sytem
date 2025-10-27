import { TableHeader } from "@renderer/components/tables"
import { Contract, contractType } from "@renderer/mock/Types/types"


 
// Table de jointure "Contract" :
// Permet de lier chaque facture (billingId) à un contractant (client ou fournisseur, contractId) en précisant le type (client/supplier).
// Cette structure rend explicite la distinction client/fournisseur sur les factures et permet d'étendre facilement à des cas plus complexes :
// - Plusieurs factures pour un même client ou fournisseur
// - Groupements, contrats mixtes ou évolutions futures
// - Agrégation et filtrage simplifiés côté API/UI
// (Représente la futur table en base de donnée)
export const contractData: Contract[] = [
  // Clients
  { contractId: 1, billingId: 1, type: contractType.Client },
  { contractId: 2, billingId: 2, type: contractType.Client },
  { contractId: 3, billingId: 3, type: contractType.Client },
  { contractId: 4, billingId: 4, type: contractType.Client },
  { contractId: 5, billingId: 5, type: contractType.Client },
  { contractId: 6, billingId: 6, type: contractType.Client },
  { contractId: 7, billingId: 7, type: contractType.Client },
  { contractId: 8, billingId: 8, type: contractType.Client },
  { contractId: 9, billingId: 9, type: contractType.Client },
  { contractId: 10, billingId: 10, type: contractType.Client },
  { contractId: 11, billingId: 11, type: contractType.Client },
  // Fournisseurs
  { contractId: 1, billingId: 12, type: contractType.Supplier },
  { contractId: 2, billingId: 13, type: contractType.Supplier },
  { contractId: 3, billingId: 14, type: contractType.Supplier },
  { contractId: 4, billingId: 15, type: contractType.Supplier },
  { contractId: 5, billingId: 16, type: contractType.Supplier },
  { contractId: 6, billingId: 17, type: contractType.Supplier },
  { contractId: 7, billingId: 18, type: contractType.Supplier },
  { contractId: 8, billingId: 19, type: contractType.Supplier },
  { contractId: 9, billingId: 20, type: contractType.Supplier },
  { contractId: 10, billingId: 21, type: contractType.Supplier },
  { contractId: 11, billingId: 22, type: contractType.Supplier }
]

export const headersContracts: TableHeader[] = [
  { text: 'ContractId', value: 'contractId', sortable: false, type: 'number' },
  { text: 'BillingId', value: 'billingId', sortable: false, type: 'number' },
  { text: 'Type', value: 'type', sortable: false, type: 'text' }
]
