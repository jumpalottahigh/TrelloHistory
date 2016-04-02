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
    Trello.authorize({
      type: "popup",
      name: "Getting Started Application",
      scope: {
        read: true,
        write: true
      },
      expiration: "never",
      success: authenticationSuccess,
      error: authenticationFailure
    });
  });

  //Fetch data
  $('#fetch').click(function() {
    console.log("Fetching...");
  });

});
