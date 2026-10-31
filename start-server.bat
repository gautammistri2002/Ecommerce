@echo off
title ElectroMart Backend Server
color 0B
echo ======================================================================
echo             ELECTROMART BACKEND SERVER LAUNCHER
echo ======================================================================
echo.

cd /d "%~dp0backend"

:: Try Node.js first (instant zero-configuration server on port 8080)
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Node.js detected. Launching Backend on port 8080...
    echo.
    node server.js
    goto end
)

:: Try Maven Spring Boot
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Maven detected. Launching Spring Boot on port 8080...
    echo.
    mvn spring-boot:run
    goto end
)

echo [NOTICE] Neither Node nor Maven was found in PATH.
echo.
echo You can use the new OFFLINE MODE directly in your browser:
echo 1. Open frontend/login.html
echo 2. Click "Offline Mode" button in the blue banner
echo 3. Enter your email and click "Sign In"
echo.
pause

:end
