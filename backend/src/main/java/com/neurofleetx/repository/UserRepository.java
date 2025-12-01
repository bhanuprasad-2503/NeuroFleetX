package com.neurofleetx.repository;

import com.neurofleetx.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {

    /**
     * Finds a user by their email address.
     *
     * @param email the user's email
     * @return an Optional containing the AppUser if found, otherwise empty
     */
    Optional<AppUser> findByEmail(String email);
}
