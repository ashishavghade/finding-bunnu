document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const yesBtn = document.getElementById("yes-btn");

  const male = document.getElementById("male-penguin");
  const maleImg = document.querySelector("#male-penguin .penguin-inner");

  const female = document.getElementById("female-penguin");

  const celebrationLayer = document.getElementById("celebration-layer");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;

  let chasing = false;
  let mode = "normal"; // normal | approach | kiss | walkaway

  const speed = 1.2;

  const frames = [
    "assets/images/penguin_walk01.png",
    "assets/images/penguin_walk02.png",
    "assets/images/penguin_walk03.png",
    "assets/images/penguin_walk04.png"
  ];

  let frame = 0;
  let frameTick = 0;

  document.addEventListener("mousemove", e => {
    cx = e.clientX;
    cy = e.clientY;
  });

  enterBtn.addEventListener("click", () => {
    male.style.left = mx + "px";
    male.style.top = my + "px";
    male.classList.add("show");
    chasing = true;
  });

  yesBtn.addEventListener("click", () => {

    chasing = false;
    mode = "approach";

    // Spawn female opposite MALE position
    const spawnLeft = mx < window.innerWidth / 2;

    const fx = spawnLeft ? window.innerWidth - 200 : 200;
    const fy = window.innerHeight / 2;

    female.style.left = fx + "px";
    female.style.top = fy + "px";
    female.classList.add("show");

    female.dataset.targetX = fx;
    female.dataset.targetY = fy;
  });

  function updateFrame() {
    frameTick++;
    if (frameTick > 8) {
      frame = (frame + 1) % frames.length;
      maleImg.src = frames[frame];
      frameTick = 0;
    }
  }

  function celebrate(x, y) {
    if (!celebrationLayer) return;

    for (let i = 0; i < 20; i++) {
      const h = document.createElement("div");
      h.className = "heart-particle";
      h.innerHTML = "💗";
      h.style.left = (x + Math.random() * 100 - 50) + "px";
      h.style.top = (y + Math.random() * 60 - 30) + "px";
      celebrationLayer.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }
  }

  function setHeartEyes(penguin, enable) {
    const img = penguin.querySelector(".penguin-inner");
    if (!img) return;

    if (enable) {
      img.style.filter = "drop-shadow(0 0 6px hotpink)";
    } else {
      img.style.filter = "none";
    }
  }

  function animate() {

    if (chasing && mode === "normal") {

      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);

      const dir = dx < 0 ? -1 : 1;

      if (dist > 5) {
        mx += (dx / dist) * speed;
        my += (dy / dist) * speed;

        male.style.left = mx + "px";
        male.style.top = my + "px";
        male.style.transform = `translate(-50%, -50%) scaleX(${dir})`;

        updateFrame();
      }
    }

    if (mode === "approach") {

      const fx = parseFloat(female.dataset.targetX);
      const fy = parseFloat(female.dataset.targetY);

      const dx = fx - mx;
      const dy = fy - my;
      const dist = Math.hypot(dx, dy);

      if (dist > 40) {
        mx += (dx / dist) * 1.5;
        my += (dy / dist) * 1.5;

        male.style.left = mx + "px";
        male.style.top = my + "px";

        // Face female
        male.style.transform =
          `translate(-50%, -50%) scaleX(${dx < 0 ? -1 : 1})`;

        female.style.transform =
          `translate(-50%, -50%) scaleX(${dx < 0 ? 1 : -1})`;

        updateFrame();
      } else {
        mode = "kiss";

        male.classList.add("kiss");
        female.classList.add("kiss");
        female.classList.add("blushing");

        setHeartEyes(male, true);
        setHeartEyes(female, true);

        celebrate(mx, my);

        setTimeout(() => {
          mode = "walkaway";
        }, 900);
      }
    }

    if (mode === "walkaway") {

      mx += 2;
      const fx = parseFloat(female.dataset.targetX) + 2;
      female.dataset.targetX = fx;

      male.style.left = mx + "px";
      female.style.left = fx + "px";

      // BOTH FACE RIGHT while walking away
      male.style.transform = `translate(-50%, -50%) scaleX(1)`;
      female.style.transform = `translate(-50%, -50%) scaleX(1)`;

      updateFrame();

      if (mx > window.innerWidth + 150) {
        mode = "normal";
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

});
