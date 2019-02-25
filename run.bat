@echo off
cd /d %~dp0
echo %Date:~0,4%%Date:~5,2%%Date:~8,2% %time% start push to github >>github.log
git add . >>github.log
git commit -a -m "update %date% %time%"  >>github.log
git push >>github.log
echo %Date:~0,4%%Date:~5,2%%Date:~8,2% %time% push to github complete >>github.log
