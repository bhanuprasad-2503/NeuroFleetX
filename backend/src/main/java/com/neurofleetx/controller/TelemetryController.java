package com.neurofleetx.controller;

import com.neurofleetx.repository.TelemetryRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "http://localhost:5173")
public class TelemetryController {

    private final TelemetryRepository telemetryRepository;

    public TelemetryController(TelemetryRepository telemetryRepository) {
        this.telemetryRepository = telemetryRepository;
    }

    
    @GetMapping
    public List<Map<String, Object>> getAllTelemetryData() {

        List<Object[]> rows = telemetryRepository.findAllWithVehicleRegistration();

        return rows.stream().map(row -> Map.of(
                "id", row[0],
                "vehicleId", row[1],
                "vehicleRegistration", row[2],   
                "recordedAt", row[3],
                "lat", row[4],
                "lng", row[5],
                "fuelLevel", row[6],
                "engineTemp", row[7],
                "mileage", row[8]
        )).toList();
    }

    
    @GetMapping("/vehicle/{vehicleId}")
    public List<Map<String, Object>> getTelemetryByVehicleId(@PathVariable Long vehicleId) {

        
        List<Object[]> rows = telemetryRepository.findByVehicleWithRegistration(vehicleId);

        return rows.stream().map(row -> Map.of(
                "id", row[0],
                "vehicleId", row[1],
                "vehicleRegistration", row[2],
                "recordedAt", row[3],
                "lat", row[4],
                "lng", row[5],
                "fuelLevel", row[6],
                "engineTemp", row[7],
                "mileage", row[8]
        )).toList();
    }

    
    @PostMapping
    public Map<String, Object> addTelemetry(@RequestBody Map<String, Object> body) {

        Long vehicleId = Long.valueOf(body.get("vehicleId").toString());
        Double lat = Double.valueOf(body.get("lat").toString());
        Double lng = Double.valueOf(body.get("lng").toString());
        Double fuelLevel = Double.valueOf(body.get("fuelLevel").toString());
        Double engineTemp = Double.valueOf(body.get("engineTemp").toString());
        Long mileage = Long.valueOf(body.get("mileage").toString());

        
        telemetryRepository.insertTelemetry(
                vehicleId,
                LocalDateTime.now(),
                lat,
                lng,
                fuelLevel,
                engineTemp,
                mileage
        );

        return Map.of("message", "Telemetry added successfully");
    }

    
    @DeleteMapping("/{id}")
    public Map<String, String> deleteTelemetry(@PathVariable Long id) {

        telemetryRepository.deleteById(id);
        return Map.of("message", "Telemetry record deleted successfully");
    }
}
