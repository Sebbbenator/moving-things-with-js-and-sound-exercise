"use strict";

const dodger = document.getElementById("dodger");
const coin = document.getElementById("coin");
const scoreElement = document.getElementById("points");
const gameoverSound = document.getElementById("gameover");
let score = 0;

dodger.style.backgroundImage = "url('img/pacman.png')";

// Funktion til at tjekke om Pacman har fanget coin'en
function checkCollision() {
  const dodgerRect = dodger.getBoundingClientRect();
  const coinRect = coin.getBoundingClientRect();

  if (
    dodgerRect.left < coinRect.right &&
    dodgerRect.right > coinRect.left &&
    dodgerRect.top < coinRect.bottom &&
    dodgerRect.bottom > coinRect.top
  ) {
    // Collision detected!
    score += 10;
    scoreElement.textContent = score;
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
    playGameOverSound();
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
    playGameOverSound();
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
    playGameOverSound();
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
    playGameOverSound();
  }
}
