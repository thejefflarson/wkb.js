module("Polygon");

test("should be able to parse wkb", function(){
  $.get("./out.wkb", function(data){
    console.log(arguments);
    var polygon = wkb.Factory.parse(data);
  });
});
