package com.neurofleetx.controller;

import com.neurofleetx.model.User;
import com.neurofleetx.repository.UserRepository;
import com.neurofleetx.security.JwtUtil;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:*", allowCredentials = "true")
public class AuthController {

    private final UserRepository repo;
    private final AuthenticationManager auth;
    private final JwtUtil jwt;
    private final PasswordEncoder enc;

    public AuthController(UserRepository r, AuthenticationManager a, JwtUtil j, PasswordEncoder e) {
        this.repo = r;
        this.auth = a;
        this.jwt = j;
        this.enc = e;
    }

    // ✅ Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Reg r) {
        System.out.println("📥 Register request for user: " + r.getUsername());

        if (repo.findByUsername(r.getUsername()).isPresent()) {
            System.out.println("⚠️ User already exists: " + r.getUsername());
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }

        try {
            User u = new User();
            u.setUsername(r.getUsername());
            u.setPassword(enc.encode(r.getPassword()));
            u.setRole("USER"); // ✅ Default role
            repo.save(u);

            System.out.println("✅ User registered successfully: " + r.getUsername());
            return ResponseEntity.ok(Map.of("message", "registered"));
        } catch (Exception e) {
            System.out.println("❌ Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Registration failed"));
        }
    }

    // ✅ Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Log r) {
        System.out.println("🔐 Login attempt for: " + r.getUsername());

        try {
            auth.authenticate(new UsernamePasswordAuthenticationToken(r.getUsername(), r.getPassword()));
        } catch (Exception ex) {
            System.out.println("❌ Invalid credentials for: " + r.getUsername());
            return ResponseEntity.status(401).body(Map.of("error", "invalid"));
        }

        String token = jwt.generateToken(r.getUsername());
        System.out.println("✅ Login successful: " + r.getUsername());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @Data
    static class Reg {
        String username;
        String password;
    }

    @Data
    static class Log {
        String username;
        String password;
    }
}
