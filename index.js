"use strict";

const dodger = document.getElementById("dodger");
const coin = document.getElementById("coin");
const scoreElement = document.getElementById("points");
const gameoverSound = document.getElementById("gameover");
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

  if (
    dodgerRect.left < coinRect.right &&
    dodgerRect.right > coinRect.left &&
    dodgerRect.top < coinRect.bottom &&
    dodgerRect.bottom > coinRect.top
  ) {
    // Collision detected!
    score += 10;
    scoreElement.textContent = score;
    playCoinSound(); // Afspil lyd når mønten fanges
    moveCoinToNewPosition();
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
}

function resetGame() {
  score = 0;
  scoreElement.textContent = "0";
  dodger.style.bottom = "180px";
  dodger.style.left = "180px";
  moveCoinToNewPosition();
  document.getElementById("gameOverScreen").style.display = "none";
  playBackgroundMusic(); // Starter musikken igen når spillet genstartes
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
