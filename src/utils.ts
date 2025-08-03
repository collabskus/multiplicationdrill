import { DifficultyLevel, DifficultyRange, Problem, Settings } from './types';

export function getDifficultyRange(level: DifficultyLevel): DifficultyRange {
  switch(level) {
    case 1: return { min: 2, max: 5 };   // Easy: 2-5
    case 2: return { min: 4, max: 8 };   // Medium: 4-8  
    case 3: return { min: 6, max: 12 };  // Hard: 6-12
    case 4: return { min: 10, max: 20 }; // Expert: 10-20
    default: return { min: 6, max: 12 };
  }
}

export function getDifficultyName(level: DifficultyLevel): string {
  switch(level) {
    case 1: return 'Easy';
    case 2: return 'Medium';
    case 3: return 'Hard';
    case 4: return 'Expert';
    default: return 'Hard';
  }
}

export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(difficulty: DifficultyLevel): Problem {
  const range = getDifficultyRange(difficulty);
  
  return {
    a: randomInRange(range.min, range.max),
    b: randomInRange(range.min, range.max)
  };
}

export function generateSeed(difficulty: DifficultyLevel): number {
  const range = getDifficultyRange(difficulty);
  return randomInRange(range.min, range.max);
}

export function loadSettings(): Settings | null {
  try {
    const saved = localStorage.getItem('mathQuizSettings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return null;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem('mathQuizSettings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadTheme(): 'light' | 'dark' {
  return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem('theme', theme);
}