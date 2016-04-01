function trackearUrl() {
  var link        = document.getElementById("link").value;
  var medium      = document.getElementById("medium").value;
  var source      = document.getElementById("source").value;
  var campaign    = document.getElementById("campaign").value;

  var new_link  = link
  + "?utm_medium="
  + medium
  + "?utm_source="
  + source
  + "?utm_campaign="
  + campaign;

  document.getElementById("tracked_url").value = new_link;

  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').classList.add('show');

}



var clipboard = new Clipboard('.copy');

clipboard.on('success', function(e) {
  console.log(e);
  document.getElementById('copy-alert').classList.remove('hidden');
  document.getElementById('copy-alert').classList.add('show');
});

clipboard.on('error', function(e) {
  console.log(e);
});
