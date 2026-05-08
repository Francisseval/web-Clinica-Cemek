(function () {
  'use strict';

  var WEBHOOK = 'https://n8n-n8n.yaakw4.easypanel.host/webhook/cemek-chat';
  var CAL    = 'https://cal.com/francis-seval-l9dl7u/turnos-cemek';
  var C1     = '#264873';
  var C2     = '#1a3557';
  var C3     = '#e8f0fb';

  /* ── Styles ─────────────────────────────────────────────── */
  var CSS = [
    '#cemek-widget-btn{position:fixed;bottom:24px;right:24px;z-index:9999;width:56px;height:56px;border-radius:50%;background:' + C1 + ';border:none;cursor:pointer;box-shadow:0 4px 20px rgba(38,72,115,.4);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;color:#fff;}',
    '#cemek-widget-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(38,72,115,.5);}',
    '#cemek-widget-btn svg{pointer-events:none;}',

    '#cemek-panel{position:fixed;bottom:90px;right:24px;z-index:9998;width:340px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;transform:scale(.9) translateY(20px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .2s;font-family:"Montserrat",sans-serif;}',
    '#cemek-panel.cemek-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}',

    '.cemek-hd{background:' + C1 + ';padding:13px 15px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
    '.cemek-hd-info{display:flex;align-items:center;gap:10px;}',
    '.cemek-hd-av{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;flex-shrink:0;}',
    '.cemek-hd-name{color:#fff;font-weight:700;font-size:13px;line-height:1.2;}',
    '.cemek-hd-sub{color:rgba(255,255,255,.72);font-size:11px;}',
    '.cemek-hd-x{background:none;border:none;color:rgba(255,255,255,.75);cursor:pointer;font-size:22px;line-height:1;padding:0 2px;border-radius:4px;transition:color .15s;}',
    '.cemek-hd-x:hover{color:#fff;}',

    '.cemek-msgs{overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:280px;}',

    '.cemek-msg{max-width:86%;font-size:13px;line-height:1.5;animation:cemekIn .2s ease;}',
    '@keyframes cemekIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
    '.cemek-bot{align-self:flex-start;}',
    '.cemek-usr{align-self:flex-end;}',
    '.cemek-bbl{padding:9px 13px;border-radius:14px;}',
    '.cemek-bot .cemek-bbl{background:' + C3 + ';color:#1a2940;border-bottom-left-radius:3px;}',
    '.cemek-usr .cemek-bbl{background:' + C1 + ';color:#fff;border-bottom-right-radius:3px;}',

    '.cemek-card{margin-top:7px;border:1.5px solid #dde8f5;border-radius:10px;padding:11px;display:flex;flex-direction:column;gap:8px;background:#fff;}',
    '.cemek-card-row{display:flex;align-items:center;gap:9px;}',
    '.cemek-card-av{width:36px;height:36px;border-radius:50%;background:' + C1 + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;}',
    '.cemek-card-name{font-weight:700;font-size:13px;color:#1a2940;}',
    '.cemek-card-spec{font-size:11px;color:#6b7b8d;}',
    '.cemek-cta{width:100%;background:' + C1 + ';color:#fff;border:none;border-radius:8px;padding:9px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;transition:background .15s;}',
    '.cemek-cta:hover{background:' + C2 + ';}',

    '.cemek-typing{display:flex;gap:5px;align-items:center;padding:10px 13px;background:' + C3 + ';border-radius:14px;border-bottom-left-radius:3px;width:fit-content;}',
    '.cemek-typing span{width:7px;height:7px;border-radius:50%;background:#93a8c0;display:block;animation:cemekDot 1.2s infinite ease-in-out;}',
    '.cemek-typing span:nth-child(2){animation-delay:.2s;}',
    '.cemek-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes cemekDot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',

    '.cemek-inp-area{display:flex;gap:7px;padding:11px 13px;border-top:1px solid #eef2f8;flex-shrink:0;}',
    '.cemek-inp{flex:1;border:1.5px solid #dde8f5;border-radius:10px;padding:8px 11px;font-size:13px;outline:none;color:#1a2940;font-family:inherit;transition:border-color .15s;}',
    '.cemek-inp:focus{border-color:' + C1 + ';}',
    '.cemek-send{width:37px;height:37px;border-radius:10px;background:' + C1 + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;transition:background .15s;}',
    '.cemek-send:hover{background:' + C2 + ';}',
    '.cemek-send:disabled{background:#93a8c0;cursor:default;}',

    '@media(max-width:480px){#cemek-panel{right:12px;left:12px;width:auto;bottom:80px;}#cemek-widget-btn{right:16px;bottom:16px;}}'
  ].join('');

  var st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);

  /* ── HTML ───────────────────────────────────────────────── */
  var root = document.createElement('div');
  root.innerHTML = [
    '<button id="cemek-widget-btn" aria-label="Abrir asistente CEMEK">',
      '<svg id="cemek-ic-chat" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">',
        '<path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>',
      '</svg>',
      '<svg id="cemek-ic-x" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="display:none">',
        '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>',
      '</svg>',
    '</button>',

    '<div id="cemek-panel">',
      '<div class="cemek-hd">',
        '<div class="cemek-hd-info">',
          '<div class="cemek-hd-av">C</div>',
          '<div><div class="cemek-hd-name">Asistente CEMEK</div><div class="cemek-hd-sub">¿En qué te podemos ayudar?</div></div>',
        '</div>',
        '<button class="cemek-hd-x" id="cemek-x-btn" aria-label="Cerrar">&times;</button>',
      '</div>',
      '<div class="cemek-msgs" id="cemek-msgs"></div>',
      '<div class="cemek-inp-area">',
        '<input class="cemek-inp" id="cemek-inp" type="text" placeholder="Describí tus síntomas…" autocomplete="off" maxlength="300">',
        '<button class="cemek-send" id="cemek-send" aria-label="Enviar">',
          '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">',
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>',
          '</svg>',
        '</button>',
      '</div>',
    '</div>'
  ].join('');
  document.body.appendChild(root);

  /* ── Refs ───────────────────────────────────────────────── */
  var panel    = document.getElementById('cemek-panel');
  var fab      = document.getElementById('cemek-widget-btn');
  var xBtn     = document.getElementById('cemek-x-btn');
  var msgs     = document.getElementById('cemek-msgs');
  var inp      = document.getElementById('cemek-inp');
  var sendBtn  = document.getElementById('cemek-send');
  var icChat   = document.getElementById('cemek-ic-chat');
  var icX      = document.getElementById('cemek-ic-x');

  var open     = false;
  var loading  = false;
  var greeted  = false;

  /* ── Toggle ─────────────────────────────────────────────── */
  function toggle() {
    open = !open;
    panel.classList.toggle('cemek-open', open);
    icChat.style.display = open ? 'none'  : '';
    icX.style.display    = open ? ''      : 'none';
    if (open && !greeted) {
      greeted = true;
      setTimeout(function () {
        addBot('¡Hola! Soy el asistente de Centro CEMEK.\n\nContame tus síntomas o en qué especialidad estás pensando y te ayudo a encontrar el profesional ideal para tu turno.', null);
      }, 280);
    }
    if (open) setTimeout(function () { inp.focus(); }, 340);
  }
  fab.addEventListener('click', toggle);
  xBtn.addEventListener('click', toggle);

  /* ── Helpers ────────────────────────────────────────────── */
  function scroll() { msgs.scrollTop = msgs.scrollHeight; }

  function esc(t) {
    return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/);
    var last  = parts.slice(-2).map(function(w){ return w.charAt(0).toUpperCase(); });
    return last.join('').slice(0,2);
  }

  /* ── Render messages ────────────────────────────────────── */
  function addUser(text) {
    var d = document.createElement('div');
    d.className = 'cemek-msg cemek-usr';
    d.innerHTML = '<div class="cemek-bbl">' + esc(text) + '</div>';
    msgs.appendChild(d);
    scroll();
  }

  function addBot(text, data) {
    var d = document.createElement('div');
    d.className = 'cemek-msg cemek-bot';
    var bubble = '<div class="cemek-bbl">' + esc(text).replace(/\n/g,'<br>') + '</div>';
    var card   = '';

    if (data && data.turno && data.profesional) {
      var av   = initials(data.profesional);
      var spec = esc(data.especialidad || '');
      var name = esc(data.profesional);
      var last = esc(data.profesional.split(' ').pop());
      card = [
        '<div class="cemek-card">',
          '<div class="cemek-card-row">',
            '<div class="cemek-card-av">' + av + '</div>',
            '<div><div class="cemek-card-name">' + name + '</div><div class="cemek-card-spec">' + spec + '</div></div>',
          '</div>',
          '<button class="cemek-cta" onclick="window.open(\'' + CAL + '\',\'_blank\')">',
            '<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
            'Sacar turno con ' + last,
          '</button>',
        '</div>'
      ].join('');
    }

    d.innerHTML = bubble + card;
    msgs.appendChild(d);
    scroll();
  }

  function showTyping() {
    var d = document.createElement('div');
    d.className = 'cemek-msg cemek-bot';
    d.id = 'cemek-typing';
    d.innerHTML = '<div class="cemek-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    scroll();
  }

  function removeTyping() {
    var t = document.getElementById('cemek-typing');
    if (t) t.parentNode.removeChild(t);
  }

  /* ── Send ───────────────────────────────────────────────── */
  function send() {
    var text = inp.value.trim();
    if (!text || loading) return;
    inp.value   = '';
    loading     = true;
    sendBtn.disabled = true;
    addUser(text);
    showTyping();

    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: text })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (Array.isArray(data)) data = data[0];
      removeTyping();
      addBot(data.respuesta || 'Hubo un problema al procesar tu consulta.', data);
    })
    .catch(function () {
      removeTyping();
      addBot('No pude conectarme en este momento. Escribinos por WhatsApp al 341 321-1244 o llamá al 4409256.', null);
    })
    .then(function () {
      loading = false;
      sendBtn.disabled = false;
      inp.focus();
    });
  }

  sendBtn.addEventListener('click', send);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
