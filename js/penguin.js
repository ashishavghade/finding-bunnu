document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const penguin = document.getElementById("male-penguin");

  let penguinX = window.innerWidth / 2;
  let penguinY = window.innerHeight / 2;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  const speed = 0.008;
  let chasing = false;

  const walkFrames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let currentFrame = 0;
  let frameTimer = 0;

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  enterBtn.addEventListener("click", () => {
    penguin.style.left = penguinX + "px";
    penguin.style.top = penguinY + "px";
    penguin.classList.add("show");

    chasing = true;
    animatePenguin();
  });

  function animatePenguin() {

  if (chasing) {

    // Direction difference
    const dx = cursorX - penguinX;
    const dy = cursorY - penguinY;

    const distance = Math.hypot(dx, dy);

    const moveSpeed = 1.2; // walking speed (lower = cuter)

    if (distance > 5) {

      // Normalize direction
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Constant movement
      penguinX += dirX * moveSpeed;
      penguinY += dirY * moveSpeed;

      penguin.style.left = penguinX + "px";
      penguin.style.top = penguinY + "px";

      // Flip direction
      const direction = dx < 0 ? -1 : 1;
      penguin.style.transform =
        `translate(-50%, -50%) scaleX(${direction})`;

      // Frame animation
      frameTimer++;

      if (frameTimer > 8) { // controls animation speed
        currentFrame = (currentFrame + 1) % walkFrames.length;
        penguin.src = walkFrames[currentFrame];
        frameTimer = 0;
      }

    } else {
      // Idle frame
      penguin.src = walkFrames[0];
    }
  }

  requestAnimationFrame(animatePenguin);
}
});
