document.addEventListener("DOMContentLoaded", () => {

  const audioPlayer = new Audio();
  audioPlayer.volume = 0.5;

  document.querySelectorAll("[data-audio]").forEach(element => {

    element.addEventListener("mouseenter", () => {

      const file = element.getAttribute("data-audio");

      if (!file) return;

      audioPlayer.src = "assets/audio/" + file;
      audioPlayer.currentTime = 0;
      audioPlayer.play().catch(() => {});
    });

  });

});
