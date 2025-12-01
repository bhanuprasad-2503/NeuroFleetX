package com.neurofleetx.controller;

import com.neurofleetx.entity.Booking;
import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;

    public BookingController(BookingRepository bookingRepository, VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAll();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Booking b : bookings) {

            Vehicle vehicle = null;
            if (b.getVehicleId() != null) {
                vehicle = vehicleRepository.findById(b.getVehicleId()).orElse(null);
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("customerName", b.getCustomerName());
            map.put("pickupLocation", b.getPickupLocation());
            map.put("dropoffLocation", b.getDropoffLocation());
            map.put("scheduledAt", b.getScheduledAt());
            map.put("status", b.getStatus() != null ? b.getStatus() : "PENDING");

            // Vehicle details
            map.put("vehicleId", b.getVehicleId());
            map.put("vehicleRegistration", vehicle != null ? vehicle.getRegistrationNumber() : "TBD");
            map.put("vehicleModel", vehicle != null ? vehicle.getModel() : "Unknown Vehicle");
            map.put("createdAt", b.getCreatedAt());

            responseList.add(map);
        }

        return responseList;
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        if (booking.getScheduledAt() == null) {
            booking.setScheduledAt(LocalDateTime.now());
        }
        if (booking.getStatus() == null) {
            booking.setStatus("PENDING");
        }
        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        return bookingRepository.findById(id)
                .map(existingBooking -> {
                    existingBooking.setCustomerName(updatedBooking.getCustomerName());
                    existingBooking.setPickupLocation(updatedBooking.getPickupLocation());
                    existingBooking.setDropoffLocation(updatedBooking.getDropoffLocation());
                    existingBooking.setScheduledAt(updatedBooking.getScheduledAt());
                    existingBooking.setVehicleId(updatedBooking.getVehicleId());
                    existingBooking.setStatus(updatedBooking.getStatus());
                    return bookingRepository.save(existingBooking);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteBooking(@PathVariable Long id) {
        Map<String, String> resp = new HashMap<>();
        if (!bookingRepository.existsById(id)) {
            resp.put("message", "Booking not found");
            return resp;
        }
        bookingRepository.deleteById(id);
        resp.put("message", "Booking deleted successfully");
        return resp;
    }

    
    @PostMapping("/recommend")
    public Map<String, Object> recommendVehicle(@RequestBody Map<String, Integer> request) {

        int passengers = request.getOrDefault("passengers", 1);

        Optional<Vehicle> candidate = vehicleRepository.findAll().stream()
                .filter(v -> {
                    String status = v.getStatus() != null ? v.getStatus() : "";
                    return "AVAILABLE".equalsIgnoreCase(status)
                            && v.getCapacity() != null
                            && v.getCapacity() >= passengers;
                })
                .findFirst();

        Map<String, Object> result = new HashMap<>();

        if (candidate.isPresent()) {
            Vehicle vehicle = candidate.get();

            result.put("vehicleId", vehicle.getId());
            result.put("vehicleRegistration", vehicle.getRegistrationNumber());
            result.put("vehicleModel", vehicle.getModel());
            result.put("capacity", vehicle.getCapacity());
            result.put("message", "Recommended vehicle found");
        } else {
            result.put("vehicleId", null);
            result.put("vehicleRegistration", null);
            result.put("vehicleModel", null);
            result.put("message", "No available vehicle found");
        }

        return result;
    }

    
    @PostMapping("/{id}/assign")
    public Map<String, Object> assignVehicle(@PathVariable Long id,
                                             @RequestBody Map<String, Long> body) {

        Map<String, Object> response = new HashMap<>();

        Long vehicleId = body.get("vehicleId");
        if (vehicleId == null) {
            response.put("success", false);
            response.put("message", "vehicleId is required");
            return response;
        }

        Optional<Booking> optBooking = bookingRepository.findById(id);
        if (!optBooking.isPresent()) {
            response.put("success", false);
            response.put("message", "Booking not found");
            return response;
        }
        Booking booking = optBooking.get();

        Optional<Vehicle> optVehicle = vehicleRepository.findById(vehicleId);
        if (!optVehicle.isPresent()) {
            response.put("success", false);
            response.put("message", "Vehicle not found");
            return response;
        }
        Vehicle vehicle = optVehicle.get();

        String status = vehicle.getStatus() != null ? vehicle.getStatus() : "";
        if (!"AVAILABLE".equalsIgnoreCase(status)) {
            response.put("success", false);
            response.put("message", "Vehicle not available");
            return response;
        }

        // Assign
        booking.setVehicleId(vehicle.getId());
        booking.setStatus("ASSIGNED");
        bookingRepository.save(booking);

        // Mark vehicle IN_USE
        vehicle.setStatus("IN_USE");
        vehicleRepository.save(vehicle);

        response.put("success", true);
        response.put("message", "Vehicle assigned");
        response.put("vehicleId", vehicle.getId());
        return response;
    }

    @GetMapping("/available-vehicles")
    public List<Map<String, Object>> getAvailableVehicles() {

        List<Map<String, Object>> list = new ArrayList<>();

        for (Vehicle v : vehicleRepository.findAll()) {
            String status = v.getStatus() != null ? v.getStatus() : "";
            if ("AVAILABLE".equalsIgnoreCase(status)) {

                Map<String, Object> m = new HashMap<>();
                m.put("id", v.getId());
                m.put("registrationNumber", v.getRegistrationNumber());
                m.put("model", v.getModel());
                m.put("capacity", v.getCapacity());

                list.add(m);
            }
        }

        return list;
    }

    @GetMapping("/recent")
    public List<Map<String, Object>> getRecentBookings() {

        List<Booking> bookings = bookingRepository
                .findAll()
                .stream()
                .sorted(Comparator.comparing(Booking::getScheduledAt).reversed())
                .limit(5)
                .toList();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Booking b : bookings) {

            Vehicle vehicle = null;
            if (b.getVehicleId() != null) {
                vehicle = vehicleRepository.findById(b.getVehicleId()).orElse(null);
            }

            Map<String, Object> m = new HashMap<>();
            m.put("customerName", b.getCustomerName());
            m.put("status", b.getStatus());
            m.put("vehicle", vehicle != null ? vehicle.getModel() : "Not Assigned");
            m.put("scheduledAt", b.getScheduledAt());

            result.add(m);
        }

        return result;
    }
}
