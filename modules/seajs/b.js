define("./b", [ "./a" ], function(require, exports, module) {
    var a = require("./a");
    console.log(a);
    return {
        show: function(n) {
            a.show(n);
        }
    };
});