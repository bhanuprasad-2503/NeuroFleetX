package com.neurofleetx.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "maintenance_alerts")
public class MaintenanceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long vehicleId;

    @Column(nullable = false)
    private String vehicleRegistration;

    @Column(nullable = false)
    private Double riskScore;

    @Column(length = 500)
    private String recommendation;

    
    public MaintenanceAlert() {
    }

    public MaintenanceAlert(Long vehicleId, String vehicleRegistration, Double riskScore, String recommendation) {
        this.vehicleId = vehicleId;
        this.vehicleRegistration = vehicleRegistration;
        this.riskScore = riskScore;
        this.recommendation = recommendation;
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

    public String getVehicleRegistration() {
        return vehicleRegistration;
    }

    public void setVehicleRegistration(String vehicleRegistration) {
        this.vehicleRegistration = vehicleRegistration;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
