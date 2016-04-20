function trackearUrl() {
  var link        = document.getElementById("link").value;
  var medium      = removeAccents(document.getElementById("medium").value);
  var source      = removeAccents(document.getElementById("source").value);
  var campaign    = removeAccents(document.getElementById("campaign").value);

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


function removeAccents (str){

  str = str.toString().toLowerCase().trim();

  // remove accents, swap ñ for n
  var from = "àáäâèéëêìíïîòóöôùúüûñç";
  var to   = "aaaaeeeeiiiioooouuuunc";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(
      new RegExp(from.charAt(i), 'g'),
      to.charAt(i)
    );
  }

  //str = str.replace(new RegExp(" ", 'g'),"_")
  str = str.replace(new RegExp(/\W/, 'g'),"_");

  return str;
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
