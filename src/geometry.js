wkb.Geometry = function(data){
  this.data = data;
  this._parse();
};

wkb.Utils.mixin(wkb.Geometry.prototype, wkb.Utils.Reader, {
  type : wkb.Types.k.wkbUnknown,
  parse : function(){
    wkb.Utils.assert(false, "Geometry is an abstract type.");
  }
});

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
        };
        break;
      case "JSON":
        cb = function() {
          wkb.Utils.assert(wkb.root.JSON,
                           "Can't parse GeoJSON without json support");
          fn.call(this, arguments);
        };
        break;
      default:
        cb = fn;
    }
    this["parse" + type] = function(data) {
      var instance = new this.constructor(data);
      cb(instance);
      instance._parse();
      return instance;
    };
  }
});

wkb.Polygon.registerParser("WKB", function(instance){});
wkb.Polygon.registerParser("WKT", function(text){});
wkb.Polygon.registerParser("JSON", function(json){});
