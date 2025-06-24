/**
 * Main JavaScript File
 * Initializes the application and manages theme
 */

// Import theme manager
import './themes.js';

// Import section modules
import './intro.js';
import './skills.js';
import './projects.js';
import './timeline.js';
import './contact.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Initialize mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      // Toggle hamburger animation
      navToggle.classList.toggle('is-active');
    });
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navToggle.classList.remove('is-active');
      });
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate the header height for offset
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offset = 20; // Additional offset
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add scroll event for header shadow
  const header = document.querySelector('header');
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add/remove shadow based on scroll position
      if (currentScroll > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll direction
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.classList.add('header-hide');
      } else {
        // Scrolling up
        header.classList.remove('header-hide');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // Initialize Intersection Observer for scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  };
  
  // Run once on load
  animateOnScroll();
  
  // Re-run when theme changes in case of dynamic content
  document.addEventListener('themeChanged', animateOnScroll);
});

// Handle form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      
      // Here you would typically send the form data to a server
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.');
      contactForm.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      // Re-enable button and restore original text
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}