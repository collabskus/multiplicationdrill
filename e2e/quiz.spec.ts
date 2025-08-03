import { test, expect } from '@playwright/test';

test.describe('Multiplication Drill', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
  });

  test('manual mode increment', async ({ page }) => {
    const display = page.locator('#display');
    const incrementBtn = page.locator('#incrementBtn');
    
    // Get initial multiplier
    const initialText = await display.textContent();
    const multiplier = initialText?.match(/0 × (\d+)/)?.[1] || '10';
    
    // Click increment
    await incrementBtn.click();
    await expect(display).toHaveText(`1 × ${multiplier} = ${parseInt(multiplier)}`);
    
    // Click again
    await incrementBtn.click();
    await expect(display).toHaveText(`2 × ${multiplier} = ${2 * parseInt(multiplier)}`);
  });

  test('manual mode reset', async ({ page }) => {
    const display = page.locator('#display');
    const incrementBtn = page.locator('#incrementBtn');
    const resetBtn = page.locator('#resetBtn');
    
    // Increment a few times
    await incrementBtn.click();
    await incrementBtn.click();
    
    // Reset
    await resetBtn.click();
    
    // Should be back to 0
    const text = await display.textContent();
    expect(text).toMatch(/0 × \d+ = 0/);
  });

  test('difficulty changes seed', async ({ page }) => {
    const display = page.locator('#display');
    const difficultySlider = page.locator('#difficulty');
    
    // Get initial display
    const initialText = await display.textContent();
    const initialMultiplier = initialText?.match(/0 × (\d+)/)?.[1];
    
    // Change difficulty to Easy (1)
    await difficultySlider.fill('1');
    await page.waitForTimeout(100); // Wait for state update
    
    const easyText = await display.textContent();
    const easyMultiplier = easyText?.match(/0 × (\d+)/)?.[1];
    expect(parseInt(easyMultiplier || '0')).toBeGreaterThanOrEqual(2);
    expect(parseInt(easyMultiplier || '0')).toBeLessThanOrEqual(5);
    
    // Change to Expert (4)
    await difficultySlider.fill('4');
    await page.waitForTimeout(100);
    
    const expertText = await display.textContent();
    const expertMultiplier = expertText?.match(/0 × (\d+)/)?.[1];
    expect(parseInt(expertMultiplier || '0')).toBeGreaterThanOrEqual(10);
    expect(parseInt(expertMultiplier || '0')).toBeLessThanOrEqual(20);
  });

  test('quiz mode flow', async ({ page }) => {
    const display = page.locator('#display');
    const quizButton = page.locator('#quizButton');
    const progressBar = page.locator('#progressBar');
    
    // Start quiz
    await quizButton.click();
    await expect(quizButton).toHaveText('Stop Quiz');
    
    // Should show a multiplication problem
    const problemText = await display.textContent();
    expect(problemText).toMatch(/\d+ × \d+$/);
    
    // Progress bar should be visible
    await expect(progressBar).toBeVisible();
    
    // Wait for answer phase
    await page.waitForTimeout(5500); // Default question time + buffer
    
    // Should show answer
    const answerText = await display.textContent();
    expect(answerText).toMatch(/\d+ × \d+ = \d+/);
    
    // Stop quiz
    await quizButton.click();
    await expect(quizButton).toHaveText('Start Quiz');
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

  test('settings persistence', async ({ page, context }) => {
    // Set some values
    await page.locator('#questionTime').fill('10');
    await page.locator('#answerTime').fill('5');
    await page.locator('#difficulty').fill('4');
    
    // Wait for settings to save
    await page.waitForTimeout(100);
    
    // Reload page
    await page.reload();
    
    // Check values are restored
    await expect(page.locator('#questionTime')).toHaveValue('10');
    await expect(page.locator('#answerTime')).toHaveValue('5');
    await expect(page.locator('#difficulty')).toHaveValue('4');
    await expect(page.locator('#difficultyValue')).toHaveText('Expert');
  });

  test('auto-update mode', async ({ page }) => {
    const display = page.locator('#display');
    const autoUpdateCheckbox = page.locator('#autoUpdate');
    
    // Enable auto-update
    await autoUpdateCheckbox.check();
    
    // Get initial value
    const initialText = await display.textContent();
    const initialCount = parseInt(initialText?.match(/(\d+) ×/)?.[1] || '0');
    
    // Wait for auto-update (3 seconds)
    await page.waitForTimeout(3500);
    
    // Should have incremented
    const updatedText = await display.textContent();
    const updatedCount = parseInt(updatedText?.match(/(\d+) ×/)?.[1] || '0');
    expect(updatedCount).toBe(initialCount + 1);
  });
});