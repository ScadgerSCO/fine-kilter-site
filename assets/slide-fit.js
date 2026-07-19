/* ==========================================================================
   Fine Kilter — constant-frame grammar: slide-height fit (JS half)
   B158 fix · 19 July 2026

   .slide is position:absolute so .slides (its container) can't size itself
   from natural content flow. A fixed min-height (constant-frame.css) works
   only for the desktop-tuned copy length; at narrow viewports, wrapped text
   (a longer .swap-chip label, a longer paragraph) overflows it and collides
   with .slide-idx. This measures each .slide's real content height (with
   .slide-idx's reserved padding-bottom included) and sizes .slides to the
   tallest one, so nothing overlaps at any viewport width or content length.

   Skipped entirely under reduced motion: that branch already lays slides
   out statically with .slides{min-height:0} (constant-frame.css), and an
   inline min-height set here would fight that media query at higher
   specificity.
   ========================================================================== */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = document.querySelectorAll('.slides');
  if (!groups.length) return;

  function fit(group) {
    var slides = group.querySelectorAll('.slide');
    var max = 0;
    slides.forEach(function (slide) {
      var prevPosition = slide.style.position;
      slide.style.position = 'static';
      max = Math.max(max, slide.offsetHeight);
      slide.style.position = prevPosition;
    });
    if (max > 0) group.style.minHeight = max + 'px';
  }

  function fitAll() { groups.forEach(fit); }

  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(fitAll, 150);
  });
})();
