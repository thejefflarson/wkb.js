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
