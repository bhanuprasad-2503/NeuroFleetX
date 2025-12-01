package com.neurofleetx.controller;

import com.neurofleetx.entity.AppUser;
import com.neurofleetx.repository.UserRepository;
import com.neurofleetx.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ SIGNUP Endpoint
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AppUser user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
            }

            // Encode password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }

            AppUser savedUser = userRepository.save(user);

            // ✅ Generate token with email + role
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Signup successful");
            response.put("token", token);
            response.put("role", savedUser.getRole());
            response.put("email", savedUser.getEmail());
            response.put("fullName", savedUser.getFullName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ LOGIN Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");

            AppUser user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check password match
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid password"));
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("status", "AuthController is working fine ✅"));
    }
}
