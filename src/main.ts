import './style.css';
import { initialize, toggleQuiz, increment, reset, toggleAutoUpdate, toggleTheme } from './app';

// Make functions globally available for onclick handlers
(window as any).toggleQuiz = toggleQuiz;
(window as any).increment = increment;
(window as any).reset = reset;
(window as any).toggleAutoUpdate = toggleAutoUpdate;
(window as any).toggleTheme = toggleTheme;

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);