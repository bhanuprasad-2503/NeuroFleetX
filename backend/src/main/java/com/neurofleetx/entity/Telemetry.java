package com.neurofleetx.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry")
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lng")
    private Double lng;

    @Column(name = "fuel_level", nullable = false)
    private BigDecimal fuelLevel;

    @Column(name = "engine_temp", nullable = false)
    private BigDecimal engineTemp;

    @Column(nullable = false)
    private Long mileage;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    
    public Telemetry() {}

    
    public Telemetry(Long vehicleId, LocalDateTime recordedAt, Double lat, Double lng,
                     BigDecimal fuelLevel, BigDecimal engineTemp, Long mileage) {
        this.vehicleId = vehicleId;
        this.recordedAt = recordedAt;
        this.lat = lat;
        this.lng = lng;
        this.fuelLevel = fuelLevel;
        this.engineTemp = engineTemp;
        this.mileage = mileage;
    }

    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public BigDecimal getFuelLevel() {
        return fuelLevel;
    }

    public void setFuelLevel(BigDecimal fuelLevel) {
        this.fuelLevel = fuelLevel;
    }

    public BigDecimal getEngineTemp() {
        return engineTemp;
    }

    public void setEngineTemp(BigDecimal engineTemp) {
        this.engineTemp = engineTemp;
    }

    public Long getMileage() {
        return mileage;
    }

    public void setMileage(Long mileage) {
        this.mileage = mileage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
