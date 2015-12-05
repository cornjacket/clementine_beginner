'use strict';

(function () {

   angular
      .module('clementineApp', ['ngResource', 'ngAnimate', 'ui.bootstrap'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {
         
        $scope.pollHeader = "All Polls"
        $scope.displayAllPolls = true
        $scope.polls_length    = 0 
        $scope.isLoggedIn      = false
        $scope.hasVotedForPoll = []  // ary of boolean indicating whether user has voted for the i'th poll
        $scope.aggregate_votes = []  // ary of aggregate votes for the i'th poll
        $scope.isPollAuthoredByUser = [] // ary of boolean indicating whether user is the author of the poll
        
        // A list of indices so that I can use ng-repeat to reference each option
        $scope.new_poll_indices = [0, 1] // by default new polls will start out with 2 options
        $scope.next_poll_option = 2 // adding
        $scope.new_poll_options = [ "", ""]
        
        $scope.isPollDeleted = [] // locally keep track if author deletes the poll
        
console.log("CLIENT HAS STARTED")

        var countVotes = function() {
            
           // iterate through each poll and then iterate through each votes subarray and sum and store
           // note that each votes[] subarray contains the id's for users that have voted for that respected
           // option. Therefore determining the vote count equates to taking the length of the array.
           $scope.aggregate_votes = []
           console.log("countVotes() invoked")
              $scope.polls.forEach(function(item,poll_index,ary) {
                //$scope.aggregate_votes.push([])
                console.log(item.poll.question)
                var new_poll_votes = new Array()
                console.log("Voting list")
                item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                    console.log(vote_index+" "+vote_ary)
                    new_poll_votes.push(vote_ary.length)
                })
                $scope.aggregate_votes.push(new_poll_votes)
                console.log("countVotes(): ")
                console.log($scope.aggregate_votes)
              })

        }

        // this checks the hasAlreadyVoted[] array
        var updateHasAlreadyVoted = function() {
            
            console.log("updateHasAlreadyVoted() invoked")
            console.log("SCOPE.ID = "+$scope.id)
              $scope.polls.forEach(function(item,poll_index,ary) {
                //console.log(item.poll.question)
                //console.log(ary[poll_index].poll.question)
                var alreadyVoted = false
                
                //console.log("Voting list")
                item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                    //console.log(vote_index+" "+vote_ary)
                    if (vote_ary.indexOf($scope.id) != -1) {
                        //console.log("Found a vote. This has been already voted on.")
                        alreadyVoted = true
                    }
                })
                $scope.hasVotedForPoll[poll_index] = alreadyVoted // this should work out of the box
              })
              console.log("$scope.hasVotedForPoll")
              console.log($scope.hasVotedForPoll)
            
        }

        var initIsPollDeleted = function() {
          console.log("initIsPollDeleted() invoked")
          $scope.polls.forEach(function(item,poll_index,ary) {
              $scope.isPollDeleted[poll_index] = false
            })
        }

        // Becareful, user has to be defined to run this function
        // fill $scope.pollAuthoredByUser which is used in view
        var determinePollsAuthoredByUser = function(){
          console.log("determinePollsAuthoredByUser() invoked")
          $scope.polls.forEach(function(item,poll_index,ary) {
            console.log(item.author.github_id+" vs "+$scope.id)
              $scope.isPollAuthoredByUser[poll_index] = $scope.isLoggedIn  ? (item.author.github_id === $scope.id) : false
            })
          console.log("$scope.id = "+$scope.id)
          console.log($scope.isPollAuthoredByUser)
        }


        var User = $resource('/api/user/:id');

        var Poll = $resource('/api/polls/:id', { id: '@_id' }, {
                     update: {
                       method: 'PUT' // this method issues a PUT request
                     }
                   })

        $scope.addOption = function () {
           console.log("$scope.addOption() invoked")
           console.log($scope.new_poll_indices)
           $scope.new_poll_indices.push($scope.next_poll_option++) 
           //$scope.new_poll_options = [ "", ""] not sure how to use this. is this an ng-model thing
           
        }
     
        $scope.getUser = function (callback) {
           console.log("getUser() invoked")
           console.log("GETUSER() $scope.id = "+$scope.id)
           User.get({ id: $scope.id }, function (results) {  // dont think scope.id is really necessary here. Remove and see what happens
              console.log("User results")
              console.log(results)
              $scope.name = (results.displayName !== null) ? results.displayName : results.username
              $scope.displayName = (results.displayName !== null) ? results.displayName : "none"
              $scope.id = results.id
              $scope.username = results.username
              $scope.publicRepos = results.publicRepos
              $scope.isLoggedIn = results.username !== undefined // testing - why is a html page being sent to client
              console.log("isLoggedIn = "+$scope.isLoggedIn)
              console.log("username = "+results.username)
              console.log("name")
              console.log($scope.name)
              callback()
              
           })
        }
        
        

// Technically I should be using Poll.query() since I am getting all the polls, though my implementation does work.
// Something to refactor later. - but to make this change I believe that the Poll url should include :id
        $scope.getPolls = function() {
          console.log("getPolls() invoked")
          //Poll.get({ id: $scope.id }, function(results) { // there is no need for any id when grabbing all the polls
          Poll.get( {}, function(results) {
          //$scope.polls = Poll.query( function() { //(results) {
              $scope.polls = results.data
              $scope.polls_length = $scope.polls.length
              // lets go through all the polls and see if the user has already voted by inspecting the votes
              updateHasAlreadyVoted()
              countVotes() 
              determinePollsAuthoredByUser()
              initIsPollDeleted()
              //console.log("Poll results")
              //console.log($scope.polls)
          })
        }
 
        // Now vote() explicitly checks to see whether or not the user has voted on a poll instead of
        // assuming the gui will not display the vote button. We should assume there will be bugs in the code
        // and that we will need multiple safeguards to prevent voter fraud. :)
        $scope.vote = function(poll_number, option_number) {
          console.log("vote(): invoked") 
          if ($scope.hasVotedForPoll[poll_number] === false) {
            if ($scope.polls[poll_number].poll.votes[option_number].indexOf($scope.id) === -1) {
              $scope.polls[poll_number].poll.votes[option_number].push($scope.id)
              console.log("You just voted for poll "+poll_number+" option "+option_number)
              $scope.hasVotedForPoll[poll_number] = true
              // update the count - for now lets just call count, later I can forcibly increment aggregate_count ary
              $scope.aggregate_votes[poll_number][option_number]++  // maybe this should be a function
              //countVotes()
              console.log("scope.polls")
              console.log($scope.polls)
              console.log("scope.polls[poll_number]")
              console.log($scope.polls[poll_number])
              console.log($scope.polls[poll_number]._id)

              // Now call update passing in the ID first then the object you are updating
              Poll.update({ id:$scope.polls[poll_number]._id }, $scope.polls[poll_number]);          
              // currently no callback for update. hasVotedForPoll get updated in client prior to the Poll.update call
              console.log("vote(): hasVotedForPoll[]")
              console.log($scope.hasVotedForPoll)
            } else {
                console.log("ERROR: vote(): trying to vote when votes array already contains user.id")
                console.log("ERROR: "+$scope.polls[poll_number].poll.votes[option_number]+" "+$scope.id)
            }
          } else {
              console.log("ERROR: vote(): trying to vote when hasVotedForPoll["+poll_number+"] === "+$scope.hasVotedForPoll[poll_number])
          }
        }

        $scope.deletePoll = function(poll_index) {
            // need a safety precaution to check if user is author of poll to delete
            if ($scope.id === $scope.polls[poll_index].author.github_id) {
            // i could also put up a pop up confirming the deletion - not sure
            console.log("deletePoll() invoked")
            $scope.isPollDeleted[poll_index] = true
            $scope.polls_length--
            Poll.delete({ id:$scope.polls[poll_index]._id });   
            // persist deletion to database
            //console.log($scope.isPollDeleted)
            } else {
                // I can envision this happening while using $index
                console.log("ERROR: deletePoll("+poll_index+"). Trying to delete a poll by non-author")
                console.log($scope.id)
                console.log($scope.polls[poll_index].author.github_id)
            }
        }


/////////////////////////////

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.oneAtATime = true;


  $scope.status = {
    isopen: false
  };

  $scope.isCollapsed = true;

  /*$scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };*/

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
  
  $scope.setAllPolls = function(displayAllPolls) {
      // either display All Polls or My Polls
      console.log("setAllPolls() invoked")
      $scope.pollHeader = (displayAllPolls) ? "All Polls" : "My Polls"
      $scope.displayAllPolls = displayAllPolls
  }

/////////////////////////////


        $scope.getUser($scope.getPolls); // logic inside of getPolls depends on getUser completing

      }]);
   
})();