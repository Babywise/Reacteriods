export default class Particle {
  constructor(args) {
    this.position = args.position;
    this.velocity = args.velocity;
    this.radius = args.size;
    this.lifeSpan = args.lifeSpan;
    this.inertia = 0.98;
    this.color = args.color || "#ffffff";
    this.rainbow = args.rainbow || false;

    // Variables for rainbow mode
    this.currentColor = this.color;
    this.frameCounter = 0;
  }

  destroy() {
    this.delete = true;
  }

  render(state) {
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Shrink
    this.radius -= 0.2;
    if (this.radius < 0.1) {
      this.radius = 0.1;
    }
    if (this.lifeSpan-- < 0) {
      this.destroy();
    }

    // Fade out
    const alpha = Math.max(0, 1 - (100 - this.lifeSpan) / 100);

    // Set Color
    // Variables to control the sine wave for each color component
    // Color changing speed
    const redFrequency = 0.03;
    const greenFrequency = 0.05;
    const blueFrequency = 0.07;

    // Color offset (0 -> 2pi / 0 -> 6.28 radians)
    const redPhaseShift = 0;
    const greenPhaseShift = 3;
    const bluePhaseShift = 6;

    // Color Range
    const amplitude = 100; // 0-255 / 2
    const offset = 120; // 0-255 / 2

    if (this.rainbow) {
      let red = Math.floor(
        (Math.sin(state.frameCount * redFrequency + redPhaseShift) + 1) *
          amplitude +
          offset
      );
      let green = Math.floor(
        (Math.sin(state.frameCount * greenFrequency + greenPhaseShift) + 1) *
          amplitude +
          offset
      );
      let blue = Math.floor(
        (Math.sin(state.frameCount * blueFrequency + bluePhaseShift) + 1) *
          amplitude +
          offset
      );
      // Ensure RBG values are between 0 and 255
      red = Math.max(0, Math.min(255, red));
      green = Math.max(0, Math.min(255, green));
      blue = Math.max(0, Math.min(255, blue));

      // Convert RGB values to hex and ensure they are two characters long
      const redHex = red.toString(16).padStart(2, "0");
      const greenHex = green.toString(16).padStart(2, "0");
      const blueHex = blue.toString(16).padStart(2, "0");

      // Combine into a hex color string
      this.currentColor = `#${redHex}${greenHex}${blueHex}`;
    } else {
      this.currentColor = this.color;
    }

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.fillStyle = this.currentColor;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }
}
