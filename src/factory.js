wkb.Factory = function(){};

wkb.Utils.mixin(wkb.Factory.prototype, {
  parseWKT : function(data){
    //return this._dispatch(data, 'parseWKT');
  },

  parseWKB : function(data){
    //wkb.Utils.assert(DataView, "Can't parse Binary without DataView");
    data = new DataView(data);
    return this._dispatch(data, data.getUint32(1), 'parseWKB');
  },

  _dispatch : function(data, num, func){
    switch(num){
      case wkb.Type.k.wkbPoint:
        return wkb.Point[func](data);
      case wkb.Type.k.wkbLineString:
        return wkb.LineString[func](data);
      case wkb.Type.k.wkbPolygon:
        return wkb.Polygon[func](data);
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
