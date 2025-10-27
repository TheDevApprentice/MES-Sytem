package com.clientmes.backend.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.User;

@Service
public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
}