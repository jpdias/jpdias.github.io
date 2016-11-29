var consts = {
  username: 'jpdias'
};

var classes = {
  a: 'projects-a',
  li: 'projects-li',
  ul: 'projects-ul',
  lang: 'projects-lang',
  desc: 'projects-desc',
  hide: 'projects-hide'
};


$("#showprojects").on("click", function (e) {
  if ($(".projects-hide").css("display") == "none") {
    $(".projects-hide").show('fast').css("display", "inline-block");
    $("#showprojects").html("<i class='fa fa-minus'></i> SHOW LESS");
  }
  else {
    $(".projects-hide").show('fast').css("display", "none");
    $("#showprojects").html("<i class='fa fa-plus'></i> SHOW MORE");
  }
});

var profile_url = "https://api.github.com/users/" + consts.username + "/repos";
var repos_data = [];

var repoXHR = new XMLHttpRequest();
function repoXHRHandler() {
  var repos = JSON.parse(this.response);
  var ul = document.getElementsByClassName(classes.ul)[0];
  for (var i = 0, len = repos.length; i < len; i++) {
    if (!repos[i].fork) {
      if (repos[i].language !== null || repos[i].language !== undefined || repos[i].language !== "null") {
        repos_data.push(repos[i].language);
      }
      var li = document.createElement('li');
      if (i > 5) {
        li.className = classes.li + ' ' + classes.hide;
      }
      else {
        li.className = classes.li;
      }

      li.innerHTML = '<a class="' + classes.a + '" href="' + repos[i].html_url + '">' + repos[i].name
      + '<p class="' + classes.lang + '">' + (repos[i].language || 'Undefined') + '</p><p class="'
      + classes.desc + '">' + repos[i].description + '</p></a>';
      
      if(ul !== undefined)
        ul.appendChild(li);
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
    if (count !== 0)
      data.series.push(count);
  }

  sortTogether(data.series, data.labels);
  for (var i = 0; i < data.labels.length;i++) {
    if (i < 6) {
      var quantity = Math.round((data.series[i] / total) * 10000) / 10;
      $("#circle-area").append(
        '<div class="two columns"><div class="inner-content"><div class="c100 p' + Math.round(quantity) + ' small center"><span>' + quantity +
        '% </span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div><p><em>' + data.labels[i] +
        '</em></p></div></div>'
        );
    }
  }
}
repoXHR.open('GET', profile_url + '?sort=created', true);
repoXHR.addEventListener('load', repoXHRHandler);

$(document).ready(function () {
  repoXHR.send();

  if (!$(".menu ").is(":visible ")) {
    $('#show').html('<i class="fa fa-angle-double-down "></i> Menu');
    $('#show').css("cursor", "pointer");
  } else {
    $('#show').html('<i class="fa fa-angle-double-up "></i> Menu');
    $('#show').css("cursor", "pointer");
  }
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();

    //  if ($(window).width() < 720) {
    menu();
    //  }
    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
      });

  });

  $('#show').click(function (e) {
    menu();
    e.preventDefault();
  });
});

function menu() {
  $('.menu').slideToggle("fast ", function () {
    if ($(this).is(':visible')) {
      $('#show').html('<i class="fa fa-angle-double-up "></i> Menu');
    } else {
      $('#show').html('<i class="fa fa-angle-double-down "></i> Menu');
    }
  });
}

Array.prototype.unique = function () {
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


function sortTogether(array1, array2) {
  var merged = [];
  for (var i = 0; i < array1.length; i++) {
    merged.push({
      'a1': array1[i],
      'a2': array2[i]
    });
  }
  merged.sort(function (o1, o2) {
    return ((o1.a1 > o2.a1) ? -1 : ((o1.a1 == o2.a1) ? 0 : 1));
  });
  for (var j = 0; j < merged.length; j++) {
    array1[j] = merged[j].a1;
    array2[j] = merged[j].a2;
  }

}