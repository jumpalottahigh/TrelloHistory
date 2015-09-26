//AUTHORIZE THE USER
Trello.authorize({
  type: "popup",
  name: "Getting Started Application",
  scope: {
    read: true,
    write: true },
  expiration: "never",
  authenticationSuccess,
  authenticationFailure
});

//FEEDBACK
var authenticationSuccess = function() { console.log("Successful authentication"); };
var authenticationFailure = function() { console.log("Failed authentication"); };

$(document).ready(function(){
  $('#fetch').on('click', function(){
    //USER IS AUTHENTICATED?
    if(authenticationSuccess) {
      //GRAB Board name
      var boardToGet = $('#board_name').val();

      //IF THERE WAS AN ISSUE
      var error = function(errorMsg){
        $('#status').html("SORRY THERE WAS AN ISSUE!!! <br>" + errorMsg)
        .addClass("alert-danger");
      };

      var success = function(successMsg){
        $('#status').html("The board was fetched <br>" + successMsg)
          .addClass("alert-success");

        for (board of successMsg) {
          console.log(board);

          if(board.name === boardToGet) {
            //BINGO WE FOUND THAT BOARD
            $('#status').append("<br>" + JSON.stringify(board));
          } else {
            $('#status').html("");
            $('#status').html("NO SUCH BOARD")
              .addClass("alert-danger");
          }
        }
      };

      //CALL THE BOARD FORTH
      Trello.get('/member/me/boards', success, error);
      $('#statusObject').html(Trello);

      $('#statusObject').html("ALL SUBOBJECTS" + JSON.stringify(Trello));


    }
  });
});

//IF USER AUTHORIZED GET BOARDS

// if(authenticationSuccess) {
//
//   var success = function(successMsg) {
//     console.log(successMsg);
//   };
//
//   var error = function(errorMsg) {
//     console.log(errorMsg);
//   };
//
//   Trello.get('/member/me/boards', success, error);
// }
