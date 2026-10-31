package com.electromart.dto;

/**
 * Request DTO for POST /api/auth/send-otp
 */
public class SendOtpRequest {
    private String email;
    private String purpose; // "REGISTRATION" or "PASSWORD_RESET"

    public SendOtpRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
