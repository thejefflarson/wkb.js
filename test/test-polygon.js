module("Polygon");

test("should be able to parse wkb", function(){
  stop();
  expect(9);
  binAjax("GET", "./out.wkb", function(e){
    start();
    var mpolygon = (new wkb.Factory()).parseWKB(e.response);
    equal(mpolygon.type, wkb.Type.k.wkbMultiPolygon);
    equal(mpolygon.numGeometries(), 1);
    equal(mpolygon.geometries[0].type, wkb.Type.k.wkbPolygon);
    equal(mpolygon.geometries[0].geometries[0].type, wkb.Type.k.wkbLinearRing);
    equal(mpolygon.geometries[0].geometries[0].numGeometries(), 9807);
    var ring = mpolygon.geometries[0].geometries[0];
    ok(closeEnough(ring.pointAt(0).getX(), -77.663362));
    ok(closeEnough(ring.pointAt(0).getY(),  38.859533));
    ok(closeEnough(ring.pointAt(9806).getX(), -77.663362));
    ok(closeEnough(ring.pointAt(9806).getY(),  38.859533));
  });
});
