@echo off

FOR /F "tokens=* USEBACKQ" %%F IN (`node src\main.js name`) DO (
SET name=%%F
)
FOR /F "tokens=* USEBACKQ" %%F IN (`node src\main.js target-directory`) DO (
SET targetDirectory="%%F"
)
FOR /F "tokens=* USEBACKQ" %%F IN (`node src\main.js dota-path`) DO (
SET dotaPath="%%F"
)
echo Downloading template..
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/Snoresville/dota2buttemplate_fixed/archive/refs/heads/master.zip', 'C:\temp\template.zip')"

echo Extracting template..
powershell -nologo -noprofile -command "& { $shell = New-Object -COM Shell.Application; $target = $shell.NameSpace('C:\temp'); $zip = $shell.NameSpace('C:\temp\template.zip'); $target.CopyHere($zip.Items(), 16); }"
icacls C:\temp\dota2buttemplate_fixed-master /grant Everyone:F /t

echo Setting up files..
mkdir %targetDirectory%\%name%
mkdir %dotaPath%\game\dota_addons\%name%
mkdir %dotaPath%\content\dota_addons\%name%
robocopy C:\temp\dota2buttemplate_fixed-master\game\dota_addons\addon_template_butt %dotaPath%\game\dota_addons\%name% /E /IS /MOVE
robocopy C:\temp\dota2buttemplate_fixed-master\content\dota_addons\addon_template_butt %dotaPath%\content\dota_addons\%name% /E /IS /MOVE
copy C:\temp\dota2buttemplate_fixed-master\.gitignore %targetDirectory%\%name%
copy C:\temp\dota2buttemplate_fixed-master\README.md %targetDirectory%\%name%
rmdir /S /Q C:\temp\dota2buttemplate_fixed-master
del C:\temp\template.zip

echo Generating KV files..
npm install
node src\main.js

echo Copying KV files..
copy %~dp0output\* %dotaPath%\game\dota_addons\%name%\scripts\npc /Y

echo Setting up links..
mklink /J %targetDirectory%\%name%\game %dotaPath%\game\dota_addons\%name%
mklink /J %targetDirectory%\%name%\content %dotaPath%\content\dota_addons\%name%

echo Done
pause