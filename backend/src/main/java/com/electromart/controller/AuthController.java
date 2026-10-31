package com.electromart.controller;

import com.electromart.dto.*;
import com.electromart.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for all authentication endpoints.
 * Base URL: http://localhost:8080/api/auth
 *
 * Endpoints:
 *   POST /api/auth/login          → Sign in with email & password
 *   POST /api/auth/send-otp       → Send OTP for registration or password reset
 *   POST /api/auth/register       → Register new user (requires OTP verification)
 *   POST /api/auth/reset-password  → Reset password (requires OTP verification)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Request body: { "email": "...", "password": "..." }
     * Response:     { "success": true/false, "message": "...", "data": { user info } }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        ApiResponse response = authService.login(request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    /**
     * POST /api/auth/send-otp
     * Request body: { "email": "...", "purpose": "REGISTRATION" | "PASSWORD_RESET" }
     * Response:     { "success": true/false, "message": "...", "data": { "debugOtp": "123456" } }
     */
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@RequestBody SendOtpRequest request) {
        log.info("OTP request for email: {} (purpose: {})", request.getEmail(), request.getPurpose());
        ApiResponse response = authService.sendOtp(request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    /**
     * POST /api/auth/register
     * Request body: { "name": "...", "email": "...", "password": "...", "otp": "123456" }
     * Response:     { "success": true/false, "message": "...", "data": { user info } }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        ApiResponse response = authService.register(request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    /**
     * POST /api/auth/reset-password
     * Request body: { "email": "...", "otp": "123456", "newPassword": "..." }
     * Response:     { "success": true/false, "message": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        log.info("Password reset attempt for email: {}", request.getEmail());
        ApiResponse response = authService.resetPassword(request);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    /**
     * GET /api/auth/health
     * Simple health check to verify the backend is running.
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        return ResponseEntity.ok(ApiResponse.ok("ElectroMart Backend is running!"));
    }
}
