$(document).ready(function() {
  if (!$(".menu ").is(":visible ")) {
    $('#show').html('<i class="fa fa-angle-double-down "></i> Menu');
    $('#show').css("cursor", "pointer");
  } else {
    $('#show').html('<i class="fa fa-angle-double-up "></i> Menu');
    $('#show').css("cursor", "pointer");
  }
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();

    //  if ($(window).width() < 720) {
    menu();
    //  }
    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 900, 'swing', function() {
      window.location.hash = target;
    });

  });

  $('#show').click(function(e) {
    menu();
    e.preventDefault();
  });

});

function menu() {
  $('.menu').slideToggle("fast ", function() {
    if ($(this).is(':visible')) {
      $('#show').html('<i class="fa fa-angle-double-up "></i> Menu');
    } else {
      $('#show').html('<i class="fa fa-angle-double-down "></i> Menu');
    }
  });
}