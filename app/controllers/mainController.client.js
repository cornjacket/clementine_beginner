'use strict';

(function () {

   angular
      .module('pollPosition')
      .controller('mainController', ['$scope', '$resource', '$http', function ($scope, $resource, $http) {
         
        $scope.pollHeader = "All Polls"
        $scope.displayAllPolls = true
        $scope.num_polls       = 0 
        $scope.isLoggedIn      = false
        $scope.polls           = [] 
        
        console.log("CLIENT HAS STARTED")

        var countVotes = function(poll) {
            
           // iterate through each votes subarray and sum and store
           // note that each votes[] subarray contains the id's for users that have voted for that respected
           // option. Therefore determining the vote count equates to taking the length of the array.
           // Note that now I am storing the vote count so we dont need to count votes. ie. following code
           // can be simplified. 
           console.log("countVotes() invoked")
                console.log(poll.item.poll.question)
                var new_poll_votes = new Array()
                console.log("Voting list")
                poll.item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                    console.log(vote_index+" "+vote_ary)
                    new_poll_votes.push(vote_ary.length)
                })
                poll.aggregate_votes = new_poll_votes

        }


        var setGithubUserImage = function(poll) {
          return $http.get("https://api.github.com/users/" + poll.item.author.username)
                  .then(function(response){
                     console.log(response.data.avatar_url)
                     poll.img = response.data.avatar_url
                  });
        };

        var updateHasAlreadyVoted = function(poll) { // should take id as a parameter
            
            console.log("_updateHasAlreadyVoted() invoked")
            console.log("SCOPE.ID = "+$scope.id)
                var alreadyVoted = false
                
                poll.item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                    if (vote_ary.indexOf($scope.id) != -1) {
                        poll.has_voted_for_option[vote_index] = true
                        alreadyVoted = true
                    } else {
                        poll.has_voted_for_option[vote_index] = false
                    }
                })
                poll.hasVotedForPoll = alreadyVoted // this should work out of the box
            
        }


        // Becareful, user has to be defined to run this function
        // fill $scope.pollAuthoredByUser which is used in view
        var determinePollAuthoredByUser = function(poll){
          console.log("_determinePollsAuthoredByUser() invoked")
          poll.isPollAuthoredByUser = $scope.isLoggedIn  ? (poll.item.author.github_id === $scope.id) : false
        }


        var User = $resource('/api/user/:id');

        var Users = $resource('/api/users/:id'); // I need to revisit why this behavior is happening. Maybe inspect mean.js code

        var Poll = $resource('/api/polls/:id', { id: '@_id' }, {
                     update: {
                       method: 'PUT' // this method issues a PUT request
                     }
                   })

        $scope.addOption = function () {
           console.log("$scope.addOption() invoked")
           console.log($scope.new_poll_indices)
           $scope.new_poll_indices.push($scope.next_poll_option++) 
        }
        
        $scope.initOptions = function() {
          console.log("$scope.initOptions() invoked")
          $scope.new_poll_indices = [ 0, 1 ]
          $scope.next_poll_option = 2
          $scope.question         = "here is the question"
          //$scope.option = []
          
        }

        $scope.cancelNewPoll = function() {
          console.log("$scope.cancelNewPoll() invoked")
          $scope.initOptions()
          $scope.isCollapsed = true
          console.log($scope.new_poll_indices)
          console.log($scope.option)
        }
     
        // first time getUser is called it returns nothing
        // i see a strange response when id is undefined but i dont see a match
        // in the server console to get user
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
        


// Technically I should be using User.query() since I am getting all the users
// but I had problems with that method when I tried with Poll.query
        $scope.getUsers = function() {
          console.log("getUsers() invoked")
          Users.get( {}, function(results) {
              console.log("getUsers() results")
              console.log(results)
              $scope.user_lookup = {}
              $scope.score_board = []
              $scope.num_users   = 0
              $scope.num_votes   = 0
              $scope.num_users = results.data.length // note that with a lot of users, then this will no longer work
              results.data.forEach(function(user){
                // user_lookup provides a convenient way to get polls created and voted
                // when knowing the user's username. however there are problems using
                // a hash with ng-repeat and filters
                $scope.user_lookup[user.github.username] = {
                  'displayName':   user.github.displayName,
                  'polls_created': user.polls.num_created,
                  'polls_voted':  user.polls.num_voted
                }
                // a separate array having all this information is useful when using
                // ng-repeat with filters for the scoreboard
                $scope.score_board.push({
                  'username':      user.github.username,
                  'displayName':   user.github.displayName,
                  'polls_created': user.polls.num_created,
                  'polls_voted':  user.polls.num_voted
                })
                $scope.num_votes += user.polls.num_voted
              })
              console.log("score board")
              console.log($scope.user_lookup)
        
              
          })
        }


// Technically I should be using Poll.query() since I am getting all the polls, though my implementation does work.
// Something to refactor later. - but to make this change I believe that the Poll url should include :id
        $scope.getPolls = function() {
          console.log("getPolls() invoked")
          //Poll.get({ id: $scope.id }, function(results) { // there is no need for any id when grabbing all the polls
          Poll.get( {}, function(results) {
          //$scope.polls = Poll.query( function() { //(results) {
          
              // need to make one array of objects that has all the info
              $scope.polls = results.data.map(function(item) {
                
                return {
                  item:                 item,  // contains info grabbed from server
                  has_voted_for_option: [],    // order is important in this list, eventually
                  isPollAuthoredByUser: false,
                  hasVotedForPoll:      false, // if current user has voted on poll
                  isPollDeleted:        false, // has user deleted this poll
                  img:                  "http://isigned.org/images/anonymous.png",
                  aggregate_votes:      []
                }
              })          
          
              $scope.polls.forEach(function(poll) {
                updateHasAlreadyVoted(poll)
                setGithubUserImage(poll) // parameters can be merged
                countVotes(poll)
                determinePollAuthoredByUser(poll)
              })
          
              
              //$scope.polls = results.data
              $scope.num_polls = $scope.polls.length 

              console.log("HERE NOW")
              console.log($scope.polls)
              
          })
        }
 
        var update_user_lookup = function() {
          // this will update the polls_created, poll_voted stars. I could just 
          // update the $scope.user_lookup directly inside vote and inside deletePoll which would be faster
          $scope.getUsers()  
        }



        // Now vote() explicitly checks to see whether or not the user has voted on a poll instead of
        // assuming the gui will not display the vote button. We should assume there will be bugs in the code
        // and that we will need multiple safeguards to prevent voter fraud. :)
        $scope.vote = function(poll, option_number) {
          console.log("vote(): invoked") 
          if (poll.hasVotedForPoll === false) {
            if (poll.item.poll.votes[option_number].indexOf($scope.id) === -1) {
              poll.item.poll.votes[option_number].push($scope.id)
              console.log("You just voted for poll XXX option "+option_number)
              poll.hasVotedForPoll = true
              poll.has_voted_for_option[option_number] = true
              poll.aggregate_votes[option_number]++ 
              // Now call update passing in the ID first then the object you are updating
              // implementing update in this manner is dangerous. there is a contention between 2 different users
              Poll.update({ id:poll.item._id }, poll.item, update_user_lookup);          
            } else {
                console.log("ERROR: vote(): trying to vote when votes array already contains user.id")
                console.log("ERROR: "+poll.item.poll.votes[option_number]+" "+$scope.id)
            }
          } else {
              console.log("ERROR: vote(): trying to vote when hasVotedForPoll === "+poll.hasVotedForPoll)
          }
        }

        
        $scope.deletePoll = function(poll) {
            // need a safety precaution to check if user is author of poll to delete
            if ($scope.id === poll.item.author.github_id) {
            // i could also put up a pop up confirming the deletion - not sure - see angular directives video
            console.log("deletePoll() invoked")
            poll.isPollDeleted = true
            $scope.num_polls--
            Poll.delete({ id:poll.item._id }, update_user_lookup);   
            } else {
                // I can envision this happening while using $index
                console.log("ERROR: deletePoll. Trying to delete a poll by non-author")
                console.log($scope.id)
                console.log(poll.item.author.github_id)
            }
        }


/////////////////////////////

  $scope.items = ['Item 1', 'Item 2', 'Item 3']; // this can be removed

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.oneAtATime = true;


  $scope.status = {
    isopen: false
  };

  $scope.isCollapsed = true;


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



        $scope.initOptions()
        $scope.getUsers() // this will give us all the users so we can build our create/vote hash
        $scope.getUser($scope.getPolls); // logic inside of getPolls depends on getUser completing

      }]);
   
})();