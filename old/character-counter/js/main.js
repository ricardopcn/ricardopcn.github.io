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

	var feedbackObj = [
		{
			type: 'email',
			condition: 70,
			message:'O Gmail vai cortar sua mensagem acima de 70 caracteres :/'
		},
		{
			type: 'pageTitle',
			condition: 55,
			message:'55 caracteres é o recomendado para não ter seu título cortado pelo google na serp'
		},
		{
			type: 'tweet',
			condition: 140,
			message:'O twitter só aceita mensagens com até 140 caracteres'
		},
		{
			type: 'metaDescription',
			condition: 160,
			message:'Uma meta description deve conter até 160 caracteres'
		}
	];

	for (var i = 0; i < feedbackObj.length; i++) {
		setFeedeback(feedbackObj[i]);
	}

	function setFeedeback(obj){
		var el = document.getElementById(obj.type);

		if (yourtext.value.length == 0) {
			el.innerHTML = "não sei, digite um texto";
		} else if (yourtext.value.length <= obj.condition) {
			el.innerHTML = "pode usar";
		} else {
			el.innerHTML = obj.message;
		}
	}
}
