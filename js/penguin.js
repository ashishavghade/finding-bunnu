document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const yesBtn = document.getElementById("yes-btn");

  const male = document.getElementById("male-penguin");
  const female = document.getElementById("female-penguin");
  const maleImg = male.querySelector(".penguin-inner");

  const stage = document.getElementById("content");
  const celebrationLayer = document.getElementById("celebration-layer");

  let state = "idle";
  let timer = 0;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  let fx = 0;
  let fy = window.innerHeight / 2;

  let cx = mx;
  let cy = my;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const speed = 1.3;

  const frames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let frame = 0;
  let tick = 0;

  document.addEventListener("mousemove", e => {
    cx = e.clientX;
    cy = e.clientY;
  });

  enterBtn.addEventListener("click", () => {
    male.style.left = mx + "px";
    male.style.top = my + "px";
    male.classList.add("show");
    state = "chase";
  });

  yesBtn.addEventListener("click", () => {
    document.body.style.pointerEvents = "none";

    state = "approach";
    timer = 0;

    const spawnLeft = mx < window.innerWidth / 2;
    fx = spawnLeft ? window.innerWidth - 150 : 150;

    female.style.left = fx + "px";
    female.style.top = centerY + "px";
    female.classList.add("show");
  });

  function updateWalk() {
    tick++;
    if (tick > 8) {
      frame = (frame + 1) % frames.length;
      maleImg.src = frames[frame];
      tick = 0;
    }
  }

  function spawnHeart(x, y) {
    if (!celebrationLayer) return;

    const h = document.createElement("div");
    h.className = "heart-particle";
    h.innerHTML = "💗";
    h.style.left = x + "px";
    h.style.top = y + "px";
    celebrationLayer.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }

  function animate() {

    if (state === "chase") {

      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        mx += (dx/dist) * speed;
        my += (dy/dist) * speed;

        male.style.left = mx + "px";
        male.style.top = my + "px";
        male.style.transform =
          `translate(-50%, -50%) scaleX(${dx < 0 ? -1 : 1})`;

        updateWalk();
      }
    }

    else if (state === "approach") {

      const maleTarget = centerX - 40;
      const femaleTarget = centerX + 40;

      mx += (maleTarget - mx) * 0.05;
      fx += (femaleTarget - fx) * 0.05;

      male.style.left = mx + "px";
      male.style.top = centerY + "px";

      female.style.left = fx + "px";
      female.style.top = centerY + "px";

      male.style.transform = "translate(-50%, -50%) scaleX(1)";
      female.style.transform = "translate(-50%, -50%) scaleX(-1)";

      updateWalk();

      if (Math.abs(maleTarget - mx) < 2) {
        state = "pause";
        timer = 0;
      }
    }

    else if (state === "pause") {

      timer++;
      if (timer > 120) {
        state = "lean";
        timer = 0;
        female.classList.add("blushing");
      }
    }

    else if (state === "lean") {

      male.style.left = (centerX - 25) + "px";
      female.style.left = (centerX + 25) + "px";

      timer++;
      if (timer > 120) {
        state = "kiss";
        timer = 0;
      }
    }

    else if (state === "kiss") {

      const zoom = 1 + (timer / 360) * 0.1;
      stage.style.transform = `scale(${zoom})`;

      if (timer % 20 === 0) {
        spawnHeart(centerX, centerY);
      }

      timer++;
      if (timer > 360) {
        state = "hold";
        timer = 0;
      }
    }

    else if (state === "hold") {

      timer++;
      if (timer > 120) {
        state = "walkaway";
        timer = 0;
      }
    }

    else if (state === "walkaway") {

      stage.style.transform = "scale(1)";

      mx += 1.5;
      fx += 1.5;

      male.style.left = mx + "px";
      female.style.left = fx + "px";

      male.style.transform = "translate(-50%, -50%) scaleX(1)";
      female.style.transform = "translate(-50%, -50%) scaleX(1)";

      updateWalk();
    }

    requestAnimationFrame(animate);
  }

  animate();

});
