
import { initFirebase, onAuthChange, fetchTeamsFromFirebase, saveTeamsToFirebase, signOutUser } from './firebase.js';

let TEAM_BUDGETS_DATA = {
  "teams": [
    {
      "id": "wgys-velocity-13u-2023",
      "name": "WGYS Velocity 13U Select",
      "sport": "Baseball",
      "season": 2023,
      "rosterSize": 12,
      "tournaments": [
        { "name": "17BB: Beat the Freeze", "start": "2023-02-25", "end": "2023-02-26", "fee": 450 },
        { "name": "PBR: Sunday Series #3", "start": "2023-03-05", "end": "2023-03-05", "fee": 425 },
        { "name": "PG: For the Kids Classic (MINOR)", "start": "2023-03-17", "end": "2023-03-19", "fee": 725 },
        { "name": "17BB: March Madness", "start": "2023-03-25", "end": "2023-03-26", "fee": 550 },
        { "name": "PG: Southeast Backyard Brawl (MAJOR)", "start": "2023-04-14", "end": "2023-04-16", "fee": 725 },
        { "name": "PG: Georgia State Championship (MAJOR)", "start": "2023-04-21", "end": "2023-04-23", "fee": 750 },
        { "name": "PG: Southeast Youth World Series (Open)", "start": "2023-05-05", "end": "2023-05-07", "fee": 725 },
        { "name": "PG: Georgia State Championship (MINOR)", "start": "2023-05-12", "end": "2023-05-14", "fee": 725 },
        { "name": "PG: Greater Atlanta Open", "start": "2023-05-19", "end": "2023-05-21", "fee": 725 },
        { "name": "PG: Youth Southeast Memorial Day Classic (Open)", "start": "2023-05-26", "end": "2023-05-29", "fee": 725 },
        { "name": "PG: Southeast Elite Youth Championship (OPEN)", "start": "2023-06-02", "end": "2023-06-04", "fee": 725 },
        { "name": "PG: Southeast World Series #2 (MINOR)", "start": "2023-06-09", "end": "2023-06-11", "fee": 725 }
      ],
      "uniforms": [
        { "item": "Jersey", "cost": 50 },
        { "item": "Pants", "cost": 50 },
        { "item": "Hat", "cost": 14 },
        { "item": "Belt", "cost": 5 },
        { "item": "Socks", "cost": 5 }
      ],
      "equipment": [
        { "item": "Practice & Game Baseballs", "cost": 500 },
        { "item": "Practice Jerseys (2) & Hats (screen print & embroidered logos/numbers)", "cost": 900 }
      ],
      "insurance": [
        { "item": "Team Insurance", "cost": 140 },
        { "item": "TeamSnap Annual Subscription", "cost": 100 }
      ],
      "training": [
        { "item": "Training Facility, HitTrax Cage, & Pitching Machine", "cost": 1500 },
        { "item": "Speed & Agility Trainer (Feb-Jun)", "cost": 1000 }
      ]
    },
    {
      "id": "wgys-select-softball-14u-2026",
      "name": "WGYS Select Softball 14U",
      "sport": "Softball",
      "season": 2026,
      "rosterSize": 14,
      "tournaments": [],
      "equipment": [],
      "insurance": [],
      "training": []
    },
    {
      "id": "wgys-wgys-select-softball-8u-1764459506860",
      "name": "WGYS Select Softball 8U",
      "sport": "Softball",
      "season": 2026,
      "rosterSize": 12,
      "tournaments": [
        {
          "name": "Cleats & Crowns (Middle Georgia)",
          "start": "2026-02-28",
          "end": "2026-02-28",
          "fee": 200
        },
        {
          "name": "Diamond Dreams Classic (Middle Georgia)",
          "start": "2026-03-14",
          "end": "2026-03-14",
          "fee": 200
        },
        {
          "name": "Fastpitch Frenzy (Middle Georgia)",
          "start": "2026-03-28",
          "end": "2026-03-28",
          "fee": 200
        },
        {
          "name": "Home Run Honeyz (Middle Georgia)",
          "start": "2026-04-18",
          "end": "2026-04-18",
          "fee": 200
        },
        {
          "name": "Pitch Perfect Showdown (Middle Georgia)",
          "start": "2026-05-02",
          "end": "2026-05-02",
          "fee": 200
        },
        {
          "name": "Sluggers & Sparkles (Middle Georgia)",
          "start": "2026-05-16",
          "end": "2026-05-16",
          "fee": 200
        },
        {
          "name": "Swing Into Spring (Middle Georgia)",
          "start": "2026-05-30",
          "end": "2026-05-30",
          "fee": 200
        },
        {
          "name": "World Series (Middle Georgia)",
          "start": "2026-06-06",
          "end": "2026-06-06",
          "fee": 200
        }
      ],
      "equipment": [],
      "uniforms": [
        {
          "item": "Pants",
          "cost": 50
        },
        {
          "item": "Jersey",
          "cost": 35
        },
        {
          "item": "Jersey",
          "cost": 35
        },
        {
          "item": "Visor",
          "cost": 15
        },
        {
          "item": "Belt",
          "cost": 10
        },
        {
          "item": "Socks",
          "cost": 10
        }
      ],
      "insurance": [],
      "training": []
    },
    {
      "id": "wgys-select-baseball-12u-2026",
      "name": "WGYS Select Baseball 12U",
      "sport": "Baseball",
      "season": 2026,
      "rosterSize": 12,
      "tournaments": [],
      "equipment": [],
      "insurance": [],
      "training": []
    },
  ]
};

// Load team data from localStorage if available
const savedTeamData = localStorage.getItem('TEAM_BUDGETS_DATA');
if (savedTeamData) {
  try {
    TEAM_BUDGETS_DATA = JSON.parse(savedTeamData);
  } catch (e) {
    console.error('Failed to load saved team data:', e);
  }
}

// Firebase helpers are provided by `firebase.js` (modular SDK). Imported above.

const DEFAULT_TOURNAMENTS = [
  { name: "17BB: Beat the Freeze", start: "2023-02-25", end: "2023-02-26", fee: 450 },
  { name: "PBR: Sunday Series #3", start: "2023-03-05", end: "2023-03-05", fee: 425 },
  { name: "PG: For the Kids Classic (MINOR)", start: "2023-03-17", end: "2023-03-19", fee: 725 },
  { name: "17BB: March Madness", start: "2023-03-25", end: "2023-03-26", fee: 550 },
  { name: "PG: Southeast Backyard Brawl (MAJOR)", start: "2023-04-14", end: "2023-04-16", fee: 725 },
  { name: "PG: Georgia State Championship (MAJOR)", start: "2023-04-21", end: "2023-04-23", fee: 750 },
  { name: "PG: Southeast Youth World Series (Open)", start: "2023-05-05", end: "2023-05-07", fee: 725 },
  { name: "PG: Georgia State Championship (MINOR)", start: "2023-05-12", end: "2023-05-14", fee: 725 },
  { name: "PG: Greater Atlanta Open", start: "2023-05-19", end: "2023-05-21", fee: 725 },
  { name: "PG: Youth Southeast Memorial Day Classic (Open)", start: "2023-05-26", end: "2023-05-29", fee: 725 },
  { name: "PG: Southeast Elite Youth Championship (OPEN)", start: "2023-06-02", end: "2023-06-04", fee: 725 },
  { name: "PG: Southeast World Series #2 (MINOR)", start: "2023-06-09", end: "2023-06-11", fee: 725 }
];

const DEFAULT_EQUIPMENT = [
  { item: "Practice & Game Baseballs", cost: 500 },
  { item: "Practice Jerseys (2) & Hats (screen print & embroidered logos/numbers)", cost: 900 }
];

const DEFAULT_INSURANCE = [
  { item: "Team Insurance", cost: 140 },
  { item: "TeamSnap Annual Subscription", cost: 100 }
];

const DEFAULT_TRAINING = [
  { item: "Training Facility, HitTrax Cage, & Pitching Machine", cost: 1500 },
  { item: "Speed & Agility Trainer (Feb-Jun)", cost: 1000 }
];

let tournaments = [];
let equipment = [];
let uniforms = [];
let insurance = [];
let training = [];
let currentlyLoadedTeamId = null;
let currentUser = null;

function getCurrentUserEmail() {
  return currentUser?.email || null;
}

function canEditTeam(team) {
  if (!team.createdBy) return false; // Demo teams are read-only
  return team.createdBy === getCurrentUserEmail() || isAdmin();
}

function isAdmin() {
  const adminEmails = ['westga.youthsports@gmail.com']; // Add admin emails here
  return adminEmails.includes(getCurrentUserEmail());
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function initializeApp() {
  const currentYear = new Date().getFullYear();

  // Initialize Firebase (ensures SDK ready). We don't need the return value here.
  initFirebase();

  // Require user to be authenticated. If not, redirect to `signin.html`.
  onAuthChange(async (user) => {
    if (!user) {
      // Not signed in — redirect to sign-in page for auth
      console.info('User not authenticated; redirecting to signin.html');
      window.location.href = 'signin.html';
      return;
    }

    currentUser = user;

    // User is signed in — try to load team data from Firebase and persist locally.
    try {
      const fbData = await fetchTeamsFromFirebase();
      if (fbData && Array.isArray(fbData)) {
        TEAM_BUDGETS_DATA = { teams: fbData };
        try { localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA)); } catch (err) { console.warn('Failed to write localStorage', err); }
        console.info('Loaded team data from Firebase.');
        populateTeamLoader(); // Refresh dropdown after loading data
      } else {
        console.info('No team data found in Firebase; using local/default data.');
      }
    } catch (err) {
      console.warn('Error loading from Firebase; using local/default data.', err);
    }

    // Continue with app initialization now that we have auth + data
    renderAll();

    // Load first team by default if any teams exist
    if (TEAM_BUDGETS_DATA.teams.length > 0) {
      const firstTeam = TEAM_BUDGETS_DATA.teams[0];
      loadTeamData(firstTeam.id);
      document.getElementById('teamLoader').value = firstTeam.id;
    } else {
      const teamName = document.getElementById('teamName').value;
      if (teamName && TEAM_BUDGETS_DATA.teams.length > 0) {
        const matchingTeam = TEAM_BUDGETS_DATA.teams.find(t => t.name === teamName);
        if (matchingTeam) {
          currentlyLoadedTeamId = matchingTeam.id;
          document.getElementById('teamLoader').value = matchingTeam.id;
        }
      }
    }
  });
  document.getElementById('season').value = currentYear;

  // Theme toggle listeners
  document.getElementById('themeButtonDark').addEventListener('click', function () {
    setTheme('dark');
  });
  document.getElementById('themeButtonLight').addEventListener('click', function () {
    setTheme('light');
  });

  // Tournament Event Listeners
  document.getElementById('addTournamentBtn').addEventListener('click', addTournament);
  document.getElementById('clearTournamentsBtn').addEventListener('click', clearTournaments);

  // Equipment Event Listeners
  document.getElementById('addEquipmentBtn').addEventListener('click', addEquipmentItem);
  document.getElementById('clearEquipmentBtn').addEventListener('click', clearEquipment);

  // Uniform Event Listeners
  document.getElementById('addUniformBtn').addEventListener('click', addUniformItem);
  document.getElementById('clearUniformsBtn').addEventListener('click', clearUniforms);

  // Insurance Event Listeners
  document.getElementById('addInsuranceBtn').addEventListener('click', addInsuranceItem);
  document.getElementById('clearInsuranceBtn').addEventListener('click', clearInsurance);

  // Training Event Listeners
  document.getElementById('addTrainingBtn').addEventListener('click', addTrainingItem);
  document.getElementById('clearTrainingBtn').addEventListener('click', clearTraining);

  // View Toggle Listeners
  document.getElementById('toggleBubbleView').addEventListener('click', function () {
    switchView('bubble');
  });
  document.getElementById('toggleLineView').addEventListener('click', function () {
    switchView('line');
  });

  // Export Event Listeners
  document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
  document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
  document.getElementById('exportDocxBtn').addEventListener('click', exportToDOCX);

  // Save Teams Listener
  if (document.getElementById('saveTeamsBtn')) {
    document.getElementById('saveTeamsBtn').addEventListener('click', function () {
      saveCurrentTeam();
      saveTeamsToStore();
    });
  }

  // Download JSON Listener
  if (document.getElementById('downloadJsonBtn')) {
    document.getElementById('downloadJsonBtn').addEventListener('click', downloadTeamsJSON);
  }

  // Load JSON Listener
  if (document.getElementById('loadJsonBtn')) {
    document.getElementById('loadJsonBtn').addEventListener('click', loadTeamsJSON);
  }

  // Team Loader Listener
  if (document.getElementById('teamLoader')) {
    document.getElementById('teamLoader').addEventListener('change', function () {
      if (this.value) {
        saveCurrentTeam();
        loadTeamData(this.value);
      }
    });
    populateTeamLoader();
  }

  // New Team Listener
  if (document.getElementById('newTeamBtn')) {
    document.getElementById('newTeamBtn').addEventListener('click', createNewTeam);
  }

  // Delete Team Listener
  if (document.getElementById('deleteTeamBtn')) {
    document.getElementById('deleteTeamBtn').addEventListener('click', deleteTeam);
  }

  // Roster Change Listener
  document.getElementById('roster').addEventListener('change', updateAll);

  // Edit Team Name Button Listener
  document.getElementById('editTeamNameBtn').addEventListener('click', function () {
    const teamNameField = document.getElementById('teamName');
    const editBtn = this;

    if (teamNameField.style.display === 'none') {
      // Show input field
      teamNameField.style.display = 'block';
      teamNameField.focus();
      teamNameField.select();
      editBtn.textContent = '✓';
      editBtn.title = 'Save team name';
    } else {
      // Save and hide input field
      if (currentlyLoadedTeamId) {
        const team = TEAM_BUDGETS_DATA.teams.find(t => t.id === currentlyLoadedTeamId);
        if (team && canEditTeam(team)) {
          team.name = teamNameField.value;
          localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
          populateTeamLoader();
          document.getElementById('teamLoader').value = currentlyLoadedTeamId;
          saveTeamsToStore();
        }
      }
      teamNameField.style.display = 'none';
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit team name';
    }
  });

  // Team Name Field - Save on Enter or Escape
  document.getElementById('teamName').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      document.getElementById('editTeamNameBtn').click();
    } else if (e.key === 'Escape') {
      this.style.display = 'none';
      const editBtn = document.getElementById('editTeamNameBtn');
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit team name';
      // Reset to original value
      if (currentlyLoadedTeamId) {
        const team = TEAM_BUDGETS_DATA.teams.find(t => t.id === currentlyLoadedTeamId);
        if (team) this.value = team.name;
      }
    }
  });

  // Edit Owner Button Listener
  document.getElementById('editOwnerBtn').addEventListener('click', function () {
    const ownerEditField = document.getElementById('teamOwnerEdit');
    const editBtn = this;

    if (ownerEditField.style.display === 'none') {
      // Show input field
      ownerEditField.style.display = 'block';
      ownerEditField.focus();
      ownerEditField.select();
      editBtn.textContent = '✓';
      editBtn.title = 'Save owner email';
    } else {
      // Save and hide input field
      if (currentlyLoadedTeamId) {
        const team = TEAM_BUDGETS_DATA.teams.find(t => t.id === currentlyLoadedTeamId);
        if (team) {
          team.createdBy = ownerEditField.value || null;
          document.getElementById('teamOwner').value = team.createdBy || 'Demo Team';
          localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
        }
      }
      ownerEditField.style.display = 'none';
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit owner email';
    }
  });

  // Owner Edit Field - Save on Enter or Escape
  document.getElementById('teamOwnerEdit').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      document.getElementById('editOwnerBtn').click();
    } else if (e.key === 'Escape') {
      this.style.display = 'none';
      const editBtn = document.getElementById('editOwnerBtn');
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit owner email';
      // Reset to original value
      if (currentlyLoadedTeamId) {
        const team = TEAM_BUDGETS_DATA.teams.find(t => t.id === currentlyLoadedTeamId);
        if (team) this.value = team.createdBy || '';
      }
    }
  });



  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  // Event delegation: handle all dynamic input changes and button clicks
  setupEventDelegation();

  // `renderAll` and default team loading are handled after auth state is confirmed
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const darkBtn = document.getElementById('themeButtonDark');
  const lightBtn = document.getElementById('themeButtonLight');

  if (theme === 'dark') {
    darkBtn.classList.add('active');
    lightBtn.classList.remove('active');
  } else {
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
  }
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

function populateTeamLoader() {
  const loaderSelect = document.getElementById('teamLoader');
  if (!loaderSelect) return;

  // Clear existing options except the first placeholder
  loaderSelect.innerHTML = '<option value="">-- Select a Team to Load --</option>';

  // Add teams from TEAM_BUDGETS_DATA, sorted alphabetically by name
  if (TEAM_BUDGETS_DATA && TEAM_BUDGETS_DATA.teams && Array.isArray(TEAM_BUDGETS_DATA.teams)) {
    const teams = [...TEAM_BUDGETS_DATA.teams].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = `${team.name} (${team.sport}, ${team.season})`;
      loaderSelect.appendChild(option);
    });
  }
}

function saveCurrentTeam() {
  // Use the currently loaded team ID to find the team
  if (!currentlyLoadedTeamId) return;

  const currentTeam = TEAM_BUDGETS_DATA.teams.find(t => t.id === currentlyLoadedTeamId);

  if (currentTeam) {
    // Save all current form data to the team object
    const teamNameField = document.getElementById('teamName');
    if (teamNameField) currentTeam.name = teamNameField.value;
    currentTeam.sport = document.getElementById('sport').value;
    currentTeam.season = parseInt(document.getElementById('season').value);
    currentTeam.rosterSize = parseInt(document.getElementById('roster').value);
    currentTeam.tournaments = JSON.parse(JSON.stringify(tournaments));
    currentTeam.equipment = JSON.parse(JSON.stringify(equipment));
    currentTeam.uniforms = JSON.parse(JSON.stringify(uniforms));
    currentTeam.insurance = JSON.parse(JSON.stringify(insurance));
    currentTeam.training = JSON.parse(JSON.stringify(training));
  }
}

function loadTeamData(teamId) {
  if (!teamId) return;

  // Find the team in TEAM_BUDGETS_DATA
  const team = TEAM_BUDGETS_DATA.teams.find(t => t.id === teamId);
  if (!team) return;

  // Check if user can edit this team
  const canEdit = canEditTeam(team);

  // Show edit button and prepare team name field
  const editBtn = document.getElementById('editTeamNameBtn');
  const teamNameField = document.getElementById('teamName');
  if (editBtn && teamNameField) {
    editBtn.style.display = canEdit ? 'block' : 'none';
    teamNameField.value = team.name || '';
    teamNameField.style.display = 'none';
  }

  // Load form fields
  document.getElementById('sport').value = team.sport || 'Baseball';
  document.getElementById('season').value = team.season || new Date().getFullYear();
  document.getElementById('roster').value = team.rosterSize || 12;

  // Display team owner/manager
  const ownerField = document.getElementById('teamOwner');
  const editOwnerBtn = document.getElementById('editOwnerBtn');
  const ownerEditField = document.getElementById('teamOwnerEdit');

  if (ownerField) {
    ownerField.value = team.createdBy ? team.createdBy : 'Demo Team';
  }

  // Show edit button only for admin users and reset state
  if (editOwnerBtn) {
    editOwnerBtn.style.display = isAdmin() ? 'block' : 'none';
    editOwnerBtn.textContent = '✏️';
    editOwnerBtn.title = 'Edit owner email';
  }

  if (ownerEditField) {
    ownerEditField.value = team.createdBy || '';
    ownerEditField.style.display = 'none';
  }

  // Disable form fields for read-only teams
  document.getElementById('sport').disabled = !canEdit;
  document.getElementById('season').disabled = !canEdit;
  document.getElementById('roster').disabled = !canEdit;

  // Disable delete button for read-only teams
  const deleteBtn = document.getElementById('deleteTeamBtn');
  if (deleteBtn) {
    deleteBtn.disabled = !canEdit;
    deleteBtn.title = canEdit ? '' : 'You can only delete teams you created';
  }

  // Load tournaments
  tournaments = JSON.parse(JSON.stringify(team.tournaments || []));
  renderTournaments();

  // Load equipment
  equipment = JSON.parse(JSON.stringify(team.equipment || []));
  renderEquipment();

  // Load uniforms
  uniforms = JSON.parse(JSON.stringify(team.uniforms || []));
  renderUniforms();

  // Load insurance
  insurance = JSON.parse(JSON.stringify(team.insurance || []));
  renderInsurance();

  // Load training
  training = JSON.parse(JSON.stringify(team.training || []));
  renderTraining();

  // Update all calculations
  updateAll();

  // Disable add/remove buttons for read-only teams
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  buttons.forEach(btn => {
    if (btn.textContent.includes('Add') || btn.textContent.includes('Clear') || btn.textContent.includes('Remove')) {
      btn.disabled = !canEdit;
    }
  });

  // Disable all input fields in tables for read-only teams
  const inputs = document.querySelectorAll('#tournamentsBody input, #equipmentBody input, #uniformsBody input, #insuranceBody input, #trainingBody input');
  inputs.forEach(input => input.disabled = !canEdit);

  // Keep the dropdown selected and track the currently loaded team
  currentlyLoadedTeamId = teamId;
}

function deleteTeam() {
  const loaderSelect = document.getElementById('teamLoader');
  const selectedTeamId = currentlyLoadedTeamId || loaderSelect.value;

  if (!selectedTeamId) {
    alert('Please select a team to delete.');
    return;
  }

  const teamToDelete = TEAM_BUDGETS_DATA.teams.find(t => t.id === selectedTeamId);
  if (!teamToDelete) return;

  if (!canEditTeam(teamToDelete)) {
    alert('You can only delete teams that you created.');
    return;
  }

  if (confirm(`Are you sure you want to delete "${teamToDelete.name}"? This cannot be undone.`)) {
    // Remove the team from the array
    TEAM_BUDGETS_DATA.teams = TEAM_BUDGETS_DATA.teams.filter(t => t.id !== selectedTeamId);

    // Save to localStorage
    localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));

    // Clear the currently loaded team
    currentlyLoadedTeamId = null;

    // Refresh the team loader dropdown
    populateTeamLoader();

    // Clear the form
    document.getElementById('teamName').value = '';
    document.getElementById('sport').value = 'Baseball';
    document.getElementById('season').value = new Date().getFullYear();
    document.getElementById('roster').value = 12;
    tournaments = [];
    equipment = [];
    uniforms = [];
    insurance = [];
    training = [];
    renderAll();

    // Save teams.
    saveTeamsToStore();
  }
}

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Styling
  Object.assign(toast.style, {
    padding: '12px 20px',
    marginBottom: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '300px',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease-out',
  });

  // Color by type
  const colors = {
    success: { bg: '#10b981', text: '#fff' },
    error: { bg: '#ef4444', text: '#fff' },
    warning: { bg: '#f59e0b', text: '#fff' },
    info: { bg: '#3b82f6', text: '#fff' },
  };

  const color = colors[type] || colors.info;
  toast.style.backgroundColor = color.bg;
  toast.style.color = color.text;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

async function saveTeamsToStore() {
  // Save to localStorage to persist team data
  try {
    localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
  } catch (err) {
    console.warn('Failed to write TEAM_BUDGETS_DATA to localStorage:', err);
    showToast('Failed to save locally', 'error');
    return;
  }

  // Save to Firebase only
  try {
    await saveTeamsToFirebase(TEAM_BUDGETS_DATA.teams);
    showToast('Team data saved locally and synced to Firebase server ✓', 'success', 4000);
  } catch (err) {
    console.warn('Failed to save to Firebase:', err);
    showToast('Team data saved locally (Firebase sync failed)', 'warning', 4000);
  }
}

function downloadTeamsJSON() {
  const jsonData = JSON.stringify(TEAM_BUDGETS_DATA, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'team-budgets.json';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Team budget JSON downloaded ✓', 'success', 3000);
}

function loadTeamsJSON() {
  const fileInput = document.getElementById('jsonFileInput');
  fileInput.click();
}

// Handle file selection
document.getElementById('jsonFileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);

      // Validate the structure
      if (!data.teams || !Array.isArray(data.teams)) {
        showToast('Invalid JSON format: missing teams array', 'error');
        return;
      }

      // Replace current data
      TEAM_BUDGETS_DATA = data;

      // Save to localStorage
      localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));

      // Refresh UI
      populateTeamLoader();
      renderAll();

      // Load first team
      if (TEAM_BUDGETS_DATA.teams.length > 0) {
        loadTeamData(TEAM_BUDGETS_DATA.teams[0].id);
        document.getElementById('teamLoader').value = TEAM_BUDGETS_DATA.teams[0].id;
      }

      showToast(`Loaded ${TEAM_BUDGETS_DATA.teams.length} teams from JSON ✓`, 'success', 4000);
    } catch (err) {
      console.error('Failed to parse JSON:', err);
      showToast('Failed to load JSON file: invalid format', 'error');
    }
  };

  reader.readAsText(file);

  // Reset input so the same file can be selected again
  e.target.value = '';
});

function createNewTeam() {
  const teamName = prompt('Enter new team name:');
  if (!teamName) return;

  // Clear all form fields
  document.getElementById('teamName').value = teamName;
  document.getElementById('sport').value = 'Baseball';
  document.getElementById('season').value = new Date().getFullYear();
  document.getElementById('roster').value = 12;

  // Clear all data arrays
  tournaments = [];
  equipment = [];
  uniforms = [];
  insurance = [];
  training = [];

  // Create new team object and add to TEAM_BUDGETS_DATA
  const teamId = 'wgys-' + teamName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const newTeam = {
    id: teamId,
    name: teamName,
    sport: 'Baseball',
    season: new Date().getFullYear(),
    rosterSize: 12,
    tournaments: [],
    equipment: [],
    uniforms: [],
    insurance: [],
    training: [],
    createdBy: getCurrentUserEmail()
  };
  TEAM_BUDGETS_DATA.teams.push(newTeam);

  // Set as currently loaded team
  currentlyLoadedTeamId = teamId;

  // Refresh the team loader dropdown
  populateTeamLoader();

  // Keep the new team selected in the dropdown
  const loaderSelect = document.getElementById('teamLoader');
  if (loaderSelect) {
    loaderSelect.value = teamId;
  }

  // Load the new team to display owner properly
  loadTeamData(teamId);

  // Save to localStorage
  localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));

  // Save teams
  saveTeamsToStore();
}

function setupEventDelegation() {
  // Tournament events
  const tournamentsBody = document.getElementById('tournamentsBody');
  if (tournamentsBody) {
    tournamentsBody.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      const idx = parseInt(row.dataset.index);

      if (e.target.classList.contains('tournament-name')) {
        tournaments[idx].name = e.target.value;
      }
      if (e.target.classList.contains('tournament-start')) {
        tournaments[idx].start = e.target.value;
        // Only default end to start if end is empty or earlier than start
        if (tournaments[idx].start) {
          const startDate = new Date(tournaments[idx].start);
          let endDate = tournaments[idx].end ? new Date(tournaments[idx].end) : null;
          if (!endDate || endDate < startDate) {
            // add 1 day to start date
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 1); // +1 day [web:6][web:8]
            // format back to yyyy-mm-dd (for date input)
            const iso = newEndDate.toISOString().slice(0, 10);
            tournaments[idx].end = iso;
            const endInput = row.querySelector('.tournament-end');
            if (endInput) endInput.value = tournaments[idx].end;
          }
        }
      }
      if (e.target.classList.contains('tournament-end')) {
        tournaments[idx].end = e.target.value;
      }
      if (e.target.classList.contains('fee-input')) {
        tournaments[idx].fee = parseFloat(e.target.value) || 0;

        // Update and show the display
        const feeDisplay = e.target.previousElementSibling;
        if (feeDisplay && feeDisplay.classList.contains('fee-display')) {
          feeDisplay.textContent = formatCurrency(tournaments[idx].fee);
          feeDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }

      // If the start or end date changed, re-render (which will sort by start date)
      if (e.target.classList.contains('tournament-start') || e.target.classList.contains('tournament-end')) {
        renderTournaments();
      }

      // Save immediately
      saveCurrentTeam();
      localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
      updateAll();
    });

    tournamentsBody.addEventListener('blur', (e) => {
      // When start date loses focus, default end date to start if empty or before start
      if (e.target.classList && e.target.classList.contains('tournament-start')) {
        const row = e.target.closest('tr');
        if (row) {
          const idx = parseInt(row.dataset.index);
          if (tournaments[idx] && tournaments[idx].start) {
            const startDate = new Date(tournaments[idx].start);
            const endDate = tournaments[idx].end ? new Date(tournaments[idx].end) : null;
            if (!endDate || endDate < startDate) {
              // add 1 day to start date
              const newEndDate = new Date(startDate);
              newEndDate.setDate(newEndDate.getDate() + 1); // +1 day [web:6][web:8]
              // format back to yyyy-mm-dd (for date input)
              const iso = newEndDate.toISOString().slice(0, 10);
              tournaments[idx].end = iso;
              const endInput = row.querySelector('.tournament-end');
              if (endInput) endInput.value = tournaments[idx].end;
              saveCurrentTeam();
              localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
              updateAll();
            }
          }
        }
      }
      if (e.target.classList.contains('fee-input')) {
        const feeDisplay = e.target.previousElementSibling;
        if (feeDisplay && feeDisplay.classList.contains('fee-display')) {
          feeDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }
    }, true);
    tournamentsBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('fee-input')) {
        e.target.style.display = 'none';
        e.target.previousElementSibling.style.display = 'inline';
      }
    }, true);
    tournamentsBody.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('fee-input')) {
        if (e.key === 'Enter' || e.key === 'Tab') {
          const idx = parseInt(e.target.closest('tr').dataset.index);
          tournaments[idx].fee = parseFloat(e.target.value) || 0;
          updateAll();
          e.target.style.display = 'none';
          e.target.previousElementSibling.style.display = 'inline';
          if (e.key === 'Tab') e.preventDefault();
        }
      }
    });
    tournamentsBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('fee-display')) {
        e.target.style.display = 'none';
        const input = e.target.nextElementSibling;
        input.style.display = 'inline';
        input.focus();
        input.select();
      }
      if (e.target.classList.contains('btn-remove-tournament')) {
        const idx = parseInt(e.target.dataset.index);
        removeTournament(idx);
      }
    });

    // Drag & drop handlers for manual ordering
    tournamentsBody.addEventListener('dragstart', (e) => {
      const handle = e.target.closest('.drag-handle');
      if (!handle) return;
      const srcIdx = parseInt(handle.dataset.index);
      e.dataTransfer.setData('text/plain', String(srcIdx));
      e.dataTransfer.effectAllowed = 'move';
      const row = handle.closest('tr');
      if (row) row.classList.add('dragging');
    });

    tournamentsBody.addEventListener('dragover', (e) => {
      e.preventDefault();
      const row = e.target.closest('tr');
      if (!row) return;
      // mark potential drop target
      if (!row.classList.contains('dragging')) row.classList.add('drag-over');
    });

    tournamentsBody.addEventListener('dragleave', (e) => {
      const row = e.target.closest('tr');
      if (row) row.classList.remove('drag-over');
    });

    tournamentsBody.addEventListener('drop', (e) => {
      e.preventDefault();
      const src = e.dataTransfer.getData('text/plain');
      if (!src) return;
      const srcIdx = parseInt(src);
      const targetRow = e.target.closest('tr');
      const targetIdx = targetRow ? parseInt(targetRow.dataset.index) : tournaments.length - 1;
      if (isNaN(srcIdx) || isNaN(targetIdx)) return;
      // Reorder array
      const moved = tournaments.splice(srcIdx, 1)[0];
      tournaments.splice(targetIdx, 0, moved);

      // Persist and re-render without sorting (preserve manual order)
      saveCurrentTeam();
      try { localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA)); } catch (err) { /* ignore */ }
      renderTournaments(false);
      updateAll();
    });

    tournamentsBody.addEventListener('dragend', (e) => {
      const handle = e.target.closest('.drag-handle');
      const row = handle ? handle.closest('tr') : e.target.closest('tr');
      if (row) row.classList.remove('dragging');
      const rows = tournamentsBody.querySelectorAll('tr');
      rows.forEach(r => r.classList.remove('drag-over'));
    });
  }

  // Equipment events
  const equipmentBody = document.getElementById('equipmentBody');
  if (equipmentBody) {
    equipmentBody.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      const idx = parseInt(row.dataset.index);

      if (e.target.classList.contains('equipment-item')) {
        equipment[idx].item = e.target.value;
      }
      if (e.target.classList.contains('cost-input')) {
        equipment[idx].cost = parseFloat(e.target.value) || 0;

        // Update and show the display
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.textContent = formatCurrency(equipment[idx].cost);
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }

      // Save immediately
      saveCurrentTeam();
      localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
      updateAll();
    });

    equipmentBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('cost-input')) {
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }
    }, true);
    equipmentBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('cost-input')) {
        e.target.style.display = 'none';
        e.target.previousElementSibling.style.display = 'inline';
      }
    }, true);
    equipmentBody.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('cost-input')) {
        if (e.key === 'Enter' || e.key === 'Tab') {
          const idx = parseInt(e.target.closest('tr').dataset.index);
          equipment[idx].cost = parseFloat(e.target.value) || 0;
          saveCurrentTeam();
          localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));  // ← ADD THIS LINE
          updateAll();
          e.target.style.display = 'none';
          e.target.previousElementSibling.style.display = 'inline';
          if (e.key === 'Tab') e.preventDefault();
        }
      }
    });
    equipmentBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('cost-display')) {
        e.target.style.display = 'none';
        const input = e.target.nextElementSibling;
        input.style.display = 'inline';
        input.focus();
        input.select();
      }
      if (e.target.classList.contains('btn-remove-equipment')) {
        const idx = parseInt(e.target.dataset.index);
        removeEquipmentItem(idx);
      }
    });
  }

  // Uniforms events
  const uniformsBody = document.getElementById('uniformsBody');
  if (uniformsBody) {
    uniformsBody.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      const idx = parseInt(row.dataset.index);

      if (e.target.classList.contains('uniform-item')) {
        uniforms[idx].item = e.target.value;
      }
      if (e.target.classList.contains('uniform-cost')) {
        uniforms[idx].cost = parseFloat(e.target.value) || 0;

        // Update and show the display
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.textContent = formatCurrency(uniforms[idx].cost);
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }

      // Save immediately
      saveCurrentTeam();
      localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
      updateAll();  // ← THIS MUST BE HERE - it re-renders uniforms with updated total cost
    });

    uniformsBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('uniform-cost')) {
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }
    }, true);

    uniformsBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('cost-display')) {
        e.target.style.display = 'none';
        const input = e.target.nextElementSibling;
        if (input && input.classList.contains('uniform-cost')) {
          input.style.display = 'inline';
          input.focus();
          input.select();
        }
      }

      if (e.target.classList.contains('btn-remove-uniform')) {
        const idx = parseInt(e.target.dataset.index);
        removeUniformItem(idx);
      }
    });
  }

  // Insurance events
  const insuranceBody = document.getElementById('insuranceBody');
  if (insuranceBody) {
    insuranceBody.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      const idx = parseInt(row.dataset.index);

      if (e.target.classList.contains('insurance-item')) {
        insurance[idx].item = e.target.value;
      }
      if (e.target.classList.contains('cost-input')) {
        insurance[idx].cost = parseFloat(e.target.value) || 0;

        // Update and show the display
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.textContent = formatCurrency(insurance[idx].cost);
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }

      // Save immediately
      saveCurrentTeam();
      localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
      updateAll();
    });

    insuranceBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('cost-input')) {
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }
    }, true);
    insuranceBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('cost-input')) {
        e.target.style.display = 'none';
        e.target.previousElementSibling.style.display = 'inline';
      }
    }, true);
    insuranceBody.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('cost-input')) {
        if (e.key === 'Enter' || e.key === 'Tab') {
          const idx = parseInt(e.target.closest('tr').dataset.index);
          insurance[idx].cost = parseFloat(e.target.value) || 0;
          saveCurrentTeam();
          localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));  // ← ADD THIS LINE
          updateAll();
          e.target.style.display = 'none';
          e.target.previousElementSibling.style.display = 'inline';
          if (e.key === 'Tab') e.preventDefault();
        }
      }
    });

    insuranceBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('cost-display')) {
        e.target.style.display = 'none';
        const input = e.target.nextElementSibling;
        input.style.display = 'inline';
        input.focus();
        input.select();
      }
      if (e.target.classList.contains('btn-remove-insurance')) {
        const idx = parseInt(e.target.dataset.index);
        removeInsuranceItem(idx);
      }
    });
  }

  // Training events
  const trainingBody = document.getElementById('trainingBody');
  if (trainingBody) {
    trainingBody.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      const idx = parseInt(row.dataset.index);

      if (e.target.classList.contains('training-item')) {
        training[idx].item = e.target.value;
      }
      if (e.target.classList.contains('cost-input')) {
        training[idx].cost = parseFloat(e.target.value) || 0;

        // Update and show the display
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.textContent = formatCurrency(training[idx].cost);
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }

      // Save immediately
      saveCurrentTeam();
      localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
      updateAll();
    });

    trainingBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('cost-input')) {
        const costDisplay = e.target.previousElementSibling;
        if (costDisplay && costDisplay.classList.contains('cost-display')) {
          costDisplay.style.display = 'inline';
          e.target.style.display = 'none';
        }
      }
    }, true);
    trainingBody.addEventListener('blur', (e) => {
      if (e.target.classList.contains('cost-input')) {
        e.target.style.display = 'none';
        e.target.previousElementSibling.style.display = 'inline';
      }
    }, true);
    trainingBody.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('cost-input')) {
        if (e.key === 'Enter' || e.key === 'Tab') {
          const idx = parseInt(e.target.closest('tr').dataset.index);
          training[idx].cost = parseFloat(e.target.value) || 0;
          saveCurrentTeam();
          localStorage.setItem('TEAM_BUDGETS_DATA', JSON.stringify(TEAM_BUDGETS_DATA));
          updateAll();
          e.target.style.display = 'none';
          e.target.previousElementSibling.style.display = 'inline';
          if (e.key === 'Tab') e.preventDefault();
        }
      }
    });
    trainingBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('cost-display')) {
        e.target.style.display = 'none';
        const input = e.target.nextElementSibling;
        input.style.display = 'inline';
        input.focus();
        input.select();
      }
      if (e.target.classList.contains('btn-remove-training')) {
        const idx = parseInt(e.target.dataset.index);
        removeTrainingItem(idx);
      }
    });
  }
}

function renderTournaments(shouldSort = true) {
  // Optionally sort tournaments by start date before rendering (set shouldSort=false to preserve manual order)
  if (shouldSort) sortTournaments();
  const body = document.getElementById('tournamentsBody');
  body.innerHTML = tournaments.map((t, i) => `
        <tr data-index="${i}">
            <td class="drag-cell"><span class="drag-handle" draggable="true" data-index="${i}">☰</span></td>
            <td>${i + 1}.</td>
            <td><input type="text" class="tournament-name" value="${t.name}"></td>
            <td><input type="date" class="tournament-start" value="${t.start}"></td>
            <td><input type="date" class="tournament-end" value="${t.end}"></td>
            <td>
              <span class="fee-display" style="cursor:pointer;color:var(--color-primary);font-weight:500" data-index="${i}">${formatCurrency(t.fee || 0)}</span>
              <input type="number" class="fee-input" value="${t.fee}" min="0" step="0.01" placeholder="0.00" style="display:none;width:90px" data-index="${i}" />
            </td>
            <td><button class="btn btn-secondary btn-sm btn-remove-tournament" data-index="${i}">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function sortTournaments() {
  if (!Array.isArray(tournaments)) return;
  tournaments.sort((a, b) => {
    const aDate = a && a.start ? new Date(a.start) : new Date('9999-12-31');
    const bDate = b && b.start ? new Date(b.start) : new Date('9999-12-31');
    return aDate - bDate;
  });
}

function renderEquipment() {
  const body = document.getElementById('equipmentBody');
  body.innerHTML = equipment.map((e, i) => `
        <tr data-index="${i}">
            <td><input type="text" class="equipment-item" value="${e.item}"></td>
            <td>
              <span class="cost-display" style="cursor:pointer;color:var(--color-primary);font-weight:500" data-index="${i}">${formatCurrency(e.cost || 0)}</span>
              <input type="number" class="cost-input" value="${e.cost}" min="0" step="0.01" placeholder="0.00" style="display:none;width:90px" data-index="${i}" />
            </td>
            <td><button class="btn btn-secondary btn-sm btn-remove-equipment" data-index="${i}">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function renderUniforms() {
  const body = document.getElementById('uniformsBody');
  const rosterSize = parseInt(document.getElementById('roster').value) || 1;

  body.innerHTML = uniforms.map((u, i) => {
    const totalCost = (parseFloat(u.cost) || 0) * rosterSize;
    return `
      <tr data-index="${i}">
        <td><input type="text" class="uniform-item" value="${u.item}" /></td>
        <td>
          <span class="cost-display" style="display: inline; color: #00d4ff;">${formatCurrency(u.cost)}</span>
          <input type="number" class="uniform-cost" value="${u.cost}" style="display: none;" step="0.01" min="0" />
        </td>
        <td>${formatCurrency(totalCost)}</td>
        <td><button class="btn-remove-uniform" data-index="${i}">Remove</button></td>
      </tr>
    `;
  }).join('');
}

function renderInsurance() {
  const body = document.getElementById('insuranceBody');
  body.innerHTML = insurance.map((i, idx) => `
        <tr data-index="${idx}">
            <td><input type="text" class="insurance-item" value="${i.item}"></td>
            <td>
              <span class="cost-display" style="cursor:pointer;color:var(--color-primary);font-weight:500" data-index="${idx}">${formatCurrency(i.cost || 0)}</span>
              <input type="number" class="cost-input" value="${i.cost}" min="0" step="0.01" placeholder="0.00" style="display:none;width:90px" data-index="${idx}" />
            </td>
            <td><button class="btn btn-secondary btn-sm btn-remove-insurance" data-index="${idx}">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function renderTraining() {
  const body = document.getElementById('trainingBody');
  body.innerHTML = training.map((t, i) => `
        <tr data-index="${i}">
            <td><input type="text" class="training-item" value="${t.item}"></td>
            <td>
              <span class="cost-display" style="cursor:pointer;color:var(--color-primary);font-weight:500" data-index="${i}">${formatCurrency(t.cost || 0)}</span>
              <input type="number" class="cost-input" value="${t.cost}" min="0" step="0.01" placeholder="0.00" style="display:none;width:90px" data-index="${i}" />
            </td>
            <td><button class="btn btn-secondary btn-sm btn-remove-training" data-index="${i}">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function updateAll() {
  const rosterSize = parseFloat(document.getElementById('roster').value) || 1;
  const tournamentTotal = tournaments.reduce((sum, t) => sum + (parseFloat(t.fee) || 0), 0);
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const uniformsPerPlayerTotal = uniforms.reduce((sum, u) => sum + (parseFloat(u.cost) || 0), 0);
  const uniformsTotal = uniformsPerPlayerTotal * rosterSize;
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + uniformsTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const perPlayer = grandTotal / rosterSize;

  // Calculate percentages
  const tournamentPercent = grandTotal > 0 ? Math.round((tournamentTotal / grandTotal) * 100) : 0;
  const operationsPercent = grandTotal > 0 ? Math.round((operationsTotal / grandTotal) * 100) : 0;

  // Update section subtotals
  document.getElementById('tournamentCount').textContent = tournaments.length;
  document.getElementById('tournamentTotal').textContent = formatCurrency(tournamentTotal);
  document.getElementById('equipmentTotal').textContent = formatCurrency(equipmentTotal);
  document.getElementById('uniformsPerPlayer').textContent = formatCurrency(uniformsPerPlayerTotal);
  document.getElementById('rosterCount').textContent = rosterSize;
  document.getElementById('uniformsTotal').textContent = formatCurrency(uniformsTotal);
  document.getElementById('insuranceTotal').textContent = formatCurrency(insuranceTotal);
  document.getElementById('trainingTotal').textContent = formatCurrency(trainingTotal);

  // Update bubble view
  document.getElementById('summaryTournaments').textContent = formatCurrency(tournamentTotal);
  document.getElementById('summaryOperations').textContent = formatCurrency(operationsTotal);
  document.getElementById('summaryGrandTotal').textContent = formatCurrency(grandTotal);
  document.getElementById('summaryPerPlayer').textContent = formatCurrency(perPlayer);
  document.getElementById('tournamentPercentage').textContent = tournamentPercent + '%';
  document.getElementById('operationsPercentage').textContent = operationsPercent + '%';

  // Update line item view
  document.getElementById('lineItemTournaments').textContent = formatCurrency(tournamentTotal);
  document.getElementById('lineItemEquipment').textContent = formatCurrency(equipmentTotal);
  document.getElementById('lineItemUniforms').textContent = formatCurrency(uniformsTotal);
  document.getElementById('lineItemInsurance').textContent = formatCurrency(insuranceTotal);
  document.getElementById('lineItemTraining').textContent = formatCurrency(trainingTotal);
  document.getElementById('lineItemGrandTotal').textContent = formatCurrency(grandTotal);
  document.getElementById('lineItemPerPlayer').textContent = formatCurrency(perPlayer);
  renderUniforms(); // Re-render uniforms to update total costs per item
}

function renderAll() {
  renderTournaments();
  renderEquipment();
  renderUniforms();
  renderInsurance();
  renderTraining();
}

// Tournament Functions
function addTournament() {
  // Default start to 7 days after previous tournament start if present, otherwise today
  const todayDate = getTodayDate();
  let newStart = todayDate;
  if (tournaments.length > 0) {
    const last = tournaments[tournaments.length - 1];
    const lastStart = last && last.start ? new Date(last.start) : null;
    if (lastStart) {
      const d = new Date(lastStart);
      d.setDate(d.getDate() + 7);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      newStart = `${yyyy}-${mm}-${dd}`;
    }
  }
  // Default end to one day after newStart
  const startDate = new Date(newStart);
  // add 1 day to start date
  const newEndDate = new Date(startDate);
  newEndDate.setDate(newEndDate.getDate() + 1); // +1 day [web:6][web:8]
  // format back to yyyy-mm-dd (for date input)
  const iso = newEndDate.toISOString().slice(0, 10);
  tournaments.push({ name: "", start: newStart, end: iso, fee: 0 });
  renderTournaments();
}

function removeTournament(idx) {
  tournaments.splice(idx, 1);
  renderTournaments();
}

function clearTournaments() {
  if (confirm("Clear all tournaments? This cannot be undone.")) {
    tournaments = [];
    renderTournaments();
  }
}

// Equipment Functions
function addEquipmentItem() {
  equipment.push({ item: "", cost: 0 });
  renderEquipment();
}

function removeEquipmentItem(idx) {
  equipment.splice(idx, 1);
  renderEquipment();
}

function clearEquipment() {
  if (confirm("Clear all equipment items? This cannot be undone.")) {
    equipment = [];
    renderEquipment();
  }
}

// Uniform Functions
function addUniformItem() {
  uniforms.push({ item: "", cost: 0 });
  renderUniforms();
}

function removeUniformItem(idx) {
  uniforms.splice(idx, 1);
  renderUniforms();
}

function clearUniforms() {
  if (confirm("Clear all uniform items? This cannot be undone.")) {
    uniforms = [];
    renderUniforms();
  }
}

// Insurance Functions
function addInsuranceItem() {
  insurance.push({ item: "", cost: 0 });
  renderInsurance();
}

function removeInsuranceItem(idx) {
  insurance.splice(idx, 1);
  renderInsurance();
}

function clearInsurance() {
  if (confirm("Clear all insurance & membership items? This cannot be undone.")) {
    insurance = [];
    renderInsurance();
  }
}

// Training Functions
function addTrainingItem() {
  training.push({ item: "", cost: 0 });
  renderTraining();
}

function removeTrainingItem(idx) {
  training.splice(idx, 1);
  renderTraining();
}

function clearTraining() {
  if (confirm("Clear all training items? This cannot be undone.")) {
    training = [];
    renderTraining();
  }
}

// View Toggle Function
function switchView(viewType) {
  const bubbleView = document.getElementById('bubbleView');
  const lineView = document.getElementById('lineView');
  const bubbleBtn = document.getElementById('toggleBubbleView');
  const lineBtn = document.getElementById('toggleLineView');

  if (viewType === 'bubble') {
    bubbleView.classList.add('active');
    lineView.classList.remove('active');
    bubbleBtn.classList.add('active');
    lineBtn.classList.remove('active');
  } else {
    lineView.classList.add('active');
    bubbleView.classList.remove('active');
    lineBtn.classList.add('active');
    bubbleBtn.classList.remove('active');
  }
}

// Export Functions
function exportToExcel() {
  const teamName = document.getElementById('teamName').value || 'WGYS Team';
  const sport = document.getElementById('sport').value;
  const season = document.getElementById('season').value;
  const rosterSize = document.getElementById('roster').value;

  const tournamentTotal = tournaments.reduce((sum, t) => sum + (parseFloat(t.fee) || 0), 0);
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const uniformsPerPlayerTotal = uniforms.reduce((sum, u) => sum + (parseFloat(u.cost) || 0), 0);
  const uniformsTotal = uniformsPerPlayerTotal * (parseFloat(rosterSize) || 1);
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + uniformsTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const perPlayer = grandTotal / (parseFloat(rosterSize) || 1);

  let csvContent = `WGYS Select ${sport} - Budget & Cost\n`;
  csvContent += `Team: ${teamName}\nSeason: ${season}\nRoster Size: ${rosterSize}\n\n`;

  csvContent += `TOURNAMENT COSTS\nTournament Name,Start Date,End Date,Entry Fee\n`;
  tournaments.forEach(t => {
    csvContent += `"${t.name}",${t.start},${t.end},${t.fee}\n`;
  });
  csvContent += `Total Tournament Costs,,,${tournamentTotal}\n\n`;

  csvContent += `UNIFORMS\nItem,Cost Per Player,Total Cost\n`;
  uniforms.forEach(u => {
    const total = (parseFloat(u.cost) || 0) * (parseFloat(rosterSize) || 1);
    csvContent += `"${u.item}",${u.cost},${total}\n`;
  });
  csvContent += `Total Uniform Costs,${uniformsTotal / rosterSize},${uniformsTotal}\n\n`;

  csvContent += `EQUIPMENT\nItem,Cost\n`;
  equipment.forEach(e => {
    csvContent += `"${e.item}",${e.cost}\n`;
  });
  csvContent += `Total Equipment Costs,,${equipmentTotal}\n\n`;

  csvContent += `INSURANCE & MEMBERSHIPS\nItem,Cost\n`;
  insurance.forEach(i => {
    csvContent += `"${i.item}",${i.cost}\n`;
  });
  csvContent += `Total Insurance Costs,,${insuranceTotal}\n\n`;

  csvContent += `TRAINING\nItem,Cost\n`;
  training.forEach(t => {
    csvContent += `"${t.item}",${t.cost}\n`;
  });
  csvContent += `Total Training Costs,,${trainingTotal}\n\n`;

  csvContent += `SUMMARY\nCategory,Amount\n`;
  csvContent += `Tournament Costs,${tournamentTotal}\n`;
  csvContent += `Uniform Costs,${uniformsTotal}\n`;
  csvContent += `Equipment Costs,${equipmentTotal}\n`;
  csvContent += `Insurance & Memberships,${insuranceTotal}\n`;
  csvContent += `Training Costs,${trainingTotal}\n`;
  csvContent += `Grand Total,${grandTotal}\n`;
  csvContent += `Per Player Cost,${perPlayer.toFixed(2)}\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `WGYS_Budget_${teamName}_${season}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToPDF() {
  const teamName = document.getElementById('teamName').value || 'WGYS Team';
  const sport = document.getElementById('sport').value;
  const season = document.getElementById('season').value;
  const rosterSize = document.getElementById('roster').value;

  const tournamentTotal = tournaments.reduce((sum, t) => sum + (parseFloat(t.fee) || 0), 0);
  const uniformsPerPlayerTotal = uniforms.reduce((sum, u) => sum + (parseFloat(u.cost) || 0), 0);
  const uniformsTotal = uniformsPerPlayerTotal * (parseFloat(rosterSize) || 1);
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + uniformsTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const perPlayer = grandTotal / (parseFloat(rosterSize) || 1);

  // Access jsPDF from window.jspdf
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'letter');

  let yPosition = 15;
  const margin = 10;

  // Title
  doc.setFontSize(18);
  doc.setTextColor(32, 128, 133);
  doc.text(`WGYS Select ${sport} - Budget & Cost`, margin, yPosition);
  yPosition += 12;

  // Team Info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Team: ${teamName}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Season: ${season}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Roster Size: ${rosterSize} Players`, margin, yPosition);
  yPosition += 12;

  // Tournament Costs Section
  doc.setFontSize(12);
  doc.setTextColor(32, 128, 133);
  doc.text('Tournament Costs', margin, yPosition);
  yPosition += 8;

  const tournamentData = tournaments.map(t => [t.name, t.start, t.end, formatCurrency(t.fee)]);
  tournamentData.push(['Total Tournament Costs', '', '', formatCurrency(tournamentTotal)]);

  doc.autoTable({
    startY: yPosition,
    head: [['Tournament Name', 'Start Date', 'End Date', 'Entry Fee']],
    body: tournamentData,
    margin: margin,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  yPosition = doc.lastAutoTable.finalY + 8;

  // Uniforms Section
  doc.setFontSize(12);
  doc.setTextColor(32, 128, 133);
  doc.text('Uniforms', margin, yPosition);
  yPosition += 8;

  const uniformsData = uniforms.map(u => [u.item, formatCurrency(u.cost), formatCurrency((parseFloat(u.cost) || 0) * (parseFloat(rosterSize) || 1))]);
  uniformsData.push(['Total Uniform Costs', formatCurrency(uniformsTotal / rosterSize), formatCurrency(uniformsTotal)]);

  doc.autoTable({
    startY: yPosition,
    head: [['Item', 'Cost Per Player', 'Total Cost']],
    body: uniformsData,
    margin: margin,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  yPosition = doc.lastAutoTable.finalY + 8;

  // Equipment Section
  doc.setFontSize(12);
  doc.setTextColor(32, 128, 133);
  doc.text('Equipment', margin, yPosition);
  yPosition += 8;

  const equipmentData = equipment.map(e => [e.item, formatCurrency(e.cost)]);
  equipmentData.push(['Total Equipment Costs', formatCurrency(equipmentTotal)]);

  doc.autoTable({
    startY: yPosition,
    head: [['Item', 'Cost']],
    body: equipmentData,
    margin: margin,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  yPosition = doc.lastAutoTable.finalY + 8;

  // Insurance Section
  doc.setFontSize(12);
  doc.setTextColor(32, 128, 133);
  doc.text('Insurance & Memberships', margin, yPosition);
  yPosition += 8;

  const insuranceData = insurance.map(i => [i.item, formatCurrency(i.cost)]);
  insuranceData.push(['Total Insurance Costs', formatCurrency(insuranceTotal)]);

  doc.autoTable({
    startY: yPosition,
    head: [['Item', 'Cost']],
    body: insuranceData,
    margin: margin,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  yPosition = doc.lastAutoTable.finalY + 8;

  // Training Section
  doc.setFontSize(12);
  doc.setTextColor(32, 128, 133);
  doc.text('Training', margin, yPosition);
  yPosition += 8;

  const trainingData = training.map(t => [t.item, formatCurrency(t.cost)]);
  trainingData.push(['Total Training Costs', formatCurrency(trainingTotal)]);

  doc.autoTable({
    startY: yPosition,
    head: [['Item', 'Cost']],
    body: trainingData,
    margin: margin,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  yPosition = doc.lastAutoTable.finalY + 12;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 15;
  }

  // Budget Summary Section
  doc.setFontSize(12);
  doc.setTextColor(32, 128, 133);
  doc.text('Budget Summary', margin, yPosition);
  yPosition += 8;

  const summaryData = [
    ['Tournament Costs:', formatCurrency(tournamentTotal)],
    ['Uniform Costs:', formatCurrency(uniformsTotal)],
    ['Equipment Costs:', formatCurrency(equipmentTotal)],
    ['Insurance & Memberships:', formatCurrency(insuranceTotal)],
    ['Training Costs:', formatCurrency(trainingTotal)],
    ['Operations Total:', formatCurrency(operationsTotal)],
    ['GRAND TOTAL:', formatCurrency(grandTotal)],
    ['Cost Per Player:', formatCurrency(perPlayer)]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Category', 'Amount']],
    body: summaryData,
    margin: margin,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    bodyStyles: { fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  // Save the PDF
  doc.save(`WGYS_Budget_${teamName}_${season}.pdf`);
}

function exportToDOCX() {
  const teamName = document.getElementById('teamName').value || 'WGYS Team';
  const sport = document.getElementById('sport').value;
  const season = document.getElementById('season').value;
  const rosterSize = document.getElementById('roster').value;

  const tournamentTotal = tournaments.reduce((sum, t) => sum + (parseFloat(t.fee) || 0), 0);
  const uniformsPerPlayerTotal = uniforms.reduce((sum, u) => sum + (parseFloat(u.cost) || 0), 0);
  const uniformsTotal = uniformsPerPlayerTotal * (parseFloat(rosterSize) || 1);
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + uniformsTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const perPlayer = grandTotal / (parseFloat(rosterSize) || 1);

  // Create HTML content that Word can open
  const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <title>WGYS Budget - ${teamName}</title>
    <style>
        body { font-family: Calibri, sans-serif; margin: 0; padding: 0; margin-left: 0; margin-right: 0; }
        h1 { font-size: 28pt; color: #208085; margin: 12pt 0; }
        h2 { font-size: 14pt; color: #208085; margin: 12pt 0 6pt 0; border-bottom: 2pt solid #208085; padding-bottom: 6pt; }
        p { margin: 6pt 0; font-size: 11pt; }
        table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
        th { background: #f0f0f0; padding: 8pt; text-align: left; border: 1pt solid #999; font-weight: bold; font-size: 11pt; }
        td { padding: 6pt; border: 1pt solid #ccc; font-size: 11pt; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .grand-total { font-weight: bold; font-size: 12pt; background: #e8f4f5; }
    </style>
</head>
<body>
<h1>WGYS ${sport} - Budget &amp; Cost</h1>

<p><strong>Team:</strong> ${teamName}</p>
<p><strong>Season:</strong> ${season}</p>
<p><strong>Roster Size:</strong> ${rosterSize} Players</p>

<h2>Tournament Costs</h2>
<table>
    <tr>
        <th>Tournament Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Entry Fee</th>
    </tr>
    ${tournaments.map(t => `
    <tr>
        <td>${t.name}</td>
        <td>${t.start}</td>
        <td>${t.end}</td>
        <td>${formatCurrency(t.fee)}</td>
    </tr>
    `).join('')}
    <tr class="total-row">
        <td colspan="3">Total Tournament Costs</td>
        <td>${formatCurrency(tournamentTotal)}</td>
    </tr>
</table>

<h2>Uniforms</h2>
<table>
  <tr>
    <th>Item</th>
    <th>Cost Per Player</th>
    <th>Total Cost</th>
  </tr>
  ${uniforms.map(u => `
  <tr>
    <td>${u.item}</td>
    <td>${formatCurrency(u.cost)}</td>
    <td>${formatCurrency((parseFloat(u.cost) || 0) * (parseFloat(rosterSize) || 1))}</td>
  </tr>
  `).join('')}
  <tr class="total-row">
    <td>Total Uniform Costs</td>
    <td>${formatCurrency(uniformsTotal / rosterSize)}</td>
    <td>${formatCurrency(uniformsTotal)}</td>
  </tr>
</table>

<h2>Equipment</h2>
<table>
    <tr>
        <th>Item</th>
        <th>Cost</th>
    </tr>
    ${equipment.map(e => `
    <tr>
        <td>${e.item}</td>
        <td>${formatCurrency(e.cost)}</td>
    </tr>
    `).join('')}
    <tr class="total-row">
        <td>Total Equipment Costs</td>
        <td>${formatCurrency(equipmentTotal)}</td>
    </tr>
</table>

<h2>Insurance &amp; Memberships</h2>
<table>
    <tr>
        <th>Item</th>
        <th>Cost</th>
    </tr>
    ${insurance.map(i => `
    <tr>
        <td>${i.item}</td>
        <td>${formatCurrency(i.cost)}</td>
    </tr>
    `).join('')}
    <tr class="total-row">
        <td>Total Insurance Costs</td>
        <td>${formatCurrency(insuranceTotal)}</td>
    </tr>
</table>

<h2>Training</h2>
<table>
    <tr>
        <th>Item</th>
        <th>Cost</th>
    </tr>
    ${training.map(t => `
    <tr>
        <td>${t.item}</td>
        <td>${formatCurrency(t.cost)}</td>
    </tr>
    `).join('')}
    <tr class="total-row">
        <td>Total Training Costs</td>
        <td>${formatCurrency(trainingTotal)}</td>
    </tr>
</table>

<h2>Budget Summary</h2>
<table>
    <tr>
        <td><strong>Tournament Costs:</strong></td>
        <td>${formatCurrency(tournamentTotal)}</td>
    </tr>
    <tr>
        <td><strong>Uniform Costs:</strong></td>
        <td>${formatCurrency(uniformsTotal)}</td>
    </tr>
    <tr>
        <td><strong>Equipment Costs:</strong></td>
        <td>${formatCurrency(equipmentTotal)}</td>
    </tr>
    <tr>
        <td><strong>Insurance &amp; Memberships:</strong></td>
        <td>${formatCurrency(insuranceTotal)}</td>
    </tr>
    <tr>
        <td><strong>Training Costs:</strong></td>
        <td>${formatCurrency(trainingTotal)}</td>
    </tr>
    <tr>
        <td><strong>Operations Total:</strong></td>
        <td>${formatCurrency(operationsTotal)}</td>
    </tr>
    <tr class="grand-total">
        <td><strong>GRAND TOTAL:</strong></td>
        <td><strong>${formatCurrency(grandTotal)}</strong></td>
    </tr>
    <tr>
        <td><strong>Cost Per Player:</strong></td>
        <td><strong>${formatCurrency(perPlayer)}</strong></td>
    </tr>
</table>

</body>
</html>`;

  // Save as .doc (Word 97-2003 format that accepts HTML)
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `WGYS_Budget_${teamName}_${season}.doc`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);