// script.js - CareWell Hospital

var navLinks = document.querySelectorAll('#navMenu a');
var sections = document.querySelectorAll('.page-section');

var form = document.getElementById('appointmentForm');
var msgBox = document.getElementById('successMessage');

function showPage(pageId) {
  sections.forEach(function(sec) {
    sec.classList.add('hidden-section');
  });

  navLinks.forEach(function(a) {
    a.classList.remove('is-active');
  });

  var target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden-section');
  }

  var activeLink = document.querySelector('#navMenu a[href="#' + pageId + '"]');
  if (activeLink) {
    activeLink.classList.add('is-active');
  }

  window.scrollTo(0, 0);
}

navLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    var href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    var pageId = href.substring(1);
    showPage(pageId);
    window.location.hash = href;
  });
});

// browser back/forward support
window.addEventListener('hashchange', function() {
  var hash = window.location.hash || '#home';
  var pageId = hash.substring(1);
  if (document.getElementById(pageId)) {
    showPage(pageId);
  }
});

// handle anchor links outside nav (hero, footer etc)
document.addEventListener('click', function(e) {
  var el = e.target.closest('a[href^="#"]');
  if (!el) return;
  if (el.closest('#navMenu')) return;

  var href = el.getAttribute('href');
  var pageId = href.substring(1);
  if (document.getElementById(pageId)) {
    e.preventDefault();
    showPage(pageId);
    window.location.hash = href;
  }
});

// appointment form submit
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name = document.getElementById('patientName').value.trim();
    var phone = document.getElementById('patientPhone').value.trim();
    var doctor = document.getElementById('doctorSelect').value;
    var date = document.getElementById('appointmentDate').value;
    var message = document.getElementById('patientMessage').value.trim();

    if (!name) {
      alert('Please enter your name');
      return;
    }

    if (!phone) {
      alert('Please enter your phone number');
      return;
    }

    if (!doctor) {
      alert('Please select a doctor or department');
      return;
    }

    if (!date) {
      alert('Please choose a date');
      return;
    }

    var saved = localStorage.getItem('hospitalAppointments');
    var list = [];

    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (err) {
        list = [];
      }
    }

    list.push({
      id: Date.now(),
      name: name,
      phone: phone,
      doctor: doctor,
      date: date,
      message: message
    });

    localStorage.setItem('hospitalAppointments', JSON.stringify(list));

    if (msgBox) {
      msgBox.classList.remove('hidden');
      setTimeout(function() {
        msgBox.classList.add('hidden');
      }, 3500);
    }

    form.reset();
  });
}

// figure out which page to show on load
(function() {
  var startPage = 'home';
  var hash = window.location.hash;
  if (hash && hash.length > 1) {
    var id = hash.substring(1);
    if (document.getElementById(id)) {
      startPage = id;
    }
  }
  showPage(startPage);
})();
