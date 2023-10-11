const hueBar = document.getElementById("color-bar-hue");
const brightnessBar = document.getElementById("color-bar-brightness");
const hueIndicator = document.getElementById("hue-indicator");
const brightnessIndicator = document.getElementById("brightness-indicator");
const selectedColor = document.getElementById("selected-color");
const copy = document.getElementById("copy");
const colorField = document.getElementById("color");
let lastHue = 0; 
let lastBrightness = 0; 
let hueMouseDown = false; 
let brightnessMouseDown = false;

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function render() {
  copy.textContent = "Copy";
  document.getElementById("result-block").style.display = "block";
}

function updateHue(event, indicator) {
  if (!hueMouseDown) return; // Only update if mouse is down

  const barRect = hueBar.getBoundingClientRect();
  const xPos = event.clientX - barRect.left;
  const yPos = event.clientY - barRect.top;
  const barWidth = barRect.width;
  const hueValue = (xPos / barWidth) * 360; // Hue value (0-360)

  const indicatorSize = indicator.offsetWidth;
  indicator.style.left = `${xPos - indicatorSize / 2}px`;
  indicator.style.top = `${yPos - indicatorSize / 2}px`;

  lastHue = hueValue;

  const [r, g, b] = hslToRgb(lastHue, 100, lastBrightness);
  const hexColor = rgbToHex(r, g, b);

  selectedColor.style.backgroundColor = hexColor;
  colorField.value = hexColor;
  render()
}

function updateBrightness(event, indicator) {
  if (!brightnessMouseDown) return; // Only update if mouse is down

  const barRect = brightnessBar.getBoundingClientRect();
  const xPos = event.clientX - barRect.left;
  const barWidth = barRect.width;
  const brightnessValue = (xPos / barWidth) * 100; // Brightness value (0-100)

  const indicatorSize = indicator.offsetWidth;
  indicator.style.left = `${xPos - indicatorSize / 2}px`;

  lastBrightness = brightnessValue;

  const [r, g, b] = hslToRgb(lastHue, 100, lastBrightness);
  const hexColor = rgbToHex(r, g, b);

  selectedColor.style.backgroundColor = hexColor;
  colorField.value = hexColor;
  render()
}

hueBar.addEventListener("mousedown", (event) => {
  hueMouseDown = true;
  updateHue(event, hueIndicator);

  hueBar.addEventListener("mousemove", (event) =>
    updateHue(event, hueIndicator)
  );

  document.addEventListener("mouseup", () => {
    hueMouseDown = false;
    hueBar.removeEventListener("mousemove", (event) =>
      updateHue(event, hueIndicator)
    );
  });
});

brightnessBar.addEventListener("mousedown", (event) => {
  brightnessMouseDown = true;
  updateBrightness(event, brightnessIndicator);

  brightnessBar.addEventListener("mousemove", (event) =>
    updateBrightness(event, brightnessIndicator)
  );

  document.addEventListener("mouseup", () => {
    brightnessMouseDown = false;
    brightnessBar.removeEventListener("mousemove", (event) =>
      updateBrightness(event, brightnessIndicator)
    );
  });
});

function copyToClipboard() {
  const color = colorField.value;
  if (!color) {
    lengthField.focus();
    alert("Pick a color");
    return;
  }
  navigator.clipboard.writeText(color);
  copy.textContent = "Copied!";
}

copy.addEventListener("click", copyToClipboard);
