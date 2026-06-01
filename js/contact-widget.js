/* =========================================
   STRATA WORKS — Contact Widget
   ========================================= */

(function() {
  'use strict';

  const widgetHTML = `
<div class="sw-fab" id="sw-fab">
  <div class="sw-fab__options" id="sw-fab-options">
    <div class="sw-fab__option">
      <button class="sw-fab__label" id="sw-open-form">Quick Quote</button>
      <button class="sw-fab__btn sw-fab__btn--form" id="sw-open-form-btn" aria-label="Request a quote">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      </button>
    </div>
    <div class="sw-fab__option">
      <button class="sw-fab__label" id="sw-open-chat">Chat with Us</button>
      <button class="sw-fab__btn sw-fab__btn--chat" id="sw-open-chat-btn" aria-label="Open chat">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
  </div>
  <button class="sw-fab__trigger" id="sw-trigger" aria-label="Contact us" aria-expanded="false">
    <svg class="sw-fab__icon sw-fab__icon--open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <svg class="sw-fab__icon sw-fab__icon--close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
</div>

<div class="sw-panel" id="sw-panel" role="dialog" aria-label="Contact Strata Works">
  <div class="sw-panel__header">
    <div class="sw-panel__header-left">
      <div class="sw-panel__avatar">SW</div>
      <div>
        <div class="sw-panel__name">Strata Works</div>
        <div class="sw-panel__status">Typically replies in &lt;1 hour</div>
      </div>
    </div>
    <button class="sw-panel__close" id="sw-panel-close" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="sw-panel__tabs" role="tablist">
    <button class="sw-panel__tab active" data-tab="chat" role="tab" aria-selected="true">💬 Chat</button>
    <button class="sw-panel__tab" data-tab="form" role="tab" aria-selected="false">📋 Get a Quote</button>
  </div>
  <div class="sw-chat active" id="sw-chat-panel">
    <div class="sw-chat__msgs" id="sw-msgs" aria-live="polite"></div>
    <div class="sw-chat__input-row">
      <textarea class="sw-chat__input" id="sw-chat-input" rows="1" placeholder="Type a message…" maxlength="500"></textarea>
      <button class="sw-chat__send" id="sw-chat-send">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2 15 22 11 13 2 9l20-7z"/></svg>
      </button>
    </div>
  </div>
  <div class="sw-form" id="sw-form-panel">
    <form id="sw-quote-form" novalidate>
      <div class="sw-form__fields">
        <div class="sw-form__group"><label>Name *</label><input type="text" name="name" required placeholder="Your name" /></div>
        <div class="sw-form__group"><label>Email *</label><input type="email" name="email" required placeholder="your@email.com" /></div>
        <div class="sw-form__group"><label>Service Type</label>
          <select name="type">
            <option value="">Select…</option>
            <option value="commercial">Commercial / Business</option>
            <option value="residential">Residential / Home</option>
            <option value="emergency">Emergency Repair</option>
          </select>
        </div>
        <div class="sw-form__group"><label>Message *</label><textarea name="message" required rows="3" placeholder="Describe your needs…"></textarea></div>
        <button type="submit" class="sw-form__submit">Send Request →</button>
      </div>
    </form>
    <div class="sw-form__success" id="sw-form-success">
      <div class="sw-form__success-icon">✓</div>
      <strong>Request Sent!</strong>
      <p>We'll get back to you within one business day.</p>
    </div>
  </div>
</div>
`;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const fab = document.getElementById('sw-fab');
  const trigger = document.getElementById('sw-trigger');
  const panel = document.getElementById('sw-panel');
  const panelClose = document.getElementById('sw-panel-close');
  const msgs = document.getElementById('sw-msgs');
  const input = document.getElementById('sw-chat-input');
  const sendBtn = document.getElementById('sw-chat-send');
  const tabs = document.querySelectorAll('.sw-panel__tab');
  const chatPanel = document.getElementById('sw-chat-panel');
  const formPanel = document.getElementById('sw-form-panel');
  let fabOpen = false, panelOpen = false, chatInit = false;

  const agentReplies = {
    default: "Thanks for reaching out! Our team will follow up with you shortly.",
    commercial: "Great — we specialize in commercial maintenance contracts. What type of facility do you manage?",
    residential: "Happy to help! We cover a wide range of home services. What do you need fixed?",
    hvac: "HVAC is one of our core services. Are you looking for a one-time repair or a preventive maintenance plan?",
    emergency: "We offer 24/7 emergency response. Can you describe the issue and your location?",
    price: "Pricing depends on the service and scope. Residential jobs typically start at $99. Commercial contracts are custom-quoted. Want a free estimate?",
    plumbing: "Our licensed plumbers handle everything from leaky faucets to full commercial systems. What's the issue?",
  };

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = 'sw-msg sw-msg--' + type;
    if (type === 'agent') {
      d.innerHTML = `<div class="sw-msg__av">SW</div><div class="sw-msg__bubble">${text}</div>`;
    } else {
      const s = document.createElement('div');
      s.className = 'sw-msg__bubble';
      s.textContent = text;
      d.appendChild(s);
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'sw-msg sw-msg--agent';
    d.id = 'sw-typing';
    d.innerHTML = '<div class="sw-msg__av">SW</div><div class="sw-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function agentReply(text, delay = 1200) {
    showTyping();
    setTimeout(() => {
      document.getElementById('sw-typing')?.remove();
      addMsg(text, 'agent');
    }, delay);
  }

  function initChat() {
    if (chatInit) return;
    chatInit = true;
    addMsg("Hi! 👋 Welcome to Strata Works. Need help with a repair, maintenance contract, or just have a question?", 'agent');
    setTimeout(() => agentReply("We serve both homes and businesses across the US. How can we help you today?", 1000), 800);
  }

  function pickReply(text) {
    const t = text.toLowerCase();
    if (t.includes('commercial') || t.includes('business') || t.includes('office')) return agentReplies.commercial;
    if (t.includes('home') || t.includes('house') || t.includes('residential')) return agentReplies.residential;
    if (t.includes('hvac') || t.includes('heat') || t.includes('air') || t.includes('ac')) return agentReplies.hvac;
    if (t.includes('emergency') || t.includes('urgent') || t.includes('broken')) return agentReplies.emergency;
    if (t.includes('price') || t.includes('cost') || t.includes('how much')) return agentReplies.price;
    if (t.includes('plumb') || t.includes('leak') || t.includes('pipe') || t.includes('faucet')) return agentReplies.plumbing;
    return agentReplies.default;
  }

  function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    agentReply(pickReply(text));
  }

  function openPanel(tab) {
    panel.classList.add('active');
    panelOpen = true;
    switchTab(tab);
    if (tab === 'chat') initChat();
  }

  function closePanel() { panel.classList.remove('active'); panelOpen = false; }

  function switchTab(name) {
    tabs.forEach(t => { t.classList.toggle('active', t.dataset.tab === name); t.setAttribute('aria-selected', t.dataset.tab === name); });
    chatPanel.classList.toggle('active', name === 'chat');
    formPanel.classList.toggle('active', name === 'form');
    if (name === 'chat') initChat();
  }

  trigger.addEventListener('click', () => {
    fabOpen = !fabOpen;
    fab.classList.toggle('open', fabOpen);
    trigger.setAttribute('aria-expanded', fabOpen);
    if (!fabOpen) closePanel();
  });

  ['sw-open-chat','sw-open-chat-btn'].forEach(id => document.getElementById(id)?.addEventListener('click', () => { if (!fabOpen) { fabOpen=true; fab.classList.add('open'); } openPanel('chat'); }));
  ['sw-open-form','sw-open-form-btn'].forEach(id => document.getElementById(id)?.addEventListener('click', () => { if (!fabOpen) { fabOpen=true; fab.classList.add('open'); } openPanel('form'); }));

  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
  panelClose.addEventListener('click', closePanel);
  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });

  document.getElementById('sw-quote-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (!f.name.value || !f.email.value || !f.message.value) return;
    document.getElementById('sw-form-success').style.display = 'flex';
    f.style.display = 'none';
    setTimeout(() => { switchTab('chat'); agentReply(`Thanks ${f.name.value}! We've received your request and will email ${f.email.value} shortly.`, 800); }, 2000);
  });

  document.addEventListener('click', e => { if (panelOpen && !panel.contains(e.target) && !fab.contains(e.target)) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePanel(); if(fabOpen){fabOpen=false;fab.classList.remove('open');} } });

})();
