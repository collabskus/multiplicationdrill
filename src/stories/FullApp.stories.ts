import type { Meta, StoryObj } from '@storybook/html';
import { Signal, ComputedSignal, effect } from '../signals';
import { generateProblem } from '../utils';

interface FullAppArgs {
  theme: 'light' | 'dark';
  initialMode: 'manual' | 'quiz';
  difficulty: 1 | 2 | 3 | 4;
}

const meta: Meta<FullAppArgs> = {
  title: 'App/FullApplication',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: { 
      control: 'select',
      options: ['light', 'dark']
    },
    initialMode: { 
      control: 'select',
      options: ['manual', 'quiz']
    },
    difficulty: { 
      control: 'select',
      options: [1, 2, 3, 4],
      labels: {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard',
        4: 'Expert'
      }
    },
  },
};

export default meta;
type Story = StoryObj<FullAppArgs>;

const createFullApp = (args: FullAppArgs) => {
  // Create container
  const container = document.createElement('div');
  if (args.theme === 'light') {
    container.classList.add('light-mode');
  }
  container.style.minHeight = '100vh';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.padding = '20px';
  
  // Apply theme background
  if (args.theme === 'dark') {
    container.style.background = '#0a0a0a';
  } else {
    container.style.background = 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)';
    container.style.backgroundSize = '400% 400%';
    container.style.animation = 'rainbow 15s ease infinite';
  }
  
  // Create app container
  const appContainer = document.createElement('div');
  appContainer.className = 'container';
  
  // Title
  const title = document.createElement('h1');
  title.textContent = 'Reactive Math Quiz';
  appContainer.appendChild(title);
  
  // Display section
  const displaySection = document.createElement('div');
  displaySection.className = 'section';
  
  const display = document.createElement('div');
  display.className = 'quiz-display';
  display.id = 'story-display';
  display.textContent = args.initialMode === 'manual' ? '0 × 10 = 0' : '7 × 8';
  
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.id = 'story-progress';
  progressBar.style.width = args.initialMode === 'quiz' ? '50%' : '0%';
  progressContainer.appendChild(progressBar);
  
  const timerDisplay = document.createElement('div');
  timerDisplay.className = 'timer-display';
  timerDisplay.id = 'story-timer';
  timerDisplay.textContent = args.initialMode === 'manual' ? 'Ready' : 'Question: 3.5s';
  
  displaySection.appendChild(display);
  displaySection.appendChild(progressContainer);
  displaySection.appendChild(timerDisplay);
  appContainer.appendChild(displaySection);
  
  // Settings section
  const settingsSection = document.createElement('div');
  settingsSection.className = 'section';
  
  const settingsTitle = document.createElement('h3');
  settingsTitle.textContent = 'Quiz Settings';
  settingsTitle.style.marginBottom = '15px';
  settingsSection.appendChild(settingsTitle);
  
  const controls = document.createElement('div');
  controls.className = 'controls';
  
  // Question time slider
  const questionTimeGroup = document.createElement('div');
  questionTimeGroup.className = 'slider-group';
  questionTimeGroup.innerHTML = `
    <label for="story-question-time">Question Time:</label>
    <input type="range" id="story-question-time" min="1" max="30" value="5">
    <span class="slider-value">5s</span>
  `;
  controls.appendChild(questionTimeGroup);
  
  // Answer time slider
  const answerTimeGroup = document.createElement('div');
  answerTimeGroup.className = 'slider-group';
  answerTimeGroup.innerHTML = `
    <label for="story-answer-time">Answer Time:</label>
    <input type="range" id="story-answer-time" min="1" max="30" value="3">
    <span class="slider-value">3s</span>
  `;
  controls.appendChild(answerTimeGroup);
  
  // Difficulty slider
  const difficultyNames = ['', 'Easy', 'Medium', 'Hard', 'Expert'];
  const difficultyGroup = document.createElement('div');
  difficultyGroup.className = 'slider-group';
  difficultyGroup.innerHTML = `
    <label for="story-difficulty">Difficulty:</label>
    <input type="range" id="story-difficulty" min="1" max="4" step="1" value="${args.difficulty}">
    <span class="slider-value">${difficultyNames[args.difficulty]}</span>
  `;
  controls.appendChild(difficultyGroup);
  
  // Quiz button
  const quizButton = document.createElement('button');
  quizButton.textContent = args.initialMode === 'quiz' ? 'Stop Quiz' : 'Start Quiz';
  quizButton.id = 'story-quiz-button';
  controls.appendChild(quizButton);
  
  settingsSection.appendChild(controls);
  appContainer.appendChild(settingsSection);
  
  // Manual mode section
  const manualSection = document.createElement('div');
  manualSection.className = 'section';
  
  const manualTitle = document.createElement('h3');
  manualTitle.textContent = 'Manual Mode';
  manualTitle.style.marginBottom = '15px';
  manualSection.appendChild(manualTitle);
  
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';
  
  const incrementBtn = document.createElement('button');
  incrementBtn.textContent = 'Increment';
  incrementBtn.id = 'story-increment';
  incrementBtn.disabled = args.initialMode === 'quiz';
  buttonGroup.appendChild(incrementBtn);
  
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.id = 'story-reset';
  resetBtn.disabled = args.initialMode === 'quiz';
  buttonGroup.appendChild(resetBtn);
  
  manualSection.appendChild(buttonGroup);
  appContainer.appendChild(manualSection);
  
  // Status section
  const statusSection = document.createElement('div');
  statusSection.className = 'status';
  statusSection.innerHTML = `
    <div class="status-item">
      <span>Mode:</span>
      <span class="status-value" id="story-mode">${args.initialMode === 'quiz' ? 'Quiz' : 'Manual'}</span>
    </div>
    <div class="status-item">
      <span>Quiz State:</span>
      <span class="status-value" id="story-state">${args.initialMode === 'quiz' ? 'Running' : 'Stopped'}</span>
    </div>
    <div class="status-item">
      <span>Last Update:</span>
      <span class="status-value" id="story-update">${new Date().toLocaleTimeString()}</span>
    </div>
  `;
  appContainer.appendChild(statusSection);
  
  container.appendChild(appContainer);
  
  // Add interactivity with signals
  const counter = new Signal(0);
  const seed = new Signal(10);
  const isQuizActive = new Signal(args.initialMode === 'quiz');
  
  const displayText = new ComputedSignal(() => {
    if (isQuizActive.get()) {
      const problem = generateProblem(args.difficulty);
      return `${problem.a} × ${problem.b}`;
    }
    return `${counter.get()} × ${seed.get()} = ${counter.get() * seed.get()}`;
  });
  
  effect(() => {
    display.textContent = displayText.get();
  });
  
  // Event listeners
  quizButton.addEventListener('click', () => {
    const willBeActive = !isQuizActive.get();
    isQuizActive.set(willBeActive);
    quizButton.textContent = willBeActive ? 'Stop Quiz' : 'Start Quiz';
    incrementBtn.disabled = willBeActive;
    resetBtn.disabled = willBeActive;
    
    const modeEl = container.querySelector('#story-mode');
    const stateEl = container.querySelector('#story-state');
    if (modeEl) modeEl.textContent = willBeActive ? 'Quiz' : 'Manual';
    if (stateEl) stateEl.textContent = willBeActive ? 'Running' : 'Stopped';
  });
  
  incrementBtn.addEventListener('click', () => {
    counter.set(counter.get() + 1);
    const updateEl = container.querySelector('#story-update');
    if (updateEl) updateEl.textContent = new Date().toLocaleTimeString();
  });
  
  resetBtn.addEventListener('click', () => {
    counter.set(0);
    const updateEl = container.querySelector('#story-update');
    if (updateEl) updateEl.textContent = new Date().toLocaleTimeString();
  });
  
  return container;
};

export const DarkMode: Story = {
  args: {
    theme: 'dark',
    initialMode: 'manual',
    difficulty: 3,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: createFullApp,
};

export const LightMode: Story = {
  args: {
    theme: 'light',
    initialMode: 'manual',
    difficulty: 3,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: createFullApp,
};

export const QuizMode: Story = {
  args: {
    theme: 'dark',
    initialMode: 'quiz',
    difficulty: 3,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: createFullApp,
};

export const EasyDifficulty: Story = {
  args: {
    theme: 'dark',
    initialMode: 'manual',
    difficulty: 1,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: createFullApp,
};

export const ExpertDifficulty: Story = {
  args: {
    theme: 'dark',
    initialMode: 'manual',
    difficulty: 4,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: createFullApp,
};
