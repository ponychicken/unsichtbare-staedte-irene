var I;
var gradientYellowWhite = new Rainbow().setSpectrum('#CC874A','#C6BAB0').setNumberRange(0,50);
var curPos = 0;


Snap.load('scene.svg', function (data) {
    I = Snap('#svg');
    I.append(data);
    setupAnimations(I);
});


function setupAnimations(I) {
  var sun = I.select('#Sun');

  I.select('#Bild').remove();
  //wiggleCheaply(sun);
  wiggleAllPoints(3, 1, sun.select('path'));

  $('input').change(function (e) {
    movePerspective($(this).val());
  });

  setupPerspective();
  par = new I.ParticleSystem({
    spread: 80

  }, I);

  Snap.animate(0, 0, function (val) {
    par.update();
    par.updateDOM();
  }, 10000);


  par.update();
  par.updateDOM();
  var body = $('body')[0];
  var started = false;
  var initial = curPos;

  Hammer(body).on("dragstart", function(event) {
    initial = curPos;
  });
  Hammer(body).on("drag", function(event) {
    event.gesture.preventDefault();
    event.gesture.stopPropagation();

    var calculatedPos = initial + event.gesture.deltaX/10;
    curPos = calculatedPos;
    movePerspective(curPos);
  });
}

function setupPerspective() {
  var front = I.select('#Front'), back = I.select('#Back'), cities = I.select('#Cities');
  var far = I.select('#Far'), middle = I.select('#Middle_1_'), sun = I.select('#Sun');
  var text = I.select('#TextEbene');

  front.setDepth(-30);
  text.setDepth(-40);
  back.setDepth(2);
  far.setDepth(7);
  middle.setDepth(4);
}

function movePerspective(value) {
  I.circularDisplace(value);
  //sun.transform('translate(0,' + 2.5*value + ')');
  var color = gradientYellowWhite.colourAt(value);
  I.select('#SkyBack').attr({fill: color});
}


function wiggleAllPoints(amplitude, longitude, el) {
  var len = el.node.pathSegList.numberOfItems;
  for (var i = 0; i < len; i++) {
    var point = el.node.pathSegList.getItem(i);
    point.xOrig = point.x;
    point.yOrig = point.y;
    var duration = 5 + Math.random() * 5;
        duration *= 500;
    var distanceX = Math.random() * 3;
    var distanceY = Math.random() * 3;

    new animateFn(point, distanceX, duration, 'x')();
    new animateFn(point, distanceY, duration, 'y')();
  }
}

function movePointFn(point) {
  var mover = function (value) {
    console.log(value);
    point.x = value + point.xOrig;
  }
  return mover;
}

function animateFn(point, distance, duration, axis) {
  var animate = function () {
    var mover = function (value) {
      point[axis] = value + point[axis + 'Orig'];
    }
    Snap.animate(0, distance, mover, duration, mina.linear, goBack);
    function goBack () {
      Snap.animate(distance, 0, mover, duration, mina.linear, animate);
    }
  }
  return animate;
}

function wigglePointFn(point, amplitude, longitude ) {
  var offset = Math.abs(Math.random()*20);
  var wiggler = function (value) {
    point.x = Sin(amplitude, longitude, offset, value) + point.xOrig;
  }
  return wiggler;
}

function Sin(amplitude, longitude, offset, t) {
  return (amplitude * Math.sin(offset + t/longitude));
}

function animateSlider() {
  $('input').hide();
  var prefix = 1;
  var i = 0;
  var pos = 0;
  var pause = 0;

  setInterval(function () {
    if (pause) {
      pause--;
      return;
    }

    pos = mina.easeinout(i/50)*50;
    $('input').val(pos);
    movePerspective(pos);
    if (i == 50) {
      prefix = -1;
      pause = 10;
    } else if (i == 0) {
      prefix = 1;
      pause = 10;
    }
    i += prefix;

  }, 20);
}
