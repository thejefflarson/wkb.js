wkb.Geometry = function(data){
  this.data = data;
  this.geometries = [];
};

wkb.Utils.mixin(wkb.Geometry.prototype, {
  type : wkb.Type.k.wkbUnknown,
  _child : null,
  toString : function(){
    var children = "";
    if(this.geometries && this.geometries.length > 0)
      children = " " + this.geometries.map(function(it){ return it.toString(); }).join(", ");

    return "<" + wkb.Type.toString(this.type) + children + ">";
  }
});

wkb.Geometry.extend = wkb.Utils.extend;

wkb.Utils.mixin(wkb.Geometry, {
  registerParser : function(type, fn){
    this["parse" + type] = function(data) {
      var instance = new (this.prototype.constructor)(data);
      var mixin = fn();
      wkb.Utils.mixin(instance, mixin);
      if(instance.parse) instance.parse();
      return instance;
    };
  }
});

// templates
wkb.Geometry.WKBTemplate = {
  endian : function(){
    return !!this.data.getUint8(0);
  },

  numGeometries : function(){
                               // type + numrings
    return this.data.getUint32(wkb.Type.b.Int8 + wkb.Type.b.Uint32, this.endian());
  },

  byteOffset : function(){
    return wkb.Type.b.Int8 + wkb.Type.b.Uint32 * 2;
  },

  byteLength : function(){
    return this.byteOffset() + this.geometries.reduce(function(memo, ring){ return ring.byteLength() + memo; }, 0);
  },

  _peekChild : function (){
    return this._child;
  },

  parse : function(){
    wkb.Utils.assert(this.data.getUint32(1, this.endian()) !== wkb.Type.k.wkbUnknown, "Geometry is an abstract type");
    wkb.Utils.assert(this.data.getUint32(1, this.endian()) === this.type, "Wrong type for " + this);
    var offset = this.byteOffset();
    for(var i = 0; i < this.numGeometries(); i++){
      var child = this._peekChild(offset).parseWKB(new DataView(this.data.buffer, this.data.byteOffset + offset));
      child.endian = this.endian();
      this.geometries.push(child);
      offset = child.byteLength() + offset;
    }
  }
};

wkb.Geometry.WKTTemplate = {
  parse : function(){

  }
}

wkb.Geometry.registerParser("WKB", function(instance){
  return wkb.Geometry.WKBTemplate;
});

wkb.Geometry.registerParser("WKT", function(text){
  return wkb.Geometry.WKTTemplate;
});

wkb.Geometry.registerParser("JSON", function(json){});

