package com.clientmes.backend.domain.entities;

import java.time.Instant;
import java.util.Objects;

import jakarta.persistence.*;

@Entity
@Table(name = "token")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", referencedColumnName = "id", unique = true)
    private UserSession session;

    @Column(name = "jwt_token_value")
    private String jwtTokenValue;

    @Column(name = "jwt_token_expires_at")
    private Instant jwtTokenExpiresAt;

    @Column(name = "refresh_token_value")
    private String refreshTokenValue;

    @Column(name = "refresh_token_expires_at")
    private Instant refreshTokenExpiresAt;

    protected Token () {}
    public Token(UserSession session, String jwtTokenValue, Instant jwtTokenExpiresAt, String refreshTokenValue, Instant refreshTokenExpiresAt) {
        Objects.requireNonNull(session);
        Objects.requireNonNull(jwtTokenValue);
        Objects.requireNonNull(jwtTokenExpiresAt);
        Objects.requireNonNull(refreshTokenValue);
        Objects.requireNonNull(refreshTokenExpiresAt);

        this.session = session;
        this.jwtTokenValue = jwtTokenValue;
        this.jwtTokenExpiresAt = jwtTokenExpiresAt;
        this.refreshTokenValue = refreshTokenValue;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    }
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserSession getSession() { return session; }
    public void setSession(UserSession session) { this.session = session; }
    public String getJwtTokenValue() { return jwtTokenValue; }
    public void setJwtTokenValue(String jwtTokenValue) { this.jwtTokenValue = jwtTokenValue; }
    public Instant getJwtTokenExpiresAt() { return jwtTokenExpiresAt; }
    public void setJwtTokenExpiresAt(Instant jwtTokenExpiresAt) { this.jwtTokenExpiresAt = jwtTokenExpiresAt; }
    public String getRefreshTokenValue() { return refreshTokenValue; }
    public void setRefreshTokenValue(String refreshTokenValue) { this.refreshTokenValue = refreshTokenValue; }
    public Instant getRefreshTokenExpiresAt() { return refreshTokenExpiresAt; }
    public void setRefreshTokenExpiresAt(Instant refreshTokenExpiresAt) { this.refreshTokenExpiresAt = refreshTokenExpiresAt; }

    @Override
    public String toString() {
        return "Token [id=" + id + ", session=" + session + ", jwtTokenValue=" + jwtTokenValue + ", jwtTokenExpiresAt=" + jwtTokenExpiresAt + ", refreshTokenValue=" + refreshTokenValue + ", refreshTokenExpiresAt=" + refreshTokenExpiresAt + "]";
    }
}
