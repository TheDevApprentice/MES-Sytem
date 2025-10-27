package com.clientmes.backend.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.UserPreference;

@Service
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
}
