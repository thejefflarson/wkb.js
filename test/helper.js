var str2buffer = function(str) {
    var idx, len = str.length, arr = new Array(len);
    for (idx = 0; idx < len; ++idx)
      arr[idx] = str.charCodeAt(idx) & 0xFF;
    // You may create an ArrayBuffer from a standard array (of values) as follows:
    return new Uint8Array(arr).buffer;
}
