 # Stratégie de sécurité et d’authentification du projet MES

## 1. Authentification centralisée basée sur JWT

Le projet MES utilise une stratégie de sécurité centralisée : tous les tokens d’accès (JWT) et refresh tokens sont générés et validés par le serveur central (VPS). Le backend local embarqué ne fait que valider les tokens et relayer les demandes d’authentification.

### 1.1 Processus d’authentification initiale
1. L’utilisateur saisit ses identifiants dans l’UI Electron.
2. L’UI transmet les identifiants au backend local (Spring Boot).
3. Le backend local relaie la demande au serveur central via une API sécurisée.
4. Le serveur central valide l’authentification et génère :
   - Un **JWT d’accès** (valable 15-30 min)
   - Un **refresh token** (valable plusieurs jours/semaines)
5. Le backend local reçoit ces tokens :
   - Stocke le JWT en mémoire (pour les requêtes courantes)
   - Stocke le refresh token de façon persistante et sécurisée sur le poste
   - Peut aussi stocker un cookie sécurisé si besoin
6. L’UI Electron utilise le backend local pour toutes les requêtes ; le backend local vérifie la session utilisateur via un cookie HttpOnly/Secure (jamais accessible au frontend) et ajoute le JWT dans l’en-tête Authorization lors des appels au serveur central. Le frontend ne voit jamais les tokens.

### 1.2 Reconnexion automatique après redémarrage
1. Au lancement de l’application (après redémarrage du poste) :
   - Le backend local vérifie la présence d’un refresh token valide dans son stockage sécurisé (H2, fichier chiffré, Credential Store, etc.)
2. Si le JWT d’accès est expiré :
   - Le backend local utilise le refresh token pour demander un nouveau JWT au serveur central.
   - Si le refresh token est valide, un nouveau JWT est généré et l’utilisateur est reconnecté automatiquement.
   - Si le refresh token est expiré ou révoqué, l’utilisateur doit se ré-authentifier.
3. L’UI Electron ne voit jamais les tokens : tout est géré par le backend local, qui expose uniquement l’état de connexion à l’UI. Le frontend ne manipule jamais les tokens JWT/refresh, ni aucun credential sensible.

### 1.3 Sécurisation du stockage local des tokens
- **Refresh token** :
  - À stocker dans H2 en mode fichier avec chiffrement (mot de passe fort, clé dérivée d’un secret local)
  - Ou dans un fichier chiffré (AES, clé stockée dans le Credential Store du système)
  - Jamais en clair sur le disque
- **Cookies** :
  - Si utilisés, doivent être HttpOnly, Secure, SameSite=Strict
- **Bonus sécurité** :
  - Possibilité d’ajouter un device ID unique par poste, stocké côté serveur central
  - Audit des accès et des refreshs côté serveur central

### 1.4 Alternatives et compléments possibles
- Utilisation d’une librairie de coffre-fort local (Keytar, Windows Credential Store, MacOS Keychain…) pour stocker le refresh token côté Electron si besoin
- Authentification biométrique locale pour déverrouiller l’accès au refresh token
- Expiration courte du JWT, expiration longue du refresh token, révocation possible côté serveur central

### 1.5 Schéma de workflow

```
[UI Electron] ⇄ [Backend local Spring Boot] ⇄ [Serveur central VPS]
    |                |                              |
    |   Login        |→ POST /auth/login →          |
    |                |← JWT + Refresh Token ←       |
    |                | Stockage sécurisé            |
    |                |→ API métiers (JWT) →         |
    |                | Si JWT expiré :              |
    |                |→ POST /auth/refresh →        |
    |                |← Nouveau JWT ←               |
```

## 2. Bonnes pratiques et évolutions
- Centralisation de la sécurité : aucune logique d’authentification sensible dans le backend local
- Migration future possible vers OAuth2/SSO si besoin
- Sécurité renforcée par la gestion locale des refresh tokens et l’absence de stockage en clair
- Possibilité d’intégration avec des solutions de coffre-fort système ou biométrie