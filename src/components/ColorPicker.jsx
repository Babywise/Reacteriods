import React, { Component } from "react";
import { HexColorPicker } from "react-colorful";

function isDarkColor(color) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTrailColor:
        localStorage.getItem("selectedTrailColor") ?? "#ffffff",
      showColorPicker: false,
      rainbow: localStorage.getItem("rainbow") === "true" ? true : false,
    };
  }

  handleColorChange = (color) => {
    this.setState({ selectedTrailColor: color });
    if (this.props.onColorChange) {
      this.props.onColorChange(color);
    }
  };

  toggleColorPicker = () => {
    this.setState((prevState) => ({
      showColorPicker: !prevState.showColorPicker,
    }));
  };

  toggleRainbow = (isChecked) => {
    if (isChecked) {
      localStorage.setItem("rainbow", "true");
      this.setState({ rainbow: true });
    } else {
      localStorage.setItem("rainbow", "false");
      localStorage.setItem("selectedTrailColor", this.state.selectedTrailColor);
      this.setState({ rainbow: false });
    }
  };

  render() {
    const isDark = isDarkColor(this.state.selectedTrailColor) ? "invert" : "";
    return (
      <div className="flex flex-row items-center justify-between w-full">
        {/* Button to toggle the color picker */}
        <button
          className="border-4 border-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black flex-grow"
          style={{
            background: this.state.rainbow
              ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
              : this.state.selectedTrailColor,
            color: this.state.rainbow ? "black" : isDark ? "white" : "black",
            textShadow: this.state.rainbow
              ? "0px 0px 4px black"
              : isDark
              ? "0px 0px 4px white"
              : "0px 0px 4px black",
          }}
          onClick={this.toggleColorPicker}
        >
          {this.state.showColorPicker ? "Close" : "Choose Color"}
        </button>

        {/* Conditionally render the HexColorPicker */}
        {this.state.showColorPicker && (
          <div className="mt-5 flex-grow">
            <HexColorPicker
              color={
                localStorage.getItem("selectedTrailColor") ??
                this.state.selectedTrailColor
              }
              onChange={this.handleColorChange}
            />
          </div>
        )}

        {/* Conditionally render the rainbow color picker */}
        {!this.state.showColorPicker && (
          <div className="p-2 flex-grow flex items-center">
            <span className="text-white mr-2">Rainbow</span>
            <input
              type="checkbox"
              checked={this.state.rainbow}
              onChange={(e) => {
                this.toggleRainbow(e.target.checked);
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ColorPicker;
