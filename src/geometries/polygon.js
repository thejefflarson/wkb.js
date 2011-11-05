wkb.Polygon = wkb.Geometry.extend({
  type : wkb.Types.wkbGeometry,
  children : [wkb.LineString]
});

wkb.Polygon.register("WKB", function(binary){
  
});

wkb.Polygon.register("WKT", function(){
  
});

wkb.Polygon.register("JSON", function(){
  
});
