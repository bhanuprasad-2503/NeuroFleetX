package com.neurofleetx.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "http://localhost:5173") 
public class MetricsController {

    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminMetrics() {
        Map<String, Object> metrics = Map.of(
                "fleetUtilization", 85,
                "activeBookings", 120,
                "maintenancePending", 5,
                "reportGenerated", true
        );
        return ResponseEntity.ok(metrics);
    }

    @PreAuthorize("hasRole('DISPATCHER')")
    @GetMapping("/dispatcher")
    public ResponseEntity<Map<String, Object>> getDispatcherMetrics() {
        Map<String, Object> metrics = Map.of(
                "activeBookings", 12,
                "availableVehicles", 20,
                "avgResponseMins", 8
        );
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublicMetrics() {
        Map<String, Object> metrics = Map.of(
                "uptimeHours", 256,
                "apiVersion", "v1.0.0",
                "status", "Operational"
        );
        return ResponseEntity.ok(metrics);
    }
}
