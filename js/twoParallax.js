var methods = {
  setDepth: function (val) {
    this.z = val;
    return this.enableParallax();
  },
  enableParallax : function () {
    this.classList.push('parallaxEnabled');
    this.enableCache = true;
    return this;
  }
};
_.extend(Two.Shape.prototype, methods);
_.extend(Two.Group.prototype, methods, {
  circularDisplace : function (x, y, selected) {
    if (!selected) selected = this.selectByClass('parallaxEnabled');
    //window.requestAnimationFrame(function () {
      selected.forEach(function (item) {
        var xShift = x * item.z;
        item.translation.set(xShift, 0);
      });

    //});
  }
});
_.extend(Two.Polygon.prototype, methods);
