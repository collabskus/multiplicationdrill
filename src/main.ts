import './style.css';
import { initialize, toggleQuiz, increment, reset, toggleAutoUpdate, toggleTheme } from './app';

// Make functions globally available for onclick handlers
declare global {
  interface Window {
    toggleQuiz: typeof toggleQuiz;
    increment: typeof increment;
    reset: typeof reset;
    toggleAutoUpdate: typeof toggleAutoUpdate;
    toggleTheme: typeof toggleTheme;
  }
}

window.toggleQuiz = toggleQuiz;
window.increment = increment;
window.reset = reset;
window.toggleAutoUpdate = toggleAutoUpdate;
window.toggleTheme = toggleTheme;

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);