# Architecture logiciel du Projet MES – Exigences et Description

## 1. Vue d’ensemble

Le projet MES cible une architecture hybride :
- **Application desktop installable** (Electron) pour l’utilisateur final.
- **Backend local** (Spring Boot) embarqué avec l’application Electron, gérant la logique métier, la sécurité, la communication avec le backend central, et la gestion locale des droits/licences.
- **Backend orchestrateur** (API centrale, Spring Boot ou équivalent) hébergé sur un VPS, centralisant les données, orchestrant les flux industriels et simulant les machines.

## 2. Schéma d’architecture (texte)

```
[Utilisateur]
    ↕ (UI)
[Electron Frontend]
    ↕ (HTTP/REST, WebSocket local)
[Spring Boot Backend local]
    ↕ (WebSocket/REST sécurisé)
[Backend orchestrateur VPS]
    ↔ (Machines réelles ou simulées)
[Redis (cache/queue)]
    ↕
[Base de données centrale]
```

## 2.b. Rôle de Redis dans l’architecture

- **Redis** est utilisé comme cache et/ou file de messages (queue) entre le backend orchestrateur et la base de données centrale.
- **Utilisations typiques** :
  - Accélérer l’accès aux données fréquemment consultées (cache).
  - Stocker temporairement les messages/événements produits par les machines ou le backend, avant écriture asynchrone en base de données (queue/pub-sub).
  - Améliorer la scalabilité et la résilience du backend orchestrateur.
- **Bénéfices** :
  - Réduction de la charge sur la base de données centrale.
  - Meilleure gestion des pics de données temps réel.
  - Découplage des traitements (asynchrone).

## 3. Flux de communication

- **Electron ↔ Backend local** :
  - Requêtes HTTP/REST pour les actions classiques (navigation, formulaires, etc.), toujours authentifiées via une session sécurisée (cookie HttpOnly/Secure). Le frontend Electron ne manipule jamais les tokens JWT : toute la gestion des credentials et de la sécurité est assurée côté backend local.
  - WebSocket local pour la réception d’informations temps réel (état de la production, notifications, etc.), authentifiée via la session ou un token temporaire fourni par le backend local.
- **Backend local ↔ Backend orchestrateur (VPS)** :
  - Connexion WebSocket sécurisée pour recevoir les updates temps réel (données de production, alertes, etc.) et envoyer des commandes/actions.
  - Authentification, gestion des licences, droits et rôles via le backend central.
- **Machines réelles (optionnel)** :
  - Les machines envoient en continu leurs données au backend orchestrateur (protocole au choix : MQTT, OPC UA, REST, WebSocket…).

## 4. Gestion des rôles, licences et sécurité

- **Rôles principaux** : Admin, Manager, RH, Employé/Opérateur, Machine (technique).
- **Gestion des utilisateurs** :
  - Création des comptes par l’admin (pas d’auto-inscription).
  - Attribution des rôles et des licences à chaque utilisateur/machine.
- **Sécurité** :
  - Authentification forte (JWT, OAuth2, etc.), gestion des permissions (RBAC).
  - Le backend local agit comme un proxy sécurisé : aucune logique métier dans Electron.
  - Toutes les actions sensibles sont validées côté backend local puis transmises au backend central.
  - **Session locale courte durée** : Le backend local gère une session utilisateur via cookie HttpOnly de courte durée (ex : 15-60 min), totalement indépendante du JWT utilisé pour communiquer avec le backend central.
  - **Renouvellement automatique de session** : Si la session locale expire mais que le JWT backend central (opaque pour le UI) est encore valide, le backend local recrée automatiquement une nouvelle session locale pour l'utilisateur, sans intervention du frontend, en validant le JWT auprès du backend central. Cela garantit une expérience utilisateur fluide sans reconnexion manuelle tant que le JWT central est valide.
  - **Aucune exposition du JWT** : Le frontend ne manipule jamais le JWT ni le refresh token du backend central, il ne gère que le cookie de session locale.

## 5. Temps réel et notifications

- **Affichage temps réel** :
  - Le backend local maintient une WebSocket ouverte avec le backend orchestrateur pour recevoir les updates (état des lignes, alertes, etc.).
  - Electron s’abonne à un WebSocket local pour afficher ces updates en direct à l’utilisateur.
- **Notifications** :
  - Disponibles uniquement quand l’application est ouverte (ou en “tray”).
  - À la réouverture, synchronisation des notifications manquées.

## 6. Gestion de la volumétrie et nettoyage des données

- **Problématique** : des millions de lignes générées chaque jour (télémétrie, logs, événements machines).
- **Stratégies recommandées** :
  - Partitionnement des tables (par jour/semaine/mois) pour faciliter la purge.
  - Rétention paramétrable : conservation des données brutes sur une période définie, puis archivage ou suppression.
  - Archivage des anciennes données vers un stockage froid (S3, NAS, etc.).
  - Agrégation des données historiques (moyennes, min/max, anomalies) pour les analyses long terme.
  - Tâches planifiées (Spring Scheduler, cron) pour automatiser la purge et l’archivage.

## 7. Principes de conception

- **Séparation stricte UI / logique métier** : Electron ne fait que l’UI, toute la logique est dans le backend local (Java).
- **Extensible** : possibilité d’ajouter des modules (simulation, reporting, etc.) ou de migrer vers une architecture microservices plus tard.
- **Sécurité et conformité** : gestion des accès, audit, traçabilité.
- **Expérience utilisateur** : installation simple, aucune configuration manuelle requise.

---

> **Ce document décrit l’architecture cible pour le projet MES, en intégrant les contraintes de sécurité, de gestion du temps réel, de volumétrie et d’expérience utilisateur moderne.**

 