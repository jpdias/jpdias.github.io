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

  var profile_url = "https://api.github.com/users/jpdias/repos";
  var repos_data = [];
  $.get(profile_url, function(data) {
    for (var repo in data) {
      if (data[repo].language != null || data[repo].language != undefined) {
        repos_data.push(data[repo].language);
      }
    }



    var data = {
      labels: repos_data.unique(),
      series: []
    };
    var total = 0;
    for (var lang in data.labels) {
      count = 0;
      for (var i = 0; i < repos_data.length; ++i) {
        if (repos_data[i] == data.labels[lang])
          count++;
        total++;
      }
      if (count != 0)
        data.series.push(count);
    }


    function sortTogether(array1, array2) {
      var merged = [];
      for (var i = 0; i < array1.length; i++) {
        merged.push({
          'a1': array1[i],
          'a2': array2[i]
        });
      }
      merged.sort(function(o1, o2) {
        return ((o1.a1 > o2.a1) ? -1 : ((o1.a1 == o2.a1) ? 0 : 1));
      });
      for (var i = 0; i < merged.length; i++) {
        array1[i] = merged[i].a1;
        array2[i] = merged[i].a2;
      }

    }

    sortTogether(data.series, data.labels);
    for (var i = 0; i < data.labels.length; i++) {
      if (i < 6) {
        var quantity = Math.round((data.series[i] / total) * 10000) / 10;
        $("#circle-area").append(
          '<div class="two columns"><div class="inner-content"><div class="c100 p' + Math.round(quantity) + ' small center"><span>' + quantity +
          '% </span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div><p><em>' + data.labels[i] +
          '</em></p></div></div>'
        );
      }
    }
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


Array.prototype.unique = function() {
  var n = {},
    r = [];
  for (var i = 0; i < this.length; i++) {
    if (!n[this[i]]) {
      n[this[i]] = true;
      r.push(this[i]);
    }
  }
  return r;
};