const loginForm = document.getElementById('login-form');
const addMedicationForm = document.getElementById('add-medication-form');
const medicationList = document.getElementById('medication-list');
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logout-btn');
const addBtn = document.getElementById('add-btn');

let token = null;

function showDashboard() {
  authContainer.style.display = 'none';
  dashboard.style.display = 'block';
  logoutBtn.style.display = 'inline-block';
  loadMedications();
}

function showLogin() {
  authContainer.style.display = 'block';
  dashboard.style.display = 'none';
  logoutBtn.style.display = 'none';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    token = await response.json();
    showDashboard();
  } else {
    alert('Invalid login credentials');
  }
});

async function loadMedications() {
  const response = await fetch('/medications', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const medications = await response.json();
    medicationList.innerHTML = medications
      .map(
        (med) => `
      <li>
        <div>
          <strong>${med.name}</strong>
          <p>${med.dosage} | ${med.frequency} | ${med.time}</p>
        </div>
        <button class="delete-btn" data-id="${med.id}">Delete</button>
      </li>
    `
      )
      .join('');
    attachDeleteHandlers();
  } else {
    alert('Failed to load medications.');
  }
}

addMedicationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('medication-name').value;
  const dosage = document.getElementById('medication-dosage').value;
  const frequency = document.getElementById('medication-frequency').value;
  const time = document.getElementById('medication-time').value;

  const response = await fetch('/medications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, dosage, frequency, time }),
  });

  if (response.ok) {
    loadMedications();
    addMedicationForm.reset();
  } else {
    alert('Failed to add medication.');
  }
});

function attachDeleteHandlers() {
  document.querySelectorAll('.delete-btn').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-id');
      const response = await fetch(`/medications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        loadMedications();
      } else {
        alert('Failed to delete medication');
      }
    })
  );
}

addBtn.addEventListener('click', () => {
  addMedicationForm.style.display =
    addMedicationForm.style.display === 'none' ? 'block' : 'none';
});

logoutBtn.addEventListener('click', () => {
  token = null;
  showLogin();
});

