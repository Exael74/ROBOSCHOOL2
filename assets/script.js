(function () {
  "use strict";

  var targets = [
    { el: document.getElementById("stat-1"), value: 80, suffix: " kg" },
    { el: document.getElementById("stat-2"), value: 6, suffix: "" },
    { el: document.getElementById("stat-3"), value: 40, suffix: "+" },
    { el: document.getElementById("stat-4"), value: 12, suffix: "" }
  ];

  var ran = false;
  function run() {
    if (ran) return;
    ran = true;
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      targets.forEach(function (t) {
        if (!t.el) return;
        t.el.textContent = Math.round(t.value * e) + t.suffix;
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var stats = document.querySelector("[data-stats]");
  if (stats && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(stats);
    setTimeout(run, 6000);
  } else {
    run();
  }
})();
