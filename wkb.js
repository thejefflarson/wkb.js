(function(){
  var wkb;
  if (typeof exports !== 'undefined') {
    wkb = exports;
  } else {
    wkb = this.wkb = {};
  }

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
      var child = inherits(this, proto);
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
      child.protoype.constructor = child.constructor;

      wkb.Utils.mixin(child.prototype, proto);
      child.__super__ = parent.prototype;
      return child;
    }
    // take a look at endiannes: http://svn.osgeo.org/postgis/trunk/raster/rt_core/rt_api.c
  };
})();
wkb.Factory = function(wkb){
  this.data = new DataView(wkb);
};

wkb.Utils.mixin(wkb.Factory.prototype, wkb.Mixins.Reader, {
  parseWKT : function(data){
    return this._dispatch(data, 'fromWKT');
  },

  parseWKB : function(data){
    return this._dispatch(data, 'fromWKB');
  },

  _dispatch : function(data, func){
    this.advance(this.UINT8);
    var n, num = this._getU32();
    switch(num){
      case wkb.Type.k.wkbPoint:
        return wkb.Point[func];
      case wkb.Type.k.wkbLineString:
        return wkb.LineString[func];
      case wkb.Type.k.wkbPolygon:
        return wkb.Type.k.Polygon[func];
      case wkb.Type.k.wkbMultiLineString:
        return wkb.MultiLineString[func];
      case wkb.Type.k.wkbMultiPolygon:
        return wkb.MultiPolygon[func];
      case wkb.Type.k.wkbGeometryCollection:
        return wkb.GeometryCollection[func];
      default:
        wkb.Utils.assert(false, "Unknown geometry type");
    }
  }
});
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
wkb.LinearRing = wkb.Geometry.extend({
  constructor : function(data, endian){
    wkb.Geometry.call(this, data);
    this.endian = function(){ return endian; };
    this.points = [];
  },

  type : wkb.k.LinearRing,

  numPoints : function(){
    return this.points.length;
  }
});

wkb.Polygon.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    numPoints : function(){
                              // endian offset
      return this.data.getUInt32(wkt.Type.b.Int8, this.endian());
    },

    byteOffset : function(){
           //endian + numPoints * 2 * double
      return wkt.Type.b.Int8 + wkt.Type.b.UInt32 +
              this.numPoints() * 2 * wkt.Type.b.Float32 - wkt.Type.b.Int8;
    },

    _parse : function(){

    }
  });
});
wkb.LinearRing = wkb.Geometry.extend({
  type : wkb.k.LinearRing
});
wkb.Polygon = wkb.Geometry.extend({
  constructor : function(){
    wkb.Geometry.call(this, arguments);
    this.rings = [];
  },
  type : wkb.Types.k.wkbPolygon,

  numRings : function(){
    return this.rings.length;
  }
});

// templates
wkb.Polygon.registerParser("WKB", function(instance){
  wkb.Utils.mixin(instance, {
    endian : function(){
      return !!this.data.getUInt8(0);
    },

    numRings : function(){
                                 // endian +       numrings + type   - zero_index
      return this.data.getUInt32(wkt.Type.b.Int8 + wkt.Type.b.UInt32 - wkt.Type.b.Int8, this.endian());
    },

    byteOffset : function(){
      return wkt.Type.b.Int8 + wkt.Type.b.UInt32 * 2  - wkt.Type.b.Int8;
    },

    _parse : function(){
      wkb.Utils.assert(this.data.getUInt8(1) == this.type, "Wrong type for Polygon");
      var offset = this.byteOffset;
      for(var i = 0; i < this.numRings(); i++){
        var ring = new LineString(new DataView(this.data.buffer, offset));
        this.rings.push(ring);
        offset = ring.byteOffset() + offset;
      }
    }
  });
});

wkb.Polygon.registerParser("WKT", function(text){
  wkb.Utils.mixin(instance, {
    rings : function(){

    }
  });
});

wkb.Polygon.registerParser("JSON", function(json){
  wkb.Utils.mixin(instance, {
    rings : function(){

    }
  });
});
wkb.Mixins.Reader = {
  offset : 0,

  advance : function(by){
    return (this.offset = this.offset + by);
  },

  rewind : function(by){
    return this.advance(by * -1);
  },

  reset : function(){
    return this.rewind(this.offset);
  },

  _getU32 : function(){
    var num = this.dv.getUint32(this.offset);
    this.advance(this.UINT32);
    return num;
  }
};
