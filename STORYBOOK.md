# Storybook for Multiplication Drill

This project uses Storybook to document and test UI components in isolation.

## 🎯 Learning Sandbox Approach

This project uses a unique approach where **all Storybook commands run exclusively through GitHub Actions**. We don't run `yarn storybook` locally - everything happens in CI/CD!

## 🚀 How It Works

### Automatic Builds

Every time you push to `master` or open a pull request, the existing GitHub Actions workflow (`.github/workflows/storybook-test.yml`) will:

1. **Setup Node.js 22** (hard-learned lesson: version matters!)
2. **Delete yarn.lock** to force fresh dependency resolution (prevents stale lock issues)
3. **Install dependencies** with yarn
4. **Build Storybook** into static files
5. **Verify the build** (checks for index.html and lists all files)
6. **Upload artifacts** that persist for 7 days

### Viewing Your Storybook

Check the GitHub Actions artifacts:
1. Go to the **Actions** tab in your repository
2. Click on the latest **"Storybook Test Build"** workflow run
3. Download the **storybook-build** artifact (available for 7 days)
4. Extract and open `index.html` in your browser

**Note**: The current workflow doesn't deploy to GitHub Pages automatically. If you want automatic deployment, you can add a deploy job to the existing workflow (see the workflow file for optional deployment code).

## 📚 Available Stories

### Components

- **Display**: Shows the main quiz display in different states
  - Manual mode
  - Question mode
  - Answer mode
  - Large numbers

- **Button**: Interactive buttons used throughout the app
  - Start Quiz
  - Stop Quiz
  - Increment
  - Reset
  - Disabled state
  - Button groups

- **Slider**: Configuration sliders
  - Question Time (1-30 seconds)
  - Answer Time (1-30 seconds)
  - Difficulty (Easy/Medium/Hard/Expert)

- **Progress**: Quiz progress indicators
  - Question phase progress
  - Answer phase progress
  - Animated progress

### Full Application

- **FullApplication**: Complete app in different configurations
  - Dark/Light modes
  - Manual/Quiz modes
  - Different difficulty levels

## 🎨 Component Development Workflow

Since we're using GitHub Actions exclusively:

1. **Create/Edit Stories**
   - Add new `.stories.ts` files in `src/stories/`
   - Follow the existing patterns

2. **Commit and Push**
   ```bash
   git add src/stories/NewComponent.stories.ts
   git commit -m "Add NewComponent stories"
   git push origin feature-branch
   ```

3. **Open Pull Request**
   - GitHub Actions will automatically build Storybook
   - Review the build artifacts in the PR

4. **Merge to Master**
   - After merge, Storybook deploys automatically
   - View live at your GitHub Pages URL

## 🔍 Debugging Build Issues

If the Storybook build fails:

1. Check the **Actions** tab
2. Click on the failed workflow run
3. Expand the **"Build Storybook"** step
4. Review the error logs

Common issues:
- Missing dependencies (check package.json)
- TypeScript errors (run `yarn type-check` locally first)
- Import path issues (ensure all imports are correct)

## 📦 Story Structure

Each story file follows this pattern:

```typescript
import type { Meta, StoryObj } from '@storybook/html';

interface ComponentArgs {
  // Define your component's props
}

const meta: Meta<ComponentArgs> = {
  title: 'Category/ComponentName',
  tags: ['autodocs'],
  argTypes: {
    // Define controls
  },
};

export default meta;
type Story = StoryObj<ComponentArgs>;

export const StoryName: Story = {
  args: {
    // Default values
  },
  render: (args) => {
    // Create and return DOM element
  },
};
```

## 🛠️ Adding New Stories

1. Create a new file: `src/stories/YourComponent.stories.ts`
2. Import necessary utilities from your source files
3. Define the story metadata and args
4. Create render functions that generate DOM elements
5. Export multiple story variants
6. Push to GitHub - Actions handles the rest!

## 🎭 Design Tokens

Stories automatically include the app's CSS (`src/style.css`), so all components have access to:

- Color variables (e.g., `var(--accent-primary)`)
- Utility classes (e.g., `.section`, `.button-group`)
- Animations and transitions

## 🌈 Themes

Storybook supports both light and dark themes:

```typescript
// In your story
const container = document.createElement('div');
container.classList.add('light-mode'); // or remove for dark
```

## 📝 Best Practices

1. **Keep stories simple**: Each story should demonstrate one state/variant
2. **Use TypeScript**: Define proper types for your args
3. **Add controls**: Make stories interactive with argTypes
4. **Document behavior**: Use the autodocs tag
5. **Test in Actions**: Always verify builds succeed in GitHub Actions

## 🔗 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook for HTML](https://storybook.js.org/docs/html/get-started/introduction)
- [GitHub Actions Workflow](.github/workflows/storybook-test.yml)

## 🎓 Learning Goals

This "no local runs" approach teaches:

- CI/CD workflows
- GitHub Actions automation
- Static site deployment
- Component-driven development
- Design systems thinking

Remember: **Everything runs in the cloud!** 🚀
