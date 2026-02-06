document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const penguin = document.getElementById("male-penguin");
  const cursor = document.getElementById("heart-cursor");

  let penguinX = window.innerWidth / 2;
  let penguinY = window.innerHeight / 2;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  const speed = 0.03;
  let chasing = false;

  // Track cursor position
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // On button click, show penguin and start chase
  enterBtn.addEventListener("click", () => {

    penguin.style.left = penguinX + "px";
    penguin.style.top = penguinY + "px";
    penguin.classList.add("show");

    chasing = true;
    animatePenguin();
  });

  
function animatePenguin() {

 const walkFrames = [
  "assets/images/penguin_walk01.png",
  "assets/images/penguin_walk02.png",
  "assets/images/penguin_walk03.png",
  "assets/images/penguin_walk04.png"
];

let currentFrame = 0;
let frameTimer = 0;

function animatePenguin() {

  if (chasing) {

    penguinX += (cursorX - penguinX) * speed;
    penguinY += (cursorY - penguinY) * speed;

    penguin.style.left = penguinX + "px";
    penguin.style.top = penguinY + "px";

    const distance = Math.hypot(cursorX - penguinX, cursorY - penguinY);

    const direction = cursorX < penguinX ? -1 : 1;

    penguin.style.transform =
      `translate(-50%, -50%) scaleX(${direction})`;

    // WALK FRAME SWITCHING
    if (distance > 5) {

      frameTimer++;

      if (frameTimer > 8) { // controls animation speed
        currentFrame = (currentFrame + 1) % walkFrames.length;
        penguin.src = walkFrames[currentFrame];
        frameTimer = 0;
      }

    } else {
      penguin.src = walkFrames[0];
    }
  }

  requestAnimationFrame(animatePenguin);
}
});
