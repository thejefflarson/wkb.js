wkb.Mixins.Reader = {
  advance : function(by){
    return this.offset = this.offset + by;
  },

  rewind : function(by){
    return this.advance(by * -1);
  },

  reset : function(){
    return this.rewind(this.offset);
  }
}