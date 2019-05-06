function WaterFall(opts) {
  this.opts = extend({}, this.constructor.defaultopts, opts);
  this._container = typeof this.opts.container === 'string' ? document.querySelector(this.opts.container) : this.opts.container;
  this._pins = typeof this.opts.pins === 'string' ? document.querySelectorAll(this.opts.pins) : this.opts.pins;
  this._unitWidth = this.opts.pinWidth + this.opts.gapWidth;
  this.init();
  addEvent(window, "resize", this.handleResize.bind(this))
}
WaterFall.defaultopts = {
  gapHeight: 20,
  gapWidth: 20,
  pinWidth: 216
}
var proto = WaterFall.prototype;
proto.constructor = WaterFall; // proto 的 this 指向
proto.init = function() {
  this.getColumn(); // 计算列数
  this.setContainer(); // 设置 container 居中
  if (this._pins.length > 0) { // 对已经存在的图片设置瀑布流
    this.setPosition(this._pins)
  }
};
proto.getColumn = function() {
  this._viewPortWidth = window.innerWidth || document.documentElement.clientWidth;
  // this.opts.gapWidth，一定要加。
  this._num = Math.floor((this._viewPortWidth + this.opts.gapWidth)/this._unitWidth);
  this._columnHeight = new Array(this._num).fill(0);
};
proto.setContainer = function() {
  this._container.style.width = (this._unitWidth * this._num - this.opts.gapWidth) + 'px';
};
proto.getMin = function() {
  return Math.min.apply(null, this._columnHeight);
};
proto.setPosition = function(pins) {
  pins.forEach(item => {
      let min = this.getMin();
      let index = indexOf(this._columnHeight, min);
      item.style.left = this._unitWidth * index + 'px';
      item.style.top = min + 'px';
      this._columnHeight[index] += (item.offsetHeight + this.opts.gapHeight);
  })
};
var timer = null;
proto.handleResize = function() {
  var self = this;
  clearTimeout(timer);
  timer = setTimeout(() => {
    self.init();
  }, 100);
};
