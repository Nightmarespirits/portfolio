/**
 * Theme Management
 * Handles dark/light theme toggling and persistence
 */

// Theme class to manage theme switching and persistence
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = document.querySelector('.theme-icon');
    this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.currentTheme = this.getSavedTheme() || this.getSystemPreference();
    
    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add event listeners
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Watch for system theme changes
    this.prefersDarkScheme.addEventListener('change', (e) => {
      if (!this.getSavedTheme()) { // Only change if user hasn't set a preference
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
    
    // Dispatch custom event when theme changes
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: this.currentTheme }
    }));
  }

  /**
   * Get saved theme from localStorage
   * @returns {string|null} The saved theme or null if not set
   */
  getSavedTheme() {
    return localStorage.getItem('theme');
  }

  /**
   * Get system color scheme preference
   * @returns {string} 'dark' or 'light'
   */
  getSystemPreference() {
    return this.prefersDarkScheme.matches ? 'dark' : 'light';
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - Theme to save ('dark' or 'light')
   */
  saveTheme(theme) {
    if (theme === this.getSystemPreference()) {
      // If setting to system default, remove the preference
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
  }

  /**
   * Toggle between dark and light theme
   */
  toggleTheme() {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  /**
   * Set the theme
   * @param {string} theme - Theme to set ('dark' or 'light')
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the theme toggle icon
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
      this.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
    
    // Save the theme preference
    this.saveTheme(theme);
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme }
    }));
    
    // Add a class to the body to enable transitions after initial load
    document.body.classList.add('theme-transition');
  }
}

// Initialize theme manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.themeManager = new ThemeManager();
  }
});

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}