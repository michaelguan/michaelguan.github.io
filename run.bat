@echo off
cd /d %~dp0
git add .
git commit -a -m %time%
git push