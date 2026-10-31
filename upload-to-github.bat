@echo off
title Upload ElectroMart to GitHub
color 0B
echo ======================================================================
echo              ELECTROMART - AUTOMATIC GITHUB UPLOADER
echo ======================================================================
echo.

cd /d "%~dp0"

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed on this PC yet.
    echo.
    echo Opening the official Git download page for you...
    start https://git-scm.com/download/win
    echo.
    echo Please install Git (click Next - Next - Finish),
    echo then double-click this file again!
    echo.
    pause
    exit /b
)

echo [1/5] Initializing Git repository...
if not exist ".git" (
    git init
)

echo.
echo [2/5] Adding all project files (frontend, backend, database)...
git add .

echo.
echo [3/5] Saving project commit...
git commit -m "Upload all ElectroMart files: frontend, backend, database"

echo.
echo [4/5] Setting main branch and repository link...
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/gautammistri2002/ecommerce.git

echo.
echo [5/5] Uploading to GitHub...
echo (If a browser window opens, click 'Sign in with your browser')
echo.
git push -u origin main

echo.
echo ======================================================================
echo          SUCCESS! ALL FILES HAVE BEEN UPLOADED TO GITHUB!
echo          View your project at: https://github.com/gautammistri2002/ecommerce
echo ======================================================================
echo.
pause

