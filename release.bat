@echo off
set /p version="What is the version name? (like v1.0.0): "
echo Creating release for %version%...

git tag %version%
git push origin %version%

echo Done! GitHub is now building your App.
echo Check the 'Actions' tab on GitHub to watch it work!
pause
