@echo off
title ElectroMart Spring Boot Backend
color 0A
echo ======================================================================
echo           STARTING ELECTROMART SPRING BOOT BACKEND SERVER
echo ======================================================================
echo.

cd /d "%~dp0backend"

:: Check if Maven is available
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Maven detected. Launching Spring Boot on port 8080...
    echo.
    mvn spring-boot:run
    goto end
)

echo [WARNING] 'mvn' command not found in System PATH.
echo.
echo Please run the backend using ONE of these easy methods:
echo.
echo METHOD 1 (Recommended in VS Code):
echo   1. Open VS Code.
echo   2. Open file: backend/src/main/java/com/electromart/ElectromartBackendApplication.java
echo   3. Click 'Run' directly above 'public static void main' (or press F5).
echo.
echo METHOD 2 (If you have Maven installed):
echo   Add Maven's bin folder to your Windows PATH environment variable.
echo.
pause

:end
