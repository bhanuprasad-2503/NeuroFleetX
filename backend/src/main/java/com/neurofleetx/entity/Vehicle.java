package com.neurofleetx.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle")  
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    
    public Vehicle() {
    }

    public Vehicle(String registrationNumber, String model, String status, Integer capacity, LocalDateTime lastSeen) {
        this.registrationNumber = registrationNumber;
        this.model = model;
        this.status = status;
        this.capacity = capacity;
        this.lastSeen = lastSeen;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
