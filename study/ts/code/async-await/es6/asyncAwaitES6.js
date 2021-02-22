var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        console.log(value, 'fulfilled')
        // 这里接着走yield后面的语句
        // 接着继续下一个yield语句
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        console.log(value, 'rejected')
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done
      ? resolve(result.value)
      : new P(function (resolve) {
        resolve(result.value);//resolve等待result.value的promise返回
        // 到这里进入yield等待result.value的promise返回
      }).then(fulfilled, rejected);
    }
    generator = generator.apply(thisArg, _arguments || [])
    step(generator.next());
  });
};
function delay(milliseconds, count) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(count)
      //count < 3 ? resolve(count) : reject(count);
    }, milliseconds);
  });
}
// async function always return a Promise
function dramaticWelcome() {
  return __awaiter(this, void 0, void 0, function* () {
    console.log("Hello");
    for (let i = 0; i < 5; i++) {
      // await is converting Promise<number> into number
      const count = yield delay(10000, i);
      console.log(count);
    }
    console.log("World!");
  });
}
dramaticWelcome();
