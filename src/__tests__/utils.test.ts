import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getDifficultyRange, 
  getDifficultyName, 
  randomInRange, 
  generateProblem,
  loadSettings,
  saveSettings,
  loadTheme,
  saveTheme
} from '../utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('getDifficultyRange', () => {
  it('should return correct ranges for each difficulty level', () => {
    expect(getDifficultyRange(1)).toEqual({ min: 2, max: 5 });
    expect(getDifficultyRange(2)).toEqual({ min: 4, max: 8 });
    expect(getDifficultyRange(3)).toEqual({ min: 6, max: 12 });
    expect(getDifficultyRange(4)).toEqual({ min: 10, max: 20 });
  });
});

describe('getDifficultyName', () => {
  it('should return correct names for each difficulty level', () => {
    expect(getDifficultyName(1)).toBe('Easy');
    expect(getDifficultyName(2)).toBe('Medium');
    expect(getDifficultyName(3)).toBe('Hard');
    expect(getDifficultyName(4)).toBe('Expert');
  });
});

describe('randomInRange', () => {
  it('should generate numbers within specified range', () => {
    for (let i = 0; i < 100; i++) {
      const num = randomInRange(5, 10);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThanOrEqual(10);
    }
  });

  it('should handle single value range', () => {
    const num = randomInRange(5, 5);
    expect(num).toBe(5);
  });
});

describe('generateProblem', () => {
  it('should generate problems within difficulty range', () => {
    // Test Easy difficulty
    for (let i = 0; i < 20; i++) {
      const problem = generateProblem(1);
      expect(problem.a).toBeGreaterThanOrEqual(2);
      expect(problem.a).toBeLessThanOrEqual(5);
      expect(problem.b).toBeGreaterThanOrEqual(2);
      expect(problem.b).toBeLessThanOrEqual(5);
    }

    // Test Expert difficulty
    for (let i = 0; i < 20; i++) {
      const problem = generateProblem(4);
      expect(problem.a).toBeGreaterThanOrEqual(10);
      expect(problem.a).toBeLessThanOrEqual(20);
      expect(problem.b).toBeGreaterThanOrEqual(10);
      expect(problem.b).toBeLessThanOrEqual(20);
    }
  });
});

describe('Settings persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should save and load settings', () => {
    const settings = {
      questionTime: 10,
      answerTime: 5,
      difficulty: 2 as const,
      autoUpdate: true
    };

    saveSettings(settings);
    const loaded = loadSettings();
    expect(loaded).toEqual(settings);
  });

  it('should return null for missing settings', () => {
    expect(loadSettings()).toBeNull();
  });

  it('should handle corrupted localStorage data', () => {
    localStorageMock.setItem('mathQuizSettings', 'invalid json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(loadSettings()).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('Theme persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should save and load theme', () => {
    saveTheme('light');
    expect(loadTheme()).toBe('light');
    
    saveTheme('dark');
    expect(loadTheme()).toBe('dark');
  });

  it('should default to dark theme', () => {
    expect(loadTheme()).toBe('dark');
  });
});