Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.setDepth = function (val) {

      // Depth goes from -100 to 100
      this.z = val > 100 ? 100 : val < -100 ? -100: val;
      console.log(this.z);
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
        var negative = (item.z < 0);
        //var shift = Math.abs(item.z/100) * x;
        var shift = mina.easeout(Math.abs(item.z/100)) * x;
        if (negative) shift *= -50;
        else shift *= 50;
        item.transform('translate(' + shift + ')');
      });
    };
});
