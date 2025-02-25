import Particle from "./Particle";
import { asteroidVertices, randomNumBetween } from "../utils/functions";

export default class Asteroid {
  constructor(args) {
    this.position = args.position;
    this.velocity = {
      x: randomNumBetween(-1.5, 0.1),
      y: randomNumBetween(-1.5, 0.1),
    };
    this.rotation = 0;
    this.rotationSpeed = randomNumBetween(-1, 1);
    this.radius = args.size;
    this.score = (80 / this.radius) * 5;
    this.create = args.create;
    this.addScore = args.addScore;
    this.vertices = asteroidVertices(8, args.size);
    if (args.imageSrc) {
      this.image = new Image();
      this.image.src = args.imageSrc;
      this.imageSrcOptions = args.imageSrcOptions;
      this.memeMode = args.memeMode;
    } else {
      this.image = null;
    }
  }

  destroy() {
    this.delete = true;
    this.addScore(this.score);

    // Explode
    for (let i = 0; i < this.radius; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 3),
        position: {
          x:
            this.position.x +
            randomNumBetween(-this.radius / 4, this.radius / 4),
          y:
            this.position.y +
            randomNumBetween(-this.radius / 4, this.radius / 4),
        },
        velocity: {
          x: randomNumBetween(-1.5, 0.1),
          y: randomNumBetween(-1.5, 0.1),
        },
      });
      this.create(particle, "particles");
    }

    // Break into smaller asteroids
    if (this.radius > 10) {
      for (let i = 0; i < 2; i++) {
        let asteroid = new Asteroid({
          size: this.radius / 2,
          position: {
            x: randomNumBetween(-10, 20) + this.position.x,
            y: randomNumBetween(-10, 20) + this.position.y,
          },
          create: this.create.bind(this),
          addScore: this.addScore.bind(this),
          imageSrc: this.memeMode
            ? this.imageSrcOptions[
                Math.floor(Math.random() * this.imageSrcOptions.length)
              ]
            : this.image?.src,
        });
        this.create(asteroid, "asteroids");
      }
    }
  }

  render(state) {
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if (this.position.x > state.screen.width + this.radius)
      this.position.x = -this.radius;
    else if (this.position.x < -this.radius)
      this.position.x = state.screen.width + this.radius;
    if (this.position.y > state.screen.height + this.radius)
      this.position.y = -this.radius;
    else if (this.position.y < -this.radius)
      this.position.y = state.screen.height + this.radius;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate((this.rotation * Math.PI) / 180);

    if (!this.image) {
      context.strokeStyle = "#FFF";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, -this.radius);
      for (let i = 1; i < this.vertices.length; i++) {
        context.lineTo(this.vertices[i].x, this.vertices[i].y);
      }
      context.closePath();
      context.stroke();
    } else {
      // If an image is provided, draw the image inside the asteroid shape
      context.beginPath();
      context.moveTo(0, -this.radius);
      for (let i = 1; i < this.vertices.length; i++) {
        context.lineTo(this.vertices[i].x, this.vertices[i].y);
      }
      context.closePath();
      context.clip();

      context.drawImage(
        this.image,
        -this.radius, // x
        -this.radius, // y
        this.radius * 2, // width
        this.radius * 2 // height
      );
    }

    context.restore();
  }
}
