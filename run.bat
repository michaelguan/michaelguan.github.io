@echo off
cd /d %~dp0
echo start push to github
git add .
git commit -a -m %time%>>1.txt
git push
echo push to github complete
