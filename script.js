const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const scoreelement = document.getElementById('score');
const gameoverelement = document.getElementById('gameover');
const bgmusic = document.getElementById('bgmusic');
const eatSound = document.getElementById('eatSound');
const gameoverSound = document.getElementById('gameoverSound');

const gridsize = 20;
const gridwidth = canvas.width / gridsize;
const gridheight = canvas.height / gridsize;

let snake = [{ x: Math.floor(gridwidth / 2), y: Math.floor(gridheight / 2) }];
let food = { x: 5, y: 5 };
let direction = 'right';
let score = 0;
let gamerunning = true;
let musicPlaying = true;

// Set volume untuk semua audio
if (eatSound) eatSound.volume = 0.6;
if (gameoverSound) gameoverSound.volume = 0.8;
if (bgmusic) bgmusic.volume = 0.4;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridsize, segment.y * gridsize, gridsize, gridsize);
  });
  ctx.fillStyle = 'pink';
  ctx.fillRect(food.x * gridsize, food.y * gridsize, gridsize, gridsize);
}

function update() {
  if (!gamerunning) return;
  const head = { ...snake[0] };
  
  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;
  if (direction === 'left') head.x--;
  if (direction === 'right') head.x++;
  
  // Tabrakan dengan tembok
  if (head.x < 0 || head.x >= gridwidth || head.y < 0 || head.y >= gridheight) {
    endgame();
    return;
  }
  
  // Tabrakan dengan diri sendiri
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      endgame();
      return;
    }
  }
  
  snake.unshift(head);
  
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreelement.textContent = score;
    
    // Play eat sound dengan error handling
    if (eatSound) {
      eatSound.currentTime = 0; // Reset audio ke awal
      eatSound.play().catch(err => {
        console.warn('Eat sound gagal diputar:', err);
      });
    }
    
    generatefood();
  } else {
    snake.pop();
  }
}

function generatefood() {
  food = {
    x: Math.floor(Math.random() * gridwidth),
    y: Math.floor(Math.random() * gridheight)
  };
}

function endgame() {
  gamerunning = false;
  gameoverelement.style.display = 'block'; // Tampilkan efek glitch Game Over
  
  // Play gameover sound dengan error handling
  if (gameoverSound) {
    gameoverSound.currentTime = 0; // Reset audio ke awal
    gameoverSound.play().catch(err => {
      console.warn('Game over sound gagal diputar:', err);
    });
  }
  
  pauseMusic();
}

function gameloop() {
  update();
  draw();
}

function resetgame() {
  snake = [{ x: Math.floor(gridwidth / 2), y: Math.floor(gridheight / 2) }];
  direction = 'right';
  score = 0;
  scoreelement.textContent = score;
  gamerunning = true;
  gameoverelement.style.display = 'none';
  generatefood();
  playMusic();
}

function playMusic() {
  if (bgmusic) {
    bgmusic.play().catch(err => {
      console.warn('Musik gagal diputar otomatis. Klik layar atau tombol.');
    });
    musicPlaying = true;
  }
}

function pauseMusic() {
  if (bgmusic) {
    bgmusic.pause();
    musicPlaying = false;
  }
}

function toggleMusic() {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

resetgame();
setInterval(gameloop, 150);