document.addEventListener("DOMContentLoaded", () => {
    let lastSecondRotation = 0;
    let lastMinuteRotation = 0;
    let lastHourRotation = 0;
    let lastTimestamp = performance.now();
  
    function drawHourMarkers() {
      const markers = document.getElementById("hour-markers");
      for (let i = 0; i < 12; i++) {
        const angle = i * 30 * (Math.PI / 180);
        const x1 = 150 + Math.cos(angle) * 110;
        const y1 = 150 + Math.sin(angle) * 110;
        const x2 = 150 + Math.cos(angle) * 100;
        const y2 = 150 + Math.sin(angle) * 100;
  
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.classList.add("hour-marker");
        markers.appendChild(line);
      }
    }
  
    function drawClockNumerals() {
      const numerals = document.getElementById("clock-numerals");
      const cx = 150, cy = 150, r = 125;
      for (let n = 1; n <= 12; n++) {
        const angle = ((n - 3 + 12) % 12) * 30;
        const radians = angle * (Math.PI / 180);
        const x = cx + r * Math.cos(radians);
        const y = cy + r * Math.sin(radians) + 7;
  
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.classList.add("clock-text");
        text.textContent = n;
        numerals.appendChild(text);
      }
    }
  
    function calculateHandPositions(date) {
      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
  
      return [
        hours * 30 + minutes / 2,
        minutes * 6 + seconds / 10,
        seconds * 6 + milliseconds * 0.006
      ];
    }
  
    function applyRotation(id, rotation) {
      document.getElementById(id).style.transform = `rotate(${rotation}deg)`;
    }
  
    function setInitialClockPosition() {
      const now = new Date();
      [lastHourRotation, lastMinuteRotation, lastSecondRotation] = calculateHandPositions(now);
      applyRotation("hour-hand", lastHourRotation);
      applyRotation("minute-hand", lastMinuteRotation);
      applyRotation("second-hand", lastSecondRotation);
    }
  
    function enforceForwardRotation(lastRotation, targetRotation) {
      let delta = (targetRotation - lastRotation + 360) % 360;
      if (delta > 180) delta -= 360;
      return lastRotation + Math.max(0, delta); // Ensures forward movement only
    }
  
    function smoothlyCorrectSecondHand(lastRotation, targetRotation, deltaTime) {
      let delta = (targetRotation - lastRotation + 360) % 360;
      if (delta > 180) delta -= 360;
  
      let step = Math.abs(delta) < 6 ? delta : (delta / 60) * deltaTime * 60;
      return lastRotation + Math.max(0, step); // No backward movement
    }
  
    function updateClock() {
      const now = new Date();
      let [targetHourRotation, targetMinuteRotation, targetSecondRotation] = calculateHandPositions(now);
      const currentTimestamp = performance.now();
      const deltaTime = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;
  
      lastHourRotation = enforceForwardRotation(lastHourRotation, targetHourRotation);
      lastMinuteRotation = enforceForwardRotation(lastMinuteRotation, targetMinuteRotation);
      lastSecondRotation = smoothlyCorrectSecondHand(lastSecondRotation, targetSecondRotation, deltaTime);
  
      applyRotation("hour-hand", lastHourRotation);
      applyRotation("minute-hand", lastMinuteRotation);
      applyRotation("second-hand", lastSecondRotation);
  
      requestAnimationFrame(updateClock);
    }
  
    function startClock() {
      drawHourMarkers();
      drawClockNumerals();
      setInitialClockPosition();
      updateClock();
    }
  
    startClock();
  
    /** Dark/Light Mode Handling **/
    class ModeHandler {
      constructor() {
        this.mode = ModeHandler.getPreferredMode();
        this.button = document.getElementById("dark-light-toggle");
        this.stylesheet = document.getElementById("topcoat");
  
        if (!this.button || !this.stylesheet) return;
  
        this.button.addEventListener("click", () => this.toggleMode());
        this.updateUI();
        ModeHandler.observeSystemThemeChange(this);
      }
  
      static getPreferredMode() {
        return localStorage.getItem("theme") ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      }
  
      static saveMode(mode) {
        localStorage.setItem("theme", mode);
      }
  
      updateMode() {
        document.body.setAttribute("data-bs-theme", this.mode);
      }
  
      updateButton() {
        this.button.value = this.mode === "light" ? "Dark Mode" : "Light Mode";
      }
  
      updateStylesheet() {
        this.stylesheet.href = `https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/css/topcoat-mobile-${this.mode}.min.css`;
      }
  
      updateUI() {
        this.updateMode();
        this.updateButton();
        this.updateStylesheet();
      }
  
      toggleMode() {
        this.mode = this.mode === "light" ? "dark" : "light";
        ModeHandler.saveMode(this.mode);
        this.updateUI();
      }
  
      static observeSystemThemeChange(instance) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", (event) => {
          if (!localStorage.getItem("theme")) {
            instance.mode = event.matches ? "dark" : "light";
            instance.updateUI();
          }
        });
      }
    }
  
    // Initialize mode handling
    new ModeHandler();
  });
  