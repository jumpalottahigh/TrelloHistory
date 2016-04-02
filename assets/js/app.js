$(document).ready(function() {
  'use strict';

  var authenticationSuccess = function() {
    console.log("Successful authentication");
  };
  var authenticationFailure = function() {
    console.log("Failed authentication");
  };

  //Authenticate
  $('#login').click(function() {
    if (Trello) {
      console.log("You are already logged in!");
    } else {
      Trello.authorize({
        type: "popup",
        name: "Done By Month",
        scope: {
          read: true,
          write: true
        },
        expiration: "never",
        success: authenticationSuccess,
        error: authenticationFailure
      });
    }
  });

  Trello.authorize({
    type: "popup",
    name: "Done By Month",
    scope: {
      read: true,
      write: true
    },
    expiration: "never",
    success: authenticationSuccess,
    error: authenticationFailure
  });

  if(Trello) {
    $('#login').hide();
  } else {
    $('#login').show();
  }

  //UI UPDATE FUNCTIONS
  var loadedBoards = function(boards) {
    $.each(boards, function(index, value) {
      $('#boardName').append("<p>" + value.id + " " + value.name + "</p>");

      //Populate list
      $('#boards')
        .append($("<option></option>")
        .attr("value",value.id)
        .text(value.name));
    });
  };

  //DATA FETCH FUNCTIONS
  var loadBoards = function() {
    //Get the users boards
    Trello.get(
      '/members/me/boards/',
      loadedBoards,
      function() {
        console.log("Failed to load boards");
      }
    );
  };

  var queryMonthDoneList = function(monthAndYear) {
    Trello.get(
      '/search?query=list%3A' + monthAndYear + '&cards_limit=100',
      function(data) {
        console.log(data);
        console.log(data.cards);
        var constructor = '';

        for (var i = 0; i < data.cards.length; i++) {
          if(data.cards[i].idBoard == $('#boards').val()) {
            if(constructor === '') {
              constructor += '<h3>' + $('#boards option:selected').text() + ' ' + monthAndYear + ' Cards</h3>';
            }
            constructor += "Name: <b>" + data.cards[i].name + "</b><br>";
            constructor += "Completed on: <b>" + data.cards[i].dateLastActivity + "</b><br>";
          } else {
            console.log("Others");
          }
        }
        console.log(constructor);
        $('#monthOutput').html('');
        $('#monthOutput').append(constructor);
      },
      function() {
        console.log("Failed to load!");
      }
    );
  };


  //BUTTON EVENTS
  //Fetch data
  $('#fetch').click(function() {
    var query = $('#monthAndYear').val();
    queryMonthDoneList(query);
  });


  //UI UPDATES
  loadBoards();
});
