@echo off
echo ========================================
echo   Running ThreeBodyPlay UI Tests
echo ========================================
echo.
cd /d %~dp0
node test-lessons.js
echo.
echo Tests completed.
pause
