'use strict';

(function () {
   var pollList = document.querySelector('#poll-list') || null;
   var userPollList = document.querySelector('#user-poll-list') || null;
   var pollListlUrl = appUrl + '/poll/list'
   var userPollListUrl = appUrl + '/poll/list/:id' // how does the userid get passed into the :id as opposed to the poll_id?
   
   function updatePollList (data) {
      var pollAry = JSON.parse(data)
      viewFunctions.renderPollList(pollList,pollAry)
   }   
   
   if (pollList !== null) {
     // when DOM loads, go ahead and get poll list from server
     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollListUrl, updatePollList));     
   }

   if (userPollList !== null) {
     // when DOM loads, go ahead and get poll list from server
     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userPollListUrl, updateUserPollList));
   }

})();