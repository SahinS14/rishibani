const toggle = document.querySelector('.menu-toggle');
// A short branded entrance; CSS also dismisses it if scripts or loading stall.
const preloader = document.querySelector('.preloader');
const dismissPreloader = () => {
  const remaining = Math.max(0, 2400 - performance.now());
  setTimeout(() => preloader?.classList.add('loaded'), remaining);
};
if (document.readyState === 'complete') dismissPreloader();
else window.addEventListener('load', dismissPreloader, { once: true });
const nav = document.querySelector('.nav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));
toggle.setAttribute('aria-controls', 'main-menu');
document.querySelector('.nav-links').id = 'main-menu';
function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target)) closeMenu();
});
document.querySelectorAll('.ritual-card a').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('.puja-booking select');
    const service = link.closest('.ritual-card').querySelector('h3').textContent.trim();
    if (select) select.value = service;
  });
});
const bookingDate = document.querySelector('.puja-booking input[type="date"]');
if (bookingDate) {
  const today = new Date();
  bookingDate.min = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');
}
document.querySelectorAll('.step-icon').forEach((icon, index) => { icon.textContent = '0' + (index + 1); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll('.history-content, .shanti-grid, .future-copy, .journey-card, .sphere-card, .vastu-details, .ritual-card, .testimonial-grid article, .support-faq').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
const progress = document.createElement('div');
progress.className = 'page-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
const scrollTopButton = document.querySelector('.scroll-top');
scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  document.querySelector('.nav .brand').focus({ preventScroll: true });
});
let queued = false;
function updateScroll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (distance > 0 ? scrollY / distance : 0) + ')';
    scrollTopButton.hidden = scrollY < 350;
    document.querySelector('.site-header')?.classList.toggle('is-scrolled', scrollY > 30);
    queued = false;
  });
}
window.addEventListener('scroll', updateScroll, { passive: true });
window.addEventListener('resize', updateScroll, { passive: true });
updateScroll();
document.querySelectorAll('.sphere-grid, .ritual-grid, .testimonial-grid').forEach(grid => {
  [...grid.children].forEach((card, index) => {
    card.style.transitionDelay = reducedMotion.matches ? '0ms' : Math.min(index * 75, 300) + 'ms';
  });
});
const portrait = document.querySelector('.card-shastri');
if (portrait && matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
  portrait.addEventListener('pointermove', event => {
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    portrait.style.transform = 'rotateY(' + x * 7 + 'deg) rotateX(' + -y * 5 + 'deg)';
  });
  portrait.addEventListener('pointerleave', () => { portrait.style.transform = ''; });
}
const fileInput = document.querySelector('#home-plan');
const upload = document.querySelector('.upload-box');
const uploadText = upload?.querySelector('small');
function showFile(file) {
  if (!file) return;
  const valid = ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type) && file.size <= 10 * 1024 * 1024;
  uploadText.textContent = valid ? file.name + ' — selected for consultation' : 'Please choose a PDF, JPG or PNG smaller than 10 MB.';
  if (!valid) fileInput.value = '';
}
if (upload && fileInput && uploadText) {
upload.tabIndex = 0;
upload.setAttribute('role', 'button');
upload.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});
uploadText.setAttribute('aria-live', 'polite');
fileInput.addEventListener('change', () => showFile(fileInput.files[0]));
upload.addEventListener('dragover', event => { event.preventDefault(); upload.classList.add('dragover'); });
upload.addEventListener('dragleave', () => upload.classList.remove('dragover'));
upload.addEventListener('drop', event => {
  event.preventDefault();
  upload.classList.remove('dragover');
  fileInput.files = event.dataTransfer.files;
  showFile(fileInput.files[0]);
});
}
document.querySelectorAll('.video-thumb button').forEach(button => {
  button.disabled = true;
  button.title = 'Video coming soon';
  button.setAttribute('aria-label', 'Testimonial video coming soon');
});

/* Booking page (booking.html) */
const bookingDateInputs = document.querySelectorAll('.bkg-form input[type="date"]');
if (bookingDateInputs.length) {
  const today = new Date();
  const minDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  bookingDateInputs.forEach(input => { if (input.id !== 'dob') input.min = minDate; });
}

const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  const serviceSelect = bookingForm.querySelector('#service');
  const birthPanel = document.querySelector('#bkg-birth');
  const summaryPrice = document.querySelector('#summary-price');
  const summaryService = document.querySelector('#summary-service');
  const summaryAstrologer = document.querySelector('#summary-astrologer');
  const summaryMode = document.querySelector('#summary-mode');
  const summaryDate = document.querySelector('#summary-date');
  const summaryTime = document.querySelector('#summary-time');
  const astrologerSelect = bookingForm.querySelector('#astrologer');
  const chamberSelect = bookingForm.querySelector('#chamber');
  const dateInput = bookingForm.querySelector('#date');
  const timeSelect = bookingForm.querySelector('#time-slot');
  const nameInput = bookingForm.querySelector('#full-name');

  function updateSummary() {
    const option = serviceSelect.options[serviceSelect.selectedIndex];
    const price = option?.dataset.price;
    summaryPrice.textContent = price ? price : '—';
    summaryService.textContent = option && option.value ? option.value : 'No service selected yet';
    if (birthPanel) birthPanel.hidden = !(option && option.dataset.birth === '1');

    summaryAstrologer.textContent = astrologerSelect.value || 'Any available acharya';
    summaryMode.textContent = chamberSelect.value || 'Mode not chosen';

    if (dateInput.value) {
      const d = new Date(dateInput.value + 'T00:00:00');
      summaryDate.textContent = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
      summaryDate.textContent = 'Date not chosen';
    }
    summaryTime.textContent = timeSelect.value || 'Slot not chosen';
  }

  [serviceSelect, astrologerSelect, chamberSelect, dateInput, timeSelect].forEach(field => {
    field?.addEventListener('change', updateSummary);
  });
  updateSummary();

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }
    const bookingId = 'RB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const successPanel = document.querySelector('#booking-success');
    document.querySelector('#success-name').textContent = nameInput.value ? ', ' + nameInput.value.split(' ')[0] : '';
    document.querySelector('#success-id').textContent = bookingId;
    const summaryList = document.querySelector('#success-summary');
    const service = serviceSelect.options[serviceSelect.selectedIndex]?.value || '—';
    const date = summaryDate.textContent;
    const time = timeSelect.value || '—';
    const mode = chamberSelect.value || '—';
    summaryList.innerHTML = [
      ['Service', service],
      ['Date & Time', date + ' · ' + time],
      ['Mode', mode]
    ].map(([label, value]) => '<li>' + label + ': <b>' + value + '</b></li>').join('');
    bookingForm.hidden = true;
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
}
