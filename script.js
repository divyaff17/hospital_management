/**
 * MediCore Hospital Management System
 * Main application logic — handles navigation, CRUD operations,
 * data persistence (LocalStorage), and UI rendering.
 */
'use strict';

// ============ DOM References ============
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const hamburger = document.getElementById('hamburgerBtn');
const headerTitle = document.getElementById('headerTitle');
const headerDate = document.getElementById('headerDate');
const mainContent = document.getElementById('mainContent');
const toastContainer = document.getElementById('toastContainer');

// ============ App State ============
let currentSection = 'dashboard';
let patientPage = 1;
const patientsPerPage = 8;
const activityItems = [];

const defaultData = {
  patients: [
    {
      id: 'P-1001', name: 'James Wilson', age: 45, gender: 'Male',
      phone: '555-0101', address: '42 Oak St', blood: 'A+',
      disease: 'Hypertension', doctor: 'Dr. Sarah Chen',
      admitDate: '2026-03-10', room: '201-A', status: 'Admitted'
    },
    {
      id: 'P-1002', name: 'Maria Garcia', age: 32, gender: 'Female',
      phone: '555-0102', address: '18 Elm Ave', blood: 'O+',
      disease: 'Pneumonia', doctor: 'Dr. Michael Park',
      admitDate: '2026-03-12', room: '105-B', status: 'Admitted'
    },
    {
      id: 'P-1003', name: 'Robert Brown', age: 58, gender: 'Male',
      phone: '555-0103', address: '7 Pine Rd', blood: 'B+',
      disease: 'Diabetes', doctor: 'Dr. Sarah Chen',
      admitDate: '2026-03-08', room: '302-A', status: 'Discharged'
    },
    {
      id: 'P-1004', name: 'Emily Davis', age: 27, gender: 'Female',
      phone: '555-0104', address: '33 Maple Dr', blood: 'AB-',
      disease: 'Fracture', doctor: 'Dr. Anil Kapoor',
      admitDate: '2026-03-13', room: '410-C', status: 'Admitted'
    },
    {
      id: 'P-1005', name: 'David Lee', age: 63, gender: 'Male',
      phone: '555-0105', address: '91 Cedar Ln', blood: 'O-',
      disease: 'Heart Disease', doctor: 'Dr. Lisa Wong',
      admitDate: '2026-03-07', room: '101-A', status: 'Admitted'
    }
  ],

  doctors: [
    {
      id: 'D-101', name: 'Dr. Sarah Chen',
      specialization: 'Internal Medicine', phone: '555-1001',
      email: 'sarah@medicore.com', department: 'General Medicine',
      experience: 12, availability: 'Available'
    },
    {
      id: 'D-102', name: 'Dr. Michael Park',
      specialization: 'Pulmonology', phone: '555-1002',
      email: 'michael@medicore.com', department: 'Cardiology',
      experience: 8, availability: 'Available'
    },
    {
      id: 'D-103', name: 'Dr. Lisa Wong',
      specialization: 'Cardiology', phone: '555-1003',
      email: 'lisa@medicore.com', department: 'Cardiology',
      experience: 15, availability: 'Busy'
    },
    {
      id: 'D-104', name: 'Dr. Anil Kapoor',
      specialization: 'Orthopedics', phone: '555-1004',
      email: 'anil@medicore.com', department: 'Orthopedics',
      experience: 10, availability: 'Available'
    },
    {
      id: 'D-105', name: 'Dr. Rachel Adams',
      specialization: 'Pediatrics', phone: '555-1005',
      email: 'rachel@medicore.com', department: 'Pediatrics',
      experience: 6, availability: 'Off Duty'
    }
  ],

  appointments: [
    {
      id: 'A-501', patient: 'James Wilson', doctor: 'Dr. Sarah Chen',
      department: 'General Medicine', date: '2026-03-15',
      time: '09:00', reason: 'Follow-up checkup', status: 'Scheduled'
    },
    {
      id: 'A-502', patient: 'Maria Garcia', doctor: 'Dr. Michael Park',
      department: 'Cardiology', date: '2026-03-15',
      time: '10:30', reason: 'Chest X-ray review', status: 'Scheduled'
    },
    {
      id: 'A-503', patient: 'Emily Davis', doctor: 'Dr. Anil Kapoor',
      department: 'Orthopedics', date: '2026-03-14',
      time: '14:00', reason: 'Cast removal', status: 'Completed'
    }
  ],

  departments: [
    { id: 'DEP-1', name: 'Cardiology', head: 'Dr. Lisa Wong', staffCount: 24 },
    { id: 'DEP-2', name: 'Neurology', head: 'Dr. James Hart', staffCount: 18 },
    { id: 'DEP-3', name: 'Orthopedics', head: 'Dr. Anil Kapoor', staffCount: 15 },
    { id: 'DEP-4', name: 'Pediatrics', head: 'Dr. Rachel Adams', staffCount: 20 },
    { id: 'DEP-5', name: 'Emergency', head: 'Dr. Sarah Chen', staffCount: 30 },
    { id: 'DEP-6', name: 'General Medicine', head: 'Dr. Sarah Chen', staffCount: 22 }
  ],

  beds: [
    { id: 'B-1', roomNum: '101', bedNum: 'A', type: 'ICU', status: 'Occupied' },
    { id: 'B-2', roomNum: '101', bedNum: 'B', type: 'ICU', status: 'Available' },
    { id: 'B-3', roomNum: '201', bedNum: 'A', type: 'Private', status: 'Occupied' },
    { id: 'B-4', roomNum: '302', bedNum: 'A', type: 'General', status: 'Available' },
    { id: 'B-5', roomNum: '105', bedNum: 'B', type: 'General', status: 'Occupied' },
    { id: 'B-6', roomNum: '410', bedNum: 'C', type: 'Private', status: 'Occupied' },
    { id: 'B-7', roomNum: '203', bedNum: 'A', type: 'General', status: 'Available' },
    { id: 'B-8', roomNum: '204', bedNum: 'A', type: 'General', status: 'Available' }
  ],

  medicines: [
    {
      id: 'M-01', name: 'Amoxicillin', category: 'Antibiotic',
      manufacturer: 'PharmaCorp', stock: 250, price: 12.50, expiry: '2027-06-15'
    },
    {
      id: 'M-02', name: 'Ibuprofen', category: 'Painkiller',
      manufacturer: 'MedPlus', stock: 500, price: 8.00, expiry: '2027-12-01'
    },
    {
      id: 'M-03', name: 'Metformin', category: 'Antidiabetic',
      manufacturer: 'HealthGen', stock: 15, price: 22.00, expiry: '2027-03-20'
    },
    {
      id: 'M-04', name: 'Lisinopril', category: 'Antihypertensive',
      manufacturer: 'CardioPharm', stock: 8, price: 18.50, expiry: '2026-11-30'
    },
    {
      id: 'M-05', name: 'Cetirizine', category: 'Antihistamine',
      manufacturer: 'AllergyFree', stock: 320, price: 5.00, expiry: '2028-01-10'
    }
  ],

  bills: [
    {
      id: 'BL-001', patient: 'James Wilson',
      roomCharges: 1500, doctorFee: 500,
      labCharges: 300, medCharges: 200,
      total: 2500, payStatus: 'Paid'
    },
    {
      id: 'BL-002', patient: 'Maria Garcia',
      roomCharges: 800, doctorFee: 500,
      labCharges: 450, medCharges: 150,
      total: 1900, payStatus: 'Pending'
    }
  ],

  labReports: [
    {
      id: 'LR-01', patient: 'James Wilson', testType: 'Blood Panel',
      testDate: '2026-03-11', doctor: 'Dr. Sarah Chen',
      result: 'Normal ranges, slightly elevated cholesterol', status: 'Completed'
    },
    {
      id: 'LR-02', patient: 'David Lee', testType: 'ECG',
      testDate: '2026-03-12', doctor: 'Dr. Lisa Wong',
      result: '', status: 'Pending'
    },
    {
      id: 'LR-03', patient: 'Maria Garcia', testType: 'Chest X-Ray',
      testDate: '2026-03-13', doctor: 'Dr. Michael Park',
      result: 'Mild bilateral infiltrates', status: 'Completed'
    }
  ],

  staff: [
    { id: 'S-01', name: 'Nancy Drew', role: 'Nurse', phone: '555-2001', department: 'Cardiology', shift: 'Morning' },
    { id: 'S-02', name: 'Tom Harris', role: 'Receptionist', phone: '555-2002', department: 'General Medicine', shift: 'Morning' },
    { id: 'S-03', name: 'Priya Sharma', role: 'Nurse', phone: '555-2003', department: 'Emergency', shift: 'Night' },
    { id: 'S-04', name: 'Carlos Mendez', role: 'Admin', phone: '555-2004', department: 'General Medicine', shift: 'Afternoon' }
  ],

  emergencies: [
    {
      id: 'EM-01', patient: 'John Doe', arrival: '2026-03-14T01:30',
      condition: 'Chest Pain', doctor: 'Dr. Lisa Wong', status: 'Stabilized'
    },
    {
      id: 'EM-02', patient: 'Jane Smith', arrival: '2026-03-14T03:15',
      condition: 'Severe Trauma', doctor: 'Dr. Anil Kapoor', status: 'Active'
    }
  ],

  inventory: [
    { id: 'INV-01', name: 'Surgical Gloves', category: 'PPE', stock: 5000, supplier: 'MedSupply Co', lastUpdated: '2026-03-10' },
    { id: 'INV-02', name: 'IV Drip Sets', category: 'Equipment', stock: 200, supplier: 'HealthEquip', lastUpdated: '2026-03-12' },
    { id: 'INV-03', name: 'Syringes (10ml)', category: 'Consumable', stock: 3000, supplier: 'MedSupply Co', lastUpdated: '2026-03-09' },
    { id: 'INV-04', name: 'N95 Masks', category: 'PPE', stock: 1500, supplier: 'SafeGuard Inc', lastUpdated: '2026-03-13' }
  ],

  settings: {
    hospitalName: 'MediCore General Hospital',
    address: '123 Health Avenue, Medical District',
    phone: '+1 (555) 123-4567'
  }
};

// ============ LocalStorage Helpers ============

/** Saves data to LocalStorage under the hms_ namespace */
function saveData(key, data) {
  localStorage.setItem('hms_' + key, JSON.stringify(data));
}

/** Loads and parses data from LocalStorage */
function loadData(key) {
  const raw = localStorage.getItem('hms_' + key);
  return raw ? JSON.parse(raw) : null;
}

function getData(key) {
  return loadData(key) || defaultData[key] || [];
}

/** Seeds LocalStorage with default data on first visit */
function initData() {
  const keys = Object.keys(defaultData);
  keys.forEach(function(key) {
    if (!loadData(key)) saveData(key, defaultData[key]);
  });
}

// ============ Utility Functions ============

/** Generates a unique ID with a given prefix (e.g. "P-KXYZ12") */
function genId(prefix) {
  return prefix + '-' + Date.now().toString(36).toUpperCase();
}

/** Converts "YYYY-MM-DD" to "MM/DD/YYYY" for display */
function formatDate(d) {
  if (!d) return '—';
  const parts = d.split('-');
  return parts[1] + '/' + parts[2] + '/' + parts[0];
}

/** Returns today's date as "YYYY-MM-DD" */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/** Displays a temporary toast notification */
function showToast(msg, isError) {
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

/** Returns an HTML badge element coloured by status */
function statusBadge(status) {
  const map = {
    'Admitted': 'blue',
    'Discharged': 'green',
    'Available': 'green',
    'Busy': 'orange',
    'Off Duty': 'red',
    'Scheduled': 'blue',
    'Completed': 'green',
    'Cancelled': 'red',
    'Occupied': 'red',
    'Pending': 'orange',
    'Paid': 'green',
    'Partial': 'orange',
    'Active': 'red',
    'Stabilized': 'orange'
  };
  const color = map[status] || 'blue';
  return '<span class="badge badge-' + color + '">' + status + '</span>';
}

/** Pushes a message onto the activity log (max 20 entries) */
function logActivity(msg) {
  activityItems.unshift({ msg: msg, time: new Date().toLocaleTimeString() });
  if (activityItems.length > 20) activityItems.pop();
}

// ============ Navigation ============

/** Switches the visible page section and updates the sidebar highlight */
function switchSection(section) {
  currentSection = section;

  document.querySelectorAll('.page-section').forEach(function(el) {
    el.classList.add('hidden');
  });
  document.getElementById('sec-' + section).classList.remove('hidden');

  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.classList.remove('active');
  });
  const activeLink = document.querySelector('[data-section="' + section + '"]');
  if (activeLink) activeLink.classList.add('active');

  // human-readable page titles
  const titles = {
    dashboard: 'Dashboard',
    patients: 'Patients',
    doctors: 'Doctors',
    appointments: 'Appointments',
    departments: 'Departments',
    beds: 'Beds & Rooms',
    billing: 'Billing',
    pharmacy: 'Pharmacy',
    labreports: 'Lab Reports',
    staff: 'Staff Management',
    emergency: 'Emergency Cases',
    inventory: 'Inventory',
    reports: 'Reports',
    settings: 'Settings'
  };
  headerTitle.textContent = titles[section] || section;

  // render the section
  const renderMap = {
    dashboard: renderDashboard,
    patients: renderPatients,
    doctors: renderDoctors,
    appointments: renderAppointments,
    departments: renderDepartments,
    beds: renderBeds,
    billing: renderBilling,
    pharmacy: renderPharmacy,
    labreports: renderLabReports,
    staff: renderStaff,
    emergency: renderEmergency,
    inventory: renderInventory,
    reports: renderReports,
    settings: renderSettings
  };
  if (renderMap[section]) renderMap[section]();

  // close sidebar on mobile
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
}

// sidebar clicks
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    switchSection(this.dataset.section);
  });
});

// hamburger
hamburger.addEventListener('click', function() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
});
overlay.addEventListener('click', function() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
});

// ============ Modal Helpers ============
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  populateDropdowns();
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  const form = document.getElementById(id).querySelector('form');
  if (form) form.reset();
  // clear hidden edit ids
  document.querySelectorAll('#' + id + ' input[type="hidden"]').forEach(function(el) { el.value = ''; });
}

function populateDropdowns() {
  const doctors = getData('doctors');
  const patients = getData('patients');
  const depts = getData('departments');

  fillSelect('pDoctor', doctors.map(function(d) { return d.name; }));
  fillSelect('apptPatient', patients.map(function(p) { return p.name; }));
  fillSelect('apptDoctor', doctors.map(function(d) { return d.name; }));
  fillSelect('apptDept', depts.map(function(d) { return d.name; }));
  fillSelect('billPatient', patients.map(function(p) { return p.name; }));
  fillSelect('labPatient', patients.map(function(p) { return p.name; }));
  fillSelect('labDoctor', doctors.map(function(d) { return d.name; }));
  fillSelect('emDoctor', doctors.map(function(d) { return d.name; }));
  fillSelect('docDept', depts.map(function(d) { return d.name; }));
  fillSelect('staffDept', depts.map(function(d) { return d.name; }));

  // patient filter dropdowns
  const diseases = [];
  patients.forEach(function(p) {
    if (p.disease && diseases.indexOf(p.disease) === -1) diseases.push(p.disease);
  });
  fillSelect('patientFilterDisease', diseases, true);
  fillSelect('patientFilterDoctor', doctors.map(function(d) { return d.name; }), true);
}

function fillSelect(id, options, keepFirst) {
  const sel = document.getElementById(id);
  if (!sel) return;
  const firstOpt = sel.options[0];
  sel.innerHTML = '';
  if (firstOpt) sel.appendChild(firstOpt);
  options.forEach(function(opt) {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
}

// ============ Dashboard ============
function renderDashboard() {
  const patients = getData('patients');
  const doctors = getData('doctors');
  const appts = getData('appointments');
  const beds = getData('beds');
  const bills = getData('bills');
  const labs = getData('labReports');
  const today = todayStr();

  const todayAppts = appts.filter(function(a) { return a.date === today; }).length;
  const availBeds = beds.filter(function(b) { return b.status === 'Available'; }).length;
  const totalRevenue = bills.reduce(function(sum, b) { return sum + (b.total || 0); }, 0);
  const pendingLabs = labs.filter(function(l) { return l.status === 'Pending'; }).length;

  const stats = [
    { label: 'Total Patients', value: patients.length, cls: '' },
    { label: 'Total Doctors', value: doctors.length, cls: 'green' },
    { label: "Today's Appointments", value: todayAppts, cls: '' },
    { label: 'Available Beds', value: availBeds, cls: 'green' },
    { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString(), cls: 'orange' },
    { label: 'Pending Lab Reports', value: pendingLabs, cls: 'red' }
  ];

  document.getElementById('statsGrid').innerHTML = stats.map(function(s) {
    return `
      <div class="stat-card ${s.cls}">
        <div class="stat-label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
      </div>
    `;
  }).join('');

  // recent patients
  const recent = patients.slice(-5).reverse();
  document.getElementById('recentPatientsBody').innerHTML = recent.map(function(p) {
    return `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.disease || '—'}</td>
        <td>${statusBadge(p.status)}</td>
      </tr>
    `;
  }).join('');

  // upcoming appointments
  const upcoming = appts.filter(function(a) { return a.status === 'Scheduled'; }).slice(0, 5);
  document.getElementById('upcomingApptsBody').innerHTML = upcoming.map(function(a) {
    return `
      <tr>
        <td>${a.patient}</td>
        <td>${a.doctor}</td>
        <td>${formatDate(a.date)}</td>
        <td>${statusBadge(a.status)}</td>
      </tr>
    `;
  }).join('');

  // activity log
  const logEl = document.getElementById('activityLog');
  if (activityItems.length === 0) {
    logEl.innerHTML = '<li>No recent activity</li>';
  } else {
    logEl.innerHTML = activityItems.map(function(item) {
      return `
        <li>
          <span>${item.msg}</span>
          <span class="log-time">${item.time}</span>
        </li>
      `;
    }).join('');
  }
}

// ============ Patients ============
function renderPatients() {
  const patients = getData('patients');
  const search = document.getElementById('patientSearch').value.toLowerCase();
  const filterDisease = document.getElementById('patientFilterDisease').value;
  const filterDoc = document.getElementById('patientFilterDoctor').value;

  const filtered = patients.filter(function(p) {
    const matchSearch = !search || p.name.toLowerCase().indexOf(search) > -1 || p.id.toLowerCase().indexOf(search) > -1;
    const matchDisease = !filterDisease || p.disease === filterDisease;
    const matchDoc = !filterDoc || p.doctor === filterDoc;
    return matchSearch && matchDisease && matchDoc;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / patientsPerPage));
  if (patientPage > totalPages) patientPage = totalPages;
  const start = (patientPage - 1) * patientsPerPage;
  const pageItems = filtered.slice(start, start + patientsPerPage);

  document.getElementById('patientsTableBody').innerHTML = pageItems.map(function(p) {
    return `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.phone}</td>
        <td>${p.blood || '—'}</td>
        <td>${p.disease || '—'}</td>
        <td>${p.doctor || '—'}</td>
        <td>${statusBadge(p.status)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editPatient('${p.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deletePatient('${p.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // pagination
  let pagHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    pagHtml += '<button class="page-btn' + (i === patientPage ? ' active' : '') + '" onclick="patientPage=' + i + ';renderPatients()">' + i + '</button>';
  }
  document.getElementById('patientsPagination').innerHTML = pagHtml;
}

document.getElementById('patientSearch').addEventListener('input', function() { patientPage = 1; renderPatients(); });
document.getElementById('patientFilterDisease').addEventListener('change', function() { patientPage = 1; renderPatients(); });
document.getElementById('patientFilterDoctor').addEventListener('change', function() { patientPage = 1; renderPatients(); });

document.getElementById('patientForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const patients = getData('patients');
  const editId = document.getElementById('patientEditId').value;
  const obj = {
    name: document.getElementById('pName').value,
    age: parseInt(document.getElementById('pAge').value),
    gender: document.getElementById('pGender').value,
    phone: document.getElementById('pPhone').value,
    address: document.getElementById('pAddress').value,
    blood: document.getElementById('pBlood').value,
    disease: document.getElementById('pDisease').value,
    doctor: document.getElementById('pDoctor').value,
    admitDate: document.getElementById('pAdmitDate').value || todayStr(),
    room: document.getElementById('pRoom').value,
    status: document.getElementById('pStatus').value
  };
  if (editId) {
    let idx = patients.findIndex(function(p) { return p.id === editId; });
    if (idx > -1) { obj.id = editId; patients[idx] = obj; }
    logActivity('Updated patient: ' + obj.name);
    showToast('Patient updated');
  } else {
    obj.id = genId('P');
    patients.push(obj);
    logActivity('Added patient: ' + obj.name);
    showToast('Patient added');
  }
  saveData('patients', patients);
  closeModal('patientModal');
  renderPatients();
});

function editPatient(id) {
  const p = getData('patients').find(function(x) { return x.id === id; });
  if (!p) return;
  document.getElementById('patientEditId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pAge').value = p.age;
  document.getElementById('pGender').value = p.gender;
  document.getElementById('pPhone').value = p.phone;
  document.getElementById('pAddress').value = p.address || '';
  document.getElementById('pBlood').value = p.blood || '';
  document.getElementById('pDisease').value = p.disease || '';
  document.getElementById('pDoctor').value = p.doctor || '';
  document.getElementById('pAdmitDate').value = p.admitDate || '';
  document.getElementById('pRoom').value = p.room || '';
  document.getElementById('pStatus').value = p.status || 'Admitted';
  document.getElementById('patientModalTitle').textContent = 'Edit Patient';
  openModal('patientModal');
}

function deletePatient(id) {
  if (!confirm('Delete this patient?')) return;
  const patients = getData('patients').filter(function(p) { return p.id !== id; });
  saveData('patients', patients);
  logActivity('Deleted patient ' + id);
  showToast('Patient deleted');
  renderPatients();
}

// ============ Doctors ============
function renderDoctors() {
  const docs = getData('doctors');
  const search = document.getElementById('doctorSearch').value.toLowerCase();
  const filtered = docs.filter(function(d) {
    return !search || d.name.toLowerCase().indexOf(search) > -1 || d.specialization.toLowerCase().indexOf(search) > -1;
  });
  document.getElementById('doctorsTableBody').innerHTML = filtered.map(function(d) {
    return `
      <tr>
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.specialization}</td>
        <td>${d.phone}</td>
        <td>${d.department || '—'}</td>
        <td>${d.experience} yrs</td>
        <td>${statusBadge(d.availability)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editDoctor('${d.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDoctor('${d.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('doctorSearch').addEventListener('input', renderDoctors);

document.getElementById('doctorForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const docs = getData('doctors');
  const editId = document.getElementById('docEditId').value;
  const obj = {
    name: document.getElementById('docName').value,
    specialization: document.getElementById('docSpecialization').value,
    phone: document.getElementById('docPhone').value,
    email: document.getElementById('docEmail').value,
    department: document.getElementById('docDept').value,
    experience: parseInt(document.getElementById('docExp').value) || 0,
    availability: document.getElementById('docAvailability').value
  };
  if (editId) {
    let idx = docs.findIndex(function(d) { return d.id === editId; });
    if (idx > -1) { obj.id = editId; docs[idx] = obj; }
    logActivity('Updated doctor: ' + obj.name);
    showToast('Doctor updated');
  } else {
    obj.id = genId('D');
    docs.push(obj);
    logActivity('Added doctor: ' + obj.name);
    showToast('Doctor added');
  }
  saveData('doctors', docs);
  closeModal('doctorModal');
  renderDoctors();
});

function editDoctor(id) {
  const d = getData('doctors').find(function(x) { return x.id === id; });
  if (!d) return;
  document.getElementById('docEditId').value = d.id;
  document.getElementById('docName').value = d.name;
  document.getElementById('docSpecialization').value = d.specialization;
  document.getElementById('docPhone').value = d.phone;
  document.getElementById('docEmail').value = d.email || '';
  document.getElementById('docDept').value = d.department || '';
  document.getElementById('docExp').value = d.experience;
  document.getElementById('docAvailability').value = d.availability;
  document.getElementById('doctorModalTitle').textContent = 'Edit Doctor';
  openModal('doctorModal');
}

function deleteDoctor(id) {
  if (!confirm('Delete this doctor?')) return;
  const docs = getData('doctors').filter(function(d) { return d.id !== id; });
  saveData('doctors', docs);
  logActivity('Deleted doctor ' + id);
  showToast('Doctor deleted');
  renderDoctors();
}

// ============ Appointments ============
function renderAppointments() {
  let appts = getData('appointments');
  const filterDate = document.getElementById('apptFilterDate').value;
  if (filterDate) appts = appts.filter(function(a) { return a.date === filterDate; });

  document.getElementById('appointmentsTableBody').innerHTML = appts.map(function(a) {
    return `
      <tr>
        <td>${a.id}</td>
        <td>${a.patient}</td>
        <td>${a.doctor}</td>
        <td>${a.department || '—'}</td>
        <td>${formatDate(a.date)}</td>
        <td>${a.time || '—'}</td>
        <td>${a.reason || '—'}</td>
        <td>${statusBadge(a.status)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editAppointment('${a.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteAppointment('${a.id}')">Cancel</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('apptFilterDate').addEventListener('change', renderAppointments);

document.getElementById('appointmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const appts = getData('appointments');
  const editId = document.getElementById('apptEditId').value;
  const obj = { patient: document.getElementById('apptPatient').value, doctor: document.getElementById('apptDoctor').value, department: document.getElementById('apptDept').value, date: document.getElementById('apptDate').value, time: document.getElementById('apptTime').value, reason: document.getElementById('apptReason').value, status: document.getElementById('apptStatus').value };
  if (editId) {
    let idx = appts.findIndex(function(a) { return a.id === editId; });
    if (idx > -1) { obj.id = editId; appts[idx] = obj; }
    showToast('Appointment updated');
  } else {
    obj.id = genId('A');
    appts.push(obj);
    logActivity('Appointment booked for ' + obj.patient);
    showToast('Appointment created');
  }
  saveData('appointments', appts);
  closeModal('appointmentModal');
  renderAppointments();
});

function editAppointment(id) {
  const a = getData('appointments').find(function(x) { return x.id === id; });
  if (!a) return;
  openModal('appointmentModal');
  document.getElementById('apptEditId').value = a.id;
  document.getElementById('apptPatient').value = a.patient;
  document.getElementById('apptDoctor').value = a.doctor;
  document.getElementById('apptDept').value = a.department || '';
  document.getElementById('apptDate').value = a.date;
  document.getElementById('apptTime').value = a.time;
  document.getElementById('apptReason').value = a.reason || '';
  document.getElementById('apptStatus').value = a.status;
  document.getElementById('appointmentModalTitle').textContent = 'Edit Appointment';
}

function deleteAppointment(id) {
  if (!confirm('Cancel this appointment?')) return;
  const appts = getData('appointments');
  let idx = appts.findIndex(function(a) { return a.id === id; });
  if (idx > -1) { appts[idx].status = 'Cancelled'; }
  saveData('appointments', appts);
  showToast('Appointment cancelled');
  renderAppointments();
}

// ============ Departments ============
function renderDepartments() {
  const depts = getData('departments');
  document.getElementById('departmentsTableBody').innerHTML = depts.map(function(d) {
    return `
      <tr>
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.head || '—'}</td>
        <td>${d.staffCount || 0}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editDepartment('${d.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDepartment('${d.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('departmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const depts = getData('departments');
  const editId = document.getElementById('deptEditId').value;
  const obj = { name: document.getElementById('deptName').value, head: document.getElementById('deptHead').value, staffCount: parseInt(document.getElementById('deptStaffCount').value) || 0 };
  if (editId) {
    let idx = depts.findIndex(function(d) { return d.id === editId; });
    if (idx > -1) { obj.id = editId; depts[idx] = obj; }
    showToast('Department updated');
  } else {
    obj.id = genId('DEP');
    depts.push(obj);
    logActivity('Added department: ' + obj.name);
    showToast('Department added');
  }
  saveData('departments', depts);
  closeModal('departmentModal');
  renderDepartments();
});

function editDepartment(id) {
  const d = getData('departments').find(function(x) { return x.id === id; });
  if (!d) return;
  document.getElementById('deptEditId').value = d.id;
  document.getElementById('deptName').value = d.name;
  document.getElementById('deptHead').value = d.head || '';
  document.getElementById('deptStaffCount').value = d.staffCount || 0;
  document.getElementById('departmentModalTitle').textContent = 'Edit Department';
  openModal('departmentModal');
}

function deleteDepartment(id) {
  if (!confirm('Delete this department?')) return;
  const depts = getData('departments').filter(function(d) { return d.id !== id; });
  saveData('departments', depts);
  showToast('Department deleted');
  renderDepartments();
}

// ============ Beds & Rooms ============
function renderBeds() {
  const beds = getData('beds');
  document.getElementById('bedsTableBody').innerHTML = beds.map(function(b) {
    return `
      <tr>
        <td>${b.roomNum}</td>
        <td>${b.bedNum}</td>
        <td>${b.type}</td>
        <td>${statusBadge(b.status)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editBed('${b.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBed('${b.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('bedForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const beds = getData('beds');
  const editId = document.getElementById('bedEditId').value;
  const obj = { roomNum: document.getElementById('bedRoomNum').value, bedNum: document.getElementById('bedBedNum').value, type: document.getElementById('bedType').value, status: document.getElementById('bedStatus').value };
  if (editId) {
    let idx = beds.findIndex(function(b) { return b.id === editId; });
    if (idx > -1) { obj.id = editId; beds[idx] = obj; }
    showToast('Bed updated');
  } else {
    obj.id = genId('B');
    beds.push(obj);
    showToast('Room/Bed added');
  }
  saveData('beds', beds);
  closeModal('bedModal');
  renderBeds();
});

function editBed(id) {
  const b = getData('beds').find(function(x) { return x.id === id; });
  if (!b) return;
  document.getElementById('bedEditId').value = b.id;
  document.getElementById('bedRoomNum').value = b.roomNum;
  document.getElementById('bedBedNum').value = b.bedNum;
  document.getElementById('bedType').value = b.type;
  document.getElementById('bedStatus').value = b.status;
  document.getElementById('bedModalTitle').textContent = 'Edit Room/Bed';
  openModal('bedModal');
}

function deleteBed(id) {
  if (!confirm('Remove this bed?')) return;
  saveData('beds', getData('beds').filter(function(b) { return b.id !== id; }));
  showToast('Bed removed');
  renderBeds();
}

// ============ Billing ============
function renderBilling() {
  const bills = getData('bills');
  document.getElementById('billingTableBody').innerHTML = bills.map(function(b) {
    return `
      <tr>
        <td>${b.id}</td>
        <td>${b.patient}</td>
        <td>$${b.roomCharges}</td>
        <td>$${b.doctorFee}</td>
        <td>$${b.labCharges}</td>
        <td>$${b.medCharges}</td>
        <td><strong>$${b.total}</strong></td>
        <td>${statusBadge(b.payStatus)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editBill('${b.id}')">Edit</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function calcBillTotal() {
  const r = parseFloat(document.getElementById('billRoom').value) || 0;
  const d = parseFloat(document.getElementById('billDoctor').value) || 0;
  const l = parseFloat(document.getElementById('billLab').value) || 0;
  const m = parseFloat(document.getElementById('billMedicine').value) || 0;
  document.getElementById('billTotal').value = '$' + (r + d + l + m);
}

document.getElementById('billForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const bills = getData('bills');
  const editId = document.getElementById('billEditId').value;
  const r = parseFloat(document.getElementById('billRoom').value) || 0;
  const d = parseFloat(document.getElementById('billDoctor').value) || 0;
  const l = parseFloat(document.getElementById('billLab').value) || 0;
  const m = parseFloat(document.getElementById('billMedicine').value) || 0;
  const obj = { patient: document.getElementById('billPatient').value, roomCharges: r, doctorFee: d, labCharges: l, medCharges: m, total: r + d + l + m, payStatus: document.getElementById('billPayStatus').value };
  if (editId) {
    let idx = bills.findIndex(function(b) { return b.id === editId; });
    if (idx > -1) { obj.id = editId; bills[idx] = obj; }
    showToast('Bill updated');
  } else {
    obj.id = genId('BL');
    bills.push(obj);
    logActivity('Bill generated for ' + obj.patient);
    showToast('Bill generated');
  }
  saveData('bills', bills);
  closeModal('billModal');
  renderBilling();
});

function editBill(id) {
  const b = getData('bills').find(function(x) { return x.id === id; });
  if (!b) return;
  openModal('billModal');
  document.getElementById('billEditId').value = b.id;
  document.getElementById('billPatient').value = b.patient;
  document.getElementById('billRoom').value = b.roomCharges;
  document.getElementById('billDoctor').value = b.doctorFee;
  document.getElementById('billLab').value = b.labCharges;
  document.getElementById('billMedicine').value = b.medCharges;
  document.getElementById('billPayStatus').value = b.payStatus;
  calcBillTotal();
  document.getElementById('billModalTitle').textContent = 'Edit Bill';
}

// ============ Pharmacy ============
function renderPharmacy() {
  const meds = getData('medicines');
  const lowCount = meds.filter(function(m) { return m.stock < 20; }).length;
  const alertEl = document.getElementById('lowStockAlert');
  if (lowCount > 0) {
    alertEl.classList.remove('hidden');
    document.getElementById('lowStockCount').textContent = lowCount;
  } else {
    alertEl.classList.add('hidden');
  }
  document.getElementById('pharmacyTableBody').innerHTML = meds.map(function(m) {
    const stockCls = m.stock < 20 ? ' style="color:var(--danger);font-weight:600"' : '';
    return '<tr><td>' + m.id + '</td><td>' + m.name + '</td><td>' + (m.category || '—') + '</td><td>' + (m.manufacturer || '—') + '</td><td' + stockCls + '>' + m.stock + '</td><td>$' + (m.price || 0).toFixed(2) + '</td><td>' + formatDate(m.expiry) + '</td><td><div class="action-btns"><button class="btn btn-sm btn-primary" onclick="editMedicine(\'' + m.id + '\')">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteMedicine(\'' + m.id + '\')">Del</button></div></td></tr>';
  }).join('');
}

document.getElementById('medicineForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const meds = getData('medicines');
  const editId = document.getElementById('medEditId').value;
  const obj = { name: document.getElementById('medName').value, category: document.getElementById('medCategory').value, manufacturer: document.getElementById('medManufacturer').value, stock: parseInt(document.getElementById('medStock').value)||0, price: parseFloat(document.getElementById('medPrice').value)||0, expiry: document.getElementById('medExpiry').value };
  if (editId) {
    let idx = meds.findIndex(function(m) { return m.id === editId; });
    if (idx > -1) { obj.id = editId; meds[idx] = obj; }
    showToast('Medicine updated');
  } else {
    obj.id = genId('M');
    meds.push(obj);
    showToast('Medicine added');
  }
  saveData('medicines', meds);
  closeModal('medicineModal');
  renderPharmacy();
});

function editMedicine(id) {
  const m = getData('medicines').find(function(x) { return x.id === id; });
  if (!m) return;
  document.getElementById('medEditId').value = m.id;
  document.getElementById('medName').value = m.name;
  document.getElementById('medCategory').value = m.category||'';
  document.getElementById('medManufacturer').value = m.manufacturer||'';
  document.getElementById('medStock').value = m.stock;
  document.getElementById('medPrice').value = m.price;
  document.getElementById('medExpiry').value = m.expiry||'';
  document.getElementById('medicineModalTitle').textContent = 'Edit Medicine';
  openModal('medicineModal');
}

function deleteMedicine(id) {
  if (!confirm('Delete this medicine?')) return;
  saveData('medicines', getData('medicines').filter(function(m) { return m.id !== id; }));
  showToast('Medicine deleted');
  renderPharmacy();
}

// ============ Lab Reports ============
function renderLabReports() {
  const labs = getData('labReports');
  document.getElementById('labReportsTableBody').innerHTML = labs.map(function(l) {
    return `
      <tr>
        <td>${l.id}</td>
        <td>${l.patient}</td>
        <td>${l.testType}</td>
        <td>${formatDate(l.testDate)}</td>
        <td>${l.doctor || '—'}</td>
        <td>${l.result || '—'}</td>
        <td>${statusBadge(l.status)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editLabReport('${l.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteLabReport('${l.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('labReportForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const labs = getData('labReports');
  const editId = document.getElementById('labEditId').value;
  const obj = { patient: document.getElementById('labPatient').value, testType: document.getElementById('labTestType').value, testDate: document.getElementById('labTestDate').value, doctor: document.getElementById('labDoctor').value, result: document.getElementById('labResult').value, status: document.getElementById('labStatus').value };
  if (editId) {
    let idx = labs.findIndex(function(l) { return l.id === editId; });
    if (idx > -1) { obj.id = editId; labs[idx] = obj; }
    showToast('Lab report updated');
  } else {
    obj.id = genId('LR');
    labs.push(obj);
    logActivity('Lab report created for ' + obj.patient);
    showToast('Lab report created');
  }
  saveData('labReports', labs);
  closeModal('labReportModal');
  renderLabReports();
});

function editLabReport(id) {
  const l = getData('labReports').find(function(x) { return x.id === id; });
  if (!l) return;
  openModal('labReportModal');
  document.getElementById('labEditId').value = l.id;
  document.getElementById('labPatient').value = l.patient;
  document.getElementById('labTestType').value = l.testType;
  document.getElementById('labTestDate').value = l.testDate;
  document.getElementById('labDoctor').value = l.doctor||'';
  document.getElementById('labResult').value = l.result||'';
  document.getElementById('labStatus').value = l.status;
  document.getElementById('labReportModalTitle').textContent = 'Edit Lab Report';
}

function deleteLabReport(id) {
  if (!confirm('Delete this report?')) return;
  saveData('labReports', getData('labReports').filter(function(l) { return l.id !== id; }));
  showToast('Report deleted');
  renderLabReports();
}

// ============ Staff ============
function renderStaff() {
  const staff = getData('staff');
  document.getElementById('staffTableBody').innerHTML = staff.map(function(s) {
    return `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.role}</td>
        <td>${s.phone || '—'}</td>
        <td>${s.department || '—'}</td>
        <td>${s.shift}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editStaff('${s.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteStaff('${s.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('staffForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const staff = getData('staff');
  const editId = document.getElementById('staffEditId').value;
  const obj = { name: document.getElementById('staffName').value, role: document.getElementById('staffRole').value, phone: document.getElementById('staffPhone').value, department: document.getElementById('staffDept').value, shift: document.getElementById('staffShift').value };
  if (editId) {
    let idx = staff.findIndex(function(s) { return s.id === editId; });
    if (idx > -1) { obj.id = editId; staff[idx] = obj; }
    showToast('Staff updated');
  } else {
    obj.id = genId('S');
    staff.push(obj);
    showToast('Staff added');
  }
  saveData('staff', staff);
  closeModal('staffModal');
  renderStaff();
});

function editStaff(id) {
  const s = getData('staff').find(function(x) { return x.id === id; });
  if (!s) return;
  document.getElementById('staffEditId').value = s.id;
  document.getElementById('staffName').value = s.name;
  document.getElementById('staffRole').value = s.role;
  document.getElementById('staffPhone').value = s.phone||'';
  document.getElementById('staffDept').value = s.department||'';
  document.getElementById('staffShift').value = s.shift;
  document.getElementById('staffModalTitle').textContent = 'Edit Staff';
  openModal('staffModal');
}

function deleteStaff(id) {
  if (!confirm('Remove this staff member?')) return;
  saveData('staff', getData('staff').filter(function(s) { return s.id !== id; }));
  showToast('Staff removed');
  renderStaff();
}

// ============ Emergency ============
function renderEmergency() {
  const ems = getData('emergencies');
  document.getElementById('emergencyTableBody').innerHTML = ems.map(function(e) {
    const arrivalDisplay = e.arrival ? new Date(e.arrival).toLocaleString() : '—';
    return '<tr><td>' + e.id + '</td><td>' + e.patient + '</td><td>' + arrivalDisplay + '</td><td>' + e.condition + '</td><td>' + (e.doctor||'—') + '</td><td>' + statusBadge(e.status) + '</td><td><div class="action-btns"><button class="btn btn-sm btn-primary" onclick="editEmergency(\'' + e.id + '\')">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteEmergency(\'' + e.id + '\')">Del</button></div></td></tr>';
  }).join('');
}

document.getElementById('emergencyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const ems = getData('emergencies');
  const editId = document.getElementById('emEditId').value;
  const obj = { patient: document.getElementById('emPatient').value, arrival: document.getElementById('emArrival').value, condition: document.getElementById('emCondition').value, doctor: document.getElementById('emDoctor').value, status: document.getElementById('emStatus').value };
  if (editId) {
    let idx = ems.findIndex(function(em) { return em.id === editId; });
    if (idx > -1) { obj.id = editId; ems[idx] = obj; }
    showToast('Emergency updated');
  } else {
    obj.id = genId('EM');
    ems.push(obj);
    logActivity('Emergency logged: ' + obj.patient);
    showToast('Emergency logged');
  }
  saveData('emergencies', ems);
  closeModal('emergencyModal');
  renderEmergency();
});

function editEmergency(id) {
  const e = getData('emergencies').find(function(x) { return x.id === id; });
  if (!e) return;
  document.getElementById('emEditId').value = e.id;
  document.getElementById('emPatient').value = e.patient;
  document.getElementById('emArrival').value = e.arrival||'';
  document.getElementById('emCondition').value = e.condition;
  document.getElementById('emDoctor').value = e.doctor||'';
  document.getElementById('emStatus').value = e.status;
  document.getElementById('emergencyModalTitle').textContent = 'Edit Emergency';
  openModal('emergencyModal');
}

function deleteEmergency(id) {
  if (!confirm('Delete this case?')) return;
  saveData('emergencies', getData('emergencies').filter(function(e) { return e.id !== id; }));
  showToast('Emergency removed');
  renderEmergency();
}

// ============ Inventory ============
function renderInventory() {
  const items = getData('inventory');
  document.getElementById('inventoryTableBody').innerHTML = items.map(function(i) {
    return `
      <tr>
        <td>${i.id}</td>
        <td>${i.name}</td>
        <td>${i.category || '—'}</td>
        <td>${i.stock}</td>
        <td>${i.supplier || '—'}</td>
        <td>${formatDate(i.lastUpdated)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-primary" onclick="editInventory('${i.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteInventory('${i.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('inventoryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const items = getData('inventory');
  const editId = document.getElementById('invEditId').value;
  const obj = { name: document.getElementById('invName').value, category: document.getElementById('invCategory').value, stock: parseInt(document.getElementById('invStock').value)||0, supplier: document.getElementById('invSupplier').value, lastUpdated: todayStr() };
  if (editId) {
    let idx = items.findIndex(function(i) { return i.id === editId; });
    if (idx > -1) { obj.id = editId; items[idx] = obj; }
    showToast('Item updated');
  } else {
    obj.id = genId('INV');
    items.push(obj);
    showToast('Item added');
  }
  saveData('inventory', items);
  closeModal('inventoryModal');
  renderInventory();
});

function editInventory(id) {
  const i = getData('inventory').find(function(x) { return x.id === id; });
  if (!i) return;
  document.getElementById('invEditId').value = i.id;
  document.getElementById('invName').value = i.name;
  document.getElementById('invCategory').value = i.category||'';
  document.getElementById('invStock').value = i.stock;
  document.getElementById('invSupplier').value = i.supplier||'';
  document.getElementById('inventoryModalTitle').textContent = 'Edit Item';
  openModal('inventoryModal');
}

function deleteInventory(id) {
  if (!confirm('Delete this item?')) return;
  saveData('inventory', getData('inventory').filter(function(i) { return i.id !== id; }));
  showToast('Item deleted');
  renderInventory();
}

// ============ Reports & Charts ============
function renderReports() {
  renderBarChart('chartPatients', getPatientsChartData(), 'blue');
  renderBarChart('chartAppointments', getApptsChartData(), 'green');
  renderBarChart('chartRevenue', getRevenueChartData(), 'orange');
  renderDonutChart('chartBeds');
}

function renderBarChart(containerId, data, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const maxVal = Math.max.apply(null, data.map(function(d) { return d.value; })) || 1;
  container.innerHTML = data.map(function(d) {
    const pct = Math.round((d.value / maxVal) * 100);
    return '<div class="chart-bar-group"><div class="chart-value">' + d.value + '</div><div class="chart-bar ' + color + '" style="height:' + Math.max(pct, 5) + '%"></div><div class="chart-label">' + d.label + '</div></div>';
  }).join('');
}

function getPatientsChartData() {
  const patients = getData('patients');
  const admitted = patients.filter(function(p) { return p.status === 'Admitted'; }).length;
  const discharged = patients.filter(function(p) { return p.status === 'Discharged'; }).length;
  return [{ label: 'Admitted', value: admitted }, { label: 'Discharged', value: discharged }, { label: 'Total', value: patients.length }];
}

function getApptsChartData() {
  const appts = getData('appointments');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map(function(day, i) {
    const count = appts.filter(function(a) {
      if (!a.date) return false;
      return new Date(a.date).getDay() === (i + 1) % 7;
    }).length;
    return { label: day, value: count };
  });
}

function getRevenueChartData() {
  const bills = getData('bills');
  const paid = bills.filter(function(b) { return b.payStatus === 'Paid'; }).reduce(function(s,b) { return s + b.total; }, 0);
  const pending = bills.filter(function(b) { return b.payStatus !== 'Paid'; }).reduce(function(s,b) { return s + b.total; }, 0);
  return [{ label: 'Paid', value: paid }, { label: 'Pending', value: pending }, { label: 'Total', value: paid + pending }];
}

function renderDonutChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const beds = getData('beds');
  const occupied = beds.filter(function(b) { return b.status === 'Occupied'; }).length;
  const available = beds.filter(function(b) { return b.status === 'Available'; }).length;
  const total = beds.length || 1;
  const occPct = Math.round((occupied / total) * 100);
  const avPct = 100 - occPct;

  container.innerHTML = '<div class="donut-wrap">' +
    '<div class="donut" style="background:conic-gradient(var(--danger) 0% ' + occPct + '%, var(--success) ' + occPct + '% 100%)">' +
    '<div class="donut-center">' + occPct + '%</div></div>' +
    '<div class="donut-legend">' +
    '<div class="legend-item"><span class="legend-dot" style="background:var(--danger)"></span>Occupied (' + occupied + ')</div>' +
    '<div class="legend-item"><span class="legend-dot" style="background:var(--success)"></span>Available (' + available + ')</div>' +
    '</div></div>';
}

// ============ Settings ============
function renderSettings() {
  const settings = getData('settings');
  document.getElementById('settingHospitalName').value = settings.hospitalName || '';
  document.getElementById('settingAddress').value = settings.address || '';
  document.getElementById('settingPhone').value = settings.phone || '';
  updateThemeButton();
}

document.getElementById('settingsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const settings = {
    hospitalName: document.getElementById('settingHospitalName').value,
    address: document.getElementById('settingAddress').value,
    phone: document.getElementById('settingPhone').value
  };
  saveData('settings', settings);
  showToast('Settings saved');
});

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('hms_theme', isDark ? 'dark' : 'light');
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const isDark = document.body.classList.contains('dark');
  btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// ============ Init ============
function init() {
  initData();

  // theme
  if (localStorage.getItem('hms_theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // date header
  headerDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // render default
  renderDashboard();
  populateDropdowns();
}

init();
