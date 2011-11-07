wkb.Factory = function(wkb){
  this.data = new DataView(wkb);
};

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
      case wkb.Type.k.wkbPoint:
        return wkb.Point[func];
      case wkb.Type.k.wkbLineString:
        return wkb.LineString[func];
      case wkb.Type.k.wkbPolygon:
        return wkb.Type.k.Polygon[func];
      case wkb.Type.k.wkbMultiLineString:
        return wkb.MultiLineString[func];
      case wkb.Type.k.wkbMultiPolygon:
        return wkb.MultiPolygon[func];
      case wkb.Type.k.wkbGeometryCollection:
        return wkb.GeometryCollection[func];
      default:
        wkb.Utils.assert(false, "Unknown geometry type");
    }
  }
});
