document.querySelectorAll(".video-card video").forEach(video => {

  video.parentElement.addEventListener("mouseenter", () => {
    video.play();
  });

  video.parentElement.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

});
