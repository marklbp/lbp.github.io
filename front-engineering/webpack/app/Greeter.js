/*var Greeter = require("./config.json");
module.exports = function() {
  var greet = document.createElement('div');
  greet.textContent = Greeter.greetText;
  return greet;
};*/

import config from "./config.json";

import React, {Component} from "react";

class Greeter extends Component {
	render() {
    return (
      <div>
        {config.greetText}
      </div>
    );
  }
}

export default Greeter;