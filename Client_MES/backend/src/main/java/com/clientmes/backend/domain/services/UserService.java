package com.clientmes.backend.domain.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.User;
import com.clientmes.backend.infra.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveOrUpdateUser(User user) {
        // Si l'utilisateur existe déjà (même username), on le met à jour
        User existing = userRepository.findByUsername(user.getUsername());
        if (existing != null) {
            existing.updateUser(user);
            return userRepository.saveAndFlush(existing);
        } else {
            return userRepository.saveAndFlush(user);
        }
    }
    
    public User getUser() {
        return userRepository.findAll().getFirst();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
