import { test, expect } from '@playwright/test';

test.describe('Multiplication Drill', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to be fully loaded
    await page.waitForSelector('#display', { state: 'visible' });
  });

  test('should load with initial state', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle('Reactive Math Quiz');
    
    // Check initial display
    const display = page.locator('#display');
    await expect(display).toBeVisible();
    
    // Manual mode should show multiplication based on difficulty
    const displayText = await display.textContent();
    expect(displayText).toMatch(/0 × \d+ = 0/);
    
    // Check default settings are loaded
    await expect(page.locator('#questionTime')).toHaveValue('5');
    await expect(page.locator('#answerTime')).toHaveValue('3');
    await expect(page.locator('#difficulty')).toHaveValue('3');
    await expect(page.locator('#difficultyValue')).toHaveText('Hard');
  });

  test('manual mode increment and reset', async ({ page }) => {
    const display = page.locator('#display');
    const incrementBtn = page.locator('#incrementBtn');
    const resetBtn = page.locator('#resetBtn');
    
    // Get initial multiplier
    const initialText = await display.textContent();
    const multiplier = initialText?.match(/0 × (\d+)/)?.[1] || '10';
    
    // Click increment
    await incrementBtn.click();
    await expect(display).toHaveText(`1 × ${multiplier} = ${parseInt(multiplier)}`);
    
    // Click again
    await incrementBtn.click();
    await expect(display).toHaveText(`2 × ${multiplier} = ${2 * parseInt(multiplier)}`);
    
    // Reset
    await resetBtn.click();
    
    // Should be back to 0
    const text = await display.textContent();
    expect(text).toMatch(/0 × \d+ = 0/);
  });

  test('difficulty changes multiplier range', async ({ page }) => {
    const display = page.locator('#display');
    const difficultySlider = page.locator('#difficulty');
    const resetBtn = page.locator('#resetBtn');
    
    // Test Easy difficulty (1)
    await difficultySlider.fill('1');
    await page.waitForTimeout(400); // Wait for debounce
    
    // Reset a few times to verify range
    let inRange = true;
    for (let i = 0; i < 3; i++) {
      await resetBtn.click();
      await page.waitForTimeout(100);
      const text = await display.textContent();
      const multiplier = parseInt(text?.match(/0 × (\d+)/)?.[1] || '0');
      if (multiplier < 2 || multiplier > 5) {
        inRange = false;
        break;
      }
    }
    expect(inRange).toBe(true);
    
    // Test Expert difficulty (4)
    await difficultySlider.fill('4');
    await page.waitForTimeout(400);
    
    inRange = true;
    for (let i = 0; i < 3; i++) {
      await resetBtn.click();
      await page.waitForTimeout(100);
      const text = await display.textContent();
      const multiplier = parseInt(text?.match(/0 × (\d+)/)?.[1] || '0');
      if (multiplier < 10 || multiplier > 20) {
        inRange = false;
        break;
      }
    }
    expect(inRange).toBe(true);
  });

  test('quiz mode basic flow', async ({ page }) => {
    const display = page.locator('#display');
    const quizButton = page.locator('#quizButton');
    const progressBar = page.locator('#progressBar');
    
    // Set shorter times for faster test
    await page.locator('#questionTime').fill('2');
    await page.locator('#answerTime').fill('1');
    await page.waitForTimeout(400); // Wait for debounce
    
    // Start quiz
    await quizButton.click();
    await page.waitForTimeout(200); // Let quiz initialize
    
    // Check button changed
    await expect(quizButton).toHaveText('Stop Quiz');
    
    // Progress bar should be visible
    await expect(progressBar).toBeVisible();
    
    // Should show a multiplication problem (with or without answer)
    const problemText = await display.textContent();
    expect(problemText).toMatch(/\d+ × \d+/);
    
    // Controls should be disabled
    await expect(page.locator('#incrementBtn')).toBeDisabled();
    await expect(page.locator('#resetBtn')).toBeDisabled();
    
    // Wait for at least one complete cycle
    await page.waitForTimeout(3500);
    
    // Stop quiz
    await quizButton.click();
    await expect(quizButton).toHaveText('Start Quiz');
    
    // Controls should be enabled again
    await expect(page.locator('#incrementBtn')).toBeEnabled();
    await expect(page.locator('#resetBtn')).toBeEnabled();
  });

  test('theme toggle', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    const body = page.locator('body');
    
    // Should start in dark mode
    await expect(body).not.toHaveClass('light-mode');
    
    // Toggle to light mode
    await themeToggle.click();
    await expect(body).toHaveClass('light-mode');
    
    // Toggle back to dark mode
    await themeToggle.click();
    await expect(body).not.toHaveClass('light-mode');
  });

  test('settings persistence', async ({ page }) => {
    // Set some values
    await page.locator('#questionTime').fill('10');
    await page.locator('#answerTime').fill('5');
    await page.locator('#difficulty').fill('4');
    
    // Wait for debounced save
    await page.waitForTimeout(400);
    
    // Reload page
    await page.reload();
    await page.waitForSelector('#display', { state: 'visible' });
    
    // Check values are restored
    await expect(page.locator('#questionTime')).toHaveValue('10');
    await expect(page.locator('#answerTime')).toHaveValue('5');
    await expect(page.locator('#difficulty')).toHaveValue('4');
    await expect(page.locator('#difficultyValue')).toHaveText('Expert');
  });

  test('auto-update mode basic functionality', async ({ page }) => {
    const display = page.locator('#display');
    const autoUpdateCheckbox = page.locator('#autoUpdate');
    
    // Enable auto-update
    await autoUpdateCheckbox.check();
    
    // Get initial value
    const initialText = await display.textContent();
    const initialCount = parseInt(initialText?.match(/(\d+) ×/)?.[1] || '0');
    
    // Wait for auto-update (3 seconds + buffer)
    await page.waitForTimeout(3500);
    
    // Should have incremented at least once
    const updatedText = await display.textContent();
    const updatedCount = parseInt(updatedText?.match(/(\d+) ×/)?.[1] || '0');
    expect(updatedCount).toBeGreaterThan(initialCount);
    
    // Disable auto-update
    await autoUpdateCheckbox.uncheck();
  });

  test('keyboard navigation for sliders', async ({ page }) => {
    const difficultySlider = page.locator('#difficulty');
    
    // Focus the slider
    await difficultySlider.focus();
    
    // Use arrow keys
    await page.keyboard.press('ArrowRight');
    await expect(difficultySlider).toHaveValue('4');
    
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(difficultySlider).toHaveValue('2');
  });

  test('status panel updates correctly', async ({ page }) => {
    const modeStatus = page.locator('#modeStatus');
    const quizStatus = page.locator('#quizStatus');
    const quizButton = page.locator('#quizButton');
    
    // Initial state
    await expect(modeStatus).toHaveText('Manual');
    await expect(quizStatus).toHaveText('Stopped');
    
    // Start quiz
    await quizButton.click();
    await page.waitForTimeout(200);
    
    await expect(modeStatus).toHaveText('Quiz');
    await expect(quizStatus).toHaveText('Running');
    
    // Stop quiz
    await quizButton.click();
    
    await expect(modeStatus).toHaveText('Manual');
    await expect(quizStatus).toHaveText('Stopped');
  });

  test('calculations are mathematically correct', async ({ page }) => {
    const display = page.locator('#display');
    const incrementBtn = page.locator('#incrementBtn');
    
    // Get multiplier
    const initialText = await display.textContent();
    const multiplier = parseInt(initialText?.match(/0 × (\d+)/)?.[1] || '10');
    
    // Test several calculations
    for (let i = 1; i <= 3; i++) {
      await incrementBtn.click();
      const expected = `${i} × ${multiplier} = ${i * multiplier}`;
      await expect(display).toHaveText(expected);
    }
  });
});

// Mobile viewport test
test.describe('Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('responsive design works on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#display', { state: 'visible' });
    
    // Check all elements are visible
    await expect(page.locator('#display')).toBeVisible();
    await expect(page.locator('#quizButton')).toBeVisible();
    await expect(page.locator('#incrementBtn')).toBeVisible();
    
    // No horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = await page.locator('body').evaluate(el => el.clientWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
