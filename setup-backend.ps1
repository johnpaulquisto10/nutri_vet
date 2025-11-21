#!/usr/bin/env powershell
# NutriVet Backend Setup Script
# Run this script to set up the Laravel backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NutriVet Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location backend-laravel

Write-Host "[1/6] Checking Composer dependencies..." -ForegroundColor Yellow
if (!(Test-Path "vendor")) {
    Write-Host "Installing Composer dependencies..." -ForegroundColor Green
    composer install
} else {
    Write-Host "Composer dependencies already installed." -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/6] Checking .env file..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Green
    Copy-Item .env.example .env
    php artisan key:generate
} else {
    Write-Host ".env file exists." -ForegroundColor Green
}
Write-Host ""

Write-Host "[3/6] Running database migrations..." -ForegroundColor Yellow
php artisan migrate
Write-Host ""

Write-Host "[4/6] Seeding database with master data..." -ForegroundColor Yellow
php artisan db:seed --class=NutriVetSeeder
Write-Host ""

Write-Host "[5/6] Creating storage symlink..." -ForegroundColor Yellow
php artisan storage:link
Write-Host ""

Write-Host "[6/6] Clearing caches..." -ForegroundColor Yellow
php artisan config:clear
php artisan cache:clear
php artisan route:clear
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Users Created:" -ForegroundColor Yellow
Write-Host "  Admin:  admin@nutrivet.com / password" -ForegroundColor White
Write-Host "  Farmer: farmer@nutrivet.com / password" -ForegroundColor White
Write-Host ""
Write-Host "To start the server, run:" -ForegroundColor Yellow
Write-Host "  php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Server will run on: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
