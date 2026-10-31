package com.electromart.repository;

import com.electromart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for the 'users' table.
 * Spring auto-generates the SQL queries from these method names.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * SELECT * FROM users WHERE LOWER(email) = LOWER(?)
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * SELECT COUNT(*) FROM users WHERE LOWER(email) = LOWER(?)
     * Returns true if the email is already registered.
     */
    boolean existsByEmailIgnoreCase(String email);
}
