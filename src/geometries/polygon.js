wkb.Polygon = wkb.Geometry.extend({
  type : wkb.Type.k.wkbPolygon,
  _child : wkb.LinearRing
});
