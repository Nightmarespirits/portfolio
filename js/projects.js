/**
 * Projects Section
 * Handles the projects/portfolio section with filtering and modal functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const projectsContainer = document.querySelector('.projects-grid');
  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'projects-loading';
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  // State
  let projects = [];
  let isModalOpen = false;
  let isExpanded = false;
  const PROJECTS_PER_ROW = 3; // Número de proyectos en la primera fila
  
  // Initialize the projects section
  async function initProjects() {
    try {
      // Show loading state
      showLoadingState();
      
      // Load projects data
      await loadProjects();

      
      // Render projects
      renderProjects();
      
      // Initialize modal event listeners
      initModal();
      
      // Initialize load more button
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', toggleProjectsVisibility);
      }
      
      // Initialize intersection observer for animations
      initIntersectionObserver();
      
    } catch (error) {
      console.error('Error initializing projects:', error);
      showErrorState();
    } finally {
      // Remove loading state
      loadingContainer.remove();
    }
  }
  
  // Show loading skeleton
  function showLoadingState() {
    loadingContainer.innerHTML = Array(6).fill(`
      <div class="project-card-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text" style="width: 90%;"></div>
          <div class="skeleton-text" style="width: 80%;"></div>
          <div class="skeleton-tags">
            <div class="skeleton-tag"></div>
            <div class="skeleton-tag"></div>
          </div>
          <div class="skeleton-links">
            <div class="skeleton-link"></div>
          </div>
        </div>
      </div>
    `).join('');
    
    projectsContainer.innerHTML = '';
    projectsContainer.appendChild(loadingContainer);
  }
  
  // Show error state
  function showErrorState() {
    projectsContainer.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Unable to load projects</h3>
        <p>Sorry, we couldn't load the projects at this time. Please try again later.</p>
        <button class="btn btn-primary" id="retry-btn">Try Again</button>
      </div>
    `;
    
    document.getElementById('retry-btn').addEventListener('click', initProjects);
  }
  
  // Load projects from JSON file
  async function loadProjects() {
    try {
      const response = await fetch('./data/projects.json');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      projects = await response.json();
      
      // If no projects found, use sample data
      if (!projects || projects.length === 0) {
        console.warn('No projects found, using sample data');
        projects = getSampleProjects();
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to sample data if fetch fails
      projects = getSampleProjects();
    }
  }
  
  // Initialize filter buttons
  function initFilters() {
    if (!filterContainer) return;
    
    // Get unique categories from projects
    const categories = ['all', ...new Set(projects.flatMap(project => project.categories))];
    
    // Clear existing filters
    filterContainer.innerHTML = '';
    
    // Create filter buttons
    categories.forEach(category => {
      const button = document.createElement('button');
      button.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
      button.textContent = formatCategory(category);
      button.dataset.filter = category;
      button.addEventListener('click', () => filterProjects(category));
      filterContainer.appendChild(button);
    });
    
    // Animate filter buttons
    setTimeout(() => {
      const buttons = filterContainer.querySelectorAll('.filter-btn');
      buttons.forEach((btn, index) => {
        setTimeout(() => {
          btn.style.opacity = '1';
          btn.style.transform = 'translateY(0)';
        }, 100 * index);
      });
    }, 100);
  }
  
  // Format category for display
  function formatCategory(category) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  
  // Render projects based on active filter
  function renderProjects() {
    // Filter projects
    if (projects.length === 0) {
      projectsContainer.innerHTML = `
        <div class="no-projects">
          <p>No hay proyectos disponibles.</p>
        </div>
      `;
      
      loadMoreBtn.style.display = 'none';
      return;
    }
    // Render each project
    projectsContainer.innerHTML = projects
      .map((project, index) => {
        const isVisible = index < PROJECTS_PER_ROW;
        return createProjectCard(project, isVisible);
      })
      .join('');
    
    // Agregar event listeners a las tarjetas de proyectos
    document.querySelectorAll('.project-card').forEach(card => {
      // Hacer la tarjeta completa clickeable
      card.addEventListener('click', (e) => {
        // Si el clic fue en un enlace o botón, no hacemos nada para permitir su comportamiento
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
            e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        
        const projectId = card.dataset.projectId;
        const project = projects.find(p => p.id === projectId);
        if (project) {
          openProjectModal(project);
        }
      });
      
      // Añadir interactividad con teclado para accesibilidad
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = card.dataset.projectId;
          const project = projects.find(p => p.id === projectId);
          if (project) {
            openProjectModal(project);
          }
        }
      });
    });
    
    // Agregar event listeners a los botones de detalles
    document.querySelectorAll('.project-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se propague al contenedor
        const projectId = btn.dataset.projectId;
        const project = projects.find(p => p.id === projectId);
        if (project) {
          openProjectModal(project);
        }
      });
    });
    
    // Show or hide the load more button based on number of projects
    if (projects.length <= PROJECTS_PER_ROW) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'flex';
    }
    
    // Reset expanded state when changing filters
    if (isExpanded) {
      toggleProjectsVisibility();
    }
  }
  
  // Create project card
  function createProjectCard(project, visible = true) {
    const { id, title, description, image, categories, tags } = project;
    
    return `
      <article class="project-card ${visible ? '' : 'hidden'}" data-project-id="${id}">
        <div class="project-image">
          <img src="${visible ? (image || './img/projects/placeholder.jpg') : ''}" 
               data-src="${image || './img/projects/placeholder.jpg'}" 
               alt="${title}" 
               loading="${visible ? 'eager' : 'lazy'}">
        </div>
        <div class="project-content">
          <span class="project-category">${formatCategory(categories?.[0] || 'project')}</span>
          <h3 class="project-title">${title}</h3>
          <p class="project-description">${description.length > 100 ? description.substring(0, 100) + '...' : description}</p>
          <div class="project-tags">
            ${tags?.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('') || ''}
            ${tags?.length > 3 ? `<span class="project-tag">+${tags.length - 3}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }
  
  // Toggle projects visibility
  function toggleProjectsVisibility() {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      // Expandir la vista
      projectsContainer.classList.remove('collapsed');
      loadMoreBtn.classList.add('expanded');
      loadMoreBtn.innerHTML = 'Ver Menos <span class="icon">▲</span>';
      
      // Animar las tarjetas ocultas con un ligero retraso entre cada una
      const hiddenCards = document.querySelectorAll('.project-card.hidden');
      hiddenCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.remove('hidden');
          card.classList.add('reveal');
        }, index * 100); // 100ms de retraso entre cada card
      });
    } else {
      // Colapsar la vista
      projectsContainer.classList.add('collapsed');
      loadMoreBtn.classList.remove('expanded');
      loadMoreBtn.innerHTML = 'Ver Más Proyectos <span class="icon">▼</span>';
      
      // Scroll hacia el inicio de la sección si es necesario
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const sectionTop = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    }
  }
  
  // Initialize modal
  function initModal() {
    // Modal container will be created dynamically when needed
    // Add global event listener for closing modal on outside click
    document.addEventListener('click', (e) => {
      const modal = document.querySelector('.project-modal');
      if (modal && e.target.classList.contains('project-modal')) {
        closeModal(modal);
      }
    });
    
    // Add event listener for escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.project-modal');
        if (modal) {
          closeModal(modal);
        }
      }
    });
  }
  
  // Open project modal
  function openProjectModal(project) {
    if (isModalOpen) return;
    
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    const { id, title, description, image, categories, tags, links, features } = project;
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', `modal-title-${id}`);
    modal.setAttribute('aria-describedby', `modal-description-${id}`);
    
    // Format features list
    const featuresList = features ? `
      <div class="modal-features">
        <h4>Características Principales</h4>
        <ul>
          ${features.map(feature => `
            <li>
              <span class="icon">✓</span>
              <span>${feature}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';
    
    // Format tags
    const tagElements = tags ? `
      <div class="modal-tags">
        ${tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
      </div>
    ` : '';
    
    // Format links
    const linkElements = links ? Object.entries(links).map(([type, url]) => {
      const isExternal = !url.startsWith('#');
      const icon = type === 'demo' ? '→' : type === 'code' ? '↗' : '🔍';
      const text = type === 'demo' ? 'Ver Demo' : type === 'code' ? 'Ver Código' : 'Detalles';
      const className = type === 'demo' ? 'primary' : 'secondary';
      
      return `
        <a href="${url}" 
           class="btn btn-${className}" 
           target="${isExternal ? '_blank' : ''}" 
           rel="${isExternal ? 'noopener noreferrer' : ''}">
          ${text} <span class="icon">${icon}</span>
        </a>
      `;
    }).join('') : '';
    
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Cerrar modal">
          <span class="icon">×</span>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <img src="${image || './img/projects/placeholder.jpg'}" alt="${title}">
          </div>
          <div class="modal-details">
            <span class="modal-category">${formatCategory(categories?.[0] || 'project')}</span>
            <h2 id="modal-title-${id}" class="modal-title">${title}</h2>
            <p id="modal-description-${id}" class="modal-description">${description}</p>
            ${featuresList}
            ${tagElements}
            <div class="modal-links">
              ${linkElements}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Force reflow to enable transition
    modal.offsetHeight;
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('active');
      
      // Add event listener to close button
      const closeButton = modal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          closeModal(modal);
        });
      }
      
      // Focus trap for accessibility
      const focusableElements = modal.querySelectorAll('a[href], button, [tabindex]');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      // Focus first element
      if (firstFocusable) firstFocusable.focus();
      
      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
      
      // Handle keyboard navigation
      modal.addEventListener('keydown', (e) => {
        // Trap focus inside modal
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
    }, 10);
  }
  
  // Close modal
  function closeModal(modal) {
    if (!isModalOpen) return;
    
    modal.classList.remove('active');
    
    // Wait for animation to complete
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
      isModalOpen = false;
      
      // Return focus to the project card that was clicked
      const activeElement = document.activeElement;
      if (activeElement && activeElement.classList.contains('project-card')) {
        activeElement.focus();
      }
    }, 300);
  }
  
  // Sample projects data (fallback)
  function getSampleProjects() {
    return [
      {
        id: 'sample-1',
        title: 'Sample Project 1',
        description: 'This is a sample project description. It shows when the projects.json file cannot be loaded.',
        categories: ['web', 'frontend'],
        tags: ['HTML', 'CSS', 'JavaScript'],
        image: '/img/projects/placeholder.jpg',
        featured: true,
        links: {
          demo: '#',
          code: '#',
          details: '#'
        },
        features: [
          'Responsive design',
          'Modern UI/UX',
          'Cross-browser compatibility',
          'Performance optimized'
        ]
      },
      {
        id: 'sample-2',
        title: 'Sample Project 2',
        description: 'Another sample project to demonstrate the portfolio layout and functionality.',
        categories: ['mobile', 'backend'],
        tags: ['React Native', 'Node.js', 'MongoDB'],
        image: '/img/projects/placeholder.jpg',
        featured: false,
        links: {
          demo: '#',
          code: '#'
        },
        features: [
          'Mobile-first approach',
          'RESTful API',
          'User authentication',
          'Real-time updates'
        ]
      }
    ];
  }
  
  // Initialize Intersection Observer for animations
  function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(card => {
      observer.observe(card);
    });
  }
  
  // Initialize the projects section
  initProjects();
});
