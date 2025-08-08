# Comprehensive Testing Notes - Multiplication Drill Application

## 1. Visual and Theme Testing

### Dark/Light Mode Toggle
- **Location**: Top-right corner (🌓 button)
- **Test Cases**:
  1. Default state should be dark mode
  2. Click toggle → switches to light mode (rainbow gradient background animation)
  3. Click again → returns to dark mode
  4. Theme preference persists after page reload
  5. Verify all UI elements remain readable in both themes
  6. Check contrast ratios meet accessibility standards

## 2. Quiz Mode Testing

### Basic Quiz Flow
1. **Starting a Quiz**:
   - Click "Start Quiz" button
   - Button text changes to "Stop Quiz"
   - Display shows multiplication problem (e.g., "7 × 8")
   - Progress bar begins filling
   - Timer shows "Question: X.Xs"
   - Manual controls become disabled (grayed out)

2. **Question Phase**:
   - Problem displays without answer for configured duration
   - Progress bar fills from left to right (green gradient)
   - Timer counts down from question time setting
   - Numbers in problem should match difficulty range

3. **Answer Phase**:
   - Display shows full equation with answer (e.g., "7 × 8 = 56")
   - Progress bar changes color (orange/yellow gradient)
   - Timer shows "Answer: X.Xs" and counts down
   - Progress bar resets and fills again for answer duration

4. **Continuous Flow**:
   - After answer phase, automatically starts new problem
   - Problems should vary (not repeat same numbers constantly)
   - Quiz continues until manually stopped

5. **Stopping Quiz**:
   - Click "Stop Quiz" button
   - Returns to manual mode display
   - Shows current counter value with multiplier
   - All controls re-enable
   - Timer shows "Ready"

## 3. Settings Configuration

### Question Time Slider
- **Range**: 1-30 seconds
- **Default**: 5 seconds
- **Test Cases**:
  1. Drag slider to minimum (1s) - verify "1s" displays
  2. Drag to maximum (30s) - verify "30s" displays
  3. Set to 10s, start quiz, verify question displays for 10 seconds
  4. Cannot be adjusted during active quiz
  5. Setting persists after page reload

### Answer Time Slider
- **Range**: 1-30 seconds
- **Default**: 3 seconds
- **Test Cases**:
  1. Similar to Question Time tests
  2. Verify answer phase uses this duration
  3. Can be different from question time

### Difficulty Slider
- **Range**: 1-4 (Easy/Medium/Hard/Expert)
- **Default**: 3 (Hard)
- **Test Cases**:
  1. **Easy (1)**: Problems use numbers 2-5
  2. **Medium (2)**: Problems use numbers 4-8
  3. **Hard (3)**: Problems use numbers 6-12
  4. **Expert (4)**: Problems use numbers 10-20
  5. Changing difficulty updates manual mode multiplier immediately
  6. Cannot be changed during active quiz
  7. Verify problem ranges in quiz mode match selected difficulty

## 4. Manual Mode Testing

### Increment Button
- **Test Cases**:
  1. Each click increases counter by 1
  2. Display updates to show: `[counter] × [multiplier] = [product]`
  3. Multiplier changes based on difficulty setting
  4. Last Update time refreshes with each click
  5. Button disabled during quiz mode

### Reset Button
- **Test Cases**:
  1. Resets counter to 0
  2. Generates new random multiplier within difficulty range
  3. Display shows "0 × [new multiplier] = 0"
  4. Last Update time refreshes
  5. Button disabled during quiz mode

### Auto-Update Checkbox
- **Test Cases**:
  1. When checked, counter increments every 3 seconds
  2. Only works in manual mode (not during quiz)
  3. Stops auto-increment when unchecked
  4. Auto-update pauses when browser tab loses focus (battery saving)
  5. Resumes when tab regains focus
  6. Setting persists after page reload
  7. Checkbox disabled during quiz mode

## 5. Display and Visual Feedback

### Main Display
- **Test Cases**:
  1. Font size is large and readable
  2. Has subtle shine animation effect
  3. Shows different content based on mode:
     - Manual: `[counter] × [multiplier] = [result]`
     - Quiz Question: `[num1] × [num2]`
     - Quiz Answer: `[num1] × [num2] = [result]`

### Progress Bar
- **Test Cases**:
  1. Hidden in manual mode
  2. Green gradient during question phase
  3. Orange gradient during answer phase
  4. Smooth animation from 0% to 100%
  5. Has shimmer effect overlay
  6. Resets between phases

### Status Panel
- **Always Visible Information**:
  1. **Mode**: Shows "Manual" or "Quiz"
  2. **Quiz State**: Shows "Stopped" or "Running"
  3. **Last Update**: Shows timestamp of last change

## 6. Accessibility Testing

### Keyboard Navigation
1. **Tab Order**:
   - All interactive elements reachable via Tab key
   - Logical tab order (top to bottom, left to right)
   - Focus indicators visible on all elements

2. **Slider Controls**:
   - Arrow keys adjust values
   - Home/End keys jump to min/max
   - Values announced to screen readers

3. **ARIA Labels**:
   - All sliders have descriptive labels
   - Current values announced
   - Difficulty announces name (Easy/Medium/Hard/Expert)

### Screen Reader Testing
- All controls properly labeled
- State changes announced
- Timer updates readable
- Quiz problems and answers announced

## 7. Performance and Edge Cases

### Browser Compatibility
- Test on Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Verify animations smooth on all platforms

### Local Storage
1. **Settings Persistence**:
   - Question time, answer time, difficulty, auto-update state
   - Survives page refresh
   - Handles corrupted storage gracefully

2. **Theme Persistence**:
   - Dark/light mode preference saved
   - Applies immediately on page load

### Edge Cases to Test
1. **Rapid Clicking**:
   - Spam increment button - should handle gracefully
   - Quickly toggle quiz on/off - no crashes or stuck states

2. **Extreme Settings**:
   - 1 second question + 1 second answer - still playable
   - 30 second timers - progress bar scales correctly

3. **Browser States**:
   - Page refresh during quiz - returns to manual mode
   - Multiple tabs open - each maintains independent state
   - Private/incognito mode - works without localStorage

4. **Timing Precision**:
   - Timer counts down smoothly
   - No skipped numbers in countdown
   - Phases transition at exactly 0.0s

## 8. Mobile Testing

### Responsive Design
1. **Small Screens** (< 600px):
   - Container fits screen width
   - Font sizes remain readable
   - All controls accessible
   - No horizontal scrolling

2. **Touch Interactions**:
   - Buttons have adequate touch targets (minimum 44x44px)
   - Sliders draggable with touch
   - No hover-dependent functionality

3. **Orientation**:
   - Works in portrait and landscape
   - Layout adjusts appropriately

## 9. Data Validation

### Number Ranges
1. Verify multiplier stays within difficulty bounds
2. Quiz problems use correct number ranges
3. No negative numbers or decimals
4. Products calculate correctly

### Timer Behavior
1. Never goes negative
2. Displays one decimal place consistently
3. Stops at exactly 0.0

## 10. User Experience Testing

### First-Time User
1. Interface intuitive without instructions
2. Default settings provide good experience
3. Purpose of each control clear

### Feedback and Responsiveness
1. All actions have immediate visual feedback
2. Disabled states clearly indicated
3. Loading/transition states smooth
4. No confusing delays or lag

## 11. Regression Testing Checklist

After any code changes, verify:
- [ ] Theme toggle works and persists
- [ ] Quiz start/stop functions correctly
- [ ] All sliders update values and labels
- [ ] Manual mode increment/reset work
- [ ] Auto-update functions with 3-second interval
- [ ] Settings save and restore after refresh
- [ ] Progress bar animations smooth
- [ ] Timer counts down accurately
- [ ] Difficulty ranges apply correctly
- [ ] All buttons disable during quiz
- [ ] Status panel updates correctly
- [ ] No console errors in browser
- [ ] Mobile responsive design intact
- [ ] Accessibility features functional

## 12. Automated Test Coverage

### Unit Tests (Vitest)
- Signal system: 100% coverage
- State computations: 95%+ coverage
- Utility functions: 100% coverage
- Debouncing logic verified
- localStorage mock testing

### E2E Tests (Playwright)
- Full user flows across browsers
- Settings persistence
- Theme switching
- Quiz lifecycle
- Manual mode operations
- Auto-update functionality

## Test Scenarios for QA

### Scenario 1: Complete Quiz Session
1. Set difficulty to Easy
2. Set question time to 3s, answer time to 2s
3. Start quiz
4. Observe 3 complete question-answer cycles
5. Stop quiz
6. Verify return to manual mode

### Scenario 2: Settings Persistence
1. Change all settings to non-default values
2. Enable auto-update
3. Switch to light theme
4. Refresh page
5. Verify all settings retained

### Scenario 3: Auto-Update Battery Saver
1. Enable auto-update in manual mode
2. Observe counter increment
3. Switch to different browser tab
4. Wait 10 seconds
5. Return to app tab
6. Verify counter only incremented while tab was active

### Scenario 4: Accessibility Navigation
1. Unplug mouse (desktop) or use keyboard only
2. Tab through entire interface
3. Adjust all sliders with arrow keys
4. Start and stop quiz with Enter/Space
5. Verify all functions accessible

## Bug Reporting Template

When reporting issues, include:
1. **Browser**: (e.g., Chrome 120, Safari 17)
2. **Device**: (Desktop/Mobile, OS)
3. **Steps to Reproduce**:
   - Exact sequence of actions
   - Settings values if relevant
4. **Expected Behavior**:
5. **Actual Behavior**:
6. **Screenshot/Video**: If applicable
7. **Console Errors**: Open DevTools (F12) and check Console tab