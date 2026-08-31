
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

$$('.copy-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.textContent);
      const old = button.textContent;
      button.textContent = 'COPIED ✓';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = old;
        button.classList.remove('copied');
      }, 1400);
    } catch {
      // Fallback for browsers where clipboard permissions are unavailable.
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'SELECTED — COPY';
      setTimeout(() => button.textContent = 'COPY', 1400);
    }
  });
});

const menu = $('#toolkitMenuToggle');
const mobileNav = $('#toolkitMobileNav');
if (menu && mobileNav) {
  menu.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
}

const assistant = $('#toolkitAssistant');
const chatBtn = $('#toolkitChatBtn');
const chatBox = $('#toolkitChatBox');
const chatClose = $('#toolkitChatClose');
const messages = $('#toolkitMessages');
const input = $('#toolkitChatInput');

function setChat(open) {
  if (!assistant || !chatBox) return;
  assistant.classList.toggle('open', open);
  chatBtn.setAttribute('aria-expanded', String(open));
  chatBox.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => input?.focus(), 80);
}
chatBtn?.addEventListener('click', () => setChat(!assistant.classList.contains('open')));
chatClose?.addEventListener('click', () => setChat(false));

const answers = [
  {keys:['prompt','prompts','copy paste'], answer:'The main prompt is in Prompts → “Find businesses that need a website.” Tap COPY PROMPT and paste it into ChatGPT. It asks for public business data and tries to vary the results between runs.'},
  {keys:['template','templates','pitch'], answer:'The Templates section has a short free-sample website outreach message and a client qualification checklist.'},
  {keys:['link','links','support','p2b'], answer:'Useful links are in the Useful Links section, including the Instagram/Meta P2B Support Europe form, ORVAEN Instagram and email.'},
  {keys:['instagram','ig'], answer:'Follow ORVAEN at @orvaen.ig for new educational reels, prompts and resources.'},
  {keys:['orvaen','service','services'], answer:'ORVAEN builds websites, AI automation, chatbots/assistants, media/creative systems and focused digital products.'},
  {keys:['privacy','legal','data'], answer:'Use public business information only. Do not request private data, passwords, login information or restricted/private-profile data. Verify important details before outreach.'}
];

function answer(q) {
  const text = q.toLowerCase();
  let best = null, score = 0;
  answers.forEach(item => {
    const hits = item.keys.reduce((n,k) => n + (text.includes(k) ? 1 : 0), 0);
    if (hits > score) { score = hits; best = item.answer; }
  });
  return best || 'I can guide you to Prompts, Templates, Useful Links, or explain how to use the resource hub. Try asking “where are the prompts?”';
}

function addMessage(text, type) {
  const el = document.createElement('div');
  el.className = 'msg ' + type;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}
function send(text) {
  if (!text.trim()) return;
  addMessage(text.trim(), 'user');
  input.value = '';
  setTimeout(() => addMessage(answer(text), 'bot'), 180);
}
$('#toolkitChatForm')?.addEventListener('submit', e => {
  e.preventDefault();
  send(input.value);
});
$$('.toolkit-quick button').forEach(b => b.addEventListener('click', () => send(b.textContent)));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    setChat(false);
    mobileNav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }
});
