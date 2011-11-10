wkb.Point = wkb.Geometry.extend({
  type : wkb.Type.k.wkbPoint,
  toString : function(){
    return "<" + wkb.Type.toString(this.type) + " x=" + this.getX() + " y=" + this.getY();
  }
});

wkb.Point.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    parse : function(){},

    getX : function(){
      return this.data.getFloat32(1);
    },

    getY : function(){
      return this.data.getFloat32(2);
    }
  });
});
