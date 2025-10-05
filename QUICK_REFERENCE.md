# Storybook Quick Reference Card

## 🎯 One-Line Summary
**All Node.js commands run in GitHub Actions. Just push and watch the magic happen!**

## 📁 File Structure

```
.storybook/
  ├── main.ts           # Storybook configuration
  └── preview.ts        # Global decorators & parameters

src/stories/
  ├── Display.stories.ts    # Display component variations
  ├── Button.stories.ts     # Button component variations
  ├── Slider.stories.ts     # Slider component variations
  ├── Progress.stories.ts   # Progress bar variations
  └── FullApp.stories.ts    # Complete application demos

.github/workflows/
  └── storybook-test.yml    # CI/CD automation
```

## 🚀 Quick Commands

### Local (What You DO Run)
```bash
# Create story file
touch src/stories/MyComponent.stories.ts

# Stage changes
git add .

# Commit
git commit -m "feat: add MyComponent story"

# Push (triggers GitHub Actions)
git push origin branch-name
```

### GitHub Actions (What Runs Automatically)
```bash
# These run automatically - you DON'T run them:
yarn install --frozen-lockfile
yarn build-storybook
# Artifact upload
# GitHub Pages deployment (master only)
```

## 📝 Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/html';

interface MyComponentArgs {
  prop1: string;
  prop2: number;
}

const meta: Meta<MyComponentArgs> = {
  title: 'Category/ComponentName',
  tags: ['autodocs'],
  argTypes: {
    prop1: { control: 'text' },
    prop2: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<MyComponentArgs>;

export const Default: Story = {
  args: {
    prop1: 'value',
    prop2: 42,
  },
  render: (args) => {
    const element = document.createElement('div');
    element.textContent = args.prop1;
    return element;
  },
};
```

## 🎨 Available ArgTypes

```typescript
argTypes: {
  text: { control: 'text' },
  number: { control: 'number' },
  boolean: { control: 'boolean' },
  range: { control: { type: 'range', min: 0, max: 100 } },
  color: { control: 'color' },
  date: { control: 'date' },
  select: { control: 'select', options: ['a', 'b', 'c'] },
  radio: { control: 'radio', options: ['x', 'y', 'z'] },
  onClick: { action: 'clicked' },
}
```

## 🔍 Viewing Results

### During Development (PR)
1. Actions tab → Workflow run
2. Download `storybook-build` artifact
3. Extract → open `index.html`

### Production (Master)
```
https://[username].github.io/[repo]/storybook/
```

## ⚡ Workflow Status

### ✅ Success
- Green checkmark in Actions
- Artifact available for download
- No TypeScript/build errors

### ❌ Failure
- Red X in Actions
- Check logs in failed step
- Fix errors and push again

## 🎯 Common Tasks

### Add New Story
```bash
# 1. Create file
cat > src/stories/New.stories.ts << 'EOF'
// Your story code here
EOF

# 2. Commit and push
git add src/stories/New.stories.ts
git commit -m "feat: add New component story"
git push
```

### Update Existing Story
```bash
# 1. Edit file
nano src/stories/Existing.stories.ts

# 2. Commit and push
git add src/stories/Existing.stories.ts
git commit -m "fix: update Existing story props"
git push
```

### View Build Logs
```
GitHub → Actions → Latest workflow → Build Storybook step
```

### Download Preview
```
GitHub → Actions → Latest workflow → Artifacts → storybook-build
```

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| Module not found | Check imports, update package.json |
| TypeScript error | Fix types in .stories.ts file |
| Build fails | Check workflow logs in Actions |
| Empty Storybook | Verify .stories.ts naming and exports |
| CSS not working | Check preview.ts imports style.css |

## 📊 Workflow Timing

- **Build**: 2-5 minutes
- **Deploy**: 1-2 minutes (master only)
- **Artifact retention**: 30 days

## 🎓 Learning Objectives

✅ CI/CD pipelines  
✅ GitHub Actions automation  
✅ Component-driven development  
✅ Static site deployment  
✅ Cloud-first development

## 🔗 Quick Links

- [Full Documentation](./STORYBOOK.md)
- [Workflow Guide](./WORKFLOW_GUIDE.md)
- [Storybook Docs](https://storybook.js.org/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

## 💡 Pro Tips

1. **Push early, push often** - Builds are fast!
2. **Use descriptive commits** - Help future you
3. **Download artifacts** - Preview before merging
4. **Read the logs** - They're very informative
5. **Keep stories simple** - One concern per story

---

**Remember**: Everything runs in the cloud! ☁️🚀
