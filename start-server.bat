@echo off
title NEW ERA ROLEPLAY - LARAVEL SERVER
echo ========================================================
echo   NEW ERA ROLEPLAY COMMUNITY - LARAVEL BACKEND
echo ========================================================
echo Starting Laravel Server on http://127.0.0.1:8000 ...
echo Database: MySQL (new_era_rp)
echo Discord Webhooks: Active (Citizen, Police, EMS)
echo Admin Passcode: newera2026
echo ========================================================
"C:\xampp\php\php.exe" -d extension=zip -d extension=gd artisan serve --port=8000
pause
