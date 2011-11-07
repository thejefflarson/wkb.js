wkb.LinearRing = wkb.Geometry.extend({
  constructor : function(data, endian){
    wkb.Geometry.call(this, data);
    this.endian = function(){ return endian; };
    this.points = [];
  },

  type : wkb.k.LinearRing,

  numPoints : function(){
    return this.points.length;
  }
});

wkb.Polygon.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    numPoints : function(){
                              // endian offset
      return this.data.getUInt32(wkt.Type.b.Int8, this.endian());
    },

    byteOffset : function(){
           //endian + numPoints * 2 * double
      return wkt.Type.b.Int8 + wkt.Type.b.UInt32 +
              this.numPoints() * 2 * wkt.Type.b.Float32 - wkt.Type.b.Int8;
    },

    _parse : function(){

    }
  });
});
