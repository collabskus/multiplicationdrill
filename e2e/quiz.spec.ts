import { test, expect, Page } from '@playwright/test';

// Increase timeout for slower tests
test.setTimeout(45000);

// Helper functions for better test organization
const getMultiplier = async (page: Page): Promise<number> => {
  const display = page.locator('#display');
  const text = await display.textContent();
  const match = text?.match(/\d+ × (\d+)/);
  return parseInt(match?.[1] || '10');
};

const waitForDebounce = async (page: Page, ms: number = 400) => {
  await page.waitForTimeout(ms);
};

test.describe('Multiplication Drill', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app initialization
    await page.waitForSelector('#display', { state: 'visible' });
  });

  test.describe('Initial Load', () => {
    test('should load with correct initial state', async ({ page }) => {
      // Check title
      await expect(page).toHaveTitle('Reactive Math Quiz');
      
      // Check all major sections are visible
      await expect(page.locator('#display')).toBeVisible();
      await expect(page.locator('#quizButton')).toBeVisible();
      await expect(page.locator('#incrementBtn')).toBeVisible();
      await expect(page.locator('#resetBtn')).toBeVisible();
      
      // Check initial display shows 0 × [multiplier] = 0
      const displayText = await page.locator('#display').textContent();
      expect(displayText).toMatch(/^0 × \d+ = 0$/);
      
      // Check default settings
      await expect(page.locator('#questionTime')).toHaveValue('5');
      await expect(page.locator('#answerTime')).toHaveValue('3');
      await expect(page.locator('#difficulty')).toHaveValue('3');
      await expect(page.locator('#difficultyValue')).toHaveText('Hard');
      
      // Check status panel
      await expect(page.locator('#modeStatus')).toHaveText('Manual');
      await expect(page.locator('#quizStatus')).toHaveText('Stopped');
    });

    test('should have proper ARIA labels for accessibility', async ({ page }) => {
      // Check ARIA labels exist
      const questionTimeSlider = page.locator('#questionTime');
      await expect(questionTimeSlider).toHaveAttribute('aria-label', 'Question time in seconds');
      await expect(questionTimeSlider).toHaveAttribute('aria-valuemin', '1');
      await expect(questionTimeSlider).toHaveAttribute('aria-valuemax', '30');
      
      const difficultySlider = page.locator('#difficulty');
      await expect(difficultySlider).toHaveAttribute('aria-label', 'Difficulty level');
      await expect(difficultySlider).toHaveAttribute('aria-valuetext', 'Hard');
    });
  });

  test.describe('Manual Mode', () => {
    test('increment and reset functionality', async ({ page }) => {
      const display = page.locator('#display');
      const incrementBtn = page.locator('#incrementBtn');
      const resetBtn = page.locator('#resetBtn');
      const updateTime = page.locator('#updateTime');
      
      // Get initial multiplier
      const multiplier = await getMultiplier(page);
      
      // Test increment
      await incrementBtn.click();
      await expect(display).toHaveText(`1 × ${multiplier} = ${multiplier}`);
      
      // Check update time changed
      const time1 = await updateTime.textContent();
      expect(time1).not.toBe('Never');
      
      // Multiple increments
      await incrementBtn.click();
      await incrementBtn.click();
      await expect(display).toHaveText(`3 × ${multiplier} = ${3 * multiplier}`);
      
      // Test reset
      await resetBtn.click();
      const resetText = await display.textContent();
      expect(resetText).toMatch(/^0 × \d+ = 0$/);
      
      // Multiplier might change after reset (random within difficulty range)
      const newMultiplier = await getMultiplier(page);
      expect(newMultiplier).toBeGreaterThanOrEqual(6);  // Hard difficulty min
      expect(newMultiplier).toBeLessThanOrEqual(12); // Hard difficulty max
    });

    test('rapid clicking should not break the app', async ({ page }) => {
      const incrementBtn = page.locator('#incrementBtn');
      const display = page.locator('#display');
      
      // Rapid fire clicks
      for (let i = 0; i < 10; i++) {
        await incrementBtn.click();
      }
      
      const text = await display.textContent();
      expect(text).toMatch(/^10 × \d+ = \d+$/);
    });
  });

  test.describe('Difficulty Settings', () => {
    test('difficulty ranges are correct', async ({ page }) => {
      const display = page.locator('#display');
      const difficultySlider = page.locator('#difficulty');
      const difficultyValue = page.locator('#difficultyValue');
      const resetBtn = page.locator('#resetBtn');
      
      // Test each difficulty level with multiple resets to check range
      const difficulties = [
        { value: '1', name: 'Easy', min: 2, max: 5 },
        { value: '2', name: 'Medium', min: 4, max: 8 },
        { value: '3', name: 'Hard', min: 6, max: 12 },
        { value: '4', name: 'Expert', min: 10, max: 20 }
      ];
      
      for (const diff of difficulties) {
        await difficultySlider.fill(diff.value);
        await waitForDebounce(page);
        await expect(difficultyValue).toHaveText(diff.name);
        
        // Test multiple random values are within range
        for (let i = 0; i < 3; i++) {
          await resetBtn.click();
          const multiplier = await getMultiplier(page);
          expect(multiplier).toBeGreaterThanOrEqual(diff.min);
          expect(multiplier).toBeLessThanOrEqual(diff.max);
        }
      }
    });

    test('difficulty change updates ARIA labels', async ({ page }) => {
      const difficultySlider = page.locator('#difficulty');
      
      await difficultySlider.fill('1');
      await expect(difficultySlider).toHaveAttribute('aria-valuenow', '1');
      await expect(difficultySlider).toHaveAttribute('aria-valuetext', 'Easy');
      
      await difficultySlider.fill('4');
      await expect(difficultySlider).toHaveAttribute('aria-valuenow', '4');
      await expect(difficultySlider).toHaveAttribute('aria-valuetext', 'Expert');
    });
  });

  test.describe('Quiz Mode', () => {
    test('complete quiz cycle with timing verification', async ({ page }) => {
      const display = page.locator('#display');
      const quizButton = page.locator('#quizButton');
      const progressBar = page.locator('#progressBar');
      const timerDisplay = page.locator('#timerDisplay');
      const modeStatus = page.locator('#modeStatus');
      const quizStatus = page.locator('#quizStatus');
      
      // Configure shorter times for faster test
      await page.locator('#questionTime').fill('2');
      await page.locator('#answerTime').fill('1');
      await waitForDebounce(page);
      
      // Start quiz
      await quizButton.click();
      
      // Verify UI state changes
      await expect(quizButton).toHaveText('Stop Quiz');
      await expect(modeStatus).toHaveText('Quiz');
      await expect(quizStatus).toHaveText('Running');
      await expect(progressBar).toBeVisible();
      
      // Verify controls are disabled during quiz
      await expect(page.locator('#incrementBtn')).toBeDisabled();
      await expect(page.locator('#resetBtn')).toBeDisabled();
      await expect(page.locator('#questionTime')).toBeDisabled();
      await expect(page.locator('#answerTime')).toBeDisabled();
      await expect(page.locator('#difficulty')).toBeDisabled();
      await expect(page.locator('#autoUpdate')).toBeDisabled();
      
      // Question phase
      const questionText = await display.textContent();
      expect(questionText).toMatch(/^\d+ × \d+$/);
      const timerText = await timerDisplay.textContent();
      expect(timerText).toContain('Question:');
      
      // Get progress bar color (should be greenish)
      const progressBarStyle = await progressBar.evaluate(el => 
        window.getComputedStyle(el).background
      );
      expect(progressBarStyle).toContain('linear-gradient');
      
      // Wait for answer phase
      await page.waitForTimeout(2100);
      
      // Answer phase
      const answerText = await display.textContent();
      expect(answerText).toMatch(/^\d+ × \d+ = \d+$/);
      const answerTimerText = await timerDisplay.textContent();
      expect(answerTimerText).toContain('Answer:');
      
      // Wait for next question
      await page.waitForTimeout(1100);
      
      // Should show new question
      const newQuestionText = await display.textContent();
      expect(newQuestionText).toMatch(/^\d+ × \d+$/);
      expect(newQuestionText).not.toBe(questionText); // Should be different
      
      // Stop quiz
      await quizButton.click();
      
      // Verify return to manual mode
      await expect(quizButton).toHaveText('Start Quiz');
      await expect(modeStatus).toHaveText('Manual');
      await expect(quizStatus).toHaveText('Stopped');
      await expect(timerDisplay).toHaveText('Ready');
      
      // Controls should be re-enabled
      await expect(page.locator('#incrementBtn')).toBeEnabled();
      await expect(page.locator('#resetBtn')).toBeEnabled();
    });

    test('quiz problems respect difficulty settings', async ({ page }) => {
      const display = page.locator('#display');
      const quizButton = page.locator('#quizButton');
      
      // Set to Easy difficulty
      await page.locator('#difficulty').fill('1');
      await page.locator('#questionTime').fill('1');
      await waitForDebounce(page);
      
      // Start quiz
      await quizButton.click();
      
      // Check multiple problems
      for (let i = 0; i < 3; i++) {
        const problemText = await display.textContent();
        const match = problemText?.match(/(\d+) × (\d+)/);
        if (match) {
          const [, a, b] = match;
          expect(parseInt(a)).toBeGreaterThanOrEqual(2);
          expect(parseInt(a)).toBeLessThanOrEqual(5);
          expect(parseInt(b)).toBeGreaterThanOrEqual(2);
          expect(parseInt(b)).toBeLessThanOrEqual(5);
        }
        await page.waitForTimeout(2100); // Wait for next problem
      }
      
      await quizButton.click(); // Stop quiz
    });
  });

  test.describe('Auto-Update Mode', () => {
    test('auto-update with visibility change simulation', async ({ page }) => {
      const display = page.locator('#display');
      const autoUpdateCheckbox = page.locator('#autoUpdate');
      
      // Enable auto-update
      await autoUpdateCheckbox.check();
      await expect(autoUpdateCheckbox).toBeChecked();
      
      // Get initial count
      const initialText = await display.textContent();
      const initialCount = parseInt(initialText?.match(/(\d+) ×/)?.[1] || '0');
      
      // Wait for first auto-update
      await page.waitForTimeout(3100);
      
      const updatedText = await display.textContent();
      const updatedCount = parseInt(updatedText?.match(/(\d+) ×/)?.[1] || '0');
      expect(updatedCount).toBe(initialCount + 1);
      
      // Disable and verify it stops
      await autoUpdateCheckbox.uncheck();
      await page.waitForTimeout(3100);
      
      const finalText = await display.textContent();
      const finalCount = parseInt(finalText?.match(/(\d+) ×/)?.[1] || '0');
      expect(finalCount).toBe(updatedCount); // Should not have incremented
    });

    test('auto-update disabled during quiz', async ({ page }) => {
      const autoUpdateCheckbox = page.locator('#autoUpdate');
      const quizButton = page.locator('#quizButton');
      
      // Enable auto-update
      await autoUpdateCheckbox.check();
      
      // Start quiz
      await quizButton.click();
      
      // Checkbox should be disabled
      await expect(autoUpdateCheckbox).toBeDisabled();
      
      // Stop quiz
      await quizButton.click();
      
      // Checkbox should be enabled again and still checked
      await expect(autoUpdateCheckbox).toBeEnabled();
      await expect(autoUpdateCheckbox).toBeChecked();
    });
  });

  test.describe('Theme Toggle', () => {
    test('theme persistence across reload', async ({ page }) => {
      const themeToggle = page.locator('.theme-toggle');
      const body = page.locator('body');
      
      // Toggle to light mode
      await themeToggle.click();
      await expect(body).toHaveClass('light-mode');
      
      // Reload and verify persistence
      await page.reload();
      await expect(body).toHaveClass('light-mode');
      
      // Toggle back to dark mode
      await themeToggle.click();
      await expect(body).not.toHaveClass('light-mode');
      
      // Reload and verify dark mode persists
      await page.reload();
      await expect(body).not.toHaveClass('light-mode');
    });

    test('theme toggle visual feedback', async ({ page }) => {
      const themeToggle = page.locator('.theme-toggle');
      
      // Check hover state works
      await themeToggle.hover();
      const hoverStyle = await themeToggle.evaluate(el => 
        window.getComputedStyle(el).background
      );
      // Should have changed on hover
      expect(hoverStyle).toBeTruthy();
    });
  });

  test.describe('Settings Persistence', () => {
    test('all settings persist correctly', async ({ page, context }) => {
      // Set all values to non-defaults
      await page.locator('#questionTime').fill('15');
      await page.locator('#answerTime').fill('7');
      await page.locator('#difficulty').fill('2');
      await page.locator('#autoUpdate').check();
      
      // Toggle theme
      await page.locator('.theme-toggle').click();
      
      // Wait for debounced save
      await waitForDebounce(page, 500);
      
      // Create new page in same context (shares localStorage)
      const newPage = await context.newPage();
      await newPage.goto('/');
      
      // Verify all settings
      await expect(newPage.locator('#questionTime')).toHaveValue('15');
      await expect(newPage.locator('#answerTime')).toHaveValue('7');
      await expect(newPage.locator('#difficulty')).toHaveValue('2');
      await expect(newPage.locator('#difficultyValue')).toHaveText('Medium');
      await expect(newPage.locator('#autoUpdate')).toBeChecked();
      await expect(newPage.locator('body')).toHaveClass('light-mode');
      
      await newPage.close();
    });

    test('handles corrupted localStorage gracefully', async ({ page }) => {
      // Inject corrupted data
      await page.evaluate(() => {
        localStorage.setItem('mathQuizSettings', 'invalid json {]');
      });
      
      // Reload should not crash
      await page.reload();
      
      // Should load with defaults
      await expect(page.locator('#questionTime')).toHaveValue('5');
      await expect(page.locator('#difficulty')).toHaveValue('3');
    });
  });

  test.describe('Edge Cases', () => {
    test('extreme timer values', async ({ page }) => {
      const quizButton = page.locator('#quizButton');
      const display = page.locator('#display');
      
      // Set minimum times
      await page.locator('#questionTime').fill('1');
      await page.locator('#answerTime').fill('1');
      await waitForDebounce(page);
      
      // Start quiz
      await quizButton.click();
      
      // Should transition through phases quickly
      const question = await display.textContent();
      expect(question).toMatch(/^\d+ × \d+$/);
      
      await page.waitForTimeout(1100);
      const answer = await display.textContent();
      expect(answer).toMatch(/^\d+ × \d+ = \d+$/);
      
      await page.waitForTimeout(1100);
      const nextQuestion = await display.textContent();
      expect(nextQuestion).toMatch(/^\d+ × \d+$/);
      
      await quizButton.click();
      
      // Now test maximum times
      await page.locator('#questionTime').fill('30');
      await page.locator('#answerTime').fill('30');
      await waitForDebounce(page);
      
      // Values should be accepted
      await expect(page.locator('#questionTimeValue')).toHaveText('30s');
      await expect(page.locator('#answerTimeValue')).toHaveText('30s');
    });

    test('slider keyboard navigation', async ({ page }) => {
      const difficultySlider = page.locator('#difficulty');
      
      // Focus the slider
      await difficultySlider.focus();
      
      // Use keyboard to change value
      await page.keyboard.press('ArrowRight');
      await expect(difficultySlider).toHaveValue('4');
      await expect(page.locator('#difficultyValue')).toHaveText('Expert');
      
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(difficultySlider).toHaveValue('2');
      await expect(page.locator('#difficultyValue')).toHaveText('Medium');
      
      // Home and End keys
      await page.keyboard.press('Home');
      await expect(difficultySlider).toHaveValue('1');
      
      await page.keyboard.press('End');
      await expect(difficultySlider).toHaveValue('4');
    });

    test('calculations are mathematically correct', async ({ page }) => {
      const display = page.locator('#display');
      const incrementBtn = page.locator('#incrementBtn');
      
      // Get multiplier
      const multiplier = await getMultiplier(page);
      
      // Test several calculations
      for (let i = 1; i <= 5; i++) {
        await incrementBtn.click();
        const expected = `${i} × ${multiplier} = ${i * multiplier}`;
        await expect(display).toHaveText(expected);
      }
      
      // Test in quiz mode
      const quizButton = page.locator('#quizButton');
      await quizButton.click();
      
      // Wait for answer phase
      await page.waitForTimeout(5100);
      
      const answerText = await display.textContent();
      const match = answerText?.match(/(\d+) × (\d+) = (\d+)/);
      if (match) {
        const [, a, b, result] = match;
        expect(parseInt(result)).toBe(parseInt(a) * parseInt(b));
      }
      
      await quizButton.click();
    });
  });

  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('responsive design works on mobile', async ({ page }) => {
      await page.goto('/');
      
      // Check all elements are visible and accessible
      await expect(page.locator('#display')).toBeVisible();
      await expect(page.locator('#quizButton')).toBeVisible();
      
      // Font size should be adjusted (smaller)
      const displayFontSize = await page.locator('#display').evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      // Should be 2.2em on mobile (per CSS)
      expect(parseFloat(displayFontSize)).toBeLessThan(48); // Approximate px value
      
      // All controls should be reachable without horizontal scroll
      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      const viewportWidth = await page.locator('body').evaluate(el => el.clientWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    });
  });
});
