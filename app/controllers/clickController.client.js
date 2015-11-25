'use strict';

(function () {
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/clicks';
   
   var pollList = document.querySelector('#poll-list');
   var pollUrl = appUrl + '/poll/list'
   //var apiUrl = 'https://clementine-fcc-cornjacket.c9users.io/api/clicks';
   
   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }   
   
   function updatePollList (data) {
      var pollAry = JSON.parse(data)
      viewFunctions.renderPollList(pollList,pollAry)
   }
   

   // when DOM loads, go ahead and get poll list from server
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollUrl, updatePollList));   
   
   // when DOM loads, go ahead and get click count from server
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));
   
   // when user hits add button, post it to server, then call get,
   // and when get completes, go ahead and update the click count
   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
      });

   }, false);   
   
   // when user hits reset button, send delete to server, then call get,
   // and when get completes, go ahead and update the click count
   deleteButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);   
   
})();