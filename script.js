'use strict';

// quick debug switch (leave false for normal)
const DEBUG_NAV = false;

const navLinks = document.querySelectorAll('#navMenu a');
const pages = document.querySelectorAll('.page-section');

function setActiveNav(hash) {
  navLinks.forEach(function(link) { link.classList.remove('is-active'); });
  const active = document.querySelector(`#navMenu a[href="${hash}"]`);
  if (active) active.classList.add('is-active');
}

function navigateTo(pageId) {
  pages.forEach(function(page) { page.classList.add('hidden-section'); });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden-section');
    if (DEBUG_NAV) console.log('navigating to', pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

navLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const pageId = href.substring(1);
    navigateTo(pageId);
    setActiveNav(href);
    window.location.hash = href;
  });
});

window.addEventListener('hashchange', function() {
  const hash = window.location.hash || '#home';
  const pageId = hash.substring(1);
  if (document.getElementById(pageId)) {
    navigateTo(pageId);
    setActiveNav(hash);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash || '#home';
  const pageId = hash.substring(1);
  navigateTo(document.getElementById(pageId) ? pageId : 'home');
  setActiveNav(document.getElementById(pageId) ? hash : '#home');
});

const appointmentForm = document.getElementById('appointmentForm');
const successMessage = document.getElementById('successMessage');

function saveToLocalStorage(data) {
  let list = JSON.parse(localStorage.getItem('hospitalAppointments')) || [];
  if (!list) list = [];
  list.push(data);
  localStorage.setItem('hospitalAppointments', JSON.stringify(list));
}

if (appointmentForm) {
  appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const doctor = document.getElementById('doctorSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const message = document.getElementById('patientMessage').value;

    saveToLocalStorage({
      id: Date.now(),
      name: name,
      phone: phone,
      doctor: doctor,
      date: date,
      message: message
    });

    if (successMessage) {
      successMessage.classList.remove('hidden');
      setTimeout(function() { successMessage.classList.add('hidden'); }, 4000);
    }

    appointmentForm.reset();
  });
}
