document.addEventListener("DOMContentLoaded", () => {

  const yesBtn = document.getElementById("yes-btn");
  const male = document.getElementById("male-penguin");
  const female = document.getElementById("female-penguin");
  const stage = document.getElementById("content");

  let state = "idle";
  let timer = 0;

  let mx = parseFloat(male.style.left) || window.innerWidth / 2;
  let my = parseFloat(male.style.top) || window.innerHeight / 2;

  let fx = 0;
  let fy = window.innerHeight / 2;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

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

  function animate() {

    if (state === "approach") {

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

      if (Math.abs(maleTarget - mx) < 2) {
        state = "pause";
        timer = 0;
      }
    }

    else if (state === "pause") {

      timer++;
      if (timer > 120) {
        state = "kiss";
        timer = 0;
        female.classList.add("blushing");
      }
    }

    else if (state === "kiss") {

      const scale = 1 + (timer / 360) * 0.1;
      stage.style.transform = `scale(${scale})`;

      timer++;
      if (timer > 360) {
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
    }

    requestAnimationFrame(animate);
  }

  animate();
});
