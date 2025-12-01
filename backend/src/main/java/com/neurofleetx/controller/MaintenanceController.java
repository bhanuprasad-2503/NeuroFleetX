package com.neurofleetx.controller;

import com.neurofleetx.entity.MaintenanceAlert;
import com.neurofleetx.repository.MaintenanceAlertRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:5173") 
public class MaintenanceController {

    private final MaintenanceAlertRepository maintenanceAlertRepository;

    public MaintenanceController(MaintenanceAlertRepository maintenanceAlertRepository) {
        this.maintenanceAlertRepository = maintenanceAlertRepository;
    }

    
    @GetMapping
    public List<MaintenanceAlert> getAllAlerts() {
        return maintenanceAlertRepository.findAll();
    }

    @PostMapping
    public MaintenanceAlert createAlert(@RequestBody MaintenanceAlert alert) {
        return maintenanceAlertRepository.save(alert);
    }

    
    @DeleteMapping("/{id}")
    public Map<String, String> deleteAlert(@PathVariable Long id) {
        if (!maintenanceAlertRepository.existsById(id)) {
            return Map.of("message", "Maintenance alert not found");
        }
        maintenanceAlertRepository.deleteById(id);
        return Map.of("message", "Maintenance alert deleted successfully");
    }
}
