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
import { initTimeline } from './timeline.js';
import './contact.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize timeline animations
  initTimeline();
  
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
  
  // --- Navigation and Scrolling Logic ---
  const header = document.querySelector('header');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const allSections = document.querySelectorAll('section[id]');

  // Use a small delay to ensure header.offsetHeight is calculated correctly after all styles are applied
  setTimeout(() => {
    const headerHeight = header ? header.offsetHeight : 0;

    // Smooth scrolling & active class on click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        // Immediately set active class on nav-links for better UX
        if (this.classList.contains('nav-link')) {
          allNavLinks.forEach(link => link.classList.remove('active'));
          this.classList.add('active');
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Active nav link on scroll using Intersection Observer
    if (allSections.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: `-${headerHeight + 10}px 0px 0px 0px`, // Offset for header + 10px buffer
        threshold: 0.2 // Lowered threshold to 20% for better reliability with shorter sections
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const navLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (navLink) {
              allNavLinks.forEach(link => link.classList.remove('active'));
              navLink.classList.add('active');
            }
          }
        });
      }, observerOptions);

      allSections.forEach(section => {
        sectionObserver.observe(section);
      });
    }
  }, 100); // 100ms delay for safety
});
