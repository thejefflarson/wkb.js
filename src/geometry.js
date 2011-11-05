wkb.Geometry = function(data){
  this.data = data;
}
wkb.Utils.mixin(wkb.Geometry.prototype, wkb.Utils.Reader, {});
wkb.Geometry.extend = wkb.Utils.extend;
wkb.Utils.mixin(wkb.Geometry, {
  fromWKT : function(){}
  fromWKB : function(){}
});