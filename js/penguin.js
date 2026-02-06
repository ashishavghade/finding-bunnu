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

  let lovePhase = null;
  let loveTargetX = 0;
  let loveTargetY = 0;

  const moveSpeed = 1.2;

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
    malePenguin.style.left = penguinX + "px";
    malePenguin.style.top = penguinY + "px";
    malePenguin.classList.add("show");
    chasing = true;
  });

  yesBtn.addEventListener("click", () => {

    chasing = false;
    cinematicMode = true;

    // spawn opposite side
    const isMaleLeft = penguinX < window.innerWidth / 2;

    loveTargetX = isMaleLeft ? window.innerWidth - 200 : 200;
    loveTargetY = window.innerHeight / 2;

    femalePenguin.style.left = loveTargetX + "px";
    femalePenguin.style.top = loveTargetY + "px";
    femalePenguin.classList.add("show");

    // flip female to face male
    const femaleDirection = isMaleLeft ? -1 : 1;
    femalePenguin.style.transform =
      `translate(-50%, -50%) scaleX(${femaleDirection})`;

    lovePhase = "approach";
  });

  function updateWalkFrame() {
    frameTimer++;
    if (frameTimer > 8) {
      currentFrame = (currentFrame + 1) % walkFrames.length;
      malePenguinImg.src = walkFrames[currentFrame];
      femalePenguinImg.src = walkFrames[currentFrame];
      frameTimer = 0;
    }
  }

  function animatePenguin() {

    // NORMAL CHASE
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

        updateWalkFrame();

      } else {

        malePenguinImg.src = walkFrames[1];

        const bounce = Math.sin(Date.now() * 0.01) * 3;

        malePenguin.style.transform =
          `translate(-50%, -50%) translateY(${bounce}px) scaleX(${direction})`;
      }
    }

    // CINEMATIC
    if (cinematicMode) {

      const dx = loveTargetX - penguinX;
      const dy = loveTargetY - penguinY;
      const distance = Math.hypot(dx, dy);

      if (lovePhase === "approach") {

        if (distance > 30) {

          const dirX = dx / distance;
          const dirY = dy / distance;

          penguinX += dirX * 1.5;
          penguinY += dirY * 1.5;

          malePenguin.style.left = penguinX + "px";
          malePenguin.style.top = penguinY + "px";

          updateWalkFrame();

        } else {

          lovePhase = "kiss";

          // adjust spacing so they don't overlap
          const spacing = 40;

          if (penguinX < loveTargetX) {
            malePenguin.style.left = (loveTargetX - spacing) + "px";
            femalePenguin.style.left = (loveTargetX + spacing) + "px";
          } else {
            malePenguin.style.left = (loveTargetX + spacing) + "px";
            femalePenguin.style.left = (loveTargetX - spacing) + "px";
          }

          malePenguin.classList.add("kiss");
          femalePenguin.classList.add("kiss");
          femalePenguin.classList.add("blushing");

          setTimeout(() => {
            lovePhase = "walkaway";
          }, 800);
        }
      }

      else if (lovePhase === "walkaway") {

        penguinX += 2;
        loveTargetX += 2;

        malePenguin.style.left = penguinX + "px";
        femalePenguin.style.left = loveTargetX + "px";

        updateWalkFrame();

        if (penguinX > window.innerWidth + 150) {
          cinematicMode = false;
        }
      }
    }

    requestAnimationFrame(animatePenguin);
  }

  animatePenguin();

});
