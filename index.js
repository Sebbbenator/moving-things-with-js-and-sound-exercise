"use strict";

const dodger = document.getElementById("dodger");
const gameoverSound = document.getElementById("gameover");
dodger.style.backgroundImage = "url('img/pacman.png')";

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
    dodger.style.transform = "scaleX(-1)"; // Vend Pacman mod venstre
    playMovement();
  } else {
    playGameOverSound();
  }
}

function moveDodgerRight() {
  const left = parseInt(dodger.style.left.replace("px", ""), 10);
  if (left < 360) {
    dodger.style.left = `${left + 5}px`;
    dodger.style.transform = "scaleX(1)"; // Vend Pacman mod højre (normal retning)
    playMovement();
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
  } else {
    playGameOverSound();
  }
}

function moveDodgerDown() {
  const bottom = parseInt(dodger.style.bottom.replace("px", ""), 10);
  if (bottom > 0) {
    dodger.style.bottom = `${bottom - 5}px`;
    dodger.style.transform = "rotate(90deg)"; // Roter Pacman så den kigger nedad
    playMovement();
  } else {
    playGameOverSound();
  }
}
