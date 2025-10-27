package com.clientmes.backend.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.clientmes.backend.domain.entities.Token;
import com.clientmes.backend.domain.entities.User;
import com.clientmes.backend.domain.entities.UserPreference;
import com.clientmes.backend.domain.entities.UserSession;
import com.clientmes.backend.domain.services.UserPreferenceService;
import com.clientmes.backend.domain.services.UserService;
import com.clientmes.backend.domain.services.UserSessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

/**
 * Contrôleur principal pour les endpoints racine, tests et authentification
 * simulée.
 * À remplacer par un proxy vers le backend central dès que possible.
 */
@RestController
public class RootController {
    private final UserSessionService userSessionService;
    private final UserService userService;
    private final UserPreferenceService userPreferenceService;

    @Autowired
    public RootController(UserSessionService userSessionService, UserService userService, UserPreferenceService userPreferenceService) {
        this.userSessionService = userSessionService;
        this.userService = userService;
        this.userPreferenceService = userPreferenceService;
    }

    /**
     * Endpoint de test simple pour vérifier l'accès API sécurisée.
     */
    @GetMapping("/api/hello")
    public String hello() {
        // Utilisation de l'interface DbAccessInterface
        try {
            return "Hello MES!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur accès DB: " + e.getMessage();
        }
    }

    /**
     * Simule une authentification locale (admin/admin).
     * Crée une session côté Spring si succès.
     * À remplacer par un relais vers le backend central.
     */
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        try {
            String origin = request.getHeader("Origin");
            System.out.println("ORIGIN: " + origin);
            String username = credentials.get("username");
            String password = credentials.get("password");
            if ("admin".equals(username) && "admin".equals(password)) {
                // Crée la session si absente
                HttpSession session = request.getSession(true);

                // Crée une authentification Spring Security et la place dans la session
                org.springframework.security.core.Authentication auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        java.util.List
                                .of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
                session.setAttribute("SPRING_SECURITY_CONTEXT",
                        org.springframework.security.core.context.SecurityContextHolder.getContext());

                // Vérifie si l'utilisateur existe déjà, sinon le créer avec ses préférences par défaut
                User user = userService.findByUsername(username);
                if (user == null) {
                    user = new User(username, "Administrateur", "admin@local", "ROLE_USER");
                    user = userService.saveOrUpdateUser(user);

                    UserPreference pref = new UserPreference(user, "light", "fr", true);
                    userPreferenceService.savePreference(pref);
                }
                
                UserSession userSession = user.createUserSession();
                // Sauvegarde la session (cascade sur token)
                userSessionService.save(userSession);
                
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Login success"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "success", false,
                                "message", "Identifiants invalides"));
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du login : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Erreur serveur lors du login"));
        }
    }

    @GetMapping("/api/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }

    /**
     * Renvoie le displayName pour un username donné (non protégé).
     */
    @GetMapping("/api/user/display-name")
    public ResponseEntity<?> getUserDisplayName() {
        try {
            User user = userService.getUser();
            if (user != null && user.getDisplayName() != null && !user.getDisplayName().isBlank()) {
                return ResponseEntity.ok(Map.of("displayName", user.getDisplayName()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server error"));
        }
    }
    /**
     * Renvoie le displayName pour un username donné (non protégé).
     */
    @GetMapping("/api/user/preference")
    public ResponseEntity<?> getUserPreference() {
        try {
            User user = userService.getUser();
            if (user != null && user.getPreferences() != null && !user.getPreferences().isEmpty()) {
                return ResponseEntity.ok(Map.of("preferences", user.getPreferences()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server error"));
        }
    }
    /**
     * Vérifie si l'utilisateur est authentifié (reauth).
     * Retourne 200 si session valide, 403 sinon (ne crée pas de session).
     */
    @GetMapping("/api/reauth")
    public ResponseEntity<?> reauth(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "message", "Aucune session utilisateur."));
        }
        var ctx = session.getAttribute("SPRING_SECURITY_CONTEXT");
        if (ctx instanceof org.springframework.security.core.context.SecurityContext secCtx
                && secCtx.getAuthentication() != null
                && secCtx.getAuthentication().isAuthenticated()) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Session utilisateur valide."));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "success", false,
                "message", "Session invalide ou expirée."));
    }

    /**
     * Invalide la session pour simuler un logout.
     */
    @GetMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Récupère le nom d'utilisateur courant depuis le contexte de sécurité
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null) ? auth.getName() : null;
        User user = userService.findByUsername(username);
        System.out.println("DEV logout request for user: " + user.toString());
        if (user != null) {
            try {
                user.deleteUserSession();
                userService.saveOrUpdateUser(user);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        request.getSession().invalidate();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout success"));
    }
}
