var parseQueryData = function(query) {
  var data = {};
  if (!query) { return data; }
  var vars = atob(query).split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof data[pair[0]] === "undefined") {
      data[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof data[pair[0]] === "string") {
      var arr = [ data[pair[0]],decodeURIComponent(pair[1]) ];
      data[pair[0]] = arr;
    } else {
      data[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return data;
};

var HashData = function () {
  var data = {};
  var raw = window.location.hash || window.location.search;
  var queryStart = raw.indexOf("?");
  data.location = "";

  if (raw.indexOf("#") === 0) {
    data.location = queryStart !== -1 ? raw.substr(1, queryStart - 1) : raw.substr(1);
  }

  data.params = {};
  if (queryStart !== -1) {
    data.params = parseQueryData(raw.substr(queryStart + 1));
  }
  return data;
}();

var toHashParams = function() {
  var str = "#";
  if (HashData.location) {
    str += HashData.location;
  }
  if (HashData.params) {
    str += "?" + btoa(toUrlParams(HashData.params));
  }
  return str;
};

var toUrlParams = function(data) {
  var str = "";
  for (var key in data) {
      if (str !== "") { str += "&"; }
      if (key.trim() && (data[key] + '').trim()) {
        str += key + "=" + encodeURIComponent(data[key]);
      }
  }
  return str;
};
