wkb.Factory = function(wkb){
  this.data = new DataView(wkb);
  this.parse();
}

wkb.Utils.mixin(wkb.Factory.prototype, wkb.Mixins.Reader, {
  parseWKT : function(data){
    return this._dispatch(data, 'fromWKT');
  },

  parseWKB : function(data){
    return this._dispatch(data, 'fromWKB');
  },

  _dispatch : function(data, func){
    this.advance(this.UINT8);
    var n, num = this._getU32();
    switch(num){
      case wkb.Type.Point: // point
        return wkb.Point[func]
      case wkb.LineString: // linestring
        return wkb.LineString[func];
      case wkb.Polygon:
        return wkb.Polygon[func];
      case wkb.Type.MultiLineString:
        return wkb.MultiLineString[func];
      case wkb.Type.wkbMultiPolygon: // multipoly
        return wkb.MultiPolygon[func];
      case wkb.Type.wkbGeometryCollection:
        return wkb.GeometryCollection[func];
    }
  }
}