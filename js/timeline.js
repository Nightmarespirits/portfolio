/**
 * Timeline Feature
 * Fetches timeline data, renders it to the DOM, and animates items on scroll.
 */

// 1. Function to create the HTML for a single timeline item
const createTimelineItemHTML = (item) => {
  return `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h3 class="timeline-year">${item.year}</h3>
        <p class="timeline-event">${item.event}</p>
      </div>
    </div>
  `;
};

// 2. Function to apply animations to the timeline items
const initTimelineAnimations = () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;

  const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% of the item is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // Stop observing the item once it has been animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    observer.observe(item);
  });
};

// 3. Main function to initialize the timeline
export async function initTimeline() {
  const timelineContainer = document.getElementById('timeline-container');
  if (!timelineContainer) {
    console.error('Timeline container not found!');
    return;
  }

  try {
    // Fetch data from the JSON file
    const response = await fetch('./data/timeline.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const timelineData = await response.json();

    // Generate and render the HTML
    timelineContainer.innerHTML = timelineData.map(createTimelineItemHTML).join('');

    // Once the HTML is in the DOM, initialize the animations
    initTimelineAnimations();

  } catch (error) {
    console.error('Error fetching or rendering timeline data:', error);
    timelineContainer.innerHTML = '<p class="error-message">No se pudo cargar la trayectoria.</p>';
  }
}
