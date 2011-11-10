var binAjax = function(method, url, cb, err){
  err = (err || function(){});
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function(e){
    if(e.target.status == "200")
      cb(e.target);
    else
      err(e.target);
  }, false);
  xhr.open(method, url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined');

  xhr.responseType = "arraybuffer";
  xhr.send(null);
};

var closeEnough = function(one, other){
  return Math.abs(one - other) < 1e-6;
};
