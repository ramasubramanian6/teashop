@echo off
echo Starting Tea Shop Application...
echo.

start "Tea Shop Backend" cmd /c "start-server.bat & pause"
start "Tea Shop Frontend" cmd /c "start-frontend.bat & pause"

echo Both services requested to start.
echo Please check the new windows for status.
pause
