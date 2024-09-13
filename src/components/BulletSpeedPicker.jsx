import React, { Component } from "react";

export default class BulletSpeedPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fireRate: localStorage.getItem("fireRate")
        ? parseInt(localStorage.getItem("fireRate"))
        : 300,
    };
  }
  handleSliderChange = (e) => {
    this.setState({ fireRate: e.target.value });
    this.props.onFireRateChange(e.target.value);
    localStorage.setItem("fireRate", e.target.value);
  };

  render() {
    return (
      <div className="py-5">
        <label className="mr-2 pr-2">Bullet Speed:</label>
        <input
          type="range"
          min="100"
          max="1000"
          value={this.state.fireRate}
          onChange={this.handleSliderChange}
        />
        <span className="ml-2">{this.state.fireRate} ms</span>
      </div>
    );
  }
}
