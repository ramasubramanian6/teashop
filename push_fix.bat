@echo off
echo Pushing changes to GitHub...
git add .
git commit -m "Fix: Add start script -> package.json"
git push
echo.
if %ERRORLEVEL% NEQ 0 (
    echo Push Failed.
) else (
    echo Push Successful.
)
pause
