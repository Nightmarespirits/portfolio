const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Create the projects directory if it doesn't exist
const projectsDir = path.join(__dirname, 'img', 'projects');
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

// Project data with colors
const projects = [
  { id: 'portfolio-site', title: 'Personal Portfolio', tags: ['HTML5', 'CSS3', 'JavaScript'], color: '#3498db' },
  { id: 'ecommerce-dashboard', title: 'E-commerce Dashboard', tags: ['React', 'Node.js', 'MongoDB'], color: '#2ecc71' },
  { id: 'task-manager', title: 'Task Manager', tags: ['Vue.js', 'Firebase', 'PWA'], color: '#e74c3c' },
  { id: 'recipe-finder', title: 'Recipe Finder', tags: ['React', 'API', 'Redux'], color: '#9b59b6' },
  { id: 'weather-app', title: 'Weather App', tags: ['JavaScript', 'API', 'CSS'], color: '#f1c40f' },
  { id: 'fitness-tracker', title: 'Fitness Tracker', tags: ['React Native', 'Firebase'], color: '#1abc9c' },
  { id: 'blog-platform', title: 'Blog Platform', tags: ['Next.js', 'Node.js', 'MongoDB'], color: '#e67e22' },
  { id: 'ai-chatbot', title: 'AI Chatbot', tags: ['Python', 'TensorFlow', 'NLP'], color: '#e84393' },
  { id: 'expense-tracker', title: 'Expense Tracker', tags: ['Vue.js', 'Firebase'], color: '#00b894' },
  { id: 'restaurant-website', title: 'Restaurant Website', tags: ['WordPress', 'WooCommerce'], color: '#6c5ce7' },
  { id: 'social-media-dashboard', title: 'Social Dashboard', tags: ['React', 'Node.js', 'MongoDB'], color: '#fd79a8' },
  { id: 'job-board', title: 'Job Board', tags: ['Ruby on Rails', 'PostgreSQL'], color: '#00cec9' }
];

// Function to generate a single placeholder
function generatePlaceholder(project, width = 800, height = 450) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = project.color;
  ctx.fillRect(0, 0, width, height);
  
  // Set text styles
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw project title
  ctx.font = 'bold 48px Arial';
  wrapText(ctx, project.title, width / 2, height / 2 - 50, width - 100, 60);
  
  // Draw project tags
  ctx.font = '24px Arial';
  ctx.fillText(project.tags.join(' • '), width / 2, height / 2 + 30);
  
  // Add watermark
  ctx.globalAlpha = 0.1;
  ctx.font = 'bold 80px Arial';
  ctx.fillText('PREVIEW', width / 2, height / 2);
  ctx.globalAlpha = 1.0;
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(projectsDir, `${project.id}.jpg`);
  fs.writeFileSync(filePath, buffer);
  
  console.log(`Generated placeholder for ${project.title}`);
  return filePath;
}

// Helper function to wrap text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  const maxLines = 2;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if ((testWidth > maxWidth && n > 0) || lineCount >= maxLines) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      lineCount++;
      
      if (lineCount >= maxLines && n < words.length - 1) {
        context.fillText('...', x, y);
        return;
      }
    } else {
      line = testLine;
    }
  }
  
  context.fillText(line, x, y);
}

// Generate all placeholders
console.log('Generating project placeholders...');
projects.forEach(project => {
  generatePlaceholder(project);
});

console.log('\nAll placeholders have been generated!');
console.log(`Location: ${projectsDir}`);
