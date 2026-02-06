document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const penguin = document.getElementById("male-penguin");
  const cursor = document.getElementById("heart-cursor");

  let penguinX = window.innerWidth / 2;
  let penguinY = window.innerHeight / 2;

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  const speed = 0.03;
  let chasing = false;

  // Track cursor position
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // On button click, show penguin and start chase
  enterBtn.addEventListener("click", () => {

    penguin.style.left = penguinX + "px";
    penguin.style.top = penguinY + "px";
    penguin.classList.add("show");

    chasing = true;
    animatePenguin();
  });

  
function animatePenguin() {

  if (chasing) {

    // Smooth chase movement
    penguinX += (cursorX - penguinX) * speed;
    penguinY += (cursorY - penguinY) * speed;

    penguin.style.left = penguinX + "px";
    penguin.style.top = penguinY + "px";

    // Distance from cursor
    const distance = Math.hypot(cursorX - penguinX, cursorY - penguinY);

    // Direction flip
    const direction = cursorX < penguinX ? -1 : 1;

    penguin.style.transform =
      `translate(-50%, -50%) scaleX(${direction})`;

    // Walking animation toggle
    if (distance > 5) {
      penguin.classList.add("walk");
    } else {
      penguin.classList.remove("walk");
    }
  }

  requestAnimationFrame(animatePenguin);
}
});
