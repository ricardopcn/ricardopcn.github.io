app = angular.module("quizlet");

app.directive('quiz', function(questions, levels) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'quiz.html',
		link: function(scope, elem, attrs) {
			scope.send_to_rd_station = function(form_data){

				form_data.token_rdstation = "0ecea7a2c1f100242d91c98c4d9b7d6e";
				jQuery.ajax({
					type: 'POST',
					url: 'https://www.rdstation.com.br/api/1.2/conversions',
					data: form_data,
					crossDomain: true,
					error: function (response) {
						console.log(response);
					}
				});

			};

			scope.start = function() {

				scope.id = 0;

				scope.score = 0;
				scope.maximun_score = questions.length();
				scope.completed_percentage = 0;

				scope.wrong_questions = [];
				scope.strong_categories = questions.getCategories();
				scope.weak_categories = [];

				scope.quizOver = false;
				scope.inProgress = true;

				scope.shared = false;
				scope.social_text = "";

				var data_array = {
					// nome: 					 scope.name,
					email: 					 scope.email,
					//website:				 scope.website,
					//"area-de-atuacao-da-empresa": 		 scope.segment,
					identificador: 	 		 'iniciou-quiz'
				};

				scope.send_to_rd_station(data_array);

				window._fbq = window._fbq || [];
        window._fbq.push(['track', '6043231494321', {'value':'0.01','currency':'BRL'}]);

				ga('send', 'event', 'estagio_quiz', "iniciou");
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}

			scope.setOptions = function(options, answer) {
				var answerString = options[answer];
				var counter = options.length, temp, index;
				while (counter > 0) {
					index = Math.floor(Math.random() * counter);
					counter--;
					temp = options[counter];
					options[counter] = options[index];
					options[index] = temp;
				}

				scope.options = options;
				scope.answer = options.indexOf(answerString);
			}

			scope.getQuestion = function() {
				var question = questions.getQuestion(scope.id);

				if(question) {
					scope.question = question.question;
					scope.setOptions(question.options, question.answer);
					scope.category = question.category;
				} else {
					scope.level = levels.getLevel(scope.score);
					scope.social_text = "Fiz o Quiz e sou um " + scope.level.title +  ". Quer testar seu conhecimento?";
					scope.quizOver = true;
					scope.hideProgress = true;




					ga('send', 'event', 'estagio_quiz', "finalizou");

					var data_array = {
						// nome: 					 			scope.name,
						email: 					 			scope.email,
						// website:							scope.website,
						// "area-de-atuacao-da-empresa": 		 			scope.segment,
						quiz_pontuacao_mkt_redes_sociais:  		scope.score,
						quiz_nivel_mkt_redes_sociais:      		scope.level.title,
						quiz_fracos_mkt_redes_sociais:     		scope.weak_categories.toString(),
						quiz_fortes_mkt_redes_sociais:     		scope.strong_categories.toString(),
						identificador: 	 					'finalizou-quiz',
					};

					scope.send_to_rd_station(data_array);
				}
			};


			scope.makeCategoryWeak = function(category) {
				var index = scope.strong_categories.indexOf(category);

				if (index > -1) {
					scope.strong_categories.splice(index, 1);

					if (!scope.weak_categories.indexOf(category) > -1) {
						scope.weak_categories.push(category);
					}
				}
			};

			scope.checkAnswer = function() {
				if(!$('input[name=answer]:checked').length) return;

				var ans = $('input[name=answer]:checked').val();
				var answerStatus = "wrong";
				if(ans == scope.options[scope.answer]) {
					scope.score++;
					answerStatus = "right";
				} else {
					scope.makeCategoryWeak(scope.category);
					scope.wrong_questions.push(questions.getQuestion(scope.id));
				}
				ga('send', 'event', 'answers_by_level', "level " + scope.id, answerStatus);
				ga('send', 'event', 'answers_by_question', "question " + questions.getQuestion(scope.id).id, answerStatus);
				scope.nextQuestion();
			};

			scope.nextQuestion = function() {
				scope.completed_percentage = (scope.id + 1) * (100 / scope.maximun_score);

				scope.id++;
				scope.getQuestion();
			};

			scope.socialConversion = function(network_name) {
				scope.shared = true;

				var data_array = {
					// nome: 					 scope.name,
					email: 					 scope.email,
					// website:				 scope.website,
					// "area-de-atuacao-da-empresa": 		 scope.segment,
					// network_name:    network_name,
					identificador: 	 'compartilhou-quiz',
				};

				scope.send_to_rd_station(data_array);
			};

			scope.shareFacebook = function(){
				scope.socialConversion("Facebook");

				FB.ui({
					method: 'feed',
					link: 'http://quizdomarketingdigital.com.br/redes-sociais/?utm_medium=referral&utm_campaign=quiz-do-mkt-redes-sociais&utm_source=fb-share',
					name: scope.social_text,
					description: "Faça o quiz e descubra se você é o estagiário ou o Mark Zuckerberg das Redes Sociais.",
					picture: "http://quizdomarketingdigital.com.br/redes-sociais/" + scope.level.image

				}, function(response){
				});
			};

			scope.shareTwitter = function(){
				scope.socialConversion("Twitter");

				var shareText = scope.social_text + " http://bit.ly/quiz-mkt-redes-sociais via @resdigitais e @sprinklrbrasil";
				var url = "https://twitter.com/intent/tweet?text=" + shareText;
				window.open(url, "_blank");
			};

			scope.shareLinkedIn = function(){
				scope.socialConversion("LinkedIn");

				var url = "https://www.linkedin.com/shareArticle?mini=true";

				url += "&url=http://quizdomarketingdigital.com.br/redes-sociais/?utm_medium=referral&utm_campaign=quiz-do-mkt-redes-sociais&utm_source=in-share";
				url += "&title=Quiz do Marketing nas Redes Sociais";
				url += "&summary=" + scope.social_text;

				window.open(url, "_blank");
			};


			scope.reset();
		}
	}
});
