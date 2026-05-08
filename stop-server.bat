@echo off
echo ========================================
echo   Stopping ThreeBodyPlay Server...
echo ========================================
echo.
taskkill /FI "WINDOWTITLE eq ThreeBodyPlay-Server" /T /F
if %errorlevel% neq 0 (
    echo.
    echo No running server found or already stopped.
) else (
    echo.
    echo Server stopped successfully.
)
echo.
pause
