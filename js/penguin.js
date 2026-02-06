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

  const speed = 1.4;

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

    const spawnLeft = mx < window.innerWidth / 2;
    const fx = spawnLeft ? window.innerWidth - 200 : 200;
    const fy = window.innerHeight / 2;

    female.style.left = fx + "px";
    female.style.top = fy + "px";
    female.classList.add("show");

    female.dataset.x = fx;
    female.dataset.y = fy;
  });

  function updateWalk() {
    tick++;
    if (tick > 8) {
      frame = (frame + 1) % frames.length;
      maleImg.src = frames[frame];
      tick = 0;
    }
  }

  function spawnFireworks(x, y) {
    for (let i = 0; i < 30; i++) {
      const f = document.createElement("div");
      f.className = "firework";
      f.style.left = x + "px";
      f.style.top = y + "px";
      f.style.background = `hsl(${Math.random()*360},100%,60%)`;
      celebrationLayer.appendChild(f);
      setTimeout(() => f.remove(), 1000);
    }
  }

  function spawnBalloons(x, y) {
    for (let i = 0; i < 20; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      b.innerHTML = "💗";
      b.style.left = (x + Math.random()*300 - 150) + "px";
      b.style.top = y + "px";
      celebrationLayer.appendChild(b);
      setTimeout(() => b.remove(), 6000);
    }
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

      const fx = parseFloat(female.dataset.x);
      const fy = parseFloat(female.dataset.y);

      const dx = fx - mx;
      const dy = fy - my;
      const dist = Math.hypot(dx, dy);

      if (dist > 60) {

        mx += (dx/dist) * 1.2;
        my += (dy/dist) * 1.2;

        male.style.left = mx + "px";
        male.style.top = my + "px";

        male.style.transform =
          `translate(-50%, -50%) scaleX(${dx < 0 ? -1 : 1})`;

        female.style.transform =
          `translate(-50%, -50%) scaleX(${dx < 0 ? 1 : -1})`;

        updateWalk();

      } else {
        state = "pause";
        timer = 0;
      }
    }

    else if (state === "pause") {

      timer++;
      if (timer > 150) { // ~2.5s
        state = "lean";
        timer = 0;
        male.classList.add("show-eyes");
        female.classList.add("show-eyes");
        female.classList.add("blushing");
      }
    }

    else if (state === "lean") {

      male.classList.add("lean-in");
      female.classList.add("lean-in");

      timer++;
      if (timer > 120) {
        state = "kiss";
        timer = 0;
        spawnFireworks(mx, my);
        spawnBalloons(mx, my);
      }
    }

    else if (state === "kiss") {

      stage.style.transform = "scale(1.12)";

      timer++;
      if (timer > 360) { // 6 sec
        state = "hold";
        timer = 0;
      }
    }

    else if (state === "hold") {

      timer++;
      if (timer > 180) {
        state = "walkaway";
        startSnow();
      }
    }

    else if (state === "walkaway") {

      mx += 1.5;
      let fx = parseFloat(female.dataset.x) + 1.5;
      female.dataset.x = fx;

      male.style.left = mx + "px";
      female.style.left = fx + "px";

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
