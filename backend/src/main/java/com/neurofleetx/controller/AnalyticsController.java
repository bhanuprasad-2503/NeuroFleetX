package com.neurofleetx.controller;

import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.MaintenanceAlertRepository;
import com.neurofleetx.repository.TelemetryRepository;
import com.neurofleetx.repository.VehicleRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final MaintenanceAlertRepository maintenanceAlertRepository;
    private final TelemetryRepository telemetryRepository;

    public AnalyticsController(
            VehicleRepository vehicleRepository,
            BookingRepository bookingRepository,
            MaintenanceAlertRepository maintenanceAlertRepository,
            TelemetryRepository telemetryRepository
    ) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
        this.maintenanceAlertRepository = maintenanceAlertRepository;
        this.telemetryRepository = telemetryRepository;
    }

    
    @GetMapping
    public Map<String, Object> getDashboardData() {

        long totalVehicles = vehicleRepository.count();

        // ✅ Active = PENDING + ASSIGNED (NOT COMPLETED)
        long activeBookings = bookingRepository.countByStatusIn(
                List.of("PENDING", "ASSIGNED")
        );

        long maintenanceAlerts = maintenanceAlertRepository.count();

        // ------- Fleet Utilization -------
        int fleetUtilization = 0;
        if (totalVehicles > 0) {
            fleetUtilization = (int) Math.round(((double) activeBookings / totalVehicles) * 100);
        }

        // ------- Telemetry Live Snapshot -------
        List<Object[]> telemetryRows = telemetryRepository.findAllWithVehicleRegistration();

        long activeTelemetryVehicles = telemetryRows.stream()
                .map(r -> ((Number) r[1]).longValue())  // vehicle_id
                .distinct()
                .count();

        double avgFuel = telemetryRows.stream()
                .mapToDouble(r -> ((Number) r[6]).doubleValue())  // fuel_level
                .average()
                .orElse(0.0);

        double avgTemp = telemetryRows.stream()
                .mapToDouble(r -> ((Number) r[7]).doubleValue())  // engine_temp
                .average()
                .orElse(0.0);

        String lastTelemetryTime = "";
        if (!telemetryRows.isEmpty()) {
            Object ts = telemetryRows.get(0)[3]; // recorded_at
            if (ts instanceof LocalDateTime) {
                lastTelemetryTime = ts.toString();
            } else if (ts instanceof java.sql.Timestamp) {
                lastTelemetryTime = ((java.sql.Timestamp) ts).toLocalDateTime().toString();
            } else if (ts != null) {
                lastTelemetryTime = ts.toString();
            }
        }

        Map<String, Object> telemetrySummary = Map.of(
                "activeVehicles", activeTelemetryVehicles,
                "avgFuelLevel", Math.round(avgFuel * 10) / 10.0,
                "avgEngineTemp", Math.round(avgTemp * 10) / 10.0,
                "lastUpdated", lastTelemetryTime
        );

        return Map.of(
                "fleetUtilization", fleetUtilization,
                "activeBookings", activeBookings,
                "maintenanceAlerts", maintenanceAlerts,
                "telemetry", telemetrySummary
        );
    }

    
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv() {

        StringBuilder sb = new StringBuilder();
        sb.append("vehicle_id,registration_number,model,status,capacity\n");

        vehicleRepository.findAll().forEach(v -> sb.append(v.getId())
                .append(",").append(v.getRegistrationNumber())
                .append(",").append(v.getModel())
                .append(",").append(v.getStatus())
                .append(",").append(v.getCapacity())
                .append("\n"));

        byte[] data = sb.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=vehicles.csv")
                .body(data);
    }
}
