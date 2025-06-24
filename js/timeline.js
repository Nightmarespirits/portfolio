document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  // Fetch timeline data
  fetch('/data/timeline.json')
    .then(resp => resp.json())
    .then(renderTimeline)
    .catch(err => {
      console.error('Error loading timeline:', err);
    });

  function renderTimeline(items) {
    if (!Array.isArray(items)) return;
    container.innerHTML = '';

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    items.forEach((item, index) => {
      const entry = document.createElement('div');
      entry.className = 'timeline-item';
      entry.style.animationDelay = `${index * 0.1}s`;

      entry.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <span class="timeline-year">${item.year}</span>
          <p class="timeline-event">${item.event}</p>
        </div>`;

      container.appendChild(entry);
      observer.observe(entry);
    });
  }
});
