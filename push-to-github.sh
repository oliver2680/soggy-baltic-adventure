#!/bin/bash
# Creates the GitHub repo under your account and pushes this folder to it.
#
# Requires:
#   - git installed
#   - GitHub CLI (`gh`) installed and logged in (`gh auth login`, if you
#     haven't done that yet)
#
# Usage: from this folder, run:
#   chmod +x push-to-github.sh
#   ./push-to-github.sh

set -e
cd "$(dirname "$0")"

REPO_NAME="soggy-baltic-adventure"

# Start clean in case a previous/partial git init happened here.
rm -rf .git

git init -b main
git add -A
git commit -m "Initial commit: Soggy Baltic Adventure itinerary site"

echo ""
if gh repo view "$REPO_NAME" > /dev/null 2>&1; then
  echo "Repo '$REPO_NAME' already exists on GitHub — linking to it and pushing..."
  git remote add origin "https://github.com/$(gh api user -q .login)/$REPO_NAME.git"
  git push -u origin main --force
else
  echo "Creating GitHub repo '$REPO_NAME' under your account and pushing..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
fi

echo ""
echo "Done. Repo is live at:"
gh repo view --json url -q .url
