wkb.MultiPolygon = wkb.GeometryCollection.extend({
  type : wkb.Type.k.wkbMultiPolygon,
  _child : wkb.Polygon
});
