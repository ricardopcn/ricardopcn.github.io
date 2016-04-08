var yourtext = document.getElementById('yourtext');
var len = document.getElementById('len');
var words = document.getElementById('words');

yourtext.onkeyup = function() {

	len.innerHTML = yourtext.value.length;

	if (yourtext.value.length == 0) {
		words.innerHTML = "0 palavras";
	} else if (yourtext.value.split(" ").length == 1) {
		words.innerHTML = yourtext.value.split(" ").length + " palavra";
	} else {
		words.innerHTML = yourtext.value.split(" ").length + " palavras";
	}

	// email
	var email = document.getElementById('email');

	if (yourtext.value.length == 0) {
		email.innerHTML = "não sei, digite um texto";
	} else if (yourtext.value.length <= 50) {
		email.innerHTML = "pode usar";
	} else {
		email.innerHTML = "não use, o gmail vai cortar o seu assunto";
	}

	// twitter
	var tweet = document.getElementById('tweet');

	if (yourtext.value.length == 0) {
		tweet.innerHTML = "não sei, digite um texto";
	} else if (yourtext.value.length <= 140) {
		tweet.innerHTML = "pode usar";
	} else {
		tweet.innerHTML = "não use, o Twitter só permite 140 caracteres";
	}

	// page title

	var pageTitle = document.getElementById('pageTitle');

	if (yourtext.value.length == 0) {
		pageTitle.innerHTML = "não sei, digite um texto";
	} else if (yourtext.value.length <= 55) {
		pageTitle.innerHTML = "pode usar";
	} else {
		pageTitle.innerHTML = "não use, o Google corta títulos após um determinado tamanho de título. O recomendado é manter até 55 caracteres";
	}

	// meta description

	var metaDescription = document.getElementById('metaDescription');

	if (yourtext.value.length == 0) {
		metaDescription.innerHTML = "não sei, digite um texto";
	} else if (yourtext.value.length <= 160) {
		metaDescription.innerHTML = "pode usar";
	} else {
		metaDescription.innerHTML = "não use, o recomendado para o Google não cortar descrições longas é mantê-la com até 160 caracteres";
	}

	// promote no Facebook

}
