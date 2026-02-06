document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
 const penguin = document.getElementById("male-penguin");
const penguinImg = document.querySelector(".penguin-inner");
  const cursor = document.getElementById("heart-cursor");

  let penguinX = window.innerWidth / 2;
  let penguinY = window.innerHeight / 2;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  let chasing = false;

  const moveSpeed = 1.2;

  const walkFrames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let currentFrame = 0;
  let frameTimer = 0;

  // Track cursor
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Start penguin
  enterBtn.addEventListener("click", () => {
    penguin.style.left = penguinX + "px";
    penguin.style.top = penguinY + "px";
    penguin.classList.add("show");

    chasing = true;
 
  });

  function animatePenguin() {

    if (chasing) {

      const dx = cursorX - penguinX;
      const dy = cursorY - penguinY;
      const distance = Math.hypot(dx, dy);

      const direction = dx < 0 ? -1 : 1;

      if (distance > 5) {

        // Walking
        penguin.classList.remove("idle");

        const dirX = dx / distance;
        const dirY = dy / distance;

        penguinX += dirX * moveSpeed;
        penguinY += dirY * moveSpeed;

        penguin.style.left = penguinX + "px";
        penguin.style.top = penguinY + "px";

        penguin.style.transform =
          `translate(-50%, -50%) scaleX(${direction})`;

        // Frame switching
        frameTimer++;

        if (frameTimer > 8) {
          currentFrame = (currentFrame + 1) % walkFrames.length;
          penguinImg.src = walkFrames[currentFrame];
          frameTimer = 0;
        }

      } else {

        // Idle state
        penguinImg.src = "assets/images/penguin_walk02.png";

        // Cute bounce
        const bounce = Math.sin(Date.now() * 0.01) * 3;

        penguin.style.transform =
          `translate(-50%, -50%) translateY(${bounce}px) scaleX(${direction})`;

        penguinImg.classList.add("idle");
      }

      // Heart glow when close
      if (distance < 80) {
        cursor.classList.add("love-mode");
      } else {
        cursor.classList.remove("love-mode");
      }
    }

    requestAnimationFrame(animatePenguin);
  }
   animatePenguin();
});
