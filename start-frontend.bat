@echo off
echo Stopping any existing Next.js processes...
taskkill /f /im node.exe 2>nul

echo Cleaning up .next directory...
cd frontend
if exist .next rmdir /s /q .next

echo Starting Next.js development server...
npx next dev

pause