wkb.Polygon = wkb.Geometry.extend({
  type : wkb.Types.wkbGeometry,
  rings : function(){
    return this.children;
  }
});

wkb.Polygon.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    rings : function(){
      
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
