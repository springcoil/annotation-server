function ensureLoadEventFires() {
  // http://stackoverflow.com/questions/3877027/jquery-callback-on-image-load-even-when-the-image-is-cached
  $("img").one("load", function() {
    // do stuff
  }).each(function() {
    if(this.complete) $(this).load();
  });
}

function app () {
  var N = 6;
  var active = 0;

  if (!points) {
    points = new Array(N);
    for (i = 0; i < N; i++) {
      points[i] = {x: 0, y: 0, id: i};
    }
  }

  $('#annotate-image').load(setPoints);
  ensureLoadEventFires();

  $('#annotate-image').click(function(e) {
    var w = $('#annotate-image').width();
    var h = $('#annotate-image').height();
    var x = e.pageX / w;
    var y = e.pageY / h;
    points[active] = {id: active, x: x, y: y};
    $.post({url: '', data: JSON.stringify(points)});
    setPoints();
  });

  function setPoints() {
    var w = $('#annotate-image').width();
    var h = $('#annotate-image').height();
    for (i = 0; i < N; i++) {
      $('div.p' + i).css({left: points[i].x * w, top: points[i].y * h});
    }
  }

  var keyMap = {
    'R': 0,
    'W': 5,
    '1': 4,
    '7': 3,
    '8': 2,
    'E': 1,
  };

  $(document).keydown(function(e) {
    if (e.keyCode === 40) {
      window.location = nextImage;
    }
    if (e.keyCode === 38) {
      window.location = prevImage;
    }
    var matches = keyMap[String.fromCharCode(e.which)];
    if (typeof matches === "number") {
      active = matches;
    }
  });
}

$(document).ready(app);
