#!/bin/bash

# Setup Storybook for Multiplication Drill
# This script helps you commit all Storybook files at once

echo "🚀 Setting up Storybook for Multiplication Drill..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create .storybook directory if it doesn't exist
if [ ! -d ".storybook" ]; then
    echo -e "${BLUE}Creating .storybook directory...${NC}"
    mkdir -p .storybook
fi

# Create stories directory if it doesn't exist
if [ ! -d "src/stories" ]; then
    echo -e "${BLUE}Creating src/stories directory...${NC}"
    mkdir -p src/stories
fi

echo ""
echo -e "${GREEN}✅ Directory structure ready!${NC}"
echo ""

# List files to be committed
echo -e "${BLUE}📝 Files to commit:${NC}"
echo ""
echo "Configuration:"
echo "  - .storybook/main.ts"
echo "  - .storybook/preview.ts"
echo ""
echo "Stories:"
echo "  - src/stories/Display.stories.ts"
echo "  - src/stories/Button.stories.ts"
echo "  - src/stories/Slider.stories.ts"
echo "  - src/stories/Progress.stories.ts"
echo "  - src/stories/FullApp.stories.ts"
echo ""
echo "Workflow:"
echo "  - .github/workflows/storybook-test.yml"
echo ""
echo "Documentation:"
echo "  - STORYBOOK.md"
echo "  - WORKFLOW_GUIDE.md"
echo ""
echo "Package:"
echo "  - package.json (updated with Storybook dependencies)"
echo ""

# Check current branch
BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: ${BRANCH}${NC}"
echo ""

# Prompt user
echo -e "${BLUE}Ready to commit these files?${NC}"
echo "This will:"
echo "  1. Create a new branch 'feature/add-storybook'"
echo "  2. Add all Storybook files"
echo "  3. Commit with message 'feat: add Storybook support'"
echo "  4. Push to GitHub"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Create feature branch
echo ""
echo -e "${BLUE}Creating feature branch...${NC}"
git checkout -b feature/add-storybook 2>/dev/null || git checkout feature/add-storybook

# Stage files
echo -e "${BLUE}Staging files...${NC}"
git add .storybook/
git add src/stories/
git add .github/workflows/storybook-test.yml
git add STORYBOOK.md
git add WORKFLOW_GUIDE.md
git add package.json

# Show what will be committed
echo ""
echo -e "${BLUE}Files staged for commit:${NC}"
git status --short

# Commit
echo ""
echo -e "${BLUE}Creating commit...${NC}"
git commit -m "feat: add Storybook support with component stories

- Add Storybook 8.5 configuration
- Create stories for Display, Button, Slider, Progress components
- Add FullApp story showcasing complete application
- Set up GitHub Actions workflow for automated builds
- Add comprehensive documentation
- Configure automatic deployment to GitHub Pages

All Storybook commands run exclusively through GitHub Actions"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Commit created successfully!${NC}"
    echo ""
    
    # Prompt for push
    echo -e "${BLUE}Ready to push to GitHub?${NC}"
    read -p "Push now? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Pushing to GitHub...${NC}"
        git push -u origin feature/add-storybook
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}🎉 Success!${NC}"
            echo ""
            echo "Next steps:"
            echo "  1. Go to your GitHub repository"
            echo "  2. Click the 'Actions' tab"
            echo "  3. Watch the 'Storybook Build & Deploy' workflow"
            echo "  4. Once complete, download the artifact to preview"
            echo "  5. Create a Pull Request to merge to master"
            echo ""
            echo "Your Storybook will be available at:"
            echo "  https://[username].github.io/[repo]/storybook/"
            echo ""
            echo -e "${YELLOW}Note: Live deployment only happens on master branch${NC}"
        else
            echo ""
            echo -e "${YELLOW}⚠️  Push failed. You can push manually with:${NC}"
            echo "  git push -u origin feature/add-storybook"
        fi
    else
        echo ""
        echo "Skipped push. You can push later with:"
        echo "  git push -u origin feature/add-storybook"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Commit failed. Please check the error above.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎓 Learning Sandbox Mode Active!${NC}"
echo "Remember: All Node.js commands run in GitHub Actions only!"
echo ""
