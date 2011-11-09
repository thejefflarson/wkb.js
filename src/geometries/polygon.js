wkb.Polygon = wkb.Geometry.extend({
  constructor : function(){
    wkb.Geometry.call(this, arguments);
    this.rings = [];
  },
  type : wkb.Types.k.wkbPolygon,

  numRings : function(){
    return this.rings.length;
  }
});

// templates
wkb.Polygon.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    endian : function(){
      return !!this.data.getUInt8(0);
    },

    numRings : function(){
                                 // endian +       numrings + type   - zero_index
      return this.data.getUInt32(wkt.Type.b.Int8 + wkt.Type.b.UInt32 - wkt.Type.b.Int8, this.endian());
    },

    byteOffset : function(){
      return wkt.Type.b.Int8 + wkt.Type.b.UInt32 * 2  - wkt.Type.b.Int8;
    },

    _parse : function(){
      wkb.Utils.assert(this.data.getUInt8(1) == this.type, "Wrong type for Polygon");
      var offset = this.byteOffset;
      for(var i = 0; i < this.numRings(); i++){
        var ring = wkb.LineString.parseWKB(new DataView(this.data.buffer, offset));
        this.rings.push(ring);
        offset = ring.byteOffset() + offset;
      }
    }
  });
});

wkb.Polygon.registerParser("WKT", function(text){
  wkb.Utils.mixin(instance, {
    rings : function(){

    }
  });
});

wkb.Polygon.registerParser("JSON", function(json){
  wkb.Utils.mixin(instance, {
    rings : function(){

    }
  });
});
