@echo off
cd /d %~dp0
echo 开始提交
git add .
git commit -a -m %time%
git push
echo 提交完成