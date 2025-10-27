# java-mes Manufacturing Execution System

a# Java MES - Manufacturing Execution System

## 🏭 Description du Projet

Ce projet consiste en le développement d'un **Manufacturing Execution System (MES)** complet en Java, conçu pour illustrer et maîtriser les concepts avancés du développement d'applications industrielles. Un MES est un système critique qui orchestre la production en temps réel dans les environnements industriels.

## 🎯 Objectifs Pédagogiques

- **Maîtrise de Java** : Application des concepts avancés (multithreading, design patterns, architecture modulaire)
- **Systèmes industriels** : Compréhension des enjeux de la production manufacturière
- **Architecture logicielle** : Conception d'un système distribué et scalable
- **Intégration** : Connexion avec des systèmes externes (ERP, SCADA, bases de données)

## 🛠️ Technologies Utilisées

### Backend
- **Java 17+** - Langage principal
- **Spring Boot 3.x** - Framework principal
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Persistance des données
- **H2** - Base de données

### Frontend
- **JavaFX** - Interface utilisateur moderne
- **Scene Builder** - Design d'interface
- **Charts et visualisations** - Monitoring temps réel

### Outils et Infrastructure
- **Maven** - Gestion des dépendances
- **Docker** - Containerisation
- **JUnit 5** - Tests unitaires
- **Mockito** - Tests de mocking
- **SLF4J/Logback** - Logging

## 🏗️ Architecture du Projet

```
java-mes/
├── mes-core/                 # Logique métier centrale
│   ├── domain/              # Entités et modèles
│   ├── services/            # Services métier
│   └── repositories/        # Accès aux données
├── mes-api/                 # API REST
│   ├── controllers/         # Contrôleurs REST
│   ├── dto/                # Data Transfer Objects
│   └── config/             # Configuration Spring
├── mes-ui/                  # Interface JavaFX
│   ├── controllers/         # Contrôleurs UI
│   ├── views/              # Fichiers FXML
│   └── components/         # Composants réutilisables
├── mes-connectors/          # Connecteurs industriels
│   ├── opc-ua/             # Connecteur OPC UA
│   ├── modbus/             # Connecteur Modbus
│   └── mqtt/               # Connecteur MQTT/IoT
├── mes-reporting/           # Module de reporting
├── mes-security/            # Module de sécurité
└── docs/                   # Documentation complète
    ├── MES_INTRODUCTION.md
    ├── architecture/
    ├── security/
    └── deployment/
```

## 📚 Introduction aux Manufacturing Execution Systems (MES)

Un **Manufacturing Execution System** est une plateforme logicielle qui fait le pont entre la planification (ERP) et les systèmes de contrôle des machines (SCADA/PLC). Il orchestre la production en temps réel et assure la traçabilité complète des produits.

### Fonctions Principales
- **Ordonnancement** : Planification détaillée de la production
- **Traçabilité** : Suivi complet des lots et produits
- **Contrôle Qualité** : Surveillance et validation en continu
- **Optimisation** : Amélioration des performances (OEE, TRS)
- **Conformité** : Respect des réglementations industrielles

### Positionnement dans l'Industrie 4.0
Le MES est au cœur de la transformation digitale industrielle, permettant :
- La connectivité des équipements (IoT industriel)
- L'analyse de données en temps réel
- La prise de décision automatisée
- L'optimisation continue des processus

## 📖 Documentation Détaillée

Notre documentation est organisée en modules spécialisés :

### 🔍 Fondamentaux
- **[Introduction Complète](docs/MES_INTRODUCTION.md)** - Vue d'ensemble et concepts de base
- **[Standards et Normes](docs/MES_STANDARDS.md)** - ISA-95, MESA, IEC 62264
- **[Architecture Technique](docs/MES_ARCHITECTURE.md)** - Patterns et conception

### 🏭 Applications Industrielles
- **[Secteurs d'Application](docs/MES_INDUSTRIES.md)** - Automobile, pharma, agroalimentaire...
- **[Cas d'Usage](docs/MES_USECASES.md)** - Scénarios typiques et bonnes pratiques
- **[ROI et Bénéfices](docs/MES_BENEFITS.md)** - Avantages quantifiables

### 🔧 Aspects Techniques
- **[Technologies et Connecteurs](docs/MES_TECHNOLOGIES.md)** - OPC UA, MQTT, REST APIs
- **[Sécurité Industrielle](docs/MES_SECURITY.md)** - Cybersécurité et conformité
- **[Gestion des Données](docs/MES_DATA_MANAGEMENT.md)** - Big Data et analytics

### 🚀 Implémentation
- **[Guide d'Implémentation](docs/MES_IMPLEMENTATION.md)** - Méthodologie de déploiement
- **[Configuration et Paramétrage](docs/MES_CONFIGURATION.md)** - Setup et personnalisation
- **[Maintenance et Support](docs/MES_MAINTENANCE.md)** - Opérations et troubleshooting

## 🚀 Démarrage Rapide

### Prérequis
- Java 17+
- Maven 3.8+
- Docker (optionnel)

### Installation
```bash
git clone https://github.com/votre-username/java-mes.git
cd java-mes
mvn clean install
```

### Lancement
```bash
# Backend
mvn spring-boot:run -pl mes-api

# Frontend (dans un autre terminal)
mvn javafx:run -pl mes-ui
```

## 🔧 Configuration

Le système utilise des profils Spring pour différents environnements :
- `dev` - Développement local
- `test` - Tests automatisés  
- `prod` - Production

Configuration via `application-{profile}.yml`

## 🧪 Tests

```bash
# Tests unitaires
mvn test

# Tests d'intégration
mvn verify -P integration-tests

# Couverture de code
mvn jacoco:report
```

## 📊 Fonctionnalités Implémentées

### ✅ Version 1.0 (MVP)
- [x] Gestion des ordres de fabrication
- [x] Suivi de production en temps réel
- [x] Interface opérateur basique
- [x] Connecteur OPC UA simple
- [x] Rapports de production

### 🔄 Version 1.1 (En cours)
- [ ] Module qualité avancé
- [ ] Gestion des recettes
- [ ] Analytics et KPI
- [ ] Interface mobile

### 🗓️ Roadmap
- **V1.2** : Intelligence artificielle (prédictive maintenance)
- **V1.3** : Intégration cloud et IoT avancé
- **V2.0** : Plateforme multi-sites

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md).

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

- **Auteur** : [Votre Nom]
- **Email** : [votre.email@exemple.com]
- **LinkedIn** : [Votre Profil]

---

> 💡 **Note** : Ce projet est conçu à des fins pédagogiques et de démonstration. Pour un usage en production industrielle, des adaptations et certifications supplémentaires peuvent être nécessaires.