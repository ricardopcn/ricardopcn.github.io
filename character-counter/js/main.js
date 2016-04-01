var yourtext = document.getElementById('yourtext');
var len = document.getElementById('len');

yourtext.onkeyup = function() {

	len.innerHTML = yourtext.value.length;

	// email
	var email = document.getElementById('email');

	if (yourtext.value.length = 0) {
		email.innerHTML = "não sei, digite um texto";
	} else if (yourtext.value.length <= 50) {
		email.innerHTML = "pode usar";
	} else {
		email.innerHTML = "não use, o gmail vai cortar o seu assunto";
	}

	// twitter
	var email = document.getElementById('tweet');

	if (yourtext.value.length = 0) {
		email.innerHTML = "não sei, digite um texto";
	} else if (yourtext.value.length <= 140) {
		email.innerHTML = "pode usar";
	} else {
		email.innerHTML = "não use, o Twitter só permite 140 caracteres";
	}

}