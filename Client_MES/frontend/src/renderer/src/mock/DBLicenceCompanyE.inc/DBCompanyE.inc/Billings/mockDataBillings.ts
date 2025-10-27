import type { TableHeader } from '@components/tables/types/types'
import { orders as ordersData } from './Orders/mockDataOrders'
import { Billing, BillingOrder } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
const billingsData: Billing[] = [
  { id: 1, date: '05/10/2025', total: 0 },
  { id: 2, date: '06/05/2025', total: 0 },
  { id: 3, date: '07/10/2025', total: 0 },
  { id: 4, date: '08/15/2025', total: 0 },
  { id: 5, date: '09/20/2025', total: 0 },
  { id: 6, date: '10/25/2025', total: 0 },
  { id: 7, date: '11/30/2025', total: 0 },
  { id: 8, date: '12/05/2025', total: 0 },
  { id: 9, date: '01/10/2026', total: 0 },
  { id: 10, date: '02/14/2026', total: 0 },
  { id: 11, date: '03/18/2026', total: 0 },
  { id: 12, date: '04/22/2026', total: 0 },
  { id: 13, date: '05/26/2026', total: 0 },
  { id: 14, date: '06/30/2026', total: 0 },
  { id: 15, date: '07/04/2026', total: 0 },
  { id: 16, date: '08/08/2026', total: 0 },
  { id: 17, date: '09/12/2026', total: 0 },
  { id: 18, date: '10/16/2026', total: 0 },
  { id: 19, date: '11/20/2026', total: 0 },
  { id: 20, date: '12/24/2026', total: 0 },
  { id: 21, date: '01/28/2027', total: 0 },
  { id: 22, date: '02/02/2027', total: 0 }
]

// (Représente la futur table en base de donnée)
export const billingOrders: BillingOrder[] = [
  // Assign 3 orders per billing
  { billingId: 1,  orderId: 1 },
  { billingId: 1,  orderId: 2 },
  { billingId: 1,  orderId: 3 },
  { billingId: 2,  orderId: 4 },
  { billingId: 2,  orderId: 5 },
  { billingId: 2,  orderId: 6 },
  { billingId: 3,  orderId: 7 },
  { billingId: 3,  orderId: 8 },
  { billingId: 3,  orderId: 9 },
  { billingId: 4,  orderId: 10 },
  { billingId: 4,  orderId: 11 },
  { billingId: 4,  orderId: 12 },
  { billingId: 5,  orderId: 13 },
  { billingId: 5,  orderId: 14 },
  { billingId: 5,  orderId: 15 },
  { billingId: 6,  orderId: 16 },
  { billingId: 6,  orderId: 17 },
  { billingId: 6,  orderId: 18 },
  { billingId: 7,  orderId: 19 },
  { billingId: 7,  orderId: 20 },
  { billingId: 7,  orderId: 21 },
  { billingId: 8,  orderId: 22 },
  { billingId: 8,  orderId: 23 },
  { billingId: 8,  orderId: 24 },
  { billingId: 9,  orderId: 25 },
  { billingId: 9,  orderId: 26 },
  { billingId: 9,  orderId: 27 },
  { billingId: 10, orderId: 28 },
  { billingId: 10, orderId: 29 },
  { billingId: 10, orderId: 30 },
  { billingId: 11, orderId: 31 },
  { billingId: 11, orderId: 32 },
  { billingId: 11, orderId: 33 },
  { billingId: 12, orderId: 34 },
  { billingId: 12, orderId: 35 },
  { billingId: 12, orderId: 36 },
  { billingId: 13, orderId: 37 },
  { billingId: 13, orderId: 38 },
  { billingId: 13, orderId: 39 },
  { billingId: 14, orderId: 40 },
  { billingId: 14, orderId: 41 },
  { billingId: 14, orderId: 42 },
  { billingId: 15, orderId: 43 },
  { billingId: 15, orderId: 44 },
  { billingId: 15, orderId: 45 },
  { billingId: 16, orderId: 46 },
  { billingId: 16, orderId: 47 },
  { billingId: 16, orderId: 48 },
  { billingId: 17, orderId: 49 },
  { billingId: 17, orderId: 50 },
  { billingId: 17, orderId: 51 },
  { billingId: 18, orderId: 52 },
  { billingId: 18, orderId: 53 },
  { billingId: 18, orderId: 54 },
  { billingId: 19, orderId: 55 },
  { billingId: 19, orderId: 56 },
  { billingId: 19, orderId: 57 },
  { billingId: 20, orderId: 58 },
  { billingId: 20, orderId: 59 },
  { billingId: 20, orderId: 60 },
  { billingId: 21, orderId: 61 },
  { billingId: 21, orderId: 62 },
  { billingId: 21, orderId: 63 },
  { billingId: 22, orderId: 64 },
  { billingId: 22, orderId: 65 },
  { billingId: 22, orderId: 66 }
]

function calculateBillingTotal(billing: Billing) {
  // pour la facture on va chercher les commandes correspondantes via la table de jointure billingOrders
  const orders = billingOrders.filter(order => order.billingId === billing.id);
  // et on retourne le calcul du total basé la somme des cost des commandes relié à une facture
  return orders.reduce((total, order) => total + ordersData[order.orderId - 1].cost, 0);
}

export const billings: Billing[] = billingsData.map(billing => ({
  ...billing,
  total: parseFloat(calculateBillingTotal(billing).toPrecision(2))
}));
console.log("billings", billings);

export const headersBillings: TableHeader[] = [
  { text: 'Nom', value: 'contractName', sortable: false, type: 'text' },
  { text: 'Type', value: 'contractType', sortable: false, type: 'text' },
  { text: 'Nb Orders', value: 'nbOrders', sortable: true, type: 'number' },
  { text: 'Date', value: 'date', sortable: true, type: 'date' },
  { text: 'Total', value: 'total', sortable: true, type: 'currency' }
]

export const headersBillingOrders: TableHeader[] = [
  { text: 'BillingId', value: 'billingId', sortable: false, type: 'number' },
  { text: 'OrderId', value: 'orderId', sortable: false, type: 'number' }
]