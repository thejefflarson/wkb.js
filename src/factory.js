wkb.Factory = function(wkb){
  this.dv = new DataView(wkb);
  this.parse();
}

wkb.Utils.mixin(wkb.Factory.prototype, wkb.Mixins.Reader, {
  parse : function(){
    return this._dispatch();
  },

  _dispatch : function(){
    this._getUInt();
    switch(num){
      case wkb.Type.Point: // point
        console.log("point");
        break;
      case wkb.Type.LineString: // linestring
        console.log("linestring");
        break;
      case wkb.Type.PolyGon: // poly
        n = this._getU32();
        for(var i=0; i < n; i++)
          this._plotPart();
        break;
      case wkb.Type.wkbMultiLineString:
        n = this._getU32();
        for(var i=0; i < n; i++)
          this._dispatch();
      case wkb.Type.wkbMultiPolygon: // multipoly
        n = this._getU32();
        for(var i=0; i < n; i++)
          this._dispatch();
      case wkb.Type.wkbGeometryCollection:
        n = this._getU32();
        for(var i=0; i < n; i++)
          this._dispatch();
    }
  }
}