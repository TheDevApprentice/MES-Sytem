package com.clientmes.backend.domain.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.UserSession;
import com.clientmes.backend.infra.UserSessionRepository;

@Service
public class UserSessionService {
    private final UserSessionRepository userSessionRepository;

    @Autowired
    public UserSessionService(UserSessionRepository userSessionRepository) {
        this.userSessionRepository = userSessionRepository;
    }

    public void save(UserSession session) {  
        try {
            userSessionRepository.saveAndFlush(session);
        } catch (Exception e) {
            System.err.println("Error saving session - " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<UserSession> getAllSessions() {  
        try {
            return userSessionRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error getting all sessions - " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public UserSession getSessionByUserId(String userId) {  
        try {
            return userSessionRepository.findByUser_Id(userId);
        } catch (Exception e) {
            System.err.println("Error getting session by ID - " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
