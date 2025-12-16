@echo off
echo Wiping existing Git configuration and starting fresh...
echo.

:: 1. Remove existing .git folder
if exist .git (
    echo Removing old .git directory...
    :: access denied fix just in case
    attrib -r -h -s .git /s /d >nul 2>&1
    rmdir /s /q .git
)

:: 2. Initialize
echo Initializing new repository...
git init

:: 3. Configure identity (Local only)
echo Configuring identity...
git config user.name "Tea Shop App"
git config user.email "app@teashop.local"

:: 4. Add and Commit
echo Adding all files...
git add .
echo Committing...
git commit -m "Fresh Start: Initial Commit"

:: 5. Setup Remote
echo Setting remote to https://github.com/ramasubramanian6/teashop.git
git branch -M main
git remote add origin https://github.com/ramasubramanian6/teashop.git

:: 6. Push
echo Pushing to GitHub (Forcing)...
git push -u origin main --force

echo.
echo ==============================================
if %ERRORLEVEL% NEQ 0 (
    echo OPERATION FAILED.
) else (
    echo OPERATION SUCCESSFUL.
)
echo ==============================================
pause
