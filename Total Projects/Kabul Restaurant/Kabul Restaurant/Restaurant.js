const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#primary-navigation');
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (navToggle && navLinks) {
  const closeNavigation = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });
}

// Client-side validation with POST to serverless contact endpoint (Netlify)
async function postContact(data) {
  try {
    const res = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.elements.namedItem('name').value.trim();
    const email = form.elements.namedItem('email').value.trim();
    const message = form.elements.namedItem('message').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in all fields before sending.';
      feedback.setAttribute('role', 'alert');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.setAttribute('role', 'alert');
      return;
    }

    const payload = { name, email, message };
    feedback.textContent = 'Sending message…';
    feedback.setAttribute('role', 'status');
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    const delivered = await postContact(payload);
    if (submitButton) submitButton.disabled = false;

    if (delivered) {
      feedback.textContent = 'Thanks — your message has been sent.';
      form.reset();
      return;
    }

    // Fallback: open mail client if serverless endpoint is unavailable
    const ownerEmail = 'sakhiomid714@gmail.com';
    const subject = encodeURIComponent(`Message from ${name} via Kabul Restaurant website`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    feedback.textContent = 'Could not send directly — opening your email client as a fallback.';
    window.location.href = mailtoUrl;
    form.reset();
  });
}
