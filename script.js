// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect on navbar
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 150;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTERS =====
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounters() {
  statNumbers.forEach(num => {
    const target = parseInt(num.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        num.textContent = target;
        clearInterval(timer);
      } else {
        num.textContent = Math.floor(current);
      }
    }, 16);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    container.appendChild(particle);
  }
}
createParticles();

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== REGISTRATION FORM =====
function validateAndPay(e) {
  e.preventDefault();

  const mobile = document.getElementById('mobile').value.trim();

  if (!/^\d+$/.test(mobile)) {
    showNotification('❌ Mobile number must contain only digits', 'error');
    return;
  }
  if (mobile.length !== 10) {
    showNotification('❌ Mobile number must be exactly 10 digits', 'error');
    return;
  }

  const data = {
    teamName: document.getElementById('teamName').value,
    iglName: document.getElementById('iglName').value,
    email: document.getElementById('email').value,
    mobile: mobile,
    supporter: document.getElementById('supporter').value,
    player1: document.getElementById('p1').value,
    player2: document.getElementById('p2').value,
    player3: document.getElementById('p3').value,
    player4: document.getElementById('p4').value
  };

  // Submit data to Google Sheets
  fetch('https://script.google.com/macros/s/AKfycbzOe7rn96J3lsWiwfn-gNKH4f6TJxRyCCeLQa1bJ4Jz6zq5RuFP9noyEeqN3WoPCrYb/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(data)
  });

  // UPI Payment
  const upiURL = 'upi://pay?pa=sanketmali011-2@oksbi&pn=RAEGE%20SPORT&am=10&cu=INR';
  window.location.href = upiURL;
}

// ===== CONTACT FORM =====
function submitContact(e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;

  // You can integrate with EmailJS or Google Sheets here
  showNotification('✅ Message sent successfully! We will get back to you soon.', 'success');
  e.target.reset();
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:18px;margin-left:12px;">&times;</button>
  `;

  // Styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '14px 24px',
    borderRadius: '12px',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: '9999',
    animation: 'fadeInDown 0.4s ease-out',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    background: type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(0, 240, 255, 0.95)',
    color: type === 'error' ? '#fff' : '#000',
    backdropFilter: 'blur(10px)',
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-20px)';
    notification.style.transition = 'all 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
