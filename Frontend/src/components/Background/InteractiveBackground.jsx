import React, { useEffect } from 'react';

const InteractiveBackground = () => {
  useEffect(() => {
    // Create the background container
    const backgroundDiv = document.createElement('div');
    backgroundDiv.className = 'background';
    document.body.appendChild(backgroundDiv);

    // Create the canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'effect-canvas';
    backgroundDiv.appendChild(canvas);

    // Add your original script
    const script = document.createElement('script');
    script.textContent = `
      const canvas = document.getElementById('effect-canvas');
      const ctx = canvas.getContext('2d');
      
      // Make canvas full screen and high resolution
      function resizeCanvas() {
          const dpr = window.devicePixelRatio || 1;
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          ctx.scale(dpr, dpr);
      }
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      
      // Track mouse position
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      
      window.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
      });
      
      // For touch devices
      window.addEventListener('touchmove', (e) => {
          if (e.touches[0]) {
              mouseX = e.touches[0].clientX;
              mouseY = e.touches[0].clientY;
          }
      });
      
      // Create tiles
      class Tile {
          constructor(x, y, width, height) {
              this.x = x;
              this.y = y;
              this.width = width;
              this.height = height;
              this.opacity = 0.1 + Math.random() * 0.15;
              this.originalOpacity = this.opacity;
              // Gradient from black to blue based on x position
              const position = this.x / window.innerWidth;
              this.color = {
                  r: Math.floor(15 + position * 30),
                  g: Math.floor(15 + position * 60),
                  b: Math.floor(40 + position * 215),
                  a: this.opacity
              };
              this.originalColor = {...this.color};
              this.activated = false;
          }
          
          update() {
              // Calculate distance from mouse
              const centerX = this.x + this.width / 2;
              const centerY = this.y + this.height / 2;
              const dx = mouseX - centerX;
              const dy = mouseY - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const interactDistance = 120;
              
              if (distance < interactDistance) {
                  // Intensity based on distance from cursor
                  const intensity = 1 - (distance / interactDistance);
                  
                  // Change color to bright blue where cursor is
                  this.color.r = Math.floor(this.originalColor.r + (40 - this.originalColor.r) * intensity);
                  this.color.g = Math.floor(this.originalColor.g + (100 - this.originalColor.g) * intensity);
                  this.color.b = Math.floor(this.originalColor.b + (255 - this.originalColor.b) * intensity);
                  
                  // Increase opacity near cursor
                  this.color.a = Math.min(0.8, this.originalOpacity + intensity * 0.5);
                  this.activated = true;
              } else if (this.activated) {
                  // Return to original color
                  this.color.r += (this.originalColor.r - this.color.r) * 0.05;
                  this.color.g += (this.originalColor.g - this.color.g) * 0.05;
                  this.color.b += (this.originalColor.b - this.color.b) * 0.05;
                  this.color.a += (this.originalOpacity - this.color.a) * 0.05;
                  
                  // Check if tile has returned to original state
                  if (Math.abs(this.color.a - this.originalOpacity) < 0.01) {
                      this.activated = false;
                  }
              }
          }
          
          draw() {
              ctx.fillStyle = \`rgba(\${this.color.r}, \${this.color.g}, \${this.color.b}, \${this.color.a})\`;
              ctx.fillRect(this.x, this.y, this.width, this.height);
          }
      }
      
      // Create tiles with smaller size
      const tiles = [];
      const tileWidth = 12;
      const tileHeight = 24;
      const tileGap = 1;
      
      // Create a grid of tiles with performance optimization
      function createTiles() {
          // Clear existing tiles
          tiles.length = 0;
          
          for (let x = 0; x < window.innerWidth; x += tileWidth + tileGap) {
              for (let y = 0; y < window.innerHeight; y += tileHeight + tileGap) {
                  tiles.push(new Tile(x, y, tileWidth, tileHeight));
              }
          }
      }
      
      // Initialize tiles
      createTiles();
      
      // Handle window resize
      window.addEventListener('resize', () => {
          resizeCanvas();
          createTiles();
      });
      
      // Animation loop
      function draw() {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Fill background
          ctx.fillStyle = '#0d0b1a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw tiles
          tiles.forEach(tile => {
              tile.update();
              tile.draw();
          });
          
          // Draw radial gradient under cursor
          const gradientRadius = 150;
          const grd = ctx.createRadialGradient(
              mouseX, mouseY, 0,
              mouseX, mouseY, gradientRadius
          );
          grd.addColorStop(0, 'rgba(46, 100, 254, 0.3)');
          grd.addColorStop(1, 'rgba(46, 100, 254, 0)');
          
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, gradientRadius, 0, Math.PI * 2);
          ctx.fill();
          
          requestAnimationFrame(draw);
      }
      
      // Start animation
      draw();
    `;
    document.body.appendChild(script);

    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
      .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
      }

      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      if (backgroundDiv.parentNode) {
        backgroundDiv.parentNode.removeChild(backgroundDiv);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Return an empty fragment since we're adding elements directly to the DOM
  return <></>;
};

export default InteractiveBackground;