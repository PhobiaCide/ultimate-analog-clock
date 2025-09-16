 document.addEventListener("DOMContentLoaded", () => {
    class Hand {
      constructor(id) {
        this.id = id;
        this.rotation = 0;
        this.el = document.getElementById(id);
      }

      move(step) {
        if (step > 0) {
          this.rotation = (this.rotation + step) % 360;
          this.el.style.transform = `rotate(${this.rotation}deg)`;
        }
      }

      syncTo(rotation) {
        this.rotation = rotation % 360;
        this.el.style.transform = `rotate(${this.rotation}deg)`;
      }
    }

    class Clock {
      constructor() {
        this.secondHand = new Hand("second-hand");
        this.minuteHand = new Hand("minute-hand");
        this.hourHand   = new Hand("hour-hand");

        this.lastTime = performance.now();
        this.lastSyncTime = Date.now();
        this.syncInterval = 15000; // ms

        this.drawMarkers();
        this.syncHands();
        requestAnimationFrame(this.tick.bind(this));
      }

      drawMarkers() {
        const hourGroup = document.getElementById("hour-markers");
        const minuteGroup = document.getElementById("minute-markers");
        const numeralGroup = document.getElementById("clock-numerals");

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
          hourGroup.appendChild(line);
        }

        for (let i = 0; i < 60; i++) {
          if (i % 5 === 0) continue;
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
          minuteGroup.appendChild(line);
        }

        const cx = 150, cy = 150, r = 125;
        for (let n = 1; n <= 12; n++) {
          const angle = ((n - 3 + 12) % 12) * 30 * (Math.PI / 180);
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle) + 7;
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", x);
          text.setAttribute("y", y);
          text.classList.add("clock-text");
          text.textContent = n;
          numeralGroup.appendChild(text);
        }
      }

      syncHands() {
        const now = new Date();
        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();
        const ms = now.getMilliseconds();

        const secondRotation = (s + ms/1000) * 6;
        const minuteRotation = (m * 6) + (s + ms/1000) * 0.1;
        const hourRotation   = (h * 30) + (m * 0.5) + (s + ms/1000) * (0.5/60);

        this.secondHand.syncTo(secondRotation);
        this.minuteHand.syncTo(minuteRotation);
        this.hourHand.syncTo(hourRotation);
      }

      tick(now) {
        const delta = (now - this.lastTime) / 1000; // seconds since last frame
        this.lastTime = now;

        // Gear ratios
        const secStep = 6 * delta;        // 360° / 60s
        const minStep = 0.1 * delta;      // 360° / 3600s
        const hrStep  = (1/120) * delta;  // 360° / 43200s

        this.secondHand.move(secStep);
        this.minuteHand.move(minStep);
        this.hourHand.move(hrStep);

        if (Date.now() - this.lastSyncTime > this.syncInterval) {
          this.syncHands();
          this.lastSyncTime = Date.now();
        }

        requestAnimationFrame(this.tick.bind(this));
      }
    }

    new Clock();
  });
