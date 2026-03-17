'use strict';

const navLinks = document.querySelectorAll('#navMenu a');
const pages = document.querySelectorAll('.page-section');
let temp = []; // might use later

function goPage(pageId) {
  pages.forEach(function(page) {
    page.classList.add('hidden-section');
  });

  navLinks.forEach(function(link) {
    link.classList.remove('is-active');
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden-section');

    const active = document.querySelector('#navMenu a[href="#' + pageId + '"]');
    if (active) active.classList.add('is-active');

    // console.log('navigating'); // used during testing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // not sure why this happens sometimes but ok
    console.log('page not found:', pageId);
  }
}

navLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    // handling click
    e.preventDefault();

    console.log('clicked nav');

    let href = this.getAttribute('href');
    if (!href) return;
    if (!href.startsWith('#')) return;

    const pageId = href.substring(1);
    goPage(pageId);
    window.location.hash = href;
  });
});

window.addEventListener('hashchange', function() {
  const hash = window.location.hash || '#home';
  const pageId = hash.substring(1);
  if (document.getElementById(pageId)) {
    goPage(pageId);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash || '#home';
  const pageId = hash.substring(1);
  goPage(document.getElementById(pageId) ? pageId : 'home');
});

const form1 = document.getElementById('appointmentForm');
const msgBox = document.getElementById('successMessage');

if (form1) {
  form1.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const doctor = document.getElementById('doctorSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const message = document.getElementById('patientMessage').value;

    if (!name) {
      alert('Please enter your name');
      return;
    }
    if (name === '') {
      return;
    }

    let list = [];
    let raw = localStorage.getItem('hospitalAppointments');
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.log('storage parse issue', err);
        list = [];
      }
    }

    // again checking just in case
    if (!list) list = [];

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

    form1.reset();
  });
}
