package com.electromart.repository;

import com.electromart.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for the 'password_reset_token' table.
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    /**
     * Find the most recent unused token for a given token_hash.
     * Used for OTP verification (registration & password reset).
     */
    Optional<PasswordResetToken> findTopByTokenHashAndUsedAtIsNullOrderByCreatedAtDesc(String tokenHash);
}
