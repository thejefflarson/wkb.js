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

    assert : function(){
      var args = [].slice.call(arguments);
      var message = args.pop();
      var go = false;
      for(var i = 0; i < args.length; i++)
        go = go && args[i];
      if(!go && this.debug) throw new Error(message);
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

  };
})();

wkb.debug = function(flag){
  wkb.Utils.debug = !!flag;
};
