import config from "./config.json";


class Greeter {
  constructor(){
    var greet = document.createElement('div');
    greet.textContent = config.greetText;
    this.greet = greet;
  }
}

export default new Greeter();