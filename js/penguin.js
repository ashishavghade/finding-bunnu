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

  const speed = 1.6;

  const frames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let frame = 0;
  let tick = 0;

  let balloonTick = 0;
  let fireworkTick = 0;
  let sparkleTick = 0;

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
    fy = centerY;

    female.style.left = fx + "px";
    female.style.top = fy + "px";
    female.classList.add("show");
  });

  function updateWalk() {
    tick++;
    if (tick > 6) {
      frame = (frame + 1) % frames.length;
      maleImg.src = frames[frame];
      tick = 0;
    }
  }

  function spawnBalloon(x, y) {
    if (!celebrationLayer) return;
    const b = document.createElement("div");
    b.className = "balloon";
    b.innerHTML = "💗";
    b.style.left = x + (Math.random() * 300 - 150) + "px";
    b.style.top = y + "px";
    celebrationLayer.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }

  function spawnFirework(x, y) {
    for (let i = 0; i < 20; i++) {
      const f = document.createElement("div");
      f.className = "firework";
      f.style.left = x + "px";
      f.style.top = y + "px";
      f.style.background = `hsl(${Math.random()*360},100%,60%)`;
      celebrationLayer.appendChild(f);
      setTimeout(() => f.remove(), 1000);
    }
  }

  function spawnSparkle() {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = Math.random() * window.innerWidth + "px";
    s.style.top = Math.random() * window.innerHeight + "px";
    celebrationLayer.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }

  function addHeartEyes(penguin) {
    const left = document.createElement("div");
    const right = document.createElement("div");

    left.className = "heart-eye left";
    right.className = "heart-eye right";

    left.innerHTML = "❤️";
    right.innerHTML = "❤️";

    penguin.appendChild(left);
    penguin.appendChild(right);
  }

  function removeHeartEyes(penguin) {
    penguin.querySelectorAll(".heart-eye").forEach(e => e.remove());
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

      const maleTarget = centerX - 30;
      const femaleTarget = centerX + 30;

      let maleArrived = false;
      let femaleArrived = false;

      let dxm = maleTarget - mx;
      if (Math.abs(dxm) > 2) {
        mx += Math.sign(dxm) * speed;
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

      male.style.transform = "translate(-50%, -50%) scaleX(1)";
      female.style.transform = "translate(-50%, -50%) scaleX(-1)";

      updateWalk();

      if (maleArrived && femaleArrived) {
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
        addHeartEyes(male);
        addHeartEyes(female);
      }
    }

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

    else if (state === "kiss") {

      const zoom = 1 + (timer / 360) * 0.12;
      stage.style.transform = `scale(${zoom})`;

      balloonTick++;
      fireworkTick++;
      sparkleTick++;

      if (balloonTick > 10) {
        spawnBalloon(centerX, centerY);
        balloonTick = 0;
      }

      if (fireworkTick > 45) {
        spawnFirework(centerX, centerY);
        fireworkTick = 0;
      }

      if (sparkleTick > 6) {
        spawnSparkle();
        sparkleTick = 0;
      }

      timer++;
      if (timer > 360) {
        state = "walkaway";
        timer = 0;
        removeHeartEyes(male);
        removeHeartEyes(female);
      }
    }

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

      male.style.transform = "translate(-50%, -50%) scaleX(1)";
      female.style.transform = "translate(-50%, -50%) scaleX(1)";

      if (timer % 25 === 0) {
        spawnBalloon(mx, my);
      }

      timer++;

      updateWalk();
    }

    requestAnimationFrame(animate);
  }

  animate();

});
