const fs = require('fs');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
const dir = './src/assets/images/bulbs';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Colors
const colors = {
    red: '#ff0000',
    yellow: '#ffcc00',
    blue: '#0099ff',
    green: '#00cc00'
};

// Image types to create
const imageTypes = [
    { name: '', draw: drawRegularBulb },
    { name: '_selected', draw: drawSelectedBulb },
    { name: '_line', draw: drawLineBulb },
    { name: '_bomb', draw: drawBombBulb }
];

// Create images
for (const color in colors) {
    for (const type of imageTypes) {
        createImage(color, type.name, type.draw, colors[color]);
    }
}

// Create rainbow bulb
createSpecialImage('bulb_rainbow', drawRainbowBulb);

function createImage(color, type, drawFunction, colorValue) {
    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    
    drawFunction(ctx, colorValue);
    
    const name = type === '' ? `bulb_${color}` : `bulb_${color}${type}`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`${dir}/${name}.png`, buffer);
    
    console.log(`Created ${name}.png`);
}

function createSpecialImage(name, drawFunction) {
    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    
    drawFunction(ctx);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`${dir}/${name}.png`, buffer);
    
    console.log(`Created ${name}.png`);
}

function drawRegularBulb(ctx, color) {
    // Clear canvas
    ctx.clearRect(0, 0, 128, 128);
    
    // Draw bulb
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(64, 64, 48, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(48, 48, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw glow
    const gradient = ctx.createRadialGradient(64, 64, 48, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();
}

function drawSelectedBulb(ctx, color) {
    // Draw regular bulb
    drawRegularBulb(ctx, color);
    
    // Add selection glow
    const gradient = ctx.createRadialGradient(64, 64, 48, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw selection ring
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.stroke();
}

function drawLineBulb(ctx, color) {
    // Draw regular bulb
    drawRegularBulb(ctx, color);
    
    // Draw line symbol
    ctx.fillStyle = 'white';
    ctx.fillRect(32, 60, 64, 8);
    
    // Draw perpendicular line
    ctx.fillRect(60, 32, 8, 64);
}

function drawBombBulb(ctx, color) {
    // Draw regular bulb
    drawRegularBulb(ctx, color);
    
    // Draw bomb symbol
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(64, 64, 24, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fuse
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(64, 40);
    ctx.quadraticCurveTo(80, 30, 90, 40);
    ctx.stroke();
    
    // Draw spark
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(90, 40, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawRainbowBulb(ctx) {
    // Clear canvas
    ctx.clearRect(0, 0, 128, 128);
    
    // Create rainbow gradient
    const gradient = ctx.createLinearGradient(16, 16, 112, 112);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.2, 'orange');
    gradient.addColorStop(0.4, 'yellow');
    gradient.addColorStop(0.6, 'green');
    gradient.addColorStop(0.8, 'blue');
    gradient.addColorStop(1, 'purple');
    
    // Draw bulb
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(64, 64, 48, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(48, 48, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw glow
    const glowGradient = ctx.createRadialGradient(64, 64, 48, 64, 64, 64);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw star symbol
    ctx.fillStyle = 'white';
    ctx.beginPath();
    drawStar(ctx, 64, 64, 5, 24, 12);
    ctx.fill();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}
