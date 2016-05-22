$(document).ready(function() {
  'use strict';

  var authenticationSuccess = function() {
    console.log("Successful authentication");
  };
  var authenticationFailure = function() {
    console.log("Failed authentication");
  };

  //Authenticate
  if (Trello) {
    console.log("You are already logged in!");
    $('#login').hide();
  } else {
    $('#login').show();
    Trello.authorize({
      type: "popup",
      name: "Done By Month",
      scope: {
        read: true,
        write: false
      },
      expiration: "never",
      success: authenticationSuccess,
      error: authenticationFailure
    });
  }

  //Get current month done list
  function getCurrentMonthDoneList(monthAndYear) {
    var headingConstructor = '';
    var constructor = '';
    var boardName = '';
    var boardID = '';
    var currentMonthListID = '';

    //If a new board name has been entered save to LS
    if ($('#textBoardName').val() !== '') {
      boardName = $('#textBoardName').val();
      //Save to LS
      localStorage.setItem("TH_board", boardName);
    }

    Trello.get(
      '/members/me/boards',
      function(boards) {
        //Go through all user boards and find the ID of the board with the correct name
        for (var i = 0; i < boards.length; i++) {
          if (boardName == boards[i].name) {
            boardID = boards[i].id;
          }
        }

        //Fetch all lists within the specifiec board board
        Trello.get(
          //Get all lists (even archived ones)
          '/boards/' + boardID + '/lists?filter=all',
          function(data) {
            //Find the list for the current month
            for (var i = 0; i < data.length; i++) {
              if (data[i].name == monthAndYear) {
                headingConstructor += 'Cards completed in: ' + monthAndYear;
                currentMonthListID = data[i].id;
              }
            }

            //Get all cards in the current month list
            Trello.get(
              '/lists/' + currentMonthListID + '/cards/',
              function(cards) {
                //Itirate the cards
                for (var j = 0; j < cards.length; j++) {
                  constructor += "<div class='col-xs-3 card'>Name: <b>" + cards[j].name + "</b><br>";
                  constructor += "<pre>Description: <b>" + cards[j].desc + "</b></pre><br>";
                  constructor += "Completed on: <b>" + moment(cards[j].dateLastActivity).format('Do MMM YYYY') + "</b></div>";
                }

                //Update the UI with the data
                $('#monthCards').html('');
                $('#monthCards').append(constructor);
                $('#monthAndYear').html(headingConstructor);
              },
              //if data could not be fetched or does not exist
              function(err) {
                if (err.status == 404) {
                  $('#monthAndYear').html('');
                  $('#monthCards').html("<h2 class='col-xs-12 text-center text-uppercase'>No data available for that period!</h2>");
                } else {
                  $('#monthAndYear').html('');
                  $('#monthCards').html("<h2 class='col-xs-12 text-center text-uppercase'>Unknow error!</h2>");
                }
              }
            );
          }
        );
      }
    );


  }

  //Event handlers
  $('#fetch').click(function() {
    var month = $('#selectMonth').val();
    var year = $('#selectYear').val();
    getCurrentMonthDoneList(month + " " + year);
  });

  //Start up init
  //Get date
  var currentMonth = moment(Date.now()).format('MMM YYYY');
  var previousMonth = moment(currentMonth).subtract(1, 'month').format('MMM YYYY');

  //Preselect current month in select lists
  $('#selectMonth option').each(function(i, item) {
    if ($(item).val() == moment(currentMonth).format('MMM')) {
      $(item).attr("selected", "selected");
    }
  });

  //Preselect current year in select lists
  $('#selectYear option').each(function(i, item) {
    if ($(item).val() == moment(currentMonth).format('YYYY')) {
      $(item).attr("selected", "selected");
    }
  });

  //Init
  //Update board name text box from local storage if key exists
  if (localStorage.TH_board) {
    $('#textBoardName').val(localStorage.getItem("TH_board"));
  }
  //Arrange list for current month
  getCurrentMonthDoneList(currentMonth);

});
