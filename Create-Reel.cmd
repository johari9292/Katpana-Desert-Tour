@echo off
setlocal
pushd "%~dp0"
node scripts\reel-wizard.cjs
popd
pause
