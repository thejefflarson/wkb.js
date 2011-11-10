wkb.Factory = function(){};

wkb.Utils.mixin(wkb.Factory.prototype, {
  parseWKT : function(data){
    return this._dispatch(data, 'parseWKT');
  },

  parseWKB : function(data){
    return this._dispatch(data, 'parseWKB');
  },

  _dispatch : function(data, func){
    var num = data.getUint32(1);
    switch(num){
      case wkb.Type.k.wkbPoint:
        return wkb.Point[func](data);
      case wkb.Type.k.wkbLineString:
        return wkb.LineString[func](data);
      case wkb.Type.k.wkbPolygon:
        return wkb.Type.k.Polygon[func](data);
      case wkb.Type.k.wkbMultiLineString:
        return wkb.MultiLineString[func](data);
      case wkb.Type.k.wkbMultiPolygon:
        return wkb.MultiPolygon[func](data);
      case wkb.Type.k.wkbGeometryCollection:
        return wkb.GeometryCollection[func](data);
      default:
        wkb.Utils.assert(false, "Unknown geometry type");
    }
  }
});
