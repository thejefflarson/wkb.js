wkb.Point = wkb.Geometry.extend({
  type : wkb.Type.k.wkbPoint,
  toString : function(){
    return "<" + wkb.Type.toString(this.type) + " x=" + this.getX() + " y=" + this.getY();
  }
});

wkb.Point.registerParser("WKB", function(instance){
  return {
    getX : function(){
      return this.data.getFloat64(0);
    },

    getY : function(){
      return this.data.getFloat64(wkb.Type.b.Float64);
    }
  };
});
