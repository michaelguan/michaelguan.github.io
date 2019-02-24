@echo off
cd /d %~dp0
git add .
git commit -a -m "update something"
git push