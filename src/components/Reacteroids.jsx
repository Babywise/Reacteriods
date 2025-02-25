import React, { Component } from "react";
import Ship from "./Ship";
import Asteroid from "./Asteroid";
import { randomNumBetweenExcluding } from "../utils/functions";
import ColorPicker from "./ColorPicker";
import BulletSpeedPicker from "./BulletSpeedPicker";
import ImagePicker, { imagesList } from "./ImagePicker";

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  A: 65,
  S: 83,
  D: 68,
  W: 87,
  SPACE: 32,
  MDOWN: 0,
};

export class Reacteroids extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
      },
      asteroidCount: 4,
      currentScore: 0,
      topScore: localStorage["topscore"] || 0,
      inGame: false,
      menu: true,
      settings: false,
      frameCount: 0,
      mousePosition: {
        x: 0,
        y: 0,
        movedRecently: false,
      },
      preferences: {
        selectedTrailColor:
          localStorage.getItem("selectedTrailColor") || "#ffffff",
        rainbowTrail:
          localStorage.getItem("rainbowTrail") === "true" ? true : false,
        selectedShipColor:
          localStorage.getItem("selectedShipColor") || "#ffffff",
        rainbowShip:
          localStorage.getItem("rainbowShip") === "true" ? true : false,
        selectedShipBorderColor:
          localStorage.getItem("selectedShipBorderColor") || "#ffffff",
        rainbowShipBorder:
          localStorage.getItem("rainbowShipBorder") === "true" ? true : false,
        asteroidImage: localStorage.getItem("asteroidImage") || null,
        memeMode: localStorage.getItem("memeMode") === "true" ? false : true,
      },
    };
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
  }

  handleResize(value, e) {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
    });
  }

  handleKeys(value, e) {
    let keys = this.state.keys;

    // Handle keyboard mechanics
    if (e.type === "keydown" || e.type === "keyup") {
      if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
      if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
      if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
      if (e.keyCode === KEY.DOWN || e.keyCode === KEY.S) keys.down = value;
      if (e.keyCode === KEY.SPACE) keys.space = value;
    }

    // Handle mouse mechanics
    if (e.type === "mousedown" && e.button === KEY.MDOWN) keys.space = true;
    if (e.type === "mouseup" && e.button === KEY.MDOWN) keys.space = false;

    this.setState({
      keys: keys,
    });
  }

  handleMouseMove(e) {
    const mousePosition = {
      x: e.clientX,
      y: e.clientY,
      movedRecently: true,
    };
    this.setState({ mousePosition });
  }

  handleTrailColorChange = (color) => {
    localStorage.setItem("selectedTrailColor", color);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        selectedTrailColor: color,
      },
    }));
  };

  handleRainbowTrailToggle = (isChecked) => {
    localStorage.setItem("rainbowTrail", isChecked ? true : false);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        rainbowTrail: isChecked,
      },
    }));
  };

  handleShipColorChange = (color) => {
    localStorage.setItem("selectedShipColor", color);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        selectedShipColor: color,
      },
    }));
  };

  handleRainbowShipToggle = (isChecked) => {
    localStorage.setItem("rainbowShip", isChecked ? true : false);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        rainbowShip: isChecked,
      },
    }));
  };

  handleShipBorderColorChange = (color) => {
    localStorage.setItem("selectedShipBorderColor", color);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        selectedShipBorderColor: color,
      },
    }));
  };

  handleRainbowShipBorderToggle = (isChecked) => {
    localStorage.setItem("rainbowShipBorder", isChecked ? true : false);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        rainbowShipBorder: isChecked,
      },
    }));
  };

  handleImageChange = (image) => {
    const asteroidImage = image ? image : "";

    localStorage.setItem("asteroidImage", asteroidImage);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        asteroidImage: asteroidImage,
      },
    }));
    this.asteroids.forEach((asteroid) => {
      if (this.state.preferences.memeMode) {
        asteroid.image = new Image();
        asteroid.image.src =
          imagesList[Math.floor(Math.random() * imagesList.length)];
      } else if (image) {
        asteroid.image = new Image();
        asteroid.image.src = asteroidImage;
      } else {
        asteroid.image = null;
      }
    });
  };

  handleMemeModeToggle = (memeMode) => {
    localStorage.setItem("memeMode", memeMode ? false : true);
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        memeMode: memeMode,
      },
    }));
    this.asteroids.forEach((asteroid) => {
      if (memeMode) {
        asteroid.image = new Image();
        asteroid.image.src =
          imagesList[Math.floor(Math.random() * imagesList.length)];
      } else {
        asteroid.image = new Image();
        asteroid.image.src = this.state.preferences.asteroidImage;
      }
    });
  };

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeys.bind(this, false));
    window.addEventListener("keydown", this.handleKeys.bind(this, true));
    window.addEventListener("mousedown", this.handleKeys.bind(this, true));
    window.addEventListener("mouseup", this.handleKeys.bind(this, false));
    window.addEventListener("resize", this.handleResize.bind(this, false));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));

    const context = this.refs.canvas.getContext("2d");
    this.setState({ context: context });
    this.showMenu();
    requestAnimationFrame(() => {
      this.update();
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeys.bind(this, false));
    window.removeEventListener("keydown", this.handleKeys.bind(this, true));
    window.removeEventListener("mousedown", this.handleKeys.bind(this, true));
    window.removeEventListener("mouseup", this.handleKeys.bind(this, false));
    window.removeEventListener("resize", this.handleResize.bind(this, false));
    window.removeEventListener("mousemove", this.handleResize.bind(this));
  }

  update() {
    const context = this.state.context;
    const keys = this.state.keys;
    const ship = this.ship[0];

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = "#000";
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if (!this.asteroids.length) {
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count);
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWithShip(this.ship, this.asteroids);

    // Remove or render
    this.updateObjects(this.particles, "particles");
    this.updateObjects(this.asteroids, "asteroids");
    this.updateObjects(this.bullets, "bullets");
    this.updateObjects(this.ship, "ship");

    // Reset mouse moved recently
    if (this.state.mousePosition.movedRecently) {
      this.setState({
        mousePosition: { movedRecently: false },
      });
    }
    context.restore();

    // Next frame
    this.setState({
      frameCount: (this.state.frameCount + 1) % 10000,
    });

    requestAnimationFrame(() => {
      this.update();
    });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  showMenu() {
    this.setState({
      menu: true,
      inGame: false,
    });
  }

  startGame() {
    this.setState({
      inGame: true,
      menu: false,
      currentScore: 0,
    });

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2,
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this),
      strokeStyle: this.state.preferences.selectedShipBorderColor,
      fillStyle: this.state.preferences.selectedShipColor,
      rainbowTrail: this.state.preferences.rainbowTrail,
      rainbowShip: this.state.preferences.rainbowShip,
      rainbowShipBorder: this.state.preferences.rainbowShipBorder,
      fireRate: localStorage.getItem("fireRate"),
    });
    this.createObject(ship, "ship");

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount);
  }

  gameOver() {
    this.setState({
      inGame: false,
      gameOver: true,
    });

    // Replace top score
    if (this.state.currentScore > this.state.topScore) {
      this.setState({
        topScore: this.state.currentScore,
      });
      localStorage["topscore"] = this.state.currentScore;
    }
  }

  generateAsteroids(howMany) {
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(
            0,
            this.state.screen.width,
            (ship?.position?.x ?? 0) - 60,
            (ship?.position?.x ?? 0) + 60
          ),
          y: randomNumBetweenExcluding(
            0,
            this.state.screen.height,
            (ship?.position?.y ?? 0) - 60,
            (ship?.position?.y ?? 0) + 60
          ),
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this),
        imageSrc: this.state.preferences.memeMode
          ? imagesList[Math.floor(Math.random() * imagesList.length)]
          : this.state.preferences.asteroidImage,
        imageSrcOptions: imagesList,
        memeMode: this.state.preferences.memeMode,
      });
      this.createObject(asteroid, "asteroids");
    }
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollisionsWithShip(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy();
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  render() {
    let endgame;
    let menu;
    let message;
    let settings;

    if (this.state.currentScore <= 0) {
      message = "0 points... So sad.";
    } else if (this.state.currentScore >= this.state.topScore) {
      message = "Top score with " + this.state.currentScore + " points. Woo!";
    } else {
      message = this.state.currentScore + " Points though :)";
    }

    if (!this.state.inGame) {
      if (this.state.menu) {
        menu = (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-16 z-1 text-center">
            <p>Reacteroids</p>
            <p>Shoot the asteriods!</p>
            <p>Don't get hit!</p>

            <button
              className="border-4 border-white bg-transparent text-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black"
              onClick={() => this.setState({ menu: false, settings: true })}
            >
              Settings
            </button>
            <button
              className="border-4 border-white bg-transparent text-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black"
              onClick={this.startGame.bind(this)}
            >
              Start
            </button>
          </div>
        );
      } else if (this.state.settings) {
        settings = (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-16 z-1 text-center">
            <p>Settings</p>
            <p>Customize your game</p>
            <div className="flex">
              <div>
                <h3>Trail Color Picker</h3>
                <ColorPicker
                  selectedColor={this.state.preferences.selectedTrailColor}
                  rainbow={this.state.preferences.rainbowTrail}
                  onColorChange={this.handleTrailColorChange}
                  onToggleRainbow={this.handleRainbowTrailToggle}
                />
              </div>
              <div>
                <h3>Ship Color Picker</h3>
                <ColorPicker
                  selectedColor={this.state.preferences.selectedShipColor}
                  rainbow={this.state.preferences.rainbowShip}
                  onColorChange={this.handleShipColorChange}
                  onToggleRainbow={this.handleRainbowShipToggle}
                />
              </div>

              <div>
                <h3>Ship Border Color Picker</h3>
                <ColorPicker
                  selectedColor={this.state.preferences.selectedShipBorderColor}
                  rainbow={this.state.preferences.rainbowShipBorder}
                  onColorChange={this.handleShipBorderColorChange}
                  onToggleRainbow={this.handleRainbowShipBorderToggle}
                />
              </div>
            </div>
            <div>
              <ImagePicker
                onSelectImage={this.handleImageChange}
                defaultSelectedImage={this.state.preferences.asteroidImage}
                onToggleMemeMode={this.handleMemeModeToggle}
                defaultMemeMode={this.state.preferences.memeMode}
              />
              <BulletSpeedPicker
                onFireRateChange={(newRate) =>
                  localStorage.setItem("fireRate", newRate)
                }
              />
            </div>
            <button
              className="border-4 border-white bg-transparent text-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black"
              onClick={() => this.setState({ menu: true, settings: false })}
            >
              Back
            </button>
          </div>
        );
      } else {
        endgame = (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-16 z-1 text-center">
            <p>Game over, man!</p>
            <p>{message}</p>
            <button
              className="border-4 border-white bg-transparent text-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black"
              onClick={() => this.setState({ menu: true })}
            >
              Menu
            </button>
            <button
              className="border-4 border-white bg-transparent text-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black"
              onClick={this.startGame.bind(this)}
            >
              try again?
            </button>
          </div>
        );
      }
    }

    return (
      <div>
        {endgame ?? menu ?? settings ?? ""}
        <span className="block absolute top-15 z-1 text-sm left-20">
          Score: {this.state.currentScore}
        </span>
        <span className="block absolute top-15 z-1 text-sm right-20">
          Top Score: {this.state.topScore}
        </span>
        <span className="block absolute top-15 left-1/2 -translate-x-1/2 translate-y-0 z-1 text-sm text-center leading-normal">
          Use [A][S][W][D] or [←][↑][↓][→] to MOVE
          <br />
          Use [SPACE] to SHOOT
        </span>
        <canvas
          ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}
