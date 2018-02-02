define("./all", [ "./b", "./a" ], function(require, exports, module) {
    var b = require("./b");
    return {
        show: function(n) {
            b.show(n);
        }
    };
});