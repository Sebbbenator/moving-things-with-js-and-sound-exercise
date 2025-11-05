"use strict";

const dodger = document.getElementById("dodger");
const coin = document.getElementById("coin");
const superCoin = document.getElementById("superCoin");
const scoreElement = document.getElementById("points");
const gameoverSound = document.getElementById("gameover");
const superCoinSound = document.getElementById("superCoinSound");
let score = 0;
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startknap");
const backgroundMusic = document.getElementById("backgroundMusic");

// Funktion til at starte baggrundsmusik
function playBackgroundMusic() {
  backgroundMusic.volume = 0.2;
  backgroundMusic.play();
}

// Funktion til at stoppe baggrundsmusik
function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

startButton.addEventListener("click", function () {
  startScreen.style.display = "none"; // fjerner start skærm overlay
  playBackgroundMusic(); // Starter musikken når spillet begynder
  // undersøg dette nærmere, dog ved jeg det er til super coin og det starter en interval hver 20s
  if (!superCoinInterval) {
    // tilføjer den første efter 8s for at give spilleren tid
    setTimeout(() => spawnSuperCoin(5000), 8000);
    superCoinInterval = setInterval(() => spawnSuperCoin(5000), 20000);
  }
});

dodger.style.backgroundImage = "url('img/pacman.png')";

// Funktion til at tjekke kollision med forhindringer
function checkStructureCollision() {
  const dodgerRect = dodger.getBoundingClientRect();
  const structures = document.getElementsByClassName("structure");

  // Undersøg denne struktor for kollision (hvad betyder det og hvad gør det præcist)
  for (let structure of structures) {
    const structureRect = structure.getBoundingClientRect();
    if (
      dodgerRect.left < structureRect.right &&
      dodgerRect.right > structureRect.left &&
      dodgerRect.top < structureRect.bottom &&
      dodgerRect.bottom > structureRect.top
    ) {
      return true; // Kollision med forhindring
    }
  }
  return false;
}

// Funktion til at tjekke om Pacman har fanget coin'en
function checkCollision() {
  const dodgerRect = dodger.getBoundingClientRect();
  const coinRect = coin.getBoundingClientRect();

  // Tjek først for kollision med forhindringer
  if (checkStructureCollision()) {
    showGameOver();
    return;
  }

  //undersøg også dette
  if (
    dodgerRect.left < coinRect.right &&
    dodgerRect.right > coinRect.left &&
    dodgerRect.top < coinRect.bottom &&
    dodgerRect.bottom > coinRect.top
  ) {
    // Collision opfanget!
    score += 10;
    scoreElement.textContent = score;
    playCoinSound(); 
    // Vis lille +10 notifikation ved coin-position
    try {
      const gameEl = document.getElementById("game"); 
      const notif = document.createElement("span");
      notif.className = "pickup-notif small";
      notif.textContent = "+10";
      const gameRect = gameEl.getBoundingClientRect();
      const left = coinRect.left - gameRect.left;
      const bottom = gameRect.bottom - coinRect.bottom;
      notif.style.left = `${left}px`;
      notif.style.bottom = `${bottom}px`;
      gameEl.appendChild(notif);
      setTimeout(() => {
        notif.classList.add("fade-out");
        setTimeout(() => notif.remove(), 600);
      }, 400);
    } catch (e) {
      // ignore positioning errors
    }
    moveCoinToNewPosition();
  }

  // Check collision with super coin (gives extra points)
  if (superCoin && superCoin.style.display !== "none") {
    const superRect = superCoin.getBoundingClientRect();
    if (
      dodgerRect.left < superRect.right &&
      dodgerRect.right > superRect.left &&
      dodgerRect.top < superRect.bottom &&
      dodgerRect.bottom > superRect.top
    ) {
      
      score += 50; // ekstra point ved super coin
      scoreElement.textContent = score;
      try {
        if (superCoinSound) {
          superCoinSound.currentTime = 0;
          superCoinSound.play();
        } else {
          playCoinSound();
        }
      } catch (e) {
        // ignore play errors (e.g., not allowed before user gesture)
      }
      // show visual notification near the super coin
      try {
        const gameEl = document.getElementById("game");
        const notif = document.createElement("span");
        notif.className = "pickup-notif";
        notif.textContent = "+50";
        // position relative to #game using same left/bottom as superCoin
        notif.style.left =
          superCoin.style.left ||
          superRect.left - gameEl.getBoundingClientRect().left + "px";
        notif.style.bottom =
          superCoin.style.bottom ||
          gameEl.getBoundingClientRect().bottom - superRect.bottom + "px";
        gameEl.appendChild(notif);
        // remove after animation
        setTimeout(() => {
          notif.classList.add("fade-out");
          setTimeout(() => notif.remove(), 600);
        }, 600);
      } catch (e) {
        // ignore if positioning fails
      }
      // hide immediately
      superCoin.classList.remove("super-visible");
      superCoin.style.display = "none";
      if (superCoinTimeout) {
        clearTimeout(superCoinTimeout);
        superCoinTimeout = null;
      }
    }
  }
}

// Flyt coin til ny tilfældig position
function moveCoinToNewPosition() {
  const gameWidth = 360;
  const gameHeight = 360;
  const randomX = Math.floor(Math.random() * gameWidth);
  const randomY = Math.floor(Math.random() * gameHeight);

  coin.style.left = `${randomX}px`;
  coin.style.bottom = `${randomY}px`;
}

// Helper: check if a rect overlaps any structure
function isOverlappingStructures(rect) {
  const structures = document.getElementsByClassName("structure");
  for (let s of structures) {
    const sr = s.getBoundingClientRect();
    if (
      rect.left < sr.right &&
      rect.right > sr.left &&
      rect.top < sr.bottom &&
      rect.bottom > sr.top
    ) {
      return true;
    }
  }
  return false;
}

// Super coin timers/intervals
let superCoinTimeout = null;
let superCoinInterval = null;

// Spawn a temporary super coin for `duration` milliseconds (default 5000 ms)
function spawnSuperCoin(duration = 5000) {
  // Place within same play area bounds as coin
  const gameWidth = 360;
  const gameHeight = 360;

  // Try up to N times to find a non-overlapping position
  let attempts = 0;
  let placed = false;
  while (attempts < 50 && !placed) {
    const x = Math.floor(Math.random() * gameWidth);
    const y = Math.floor(Math.random() * gameHeight);
    superCoin.style.left = `${x}px`;
    superCoin.style.bottom = `${y}px`;

    // Use getBoundingClientRect to test overlap
    const rect = superCoin.getBoundingClientRect();
    if (!isOverlappingStructures(rect)) {
      placed = true;
      break;
    }
    attempts++;
  }

  // Ensure visible and collectable
  superCoin.style.display = "block";
  // trigger appear/pulse class
  superCoin.classList.add("super-visible");

  if (superCoinTimeout) clearTimeout(superCoinTimeout);
  superCoinTimeout = setTimeout(() => {
    superCoin.classList.remove("super-visible");
    // hide after small delay so animation can finish
    setTimeout(() => (superCoin.style.display = "none"), 300);
    superCoinTimeout = null;
  }, duration);
}

function clearSuperCoinTimers() {
  if (superCoinTimeout) {
    clearTimeout(superCoinTimeout);
    superCoinTimeout = null;
  }
  if (superCoinInterval) {
    clearInterval(superCoinInterval);
    superCoinInterval = null;
  }
  if (superCoin) {
    superCoin.classList.remove("super-visible");
    superCoin.style.display = "none";
  }
}

// Function to play movement sound
function playMovement() {
  const movement = document.getElementById("movement");
  movement.currentTime = 0;
  movement.play();
}
// Function to play game over sound
function playGameOverSound() {
  gameoverSound.currentTime = 0;
  gameoverSound.play();
}

function showGameOver() {
  const gameOverScreen = document.getElementById("gameOverScreen");
  const finalScoreElement = document.getElementById("finalScore");
  finalScoreElement.textContent = score;
  gameOverScreen.style.display = "flex";
  playGameOverSound();
  stopBackgroundMusic(); // Stopper musikken ved game over
  // clear any super coin timers/intervals
  clearSuperCoinTimers();
}

function resetGame() {
  score = 0;
  scoreElement.textContent = "0";
  dodger.style.bottom = "180px";
  dodger.style.left = "180px";
  moveCoinToNewPosition();
  document.getElementById("gameOverScreen").style.display = "none";
  playBackgroundMusic(); // Starter musikken igen når spillet genstartes
  // restart super coin spawning
  clearSuperCoinTimers();
  if (!superCoinInterval) {
    superCoinInterval = setInterval(() => spawnSuperCoin(5000), 20000);
  }
}

// Tilføj event listener til restart knappen
document.getElementById("restartButton").addEventListener("click", resetGame);
// Function to play coin sound
function playCoinSound() {
  const coinSound = document.getElementById("coinSound");
  coinSound.currentTime = 0;
  coinSound.play();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") moveDodgerLeft();
  if (event.key === "ArrowRight") moveDodgerRight();
  if (event.key === "ArrowUp") moveDodgerUp();
  if (event.key === "ArrowDown") moveDodgerDown();
});

function moveDodgerLeft() {
  const left = parseInt(dodger.style.left.replace("px", ""), 10);
  if (left > 0) {
    dodger.style.left = `${left - 5}px`;
    dodger.style.transform = "scaleX(-1)";
    playMovement();
    checkCollision(); // Tjek om vi har fanget coin'en
  } else {
    showGameOver();
  }
}

function moveDodgerRight() {
  const left = parseInt(dodger.style.left.replace("px", ""), 10);
  if (left < 360) {
    dodger.style.left = `${left + 5}px`;
    dodger.style.transform = "scaleX(1)";
    playMovement();
    checkCollision(); // Tjek om vi har fanget coin'en
  } else {
    showGameOver();
  }
}

function moveDodgerUp() {
  const bottom = parseInt(dodger.style.bottom.replace("px", ""), 10);
  if (bottom < 380) {
    dodger.style.bottom = `${bottom + 5}px`;
    dodger.style.transform = "rotate(-90deg)"; // Roter Pacman så den kigger opad
    playMovement();
    checkCollision(); // Tjek om vi har fanget coin'en
  } else {
    showGameOver();
  }
}

function moveDodgerDown() {
  const bottom = parseInt(dodger.style.bottom.replace("px", ""), 10);
  if (bottom > 0) {
    dodger.style.bottom = `${bottom - 5}px`;
    dodger.style.transform = "rotate(90deg)";
    playMovement();
    checkCollision(); // Tjek om vi har fanget coin'en
  } else {
    showGameOver();
  }
}
