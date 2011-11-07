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

wkb.debug = function(flag){
  wkb.Utils.debug = !!flag;
};
