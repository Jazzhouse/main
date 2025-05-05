const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shapes = [];
let lineCount = 100; // Default number of objects
let shapeSize = 25;  // Default shape size
const maxDistance = 150;
let isMouseOnCanvas = false;
let currentShape = 'line'; // Default shape is 'line'
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

const safeArea = {
  x: canvas.width / 2 - 160,
  y: canvas.height / 2 - 66, 
  width: 320,
  height: 132,
};

let hue = Math.random() * 360;
const hueSpeed = 0.1;

class Shape {
  constructor(x, y, size, angle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = angle;
    this.defaultSpeed = 0.01;
    this.targetSpeed = this.defaultSpeed;
    this.currentSpeed = this.defaultSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const color = `hsl(${(hue + 180) % 360}, 100%, 75%)`;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (currentShape === 'line') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.size, 0);
      ctx.stroke();
    } else if (currentShape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size, this.size);
      ctx.lineTo(-this.size, this.size);
      ctx.closePath();
      ctx.fill();
    } else if (currentShape === 'square') {
      ctx.beginPath();
      ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.fill();
    }

    ctx.restore();
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (isMouseOnCanvas) {
      this.targetSpeed = distance < maxDistance ? 0.1 : this.defaultSpeed;
    } else {
      this.targetSpeed = this.defaultSpeed;
    }

    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.05;
    this.angle += this.currentSpeed;
    this.draw();
  }
}

function init() {
  shapes = [];
  for (let i = 0; i < lineCount; i++) {
    let x, y;
    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (
      x > safeArea.x && x < safeArea.x + safeArea.width &&
      y > safeArea.y && y < safeArea.y + safeArea.height
    );
    const angle = Math.random() * Math.PI * 2;
    shapes.push(new Shape(x, y, shapeSize, angle));
  }
}

function animate() {
  hue += hueSpeed;
  if (hue >= 360) hue = 0;

  const backgroundColor = `hsl(${hue}, 100%, 20%)`;
  document.body.style.backgroundColor = backgroundColor;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => shape.update(mouseX, mouseY));

  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  isMouseOnCanvas = true;
});

canvas.addEventListener('mouseleave', () => {
  isMouseOnCanvas = false;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Shape switch
function setShape(shape) {
  currentShape = shape;
  init();
}

// Object count slider
document.getElementById('lineCountSlider').addEventListener('input', (e) => {
  lineCount = e.target.value;
  document.getElementById('lineCountValue').textContent = lineCount;
  adjustObjects();
});

// Object size slider
document.getElementById('sizeSlider').addEventListener('input', (e) => {
  shapeSize = e.target.value;
  document.getElementById('sizeValue').textContent = shapeSize;
  shapes.forEach(shape => shape.size = shapeSize);
});

function adjustObjects() {
  if (lineCount > shapes.length) {
    const newShapes = lineCount - shapes.length;
    for (let i = 0; i < newShapes; i++) {
      let x, y;
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      } while (
        x > safeArea.x && x < safeArea.x + safeArea.width &&
        y > safeArea.y && y < safeArea.y + safeArea.height
      );
      const angle = Math.random() * Math.PI * 2;
      shapes.push(new Shape(x, y, shapeSize, angle));
    }
  } else {
    shapes = shapes.slice(0, lineCount);
  }
}
// Toggle menu visibility
const menuToggle = document.querySelector('.menu-toggle');
const menuContent = document.querySelector('.menu-content');

menuToggle.addEventListener('click', () => {
  menuContent.classList.toggle('show');
});
// Initialize and animate
init();
animate();