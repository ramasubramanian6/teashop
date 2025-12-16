@echo off
echo Initializing and pushing to Git...

:: Initialize if not already
if not exist .git git init

:: Add all files
git add .

:: Commit
git commit -m "Initial commit for Tea Shop App"

:: Rename branch to main
git branch -M main

:: Remove existing origin if any to avoid errors
git remote remove origin

:: Add remote
git remote add origin https://github.com/ramasubramanian6/teashop.git

:: Push
echo Pushing to remote...
git push -u origin main

echo done
pause
