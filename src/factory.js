wkb.Factory = function(wkb){
  this.dv = new DataView(wkb);
}

wkb.Factory.prototype = wkb.Utils.extend(wkb.Factory.prototype, wkb.Mixins.Reader, {
  parse : function(){
    return this._dispatch();
  },

  _dispatch : function(){
    switch(num){
      case 1: // point
        console.log("point");
        break;
      case 2: // linestring
        console.log("linestring");
        break;
      case 3: // poly
        n = this._getU32();
        for(var i=0; i < n; i++)
          this._plotPart();
        break;
      case 6: // multipoly
        n = this._getU32();
        for(var i=0; i < n; i++)
          this._dispatch();
    }
  }
}