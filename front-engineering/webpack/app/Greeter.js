var Greeter = require("./config.json");
module.exports = function() {
  var greet = document.createElement('div');
  greet.textContent = Greeter.greetText;
  return greet;
};