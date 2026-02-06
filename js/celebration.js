document.addEventListener("DOMContentLoaded", () => {

  const celebrationLayer = document.getElementById("celebration-layer");

  if (!celebrationLayer) return;

  function triggerCelebration(x, y) {

    // 🌸 Soft pink flash
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100%";
    flash.style.height = "100%";
    flash.style.background = "rgba(255,150,200,0.25)";
    flash.style.pointerEvents = "none";
    flash.style.zIndex = "15";
    flash.style.animation = "fadeFlash 0.6s ease forwards";

    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);


    // 💗 Floating Hearts
    for (let i = 0; i < 18; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-particle";
      heart.innerHTML = "💗";
      heart.style.left = (x + Math.random() * 80 - 40) + "px";
      heart.style.top = (y + Math.random() * 40 - 20) + "px";
      celebrationLayer.appendChild(heart);

      setTimeout(() => heart.remove(), 1500);
    }


    // ✨ Shooting Stars
    for (let i = 0; i < 10; i++) {
      const star = document.createElement("div");
      star.className = "star-particle";

      star.style.left = x + "px";
      star.style.top = y + "px";

      // random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = 200;

      star.style.setProperty("--dx", Math.cos(angle) * distance + "px");
      star.style.setProperty("--dy", Math.sin(angle) * distance + "px");

      celebrationLayer.appendChild(star);
      setTimeout(() => star.remove(), 1000);
    }
  }

  // expose globally
  window.triggerCelebration = triggerCelebration;

});
