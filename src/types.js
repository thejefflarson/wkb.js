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
