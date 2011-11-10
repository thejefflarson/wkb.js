wkb.PointCollection = wkb.Geometry.extend({
  type : wkb.Type.k.wkbUnknown,
  _child : wkb.Point
});

wkb.PointCollection.registerParser("WKB", function(instance){
  return {
    numGeometries : function(){
      return this.data.getUint32(0);
    },

    byteLength : function(){
             // numPoints * 2 * double
      return wkb.Type.b.Uint32 + this.numGeometries() * 2 * wkb.Type.b.Float64;
    },

    pointAt : function(idx){
      wkb.Utils.assert(idx < this.numGeometries(), "Out of range.");
      return wkb.Point.parseWKB(new DataView(this.data.buffer,
        this.data.byteOffset + wkb.Type.b.Uint32 + wkb.Type.b.Float64 * 2 * idx));
    }
  };
});
