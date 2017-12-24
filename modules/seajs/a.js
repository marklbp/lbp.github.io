define("./a", [], function(require, exports, module) {
    return {
        show: function(a) {
            console.log(a);
            alert(a);
        }
    };
});