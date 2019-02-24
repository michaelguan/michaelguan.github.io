@echo off
cd /d %~dp0
echo %time% start push to github
git add .>>github.log
git commit -a -m %time%>>github.log
git push>>github.log
echo %time% push to github complete
