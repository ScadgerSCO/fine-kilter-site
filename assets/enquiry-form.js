/* ==========================================================================
   Enquiry form capture (practice engine B168, BI-2).
   Posts JSON to the Make webhook specified in
   practice-engine/operating-artefacts/make-enquiry-scenario-specification.md.
   LAUNCH ITEM: WEBHOOK_URL is a placeholder until the Make scenario is built
   and its real webhook URL is substituted here (and in the form's action
   attribute, for the no-JS fallback). Until then this script no-ops and the
   form behaves exactly as it did before this file existed.
   ========================================================================== */
(function () {
  var WEBHOOK_URL = 'https://hook.eu1.make.com/1rmp4jbftnxmgg8ua1l1lzg4bcispx0r';
  if (!WEBHOOK_URL) return;

  var form = document.querySelector('#contact form');
  if (!form) return;

  var panel = form.closest('.panel');
  var statusEl = document.createElement('p');
  statusEl.className = 'form-note form-status';
  statusEl.setAttribute('role', 'alert');
  statusEl.setAttribute('aria-live', 'assertive');
  statusEl.hidden = true;
  form.insertBefore(statusEl, form.firstChild);

  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.textContent;

  function setStatus(kind, message) {
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.dataset.kind = kind;
  }

  function setSending(sending) {
    submitBtn.disabled = sending;
    submitBtn.textContent = sending ? 'Sending…' : submitLabel;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus('', '');
    statusEl.hidden = true;
    setSending(true);

    var data = new FormData(form);
    var payload = {
      name: (data.get('name') || '').trim(),
      email: (data.get('email') || '').trim(),
      company: (data.get('company') || '').trim(),
      friction: (data.get('friction') || '').trim(),
      source_page: location.pathname,
      submission_id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(16).slice(2),
      hp_field: (data.get('hp_field') || '').trim()
    };

    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (timeout) clearTimeout(timeout);
      return response.ok ? response.json().catch(function () { return { ok: true }; }) : Promise.reject(new Error('bad-status'));
    }).then(function (result) {
      if (!result || result.ok !== true) throw new Error('not-ok');
      setSending(false);
      if (panel) panel.hidden = true;
      var confirmation = document.createElement('p');
      confirmation.className = 'form-note form-confirmation';
      confirmation.setAttribute('role', 'status');
      confirmation.textContent = "Thanks. I've got this and will read and reply personally, usually within a working day.";
      form.parentNode.insertBefore(confirmation, form.nextSibling.nextSibling);
    }).catch(function () {
      if (timeout) clearTimeout(timeout);
      setSending(false);
      setStatus('error', "That didn't send. Nothing here has been lost, so it's safe to try again in a moment. If it keeps happening, a LinkedIn message reaches me just as well.");
    });
  });
})();
