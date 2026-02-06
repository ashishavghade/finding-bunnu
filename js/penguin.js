document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const yesBtn = document.getElementById("yes-btn");

  const stage = document.getElementById("stage");
  const overlay = document.getElementById("cinematic-overlay");

  const male = document.getElementById("male-penguin");
  const female = document.getElementById("female-penguin");

  const maleImg = male.querySelector(".penguin-inner");

  const celebrationLayer = document.getElementById("celebration-layer");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  let cx = mx;
  let cy = my;

  let state = "idle";
  let timer = 0;

  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;

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
    overlay.classList.add("overlay-dim");

    state = "approach";
    timer = 0;

    // spawn female opposite side
    const spawnLeft = mx < window.innerWidth / 2;
    const fx = spawnLeft ? window.innerWidth - 150 : 150;

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

  function spawnFireworkBurst(x, y) {
    for (let i = 0; i < 25; i++) {
      const f = document.createElement("div");
      f.className = "firework";
      f.style.left = x + "px";
      f.style.top = y + "px";
      f.style.background = `hsl(${Math.random()*360},100%,60%)`;
      celebrationLayer.appendChild(f);
      setTimeout(() => f.remove(), 1000);
    }
  }

  function spawnBalloon(x, y) {
    const b = document.createElement("div");
    b.className = "balloon";
    b.innerHTML = "💗";
    b.style.left = (x + Math.random()*200 - 100) + "px";
    b.style.top = y + "px";
    celebrationLayer.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }

  function startSnow() {
    setInterval(() => {
      const s = document.createElement("div");
      s.className = "snowflake";
      s.innerHTML = "❄";
      s.style.left = Math.random()*window.innerWidth + "px";
      celebrationLayer.appendChild(s);
      setTimeout(() => s.remove(), 8000);
    }, 300);
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

      // true midpoint approach
      const maleTargetX = centerX - 40;
      const femaleTargetX = centerX + 40;

      const dx = maleTargetX - mx;
      const dist = Math.abs(dx);

      if (dist > 2) {
        mx += dx * 0.05;

        male.style.left = mx + "px";
        male.style.top = centerY + "px";

        female.style.left = female.offsetLeft + (femaleTargetX - female.offsetLeft) * 0.05 + "px";

        male.style.transform = `translate(-50%, -50%) scaleX(1)`;
        female.style.transform = `translate(-50%, -50%) scaleX(-1)`;

        updateWalk();

      } else {
        state = "pause";
        timer = 0;
      }
    }

    else if (state === "pause") {

      timer++;
      if (timer > 150) {
        state = "lean";
        timer = 0;
        male.classList.add("show-eyes");
        female.classList.add("show-eyes");
        female.classList.add("blushing");
      }
    }

    else if (state === "lean") {

      male.style.left = (centerX - 30) + "px";
      female.style.left = (centerX + 30) + "px";

      timer++;
      if (timer > 120) {
        state = "kiss";
        timer = 0;
      }
    }

    else if (state === "kiss") {

      // gradual zoom in
      const scale = 1 + (timer / 360) * 0.12;
      stage.style.transform = `scale(${scale})`;

      // continuous fireworks
      if (timer % 40 === 0) {
        spawnFireworkBurst(centerX, centerY);
      }

      // continuous balloons
      if (timer % 20 === 0) {
        spawnBalloon(centerX, centerY);
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
        startSnow();
      }
    }

    else if (state === "walkaway") {

      stage.style.transform = "scale(1)"; // zoom out

      mx += 1.5;

      male.style.left = mx + "px";
      female.style.left = (mx + 70) + "px";

      male.style.transform = `translate(-50%, -50%) scaleX(1)`;
      female.style.transform = `translate(-50%, -50%) scaleX(1)`;

      updateWalk();

      if (mx > window.innerWidth + 150) {
        state = "fade";
      }
    }

    else if (state === "fade") {
      overlay.style.background = "rgba(255,200,230,0.9)";
    }

    requestAnimationFrame(animate);
  }

  animate();

});
