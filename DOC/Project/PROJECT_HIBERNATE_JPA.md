# Cours Complet JPA/Hibernate avec Spring Boot

## Table des Matières
1. [Introduction aux Concepts Fondamentaux](#1-introduction-aux-concepts-fondamentaux)
2. [Persistence Context et Entity Manager](#2-persistence-context-et-entity-manager)
3. [États des Entités (Entity Lifecycle)](#3-états-des-entités-entity-lifecycle)
4. [Relations entre Entités](#4-relations-entre-entités)
5. [Opérations CRUD](#5-opérations-crud)
6. [Gestion des Transactions](#6-gestion-des-transactions)
7. [Cascade et OrphanRemoval](#7-cascade-et-orphanremoval)
8. [Bonnes Pratiques](#8-bonnes-pratiques)
9. [Différences avec Entity Framework](#9-différences-avec-entity-framework)
10. [Analyse de Votre Problème Spécifique](#10-analyse-de-votre-problème-spécifique)

---

## 1. Introduction aux Concepts Fondamentaux

### Qu'est-ce que JPA ?
**JPA (Java Persistence API)** est une spécification Java qui définit une interface standard pour la persistance des données relationnelles. JPA n'est **pas une implémentation** - c'est juste un ensemble de règles et d'interfaces.

### Qu'est-ce que Hibernate ?
**Hibernate** est l'implémentation la plus populaire de JPA. C'est un framework ORM (Object-Relational Mapping) qui implémente toutes les spécifications JPA et ajoute des fonctionnalités supplémentaires.

### Architecture JPA/Hibernate dans Spring Boot

```
Application Spring Boot
        ↓
Spring Data JPA (abstraction)
        ↓
JPA API (spécification)
        ↓
Hibernate (implémentation)
        ↓
JDBC Driver
        ↓
Base de données
```

### Composants Clés

1. **EntityManager** : Interface principale pour interagir avec le persistence context
2. **Persistence Context** : Cache de premier niveau où les entités sont gérées
3. **Transaction** : Unité de travail qui encapsule plusieurs opérations
4. **Entity** : Objet Java mappé à une table de base de données

---

## 2. Persistence Context et Entity Manager

### Qu'est-ce que le Persistence Context ?

Le **Persistence Context** est le concept le plus important à comprendre en JPA. C'est :
- Un cache de premier niveau qui contient toutes les entités gérées
- Un environnement où les entités sont trackées pour les changements
- Lié à une transaction ou étendu sur plusieurs transactions

### Fonctionnement du Persistence Context

```java
// Quand vous faites ceci :
User user = userRepository.findById(1L);
user.setName("Nouveau nom");
// PAS BESOIN d'appeler save() !
// Les changements sont automatiquement détectés (dirty checking)
```

### Types de Persistence Context

#### 1. Transaction-Scoped (par défaut)
```java
@PersistenceContext
private EntityManager entityManager;
```
- Lié à une transaction
- Se ferme quand la transaction se termine
- Utilisé dans la plupart des cas

#### 2. Extended-Scoped
```java
@PersistenceContext(type = PersistenceContextType.EXTENDED)
private EntityManager entityManager;
```
- Peut s'étendre sur plusieurs transactions
- Utilisé dans les beans @Stateful

### Dirty Checking
Hibernate surveille automatiquement les changements sur les entités **managées** :

```java
@Transactional
public void updateUser(Long id) {
    User user = userRepository.findById(id).orElseThrow();
    // L'entité est maintenant MANAGED
    user.setName("Nouveau nom");
    // Hibernate détecte automatiquement le changement
    // Un UPDATE sera exécuté au commit de la transaction
}
```

---

## 3. États des Entités (Entity Lifecycle)

### Les 4 États d'une Entité

#### 1. **Transient (Nouveau)**
```java
User user = new User("John", "john@example.com");
// L'entité existe seulement en mémoire
// Pas d'ID, pas de lien avec la base
```

#### 2. **Managed (Persistent)**
```java
User user = userRepository.save(newUser);
// OU
User user = userRepository.findById(1L);
// L'entité est trackée par le Persistence Context
// Les changements sont automatiquement détectés
```

#### 3. **Detached (Détachée)**
```java
User user = userRepository.findById(1L);
// La transaction se termine, l'entité devient detached
// Les changements ne sont plus trackés
```

#### 4. **Removed (Supprimée)**
```java
User user = userRepository.findById(1L);
userRepository.delete(user);
// L'entité est marquée pour suppression
// La suppression aura lieu au commit
```

### Transitions d'États

```java
// Transient → Managed
User user = new User("John");
entityManager.persist(user); // ou repository.save(user)

// Managed → Detached
entityManager.detach(user); // ou fin de transaction

// Detached → Managed
User managedUser = entityManager.merge(user);

// Managed → Removed
entityManager.remove(user); // ou repository.delete(user)
```

---

## 4. Relations entre Entités

### @OneToOne - Relation Un-à-Un

#### Meilleure Pratique : Shared Primary Key
```java
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;
}

@Entity
public class UserProfile {
    @Id
    private Long id;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
}
```

### @OneToMany / @ManyToOne - Relation Un-à-Plusieurs

#### Unidirectionnelle (ManyToOne uniquement) - RECOMMANDÉE
```java
@Entity
public class Comment {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;
}

@Entity
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    
    // Pas de collection, utiliser des queries à la place
    public List<Comment> getComments() {
        return commentRepository.findByPost(this);
    }
}
```

#### Bidirectionnelle (si nécessaire)
```java
@Entity
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
    
    // Méthodes helper pour maintenir la cohérence
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
    }
    
    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setPost(null);
    }
}
```

### @ManyToMany - Relation Plusieurs-à-Plusieurs

```java
@Entity
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

---

## 5. Opérations CRUD

### Create (Création)

```java
// Méthode 1 : Spring Data JPA
@Transactional
public User createUser(User user) {
    return userRepository.save(user);
}

// Méthode 2 : EntityManager
@Transactional
public User createUser(User user) {
    entityManager.persist(user);
    return user;
}
```

### Read (Lecture)

```java
// Par ID
Optional<User> user = userRepository.findById(1L);

// Par query method
List<User> users = userRepository.findByName("John");

// Par JPQL
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);

// EntityManager
User user = entityManager.find(User.class, 1L);
```

### Update (Mise à jour)

```java
// Méthode 1 : Dirty Checking (RECOMMANDÉE)
@Transactional
public void updateUser(Long id, String newName) {
    User user = userRepository.findById(id).orElseThrow();
    user.setName(newName);
    // Pas besoin de save() !
}

// Méthode 2 : Merge pour entités détachées
@Transactional
public User updateDetachedUser(User detachedUser) {
    return entityManager.merge(detachedUser);
}
```

### Delete (Suppression)

```java
// Méthode 1 : Par entité managée
@Transactional
public void deleteUser(Long id) {
    User user = userRepository.findById(id).orElseThrow();
    userRepository.delete(user);
}

// Méthode 2 : Par ID
@Transactional
public void deleteUser(Long id) {
    userRepository.deleteById(id);
}

// Méthode 3 : Query personnalisée
@Transactional
@Modifying
@Query("DELETE FROM User u WHERE u.email = :email")
void deleteByEmail(@Param("email") String email);
```

---

## 6. Gestion des Transactions

### @Transactional - Annotation Clé

```java
@Service
public class UserService {
    
    @Transactional
    public void createUserWithProfile(User user, UserProfile profile) {
        // Toutes les opérations dans une seule transaction
        User savedUser = userRepository.save(user);
        profile.setUser(savedUser);
        profileRepository.save(profile);
        // Commit automatique à la fin
    }
    
    @Transactional(readOnly = true)
    public User getUser(Long id) {
        // Optimisation pour les lectures
        return userRepository.findById(id).orElseThrow();
    }
}
```

### Configuration des Transactions

```java
@Transactional(
    propagation = Propagation.REQUIRED,  // Défaut
    isolation = Isolation.READ_COMMITTED,
    timeout = 30,
    rollbackFor = Exception.class
)
public void complexOperation() {
    // Logique métier
}
```

### Flush vs Commit

```java
@Transactional
public void demonstrateFlush() {
    User user = new User("John");
    userRepository.save(user);
    
    // Flush : envoie les changements à la base mais ne commit pas
    entityManager.flush();
    
    // Les changements sont visibles dans la même transaction
    // mais pas dans d'autres transactions
    
    // Commit : se fait automatiquement à la fin de @Transactional
}
```

### save() vs saveAndFlush()

```java
// save() : ajoute à la persistence context
User user = userRepository.save(newUser);

// saveAndFlush() : ajoute ET flush immédiatement
User user = userRepository.saveAndFlush(newUser);
// Utiliser quand vous avez besoin de l'ID généré immédiatement
```

---

## 7. Cascade et OrphanRemoval

### Types de Cascade

```java
public enum CascadeType {
    ALL,        // Tous les types
    PERSIST,    // Création
    MERGE,      // Mise à jour
    REMOVE,     // Suppression
    REFRESH,    // Rafraîchissement
    DETACH      // Détachement
}
```

### Exemple Pratique

```java
@Entity
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToMany(
        mappedBy = "post",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Comment> comments = new ArrayList<>();
    
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
    }
    
    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setPost(null);
    }
}
```

### Différence Cascade vs OrphanRemoval

```java
// Cascade = CascadeType.REMOVE
post.getComments().clear();
postRepository.delete(post);
// Supprime le post ET tous ses commentaires

// orphanRemoval = true
post.getComments().remove(comment);
// Supprime le commentaire de la base car il n'a plus de parent
```

---

## 8. Bonnes Pratiques

### 1. Gestion des Relations

```java
// ❌ Éviter les relations bidirectionnelles OneToMany
@OneToMany(mappedBy = "post")
private List<Comment> comments; // Peut causer des performances

// ✅ Préférer les queries
public List<Comment> getComments(Post post) {
    return commentRepository.findByPost(post);
}
```

### 2. Fetch Strategy

```java
// ✅ Utilisez LAZY par défaut
@ManyToOne(fetch = FetchType.LAZY)
private User user;

// ✅ Utilisez JOIN FETCH si nécessaire
@Query("SELECT c FROM Comment c JOIN FETCH c.post WHERE c.id = :id")
Comment findByIdWithPost(@Param("id") Long id);
```

### 3. Transactions

```java
// ✅ Transactions courtes
@Transactional
public void updateUser(Long id, String name) {
    User user = userRepository.findById(id).orElseThrow();
    user.setName(name);
}

// ✅ ReadOnly pour les lectures
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    return userRepository.findAll();
}
```

### 4. Equals et HashCode

```java
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
```

---

## 9. Différences avec Entity Framework

### Concepts Équivalents

| Entity Framework | JPA/Hibernate |
|------------------|---------------|
| DbContext | EntityManager |
| DbSet | Repository |
| Change Tracker | Persistence Context |
| SaveChanges() | flush() / commit |
| Entry().State | Entity States |

### Différences Clés

#### 1. **Gestion des Changements**
```csharp
// Entity Framework
context.Users.Remove(user);
context.SaveChanges(); // Explicite
```

```java
// JPA/Hibernate
userRepository.delete(user);
// Ou simplement modifier une entité managée
user.setName("New Name"); // Pas besoin de save()
```

#### 2. **Chargement des Relations**
```csharp
// Entity Framework
context.Users.Include(u => u.Posts).ToList();
```

```java
// JPA/Hibernate
@Query("SELECT u FROM User u JOIN FETCH u.posts")
List<User> findAllWithPosts();
```

#### 3. **États des Entités**
- **EF** : Added, Modified, Deleted, Unchanged, Detached
- **JPA** : Transient, Managed, Detached, Removed

---

## 10. Analyse de Votre Problème Spécifique

### Pourquoi Votre Approche Fonctionne

```java
@GetMapping("/api/logout")
public ResponseEntity<?> logout(HttpServletRequest request) {
    User user = userService.findByUsername(username);
    if (user != null) {
        user.setSession(null);  // ✅ Entité managée
        userService.saveOrUpdateUser(user);  // ✅ Flush les changements
    }
    // ...
}
```

**Pourquoi ça marche :**
1. `user` est une entité **managée** (loaded from DB)
2. `user.setSession(null)` marque la relation comme modifiée
3. Avec `cascade = CascadeType.ALL` et `orphanRemoval = true`, la UserSession devient orpheline
4. Hibernate la supprime automatiquement

### Pourquoi l'Approche Directe Ne Marche Pas

```java
// ❌ Approche qui ne fonctionne pas
userSessionService.deleteUserSession(user.getId());
```

**Problème :**
- Vous essayez de supprimer directement la session
- Mais la relation dans `User` pointe toujours vers la session
- Hibernate ne peut pas maintenir la cohérence

### Solution Recommandée

```java
@Transactional
public void logout(String username) {
    User user = userRepository.findByUsername(username);
    if (user != null && user.getSession() != null) {
        // Approche 1 : Supprimer via la relation parent
        user.setSession(null);
        // Avec orphanRemoval=true, la session sera supprimée
        
        // Approche 2 : Supprimer explicitement (si pas de cascade)
        // UserSession session = user.getSession();
        // user.setSession(null);
        // userSessionRepository.delete(session);
    }
}
```

### Configuration Recommandée pour Vos Entités

```java
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToOne(
        mappedBy = "user", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true
    )
    private UserSession session;
    
    // Méthode helper
    public void clearSession() {
        if (this.session != null) {
            this.session.setUser(null);
            this.session = null;
        }
    }
}

@Entity
public class UserSession {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToOne(
        mappedBy = "session", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true
    )
    private Token token;
}
```

### Résumé des Concepts Clés

1. **Entités Managées** : Hibernate track automatiquement les changements
2. **Cascade** : Propage les opérations aux entités liées
3. **OrphanRemoval** : Supprime automatiquement les entités orphelines
4. **Persistence Context** : Cache de premier niveau qui gère le cycle de vie des entités
5. **Transactions** : Définissent les limites des opérations atomiques

La clé est de **toujours travailler avec des entités managées** et de **laisser Hibernate gérer la cohérence** plutôt que d'essayer de manipuler directement les relations.

---

## Conclusion

JPA/Hibernate est un framework puissant mais complexe. Les concepts clés à retenir :

1. **Persistence Context** = cache de premier niveau
2. **Entités managées** = changements automatiquement trackés
3. **Cascade et OrphanRemoval** = gestion automatique des relations
4. **Transactions** = limites des opérations atomiques
5. **Lazy Loading** = chargement à la demande

La différence principale avec Entity Framework est que Hibernate fait beaucoup plus de "magie" automatique, mais il faut comprendre comment cette magie fonctionne pour l'utiliser efficacement.

Votre problème initial était typique : vous essayiez de manipuler directement les entités enfant au lieu de passer par la relation parent, ce qui empêchait Hibernate de maintenir la cohérence du graphe d'objets.