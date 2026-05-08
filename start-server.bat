@echo off
title ThreeBodyPlay-Server
echo ========================================
echo   ThreeBodyPlay Development Server
echo ========================================
echo.
cd /d %~dp0
npm run dev
pause
