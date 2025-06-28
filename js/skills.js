class SkillsSection {
  constructor() {
    this.skillsContainer = document.getElementById('skills-container');
    if (!this.skillsContainer) return;

    this.skillsData = [];
    this.init();
  }

  async init() {
    try {
      await this.loadSkillsData();
      this.renderAccordion();
      this.initAccordion();
    } catch (error) {
      console.error('Error initializing skills section:', error);
    }
  }

  async loadSkillsData() {
    try {
      const response = await fetch('./data/skills.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.skillsData = await response.json();
    } catch (error) {
      console.error('Error loading skills data:', error);
      this.skillsContainer.innerHTML = '<p class="error-message">No se pudieron cargar las habilidades.</p>';
    }
  }

  renderAccordion() {
    if (!this.skillsData.length) return;

    const accordionHTML = this.skillsData.map(category => `
      <div class="accordion-item">
        <button class="accordion-header" aria-expanded="false">
          <span class="accordion-title">${category.category}</span>
          <span class="accordion-icon"></span>
        </button>
        <div class="accordion-content">
          <div class="accordion-content-inner">
            <ul class="skills-list">
              ${category.skills.map(skill => `
                <li class="skill-item">
                  <i class="devicon-${skill.icon}-plain colored"></i>
                  <span class="skill-name">${skill.name}</span>
                  <div class="skill-bar">
                    <div class="skill-level" style="width: ${skill.level}%;"></div>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `).join('');

    this.skillsContainer.innerHTML = `<div class="accordion">${accordionHTML}</div>`;
  }

  initAccordion() {
    const accordionItems = this.skillsContainer.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');

      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        item.classList.toggle('active');
        header.setAttribute('aria-expanded', !isExpanded);

        if (!isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    });
  }
}

// Initialize the skills section when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window !== 'undefined') {
    new SkillsSection();
  }
});
