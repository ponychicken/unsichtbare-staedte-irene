var KeyframedObject = function (object) {
  this.object = object
  this.keyframes = [];
  this.keyframeIndex = [];
}

KeyframedObject.prototype.addKeyframe = function (t, data) {
  data.time = t;
  this.keyframes[t] = data;
  this.keyframeIndex.push(t);
  this.keyframeIndex.sort();
}

KeyframedObject.prototype.getInterpolated = function (wantedT) {
  function isNum(v) {
    return typeof v == 'number'
  }
  var a,b;
  // Exact match?
  if (this.keyframes[wantedT]) {
    return this.keyframes[wantedT];
  }
  // First find the closest two keys
  for (var i = 0; i < this.keyframeIndex.length; i++) {
    var t = this.keyframeIndex[i];
    if (t < wantedT) {
      var a = t
    } else if (t > wantedT && b == undefined) {
      var b = t;
      break;
    }
  }

  // Return
  if (isNum(a) && isNum(b)) {
    return this.interpolateObjects(this.keyframes[a], this.keyframes[b], wantedT);
  } else if (isNum(a)) {
    return this.keyframes[a];
  } else if (isNum(b)) {
    return this.keyframes[b];
  } else {
    return {};
  }
}

KeyframedObject.prototype.interpolateObjects = function (objA, objB, wantedT) {
  var newObj = {};
  function mapNumber(X,A,B,C,D) {
    //Safe mode
    X += 1000;
    A += 1000;
    B += 1000;

    return (X-A)/(B-A) * (D-C) + C;
    //return C + (D - C) * ((X - A) / (B - A));

  }

  for (var key in objA) {
    if (objB[key] != undefined) {
      newObj[key] = mapNumber(wantedT, objA.time, objB.time, objA[key], objB[key]);
    } else {
      newObj[key] = objA[key];
    }
  }
  for (var key in objB) {
    if (newObj[key] == undefined) {
      newObj[key] = objB[key];
    }
  }
  newObj.time = wantedT;
  return newObj;
}
