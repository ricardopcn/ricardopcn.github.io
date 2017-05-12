app = angular.module("quizlet");

app.factory("questions", function() {

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  var selected_questions = [];

  $.each(questions, function(index, category) {
    var used_questions = [];

    for (i = 0; i < category.quantity; i++) {
      var selected_index = 0;

      do {
        selected_index = Math.floor(Math.random() * category.questions.length);
      }while($.inArray(selected_index, used_questions) != -1);

      var question = category.questions[selected_index];

      question.category = category.category;

      used_questions.push(selected_index);

      selected_questions.push(question);
    }

    used_questions = [];
  });

  shuffle(selected_questions);

  return {
    length: function() { return selected_questions.length; },
    getCategories: function () {
      var categories = [];

      $.each(questions, function(index, category) {
        categories.push(category.category);
      });

      return categories;
    },
		getQuestion: function(id) {
			if(id < selected_questions.length) {
				return selected_questions[id];
			} else {
				return false;
			}
		}
  };
});

var questions = [];

function parseData(data){
  var feedList = data.feed.entry,
      questList = [],
      catList = [];
  for (var i = 0; i< feedList.length; i++){

    var entryContent = feedList[i].content.$t;
    var quest = {};
    quest.id = i;
    quest.question = getStringBetween("h.question: ", ", h.right: ", entryContent);
    quest.options = [getStringBetween(", h.right: ", ", h.wrong1: ", entryContent),
                     getStringBetween(", h.wrong1: ", ", h.wrong2: ", entryContent),
                     getStringBetween(", h.wrong2: ", ", h.wrong3: ", entryContent),
                     getStringBetween(", h.wrong3: ", ", h.category: ", entryContent)];
    quest.answer = 0;
    quest.links = [{
        name: getStringBetween(", h.linkname: ", ", h.value: ", entryContent),
        link: getStringBetween(", h.link: ", ", h.linkname: ", entryContent)
    }];
    quest.value = getStringBetween(", h.value: ", ", h.quantity: ", entryContent);

    var category = getStringBetween(", h.category: ", ", h.link: ", entryContent);


    if (catList.indexOf(category) == -1){
      catList.push(category);
      var newCategory = {};
      newCategory.category = category;
      newCategory.quantity = getStringBetween(", h.quantity: ", "", entryContent);
      newCategory.questions = [quest];
      questions.push(newCategory);
    }else {
      questions[catList.indexOf(category)].questions.push(quest);
    }
  }
}

function getStringBetween (str1, str2, fullStr){
  var index1 = fullStr.indexOf(str1) + str1.length, index2;
  if (str2 == "") index2 = fullStr.length;
  else index2 = fullStr.indexOf(str2);
  return fullStr.slice(index1 , index2);
}
