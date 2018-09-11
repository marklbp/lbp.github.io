//查找元素在数组中的位置
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

//删除所在位置
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

//数组去重复
Array.prototype.unique = function() {
  return Array.from(new Set(this));
}

//是否存在数组中
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

//毫秒转剩余
Number.prototype.formatDate = function(){
    let date = this;
    var days = parseInt(date / (1000 * 60 * 60 * 24));
    var hours = parseInt((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((date % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (date % (1000 * 60)) / 1000;
    return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
}
