package com.clientmes.backend.domain.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.Token;
import com.clientmes.backend.infra.TokenRepository;

@Service
public class TokenStorageService {
    private final TokenRepository tokenRepository;

    @Autowired
    public TokenStorageService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Token findBySessionId(String sessionId) {
        try {
            return tokenRepository.findBySession_Id(sessionId);
        } catch (Exception e) {
            System.err.println("Error finding token for session ID: " + sessionId + " - " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
