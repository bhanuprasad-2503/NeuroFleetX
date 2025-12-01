package com.neurofleetx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.neurofleetx.entity.Telemetry;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {

    // 🔹 Fetch all telemetry with vehicle registration
    @Query(value = """
        SELECT t.id, t.vehicle_id, v.registration_number, t.recorded_at,
               t.lat, t.lng, t.fuel_level, t.engine_temp, t.mileage
        FROM telemetry t
        JOIN vehicle v ON t.vehicle_id = v.id
        ORDER BY t.recorded_at DESC
    """, nativeQuery = true)
    List<Object[]> findAllWithVehicleRegistration();

    // 🔹 Fetch telemetry for a specific vehicle
    @Query(value = """
        SELECT t.id, t.vehicle_id, v.registration_number, t.recorded_at,
               t.lat, t.lng, t.fuel_level, t.engine_temp, t.mileage
        FROM telemetry t
        JOIN vehicle v ON t.vehicle_id = v.id
        WHERE t.vehicle_id = :vehicleId
        ORDER BY t.recorded_at DESC
    """, nativeQuery = true)
    List<Object[]> findByVehicleWithRegistration(Long vehicleId);

    // 🔹 Insert new telemetry row
    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO telemetry (vehicle_id, recorded_at, lat, lng, 
                               fuel_level, engine_temp, mileage)
        VALUES (:vehicleId, :recordedAt, :lat, :lng, :fuel, :temp, :mileage)
    """, nativeQuery = true)
    void insertTelemetry(Long vehicleId,
                         LocalDateTime recordedAt,
                         Double lat,
                         Double lng,
                         Double fuel,
                         Double temp,
                         Long mileage);
}
