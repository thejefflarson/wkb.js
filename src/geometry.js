wkb.Geometry = function(data){
  this.data = data;
}
wkb.Utils.mixin(wkb.Geometry.prototype, wkb.Utils.Reader, {});
wkb.Geometry.extend = wkb.Utils.extend;
wkb.Utils.mixin(wkb.Geometry, {
  registerParser : function(type, fn){
    var cb;
    switch(type){
      case "WKB": 
        cb = function() { 
          wkb.Utils.assert(wkb.root.DataView && wkb.root.ArrayBuffer,
            "Can't parse WKB without DataView and ArrayBuffer"); 
          fn.call(this, arguments); 
        }
        break;
      case "JSON":
        cb = function() { 
          wkb.Utils.assert(wkb.root.JSON, "Can't parse GeoJSON without json support");
          fn.call(this, arguments);
        }
      default:
        cb = fn;
    }
    this["parse" + type] = function(data) {
      var instance = new this.constructor(data);
      cb(instance);
      return instance;
    }
  }
});