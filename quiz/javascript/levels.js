app = angular.module("quizlet");

app.factory("levels", function() {
  var levels = [
    {
      minimun_score: 0,
  		title: "Coroinha",
  		text: "Você começou agora sua carreira no Marketing em Redes Sociais. Continue firme e forte!",
      image: "images/freshman.png"
  	},
    {
      minimun_score: 4,
  		title: "Expert",
  		text: "Você já aprendeu o essencial, está pronto para seguir seu caminho para ser o próximo Mark Zuckerberg!",
      image: "images/graduated.png"
  	}
  ];

  return {
		getLevel: function(score) {
      filtered = levels.filter(function(level) {
        return score >= level.minimun_score;
      });

      console.log(filtered);

      return filtered[filtered.length - 1];
		}
  };
});
