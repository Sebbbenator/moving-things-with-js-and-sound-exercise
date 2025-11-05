"use strict";

const dodger = document.getElementById("dodger");
dodger.style.backgroundColor = "#FF69B4";

//lyd for movement
function playMovement() {
  const movement = document.getElementById("movement");
  movement.currentTime = 0;
  movement.play();
}

//lyd for gameover
function playGameOver() {
  const gameover = document.getElementById("gameover");
  gameover.play();
}


document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") moveDodgerLeft();
  if (event.key === "ArrowRight") moveDodgerRight();
  if (event.key === "ArrowUp") moveDodgerUp();
  if (event.key === "ArrowDown") moveDodgerDown();

  console.log(event.key);
});

function moveDodgerLeft() {
  const left = parseInt(dodger.style.left.replace("px", ""), 10);
  if (left > 0) {
    dodger.style.left = `${left - 1}px`;
    playMovement();
  }
}

function moveDodgerRight() {
  const left = parseInt(dodger.style.left.replace("px", ""), 10);
  if (left < 360) {
    dodger.style.left = `${left + 1}px`;
    playMovement();
  }
}

function moveDodgerUp() {
  const bottom = parseInt(dodger.style.bottom.replace("px", ""), 10);
  if (bottom < 380) {
    dodger.style.bottom = `${bottom + 1}px`;
    playMovement();
  }
}

function moveDodgerDown() {
  const bottom = parseInt(dodger.style.bottom.replace("px", ""), 10);
  if (bottom > 0) {
    dodger.style.bottom = `${bottom - 1}px`;
    playMovement();
  }
}
