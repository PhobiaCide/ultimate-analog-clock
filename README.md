# ⏳ Immersive Analog Clock Simulation

An ultra-precise, smooth, and immersive **SVG-based analog clock simulation** that dynamically adjusts the second-hand movement for real-time error correction. Ensures that the hands never move backward while maintaining a seamless and realistic experience.

## 🚀 Features

- 📏 **Accurate Second Hand Adjustments** – The clock automatically **corrects time discrepancies** by subtly adjusting speed without abrupt jumps.
- 🎨 **Modern SVG-Based Design** – Fully **responsive** and **resolution-independent**, ensuring crisp visuals on any screen.
- 🌗 **Dark/Light Mode Support** – **Auto-adapts** to system preferences for an optimal viewing experience.
- ⏱ **Smooth Animations** – Clock hands move **fluidly** to simulate real-world physics.
- 🔧 **Customizable** – Easily tweak styles via **CSS variables** for colors, stroke widths, and clock face design.

## 🛠 Installation & Usage

### Running Locally
You'll need **live-server** for quick development.

#### Using npm:
```sh
npm install
npm start
```

#### Without npm:
```sh
npx live-server
```

#### Alternative (Python HTTP Server)
If you prefer using Python:
```sh
python -m http.server 8000
```
Then, open `http://localhost:8000/` in your browser.

## 🎨 Customization

Modify `style.css` to customize:
- **Clock face colors**
- **Hand stroke widths**
- **Animation speeds**
- **Dark mode colors**  

Look for the **CSS variables** inside `:root {}` in the `style.css` file.

## 🏗️ Technologies Used

- **JavaScript (ES6+)** – Handles dynamic clock logic & animations.
- **SVG** – Creates fully scalable vector-based clock components.
- **CSS3** – Styles and animations.
- **Halfmoon CSS Framework** – Provides layout utilities.
- **Topcoat CSS Framework** – Enhances UI component styling.

## 🔮 Future Improvements

- 🕰️ **Implement easing functions** for more natural second-hand movements.
- 🔊 **Add a ticking sound effect** to enhance immersion.
- 🌍 **Support multiple time zones & world clocks.**
- 🎛 **Introduce user-configurable settings** for customizing clock appearance & behavior.

## 📜 License

**MIT License** – Free to use, modify, and share.
