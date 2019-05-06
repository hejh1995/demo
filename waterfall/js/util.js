// 惰性函数
var addEvent= (function() {
  if (window.addEventListener) {
    return function(elem, type, fn) {
      elem.addEventListener(type, fn, false);
    }
  } else if (window.attachEvent) {
    return function(elem, type, fn) {
      elem.attachEvent('on' + type, fn);
    }
  }
})();
//
function extend(target) {
  for (let i = 1, len = arguments.length; i < len; i++) {
    for (let item in arguments[i]) {
      if (arguments[i].hasOwnProperty(item)) {
        target[item] = arguments[i][item];
      }
    }
  }
  return target
}
