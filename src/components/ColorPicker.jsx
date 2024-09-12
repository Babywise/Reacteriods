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

export default class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showColorPicker: false,
    };
  }

  handleColorChange = (color) => {
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
    if (this.props.onToggleRainbow) {
      this.props.onToggleRainbow(isChecked);
    }
  };

  render() {
    const { selectedColor, rainbow } = this.props;
    const isDark = isDarkColor(selectedColor) ? "invert" : "";
    return (
      <div className="flex flex-row items-center justify-between w-full">
        {/* Button to toggle the color picker */}
        <button
          className="border-4 border-white text-m px-10 py-5 m-5 cursor-pointer hover:bg-white hover:text-black flex-grow"
          style={{
            background: rainbow
              ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
              : selectedColor,
            color: rainbow ? "black" : isDark ? "white" : "black",
            textShadow: rainbow
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
              color={this.props.selectedColor}
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
              checked={rainbow}
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
