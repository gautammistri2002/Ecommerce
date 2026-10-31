package com.electromart.service;

import com.electromart.dto.*;
import com.electromart.model.PasswordResetToken;
import com.electromart.model.User;
import com.electromart.repository.PasswordResetTokenRepository;
import com.electromart.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Core authentication service handling:
 *  - User login (BCrypt password verification)
 *  - OTP generation & in-memory storage
 *  - User registration with OTP verification
 *  - Password reset with OTP verification
 *
 * OTPs are stored in-memory (ConcurrentHashMap) for simplicity.
 * In production, use Redis or persist to the password_reset_token table.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.otp.expiry-minutes:5}")
    private int otpExpiryMinutes;

    /**
     * In-memory OTP store: key = "email:purpose" → value = OTP data
     * This avoids needing a separate OTP table for registration
     * (since the user doesn't exist yet, user_id would be null).
     */
    private final ConcurrentHashMap<String, OtpData> otpStore = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, PasswordResetTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    // ========================================
    // LOGIN
    // ========================================

    public ApiResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ApiResponse.error("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ApiResponse.error("Password is required.");
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(request.getEmail().trim());

        if (userOpt.isEmpty()) {
            return ApiResponse.error("No account found with this email address.");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ApiResponse.error("Invalid email or password.");
        }

        log.info("User logged in: {}", user.getEmail());

        // Return user data (never return password hash to the frontend)
        Map<String, Object> userData = buildUserData(user);
        return ApiResponse.ok("Login successful!", userData);
    }

    // ========================================
    // SEND OTP
    // ========================================

    public ApiResponse sendOtp(SendOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ApiResponse.error("Email is required.");
        }

        String email = request.getEmail().trim().toLowerCase();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "REGISTRATION";

        // For REGISTRATION: check email is NOT already taken
        if ("REGISTRATION".equalsIgnoreCase(purpose)) {
            if (userRepository.existsByEmailIgnoreCase(email)) {
                return ApiResponse.error("This email is already registered. Please sign in instead.");
            }
        }

        // For PASSWORD_RESET: check email IS registered
        if ("PASSWORD_RESET".equalsIgnoreCase(purpose)) {
            if (!userRepository.existsByEmailIgnoreCase(email)) {
                return ApiResponse.error("No account found with this email address.");
            }
        }

        // Generate 6-digit OTP
        String otp = generateOtp();

        // Store OTP in memory with expiry
        String key = email + ":" + purpose.toUpperCase();
        otpStore.put(key, new OtpData(otp, LocalDateTime.now().plusMinutes(otpExpiryMinutes)));

        // Also persist to password_reset_token table for audit trail
        PasswordResetToken token = new PasswordResetToken();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        token.setUserId(userOpt.map(User::getId).orElse(null));
        token.setTokenHash(passwordEncoder.encode(otp));
        token.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        tokenRepository.save(token);

        // Log OTP to console (development mode - no real email sending)
        log.info("╔══════════════════════════════════════════╗");
        log.info("║  OTP for {} : {}                        ", email, otp);
        log.info("║  Purpose: {}                             ", purpose);
        log.info("║  Expires in: {} minutes                  ", otpExpiryMinutes);
        log.info("╚══════════════════════════════════════════╝");

        // Return OTP in response for development/testing (remove in production!)
        Map<String, Object> data = new HashMap<>();
        data.put("debugOtp", otp);

        return ApiResponse.ok("OTP sent successfully to " + email, data);
    }

    // ========================================
    // REGISTER (with OTP verification)
    // ========================================

    public ApiResponse register(RegisterRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            return ApiResponse.error("Name is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ApiResponse.error("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ApiResponse.error("Password must be at least 6 characters.");
        }
        if (request.getOtp() == null || request.getOtp().length() != 6) {
            return ApiResponse.error("A valid 6-digit OTP is required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        // Double-check email isn't already taken
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ApiResponse.error("This email is already registered.");
        }

        // Verify OTP
        String otpKey = email + ":REGISTRATION";
        if (!verifyOtp(otpKey, request.getOtp())) {
            return ApiResponse.error("Invalid or expired OTP. Please request a new one.");
        }

        // Create user with hashed password
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        // Remove used OTP
        otpStore.remove(otpKey);

        log.info("New user registered: {} ({})", user.getName(), user.getEmail());

        Map<String, Object> userData = buildUserData(user);
        return ApiResponse.ok("Registration successful!", userData);
    }

    // ========================================
    // RESET PASSWORD (with OTP verification)
    // ========================================

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ApiResponse.error("Email is required.");
        }
        if (request.getOtp() == null || request.getOtp().length() != 6) {
            return ApiResponse.error("A valid 6-digit OTP is required.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ApiResponse.error("New password must be at least 6 characters.");
        }

        String email = request.getEmail().trim().toLowerCase();

        // Find user
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) {
            return ApiResponse.error("No account found with this email address.");
        }

        // Verify OTP
        String otpKey = email + ":PASSWORD_RESET";
        if (!verifyOtp(otpKey, request.getOtp())) {
            return ApiResponse.error("Invalid or expired OTP. Please request a new one.");
        }

        // Update password
        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Remove used OTP
        otpStore.remove(otpKey);

        log.info("Password reset successful for: {}", email);
        return ApiResponse.ok("Password reset successfully! Please sign in with your new password.");
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Generates a random 6-digit OTP string.
     */
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    /**
     * Verifies an OTP against the in-memory store.
     * Returns true if valid and not expired.
     */
    private boolean verifyOtp(String key, String otp) {
        OtpData stored = otpStore.get(key);
        if (stored == null) {
            log.warn("No OTP found for key: {}", key);
            return false;
        }
        if (LocalDateTime.now().isAfter(stored.expiresAt)) {
            log.warn("OTP expired for key: {}", key);
            otpStore.remove(key);
            return false;
        }
        if (!stored.otp.equals(otp)) {
            log.warn("OTP mismatch for key: {} (expected: {}, got: {})", key, stored.otp, otp);
            return false;
        }
        return true;
    }

    /**
     * Builds a safe user data map (no password hash) to return to the frontend.
     * This matches the structure expected by localStorage.setItem("electromart_user", ...).
     */
    private Map<String, Object> buildUserData(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return data;
    }

    /**
     * Simple inner class to hold OTP + expiry in the in-memory store.
     */
    private static class OtpData {
        final String otp;
        final LocalDateTime expiresAt;

        OtpData(String otp, LocalDateTime expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }
}
