import { effect } from './signals';
import { state, displayText, progressPercent, timerDisplayText } from './state';
import { DifficultyLevel, Settings } from './types';
import { 
  generateProblem, 
  getDifficultyName, 
  loadSettings, 
  saveSettings,
  loadTheme,
  saveTheme
} from './utils';

// DOM Elements
interface DOMElements {
  display: HTMLElement;
  progressBar: HTMLElement;
  timerDisplay: HTMLElement;
  questionTimeValue: HTMLElement;
  answerTimeValue: HTMLElement;
  difficultyValue: HTMLElement;
  quizButton: HTMLButtonElement;
  modeStatus: HTMLElement;
  quizStatus: HTMLElement;
  updateTime: HTMLElement;
  questionTimeSlider: HTMLInputElement;
  answerTimeSlider: HTMLInputElement;
  difficultySlider: HTMLInputElement;
  incrementBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  autoUpdateCheckbox: HTMLInputElement;
}

let elements: DOMElements;
let animationFrameId: number | null = null;
let lastTimestamp = 0;
let autoUpdateTimer: ReturnType<typeof setInterval> | null = null;

function getElements(): DOMElements {
  return {
    display: document.getElementById('display')!,
    progressBar: document.getElementById('progressBar')!,
    timerDisplay: document.getElementById('timerDisplay')!,
    questionTimeValue: document.getElementById('questionTimeValue')!,
    answerTimeValue: document.getElementById('answerTimeValue')!,
    difficultyValue: document.getElementById('difficultyValue')!,
    quizButton: document.getElementById('quizButton')! as HTMLButtonElement,
    modeStatus: document.getElementById('modeStatus')!,
    quizStatus: document.getElementById('quizStatus')!,
    updateTime: document.getElementById('updateTime')!,
    questionTimeSlider: document.getElementById('questionTime')! as HTMLInputElement,
    answerTimeSlider: document.getElementById('answerTime')! as HTMLInputElement,
    difficultySlider: document.getElementById('difficulty')! as HTMLInputElement,
    incrementBtn: document.getElementById('incrementBtn')! as HTMLButtonElement,
    resetBtn: document.getElementById('resetBtn')! as HTMLButtonElement,
    autoUpdateCheckbox: document.getElementById('autoUpdate')! as HTMLInputElement
  };
}

function gameLoop(timestamp: number): void {
  if (!state.isQuizActive.get()) {
    animationFrameId = null;
    return;
  }

  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  const deltaTime = (timestamp - lastTimestamp) / 1000; // Time elapsed in seconds
  lastTimestamp = timestamp;

  const newTime = Math.max(0, state.timeRemaining.get() - deltaTime);
  state.timeRemaining.set(newTime);
  updateLastTime();

  if (newTime === 0) {
    const currentPhase = state.currentPhase.get();
    if (currentPhase === 'question') {
      state.currentPhase.set('answer');
      state.timeRemaining.set(state.answerTime.get());
    } else if (currentPhase === 'answer') {
      startNextProblem();
    }
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

function startNextProblem(): void {
  state.currentProblem.set(generateProblem(state.difficulty.get()));
  state.currentPhase.set('question');
  state.timeRemaining.set(state.questionTime.get());
}

export function toggleQuiz(): void {
  const willBeActive = !state.isQuizActive.get();
  state.isQuizActive.set(willBeActive);

  if (willBeActive) {
    lastTimestamp = 0; // Reset timestamp for the first frame
    startNextProblem();
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    state.currentPhase.set('idle');
    state.timeRemaining.set(0);
    updateLastTime();
  }
}

export function increment(): void {
  state.counter.set(state.counter.get() + 1);
  updateLastTime();
}

export function reset(): void {
  state.counter.set(0);
  state.seed.set(Math.floor(Math.random() * 99) + 1);
  updateLastTime();
}

function updateLastTime(): void {
  elements.updateTime.textContent = new Date().toLocaleTimeString();
}

export function toggleAutoUpdate(checked: boolean): void {
  state.autoUpdateEnabled.set(checked);
}

function startAutoUpdate(): void {
  if (autoUpdateTimer) return;
  autoUpdateTimer = setInterval(() => {
    if (!state.isQuizActive.get() && state.autoUpdateEnabled.get()) {
      increment();
    }
  }, 3000);
}

function stopAutoUpdate(): void {
  if (autoUpdateTimer) {
    clearInterval(autoUpdateTimer);
    autoUpdateTimer = null;
  }
}

export function toggleTheme(): void {
  document.body.classList.toggle('light-mode');
  saveTheme(document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function initializeSettings(): void {
  const saved = loadSettings();
  if (saved) {
    // Load and apply settings with proper fallbacks to defaults
    const questionTime = saved.questionTime ?? 5;
    const answerTime = saved.answerTime ?? 3;
    const difficulty = saved.difficulty ?? 3;
    const autoUpdate = saved.autoUpdate ?? false;
    
    state.questionTime.set(questionTime);
    state.answerTime.set(answerTime);
    state.difficulty.set(difficulty);
    state.autoUpdateEnabled.set(autoUpdate);
    
    // Sync the DOM elements with loaded values
    elements.questionTimeSlider.value = questionTime.toString();
    elements.answerTimeSlider.value = answerTime.toString();
    elements.difficultySlider.value = difficulty.toString();
    elements.autoUpdateCheckbox.checked = autoUpdate;
  } else {
    // No saved settings, ensure DOM matches default state values
    elements.questionTimeSlider.value = state.questionTime.get().toString();
    elements.answerTimeSlider.value = state.answerTime.get().toString();
    elements.difficultySlider.value = state.difficulty.get().toString();
    elements.autoUpdateCheckbox.checked = state.autoUpdateEnabled.get();
  }
  
  // Load theme preference
  if (loadTheme() === 'light') {
    document.body.classList.add('light-mode');
  }
}

function setupEffects(): void {
  // DOM updates
  effect(() => { elements.display.textContent = displayText.get(); });
  effect(() => { elements.timerDisplay.textContent = timerDisplayText.get(); });
  
  effect(() => {
    const percent = progressPercent.get();
    elements.progressBar.style.width = `${percent}%`;
    
    const phase = state.currentPhase.get();
    const color = phase === 'question' 
      ? 'linear-gradient(90deg, var(--success), #34d399)'
      : 'linear-gradient(90deg, var(--warning), #fbbf24)';
    elements.progressBar.style.background = color;
  });

  effect(() => {
    const isActive = state.isQuizActive.get();
    elements.quizButton.textContent = isActive ? 'Stop Quiz' : 'Start Quiz';
    elements.modeStatus.textContent = isActive ? 'Quiz' : 'Manual';
    elements.quizStatus.textContent = isActive ? 'Running' : 'Stopped';
    
    const disabled = isActive;
    elements.questionTimeSlider.disabled = disabled;
    elements.answerTimeSlider.disabled = disabled;
    elements.difficultySlider.disabled = disabled;
    elements.incrementBtn.disabled = disabled;
    elements.resetBtn.disabled = disabled;
    elements.autoUpdateCheckbox.disabled = disabled;
  });

  effect(() => {
    const autoUpdate = state.autoUpdateEnabled.get();
    const quizActive = state.isQuizActive.get();
    
    if (autoUpdate && !quizActive) {
      startAutoUpdate();
    } else {
      stopAutoUpdate();
    }
  });

  // Settings persistence
  effect(() => { 
    elements.questionTimeValue.textContent = `${state.questionTime.get()}s`; 
    saveSettingsToStorage();
  });
  
  effect(() => { 
    elements.answerTimeValue.textContent = `${state.answerTime.get()}s`; 
    saveSettingsToStorage();
  });
  
  effect(() => { 
    elements.difficultyValue.textContent = getDifficultyName(state.difficulty.get()); 
    saveSettingsToStorage();
  });
  
  effect(() => { 
    saveSettingsToStorage(); // For autoUpdate changes
  });
}

function saveSettingsToStorage(): void {
  const settings: Settings = {
    questionTime: state.questionTime.get(),
    answerTime: state.answerTime.get(),
    difficulty: state.difficulty.get(),
    autoUpdate: state.autoUpdateEnabled.get()
  };
  saveSettings(settings);
}

function setupEventListeners(): void {
  elements.questionTimeSlider.addEventListener('input', (e) => {
    state.questionTime.set(parseInt((e.target as HTMLInputElement).value));
  });
  
  elements.answerTimeSlider.addEventListener('input', (e) => {
    state.answerTime.set(parseInt((e.target as HTMLInputElement).value));
  });
  
  elements.difficultySlider.addEventListener('input', (e) => {
    state.difficulty.set(parseInt((e.target as HTMLInputElement).value) as DifficultyLevel);
  });
}

export function initialize(): void {
  elements = getElements();
  initializeSettings();
  setupEffects();
  setupEventListeners();
  updateLastTime();
}

// Export for testing
export { state, elements };