const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const addMedicationForm = document.getElementById('add-medication-form');
const medicationList = document.getElementById('medication-list');
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert('Registration successful! Please log in.');
  } else {
    alert('Registration failed. Username may already exist.');
  }
});

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
    authContainer.style.display = 'none';
    dashboard.style.display = 'block';
    loadMedications();
  } else {
    alert('Invalid login credentials.');
  }
});

addMedicationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('medication-name').value;
  const dosage = document.getElementById('medication-dosage').value;
  const frequency = document.getElementById('medication-frequency').value;
  const time = document.getElementById('medication-time').value;

  const response = await fetch('/medications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, dosage, frequency, time }),
  });

  if (response.ok) {
    loadMedications();
    addMedicationForm.reset();
  } else {
    alert('Failed to add medication.');
  }
});

async function loadMedications() {
  const response = await fetch('/medications');
  if (response.ok) {
    const medications = await response.json();
    medicationList.innerHTML = medications
      .map(
        (med) =>
          `<li><strong>${med.name}</strong>: ${med.dosage}, ${med.frequency} at ${med.time}</li>`
      )
      .join('');
  } else {
    alert('Failed to load medications.');
  }
}


