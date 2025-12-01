package com.neurofleetx.controller;

import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173") 
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    
    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }

    
    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        vehicle.setLastSeen(LocalDateTime.now());
        if (vehicle.getStatus() == null || vehicle.getStatus().isEmpty()) {
            vehicle.setStatus("AVAILABLE");
        }
        return vehicleRepository.save(vehicle);
    }

    
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle updatedVehicle) {
        return vehicleRepository.findById(id)
                .map(existingVehicle -> {
                    existingVehicle.setModel(updatedVehicle.getModel());
                    existingVehicle.setRegistrationNumber(updatedVehicle.getRegistrationNumber());
                    existingVehicle.setCapacity(updatedVehicle.getCapacity());
                    existingVehicle.setStatus(updatedVehicle.getStatus());
                    existingVehicle.setLastSeen(LocalDateTime.now());
                    return vehicleRepository.save(existingVehicle);
                })
                .orElse(null);
    }

    
    @DeleteMapping("/{id}")
    public Map<String, String> deleteVehicle(@PathVariable Long id) {
        if (!vehicleRepository.existsById(id)) {
            return Map.of("message", "Vehicle not found");
        }
        vehicleRepository.deleteById(id);
        return Map.of("message", "Vehicle deleted successfully");
    }
}
