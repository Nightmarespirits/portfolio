/**
 * Skills Section
 * Handles the rendering and animations for the skills section
 */

class SkillsSection {
  constructor() {
    this.skillsContainer = document.getElementById('skills-container');
    
    if (!this.skillsContainer) return;
    
    this.skillsData = [];
    this.observer = null;
    
    this.init();
  }
  
  /**
   * Initialize the skills section
   */
  async init() {
    try {
      // Load skills data
      await this.loadSkillsData();
      
      // Render skills
      this.renderSkills();
      
      // Initialize intersection observer for animations
      this.initIntersectionObserver();
      
      // Listen for theme changes to update skill icons if needed
      document.addEventListener('themeChanged', this.handleThemeChange.bind(this));
    } catch (error) {
      console.error('Error initializing skills section:', error);
    }
  }
  
  /**
   * Load skills data from JSON file
   */
  async loadSkillsData() {
    try {
      const response = await fetch('/data/skills.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.skillsData = await response.json();
    } catch (error) {
      console.error('Error loading skills data:', error);
      // Fallback to sample data if the request fails
      this.skillsData = this.getSampleSkillsData();
    }
  }
  
  /**
   * Get sample skills data (fallback)
   */
  getSampleSkillsData() {
    return [
      {
        category: 'Frontend',
        icon: '💻',
        skills: [
          { name: 'HTML5', level: 95, icon: 'html5' },
          { name: 'CSS3', level: 90, icon: 'css3' },
          { name: 'JavaScript', level: 85, icon: 'javascript' },
          { name: 'Vue.js', level: 80, icon: 'vue' },
          { name: 'React', level: 75, icon: 'react' }
        ]
      },
      {
        category: 'Backend',
        icon: '⚙️',
        skills: [
          { name: 'Java', level: 90, icon: 'java' },
          { name: 'Spring Boot', level: 85, icon: 'spring' },
          { name: 'Node.js', level: 80, icon: 'nodejs' },
          { name: 'Python', level: 70, icon: 'python' },
          { name: 'SQL', level: 85, icon: 'database' }
        ]
      },
      {
        category: 'Tools & More',
        icon: '🛠️',
        skills: [
          { name: 'Git', level: 90, icon: 'git' },
          { name: 'Docker', level: 80, icon: 'docker' },
          { name: 'AWS', level: 70, icon: 'aws' },
          { name: 'CI/CD', level: 75, icon: 'cicd' },
          { name: 'Agile/Scrum', level: 85, icon: 'agile' }
        ]
      }
    ];
  }
  
  /**
   * Render skills categories and items
   */
  renderSkills() {
    if (!this.skillsContainer) return;
    
    const skillsGrid = document.createElement('div');
    skillsGrid.className = 'skills-grid';
    
    this.skillsData.forEach((category, index) => {
      const categoryEl = this.createCategoryElement(category, index);
      skillsGrid.appendChild(categoryEl);
    });
    
    // Clear existing content and append the grid
    this.skillsContainer.innerHTML = '';
    this.skillsContainer.appendChild(skillsGrid);
    
    // Animate categories with a staggered delay
    this.animateCategories();
  }
  
  /**
   * Create a category element
   */
  createCategoryElement(category, index) {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'skill-category';
    categoryEl.style.animationDelay = `${index * 0.1}s`;
    
    // Add data attribute for animation
    categoryEl.dataset.category = category.category.toLowerCase().replace(/\s+/g, '-');
    
    // Create category header
    const headerEl = document.createElement('div');
    headerEl.className = 'category-header';
    
    const iconEl = document.createElement('span');
    iconEl.className = 'icon';
    iconEl.textContent = category.icon;
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = category.category;
    titleEl.prepend(iconEl);
    
    headerEl.appendChild(titleEl);
    
    // Create skills list
    const skillsListEl = document.createElement('div');
    skillsListEl.className = 'skills-list';
    
    category.skills.forEach((skill, skillIndex) => {
      const skillItemEl = this.createSkillItemElement(skill, skillIndex);
      skillsListEl.appendChild(skillItemEl);
    });
    
    // Assemble the category element
    categoryEl.appendChild(headerEl);
    categoryEl.appendChild(skillsListEl);
    
    return categoryEl;
  }
  
  /**
   * Create a skill item element
   */
  createSkillItemElement(skill, index) {
    const skillItemEl = document.createElement('div');
    skillItemEl.className = 'skill-item';
    skillItemEl.style.animationDelay = `${index * 0.05}s`;
    
    // Create icon element
    const iconEl = document.createElement('div');
    iconEl.className = 'skill-icon';
    
    // You can replace this with actual icons or use a library like Font Awesome
    const icon = this.getSkillIcon(skill.icon || skill.name.toLowerCase());
    iconEl.innerHTML = icon;
    
    // Create skill info container
    const infoEl = document.createElement('div');
    infoEl.className = 'skill-info';
    
    // Skill name
    const nameEl = document.createElement('div');
    nameEl.className = 'skill-name';
    nameEl.textContent = skill.name;
    
    // Skill level bar
    const levelContainer = document.createElement('div');
    levelContainer.className = 'skill-level';
    
    const levelBar = document.createElement('div');
    levelBar.className = 'skill-level-bar';
    levelBar.style.setProperty('--skill-level', `${skill.level}%`);
    
    levelContainer.appendChild(levelBar);
    
    // Assemble the skill item
    infoEl.appendChild(nameEl);
    infoEl.appendChild(levelContainer);
    
    skillItemEl.appendChild(iconEl);
    skillItemEl.appendChild(infoEl);
    
    return skillItemEl;
  }
  
  /**
   * Get icon for a skill
   */
  getSkillIcon(skillName) {
    // This is a simple implementation. In a real app, you might want to use an icon library
    // or SVG icons for better quality and theming support.
    const iconMap = {
      'html5': '🌐',
      'css3': '🎨',
      'javascript': '📜',
      'vue': '🟢',
      'react': '⚛️',
      'java': '☕',
      'spring': '🌱',
      'nodejs': '🟢',
      'python': '🐍',
      'sql': '💾',
      'git': '🔀',
      'docker': '🐳',
      'aws': '☁️',
      'cicd': '🔄',
      'agile': '🏃',
      'database': '💾'
    };
    
    return iconMap[skillName] || '✨';
  }
  
  /**
   * Initialize intersection observer for scroll animations
   */
  initIntersectionObserver() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    skillItems.forEach(item => {
      this.observer.observe(item);
    });
  }
  
  /**
   * Animate categories with a staggered delay
   */
  animateCategories() {
    const categories = document.querySelectorAll('.skill-category');
    
    categories.forEach((category, index) => {
      setTimeout(() => {
        category.classList.add('animate');
      }, index * 100);
    });
  }
  
  /**
   * Handle theme change
   */
  handleThemeChange() {
    // If you're using theme-specific icons, you can update them here
  }
}

// Initialize the skills section when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.skillsSection = new SkillsSection();
  }
});

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillsSection;
}