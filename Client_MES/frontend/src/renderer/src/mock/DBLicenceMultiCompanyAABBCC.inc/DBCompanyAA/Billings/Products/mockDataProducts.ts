import type { TableHeader } from '@components/tables/types/types'
import { Product, ProductType } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const productTypes: ProductType[] = [
  { id: 1, name: 'Matière première' },
  { id: 2, name: 'Composant' },
  { id: 3, name: 'Produit fini' },
  { id: 4, name: 'Consommable' },
  { id: 5, name: 'Outillage' },
  { id: 6, name: 'Service' }
]

// (Représente la futur table en base de donnée)
export const products: Product[] = [
  // Secteur général
  { id: 1, name: 'Acier en bobine', discount: 5, price: 1200, productTypeId: 1 },
  { id: 2, name: 'Granulés plastiques', discount: 0, price: 950, productTypeId: 1 },
  { id: 3, name: 'Vis M8x40', discount: 0, price: 0.05, productTypeId: 2 },
  { id: 4, name: 'Moteur asynchrone 5kW', discount: 2, price: 350, productTypeId: 2 },
  { id: 5, name: 'Armoire électrique assemblée', discount: 10, price: 2200, productTypeId: 3 },
  { id: 6, name: 'Palan électrique', discount: 0, price: 800, productTypeId: 5 },
  { id: 7, name: 'Gants de protection', discount: 0, price: 2.5, productTypeId: 4 },
  { id: 8, name: 'Lubrifiant industriel', discount: 3, price: 35, productTypeId: 4 },
  { id: 9, name: 'Tournevis dynamométrique', discount: 5, price: 48, productTypeId: 5 },
  { id: 10, name: 'Module automate programmable', discount: 0, price: 410, productTypeId: 2 },
  // Microélectronique
  { id: 11, name: 'Wafer silicium 200mm', discount: 0, price: 75, productTypeId: 1 },
  { id: 12, name: 'Résine photosensible', discount: 2, price: 180, productTypeId: 4 },
  { id: 13, name: 'Circuit intégré CMOS', discount: 5, price: 2.1, productTypeId: 3 },
  { id: 14, name: 'Sonde de test wafer', discount: 0, price: 12, productTypeId: 5 },
  { id: 15, name: 'Plaquette d’aluminium gravée', discount: 0, price: 22, productTypeId: 3 },
  // Chaudronnerie
  { id: 16, name: 'Tôle acier 3mm', discount: 3, price: 80, productTypeId: 1 },
  { id: 17, name: 'Tube inox 40x2', discount: 0, price: 55, productTypeId: 1 },
  { id: 18, name: 'Bride PN16 DN80', discount: 0, price: 24, productTypeId: 2 },
  { id: 19, name: 'Machine à souder TIG', discount: 10, price: 1900, productTypeId: 5 },
  { id: 20, name: 'Réservoir acier 500L', discount: 8, price: 850, productTypeId: 3 },
  // Automobile
  { id: 21, name: 'Pneu 205/55 R16', discount: 5, price: 65, productTypeId: 3 },
  { id: 22, name: 'Huile moteur 5W30', discount: 2, price: 28, productTypeId: 4 },
  { id: 23, name: 'Bougie d’allumage', discount: 0, price: 7, productTypeId: 2 },
  { id: 24, name: 'Capteur ABS', discount: 0, price: 42, productTypeId: 2 },
  { id: 25, name: 'Bloc moteur assemblé', discount: 15, price: 2100, productTypeId: 3 },
  // Agroalimentaire
  { id: 26, name: 'Farine de blé T55', discount: 0, price: 0.6, productTypeId: 1 },
  { id: 27, name: 'Bidon huile végétale 10L', discount: 5, price: 25, productTypeId: 1 },
  { id: 28, name: 'Biscuit emballé', discount: 3, price: 0.25, productTypeId: 3 },
  { id: 29, name: 'Gant alimentaire jetable', discount: 0, price: 0.04, productTypeId: 4 },
  { id: 30, name: 'Mélangeur industriel', discount: 10, price: 1300, productTypeId: 5 },
  // Pharmaceutique
  { id: 31, name: 'Flacon verre 100ml', discount: 0, price: 0.18, productTypeId: 2 },
  { id: 32, name: 'Comprimé paracétamol', discount: 2, price: 0.03, productTypeId: 3 },
  { id: 33, name: 'Alcool isopropylique 99%', discount: 0, price: 4.5, productTypeId: 4 },
  { id: 34, name: 'Capsule gélatine', discount: 1, price: 0.02, productTypeId: 2 },
  { id: 35, name: 'Pilulier automatique', discount: 8, price: 295, productTypeId: 5 },
  // Aéronautique
  { id: 36, name: 'Rivet titane 4x10', discount: 0, price: 0.9, productTypeId: 2 },
  { id: 37, name: 'Tôle aluminium aviation', discount: 3, price: 145, productTypeId: 1 },
  { id: 38, name: 'Train d’atterrissage', discount: 12, price: 7800, productTypeId: 3 },
  { id: 39, name: 'Joint torique fluoré', discount: 0, price: 2.2, productTypeId: 2 },
  { id: 40, name: 'Détecteur de fuite carburant', discount: 0, price: 320, productTypeId: 5 }
]

export const headersProducts: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Nom', value: 'name', sortable: false, type: 'text' },
  { text: 'Réduction', value: 'discount', sortable: false, type: 'percentage' },
  { text: 'Prix', value: 'price', sortable: true, type: 'currency' },
  { text: 'Type', value: 'productTypeId', sortable: false, type: 'text' }
]
