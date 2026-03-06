/**
 * Z-SURVIVAL - Game Logic
 * Zombie Survival Game
 */

// ========================================
// GAME VARIABLES
// ========================================
let canvas, ctx;
let gameRunning = false;
let animationId;

// Player
const player = {
    x: 0,
    y: 0,
    size: 30,
    speed: 5,
    health: 100,
    maxHealth: 100,
    score: 0,
    kills: 0,
    level: 1,
    wave: 1,
    weapon: 'pistol'
};

// Game objects
let zombies = [];
let bullets = [];
let particles = [];

// Game settings
const keys = {};
let mouseX = 0;
let mouseY = 0;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

function initGame() {
    // Get canvas
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize player position
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    
    // Event listeners
    setupEventListeners();
    
    // Load leaderboard
    loadLeaderboard();
    
    // Run preloader
    runPreloader();
}

function resizeCanvas() {
    if (!canvas) return;
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function setupEventListeners() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('click', (e) => {
        if (gameRunning) {
            shoot();
        }
    });
    
    // Start button
    const startBtn = document.getElementById('btnStart');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    // Weapon buttons
    document.querySelectorAll('.weapon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.weapon-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            player.weapon = btn.dataset.weapon;
        });
    });
}

// ========================================
// GAME LOOP
// ========================================
function startGame() {
    // Reset player
    player.health = 100;
    player.score = 0;
    player.kills = 0;
    player.level = 1;
    player.wave = 1;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    
    // Reset arrays
    zombies = [];
    bullets = [];
    particles = [];
    
    // Hide overlay
    document.getElementById('gameOverlay').classList.add('hidden');
    
    // Start game
    gameRunning = true;
    updateUI();
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update game objects
    updatePlayer();
    updateZombies();
    updateBullets();
    updateParticles();
    
    // Draw game objects
    drawPlayer();
    drawZombies();
    drawBullets();
    drawParticles();
    
    // Spawn zombies
    spawnZombies();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    updateUI();
    
    // Continue loop
    animationId = requestAnimationFrame(gameLoop);
}

function drawBackground() {
    // Dark gradient background
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
    );
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(230, 57, 70, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// ========================================
// PLAYER
// ========================================
function updatePlayer() {
    // Movement
    if (keys['w'] || keys['arrowup']) player.y -= player.speed;
    if (keys['s'] || keys['arrowdown']) player.y += player.speed;
    if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
    if (keys['d'] || keys['arrowright']) player.x += player.speed;
    
    // Boundaries
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    
    // Rotate towards mouse
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    ctx.rotate(angle);
    
    // Player body
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(0, 0, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Player outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Weapon
    ctx.fillStyle = '#444444';
    ctx.fillRect(10, -5, 25, 10);
    
    ctx.restore();
}

function shoot() {
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    
    let speed = 15;
    let damage = 10;
    let size = 5;
    
    switch (player.weapon) {
        case 'rifle':
            speed = 20;
            damage = 15;
            size = 4;
            break;
        case 'shotgun':
            for (let i = -2; i <= 2; i++) {
                bullets.push({
                    x: player.x,
                    y: player.y,
                    vx: Math.cos(angle + i * 0.1) * speed,
                    vy: Math.sin(angle + i * 0.1) * speed,
                    size: size,
                    damage: damage
                });
            }
            return;
    }
    
    bullets.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        damage: damage
    });
}

// ========================================
// ZOMBIES
// ========================================
function spawnZombies() {
    if (zombies.length < player.wave * 5) {
        if (Math.random() < 0.05) {
            const side = Math.floor(Math.random() * 4);
            let x, y;
            
            switch (side) {
                case 0: // Top
                    x = Math.random() * canvas.width;
                    y = -30;
                    break;
                case 1: // Right
                    x = canvas.width + 30;
                    y = Math.random() * canvas.height;
                    break;
                case 2: // Bottom
                    x = Math.random() * canvas.width;
                    y = canvas.height + 30;
                    break;
                case 3: // Left
                    x = -30;
                    y = Math.random() * canvas.height;
                    break;
            }
            
            zombies.push({
                x: x,
                y: y,
                size: 25 + Math.random() * 10,
                speed: 1 + Math.random() * 1.5,
                health: 30 + player.wave * 10,
                maxHealth: 30 + player.wave * 10
            });
        }
    }
}

function updateZombies() {
    zombies.forEach(zombie => {
        // Move towards player
        const angle = Math.atan2(player.y - zombie.y, player.x - zombie.x);
        zombie.x += Math.cos(angle) * zombie.speed;
        zombie.y += Math.sin(angle) * zombie.speed;
    });
}

function drawZombies() {
    zombies.forEach(zombie => {
        ctx.save();
        ctx.translate(zombie.x, zombie.y);
        
        // Zombie body
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath();
        ctx.arc(0, 0, zombie.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Outline
        ctx.strokeStyle = '#1a3d15';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(-5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Health bar
        const healthPercent = zombie.health / zombie.maxHealth;
        ctx.fillStyle = '#333333';
        ctx.fillRect(-15, -zombie.size / 2 - 10, 30, 5);
        ctx.fillStyle = healthPercent > 0.5 ? '#39ff14' : '#e63946';
        ctx.fillRect(-15, -zombie.size / 2 - 10, 30 * healthPercent, 5);
        
        ctx.restore();
    });
}

// ========================================
// BULLETS
// ========================================
function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        
        // Remove if off screen
        if (bullet.x < 0 || bullet.x > canvas.width ||
            bullet.y < 0 || bullet.y > canvas.height) {
            return false;
        }
        return true;
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ========================================
// PARTICLES
// ========================================
function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0;
    });
}

function drawParticles() {
    particles.forEach(p => {
        ctx.fillStyle = `rgba(230, 57, 70, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
    });
}

function createBloodParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: 3 + Math.random() * 3,
            life: 1
        });
    }
}

// ========================================
// COLLISIONS
// ========================================
function checkCollisions() {
    // Bullet vs Zombie
    bullets.forEach((bullet, bi) => {
        zombies.forEach((zombie, zi) => {
            const dist = Math.hypot(bullet.x - zombie.x, bullet.y - zombie.y);
            
            if (dist < zombie.size / 2 + bullet.size) {
                // Hit zombie
                zombie.health -= bullet.damage;
                
                // Remove bullet
                bullets.splice(bi, 1);
                
                // Create particles
                createBloodParticles(zombie.x, zombie.y);
                
                // Check if zombie died
                if (zombie.health <= 0) {
                    zombies.splice(zi, 1);
                    player.score += 100;
                    player.kills++;
                    
                    // Level up
                    if (player.kills % 10 === 0) {
                        player.level++;
                        player.wave = Math.floor(player.kills / 20) + 1;
                        showToast(`Wave ${player.wave} started!`, 'info');
                    }
                }
            }
        });
    });
    
    // Zombie vs Player
    zombies.forEach((zombie, zi) => {
        const dist = Math.hypot(player.x - zombie.x, player.y - zombie.y);
        
        if (dist < player.size / 2 + zombie.size / 2) {
            // Damage player
            player.health -= 1;
            
            // Check game over
            if (player.health <= 0) {
                gameOver();
            }
        }
    });
}

// ========================================
// GAME OVER
// ========================================
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    // Create game over overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';
    overlay.innerHTML = `
        <div class="game-over-content">
            <h1>GAME OVER</h1>
            <div class="game-over-stats">
                <div class="game-over-stat">
                    <span class="stat-label">Final Score</span>
                    <span class="stat-value">${player.score}</span>
                </div>
                <div class="game-over-stat">
                    <span class="stat-label">Zombies Killed</span>
                    <span class="stat-value">${player.kills}</span>
                </div>
                <div class="game-over-stat">
                    <span class="stat-label">Level Reached</span>
                    <span class="stat-value">${player.level}</span>
                </div>
                <div class="game-over-stat">
                    <span class="stat-label">Wave Survived</span>
                    <span class="stat-value">${player.wave}</span>
                </div>
            </div>
            <div class="game-over-buttons">
                <button class="btn-retry" onclick="restartGame()">
                    <i class="fas fa-redo"></i> Play Again
                </button>
                <button class="btn-quit" onclick="quitGame()">
                    <i class="fas fa-home"></i> Quit
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function restartGame() {
    document.querySelector('.game-over-overlay')?.remove();
    startGame();
}

function quitGame() {
    document.querySelector('.game-over-overlay')?.remove();
    document.getElementById('gameOverlay').classList.remove('hidden');
}

// ========================================
// UI UPDATE
// ========================================
function updateUI() {
    document.getElementById('gameScore').textContent = player.score;
    document.getElementById('gameLevel').textContent = player.level;
    document.getElementById('gameWave').textContent = player.wave;
    document.getElementById('gameKills').textContent = player.kills;
    
    const healthFill = document.getElementById('healthFill');
    const healthValue = document.getElementById('healthValue');
    healthFill.style.width = player.health + '%';
    healthValue.textContent = Math.max(0, Math.floor(player.health)) + '%';
}

// ========================================
// LEADERBOARD
// ========================================
function loadLeaderboard() {
    const list = document.getElementById('leaderboardList');
    
    // Demo data
    const leaders = [
        { name: 'SurvivorKing', level: 50, score: 999999 },
        { name: 'ZombieSlayer', level: 45, score: 875432 },
        { name: 'DeadHunter', level: 40, score: 756123 },
        { name: 'ApocalypsePro', level: 35, score: 654321 },
        { name: 'LastStand', level: 30, score: 543210 },
        { name: 'Braaaains', level: 28, score: 432109 },
        { name: 'HordeKiller', level: 25, score: 321098 },
        { name: 'Survivalist', level: 22, score: 210987 },
        { name: 'ZedDestroyer', level: 20, score: 109876 },
        { name: 'NightStalker', level: 18, score: 98765 }
    ];
    
    list.innerHTML = leaders.map((leader, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}</span>
            <div class="leaderboard-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${leader.name}</div>
                <div class="leaderboard-level">Level ${leader.level}</div>
            </div>
            <div class="leaderboard-score">${leader.score.toLocaleString()}</div>
        </div>
    `).join('');
}

// ========================================
// PRELOADER
// ========================================
function runPreloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.querySelector('.loading-progress');
    
    if (!preloader) return;
    
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2500);
}
