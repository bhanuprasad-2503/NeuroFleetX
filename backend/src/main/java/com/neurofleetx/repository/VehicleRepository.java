package com.neurofleetx.repository;

import com.neurofleetx.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * Finds all vehicles by their current status (e.g., AVAILABLE, IN_SERVICE, MAINTENANCE).
     *
     * @param status the status of the vehicles
     * @return list of vehicles with the given status
     */
    List<Vehicle> findByStatus(String status);

    /**
     * Finds vehicles with capacity greater than or equal to the specified value.
     *
     * @param capacity minimum capacity required
     * @return list of vehicles that meet or exceed the capacity
     */
    List<Vehicle> findByCapacityGreaterThanEqual(Integer capacity);

    /**
     * Finds a vehicle by its unique registration number.
     *
     * @param registrationNumber the vehicle's registration number
     * @return the matching vehicle, if found
     */
    Vehicle findByRegistrationNumber(String registrationNumber);
}
