# Getting Started with Storybook

## 🎯 One-Command Setup

```bash
chmod +x setup-storybook.sh && ./setup-storybook.sh
```

That's it! The script will guide you through everything.

---

## 📋 Manual Setup (Step-by-Step)

### Step 1: Create the Files

Create these directories:
```bash
mkdir -p .storybook
mkdir -p src/stories
```

### Step 2: Add Configuration Files

Create `.storybook/main.js`:
```javascript
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
};
```

Create `.storybook/preview.js`:
```javascript
module.exports = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};
```

### Step 3: Copy Story Files

Copy these files from the artifacts I created:
- `src/stories/Display.stories.ts`
- `src/stories/Button.stories.ts`
- `src/stories/Slider.stories.ts`
- `src/stories/Progress.stories.ts`
- `src/stories/FullApp.stories.ts`

### Step 4: Update package.json

Add to `devDependencies`:
```json
{
  "@storybook/addon-essentials": "^8.5.0",
  "@storybook/addon-interactions": "^8.5.0",
  "@storybook/addon-links": "^8.5.0",
  "@storybook/blocks": "^8.5.0",
  "@storybook/html": "^8.5.0",
  "@storybook/html-vite": "^8.5.0",
  "@storybook/test": "^8.5.0",
  "storybook": "^8.5.0"
}
```

Add to `scripts`:
```json
{
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

### Step 5: Commit Everything

```bash
# Create feature branch
git checkout -b feature/add-storybook

# Stage all files
git add .storybook/ src/stories/ package.json

# Add documentation (optional but recommended)
git add STORYBOOK.md WORKFLOW_GUIDE.md QUICK_REFERENCE.md SETUP_SUMMARY.md

# Commit
git commit -m "feat: add Storybook support

- Add Storybook 8.5 configuration
- Create stories for Display, Button, Slider, Progress
- Add FullApp interactive demo
- Include comprehensive documentation

Uses existing workflow (Node 22, yarn.lock deletion)"

# Push
git push -u origin feature/add-storybook
```

### Step 6: Watch GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Watch **"Storybook Test Build"** workflow run
4. Wait for green checkmark ✅

### Step 7: Preview Storybook

1. Click on the completed workflow run
2. Scroll to **Artifacts** section
3. Download **storybook-build**
4. Extract the zip file
5. Open `index.html` in your browser

### Step 8: Review & Merge

1. Open a Pull Request
2. Review the build output
3. Check the downloaded Storybook preview
4. Merge to master!

---

## ✅ Verification Checklist

Before pushing, make sure:

- [ ] `.storybook/main.js` exists (not .ts!)
- [ ] `.storybook/preview.js` exists (not .ts!)
- [ ] All 5 story files in `src/stories/`
- [ ] `package.json` updated with Storybook deps
- [ ] `package.json` updated with scripts
- [ ] Documentation files added (optional)
- [ ] Existing `storybook-test.yml` unchanged (it's perfect!)

---

## 🎬 What Happens in GitHub Actions

Your existing workflow will:

1. ✅ **Setup Node 22** (hard-learned: specific version required)
2. ✅ **Delete yarn.lock** (hard-learned: prevents conflicts)
3. ✅ **Install dependencies** (fresh, clean install)
4. ✅ **Build Storybook** (yarn build-storybook)
5. ✅ **Verify output** (detailed file listing)
6. ✅ **Upload artifact** (available for 7 days)

No changes needed to your workflow - it's already perfect!

---

## 🚀 Quick Start (Fastest Way)

```bash
# 1. Use the setup script
./setup-storybook.sh

# 2. Watch GitHub Actions
# (Go to Actions tab in browser)

# 3. Download artifact when done
# (Click workflow run → Artifacts section)

# 4. Open index.html
# (Extract zip and open in browser)

# 5. Create PR and merge!
```

---

## 📚 What You Get

### 28 Interactive Stories
- Display component (4 variants)
- Button component (6 variants)
- Slider component (6 variants)
- Progress component (7 variants)
- Full application (5 variants)

### Complete Documentation
- STORYBOOK.md - Full guide
- WORKFLOW_GUIDE.md - Step-by-step workflows
- QUICK_REFERENCE.md - Quick reference card
- SETUP_SUMMARY.md - Setup overview
- GETTING_STARTED.md - This file!

---

## 🎓 Learning Objectives

This setup teaches you:
- ✅ CI/CD workflows with GitHub Actions
- ✅ Component-driven development
- ✅ Design system thinking
- ✅ Cloud-first development (no local builds!)
- ✅ Artifact-based workflows
- ✅ The importance of version specificity (Node 22)
- ✅ The value of fresh dependencies (yarn.lock deletion)

---

## 💡 Pro Tips

1. **Small commits** - Faster builds, easier debugging
2. **Watch the logs** - Learn from the build output
3. **Download artifacts** - Preview before merging
4. **Read the docs** - Each guide has specific info
5. **Respect the workflow** - Don't change Node version or remove yarn.lock deletion

---

## 🆘 Troubleshooting

### Build Fails
→ Check Actions logs  
→ Verify all files exist  
→ Check package.json syntax  

### Stories Don't Appear
→ Verify .stories.ts file naming  
→ Check exports in story files  
→ Ensure title is set in meta  

### CSS Not Working
→ Stories use existing style.css  
→ No additional imports needed  
→ Check browser console in artifact  

### TypeScript Errors
→ All stories are TypeScript  
→ Check imports and types  
→ Verify story file syntax  

---

## 🎉 Success!

You'll know it worked when:
- ✅ GitHub Actions shows green checkmark
- ✅ Artifact downloads successfully
- ✅ index.html opens and shows stories
- ✅ All components render correctly
- ✅ Controls work in the UI
- ✅ No console errors

---

## 🔗 Quick Links

- [Full Documentation](./STORYBOOK.md)
- [Workflow Guide](./WORKFLOW_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Setup Summary](./SETUP_SUMMARY.md)

---

**Ready? Let's build some stories! 🚀**
