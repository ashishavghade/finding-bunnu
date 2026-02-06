document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.getElementById("enter-btn");
  const penguin = document.getElementById("male-penguin");

  enterBtn.addEventListener("click", () => {

    // Appear in center first
    penguin.style.left = window.innerWidth / 2 + "px";
    penguin.style.top = window.innerHeight / 2 + "px";

    penguin.classList.add("show");

  });

});
