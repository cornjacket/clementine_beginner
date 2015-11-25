// This is not being used right now, the post wasnt being sent correctly.

'use strict';

(function () {
   var submitButton = document.querySelector('#submit-poll');
   var addButton = document.querySelector('#add-option');
   var question = document.querySelector('#question');
   var option1 = document.querySelector('#option1');
   var option2 = document.querySelector('#option2');
   var apiUrl = appUrl + '/poll/new';

   var numOptions = 0;
   
   // I need a function that will add another option to the list of options for the new poll
   // options should be placed within an array for later submission
   
   // I need a way to handle submission of a new poll
   
   /*
   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   } */  
   
   // when DOM loads, go ahead and get click count from server
   //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));
   
   submitButton.addEventListener('click', function () {

      var submission = {
         question: question.value,
         options: [option1.value, option2.value]
      }
      console.log(submission);
      console.log(question.value);
      console.log(option1.value);
      console.log(option2.value);
      console.log("clickPollController: submitButton clicked")
      //ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
      //   console.log("clickPollController: post ajax called")
      ////   ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
      //});
      ajaxFunctions.put(apiUrl, { data: "hello" }, function () {
         console.log("clickPollController: post ajax called")
      //   ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
      })

   }, false);   
   
   addButton.addEventListener('click', function () {

      numOptions++;
      console.log("clickPollController: addButton clicked")
      console.log("numOptions = "+numOptions)
      //ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
      //   ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      //});

   }, false);   
   
})();