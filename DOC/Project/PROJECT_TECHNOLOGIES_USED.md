# Technologies utilisées dans le projet MES

Ce document recense toutes les technologies structurantes du projet MES, pour chaque couche logicielle et infrastructurelle. Il sert de référence pour le choix, l’usage et l’évolution des technologies du projet.

---

## 1. Frontend Client MES

### 1.1 Electron (UI Desktop avec Vue.js)
- **Rôle** : Fournir une interface utilisateur moderne, multiplateforme, installable sur les postes opérateurs/techniciens/managers.
- **Framework principal** : Vue.js (UI réactive, modulaire, maintenable)
- **Gestion d’état** : Pinia (moderne, recommandé pour Vue 3)
  - **Usage dans ce projet** : Pinia sera utilisé exclusivement pour la gestion de l’état de l’interface utilisateur : synchronisation de l’affichage (données de production, statuts, notifications), stockage temporaire des données reçues du backend local (via API ou WebSocket), gestion de l’état de connexion, de la langue, des préférences UI, etc. Toute la logique métier, les calculs et les règles de gestion restent implémentés dans le backend local ; Pinia ne sert qu’à garantir une expérience utilisateur fluide et cohérente, sans logique métier côté client.
- **Design & CSS** : CSS et Tailwind CSS (design utilitaire, rapide, responsive)
- **Communication backend local** :
  - Axios (requêtes HTTP/REST) avec `withCredentials: true` pour la gestion sécurisée des sessions via cookie HttpOnly/Secure
  - Socket.IO Client (WebSocket temps réel), authentifié via cookie de session ou token temporaire fourni par le backend local
  - **Sécurité** : Le frontend Electron ne gère ni ne stocke jamais les tokens JWT ou refresh tokens. Toute la gestion des tokens, cookies et sessions est assurée côté backend local (Spring Boot). Le frontend utilise uniquement la session établie via cookie sécurisé, et toutes les requêtes REST/WebSocket passent par le backend local qui ajoute les headers nécessaires lors de la communication avec le serveur central. Le frontend n'a jamais accès aux credentials sensibles.
- **Fonctionnalités desktop avancées** :
  - Electron IPC (communication main/renderer)
  - Electron Store (stockage local simple)
  - node-ffi/napi (intégration natif si besoin, ex. badgeuse)
  - node-printer (impression)
  - node-usb (gestion USB)
  - node-notifier (notifications système)
  - electron-updater (mise à jour auto, avec support des mises à jour pilotées par le serveur central)
  - **Mise à jour frontend pilotée par API** :
    - Le frontend Electron vérifie périodiquement via une API centrale si une nouvelle version est disponible.
    - Le serveur central décide et notifie les clients des mises à jour obligatoires ou optionnelles.
    - Téléchargement et application automatique de la mise à jour, sans intervention manuelle (pas besoin de télécharger un nouvel installateur).
    - Possibilité de forcer la mise à jour ou de différer selon la politique du serveur central.
- **Tests & QA** : Jest (tests unitaires et composants)
- **Linting & formatage** : ESLint, Prettier (qualité code, cohérence équipe)
- **Notifications locales UI** : vue-toastification (affichage des alertes, statuts, erreurs, etc.)
- **Documentation technique UI** : Storybook (documentation interactive et réutilisation des composants Vue)
- **Internationalisation** : vue-i18n (gestion multi-langue)
- **Accessibilité** : axe-core, vue-aria (si besoin)
- **Langages** : JavaScript/TypeScript, HTML, CSS
- **Avantages** :
  - UI réactive et moderne
  - Forte maintenabilité et évolutivité
  - Intégration simple avec l’écosystème Node.js/Electron
  - Expérience utilisateur native, portabilité Windows/Linux/Mac
- **Extensions futures** :
  - Intégration mobile possible via Capacitor/Cordova
  - Ajout de modules industriels spécifiques (badgeuse, impression, etc.)


### 1.2 Spring Boot (Backend local embarqué)
- **Rôle** : Fournir la logique métier locale, la sécurité, la gestion des droits/licences, le stockage temporaire, la communication sécurisée avec le backend central.

- **Modules et technologies utilisés** :
  - **Spring Boot (core)** : socle applicatif Java moderne, configuration simplifiée
  - **Spring Web** : création d’API REST locales pour l’UI Electron
  - **Spring WebSocket** : gestion de la communication temps réel via WebSocket
    - **Architecture** : l’UI Electron ouvre une WebSocket locale (Socket.IO) vers le backend local ; le backend local ouvre une WebSocket (STOMP/SockJS) vers le serveur central VPS pour recevoir et relayer les données temps réel (événements, notifications, mesures, statuts, etc.).
    - **Socket.IO (Electron)** : protocole robuste et simple pour la communication WebSocket côté UI.
    - **STOMP/SockJS (Spring Boot)** : STOMP (Simple Text Oriented Messaging Protocol) permet de structurer les messages, gérer les topics/queues, et offre une compatibilité native avec Spring WebSocket. SockJS permet la compatibilité avec les navigateurs/clients ne supportant pas nativement WebSocket.
    - **Avantages de STOMP** : gestion des topics, souscriptions dynamiques, compatibilité avec les brokers de messages (RabbitMQ, ActiveMQ), extensibilité pour la scalabilité et la sécurité.
  - **Spring Security** : gestion de l’authentification, des rôles, RBAC, JWT
  - **Spring Data JPA** : accès à une base locale embarquée H2
    - **Approche “code first”** : les entités Java annotées (`@Entity`) définissent le schéma, qui est créé et mis à jour automatiquement par JPA/Hibernate (ex : `spring.jpa.hibernate.ddl-auto=update`).
    - **H2** : utilisé pour la persistance locale minimale (stockage sécurisé des tokens JWT, cookies, logs temporaires, préférences, etc.), avec possibilité d’utilisation en mode mémoire ou fichier selon les besoins.
    - **Avantages** : évolution rapide du schéma, simplicité pour les tests, prototypage et maintenance locale sans scripts SQL manuels.
  - **Spring Cache** : cache local en mémoire Caffeine
    - **Caffeine** : utilisé comme buffer mémoire ultra-rapide pour stocker des données volatiles, accélérer les accès, gérer des files temporaires ou la synchronisation asynchrone. Complète H2 en offrant un stockage non persistant et performant pour les besoins de bufferisation locale.
  - **Spring Scheduling** : planification de tâches périodiques (nettoyage, synchro, refresh tokens, etc.)
  - **Spring Validation** : validation des entrées API, cohérence des données
  - **Jackson** : sérialisation/désérialisation JSON
  - **Lombok** : réduction du boilerplate Java (getters/setters, builders)
  - **MapStruct** : mapping DTO/entités (optionnel)
  - **Swagger/OpenAPI** : documentation interactive de l’API locale
  - **Logback/SLF4J** : gestion avancée des logs
  - **Micrometer** : exposition de métriques pour le monitoring local
  - **Spring Boot Actuator** : endpoints santé, métriques, gestion dynamique

- **Tests & QA** :
  - **JUnit 5** : tests unitaires
  - **Mockito** : mock des dépendances
  - **Testcontainers** : tests d’intégration avec bases embarquées

- **Avantages** :
  - Robustesse, modularité, sécurité avancée
  - Intégration native avec l’UI Electron
  - Prise en charge facile de la logique métier, des droits/licences et de la persistance temporaire
  - Observabilité et monitoring local

- **Extensions futures** :
  - Ajout de modules métier, connecteurs industriels (OPC UA, Modbus, MQTT via librairies Java)
  - Simulation locale de flux industriels
  - Intégration d’un moteur de règles métier (Drools, etc.)

---

## 2. Backend central

### 2.1 Spring Boot (Backend orchestrateur VPS)
- **Rôle** : Orchestration centrale, gestion des données globales, supervision, synchronisation multi-sites, gestion des accès, notifications et sécurité.
- **Accès base de données** : SEUL le backend central communique directement avec la base de données centrale (MariaDB, Redis). Le backend local ne dispose d’aucun accès direct à la base centrale : toutes les opérations métiers et la synchronisation transitent par ce backend central, qui assure la cohérence, la sécurité et la supervision globale.

- **Modules et technologies utilisés** :
  - **Spring Boot (core)** : socle applicatif Java moderne
  - **Spring Web** : API REST centrale pour tous les clients (backend locaux, UI, systèmes tiers)
  - **Spring WebSocket** : WebSocket temps réel (STOMP/SockJS) pour la diffusion d’événements, notifications, monitoring
  - **Spring Security** : gestion avancée de l’authentification, RBAC, JWT, OAuth2 (optionnel pour SSO/futur)
  - **Spring Data JPA** : intégration avec MariaDB (base de données centrale)
  - **Spring Session** : gestion des sessions distribuées (si besoin)
  - **Spring Cache** : intégration Redis (cache distribué, files d’attente, pub/sub)
  - **Spring Scheduling** : tâches planifiées (synchronisation, reporting, maintenance)
  - **Spring Validation** : validation des entrées API
  - **Jackson** : sérialisation/désérialisation JSON
  - **Lombok** : réduction du boilerplate Java
  - **Swagger/OpenAPI** : documentation interactive de l’API centrale
  - **Logback/SLF4J** : logs applicatifs
  - **Micrometer** : métriques pour Prometheus, Grafana
  - **Spring Boot Actuator** : endpoints santé, métriques, gestion dynamique
  - **Monitoring** : intégration Prometheus, Grafana, Zabbix (supervision, alerting)
  - **Flyway/Liquibase** : gestion des migrations de schéma, versionnement et déploiement automatique de toutes les évolutions de la base de données (tables, vues, triggers, procédures stockées, etc.) via des fichiers SQL versionnés dans le projet API.
- **Gestion des secrets** : variables d’environnement, volumes sécurisés, pour les accès aux équipements/protocoles sensibles.
- **Gestion des objets SQL avancés** :
  - Les vues, triggers, procédures stockées, etc. sont définis dans des fichiers SQL dédiés (un fichier par objet recommandé) et placés dans le dossier de migration (ex : `src/main/resources/db/migration`).
  - Flyway/Liquibase applique automatiquement ces scripts sur la base MariaDB lors du déploiement ou du démarrage de l’application, assurant un versionnement, une reproductibilité et une gestion centralisée des évolutions du schéma.
  - Ce mécanisme permet l’utilisation de SQL “raw” pour exploiter toutes les fonctionnalités avancées de MariaDB.

- **Tests & QA** :
  - **JUnit 5**, **Mockito**, **Testcontainers** (tests d’intégration avec MariaDB/Redis)

- **Avantages** :
  - Haute scalabilité, sécurité centralisée, supervision avancée
  - Intégration native avec Redis/MariaDB, autres systèmes (ERP, WMS…)
  - Prêt pour migration microservices, clustering, extension IA/analytics
  - Centralisation de la sécurité, de la cohérence métier et de la gestion des accès

- **Extensions futures** :
  - Migration microservices (Spring Cloud, Kubernetes, etc.)
  - Intégration IA/analytics (modules Python, Spark, etc.)
  - Reporting avancé, gestion multi-sites, multi-tenants

---

## 3. Serveur de récupération de données usine

### 3.1 Agent d’acquisition industriel (standardisé par site)
- **Rôle** : Ce serveur est un composant standard de l’architecture MES : il collecte, capte et traite toutes les données issues des capteurs, automates, systèmes industriels et usages spécifiques à chaque usine, puis transmet les données traitées et standardisées au serveur central.
- **Fonctionnement** :
  - Capte les données en temps réel depuis : chaînes de production, badgeuses, capteurs de portes, automates, serveurs protocolaires dédiés, etc.
  - Supporte une grande diversité de protocoles : OPC UA, MQTT, Modbus TCP/RTU, BLE, RabbitMQ, S7, EtherNet/IP, API REST, fichiers, etc.
  - Peut se connecter directement aux équipements ou passer par des serveurs/proxies dédiés à un protocole.
  - Applique les traitements spécifiques à l’usine : filtrage, normalisation, agrégation, gestion des cas particuliers, enrichissement, anonymisation, etc.
  - Bufferise et fiabilise la donnée localement (anti-perte, files d’attente, reprise sur incident).
  - Sécurise et standardise la communication et l’échange de données avec le serveur central : toutes les informations issues des capteurs et protocoles industriels (BLE, MQTT, etc.) sont collectées et transformées localement selon un format métier MES unique, puis transmises exclusivement via des API REST ou WebSocket vers le serveur central. Le serveur d’acquisition ne fait pas de simple relai : il adapte, filtre et structure la donnée pour que le backend central la comprenne et la traite de façon homogène, quel que soit le site ou le protocole source.
  - Monitoring local, alerting, logs et supervision.
- **Avantages** :
  - Permet d’alléger la complexité du backend central : chaque serveur usine gère ses protocoles, ses cas spéciaux et ses traitements locaux.
  - Standardise la communication inter-site, facilite l’intégration de nouveaux équipements/usines.
  - Robustesse, extensibilité, temps réel, adaptation à l’existant industriel.
  - Favorise l’évolutivité (ajout de connecteurs, edge computing, IA locale, etc.).
- **Technologies utilisées pour le serveur d’acquisition industriel** :
  - **Spring Boot (Java)** : cœur du système, API locale, orchestration, sécurité, traitement, bufferisation, communication avec le serveur central MES.
  - **Python** : connecteurs pour la collecte de données terrain (ex : pyModbus, python-opcua, paho-mqtt, BLE, scripts personnalisés).
  - **Node-RED** : orchestration graphique, prototypage rapide, connexion multi-protocoles, adaptation par les automaticiens.
  - **C++/C#** : drivers natifs pour équipements/protocoles industriels spécifiques, besoins temps réel ou SDK propriétaires.
  - **Rust** : connecteurs performants et sécurisés pour certains protocoles ou besoins critiques (optionnel selon cas d’usage).
  - **Docker & Docker Compose** : conteneurisation et orchestration de tous les services sur le VPS industriel (déploiement, mise à jour, isolation, portabilité).
  - **Redis local** : file/buffer local temporaire pour la gestion des pics, la résilience ou la communication inter-processus. (à discuter)
  - **Gestion des secrets** : variables d’environnement, volumes sécurisés, pour les accès aux équipements/protocoles sensibles.
  - **(Éventuellement) Logiciels propriétaires** : pour l’intégration d’équipements industriels fermés ou non standards.
- **Cas d’usage** :
  - Données de chaînes de production, badgeuses, capteurs de portes, énergie, température, qualité, etc.
  - Agrégation multi-protocoles, gestion d’événements industriels, synchronisation temps réel.
- **Extensions futures** :
  - Edge computing (traitement IA en local, maintenance prédictive, analyse embarquée)
  - Connecteurs supplémentaires (nouveaux protocoles, API, analyse avancée)

---

## 4. Bases de données et middleware

### 4.1 MariaDB (base de données relationnelle principale)
- **Rôle** : Stockage structuré, transactionnel et sécurisé de toutes les données critiques du MES (production, traçabilité, utilisateurs, logs, etc.).
- **Fonctionnalités** : SQL, procédures stockées, triggers, vues, partitionnement, réplication, sauvegarde/restauration, auditabilité.
- **Avantages** : Open source, haute performance, compatibilité MySQL, support du clustering (Galera), outils de monitoring avancés.
- **Extensions futures** : Sharding, migration multi-bases/sites, intégration analytique (column store, etc.).

### 4.2 Redis (cache, queue, pub/sub)
- **Rôle** : Accélération des accès aux données critiques, gestion des files d’attente temps réel, bufferisation d’événements, synchronisation asynchrone entre composants.
- **Fonctionnalités** : Cache clé/valeur, pub/sub, streams, persistence optionnelle, haute disponibilité (sentinel, cluster).
- **Avantages** : Rapidité extrême, simplicité de déploiement, scalabilité horizontale, support natif des patterns industriels (queue, pub/sub).
- **Extensions futures** : Utilisation avancée de Redis Streams, intégration avec des microservices, monitoring en temps réel.

---

> **Ce document doit être mis à jour à chaque évolution technologique majeure du projet (nouvelle stack, migration, dépréciation, etc.).**