@echo off
echo Starting Git Fix Process...

:: Configure Git Identity (Local to this repo) to ensure commit works
echo Configuring local git identity...
git config user.name "Tea Shop App"
git config user.email "app@teashop.local"

:: Initialize if not already
if not exist .git (
    echo Initializing Git...
    git init
)

:: Add all files
echo Adding all files...
git add .

:: Commit
echo Committing...
git commit -m "Auto-fix: Initial commit"

:: Rename branch to main
git branch -M main

:: Remove existing origin if any to avoid errors
git remote remove origin 2>nul

:: Add remote
echo Setting remote...
git remote add origin https://github.com/ramasubramanian6/teashop.git

:: Push
echo Pushing to remote...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] PUSH FAILED!
    echo Please check your internet connection or if you need to log in.
    echo Try running this script again.
) else (
    echo.
    echo [SUCCESS] Repository pushed to GitHub.
)

pause
