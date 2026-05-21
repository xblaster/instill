@echo off
REM Release script: bump version, build, test, commit, tag, push, publish to npm
setlocal enabledelayedexpansion

echo ========================================
echo Instill Release Script
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

REM Display current version
for /f "tokens=*" %%A in ('node update-version.js get-version') do (
    set CURRENT_VERSION=%%A
)
echo Current version: %CURRENT_VERSION%
echo.

REM Parse version numbers
for /f "tokens=1,2,3 delims=." %%A in ("%CURRENT_VERSION%") do (
    set MAJOR=%%A
    set MINOR=%%B
    set PATCH=%%C
)

echo Choose version increment type:
echo 1) Patch  (%MAJOR%.%MINOR%.x)
echo 2) Minor  (%MAJOR%.x.0)
echo 3) Major  (x.0.0)
echo 4) Custom version
set /p CHOICE="Select (1-4): "

if "%CHOICE%"=="1" (
    set /a PATCH=%PATCH%+1
) else if "%CHOICE%"=="2" (
    set /a MINOR=%MINOR%+1
    set PATCH=0
) else if "%CHOICE%"=="3" (
    set /a MAJOR=%MAJOR%+1
    set MINOR=0
    set PATCH=0
) else if "%CHOICE%"=="4" (
    set /p UPDATED_VERSION="Enter new version (e.g., 1.2.3): "
    goto :version_set
) else (
    echo Invalid choice. Defaulting to patch.
    set /a PATCH=%PATCH%+1
)

set UPDATED_VERSION=%MAJOR%.%MINOR%.%PATCH%

:version_set
echo.
echo New version: %UPDATED_VERSION%
echo.

REM Update package.json
echo Updating package.json...
call node update-version.js set-version %UPDATED_VERSION%
if errorlevel 1 ( echo Error: Failed to update version & exit /b 1 )

REM Build
echo.
echo Building TypeScript...
call pnpm build
if errorlevel 1 ( echo Error: Build failed & exit /b 1 )

REM Tests
echo.
echo Running tests...
call pnpm vitest run
if errorlevel 1 ( echo Error: Tests failed — aborting release & exit /b 1 )

echo.
echo Build and tests passed!
echo.

REM Git commit + tag
echo Committing version bump...
git add package.json
git commit -m "chore: release v%UPDATED_VERSION%"
if errorlevel 1 ( echo Error: git commit failed & exit /b 1 )

git tag v%UPDATED_VERSION%
if errorlevel 1 ( echo Error: git tag failed & exit /b 1 )

echo.
set /p GIT_PUSH="Push to remote and publish to npm? (y/n): "

if /i "%GIT_PUSH%"=="y" (
    echo Pushing commits and tag...
    git push origin main
    git push origin v%UPDATED_VERSION%
    if errorlevel 1 ( echo Error: git push failed & exit /b 1 )

    echo.
    echo Publishing to npm...
    call npm publish --access public
    if errorlevel 1 ( echo Error: npm publish failed & exit /b 1 )

    echo.
    echo Successfully published @xblaster/instill@%UPDATED_VERSION% to npm!
) else (
    echo Skipped push and publish. Run manually:
    echo   git push origin main ^&^& git push origin v%UPDATED_VERSION%
    echo   npm publish --access public
)

echo.
echo ========================================
echo Release complete: v%UPDATED_VERSION%
echo ========================================
echo.

endlocal
