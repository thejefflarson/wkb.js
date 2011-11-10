wkb.Geometry = function(data){
  this.data = data;
  this.geometries = [];
};

wkb.Utils.mixin(wkb.Geometry.prototype, {
  type : wkb.Type.k.wkbUnknown,
  _child : null,
  toString : function(){
    return "<" + wkb.Type.toString(this.type) +
      (this.geometries && this.geometries.length > 0
        ? " " + this.geometries.map(function(it){ return it.toString(); }).join(", ")
        : "") +
      ">";
  }
});

wkb.Geometry.extend = wkb.Utils.extend;

wkb.Utils.mixin(wkb.Geometry, {
  registerParser : function(type, fn){
    var cb;
    switch(type){
      case "WKB":
        cb = function() {
          wkb.Utils.assert(DataView && ArrayBuffer,
                           "Can't parse WKB without DataView and ArrayBuffer");
          return fn.apply(this, arguments);
        };
        break;
      case "JSON":
        cb = function() {
          wkb.Utils.assert(wkb.root.JSON,
                           "Can't parse GeoJSON without json support");
          return fn.apply(this, arguments);
        };
        break;
      default:
        cb = fn;
    }
    this["parse" + type] = function(data) {
      var instance = new (this.prototype.constructor)(data);
      var mixin = cb(instance);
      wkb.Utils.mixin(instance, mixin);
      if(instance.parse) instance.parse();
      return instance;
    };
  }
});


// templates
wkb.Geometry.registerParser("WKB", function(instance){
  return {
    endian : function(){
      return !!this.data.getUint8(0);
    },

    numGeometries : function(){
                                 // type + numrings
      return this.data.getUint32(wkb.Type.b.Int8 + wkb.Type.b.Uint32);
    },

    byteOffset : function(){
      return wkb.Type.b.Int8 + wkb.Type.b.Uint32 * 2;
    },

    byteLength : function(){
      return this.byteOffset() + this.geometries.reduce(function(memo, ring){ return ring.byteLength() + memo; }, 0);
    },

    parse : function(){
      wkb.Utils.assert(this.data.getUint32(1) !== wkb.Type.k.wkbUnknown, "Geometry is an abstract type");
      wkb.Utils.assert(this.data.getUint32(1) === this.type, "Wrong type for " + this);
      var offset = this.byteOffset();
      for(var i = 0; i < this.numGeometries(); i++){
        var child = this._child.parseWKB(new DataView(this.data.buffer, this.data.byteOffset + offset));
        this.geometries.push(child);
        offset = child.byteLength() + offset;
      }
    }
  }
});

wkb.Geometry.registerParser("WKT", function(text){});

wkb.Geometry.registerParser("JSON", function(json){});

