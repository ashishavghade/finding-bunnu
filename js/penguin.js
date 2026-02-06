document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const yesBtn = document.getElementById("yes-btn");

  const male = document.getElementById("male-penguin");
  const female = document.getElementById("female-penguin");

  const maleWrap = male.querySelector(".penguin-wrapper");
  const femaleWrap = female.querySelector(".penguin-wrapper");

  const maleImg = male.querySelector(".penguin-inner");
  const femaleImg = female.querySelector(".penguin-inner");

  const overlay = document.getElementById("cinematic-overlay");

  const stage = document.getElementById("content");
  const celebrationLayer = document.getElementById("celebration-layer");

  const noBtn = document.getElementById("no-btn");


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

  const speed = 1.6;

  const heartRain = document.getElementById("heart-rain");
  let rainStarted = false;

  const frames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let frame = 0;
  let tick = 0;

  let balloonTick = 0;
  let sparkleTick = 0;

  /* =========================
     MOUSE MOVE
  ========================= */

  document.addEventListener("mousemove", e => {
    cx = e.clientX;
    cy = e.clientY;
  });

  /* =========================
     START CHASE
  ========================= */

  enterBtn.addEventListener("click", () => {
    male.style.left = mx + "px";
    male.style.top = my + "px";
    male.classList.add("show");
    state = "chase";
  });

   /* =========================
     No-btn chase
  ========================= */
 let noLocked = false;

document.addEventListener("mousemove", (e) => {

  if (!noBtn) return;

  // Lock position only when first needed
  if (!noLocked) {
    const rect = noBtn.getBoundingClientRect();
    noBtn.style.position = "fixed";
    noBtn.style.left = rect.left + "px";
    noBtn.style.top = rect.top + "px";
    noLocked = true;
  }

  const rect = noBtn.getBoundingClientRect();

  const dx = rect.left + rect.width / 2 - e.clientX;
  const dy = rect.top + rect.height / 2 - e.clientY;

  const distance = Math.hypot(dx, dy);

  if (distance < 70) {

    const angle = Math.atan2(dy, dx);
    const moveDistance = 180;

    let newLeft = rect.left + Math.cos(angle) * moveDistance;
    let newTop  = rect.top  + Math.sin(angle) * moveDistance;

    newLeft = Math.max(20, Math.min(window.innerWidth - rect.width - 20, newLeft));
    newTop  = Math.max(20, Math.min(window.innerHeight - rect.height - 20, newTop));

    noBtn.style.left = newLeft + "px";
    noBtn.style.top  = newTop + "px";
  }
});

  /* =========================
     START CINEMATIC
  ========================= */

  yesBtn.addEventListener("click", () => {

    document.body.style.pointerEvents = "none";

    state = "approach";
    timer = 0;

    const spawnLeft = mx < window.innerWidth / 2;
    fx = spawnLeft ? window.innerWidth - 150 : 150;
    fy = centerY;

    female.style.left = fx + "px";
    female.style.top = fy + "px";
    female.classList.add("show");
  });

  /* =========================
     WALK FRAME UPDATE
  ========================= */

  function updateWalk() {
    tick++;
    if (tick > 6) {
      frame = (frame + 1) % frames.length;
      maleImg.src = frames[frame];
      femaleImg.src = frames[frame];
      tick = 0;
    }
  }

  /* =========================
     CELEBRATION PARTICLES
  ========================= */

  function spawnBalloon(x, y) {
    const b = document.createElement("div");
    b.className = "balloon";
    b.innerHTML = "💗";
    b.style.left = x + (Math.random() * 300 - 150) + "px";
    b.style.top = y + "px";
    celebrationLayer.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }

 function startHeartRain() {
  if (rainStarted) return;
  rainStarted = true;

  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "rain-heart";
    heart.innerHTML = "💗";

    const size = Math.random() * 30 + 25; // different sizes
    heart.style.fontSize = size + "px";

    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.animationDuration = (Math.random() * 4 + 4) + "s";

    heartRain.appendChild(heart);

    setTimeout(() => heart.remove(), 8000);

  }, 200); // controls density (increase to reduce density)
}


  function spawnSparkle() {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = Math.random() * window.innerWidth + "px";
    s.style.top = Math.random() * window.innerHeight + "px";
    celebrationLayer.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }

  /* =========================
     MAIN ANIMATION LOOP
  ========================= */

  function animate() {

    /* ========= CHASE ========= */

    if (state === "chase") {

      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        mx += (dx/dist) * speed;
        my += (dy/dist) * speed;

        male.style.left = mx + "px";
        male.style.top = my + "px";

        maleWrap.style.transform = `scaleX(${dx < 0 ? -1 : 1})`;

        updateWalk();
      }
    }

    /* ========= APPROACH CENTER ========= */

    else if (state === "approach") {

      const maleTarget = centerX - 30;
      const femaleTarget = centerX + 30;

      let maleArrived = false;
      let femaleArrived = false;

      let dxm = maleTarget - mx;
      if (Math.abs(dxm) > 2) {
        mx += Math.sign(dxm) * speed;
        updateWalk();
      } else {
        maleArrived = true;
      }

      let dxf = femaleTarget - fx;
      if (Math.abs(dxf) > 2) {
        fx += Math.sign(dxf) * speed;
      } else {
        femaleArrived = true;
      }

      male.style.left = mx + "px";
      female.style.left = fx + "px";

      male.style.top = centerY + "px";
      female.style.top = centerY + "px";

      maleWrap.style.transform = "scaleX(1)";
      femaleWrap.style.transform = "scaleX(-1)";

      if (maleArrived && femaleArrived) {
        state = "pause";
        timer = 0;
      }
    }

    /* ========= PAUSE ========= */

    else if (state === "pause") {

      timer++;
      if (timer > 120) {
        state = "lean";
        timer = 0;
        female.classList.add("blushing");
        male.classList.add("show-hearts");
        female.classList.add("show-hearts");
      }
    }

    /* ========= LEAN ========= */

    else if (state === "lean") {

      mx += (centerX - 18 - mx) * 0.05;
      fx += (centerX + 18 - fx) * 0.05;

      male.style.left = mx + "px";
      female.style.left = fx + "px";

      timer++;
      if (timer > 120) {
        state = "kiss";
        timer = 0;
      }
    }

    /* ========= KISS ========= */

    else if (state === "kiss") {

      startHeartRain();

      overlay.classList.add("active");

      const zoom = 1 + (timer / 360) * 0.12;
      stage.style.transform = `scale(${zoom})`;

      balloonTick++;
      sparkleTick++;

      if (balloonTick > 10) {
        spawnBalloon(centerX, centerY);
        balloonTick = 0;
      }

      if (sparkleTick > 6) {
        spawnSparkle();
        sparkleTick = 0;
      }

      timer++;
      if (timer > 360) {
        state = "walkaway";
        timer = 0;
        male.classList.remove("show-hearts");
        female.classList.remove("show-hearts");
      }
    }

    /* ========= WALKAWAY ========= */

    else if (state === "walkaway") {

      stage.style.transform = "scale(1)";

      mx += 1.5;
      my += 0.8;

      fx = mx + 35;
      fy = my;

      male.style.left = mx + "px";
      male.style.top = my + "px";

      female.style.left = fx + "px";
      female.style.top = fy + "px";

      maleWrap.style.transform = "scaleX(1)";
      femaleWrap.style.transform = "scaleX(1)";

      updateWalk();

      if (timer % 25 === 0) {
        spawnBalloon(mx, my);
      }

      timer++;
    }

    requestAnimationFrame(animate);
  }

  animate();

});
