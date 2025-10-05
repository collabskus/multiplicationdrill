# GitHub Actions Workflow Guide

## 🎯 Overview

This project runs ALL Node.js commands exclusively through GitHub Actions. Nothing runs locally!

## 📋 Quick Checklist

Before pushing:
- [ ] Created/edited `.stories.ts` files
- [ ] Verified TypeScript types are correct
- [ ] Committed all files
- [ ] Ready to let GitHub Actions do the work!

## 🔄 Standard Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/add-storybook-component
```

### 2. Add Your Stories

Create a new story file:

```bash
# Just create the file - no commands to run!
touch src/stories/NewComponent.stories.ts
```

### 3. Commit Your Changes

```bash
git add src/stories/NewComponent.stories.ts
git commit -m "feat: add NewComponent stories"
```

### 4. Push to GitHub

```bash
git push origin feature/add-storybook-component
```

**🎉 GitHub Actions takes over here!**

### 5. Monitor the Build

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Watch the **"Storybook Build & Deploy"** workflow run
4. Wait for the green checkmark ✅

### 6. Review the Artifacts

Once the build completes:
- Click on the workflow run
- Scroll to **Artifacts** section
- Download **storybook-build.zip**
- Extract and open `index.html` locally to preview

### 7. Open a Pull Request

```bash
# On GitHub web interface:
# 1. Click "Compare & pull request"
# 2. Add description
# 3. Submit PR
```

The PR will show:
- ✅ Build status
- 📦 Available artifacts
- 🔍 Build logs

### 8. Merge to Master

Once approved:
1. Merge the PR on GitHub
2. GitHub Actions automatically:
   - Builds Storybook
   - Deploys to GitHub Pages
   - Makes it live!

## 🎬 What Runs in GitHub Actions

### On Every Push/PR

```yaml
jobs:
  build-storybook:
    steps:
      - Install dependencies (yarn install)
      - Build Storybook (yarn build-storybook)
      - Upload artifacts
  
  test-storybook:
    steps:
      - Verify build succeeded
      - Check for index.html
```

### On Master Branch Only

```yaml
deploy:
  steps:
    - Deploy to GitHub Pages
    - Update live Storybook site
```

## 📊 Viewing Build Results

### Option 1: GitHub Artifacts

1. Actions tab → Latest workflow run
2. Scroll to Artifacts section
3. Download `storybook-build`
4. Extract and open in browser

### Option 2: Live Deployment (Master only)

Visit:
```
https://[username].github.io/[repo]/storybook/
```

### Option 3: Build Logs

Check the logs if something fails:
1. Actions tab → Failed workflow
2. Click the red X
3. Read the error output

## 🐛 Troubleshooting

### Build Fails

**Error: Module not found**
```
✗ Check package.json dependencies
✗ Verify import paths in stories
✗ Push updated package.json
```

**Error: TypeScript errors**
```
✗ Check your .stories.ts files
✗ Fix type errors locally
✗ Push corrected code
```

**Error: Storybook config invalid**
```
✗ Check .storybook/main.ts
✗ Check .storybook/preview.ts
✗ Fix syntax errors
✗ Push corrections
```

### Build Succeeds but Storybook Broken

**Empty Storybook**
```
✗ Check story file naming (must end in .stories.ts)
✗ Verify stories are exported
✗ Check title/category in meta
```

**Components Don't Render**
```
✗ Check render function returns DOM element
✗ Verify CSS is imported in preview.ts
✗ Check browser console in downloaded artifact
```

## 🎓 Commands You DON'T Run Locally

These all happen in GitHub Actions:

```bash
# ❌ DON'T run these locally:
yarn install
yarn storybook
yarn build-storybook
yarn type-check
yarn lint
yarn test

# ✅ Only do these:
git add .
git commit -m "message"
git push origin branch-name
```

## 📝 Commit Message Conventions

Use semantic commit messages:

```bash
feat: add new component story
fix: correct button story props
docs: update storybook readme
refactor: reorganize story structure
style: format story files
test: add interaction tests to stories
```

## 🚀 Advanced: Multiple Story Files

Adding several stories at once:

```bash
# Create all your story files
touch src/stories/Component1.stories.ts
touch src/stories/Component2.stories.ts
touch src/stories/Component3.stories.ts

# Edit them all
# Then commit together
git add src/stories/*.stories.ts
git commit -m "feat: add component stories for buttons, inputs, and cards"
git push origin feature/multiple-stories

# GitHub Actions builds them all at once!
```

## 🎯 Pro Tips

1. **Small commits**: Push frequently so builds finish faster
2. **Descriptive names**: Use clear file names for stories
3. **Watch the logs**: Learn from build output
4. **Test artifacts**: Download and check before merging
5. **Keep simple**: One concern per story

## 🔄 Typical Development Loop

```
1. Create feature branch
   ↓
2. Add/edit story files
   ↓
3. Commit changes
   ↓
4. Push to GitHub
   ↓
5. GitHub Actions builds
   ↓
6. Download artifact to preview
   ↓
7. If good → Merge to master
   If issues → Fix and push again
   ↓
8. Master auto-deploys to Pages
   ↓
9. View live Storybook!
```

## 📅 Timeline Expectations

- **Build time**: 2-5 minutes per push
- **Deploy time**: 1-2 minutes after master merge
- **Artifact retention**: 30 days

## 🎉 Success Checklist

Your workflow is successful when:
- ✅ GitHub Actions shows green checkmarks
- ✅ Artifact downloads and opens properly
- ✅ All stories render correctly
- ✅ Controls work as expected
- ✅ No console errors
- ✅ Live site updates (on master)

## 🆘 Getting Help

If stuck:
1. Check the Actions log output
2. Review this guide
3. Compare with working story examples
4. Check Storybook documentation
5. Look at the last successful build

---

**Remember**: This is a learning sandbox. The goal is to understand CI/CD workflows, not to run everything locally. Embrace the cloud! ☁️
