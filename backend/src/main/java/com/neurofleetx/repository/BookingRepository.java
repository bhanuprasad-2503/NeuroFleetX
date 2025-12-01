package com.neurofleetx.repository;

import com.neurofleetx.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    
    List<Booking> findByStatus(String status);
    List<Booking> findByStatusIn(List<String> statuses);
    long countByStatusIn(List<String> statuses);
}
