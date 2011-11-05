wkb.Geometry = function(dv){
  this.dv = dv;
}
wkb.Utils.extend(wkb.Geometry.prototype, {
  constructor: Geometry
});
wkb.Geometry.extend = wkb.Utils.extend;