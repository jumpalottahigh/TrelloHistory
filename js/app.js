


//USED IDS:
//MASS BOARD ID:
//559e2b0a1b00224596d7e1e4


$(document).ready(function() {

  //AUTHORIZE THE USER
  Trello.authorize({
    type: "popup",
    name: "Getting Started Application",
    scope: {
      read: true,
      write: false
    },
    expiration: "never",
    authenticationSuccess,
    authenticationFailure
  });

  //FEEDBACK
  var authenticationSuccess = function() {
    console.log("Successful authentication");
  };
  var authenticationFailure = function() {
    console.log("Failed authentication");
  };

  //INSERT A CONTAINS METHOD IN THE STRING PROTOTYPE
  String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
  };

  //FETCH BOARD BUTTON CLICKED
  $('#fetch_board').on('click', function() {
    //USER IS AUTHENTICATED?
    if (authenticationSuccess) {
      //GRAB Board name
      var boardToGet = $('#board_name').val();

      //IF THERE WAS AN ISSUE
      var error = function(errorMsg) {
        $('#status').html("SORRY THERE WAS AN ISSUE!!! <br>" + errorMsg)
          .addClass("alert-danger");
      };

      var success = function(successMsg) {
        $('#status').html("The board was fetched <br>" + successMsg)
          .addClass("alert-success");

        for (board of successMsg) {

          if (board.name == boardToGet) {
            //BINGO WE FOUND THAT BOARD
            $('#status').html(JSON.stringify(board))
              .addClass("alert-success");
            console.log("success");
          } else {
            $('#status').html("");
            $('#status').html("NO SUCH BOARD")
              .addClass("alert-danger");
          }
        }

      };

      //CALL THE BOARD FORTH
      Trello.get('/member/me/boards', success, error);
    }
  });

  $('#fetch_list').on('click', function() {
    if (authenticationSuccess) {
      var success = function(successMsg) {
        console.log(successMsg);

        for (var i = 0; i < successMsg.length; i++) {
          if (successMsg[i].name.contains("2015")) {
            console.log(successMsg[i].name);
            console.log(successMsg[i]);
          }
        }
      };

      var error = function(errorMsg) {
        console.log(errorMsg);
      };

      Trello.get('/boards/559e2b0a1b00224596d7e1e4/lists', success, error);
    }
  });

  $('#get_all_boards').on('click', function() {
    if (authenticationSuccess) {
      Trello.get('members/me/boards/', {
        fields: "id,name,closed"
      }, function(boardsArray, err) {
        // if(err) console.log(err);
        for (var i = 0; i < boardsArray.length; i++) {
          console.log(boardsArray[i]);
          $('#status').append(boardsArray[i].name + "<br>");
        }

      });
    }
  });

  $('#get_all_lists').on('click', function() {
    //massboard id
    //559e2b0a1b00224596d7e1e4
    if (authenticationSuccess) {
      Trello.get('/boards/559e2b0a1b00224596d7e1e4/lists', {
        fields: "id,name,closed"
      }, function(success, error) {
        console.log(success);
        for (var i = 0; i < success.length; i++) {
          $('#status').append(success[i].name + "<br>");
        }
      });
    }
  });

  $('#search').on('click', function() {
      //BabyLove BOARD ID
      //559e675d35adcdb876f96958
      var tok = localStorage.getItem("trello_token");
      var key = "";

      $("#status").append('<div class="col-sm-3"></div>');

      $.ajax({
        url: "https://api.trello.com/1/search?query=is:archived&key=" + key + "&token=" + tok,
        cache: false,
        success: function(data) {
          console.log(data);
          for (var i = 0; i < data.cards.length; i++) {
            $("#status").append('<div class="col-sm-3">'+data.cards[i].name+'-----------'+data.cards[i].dateLastActivity+'</div>' + "<br>");
          }
        }
      });
  });



  $('#get_all_cards').on('click', function() {
    if (authenticationSuccess) {
      Trello.get('/members/me/cards', function(success, error) {
        console.log(success);
      });
    }
  });

  $('#test').on('click', function() {
    Trello.get("boards/559e675d35adcdb876f96958", {lists:"closed"}, function(board) {
	     console.log(board);

       for (var i = 0; i < board.lists.length; i++) {
        console.log(board.lists[i].name);
       }

     });
   });
});
