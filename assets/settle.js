/* ==========================================================================
   Fine Kilter — registration kit: settle-into-register (JS half)
   B158 F2 · grammar v1 · 18 July 2026 · asset-direction brief 3 (I3a)

   One-time arrival choreography: elements carrying .settle translate into
   register once, on first view, then never move again. Semantic: "coming
   into kilter".

   Behavioural invariants (validated by ../validate-kits.mjs):
   - progressive: classes are only added when JS runs — no JS, fully visible
   - reduced-motion and no-IntersectionObserver environments exit before any
     element is hidden (reduced-motion parity)
   - stagger: (index % 3) * 0.12s — at most a three-step stagger
   - IntersectionObserver threshold .15; unobserve after release (runs once)
   - watchdog: 2000ms full release so no environment strands content
   ========================================================================== */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) return;
  var units = document.querySelectorAll('.settle');
  var i = 0;
  units.forEach(function (el) {
    el.classList.add('settle-pre');
    el.style.transitionDelay = ((i++ % 3) * 0.12) + 's';
  });
  var go = function (el) { el.classList.add('settle-go'); };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { go(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  units.forEach(function (el) { io.observe(el); });
  setTimeout(function () { units.forEach(go); }, 2000);
})();
