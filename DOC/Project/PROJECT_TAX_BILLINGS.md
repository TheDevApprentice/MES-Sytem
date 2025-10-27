 # Projet ERP Industriel – Architecture et Gouvernance de la Gestion des Taxes Internationales

## Table des matières

1. Introduction générale
2. Problématique métier et enjeux
3. Glossaire et définitions
4. Analyse métier détaillée
5. Cartographie des cas d’usage (scénarios monde réel)
6. Questions/réponses (FAQ métier et technique)
7. Modélisation des données (schémas, mapping, justification)
8. Logique métier et algorithmes de résolution fiscale
9. API, UI/UX et intégration
10. Stratégies d’extension, migration, audit, sécurité
11. Exemples de données, requêtes, scénarios utilisateur
12. Liens et mapping avec tous les fichiers mock du projet
13. Conseils d’implémentation, bonnes pratiques, pièges à éviter
14. Annexes (schémas, tables, extraits de code, etc.)

---

## 1. Introduction générale

L’objectif de ce document est de fournir un guide de référence exhaustif pour la conception, l’implémentation et la maintenance d’un module de gestion des taxes dans un ERP industriel international. Il s’adresse à toute personne impliquée dans le projet : architectes, développeurs backend/frontend, décideurs métier, auditeurs, intégrateurs, etc.

La gestion des taxes est l’un des aspects les plus complexes et critiques d’un ERP industriel : elle conditionne la conformité légale, la crédibilité de l’entreprise, et la robustesse des processus de facturation et de reporting. Ce document vise à couvrir toutes les dimensions du sujet, du métier à la technique, du schéma de base de données à l’API, en passant par l’UX, l’audit, la migration et la sécurité.

---

## 2. Problématique métier et enjeux

### 2.1. Complexité de la fiscalité mondiale

- Diversité des taxes (TVA, sales tax, GST, éco-taxes, droits d’accise, etc.).
- Variabilité des règles : par pays, région, type de produit, client, usage, canal, etc.
- Exceptions, exonérations, autoliquidation, taux réduits, franchises, seuils, etc.
- Évolutions fréquentes (changements de taux, nouvelles lois, Brexit, etc.).
- Risques : non-conformité, redressement, erreur de facturation, perte de crédibilité, perte financière.

### 2.2. Objectifs d’un module fiscal moderne

- Couvrir tous les cas, du plus simple au plus extrême.
- Permettre l’extension sans refonte (nouvelles taxes, nouveaux pays, nouvelles exceptions).
- Garantir la traçabilité (audit, justification du taux appliqué à chaque ligne, historique).
- Permettre la simulation, la validation, l’édition, le reporting.
- S’intégrer naturellement avec le reste du SI (commandes, factures, produits, clients, fournisseurs, etc.).

### 2.3. Questions clés (exemples)

- Comment modéliser les règles fiscales pour couvrir tous les cas (TVA, sales tax, éco-taxes, etc.) ?
- Comment lier dynamiquement une ligne de commande à la bonne règle fiscale selon le contexte (produit, client, pays, date, etc.) ?
- Comment gérer l’évolution des taux et la traçabilité ?
- Comment permettre l’extension future (nouvelles taxes, zones, exceptions) sans refonte ?
- Comment articuler cette logique avec la structure actuelle du projet ([voir fichiers mockData...ts](#12-liens-et-mapping-avec-tous-les-fichiers-mock-du-projet)) ?

---

## 3. Glossaire et définitions

- **Taxe** : prélèvement obligatoire (TVA, sales tax, etc.).
- **Règle fiscale (TaxRule)** : ensemble de conditions permettant de déterminer le taux/la taxe applicable à une transaction.
- **TaxType** : nature de la taxe (TVA, sales tax, éco-taxe, etc.).
- **Zone économique** : regroupement de pays (UE, NAFTA, etc.).
- **Exonération** : cas où la taxe ne s’applique pas.
- **Autoliquidation** : mécanisme où le client déclare la taxe à la place du fournisseur.
- **OrderLineTax** : taxes effectivement appliquées à une ligne de commande/facture.
- **Franchise en base** : régime où l’entreprise ne collecte pas la TVA si son CA est sous un certain seuil.
- **Taux historique** : taux applicable à une date donnée, même si le taux courant a changé.
- **Priorité de règle** : permet de départager plusieurs règles applicables.
- **Audit fiscal** : capacité à justifier, a posteriori, chaque taux appliqué.

---

## 4. Analyse métier détaillée

### 4.1. Critères d’application des taxes (détaillés)

- **Pays d’origine, de destination, de facturation, de livraison** : chaque dimension peut influencer la taxe applicable.
- **Région/zone économique** (UE, DOM-TOM, NAFTA, etc.) : certaines règles sont supranationales.
- **Type de client** (B2B, B2C, administration, association, etc.) : impacts sur le taux, l’exonération, l’autoliquidation.
- **Type de fournisseur** (local, UE, hors UE, etc.) : important pour l’import/export.
- **Type de produit/service** (biens, services, numériques, alimentaires, etc.) : chaque catégorie peut avoir ses propres taux/exceptions.
- **Usage du produit** (revente, usage final, transformation, etc.) : certaines exonérations dépendent de l’usage.
- **Date de la transaction** (gestion des taux historiques).
- **Montant, seuils, franchises, quantités** : certains taux/exonérations dépendent du volume.
- **Statut fiscal du client/fournisseur** (assujetti, non assujetti, franchise en base, etc.).
- **Exceptions locales, taxes cumulatives, taxes composées**.

#### 4.1.1. Mapping avec les fichiers mock actuels

- Les entités **Country** et **Region** sont modélisées dans [mockDataCountrys.ts](../../Client_MES/frontend/src/renderer/src/stores/mock/Addresses/mockDataCountrys.ts) et [mockDataRegions.ts](../../Client_MES/frontend/src/renderer/src/stores/mock/Addresses/mockDataRegions.ts).
- Les **Clients** et **Fournisseurs** sont dans [mockDataClients.ts](../../Client_MES/frontend/src/renderer/src/stores/mock/Clients/mockDataClients.ts) et [mockDataSuppliers.ts](../../Client_MES/frontend/src/renderer/src/stores/mock/Suppliers/mockDataSuppliers.ts).
- La table de jointure **Contract** est dans [mockDataContract.ts](../../Client_MES/frontend/src/renderer/src/stores/mock/mockDataContract.ts).
- Les **produits** et leur typage sont à enrichir pour la catégorisation fiscale.

### 4.2. Exemples de cas réels (développés)

- **France → France, vente B2B** : TVA 20% (sauf exceptions, cf. produits à taux réduit).
- **France → Allemagne, B2B intra-UE** : autoliquidation (TVA 0%, mention obligatoire sur la facture).
- **France → Suisse, export hors UE** : TVA 0% (export), justificatif d’export requis.
- **USA, vente locale (Californie)** : sales tax 8.25% (peut varier selon la ville/comté).
- **Canada, vente locale** : GST + PST (taxes cumulatives).
- **France, produit alimentaire** : TVA 5,5% (ou 2,1% pour certains médicaments).
- **France, livre papier** : TVA 5,5%, livre numérique : TVA 20%.
- **Allemagne, franchise en base** : pas de TVA facturée si CA < seuil.
- **Afrique du Sud, VAT 15%, exonérations sur certains produits/services**.
- **Japon, consommation tax 10%, exceptions pour certains produits/services**.

#### 4.2.1. Cas extrêmes et cas limites

- **Multi-taxes** : produit soumis à TVA + éco-taxe + taxe locale.
- **Changement de taux en cours d’année** : gestion des taux historiques.
- **Franchise en base** : pas de TVA facturée si seuil non atteint.
- **Produit/service exonéré** : taux 0%, mention obligatoire.
- **Autoliquidation** : client déclare la taxe, fournisseur facture à 0%.
- **Cas d’erreur** : mauvaise règle appliquée, correction, avoir, audit.

### 4.3. Cartographie des cas d’usage (scénarios monde réel)

#### 4.3.1. Commande simple France-France B2B
- Client et fournisseur en France, produit standard.
- Résolution : TVA 20%, affichée sur la facture, collectée et reversée par le fournisseur.

#### 4.3.2. Commande intra-UE B2B
- Client France, fournisseur Allemagne, client assujetti et avec numéro de TVA intracom.
- Résolution : autoliquidation, TVA 0% sur la facture, mention obligatoire, client déclare la TVA.

#### 4.3.3. Export hors UE
- Client Suisse, fournisseur France.
- Résolution : TVA 0% (export), justificatif d’export requis.

#### 4.3.4. Vente B2C France
- Client particulier, produit alimentaire.
- Résolution : TVA 5,5% (produit alimentaire), affichée sur la facture.

#### 4.3.5. Vente locale USA
- Client et fournisseur en Californie.
- Résolution : sales tax 8,25% (peut varier selon la ville).

#### 4.3.6. Cas extrêmes
- Multi-taxes : produit soumis à TVA + éco-taxe + taxe locale.
- Changement de taux en cours d’année : gestion des taux historiques.
- Franchise en base : pas de TVA facturée si seuil non atteint.
- Produit/service exonéré : taux 0%, mention obligatoire.

### 4.4. Questions/réponses (FAQ métier et technique)

- **Q : Comment gérer un changement de taux en cours d’année ?**  
  R : La TaxRule doit contenir une période de validité (startDate, endDate). La logique de résolution doit sélectionner la règle valide à la date de la commande/facture.

- **Q : Comment gérer les cas où plusieurs taxes s’appliquent à une même ligne ?**  
  R : Utiliser une table de jointure OrderLineTax permettant d’associer plusieurs taxes à une même ligne, avec taux et montant appliqué.

- **Q : Comment garantir la traçabilité du taux appliqué ?**  
  R : Toujours stocker dans OrderLineTax le taux et la règle appliquée (id de la TaxRule), même si la règle évolue ensuite.

- **Q : Comment gérer les exceptions locales (DOM-TOM, zones franches, etc.) ?**  
  R : Ajouter des conditions spécifiques dans TaxRule (champ conditions en JSON ou texte libre), et prévoir une logique de résolution extensible.

- **Q : Comment gérer les évolutions réglementaires ?**  
  R : Prévoir des scripts de migration, versionner les règles, historiser les modifications.

- **Q : Comment intégrer la gestion des remises, crédits, avoirs ?**  
  R : Les remises doivent s’appliquer avant le calcul de la taxe, et les avoirs doivent répercuter la taxe initialement facturée.

---

## 7. Modélisation des données (schémas, mapping, justification)

### 7.1. Schéma relationnel détaillé et évolutif

```text
Region (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)
Country (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  regionId INT REFERENCES Region(id)
)
Client (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL, -- contractType.Client
  ... -- autres champs (voir mockDataClients.ts)
)
Supplier (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL, -- contractType.Supplier
  ... -- autres champs (voir mockDataSuppliers.ts)
)
Contract (
  contractId INT PRIMARY KEY,
  billingId INT NOT NULL,
  type VARCHAR(20) NOT NULL -- 'client' ou 'supplier'
)
ProductType (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)
Product (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  productTypeId INT REFERENCES ProductType(id),
  ... -- autres champs
)
TaxType (
  id INT PRIMARY KEY,
  code VARCHAR(20) NOT NULL, -- 'TVA', 'SALES_TAX', 'ECO_TAX', etc.
  name VARCHAR(100) NOT NULL,
  description TEXT
)
TaxRule (
  id INT PRIMARY KEY,
  countryId INT REFERENCES Country(id),
  regionId INT REFERENCES Region(id) NULL,
  productTypeId INT REFERENCES ProductType(id),
  clientType VARCHAR(20), -- 'B2B', 'B2C', 'ADMIN', etc.
  supplierType VARCHAR(20) NULL,
  taxTypeId INT REFERENCES TaxType(id),
  rate DECIMAL(5,2) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NULL,
  conditions JSONB NULL,
  description TEXT,
  priority INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
Order (
  id INT PRIMARY KEY,
  clientId INT REFERENCES Client(id),
  supplierId INT REFERENCES Supplier(id),
  contractId INT REFERENCES Contract(contractId),
  currency VARCHAR(10) NOT NULL,
  exchangeRate DECIMAL(12,6),
  ... -- autres champs
)
OrderLine (
  id INT PRIMARY KEY,
  orderId INT REFERENCES Order(id),
  productId INT REFERENCES Product(id),
  quantity DECIMAL(12,2) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  discount DECIMAL(5,2) DEFAULT 0,
  ... -- autres champs
)
OrderLineTax (
  orderLineId INT REFERENCES OrderLine(id),
  taxRuleId INT REFERENCES TaxRule(id),
  rate DECIMAL(5,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  calculatedAt TIMESTAMP,
  currency VARCHAR(10) NOT NULL,
  PRIMARY KEY (orderLineId, taxRuleId)
)
```

### 7.2. Mapping complet avec les fichiers mock

- **Region** : voir [`mockDataRegions.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Addresses/mockDataRegions.ts)
- **Country** : voir [`mockDataCountrys.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Addresses/mockDataCountrys.ts)
- **Client** : voir [`mockDataClients.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Clients/mockDataClients.ts)
- **Supplier** : voir [`mockDataSuppliers.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Suppliers/mockDataSuppliers.ts)
- **Contract** : voir [`mockDataContract.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/mockDataContract.ts)
- **ProductType/Product** : à enrichir dans les mocks pour la catégorisation fiscale
- **TaxType, TaxRule, OrderLineTax** : à créer dans la base et à intégrer dans les mocks pour la simulation

#### Exemple d’entrée `TaxType` :

```typescript
export const taxTypeData: TaxType[] = [
  { id: 1, code: 'TVA', name: 'Taxe sur la Valeur Ajoutée', description: 'Taxe standard UE' },
  { id: 2, code: 'SALES_TAX', name: 'Sales Tax', description: 'Taxe locale US' },
  { id: 3, code: 'ECO_TAX', name: 'Éco-taxe', description: 'Taxe environnementale' }
]
```

#### Exemple d’entrée `TaxRule` :

```typescript
export const taxRuleData: TaxRule[] = [
  {
    id: 1,
    countryId: 4, // France
    regionId: 2, // Europe
    productTypeId: 1, // Matière
    clientType: 'B2B',
    taxTypeId: 1, // TVA
    rate: 20.00,
    startDate: '2024-01-01',
    endDate: null,
    conditions: null,
    description: 'TVA standard France',
    priority: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Autres règles...
]
```

#### Exemple d’entrée `OrderLineTax` :

```typescript
export const orderLineTaxData: OrderLineTax[] = [
  {
    orderLineId: 101,
    taxRuleId: 1,
    rate: 20.00,
    amount: 200.00,
    calculatedAt: '2025-07-24T17:00:00Z',
    currency: 'EUR'
  }
]
```

### 7.3. Justification de chaque champ/table

- **priority** dans TaxRule : permet de gérer les conflits (plusieurs règles applicables, on prend la plus prioritaire).
- **isActive** : permet de désactiver une règle sans la supprimer (audit, historique).
- **conditions** (JSONB) : pour stocker des exceptions complexes, seuils, franchises, zones spécifiques, etc.
- **createdAt/updatedAt** : audit, conformité, traçabilité.
- **OrderLineTax** : permet la multi-taxation, l’audit, l’export fiscal, la justification a posteriori.

### 7.4. Alternatives rejetées et choix d’architecture

- **Stocker le taux sur la commande/facture** : rejeté (pas d’audit, pas de gestion du changement de taux).
- **Règle unique par pays** : rejeté (pas assez flexible, ne couvre pas les cas multi-taxes, exceptions, etc.).
- **Règles codées en dur** : rejeté (impossible à maintenir, pas d’extension possible).

### 7.5. Exemples de données et scénarios

- **Cas France-France B2B** : la résolution va chercher la TaxRule où countryId=4, productTypeId=..., clientType='B2B', date dans [startDate, endDate], isActive=true, etc.
- **Cas multi-taxes** : plusieurs TaxRule applicables, plusieurs entrées OrderLineTax générées.
- **Cas taux historique** : la date de la commande/facture permet de sélectionner le taux valide à la date.

---

## 8. Logique métier et algorithmes de résolution fiscale

### 8.1. Algorithme général de résolution d’une règle fiscale

1. **Collecte du contexte** :
   - Pays de facturation, de livraison, de destination
   - Région/zone économique
   - Type de client, type de fournisseur
   - Type de produit, usage, quantité, montant
   - Date de la transaction
   - Statut fiscal du client/fournisseur

2. **Filtrage des TaxRule candidates** :
   - countryId = pays concerné OU regionId = zone concernée
   - productTypeId = type de produit
   - clientType/supplierType = type d’entité concernée
   - taxTypeId = type de taxe recherchée (TVA, sales tax…)
   - startDate <= date de la transaction <= endDate (ou endDate null)
   - isActive = true

3. **Application des conditions avancées** :
   - Vérification des conditions JSON (seuils, exceptions, statuts particuliers)
   - Application de la priorité (champ priority)

4. **Résolution finale** :
   - Si plusieurs règles : prendre la plus prioritaire ou appliquer toutes si multi-taxation
   - Générer une entrée OrderLineTax pour chaque taxe applicable
   - Stocker le taux, le montant, la règle appliquée, la date de calcul

### 8.2. Cas particuliers à gérer

- **Changement de taux en cours d’année** : sélection de la règle valide à la date de la commande.
- **Multi-taxation** : application de plusieurs règles (TVA + éco-taxe + taxe locale).
- **Exonération/Autoliquidation** : règle à taux zéro, mention obligatoire sur la facture.
- **Erreur ou correction** : possibilité de recalcul, d’émission d’un avoir, d’audit a posteriori.
- **Franchise en base** : exclusion de la TVA si le statut du client/fournisseur le permet.

---

## 9. API, UI/UX et intégration

### 9.1. UI/UX – Bonnes pratiques

- **Édition des règles** : formulaire dynamique, validation des dates, des taux, des conditions.
- **Visualisation** : tableau filtrable, triable, exportable des règles.
- **Simulation** : interface de test pour appliquer des règles à des commandes fictives.
- **Audit** : affichage de l’historique des modifications, des taux appliqués, des logs de calcul.
- **Alerte** : notification en cas de conflit de règles, de taux manquant, de règle expirée.

---

## 10. Stratégies d’extension, migration, audit, sécurité

### 10.1. Extension

- Ajout de nouveaux types de taxes (ex : taxe carbone, taxe locale, etc.)
- Ajout de nouveaux pays/régions sans refonte du modèle
- Extension des conditions (champ JSON, scripts de validation custom)
- Support des évolutions réglementaires (Brexit, nouvelles lois, etc.)

### 10.2. Migration

- Scripts pour insérer/modifier/désactiver les règles lors des changements de taux
- Versioning des règles (champ version, date d’effet)
- Migration rétroactive des OrderLineTax si besoin d’audit ou de correction

### 10.3. Audit et traçabilité

- Stockage systématique du taux appliqué, de la règle, de la date de calcul
- Historisation des modifications de règles (qui, quand, quoi)
- Export des logs pour audit externe (fiscalité, commissaires aux comptes)

### 10.4. Sécurité et conformité

- Gestion fine des droits (qui peut éditer, valider, supprimer une règle)
- Conformité RGPD (pas de données personnelles dans les règles, anonymisation des logs)
- Protection contre les modifications frauduleuses (audit trail, double validation)

---

## 11. Exemples de données, requêtes, scénarios utilisateur

### 11.1. Scénario utilisateur : création d’une règle TVA France

1. L’utilisateur ouvre le module “Gestion des règles fiscales”.
2. Il crée une règle : pays = France, produit = Matière première, client = B2B, taux = 20%, date début = 2024-01-01.
3. Il valide, la règle est stockée avec l’auteur, la date de création, l’état actif.
4. Lors de la saisie d’une commande, le système applique automatiquement cette règle si le contexte correspond.

### 11.2. Scénario technique : changement de taux

1. Le taux TVA France passe de 20% à 21% le 1er janvier 2026.
2. Un script ajoute une nouvelle TaxRule (date début = 2026-01-01, taux = 21%), désactive l’ancienne (date fin = 2025-12-31).
3. Les commandes/factures créées avant 2026 gardent le taux historique, les nouvelles prennent le nouveau taux.

### 11.3. Exemple d’audit

- Pour chaque ligne de facture, on peut retrouver : le taux appliqué, la règle utilisée, la date de calcul, la version de la règle, l’auteur de la dernière modification.

---

## 12. Liens et mapping avec tous les fichiers mock du projet

- **Clients** : [`mockDataClients.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Clients/mockDataClients.ts)
- **Fournisseurs** : [`mockDataSuppliers.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Suppliers/mockDataSuppliers.ts)
- **Contracts** : [`mockDataContract.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/mockDataContract.ts)
- **Pays** : [`mockDataCountrys.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Addresses/mockDataCountrys.ts)
- **Régions** : [`mockDataRegions.ts`](../../Client_MES/frontend/src/renderer/src/stores/mock/Addresses/mockDataRegions.ts)
- **Produits** : à enrichir pour la gestion fiscale
- **TaxType, TaxRule, OrderLineTax** : à ajouter pour la simulation et l’implémentation complète

---

## 13. Conseils d’implémentation, bonnes pratiques, pièges à éviter

- Toujours stocker le taux appliqué sur chaque ligne pour l’audit.
- Ne jamais coder les règles en dur dans l’application.
- Prévoir des tests automatisés sur la logique de résolution des règles.
- Documenter chaque règle (champ description).
- Vérifier la cohérence des dates (pas de recouvrement de périodes pour une même clé).
- Prévoir une UI claire pour la gestion des exceptions et des cas limites.
- Anticiper la gestion multidevise et les conversions de taux.
- Garder la structure extensible : nouveaux champs, nouveaux types de taxes, nouvelles zones.
- Prévoir des migrations scriptées pour chaque changement de taux ou de réglementation.
- Sécuriser l’accès à la gestion des règles fiscales.

---

## 14. Annexes

### 14.1. Glossaire étendu

- **B2B** : Business to Business (entre entreprises)
- **B2C** : Business to Consumer (entreprise vers particulier)
- **NAFTA** : North American Free Trade Agreement
- **GST** : Goods and Services Tax (Canada, Australie, Inde…)
- **PST** : Provincial Sales Tax (Canada)
- **VAT** : Value Added Tax (équivalent TVA)
- **Autoliquidation** : mécanisme fiscal où le client déclare la TVA à la place du fournisseur
- **Franchise en base** : régime d’exonération de TVA pour les petites entreprises
- **OrderLineTax** : table de jointure stockant les taxes appliquées à chaque ligne de commande/facture

### 14.2. Schéma de flux de résolution fiscale (texte)

1. Création d’une commande/facture
2. Pour chaque ligne : collecte du contexte (pays, produit, client, date…)
3. Recherche des TaxRule applicables
4. Application des priorités, des conditions, des exceptions
5. Génération des OrderLineTax
6. Stockage du résultat pour l’audit

---

*Ce document est vivant : chaque nouvelle règle, chaque nouveau cas métier, chaque évolution réglementaire doit être documenté, testé, audité. Il doit servir de base à toute la gouvernance fiscale de l’ERP industriel.*

---

**N’hésite pas à demander l’enrichissement d’une section précise, ou à demander des exemples, des schémas, des cas extrêmes, ou des conseils d’implémentation détaillés sur une technologie donnée.**