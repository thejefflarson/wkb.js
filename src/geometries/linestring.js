wkb.LineString = wkb.Geometry.extend({
  type : wkb.Type.k.LineString,
  _child : wkb.Point
});
