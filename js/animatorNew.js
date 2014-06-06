var I;
var gradientYellowWhite = new Rainbow().setSpectrum('#CC874A', '#C6BAB0').setNumberRange(0,50);
var curPos = 0;

var keyFramedObjects = [];
loadSVG();

function loadSVG() {
  $.get('/new12 Kopie.svg', function(response) {
    var frag = $('#hiddenWrapper');
    frag.append(response);
    setup(frag);
  });
}

function setup(frag) {
  I = new Two({
    width: 768,
    height: 1024,
    type: Two.Types.svg
  }).appendTo($('#wrapper')[0]);
  I.interpret(frag.children()[0]);

  I.update();

  setupPerspective();

  var body = $('body')[0];
  var started = false;
  var initial = curPos;

  Hammer(body).on("dragstart", function(event) {
    initial = curPos;
  });
  var timer = Date.now(),
    counter = 0,
    lastX;



  Hammer(body).on("drag", function(event) {
    if ((Date.now() - timer) > 1000) {
      console.log(counter, 'events in the last', (Date.now() - timer), 'millis');
      counter = 0;
      timer = Date.now();
    }
    counter++;
    event.gesture.preventDefault();
    var calculatedPos = initial - event.gesture.deltaX / 10;
    curPos = calculatedPos;
  });

  var lastPos = 0;

  var prefix = 1;
  var i = 0;
  var pos = 0;
  var pause = 0;


  var savePosition = function (name) {
    var weird = I.scene.getById(name).getByType(Two.Polygon);
    weird.forEach(function(item) {
      item.vertices.forEach(function(anchor) {
        anchor.origin = new Two.Vector().copy(anchor);
      });
    });
    return weird;
  };

  var wiggle = function (item) {
    item.vertices.forEach(function(anchor) {
      var wiggle = (item.z) ? (item.z - 100)/-75 : 1.5;
      anchor.x = anchor.origin.x + Math.random() * wiggle;
      anchor.y = anchor.origin.y + Math.random() * wiggle;
    });
  };

  var CityWiggler = savePosition('City');
  var GolfWiggler = savePosition('GolfCity');
  var CloudWiggler = savePosition('Clouds');

  I.bind('update', function(frameCount) {
    if (curPos != lastPos) {
      lastPos = curPos;
      movePerspective(curPos);
    }
    if (!(frameCount % 5)) {
      if (curPos < 90) {
        CityWiggler.forEach(wiggle);
      }
      if (curPos > 150) {
        GolfWiggler.forEach(wiggle);
      }
      CloudWiggler.forEach(wiggle);
    }
  }).play();
}



var selected;

function mapNumber(X,A,B,C,D) {
  return (X-A)/(B-A) * (D-C) + C;
}


function moveToCorrectPosition(item, atPosition, offset) {
  if (!offset) offset = 0;
  item.translation.set((atPosition * item.z) + offset, 0);
  item.origTranslation = new Two.Vector().copy(item.translation);
}

function setupPerspective() {
  var front = I.scene.getById('Front'),
    back = I.scene.getById('Back'),
    sky = I.scene.getById('Sky');
  var buildings = I.scene.getById('City').children;
  var tents = I.scene.getById('GolfCity').children;
  var text = I.scene.getById('Text');
  var text2 = I.scene.getById('Text2');
  var SkyWrong = I.scene.getById('SkyWrong');
  SkyWrong.opacity = 0;
  var textChildren = [];



  front.setDepth(-60);
  back.setDepth(20);
  //text.setDepth(-30);
  i = 0;

  for (var id in text.children) {
    textChildren.push(text.children[id]);
  }
  // Title
  textChildren[0].setDepth(-8);
  // MainText
  textChildren[1].setDepth(-12);
  // Arrow
  textChildren[2].setDepth(-20);

  textChildren.forEach(function (item) {
    moveToCorrectPosition(item, -85);
  });

  text2.setDepth(-20);
  moveToCorrectPosition(text2, 135);


  sky.setDepth(-2);

  for (var id in buildings) {
    var item = buildings[id];
    var bbox = item.getBoundingClientRect();
    // Between 900 (near) and 500 (far)
    // Middle at 680
    var shift = -(bbox.bottom - 680);
    var z = mapNumber(shift, -250, 200, -15, 10);
    item.setDepth(z);
  }

  for (var id in tents) {
    var item = tents[id];
    var bbox = item.getBoundingClientRect();
    // Between 900 (near) and 500 (far)
    // Middle at 680
    var shift = -(bbox.bottom - 680);
    var z = mapNumber(shift, -250, 200, -15, 10);
    item.setDepth(z);

    moveToCorrectPosition(item, 275);
  }



  selected = I.scene.getByClassName('parallaxEnabled');


  function cloudMover(name, x) {
    var cloud = new KeyframedObject(I.scene.getById(name));
    var originalOpacity = parseFloat(cloud.object.opacity*1.1);
    cloud.object.z = -80;

    // Start
    cloud.addKeyframe(-85, {x:0, y:0, opacity:originalOpacity});
    cloud.addKeyframe(0, {x:x, y:0, opacity:0});
    cloud.addKeyframe(35, {x:x, y:0, opacity:0});
    cloud.addKeyframe(115, {x:0, y:0, opacity:originalOpacity});
    cloud.addKeyframe(125, {x:0, y:0, opacity:originalOpacity});

    // GolfCity
    cloud.addKeyframe(275, {x:x, y:0, opacity:0});
    return cloud;
  }

  function opacityMover(name, xFrom, xTo, oFrom, oTo, tFrom, tTo) {
    var el = new KeyframedObject(I.scene.getById(name));
    el.addKeyframe(tFrom, {x:xFrom, y:0, opacity:oFrom});
    el.addKeyframe(tTo, {x:xTo, y:0, opacity:oTo});
    //cloud.addKeyframe(20, {x:x, y:0, opacity:0});
    return el;
  }

  function gradientMover(name, xFrom, xTo, oFrom, oTo, gFrom, gTo, tFrom, tTo, gradient) {
    var el = new KeyframedObject(I.scene.getById(name));
    el.gradient = gradient;
    el.addKeyframe(tFrom, {x:xFrom, y:0, opacity: oFrom, gradient:gFrom});
    el.addKeyframe(tTo, {x:xTo, y:0, opacity: oTo, gradient:gTo});
    return el;
  }

  // Setup clouds
  keyFramedObjects.push(cloudMover('Cloud1', -400));
  keyFramedObjects.push(cloudMover('Cloud2', -900));
  keyFramedObjects.push(cloudMover('Cloud3', 400));
  keyFramedObjects.push(cloudMover('Cloud4', 400));
//  keyFramedObjects.push(cloudMover('Cloud5', 200));
  keyFramedObjects.push(cloudMover('Cloud6', -500));
  keyFramedObjects.push(opacityMover('Rock', 0, 0, 0.4, 1, -85, 0));
  keyFramedObjects.push(opacityMover('Text', 0, 0, 1,   0, -85, 0));
  keyFramedObjects.push(opacityMover('City', 0, 0, 1,   0, 35, 180));
  keyFramedObjects.push(opacityMover('Moon', 0, 0, 1,   0, 35, 180));
  keyFramedObjects.push(opacityMover('GolfCity', 0, 0, 0,   1, 105, 200));
  keyFramedObjects.push(opacityMover('SkyWrong', 0, 0, 0,   1, 105, 200));

  keyFramedObjects.push(gradientMover('RockBase1', 0, 0, 0, 1, 0, 100, -70, 0, new Rainbow().setSpectrum('#EA6219', '#5D514D').setNumberRange(0,100)));
  keyFramedObjects.push(gradientMover('SkyColor', 0, 0, 1, 1, 0, 100, 35, 200, new Rainbow().setSpectrum('#96A3AC', '#63665F').setNumberRange(0,100)));
  keyFramedObjects.push(gradientMover('Earth', 0, 0, 1, 1, 0, 100, 35, 200, new Rainbow().setSpectrum('#E5CECE', '#82888A').setNumberRange(0,100)));


  // Last call
  curPos = -85;
  movePerspective(curPos);

}

function movePerspective(value) {
  if (value < -85) curPos = value = -85;
  if (value > 275) curPos = value = 275;
  console.log('Persp', curPos);
  I.scene.circularDisplace(value, 0, selected);
  keyFramedObjects.forEach(function (item) {
    var props = item.getInterpolated(value);

    // Special casing
    if (_.isNumber(props.x) || _.isNumber(props.y)) {
      item.object.translation.set(props.x, props.y);
    }
    if (_.isNumber(props.opacity)) {
      item.object.opacity = props.opacity;
    }
    if (_.isNumber(props.gradient)) {
      item.object.fill = '#' + item.gradient.colourAt(props.gradient);
    }
  });
  //sun.transform('translate(0,' + 2.5*value + ')');
  //var color = gradientYellowWhite.colourAt(value);
  //I.getById('SkyBack').attr({fill: color});
}
