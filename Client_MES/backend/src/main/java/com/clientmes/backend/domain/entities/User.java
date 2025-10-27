package com.clientmes.backend.domain.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true, nullable = false)
    private String username;
    private String displayName;
    private String email;
    private String roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<UserPreference> preferences;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserSession session;

    protected User () {}

    // Getters, setters, constructors
    public User(String username, String displayName, String email, String roles) {
        Objects.requireNonNull(username);
        Objects.requireNonNull(displayName);
        Objects.requireNonNull(email);
        Objects.requireNonNull(roles);

        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.roles = roles;
    }

    public String getId() {
        return id;
    }

    protected void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    protected void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    protected void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    protected void setEmail(String email) {
        this.email = email;
    }

    public String getRoles() {
        return roles;
    }

    protected void setRoles(String roles) {
        this.roles = roles;
    }

    public Set<UserPreference> getPreferences() {
        return preferences;
    }

    protected void setPreferences(Set<UserPreference> preferences) {
        this.preferences = preferences;
    }

    public UserSession getSession() {
        return session;
    }

    protected void setSession(UserSession session) {
        this.session = session;
    }

    public User updateUser(User user) {
        this.setUsername(user.getUsername());
        this.setDisplayName(user.getDisplayName());
        this.setEmail(user.getEmail());
        this.setRoles(user.getRoles());
        this.setPreferences(user.getPreferences());
        this.setSession(user.getSession());
        return this;
    }

    public UserSession createUserSession() {
        // Crée la session liée à l'utilisateur
        UserSession sessionEntity = new UserSession(this.username, "ROLE_USER",
                java.time.Instant.now().plusSeconds(3600));
        sessionEntity.updateSession(this, new Token(
                sessionEntity,
                "admin", // jwtTokenValue
                java.time.Instant.now().plusSeconds(3600), // jwtTokenExpiresAt
                "admin", // refreshTokenValue
                java.time.Instant.now().plusSeconds(7200) // refreshTokenExpiresAt
        ));
        return sessionEntity;
    }

    /**
     * Supprime la session de l'utilisateur en maintenant la cohérence
     * bidirectionnelle.
     */
    public void deleteUserSession() {
        if (this.session != null) {
            // coupe le lien inverse pour que l'objet en mémoire reste cohérent
            this.setSession(null);
            return;
        }
        System.out.println("No session found for user: " + this.toString());
        throw new RuntimeException("No session found for user: " + this.toString());
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", username=" + username + ", displayName=" + displayName + ", email=" + email
                + ", roles=" + roles + "]";
    }
}
