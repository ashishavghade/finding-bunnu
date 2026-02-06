document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const yesBtn = document.getElementById("yes-btn");

  const malePenguin = document.getElementById("male-penguin");
  const malePenguinImg = document.querySelector("#male-penguin .penguin-inner");

  const femalePenguin = document.getElementById("female-penguin");

  const cursor = document.getElementById("heart-cursor");
  const celebrationLayer = document.getElementById("celebration-layer");

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

    const isMaleLeft = penguinX < window.innerWidth / 2;

    loveTargetX = isMaleLeft ? window.innerWidth - 200 : 200;
    loveTargetY = window.innerHeight / 2;

    femalePenguin.style.left = loveTargetX + "px";
    femalePenguin.style.top = loveTargetY + "px";
    femalePenguin.classList.add("show");

    // female faces male
    femalePenguin.style.transform =
      `translate(-50%, -50%) scaleX(${isMaleLeft ? -1 : 1})`;

    lovePhase = "approach";
  });

  function updateWalkFrame() {
    frameTimer++;
    if (frameTimer > 8) {
      currentFrame = (currentFrame + 1) % walkFrames.length;
      malePenguinImg.src = walkFrames[currentFrame];
      frameTimer = 0;
    }
  }

  function triggerCelebration(x, y) {

    // hearts
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-particle";
      heart.innerHTML = "💗";
      heart.style.left = x + (Math.random() * 80 - 40) + "px";
      heart.style.top = y + (Math.random() * 40 - 20) + "px";
      celebrationLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    }

    // stars
    for (let i = 0; i < 8; i++) {
      const star = document.createElement("div");
      star.className = "star-particle";
      star.style.left = x + "px";
      star.style.top = y + "px";
      celebrationLayer.appendChild(star);
      setTimeout(() => star.remove(), 1000);
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

        if (distance > 40) {

          const dirX = dx / distance;
          const dirY = dy / distance;

          penguinX += dirX * 1.5;
          penguinY += dirY * 1.5;

          malePenguin.style.left = penguinX + "px";
          malePenguin.style.top = penguinY + "px";

          updateWalkFrame();

        } else {

          lovePhase = "kiss";

          const spacing = 35;

          malePenguin.style.left =
            (loveTargetX < penguinX ? loveTargetX + spacing : loveTargetX - spacing) + "px";

          femalePenguin.style.left =
            (loveTargetX < penguinX ? loveTargetX - spacing : loveTargetX + spacing) + "px";

          malePenguin.classList.add("kiss");
          femalePenguin.classList.add("kiss");
          femalePenguin.classList.add("blushing");

          triggerCelebration(loveTargetX, loveTargetY);

          setTimeout(() => {
            lovePhase = "walkaway";
          }, 900);
        }
      }

      else if (lovePhase === "walkaway") {

        penguinX += 2;
        loveTargetX += 2;

        malePenguin.style.left = penguinX + "px";
        femalePenguin.style.left = loveTargetX + "px";

        // both face right while leaving
        malePenguin.style.transform =
          `translate(-50%, -50%) scaleX(1)`;
        femalePenguin.style.transform =
          `translate(-50%, -50%) scaleX(1)`;

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
