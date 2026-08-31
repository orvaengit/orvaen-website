const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $('#menuToggle');
const mobileNav = $('#mobileNav');
menuToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('#mobileNav a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Lightweight reveal animation — no library required.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('visible'));

// Contact form guard until the user adds their real endpoint.
$('#contactForm').addEventListener('submit', e => {
  if (e.currentTarget.action.includes('YOUR_FORM_ENDPOINT_HERE')) {
    e.preventDefault();
    $('#formStatus').textContent = 'Add your form endpoint in index.html first. The design is ready.';
  }
});

// Cart
const cart = [];
const cartRoot = $('#cart');
const cartBtn = $('#cartBtn');
const cartBox = $('#cartBox');
const cartItems = $('#cartItems');
const count = $('#count');
const total = $('#total');
const checkout = $('#checkout');

function money(value) { return '₹' + value.toLocaleString('en-IN'); }

function renderCart() {
  count.textContent = cart.length;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-item">Your cart is empty.</p>';
    total.textContent = '₹0';
    checkout.disabled = true;
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      ${item.name} — ${money(item.price)}
      <button class="remove-item" type="button" data-remove="${index}" aria-label="Remove ${item.name}">×</button>
    </div>`).join('');
  const sum = cart.reduce((acc, item) => acc + item.price, 0);
  total.textContent = money(sum);
  checkout.disabled = false;
  $$('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    cart.splice(Number(btn.dataset.remove), 1);
    renderCart();
  }));
}

function setCart(open) {
  cartRoot.classList.toggle('open', open);
  cartBtn.setAttribute('aria-expanded', String(open));
  cartBox.setAttribute('aria-hidden', String(!open));
}

cartBtn.addEventListener('click', () => setCart(!cartRoot.classList.contains('open')));
$('#cartClose').addEventListener('click', () => setCart(false));
$$('.add-to-cart').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.name;
  const price = Number(button.dataset.price);
  if (!cart.some(item => item.name === name)) cart.push({ name, price });
  renderCart();
  setCart(true);
}));

// Checkout modal
const modal = $('#checkoutModal');
const productField = $('#productField');
const amountField = $('#amountField');
const amountText = $('#amountText');
const summary = $('#summary');

function setModal(open) {
  modal.classList.toggle('open', open);
  modal.setAttribute('aria-hidden', String(!open));
}

checkout.addEventListener('click', () => {
  if (!cart.length) return;
  const sum = cart.reduce((acc, item) => acc + item.price, 0);
  productField.value = cart.map(item => item.name).join(', ');
  amountField.value = sum;
  amountText.textContent = sum.toLocaleString('en-IN');
  summary.textContent = cart.map(item => item.name).join(', ') + ' · Total ' + money(sum);
  setModal(true);
  setCart(false);
});
$('#modalClose').addEventListener('click', () => setModal(false));
$('#checkoutModal').addEventListener('click', e => { if (e.target === modal) setModal(false); });
$('#checkoutForm').addEventListener('submit', e => {
  if (e.currentTarget.action.includes('YOUR_PRODUCT_FORM_ENDPOINT_HERE')) {
    e.preventDefault();
    alert('Add your product form endpoint in index.html before accepting orders.');
  }
});

// No-API business assistant. This is intentionally a small, curated knowledge base.
const assistant = $('#assistant');
const chatBtn = $('#chatBtn');
const chatBox = $('#chatBox');
const chatClose = $('#chatClose');
const messages = $('#messages');
const chatInput = $('#chatInput');

function setAssistant(open) {
  assistant.classList.toggle('open', open);
  chatBtn.setAttribute('aria-expanded', String(open));
  chatBox.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => chatInput.focus(), 80);
}

chatBtn.addEventListener('click', () => setAssistant(!assistant.classList.contains('open')));
chatClose.addEventListener('click', () => setAssistant(false));
$$('[data-open-chat]').forEach(button => button.addEventListener('click', () => setAssistant(true)));

const knowledge = [
  {
    keys: ['what', 'orvaen', 'do you do', 'services'],
    answer: 'ORVAEN builds practical digital systems: AI automation, websites, chatbots and assistants, media/creative systems, and focused digital products. The goal is simple — remove friction and help a business operate better.'
  },
  {
    keys: ['agency', 'agencies', 'social media manager', 'smm'],
    answer: 'For agencies and social-media teams, ORVAEN can help turn repetitive client work into cleaner workflows, build better client-facing websites, create useful assistants, and provide focused tools such as the Meta Recovery Toolkit. Think of us as a systems layer behind the work.'
  },
  {
    keys: ['business', 'company', 'brand', 'scale', 'upscale'],
    answer: 'Businesses usually benefit when repetitive work, lead handling, website experience and internal processes become simpler. ORVAEN can map the problem first, then build only the amount of technology that is actually useful.'
  },
  {
    keys: ['automation', 'automate', 'workflow'],
    answer: 'Our automation work focuses on repetitive tasks, lead flows, operations and connecting tools. We prefer practical workflows over adding technology just because it looks impressive.'
  },
  {
    keys: ['website', 'web', 'site'],
    answer: 'We build responsive, conversion-focused websites and landing pages around the brand and its actual goal. We can also help with structure, SEO basics and clearer user journeys.'
  },
  {
    keys: ['chatbot', 'assistant'],
    answer: 'We build focused chatbots and assistants for support, sales, FAQs and knowledge. They can be designed around a controlled information set instead of pretending to know everything.'
  },
  {
    keys: ['toolkit', 'meta recovery', 'recovery kit', '999', 'product'],
    answer: 'The Meta Recovery Toolkit is ORVAEN’s first digital product and costs ₹999. It is designed mainly for Instagram creators, social-media agencies and businesses dealing with account restrictions, recovery and prevention. It is educational and does not guarantee reinstatement.'
  },
  {
    keys: ['instagram', 'ig'],
    answer: 'You can find ORVAEN on Instagram at @orvaen.ig. We share practical business, digital-system and account-safety content there.'
  },
  {
    keys: ['contact', 'email', 'mail', 'reach'],
    answer: 'You can email us at orvaen+contact@proton.me or message @orvaen.ig on Instagram. If you have a project, tell us what you are trying to build, automate or improve.'
  },
  {
    keys: ['price', 'cost', 'how much'],
    answer: 'The Meta Recovery Toolkit is ₹999. Service projects are scoped according to what you need, so we prefer to understand the problem before quoting.'
  },
  {
    keys: ['why', 'different', 'better'],
    answer: 'Our philosophy is straightforward: understand the problem first, then use the right amount of technology to solve it. We focus on useful systems, clearer operations and practical outcomes rather than technology for its own sake.'
  }
];

function getAnswer(question) {
  const q = question.toLowerCase().trim();
  let best = null;
  let score = 0;
  knowledge.forEach(item => {
    const hits = item.keys.reduce((n, key) => n + (q.includes(key) ? 1 : 0), 0);
    if (hits > score) { score = hits; best = item.answer; }
  });
  return best || 'I can help with ORVAEN, our services, how we help agencies and businesses, the Meta Recovery Toolkit, pricing, Instagram or contact details. Try one of those topics.';
}

function addMessage(text, type) {
  const el = document.createElement('div');
  el.className = 'msg ' + type;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMessage(text.trim(), 'user');
  chatInput.value = '';
  window.setTimeout(() => addMessage(getAnswer(text), 'bot'), 220);
}

$('#chatForm').addEventListener('submit', e => { e.preventDefault(); sendMessage(chatInput.value); });
$$('.quick-prompts button').forEach(button => button.addEventListener('click', () => sendMessage(button.textContent)));

// Global escape key.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    setModal(false);
    setCart(false);
    setAssistant(false);
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});
