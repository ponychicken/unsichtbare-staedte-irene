var I;
var gradientYellowWhite = new Rainbow().setSpectrum('#CC874A','#C6BAB0').setNumberRange(0,50);
var curPos = 0;

var keyFramedObjects = [];



Snap.load('new7.svg', function (data) {
    I = Snap('#svg');
    I.append(data);
    setupAnimations(I);
});


function setupAnimations(I) {
  var sun = I.select('#Sun');

  //wiggleCheaply(sun);
  // wiggleAllPoints(3, 1, sun.select('path'));

  $('input').change(function (e) {
    movePerspective($(this).val());
  });

  setupPerspective();
  // par = new I.ParticleSystem({
  //   spread: 80
  //
  // }, I);
  //
  // Snap.animate(0, 0, function (val) {
  //   par.update();
  //   par.updateDOM();
  // }, 10000);

  var body = $('body')[0];
  var started = false;
  var initial = curPos;

  Hammer(body).on("dragstart", function(event) {
    initial = curPos;
  });
  Hammer(body).on("drag", function(event) {
    event.gesture.preventDefault();
    event.gesture.stopPropagation();

    var calculatedPos = initial - event.gesture.deltaX/10;
    curPos = calculatedPos;
    movePerspective(curPos);
  });
}
var i = 0;

// window.addEventListener("deviceorientation", function (event) {
//   var calculatedPos = event.gamma * 0.25;
//
//
//   window.requestAnimationFrame(function () {
//     curPos = calculatedPos;
//     movePerspective(curPos);
//   });
//
// }, true);
function mapNumber(X,A,B,C,D) {
  return (X-A)/(B-A) * (D-C) + C;
}

function setupPerspective() {
  var front = I.select('#Front'), back = I.select('#Back'), sky = I.select('#Sky');
  var buildings = I.selectAll('#City > *');
  var text = I.select('#Text'), textChildren = I.selectAll('#Text > *');

  front.setDepth(-60);
  back.setDepth(20);
  //text.setDepth(-30);
  textChildren[0].setDepth(-30);
  textChildren[1].setDepth(-33);
  textChildren[2].setDepth(-45);
  sky.setDepth(-2);

  buildings.forEach(function (item) {
    var bbox = item.getBBox();
    // Between 900 (near) and 500 (far)
    // Middle at 680
    var shift = -(bbox.y2 - 680);
    console.log("Shift", shift);
    var z = mapNumber(shift, -250, 200, -15, 10);
    //console.log(z);
    item.setDepth(z);
  });

  function cloudMover(name, x) {
    var cloud = new KeyframedObject(I.select(name));
    console.log(cloud.object.attr('opacity'));
    cloud.addKeyframe(-80, {x:0, y:0, opacity:parseFloat(cloud.object.attr('opacity')*1.1)});
    cloud.addKeyframe(0, {x:x, y:0, opacity:0});
    //cloud.addKeyframe(20, {x:x, y:0, opacity:0});
    return cloud;
  }

  function opacityMover(name, xFrom, xTo, oFrom, oTo) {
    var el = new KeyframedObject(I.select(name));
    el.addKeyframe(-80, {x:xFrom, y:0, opacity:oFrom});
    el.addKeyframe(0, {x:xTo, y:0, opacity:oTo});
    //cloud.addKeyframe(20, {x:x, y:0, opacity:0});
    return el;
  }

  // Setup clouds
  keyFramedObjects.push(cloudMover('#Cloud1', -400));
  keyFramedObjects.push(cloudMover('#Cloud2', -900));
  keyFramedObjects.push(cloudMover('#Cloud3', 400));
  keyFramedObjects.push(cloudMover('#Cloud4', 400));
  keyFramedObjects.push(cloudMover('#Cloud5', 200));
  keyFramedObjects.push(cloudMover('#Cloud6', -200));
  keyFramedObjects.push(opacityMover('#Rock', 0,0,0.4,1));




  // Last call
  curPos = -87;
  movePerspective(curPos);

}

function movePerspective(value) {
  if (value < -85) value = -85;
  I.circularDisplace(value);
  keyFramedObjects.forEach(function (item) {
    var props = item.getInterpolated(value);

    // Special casing
    if (props.x || props.y) {
      console.log("Putting a cloud at", props.x );
      item.object.transform('translate(' + props.x + ',' + props.y + ')');
    }
    if (props.opacity) {
      console.log('opacity:', props.opacity);
      item.object.attr({opacity: props.opacity});
    }
  });
  //sun.transform('translate(0,' + 2.5*value + ')');
  var color = gradientYellowWhite.colourAt(value);
  I.select('#SkyBack').attr({fill: color});
  console.log("At perspective value", value);
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

function animateFn(point, distance, duration, axis) {
  var animate = function () {
    var mover = function (value) {
      point[axis] = value + point[axis + 'Orig'];
    };
    Snap.animate(0, distance, mover, duration, mina.linear, goBack);
    function goBack () {
      Snap.animate(distance, 0, mover, duration, mina.linear, animate);
    }
  };
  return animate;
}

function wigglePointFn(point, amplitude, longitude ) {
  var offset = Math.abs(Math.random()*20);
  var wiggler = function (value) {
    point.x = Sin(amplitude, longitude, offset, value) + point.xOrig;
  };
  return wiggler;
}

function Sin(amplitude, longitude, offset, t) {
  return (amplitude * Math.sin(offset + t/longitude));
}
