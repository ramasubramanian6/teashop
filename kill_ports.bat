@echo off
echo Looking for process on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a
echo.
echo Process killed. Port 5000 should be free now.
pause
