package com.neurofleetx.controller;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class VehicleController {

    private final VehicleRepository repo;
    private final SimpMessagingTemplate msg;

    public VehicleController(VehicleRepository r, SimpMessagingTemplate m) {
        this.repo = r;
        this.msg = m;
    }

    // ✅ Fetch all vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔹 GET /api/vehicles requested by: " + (auth != null ? auth.getName() : "Anonymous"));

        return repo.findAll();
    }

    // ✅ Create new vehicle
    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle v) {
        v.setLastUpdated(LocalDateTime.now());
        Vehicle saved = repo.save(v);
        msg.convertAndSend("/topic/vehicles", saved);

        System.out.println("✅ Vehicle created: " + saved.getId());
        return saved;
    }

    // ✅ Update vehicle
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle v) {
        v.setId(id);
        v.setLastUpdated(LocalDateTime.now());
        Vehicle updated = repo.save(v);
        msg.convertAndSend("/topic/vehicles", updated);

        System.out.println("✏️ Vehicle updated: " + id);
        return updated;
    }

    // ✅ Delete vehicle
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteVehicle(@PathVariable Long id) {
        repo.deleteById(id);
        msg.convertAndSend("/topic/vehicles", Map.of("deleted", id));

        System.out.println("❌ Vehicle deleted: " + id);
        return Map.of("status", "deleted", "id", id);
    }
}
