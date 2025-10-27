package com.clientmes.backend.domain.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
public class UserSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String username;
    private String roles; // JSON-encoded roles
    private Instant expiresAt;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private Token token;

    protected UserSession () {}
    public UserSession(String username, String roles, Instant expiresAt) {
        Objects.requireNonNull(username);
        Objects.requireNonNull(roles);
        Objects.requireNonNull(expiresAt);
        
        this.username = username;
        this.roles = roles;
        this.expiresAt = expiresAt;
    }

    // Getters and setters
    public String getId() { return id; }
    protected void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    protected void setUsername(String username) { this.username = username; }
    public String getRoles() { return roles; }
    public User getUser() { return user; }
    protected void setUser(User user) { this.user = user; }
    public Token getToken() { return token; }
    protected void setToken(Token token) { this.token = token; }
    protected void setRoles(String roles) { this.roles = roles; }
    public Instant getExpiresAt() { return expiresAt; }
    protected void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    
    public boolean isExpired() { return expiresAt.isBefore(Instant.now()); }

    /**
     * Définit simultanément l'utilisateur et le token en veillant à maintenir la cohérence
     * des deux côtés des relations bidirectionnelles.
     */
    public UserSession updateSession(User user, Token token) {
        Objects.requireNonNull(user);
        Objects.requireNonNull(token);

        this.user = user;
        user.setSession(this);
        this.token = token;
        token.setSession(this);
        return this;
    }
 
    @Override
    public String toString() {
        return "UserSession [id=" + id + ", username=" + username + ", roles=" + roles + ", expiresAt=" + expiresAt + "]";
    }
}
