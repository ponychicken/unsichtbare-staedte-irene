Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.setDepth = function (val) {
      this.z = val;
      this.enableParallax();
    };
    Element.prototype.enableParallax = function () {
      this.addClass('parallaxEnabled');
    };
    Element.prototype.disableParallax = function () {
      this.removeClass('parallaxEnabled');
    };
    Paper.prototype.circularDisplace = function (x, y) {
      this.selectAll('.parallaxEnabled').forEach(function (item) {
        var xShift = x * item.z;
        item.transform('translate(' + xShift + ')');
      });
    };
});
