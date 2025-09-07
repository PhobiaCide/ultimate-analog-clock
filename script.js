document.addEventListener("DOMContentLoaded", () => {
  class Clock {
    constructor() {
      this.lastSecondRotation = 0;
      this.lastMinuteRotation = 0;
      this.lastHourRotation = 0;
      this.lastSyncTime = Date.now();
      this.lastTickTime = Date.now();
      this.syncInterval = 15000; // Sync every 15 seconds
      this.startClock();
    }

    drawHourMarkers() {
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

    drawMinuteMarkers() {
      const markers = document.getElementById("minute-markers");
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue; // Skip hour markers
        const angle = i * 6 * (Math.PI / 180);
        const x1 = 150 + Math.cos(angle) * 110;
        const y1 = 150 + Math.sin(angle) * 110;
        const x2 = 150 + Math.cos(angle) * 105;
        const y2 = 150 + Math.sin(angle) * 105;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.classList.add("minute-marker");
        markers.appendChild(line);
      }
    }

    drawClockNumerals() {
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

    calculateHandPositions(date) {
      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return [
        hours * 30 + minutes / 2,
        minutes * 6 + seconds / 10,
        seconds * 6
      ];
    }

    applyRotation(id, rotation) {
      document.getElementById(id).style.transform = `rotate(${rotation}deg)`;
    }

    setInitialClockPosition() {
      const now = new Date();
      [this.lastHourRotation, this.lastMinuteRotation, this.lastSecondRotation] = this.calculateHandPositions(now);
      this.applyRotation("hour-hand", this.lastHourRotation);
      this.applyRotation("minute-hand", this.lastMinuteRotation);
      this.applyRotation("second-hand", this.lastSecondRotation);
    }

    enforceStrictForwardRotation(lastRotation, targetRotation) {
      let delta = (targetRotation - lastRotation + 360) % 360;
      if (delta > 180) delta -= 360;
      return lastRotation + Math.max(0, delta);
    }

    enforceBoundedCorrection(lastRotation, targetRotation) {
  let delta = (targetRotation - lastRotation + 360) % 360;

  // Prevent reverse sweep: always move forward
  if (delta === 0) return lastRotation;

  // Ensure only one movement per tick
  let now = Date.now();
  if (now - this.lastTickTime < 1000) return lastRotation;

  // Standard second-hand step
  let normalStep = 6;

  // Correction limit: allow slight variation around 6° per second
  let minStep = 5.5;
  let maxStep = 6.5;

  // Correction step (spread correction gradually)
  let correctionStep = normalStep + (delta / (this.syncInterval / 1000));

  // Clamp within bounds
  correctionStep = Math.min(Math.max(correctionStep, minStep), maxStep);

  this.lastTickTime = now;
  return lastRotation + correctionStep;
}

    updateClock() {
      const now = new Date();
      let [targetHourRotation, targetMinuteRotation, targetSecondRotation] = this.calculateHandPositions(now);

      this.lastHourRotation = this.enforceStrictForwardRotation(this.lastHourRotation, targetHourRotation);
      this.lastMinuteRotation = this.enforceStrictForwardRotation(this.lastMinuteRotation, targetMinuteRotation);
      this.lastSecondRotation = this.enforceBoundedCorrection(this.lastSecondRotation, targetSecondRotation);

      this.applyRotation("hour-hand", this.lastHourRotation);
      this.applyRotation("minute-hand", this.lastMinuteRotation);
      this.applyRotation("second-hand", this.lastSecondRotation);

      if (Date.now() - this.lastSyncTime > this.syncInterval) {
        this.setInitialClockPosition();
        this.lastSyncTime = Date.now();
      }

      setTimeout(() => this.updateClock(), 1000);
    }

    startClock() {
      this.drawHourMarkers();
      this.drawMinuteMarkers();
      this.drawClockNumerals();
      this.setInitialClockPosition();
      this.updateClock();
    }
  }

  new Clock();

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

    updateUI() {
      document.body.setAttribute("data-bs-theme", this.mode);
      this.button.value = this.mode === "light" ? "Dark Mode" : "Light Mode";
      this.stylesheet.href = `https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/css/topcoat-mobile-${this.mode}.min.css`;
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

  new ModeHandler();
});
