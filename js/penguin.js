#female-penguin {
  position: absolute;
  width: 80px;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

#female-penguin.show {
  opacity: 1;
}

.kiss {
  animation: kissBounce 0.4s ease-in-out 3;
}

@keyframes kissBounce {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

#female-penguin .blush {
  opacity: 0;
  transition: opacity 0.3s ease;
}

#female-penguin.blushing .blush {
  opacity: 1;
}
