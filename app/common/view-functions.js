// This should move in the view folder or else stay in common

var appUrl = window.location.origin;
var viewFunctions = {
   renderPollList: function renderPollList (element,pollAry) {
      console.log("viewFunctions:renderPollList() invoked")
      element.innerHTML += "<ol>";
      pollAry.forEach(function(poll) {
        viewFunctions.renderPoll(element,poll)  
      })
      element.innerHTML += "</ol>";
   },
   renderPoll: function renderPoll (element,poll) {
      console.log("viewFunctions:renderPoll() invoked")
      console.log(poll.github.displayName)
      element.innerHTML += "<li>"+poll.poll.question+" 1)"+poll.poll.options[0]+" 2)"+poll.poll.options[1]+" posted by "+poll.github.displayName+"</li>";
   }
};