wkb.Utils = {
  extend : function(obj){
    var others = [].slice.call(arguments,1);
    others.forEach(function(other){
      for(var j in other) obj[j] = other[j];
    });
    return obj;
  }
}