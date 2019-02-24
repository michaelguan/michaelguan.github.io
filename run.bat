@echo off
cd /d %~dp0
echo %date% %time% start push to github >>github.log
git add . >>github.log
git commit -a -m "update %date% %time%"  >>github.log
git push >>github.log
echo %date% %time% push to github complete >>github.log
