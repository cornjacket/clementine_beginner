// This should move in the view folder or else stay in common

var appUrl = window.location.origin; // this is also in ajaxFunctions, so is it really necessary?
var viewFunctions = {
   renderPollList: function renderPollList (element,pollAry) {
      console.log("viewFunctions:renderPollList() invoked")
      element.innerHTML += "<ol>";
      pollAry.forEach(function(poll,index,array) {
        viewFunctions.renderPoll(element,index,poll)
      })
      element.innerHTML += "</ol>";
 
 
 
      // attach handlers - why don't i have the closure issue that i expected
/*
      pollAry.forEach(function(poll,index,array) {
        var element= document.querySelector('#poll_'+index+'_option0')
        element.addEventListener('click', function () {

          console.log("ViewFunctions: #poll_"+index+"_option0 has been clicked!!!")
          //ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
          //   ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
          //});

        }, false); 
      })
*/
      
/*
      var element = document.querySelector('#poll_0_option0')
      element.addEventListener('click', function () {

        console.log("ViewFunctions: #poll_0_option0 has been clicked!!!")
        //ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
        //   ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
        //});

      }, false);     
*/
      
      
   },
   renderPoll: function renderPoll (element,poll_index,poll) { // for now using array index as id of poll
      
      console.log("viewFunctions:renderPoll() invoked")
      console.log("**********************************")
      console.log(poll)
      console.log(poll.github.name)
      var poll_id = "poll_"+poll_index
      var poll_option0_id = poll_id+"_option0"
      var poll_option1_id = poll_id+"_option1"      
      element.innerHTML += "<div id="+poll_id+">"
      element.innerHTML +=   "<li>"+poll.poll.question+" posted by "+poll.github.name // later change this to a link to the profile
      element.innerHTML +=     "<div id='"+poll_option0_id+"'> 1) "+poll.poll.options[0]+"</div>"
      element.innerHTML +=     "<div id='"+poll_option1_id+"'> 2) "+poll.poll.options[1]+"</div>"
      element.innerHTML +=   "</li>";
      element.innerHTML += "</div>"
      
      //viewFunctions.createOnClickHandler(poll_option0_id,0,0)
      //viewFunctions.createOnClickHandler(poll_option1_id,0,0)
      
   },// below is not working
   createOnClickHandler: function (elementId,poll_id,user_id) { // later add in poll database id so we can reference db: also need an option number
     console.log("viewFunctions: createOnClickHandler() invoked with elementId = "+elementId)
     var apiUrl = appUrl + '/api/:id';
     var element = document.querySelector('#'+elementId)
     element.addEventListener('click', function () {

        console.log("ViewFunctions: Element has been clicked!!!")
      //ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
      //   ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
      //});

   }, false); 
   
   
   }
   
   
   
};