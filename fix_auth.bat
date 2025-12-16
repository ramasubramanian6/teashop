@echo off
echo ========================================================
echo Fixing Git Permissions / Authentication
echo ========================================================
echo.
echo The error happened because Windows remembers your old account:
echo "spartanskidsavadi-star"
echo.
echo We need to remove this so you can log in as:
echo "ramasubramanian6"
echo.

echo 1. Attempting to clear Windows Credential Manager for GitHub...
cmdkey /delete:git:https://github.com
cmdkey /delete:legacygeneric:target=git:https://github.com
echo.

echo 2. Updating Remote URL to force username check...
git remote set-url origin https://ramasubramanian6@github.com/ramasubramanian6/teashop.git

echo 3. Configuring local user...
git config user.name "ramasubramanian6"
git config user.email "ramasubramanian6@github.com"

echo.
echo ========================================================
echo READY TO RELOGIN
echo ========================================================
echo.
echo When you press any key, we will try to PUSH again.
echo A "Connect to GitHub" window should pop up.
echo Please login as "ramasubramanian6".
echo.
pause

git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Still denied.
    echo Please ensure you are logging out of the old account in your browser!
) else (
    echo.
    echo [SUCCESS] Pushed successfully!
)

pause
