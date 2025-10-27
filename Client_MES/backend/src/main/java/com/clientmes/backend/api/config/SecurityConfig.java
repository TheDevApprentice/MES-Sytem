package com.clientmes.backend.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig {

    /**
     * Force les attributs Secure, HttpOnly et SameSite sur le cookie JSESSIONID.
     */
    @Bean
    public org.springframework.boot.web.servlet.server.CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        // SameSite=Strict pour la session
        return org.springframework.boot.web.servlet.server.CookieSameSiteSupplier.ofStrict();
    }

    @Bean
    public org.springframework.boot.web.servlet.ServletContextInitializer servletContextInitializer() {
        return servletContext -> {
            // Force Secure et HttpOnly sur JSESSIONID
            servletContext.getSessionCookieConfig().setHttpOnly(true);
            servletContext.getSessionCookieConfig().setSecure(true); // En local, nécessite HTTPS sinon à désactiver temporairement
            servletContext.getSessionCookieConfig().setName("JSESSIONID");
            servletContext.getSessionCookieConfig().setPath("/");
        };
    }


    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService userDetailsService() {
        // Désactive l'utilisateur par défaut de Spring Security
        return username -> null;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("https://localhost:5173", "https://localhost:5135")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
        .redirectToHttps(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/h2-console/**",
                                "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                                "/api/login", "/api/reauth", "/api/user/display-name", "/api/user/preference")
                        .permitAll()
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf
                        .csrfTokenRepository(customCsrfTokenRepository())
                        .ignoringRequestMatchers("/h2-console/**", "/api/login", "/api/reauth", "/api/csrf","/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**","/api/user/display-name", "/api/user/preference"))
                .headers(headers -> headers.disable())
                .formLogin(form -> form.disable()) // Désactive le formulaire login HTML
                .httpBasic(httpBasic -> httpBasic.disable()) // Désactive HTTP Basic
                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                org.springframework.security.config.http.SessionCreationPolicy.IF_REQUIRED));
        return http.build();
    }

    /**
     * Cookie CSRF sécurisé (SameSite=Strict, Secure)
     */
    @Bean
    public CookieCsrfTokenRepository customCsrfTokenRepository() {
        CookieCsrfTokenRepository repo = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repo.setCookiePath("/");
        repo.setSecure(true); // Nécessite HTTPS, à adapter si besoin
        repo.setCookieName("XSRF-TOKEN");
        // SameSite n'est pas configurable nativement avant Spring Security 6, mais on peut le forcer via un filtre custom si besoin
        return repo;
    }
}