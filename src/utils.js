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

    inherits : function(parent, proto){
      var child;
      if(child.hasOwnProperty('constructor')) {
        child = child.constructor
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.protoype.constructor = child.constructor;
      wkb.Utils.mixin(child.prototype, proto);
      child.__super__ = parent.prototype;
      return child;
    }
  }
});