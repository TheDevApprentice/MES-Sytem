# Architecture de la Base de Données du Système MES

## 1. Introduction

Ce document décrit l’architecture cible de la base de données du système MES, en intégrant les besoins industriels de traçabilité, de sécurité, de volumétrie, et de modularité. Cette architecture est conçue pour supporter la croissance future (multi-sites, multi-lignes), garantir la conformité réglementaire et permettre l’analyse avancée des données.

> **Note de conception :**
> L’architecture initiale est volontairement simplifiée (une usine, une ligne de production, un serveur central, une base de données unique, un cache Redis). Toutefois, la structure de la base de données doit dès le départ anticiper une future migration vers une architecture microservices : découplage des domaines fonctionnels, modularité des schémas, séparation des responsabilités, évolutivité, gestion des identifiants globaux, et compatibilité avec une distribution multi-bases. Cela permettra de transformer progressivement le système en une architecture orientée microservices sans refonte majeure.

## 2. Découpage logique et domaines fonctionnels

Pour anticiper une migration vers une architecture microservices, la base est organisée autour de domaines fonctionnels, qui pourront devenir des services indépendants :

- **production** : gestion des usines, lignes, machines, capteurs, lots, données de production
- **traceability** : événements de traçabilité, flux matière, audit
- **hr** : opérateurs, badges, pointage, habilitations, accès
- **security** : gestion des accès, rôles, zones, audit log
- **maintenance** : interventions, alarmes, historiques
- **system** : logs, notifications, configurations

Chaque domaine correspond à un schéma ou préfixe dédié, facilitant le découplage et l’extraction progressive.

## 3. Stratégies d’identifiants et de découplage

- **UUID/GUID** pour toutes les entités principales (unicité cross-domain/microservice)
- **Relations faibles** entre domaines (clé étrangère optionnelle, ou référence logique)
- **Eventual consistency** et synchronisation asynchrone via events/messages (Redis, pub/sub)

## 4. Tables, entités et modélisation (exemples avancés)

- **production** : `factory`, `production_line`, `machine`, `sensor`, `production_data`, `lot`
- **traceability** : `traceability_event`, `material_flow`, `audit_log`
- **hr** : `employee`, `badge`, `attendance`, `training`, `access_right`
- **security** : `zone`, `access_log`, `role`, `user`
- **maintenance** : `maintenance_event`, `alarm`, `intervention`
- **system** : `system_log`, `notification`, `config`

> Pour chaque table : préciser les clés primaires (UUID), index, contraintes, partitionnement, et liens éventuels avec d’autres domaines.

## 5. Partitionnement, rétention et archivage

- Partitionnement des tables volumineuses (`telemetry`, `event_log`, `traceability_event`, etc.) par date, lot, ligne ou site.
- Rétention configurable : suppression/archivage automatique des anciennes données selon la politique métier.
- Archivage vers stockage froid (S3, NAS, buckets dédiés) pour l’historique long terme.
- Tables d’archives ou bases séparées pour les données historiques.

## 6. Intégration avec Redis et traitements asynchrones

- Utilisation de Redis pour :
  - Stocker temporairement les données temps réel avant ingestion en base.
  - Gérer les files d’attente de traitement asynchrone (pub/sub, queues, synchronisation inter-domaines).
  - Accélérer l’accès aux données critiques (cache, top N, états temps réel).
- Possibilité d’utiliser Redis Streams pour la gestion de flux d’événements et la synchronisation microservices.

## 7. Sécurité, gestion des accès et auditabilité

- RBAC avancé (roles-based access control) : droits par domaine, entité, action, zone.
- Historisation des accès et actions sensibles (audit log, triggers automatiques sur tables critiques).
- Chiffrement des données sensibles au repos et en transit.
- Vues sécurisées pour exposer uniquement les données nécessaires selon le rôle utilisateur.

## 8. Optimisation, monitoring, volumétrie et logique côté base

- Indexation adaptée aux requêtes critiques et à la volumétrie.
- Agrégation des données historiques (pour reporting, analyses, dashboards).
- Nettoyage automatique (purge, archivage, anonymisation si besoin).
- Procédures stockées pour traitements métiers complexes, batchs, clôtures, reporting.
- Triggers pour automatiser la traçabilité, la sécurité, la synchronisation inter-domaines.
- Fonctions SQL pour les calculs récurrents et critiques.
- Vues (views) pour exposer des synthèses, filtrer les accès, simplifier le reporting.

### Monitoring, supervision et résilience de la base

- **Surveillance de la base** : intégration avec des outils de monitoring (ex : Prometheus, Grafana, Zabbix, Percona Monitoring and Management) pour suivre la santé, la charge, les temps de requête, la volumétrie, les verrous, etc.
- **Alerting** : configuration d’alertes sur les seuils critiques (latence, erreurs, espace disque, réplication, disponibilité).
- **Collecte de logs et métriques** : centralisation des logs SQL, logs d’audit, métriques de performance, accès, erreurs, requêtes lentes.
- **Auditabilité** : triggers et journaux pour tracer toute modification critique (GDPR, traçabilité industrielle).
- **Sauvegardes et restauration** : stratégies de sauvegarde régulière (snapshots, backups incrémentaux, externalisation), scripts et procédures de restauration testées périodiquement.
- **Haute disponibilité** : configuration de réplication, failover, clustering (Galera Cluster, MariaDB Replication), tests de bascule.
- **Tests de restauration** : vérification périodique de la capacité à restaurer la base à partir des sauvegardes.
- **Conformité** : respect des exigences réglementaires (rétention, anonymisation, audit, sécurité des accès).

## 9. Stratégies de migration vers microservices

- Découplage progressif : chaque domaine peut être extrait dans sa propre base/service sans refonte majeure.
- Synchronisation inter-services : via events, messages (Redis, bus), ou API.
- Gestion des transactions cross-domain : privilégier la cohérence éventuelle (eventual consistency) et la compensation transactionnelle.
- Gestion des identifiants globaux (UUID) pour garantir l’unicité et la portabilité des données.

## 10. Exemples de schémas conceptuels et physiques

- Schémas UML pour chaque domaine, avec les entités, relations, cardinalités.
- Exemples SQL : création de tables, vues, triggers, procédures stockées, index.
- Cas d’usage : traçabilité d’un lot, gestion d’un accès badge, clôture automatique d’une production.

## 11. Bonnes pratiques et annexes

- Nommage : conventions pour tables, colonnes, index, procédures, schémas.
- Documentation : chaque objet (table, vue, procédure) doit être documenté dans la base.
- Tests : scripts de tests unitaires pour les procédures, triggers et fonctions.
- Backup & restauration : stratégie détaillée, scripts d’automatisation, tests périodiques.
- Versioning du schéma : gestion des évolutions et migrations de la base.

## 12. Schéma conceptuel simplifié (exemple)

```
[factory]---[production_line]---[machine]---[sensor]
                           |            |
                        [lot]        [production_data]
                           |            |
                        [operator]  [event_log]
                           |            |
                       [badge]   [traceability_event]
                           |
                  [access_log] [notification]
```

## 13. Architecture logique : procédures stockées, triggers, fonctions et vues (MariaDB)

Pour garantir la performance, la robustesse et la maintenabilité du système MES, l’architecture de la base MariaDB s’appuie sur :

- **Procédures stockées** : pour encapsuler des traitements complexes (ex : clôture de lot, génération de rapports, calculs d’indicateurs de performance, synchronisation inter-tables, gestion des imports/exports de données).
- **Fonctions SQL** : pour centraliser les calculs récurrents (ex : calcul d’OEE, conversion d’unités, extraction d’informations métier sur une ligne, un lot, un opérateur, etc.).
- **Triggers** : pour automatiser des actions lors d’événements (insertion, update, delete) : historisation automatique (audit trail), gestion de la traçabilité, mise à jour de statuts, génération de notifications, synchronisation de données entre tables.
- **Vues (views)** : pour exposer des agrégations, des synthèses ou des jointures complexes sous forme de tables virtuelles, facilitant le reporting, la supervision et l’accès sécurisé aux données critiques. (MariaDB supporte les vues, y compris les vues matérialisées via des tables et triggers si besoin de performance accrue.)

### Exemples de cas d’usage MES

- **Procédure stockée** : clôture automatique d’un lot de production avec calcul des rendements, génération des événements de traçabilité, archivage des données brutes.
- **Trigger** : création automatique d’un événement d’audit à chaque modification critique sur les tables de production ou d’accès.
- **Fonction** : calcul dynamique de l’OEE (Overall Equipment Effectiveness) d’une machine ou d’une ligne sur une période donnée.
- **Vue** : synthèse des statuts de production en temps réel par ligne, lot, opérateur, avec filtrage des accès selon le profil utilisateur.

### Objectifs et bénéfices

- **Alléger la charge du backend** : les traitements lourds, récurrents ou critiques sont réalisés côté base, ce qui réduit la latence et la complexité applicative.
- **Centraliser la logique métier critique** : cohérence des calculs, sécurité des traitements, auditabilité.
- **Optimiser les performances** : réduction des transferts de données, accès rapide aux agrégats et synthèses.
- **Sécuriser les accès** : possibilité de restreindre les droits sur les vues, procédures et fonctions selon le rôle utilisateur.

---

> **Ce document sert de base pour détailler chaque table, module ou flux de données de la base du système MES.**