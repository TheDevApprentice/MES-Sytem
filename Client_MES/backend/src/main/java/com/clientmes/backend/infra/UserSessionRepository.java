package com.clientmes.backend.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.UserSession;

@Service
public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    UserSession findByUser_Id(String id);
}
