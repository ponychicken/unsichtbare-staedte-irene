var KeyframedObject = function (object) {
  this.object = object
  this.keyframes = [];
}

KeyframedObject.prototype.addKeyframe = function (t, data) {
  data.time = t;
  this.keyframes[t] = data;
}

KeyframeObject.prototype.getInterpolated = function (wantedT) {
  function isNum(v) {
    return typeof v == 'number'
  }
  var a,b;
  // Exact match?
  if (this.keyframes[wantedT]) {
    return this.keyframes[wantedT];
  }
  // First find the closest two keys
  for (var t in this.keyframes) {
    if (t < wantedT) {
      var a = t
    }
    if (t > wantedT && b == undefined) {
      var b = t;
      return;
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
  var newObj;
  function mapNumber(X,A,B,C,D) {
    return (X-A)/(B-A) * (D-C) + C;
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
