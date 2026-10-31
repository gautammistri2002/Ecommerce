package com.electromart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ElectromartBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElectromartBackendApplication.class, args);
        System.out.println("\n==============================================");
        System.out.println("  ElectroMart Backend is RUNNING on port 8080");
        System.out.println("  API Base URL: http://localhost:8080/api/auth");
        System.out.println("==============================================\n");
    }
}
