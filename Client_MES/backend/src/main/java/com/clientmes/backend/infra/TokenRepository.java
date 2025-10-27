package com.clientmes.backend.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.Token;

@Service
public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findBySession_Id(String sessionId); 
}
