/* ==========================================================================
   Privacy-first analytics (practice engine B169, BI-4).
   GoatCounter: cookie-free, no persistent identifiers, no cross-site
   tracking. GoatCounter does not honour the browser's Do Not Track header
   itself (a documented, deliberate choice on their part), so this file
   builds a real opt-out directly: a visitor's explicit choice (set via the
   control on privacy.html) always wins; absent an explicit choice, Global
   Privacy Control is respected as the default.
   LAUNCH ITEM: SITE_CODE is a placeholder until Stuart's GoatCounter
   account exists. Until then this script no-ops.
   ========================================================================== */
(function () {
  var SITE_CODE = 'fine-kilter';
  if (!SITE_CODE) return;

  var OPT_OUT_KEY = 'fk-analytics-opt-out';

  function isOptedOut() {
    var stored = localStorage.getItem(OPT_OUT_KEY);
    if (stored === '1') return true;
    if (stored === '0') return false;
    return navigator.globalPrivacyControl === true;
  }

  window.goatcounter = {
    path: function (p) { return isOptedOut() ? null : p; }
  };

  var s = document.createElement('script');
  s.async = true;
  s.src = '//gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + SITE_CODE + '.goatcounter.com/count');
  document.head.appendChild(s);

  // Exposed for the opt-out control on privacy.html.
  window.fkAnalytics = {
    isOptedOut: isOptedOut,
    setOptedOut: function (optOut) {
      localStorage.setItem(OPT_OUT_KEY, optOut ? '1' : '0');
    }
  };
})();
