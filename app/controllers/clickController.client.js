'use strict';

(function () {
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = 'https://clementine-fcc-cornjacket.c9users.io/api/clicks';
   
 

   
   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }   
   
   // when DOM loads, go ahead and get click count from server
   ready(ajaxRequest('GET', apiUrl, updateClickCount));
   
   // when user hits add button, post it to server, then call get,
   // and when get completes, go ahad and update the click count
   addButton.addEventListener('click', function () {
      console.log("client: addButton invoked")
      ajaxRequest('POST', apiUrl, function () {
         console.log("client: POST handler invoked")
         ajaxRequest('GET', apiUrl, updateClickCount)
      });

   }, false);   
   
   // when user hits reset button, send delete to server, ten call get,
   // and when get completes, go ahead and update the click count
   deleteButton.addEventListener('click', function () {
      console.log("client: deleteButton invoked")
      ajaxRequest('DELETE', apiUrl, function () {
         console.log("client: DELETE handler invoked")
         ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);   
   
})();