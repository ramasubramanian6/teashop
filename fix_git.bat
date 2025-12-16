@echo off
set LOGFILE=fix_log.txt
echo Starting Git Fix Process... > %LOGFILE%
echo. >> %LOGFILE%

:: Configure Git Identity
echo Configuring local git identity... | type CON >> %LOGFILE% 2>&1
git config user.name "Tea Shop App" >> %LOGFILE% 2>&1
git config user.email "app@teashop.local" >> %LOGFILE% 2>&1

:: Initialize
if not exist .git (
    echo Initializing Git... | type CON >> %LOGFILE% 2>&1
    git init >> %LOGFILE% 2>&1
)

:: Add
echo Adding all files... | type CON >> %LOGFILE% 2>&1
git add . >> %LOGFILE% 2>&1

:: Commit
echo Committing... | type CON >> %LOGFILE% 2>&1
git commit -m "Auto-fix: Initial commit" >> %LOGFILE% 2>&1

:: Branch
git branch -M main >> %LOGFILE% 2>&1

:: Remote
git remote remove origin 2>nul
echo Setting remote... | type CON >> %LOGFILE% 2>&1
git remote add origin https://github.com/ramasubramanian6/teashop.git >> %LOGFILE% 2>&1

:: Push
echo Pushing to remote... | type CON >> %LOGFILE% 2>&1
echo (If this fails, it's likely a password/permission issue) >> %LOGFILE%

git push -u origin main >> %LOGFILE% 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] PUSH FAILED! check %LOGFILE%
    echo PUSH FAILED >> %LOGFILE%
) else (
    echo.
    echo [SUCCESS] Repository pushed to GitHub.
    echo SUCCESS >> %LOGFILE%
)

echo Done. Log saved to %LOGFILE%
pause
