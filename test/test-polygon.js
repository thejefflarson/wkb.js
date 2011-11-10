module("Polygon");

test("should be able to parse wkb", function(){
  stop();
  expect(5);
  binAjax("GET", "./out.wkb", function(e){
    start();
    var mpolygon = new wkb.Factory().parseWKB(e.response);
    equals(mpolygon.type, wkb.Type.k.wkbMultiPolygon);
    equals(mpolygon.numGeometries(), 1);
    equals(mpolygon.geometries[0].type, wkb.Type.k.wkbPolygon);
    equals(mpolygon.geometries[0].geometries[0].type, wkb.Type.k.wkbLinearRing);
    equals(mpolygon.geometries[0].geometries[0].numGeometries(), 9807);
    console.log(mpolygon.geometries[0].geometries[0].pointAt(1).getY());
    console.log(mpolygon.geometries[0].geometries[0].pointAt(22).getX());
  });
});
