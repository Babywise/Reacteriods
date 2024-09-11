import Bullet from "./Bullet";
import Particle from "./Particle";
import { rotatePoint, randomNumBetween } from "../utils/functions";

export default class Ship {
  constructor(args) {
    this.position = args.position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rotation = 0;
    this.rotationSpeed = 4;
    this.speed = 0.08;
    this.inertia = 0.99;
    this.radius = 20;
    this.lastShot = 0;
    this.create = args.create;
    this.onDie = args.onDie;
  }

  destroy() {
    this.delete = true;
    this.onDie();

    // Explode
    for (let i = 0; i < 60; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 4),
        position: {
          x:
            this.position.x +
            randomNumBetween(-this.radius / 4, this.radius / 4),
          y:
            this.position.y +
            randomNumBetween(-this.radius / 4, this.radius / 4),
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5),
        },
      });
      this.create(particle, "particles");
    }
  }

  rotate(dir, mousePosition) {
    const dx = mousePosition?.x - this.position.x;
    const dy = mousePosition?.y - this.position.y;
    switch (dir) {
      case "LEFT":
        this.rotation -= this.rotationSpeed;
        break;
      case "RIGHT":
        this.rotation += this.rotationSpeed;
        break;
      case "MOUSE":
        this.rotation = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        break;
      default:
        break;
    }
  }

  accelerate(val) {
    this.velocity.x -=
      Math.sin((-this.rotation * Math.PI) / 180) * this.speed * val;
    this.velocity.y -=
      Math.cos((-this.rotation * Math.PI) / 180) * this.speed * val;

    // Thruster particles
    let posDelta = rotatePoint(
      { x: 0, y: -10 },
      { x: 0, y: 0 },
      ((this.rotation - 180) * Math.PI) / 180
    );
    const particle = new Particle({
      lifeSpan: randomNumBetween(20, 40),
      size: randomNumBetween(1, 3),
      position: {
        x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
        y: this.position.y + posDelta.y + randomNumBetween(-2, 2),
      },
      velocity: {
        x: posDelta.x / randomNumBetween(3, 5),
        y: posDelta.y / randomNumBetween(3, 5),
      },
    });
    this.create(particle, "particles");
  }

  render(state) {
    // Controls
    if (state.keys.up) {
      this.accelerate(1);
    }
    if (state.keys.left) {
      this.rotate("LEFT");
    }
    if (state.keys.right) {
      this.rotate("RIGHT");
    }
    if (state.keys.down) {
      this.accelerate(-0.5);
    }
    if (state.keys.space && Date.now() - this.lastShot > 300) {
      const bullet = new Bullet({ ship: this });
      this.create(bullet, "bullets");
      this.lastShot = Date.now();
    }
    if (state.mousePosition.movedRecently) {
      this.rotate("MOUSE", state.mousePosition);
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Screen edges
    if (this.position.x > state.screen.width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = state.screen.width;
    if (this.position.y > state.screen.height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = state.screen.height;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#000000";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -15);
    context.lineTo(10, 10);
    context.lineTo(5, 7);
    context.lineTo(-5, 7);
    context.lineTo(-10, 10);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}
