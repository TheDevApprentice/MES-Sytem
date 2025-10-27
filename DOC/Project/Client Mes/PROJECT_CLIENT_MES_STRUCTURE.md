# Structure fonctionnelle — Client MES

## 1. État des lieux des modules

Modules principaux actuellement présents :
- **Dashboard** : Accueil global, accès rapide aux modules, infos générales.
- **MES** (Manufacturing Execution System) : Gestion de la production, ordres, suivi atelier.
- **ERP** (Enterprise Resource Planning) : Gestion administrative, financière, logistique.
- **CRM** (Customer Relationship Management) : Gestion des clients, prospects, interactions commerciales.
- **RH** (Ressources Humaines) : Gestion des collaborateurs, tableau de bord RH, évolutif vers SIRH.
- **Reporting** : Rapports, statistiques, tableaux de bord analytiques.
- **Test** : Espace de test pour composants techniques (ex : Spreadsheet UniverJS).

## 2. Navigation
- Tous les modules sont accessibles via le menu latéral.
- Les routes sont définies dans `src/renderer/src/router.ts`.
- Les boutons d’accès rapide sont présents sur chaque page d’accueil de module.

## 3. Notes générales
- Les modules ERP et CRM sont à enrichir (liens, pages internes à venir).
- Le module RH est séparé pour une meilleure évolutivité, mais des liens croisés avec ERP/CRM sont prévus.
- Le module Spreadsheet est intégré comme composant technique réutilisable.

---

# 4. Planification détaillée des modules et pages

## 4.1. CRM (Customer Relationship Management)

- **Accueil CRM**
  - Rôle : Vue d'ensemble, accès rapide à toutes les fonctions CRM.
  - Fonctionnalités : KPIs, pipeline commercial, raccourcis, notifications.
  - Liens : Accès direct aux clients, opportunités, activités, reporting CRM.
- **Clients**
  - Rôle : Gestion des clients et prospects.
  - Fonctionnalités : Liste, recherche, création, modification, suppression, import/export, segmentation.
  - Pages de détail : Fiche client (infos, historique, documents, contacts associés).
  - Liens : Opportunités, activités, RH (pour rattacher des commerciaux).
- **Opportunités**
  - Rôle : Suivi du pipe commercial.
  - Fonctionnalités : Vue Kanban, création/modification, étapes, scoring, prévisionnel.
  - Pages de détail : Fiche opportunité, historique, tâches liées.
  - Liens : Clients, reporting.
- **Activités**
  - Rôle : Historique des interactions clients.
  - Fonctionnalités : Timeline, création de tâches, appels, emails, rendez-vous, notes, pièces jointes.
  - Liens : Clients, opportunités.
- **Reporting CRM**
  - Rôle : Statistiques et analyses commerciales.
  - Fonctionnalités : Graphiques, exports, filtres avancés.
- **Paramètres CRM**
  - Rôle : Configuration du module CRM.
  - Fonctionnalités : Gestion des utilisateurs, droits, champs personnalisés, automatisations.

## 4.2. ERP (Enterprise Resource Planning)

- **Accueil ERP**
  - Rôle : Vue d'ensemble, accès rapide à toutes les fonctions ERP.
  - Fonctionnalités : KPIs, raccourcis, notifications.
  - Liens : Gestion fournisseurs, commandes, factures, stocks, RH.
- **Gestion fournisseurs**
  - Rôle : Suivi et création de fournisseurs.
  - Fonctionnalités : Liste, recherche, création, modification, suppression, import/export.
  - Pages de détail : Fiche fournisseur (coordonnées, contrats, historique commandes/factures).
  - Liens : Commandes, factures.
- **Commandes**
  - Rôle : Gestion des commandes fournisseurs.
  - Fonctionnalités : Liste, création, modification, suivi, validation, export PDF.
  - Pages de détail : Fiche commande (lignes, statuts, historique).
  - Liens : Fournisseurs, stocks.
- **Factures**
  - Rôle : Suivi des factures entrantes/sortantes.
  - Fonctionnalités : Liste, création, validation, paiement, export PDF.
  - Pages de détail : Fiche facture (montants, échéances, pièces jointes).
  - Liens : Comptabilité, fournisseurs.
- **Stocks**
  - Rôle : Suivi des stocks et inventaires.
  - Fonctionnalités : Liste, mouvements, alertes seuils, inventaires.
  - Liens : Commandes, production MES.
- **Reporting ERP**
  - Rôle : Statistiques financières et logistiques.
  - Fonctionnalités : Tableaux de bord, graphiques, exports.
- **Paramètres ERP**
  - Rôle : Configuration du module ERP.
  - Fonctionnalités : Gestion des comptes, TVA, devises, workflows, droits d'accès.

## 4.3. RH (Ressources Humaines)

- **Accueil RH**
  - Rôle : Dashboard RH, accès rapide, alertes.
  - Fonctionnalités : KPIs RH, alertes absences, rappels anniversaires, raccourcis.
  - Liens : Employés, absences, recrutement, reporting RH.
- **Employés**
  - Rôle : Gestion des collaborateurs.
  - Fonctionnalités : Liste, création, modification, suppression, import/export.
  - Pages de détail : Fiche employé (infos perso, poste, historique, documents, entretiens, absences).
  - Liens : RH, ERP (paie), CRM (affectation commerciale).
- **Absences / Présences**
  - Rôle : Suivi des congés, absences, présences, retards.
  - Fonctionnalités : Calendrier, demandes, validation, solde, alertes.
  - Liens : Employés, reporting RH.
- **Recrutement**
  - Rôle : Suivi des candidats et processus d'embauche.
  - Fonctionnalités : Pipeline, création/modification, scoring, entretiens, documents.
  - Pages de détail : Fiche candidat, historique, notes.
  - Liens : Employés (transfert en cas d'embauche).
- **Entretiens**
  - Rôle : Gestion des entretiens annuels/professionnels.
  - Fonctionnalités : Planification, comptes rendus, suivi des objectifs.
  - Liens : Employés.
- **Reporting RH**
  - Rôle : Statistiques RH, suivi absentéisme, turnover, etc.
  - Fonctionnalités : Tableaux de bord, graphiques, exports.
- **Paramètres RH**
  - Rôle : Configuration du module RH.
  - Fonctionnalités : Gestion des types de contrat, droits, modèles de documents, etc.

## 4.4. MES (Manufacturing Execution System)

- **Accueil MES**
  - Rôle : Dashboard production, accès rapide, statuts atelier.
  - Fonctionnalités : KPIs, statuts, alertes, raccourcis vers ordres et suivi production.
  - Liens : Ordres, suivi production, rapports MES.
- **Ordres de fabrication**
  - Rôle : Gestion des ordres de fabrication.
  - Fonctionnalités : Liste, création, modification, suivi, planification.
  - Pages de détail : Fiche ordre (produit, quantités, statuts, historique, documents associés).
  - Liens : Suivi production, reporting.
- **Suivi production**
  - Rôle : Monitoring temps réel de la production.
  - Fonctionnalités : Tableaux, graphiques, alertes, suivi par poste/machine.
  - Liens : Ordres, reporting MES.
- **Rapports MES**
  - Rôle : Statistiques et analyses de production.
  - Fonctionnalités : Graphiques, exports, filtres, synthèses par période/atelier.
- **Paramètres MES**
  - Rôle : Configuration du module MES.
  - Fonctionnalités : Gestion des ateliers, postes, gammes, droits d'accès, modèles d'ordre.

---

> Ce document est une base de travail à enrichir et adapter selon les besoins métier, l’organisation et la vision cible du SI.
> 
> **À faire ensuite :**
> - Prioriser les pages à implémenter dans chaque module
> - Définir les wireframes/UX pour chaque page clé
> - Rédiger les user stories ou spécifications détaillées

*Dernière mise à jour : 22/07/2025*