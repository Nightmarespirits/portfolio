/**
 * Hero Section Animations and Interactions
 * Handles animations, typewriter effect, and interactive elements for the hero section
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;
  
  // Elements to animate
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroDescription = document.querySelector('.hero-description');
  const heroCta = document.querySelector('.hero-cta');
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Intersection Observer for hero section
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate elements when hero section is in view
        animateHeroElements();
        // Start typewriter effect
        initTypewriter();
        // Unobserve after animation to prevent re-triggering
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Start observing hero section
  heroObserver.observe(heroSection);
  
  /**
   * Animate hero elements with staggered delays
   */
  function animateHeroElements() {
    if (prefersReducedMotion) {
      // Skip animations if user prefers reduced motion
      [heroTitle, heroSubtitle, heroDescription, heroCta].forEach(el => {
        if (el) el.style.opacity = '1';
      });
      return;
    }
    
    // Animate title
    if (heroTitle) {
      heroTitle.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
    
    // Animate subtitle with delay
    if (heroSubtitle) {
      setTimeout(() => {
        heroSubtitle.style.animation = 'fadeInUp 0.8s ease-out 0.2s forwards';
      }, 200);
    }
    
    // Animate description with delay
    if (heroDescription) {
      setTimeout(() => {
        heroDescription.style.animation = 'fadeInUp 0.8s ease-out 0.4s forwards';
      }, 400);
    }
    
    // Animate CTA with delay
    if (heroCta) {
      setTimeout(() => {
        heroCta.style.opacity = '1';
        heroCta.style.transform = 'translateY(0)';
        heroCta.style.animation = 'bounce 2s infinite';
      }, 600);
    }
  }
  
  /**
   * Initialize typewriter effect for the hero title
   */
  function initTypewriter() {
    const titleElement = document.querySelector('.hero-title .highlight');
    if (!titleElement || prefersReducedMotion) return;
    
    const text = titleElement.textContent;
    const words = text.split(' ');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;
    
    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        // Delete characters
        charIndex--;
        titleElement.textContent = currentWord.substring(0, charIndex);
        
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      } else {
        // Type characters
        charIndex++;
        titleElement.textContent = currentWord.substring(0, charIndex);
        
        if (charIndex === currentWord.length) {
          isDeleting = true;
          // Pause at the end of the word
          clearTimeout(typeTimeout);
          typeTimeout = setTimeout(type, 1500);
          return;
        }
      }
      
      // Set typing speed
      const typeSpeed = isDeleting ? 100 : 150;
      clearTimeout(typeTimeout);
      typeTimeout = setTimeout(type, typeSpeed);
    }
    
    // Start the typewriter effect
    type();
  }
  
  // Add scroll indicator animation
  function initScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = `
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrows">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    heroSection.appendChild(scrollIndicator);
    
    // Add click handler for smooth scrolling
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('#habilidades');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Initialize scroll indicator
  initScrollIndicator();
  
  // Add parallax effect to hero background
  function initParallax() {
    if (prefersReducedMotion) return;
    
    window.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 0.5) / 100;
      const y = (window.innerHeight - e.pageY * 0.5) / 100;
      heroSection.style.setProperty('--parallax-x', `${x}px`);
      heroSection.style.setProperty('--parallax-y', `${y}px`);
    });
  }
  
  // Initialize parallax effect
  initParallax();
  
  // Add scroll-triggered animations
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.hero-section [data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animate;
          entry.target.style.animation = `${animation} 1s ease-out forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
  }
  
  // Initialize scroll animations
  initScrollAnimations();
});

// Add CSS for animations if not already in the stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    z-index: 10;
    opacity: 0;
    animation: fadeInUp 0.8s ease-out 1s forwards;
  }
  
  .mouse {
    width: 30px;
    height: 50px;
    border: 2px solid var(--color-primary);
    border-radius: 15px;
    position: relative;
    margin: 0 auto 8px;
  }
  
  .wheel {
    width: 4px;
    height: 8px;
    background-color: var(--color-primary);
    border-radius: 2px;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    animation: scroll 2s infinite;
  }
  
  .arrows {
    display: flex;
    justify-content: center;
    gap: 4px;
  }
  
  .arrows span {
    display: block;
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
    transform: rotate(45deg);
    animation: arrow-wave 1.5s infinite;
    opacity: 0;
  }
  
  .arrows span:nth-child(1) { animation-delay: 0.1s; }
  .arrows span:nth-child(2) { animation-delay: 0.2s; }
  .arrows span:nth-child(3) { animation-delay: 0.3s; }
  
  @keyframes scroll {
    0% { transform: translate(-50%, 0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translate(-50%, 15px); opacity: 0; }
  }
  
  @keyframes arrow-wave {
    0% { opacity: 0; transform: rotate(45deg) translate(-5px, -5px); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: rotate(45deg) translate(5px, 5px); }
  }
  
  /* Reduced motion styles */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    .scroll-indicator,
    .mouse,
    .wheel,
    .arrows span {
      display: none;
    }
  }
`;

document.head.appendChild(style);