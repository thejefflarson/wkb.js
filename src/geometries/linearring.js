wkb.LinearRing = wkb.Geometry.extend({
  type : wkb.Type.k.wkbLinearRing,
  _child : wkb.Point
});

wkb.LinearRing.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    numGeometries : function(){
      return this.data.getUint32(0);
    },

    byteLength : function(){
             // numPoints * 2 * double
      return wkb.Type.b.Uint32 + this.numGeometries() * 2 * wkb.Type.b.Float64;
    },

    pointAt : function(idx){
      return this.points(idx);
    },

    parse : function(){
      var points = this.numGeometries();

      for(var i = 0; i < points * 2 - 1; i += 2){
        this.geometries.push(this._child.parseWKB(new DataView(this.data.buffer, i * wkb.Type.b.Float64)));
      }
    }
  });
});
