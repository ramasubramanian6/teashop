@echo off
echo Starting Git Operation > push_log.txt
echo Adding files... >> push_log.txt
git add . >> push_log.txt 2>&1
echo Committing... >> push_log.txt
git commit -m "Initial commit" >> push_log.txt 2>&1
echo Renaming branch... >> push_log.txt
git branch -M main >> push_log.txt 2>&1
echo Setting remote... >> push_log.txt
git remote remove origin >> push_log.txt 2>&1
git remote add origin https://github.com/ramasubramanian6/teashop.git >> push_log.txt 2>&1
echo Pushing... >> push_log.txt
git push -u origin main >> push_log.txt 2>&1
echo Done. >> push_log.txt
