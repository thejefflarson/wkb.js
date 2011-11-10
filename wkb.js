(function(){
  var wkb;
  if (typeof exports !== 'undefined') {
    wkb = exports;
  } else {
    wkb = this.wkb = {};
  }
  wkb.root = this;
  wkb.VERSION = "0.0.1";
}).call(this);
wkb.Type = {
  k : {
    wkbPoint: 1,
    wkbLineString: 2,
    wkbPolygon: 3,
    wkbMultiPoint: 4,
    wkbMultiLineString: 5,
    wkbMultiPolygon: 6,
    wkbGeometryCollection: 7,
    wkbUnknown: 0,
    wkbLinearRing: 101
  },

  b : {
    Int8:    1, // char
    Uint8:   1, // unsigned char
    Int16:   2, // short
    Uint16:  2, // unsigned short
    Int32:   4, // int
    Uint32:  4, // unsigned int
    Float32: 4, // float
    Float64: 8  // double
  },

  c : {
    
  },
  // TODO: remove ecmascript 5 reduce and keys.
  toString : function(id){
    var arr = Object.keys(this.k).reduce(function(memo, k){
      memo[wkb.Type.k[k]] = k;
      return memo;
    }, []);
    return arr[id];
  }
};
wkb.Utils = (function(){
  var ctor = function(){};
  return {
    mixin : function(obj){
      var others = [].slice.call(arguments,1);
      others.forEach(function(other){
        for(var j in other)
          if(other[j] !== void 0) obj[j] = other[j];
      });
      return obj;
    },

    extend : function(proto) {
      var child = wkb.Utils.inherits(this, proto);
      child.extend = this.extend;
      return child;
    },

    debug : true,

    assert : function(qualifier, message){
      if(!qualifier && this.debug) throw new Error(message);
    },

    inherits : function(parent, proto){
      var child;

      if(proto.hasOwnProperty('constructor')) {
        child = proto.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }
      wkb.Utils.mixin(child, parent);

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.prototype.constructor = child;

      wkb.Utils.mixin(child.prototype, proto);
      child.__super__ = parent.prototype;
      return child;
    }
    // take a look at endiannes: http://svn.osgeo.org/postgis/trunk/raster/rt_core/rt_api.c
  };
})();

wkb.debug = function(flag){
  wkb.Utils.debug = !!flag;
};
wkb.Factory = function(){};

wkb.Utils.mixin(wkb.Factory.prototype, {
  parseWKT : function(data){
    return this._dispatch(data, 'parseWKT');
  },

  parseWKB : function(data){
    wkb.Utils.assert(wkb.root.DataView, "Can't parse Binary without DataView");
    data = new DataView(data);
    return this._dispatch(data, data.getUint32(1), 'parseWKB');
  },

  _dispatch : function(data, num, func){
    switch(num){
      case wkb.Type.k.wkbPoint:
        return wkb.Point[func](data);
      case wkb.Type.k.wkbLineString:
        return wkb.LineString[func](data);
      case wkb.Type.k.wkbPolygon:
        return wkb.Type.k.Polygon[func](data);
      case wkb.Type.k.wkbMultiLineString:
        return wkb.MultiLineString[func](data);
      case wkb.Type.k.wkbMultiPolygon:
        return wkb.MultiPolygon[func](data);
      case wkb.Type.k.wkbGeometryCollection:
        return wkb.GeometryCollection[func](data);
      default:
        wkb.Utils.assert(false, "Unknown geometry type");
    }
  }
});
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
        : "") + ">";
  }
});

wkb.Geometry.extend = wkb.Utils.extend;

wkb.Utils.mixin(wkb.Geometry, {
  registerParser : function(type, fn){
    this["parse" + type] = function(data) {
      var instance = new (this.prototype.constructor)(data);
      var mixin = fn(instance);
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

wkb.Point = wkb.Geometry.extend({
  type : wkb.Type.k.wkbPoint,
  toString : function(){
    return "<" + wkb.Type.toString(this.type) + " x=" + this.getX() + " y=" + this.getY();
  }
});

wkb.Point.registerParser("WKB", function(instance){
  return {
    getX : function(){
      return this.data.getFloat64(0);
    },

    getY : function(){
      return this.data.getFloat64(wkb.Type.b.Float64);
    }
  };
});
wkb.LinearRing = wkb.Geometry.extend({
  type : wkb.Type.k.wkbLinearRing,
  _child : wkb.Point
});

wkb.LinearRing.registerParser("WKB", function(instance){
  return {
    numGeometries : function(){
      return this.data.getUint32(0);
    },

    byteLength : function(){
             // numPoints * 2 * double
      return wkb.Type.b.Uint32 + this.numGeometries() * 2 * wkb.Type.b.Float64;
    },

    pointAt : function(idx){
      wkb.Utils.assert(idx < this.numGeometries(), "Out of range.");
      return wkb.Point.parseWKB(new DataView(this.data.buffer, 
        this.data.byteOffset + wkb.Type.b.Uint32 + wkb.Type.b.Float64 * 2 * idx));
    }
  };
});
wkb.LineString = wkb.Geometry.extend({
  type : wkb.Type.k.LineString,
  _child : wkb.Point
});
wkb.Polygon = wkb.Geometry.extend({
  type : wkb.Type.k.wkbPolygon,
  _child : wkb.LinearRing
});
wkb.MultiPolygon = wkb.GeometryCollection.extend({
  type : wkb.Type.k.wkbMultiPolygon,
  _child : wkb.Polygon
});
wkb.GeometryCollection = wkb.Geometry.extend({
  type : wkb.Type.k.GeometryCollection
});
