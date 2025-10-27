package com.clientmes.backend.domain.entities;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    @JsonBackReference
    private User user;

    @Column(name = "theme")
    private String theme;

    @Column(name = "language")
    private String language;

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled;

    protected UserPreference () {}
    // Getters, setters, constructors
    public UserPreference(User user, String theme, String language, Boolean notificationsEnabled) {
        Objects.requireNonNull(user);
        Objects.requireNonNull(theme);
        Objects.requireNonNull(language);
        Objects.requireNonNull(notificationsEnabled);
        
        this.user = user;
        this.theme = theme;
        this.language = language;
        this.notificationsEnabled = notificationsEnabled;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }

    
    @Override
    public String toString() {
        return "UserPreference [id=" + id + ", user=" + user + ", theme=" + theme + ", language=" + language + ", notificationsEnabled=" + notificationsEnabled + "]";
    }
}
