
$(document).ready(function(){
  $('#clr_btn').click(function(){
    $.ajax({
      url: "/api/change_color",
    }).done(function(){
      alert('sent signal for goal #1');
    });
  });
  $('#move_btn').click(function(){
    $.ajax({
      url: "/api/defmove",
    }).done(function(){
      alert('sent signal for goal #2');
    });
  });
  $('#buttonReset').click(function(){
    $.ajax({
      url: "/send/reset",
    }).done(function(){
      alert('sent signal for game reset');
    });
  });
});

