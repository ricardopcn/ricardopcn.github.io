
/* facebook */
function gerarLinkFacebook() {
  var fblink = document.getElementById("facebook").value;
  var newFbLink = 'https://www.facebook.com/sharer/sharer.php?u='
  + fblink;
  document.getElementById("facebookTrackedUrl").value = newFbLink;
  document.getElementById('facebookResult').classList.remove('hidden');
  document.getElementById('facebookResult').classList.add('show');
}

var clipboard = new Clipboard('.copyFB');

clipboard.on('success', function(e) {
  console.log(e);
  document.getElementById('copy-alert-fb').classList.remove('hidden');
  document.getElementById('copy-alert-fb').classList.add('show');
});

clipboard.on('error', function(e) {
  console.log(e);
});




/* twitter */
function gerarLinkTwitter() {
  var tweet = document.getElementById("twitter").value;
  var newTweet = 'http://twitter.com/intent/tweet?text='
  + encodeURI(tweet);

  document.getElementById("twitterTrackedUrl").value = newTweet;
  document.getElementById('twitterResult').classList.remove('hidden');
  document.getElementById('twitterResult').classList.add('show');
}

var clipboard = new Clipboard('.copyTw');

clipboard.on('success', function(e) {
  console.log(e);
  document.getElementById('copy-alert-tw').classList.remove('hidden');
  document.getElementById('copy-alert-tw').classList.add('show');
});




/* linkedin */
function gerarLinkLinkedin() {
  var inlink = document.getElementById("Linkedin").value;
  var inTitle = document.getElementById("Linkedin-title").value;
  var newInLink = 'https://www.linkedin.com/shareArticle?mini=true&url='
  + inlink
  +'&title='
  + inTitle;
  document.getElementById("linkedinTrackedUrl").value = newInLink;
  document.getElementById('linkedinResult').classList.remove('hidden');
  document.getElementById('linkedinResult').classList.add('show');
}

var clipboard = new Clipboard('.copyIN');

clipboard.on('success', function(e) {
  console.log(e);
  document.getElementById('copy-alert-in').classList.remove('hidden');
  document.getElementById('copy-alert-in').classList.add('show');
});
