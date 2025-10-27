package com.clientmes.backend.domain.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clientmes.backend.domain.entities.User;
import com.clientmes.backend.domain.entities.UserPreference;
import com.clientmes.backend.infra.UserPreferenceRepository;

import java.util.List;

@Service
public class UserPreferenceService {
    private final UserPreferenceRepository userPreferenceRepository;

    @Autowired
    public UserPreferenceService(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public List<UserPreference> getPreferencesForUser(User user) {
        return user.getPreferences() != null ? List.copyOf(user.getPreferences()) : List.of();
    }

    public UserPreference savePreference(UserPreference pref) {
        return userPreferenceRepository.save(pref);
    }
}
