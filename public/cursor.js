// Cursor Glow Effect
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow animation
  function animateGlow() {
    const speed = 0.15;
    glowX += (mouseX - glowX) * speed;
    glowY += (mouseY - glowY) * speed;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateGlow);
  }
  
  animateGlow();

  // Show/hide on mouse enter/leave
  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initCursorGlow);
