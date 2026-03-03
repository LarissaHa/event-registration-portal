#!/bin/bash

echo "================================================"
echo "  Event Registration Portal - Git Push Setup"
echo "================================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check current status
echo "📊 Current Git Status:"
git status --short
echo ""

# Check if remote exists
if git remote | grep -q origin; then
    echo "✅ Remote 'origin' already configured:"
    git remote -v
    echo ""
    echo "To change remote URL, run:"
    echo "  git remote set-url origin <new-url>"
    echo ""
else
    echo "⚠️  No remote 'origin' configured yet."
    echo ""
    echo "📝 Setup Instructions:"
    echo ""
    echo "1. Create a repository on GitHub or GitLab"
    echo "2. Copy the repository URL"
    echo "3. Run one of these commands:"
    echo ""
    echo "   For GitHub:"
    echo "   git remote add origin https://github.com/YOUR-USERNAME/event-registration-portal.git"
    echo ""
    echo "   For GitLab:"
    echo "   git remote add origin https://gitlab.com/YOUR-USERNAME/event-registration-portal.git"
    echo ""
    echo "4. Then push with:"
    echo "   git push -u origin main"
    echo ""
    exit 0
fi

# Ask user if they want to push
echo "🚀 Ready to push?"
echo ""
echo "Current branch: $(git branch --show-current)"
echo "Commits to push: $(git log origin/main..HEAD --oneline 2>/dev/null | wc -l)"
echo ""
read -p "Push to remote? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Pushing to remote..."
    git push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to remote!"
        echo ""
        echo "View your repository:"
        git remote get-url origin
    else
        echo ""
        echo "❌ Push failed. Check errors above."
        echo ""
        echo "Common issues:"
        echo "  - Authentication failed: Use Personal Access Token"
        echo "  - Permission denied: Check repository permissions"
        echo "  - Rejected: Pull latest changes first (git pull)"
    fi
else
    echo ""
    echo "Push cancelled."
fi

echo ""
echo "================================================"
