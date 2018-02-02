define("./a", [], function(require, exports, module) {
    return {
        show: function(a) {
            console.log(a);
            alert(a);
        }
    };
});

define("./b", [ "./a" ], function(require, exports, module) {
    var a = require("./a");
    console.log(a);
    return {
        show: function(n) {
            a.show(n);
        }
    };
});

define("./all", [ "./b", "./a" ], function(require, exports, module) {
    var b = require("./b");
    return {
        show: function(n) {
            b.show(n);
        }
    };
});
