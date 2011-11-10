module("Polygon");

test("should be able to parse wkb", function(){
  stop()
  $.get("./out.wkb", function(data){
    start();
    console.time("poly parse");
    var mpolygon = new wkb.Factory().parseWKB(new DataView(str2buffer(data)));
    console.timeEnd("poly parse");

    equals(mpolygon.type, wkb.Type.k.wkbMultiPolygon);
    equals(mpolygon.numGeometries(), 1);
    equals(mpolygon.geometries[0].type, wkb.Type.k.wkbPolygon);
    equals(mpolygon.geometries[0].geometries[0].type, wkb.Type.k.wkbLinearRing);
    equals(mpolygon.geometries[0].geometries[0].numGeometries(), 9807);
    console.log(mpolygon.geometries[0].geometries[0]);
  });
});
