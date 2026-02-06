document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const yesBtn = document.getElementById("yes-btn");

  const malePenguin = document.getElementById("male-penguin");
  const malePenguinImg = document.querySelector("#male-penguin .penguin-inner");

  const femalePenguin = document.getElementById("female-penguin");
  const femalePenguinImg = document.querySelector("#female-penguin .penguin-inner");

  const cursor = document.getElementById("heart-cursor");

  let penguinX = window.innerWidth / 2;
  let penguinY = window.innerHeight / 2;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  let chasing = false;
  let cinematicMode = false;

  const moveSpeed = 1.2;

  const walkFrames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let currentFrame = 0;
  let frameTimer = 0;

  // Track mouse
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Enter button
  enterBtn.addEventListener("click", () => {
    malePenguin.style.left = penguinX + "px";
    malePenguin.style.top = penguinY + "px";
    malePenguin.classList.add("show");
    chasing = true;
  });

  // YES cinematic
  yesBtn.addEventListener("click", () => {

    cinematicMode = true;
    chasing = false;

    // Place female at cursor position
    femalePenguin.style.left = cursorX + "px";
    femalePenguin.style.top = cursorY + "px";
    femalePenguin.classList.add("show");

    let loveInterval = setInterval(() => {

      const dx = cursorX - penguinX;
      const dy = cursorY - penguinY;
      const dist = Math.hypot(dx, dy);

      if (dist > 10) {

        const dirX = dx / dist;
        const dirY = dy / dist;

        penguinX += dirX * 1.5;
        penguinY += dirY * 1.5;

        malePenguin.style.left = penguinX + "px";
        malePenguin.style.top = penguinY + "px";

      } else {

        clearInterval(loveInterval);

        // Kiss bounce
        malePenguin.classList.add("kiss");
        femalePenguin.classList.add("kiss");

        setTimeout(() => {

          let walkOff = setInterval(() => {

            penguinX += 2;
            malePenguin.style.left = penguinX + "px";

            cursorX += 2;
            femalePenguin.style.left = cursorX + "px";

            if (penguinX > window.innerWidth + 150) {
              clearInterval(walkOff);
            }

          }, 16);

        }, 800);
      }

    }, 16);

  });

  function animatePenguin() {

    if (chasing && !cinematicMode) {

      const dx = cursorX - penguinX;
      const dy = cursorY - penguinY;
      const distance = Math.hypot(dx, dy);

      const direction = dx < 0 ? -1 : 1;

      if (distance > 5) {

        const dirX = dx / distance;
        const dirY = dy / distance;

        penguinX += dirX * moveSpeed;
        penguinY += dirY * moveSpeed;

        malePenguin.style.left = penguinX + "px";
        malePenguin.style.top = penguinY + "px";

        malePenguin.style.transform =
          `translate(-50%, -50%) scaleX(${direction})`;

        frameTimer++;

        if (frameTimer > 8) {
          currentFrame = (currentFrame + 1) % walkFrames.length;
          malePenguinImg.src = walkFrames[currentFrame];
          frameTimer = 0;
        }

      } else {

        malePenguinImg.src = walkFrames[1];

        const bounce = Math.sin(Date.now() * 0.01) * 3;

        malePenguin.style.transform =
          `translate(-50%, -50%) translateY(${bounce}px) scaleX(${direction})`;
      }

      if (distance < 80) {
        cursor.classList.add("love-mode");
      } else {
        cursor.classList.remove("love-mode");
      }
    }

    requestAnimationFrame(animatePenguin);
  }

  // Start loop once
  animatePenguin();

});
