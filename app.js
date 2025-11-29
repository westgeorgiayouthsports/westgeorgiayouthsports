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
  { item: "Practice Jerseys (2) & Hats (screen print & embroidered logos/numbers)", cost: 900 },
  { item: "Game Uniforms", cost: 4000 }
];

const DEFAULT_INSURANCE = [
  { item: "Team Insurance", cost: 140 },
  { item: "TeamSnap Annual Subscription", cost: 100 }
];

const DEFAULT_TRAINING = [
  { item: "Training Facility, HitTrax Cage, & Pitching Machine", cost: 1500 },
  { item: "Speed & Agility Trainer (Feb-Jun)", cost: 1000 }
];

let tournaments = [...DEFAULT_TOURNAMENTS];
let equipment = [...DEFAULT_EQUIPMENT];
let insurance = [...DEFAULT_INSURANCE];
let training = [...DEFAULT_TRAINING];

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function initializeApp() {
  const currentYear = new Date().getFullYear();
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

  // Roster Change Listener
  document.getElementById('roster').addEventListener('change', updateAll);

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  renderAll();
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

function renderTournaments() {
  const body = document.getElementById('tournamentsBody');
  body.innerHTML = tournaments.map((t, i) => `
        <tr>
            <td><input type="text" value="${t.name}" onchange="tournaments[${i}].name = this.value; updateAll();"></td>
            <td><input type="date" value="${t.start}" onchange="tournaments[${i}].start = this.value; updateAll();" onblur="if(!tournaments[${i}].end && tournaments[${i}].start) { tournaments[${i}].end = tournaments[${i}].start; renderTournaments(); }"></td>
            <td><input type="date" value="${t.end}" onchange="tournaments[${i}].end = this.value; updateAll();"></td>
            <td><input type="number" value="${t.fee}" min="0" step="0.01" onchange="tournaments[${i}].fee = parseFloat(this.value) || 0; updateAll();"></td>
            <td><button class="btn btn-secondary btn-sm" onclick="removeTournament(${i})">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function renderEquipment() {
  const body = document.getElementById('equipmentBody');
  body.innerHTML = equipment.map((e, i) => `
        <tr>
            <td><input type="text" value="${e.item}" onchange="equipment[${i}].item = this.value; updateAll();"></td>
            <td><input type="number" value="${e.cost}" min="0" step="0.01" onchange="equipment[${i}].cost = parseFloat(this.value) || 0; updateAll();"></td>
            <td><button class="btn btn-secondary btn-sm" onclick="removeEquipmentItem(${i})">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function renderInsurance() {
  const body = document.getElementById('insuranceBody');
  body.innerHTML = insurance.map((i, idx) => `
        <tr>
            <td><input type="text" value="${i.item}" onchange="insurance[${idx}].item = this.value; updateAll();"></td>
            <td><input type="number" value="${i.cost}" min="0" step="0.01" onchange="insurance[${idx}].cost = parseFloat(this.value) || 0; updateAll();"></td>
            <td><button class="btn btn-secondary btn-sm" onclick="removeInsuranceItem(${idx})">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function renderTraining() {
  const body = document.getElementById('trainingBody');
  body.innerHTML = training.map((t, i) => `
        <tr>
            <td><input type="text" value="${t.item}" onchange="training[${i}].item = this.value; updateAll();"></td>
            <td><input type="number" value="${t.cost}" min="0" step="0.01" onchange="training[${i}].cost = parseFloat(this.value) || 0; updateAll();"></td>
            <td><button class="btn btn-secondary btn-sm" onclick="removeTrainingItem(${i})">Remove</button></td>
        </tr>
    `).join('');
  updateAll();
}

function updateAll() {
  const tournamentTotal = tournaments.reduce((sum, t) => sum + (parseFloat(t.fee) || 0), 0);
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const rosterSize = parseFloat(document.getElementById('roster').value) || 1;
  const perPlayer = grandTotal / rosterSize;

  // Calculate percentages
  const tournamentPercent = grandTotal > 0 ? Math.round((tournamentTotal / grandTotal) * 100) : 0;
  const operationsPercent = grandTotal > 0 ? Math.round((operationsTotal / grandTotal) * 100) : 0;

  // Update section subtotals
  document.getElementById('tournamentCount').textContent = tournaments.length;
  document.getElementById('tournamentTotal').textContent = formatCurrency(tournamentTotal);
  document.getElementById('equipmentTotal').textContent = formatCurrency(equipmentTotal);
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
  document.getElementById('lineItemInsurance').textContent = formatCurrency(insuranceTotal);
  document.getElementById('lineItemTraining').textContent = formatCurrency(trainingTotal);
  document.getElementById('lineItemGrandTotal').textContent = formatCurrency(grandTotal);
  document.getElementById('lineItemPerPlayer').textContent = formatCurrency(perPlayer);
}

function renderAll() {
  renderTournaments();
  renderEquipment();
  renderInsurance();
  renderTraining();
}

// Tournament Functions
function addTournament() {
  const todayDate = getTodayDate();
  tournaments.push({ name: "", start: todayDate, end: todayDate, fee: 0 });
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
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const grandTotal = tournamentTotal + equipmentTotal + insuranceTotal + trainingTotal;
  const perPlayer = grandTotal / rosterSize;

  let csvContent = `WGYS ${sport} - Budget & Pricing Template\n`;
  csvContent += `Team: ${teamName}\nSeason: ${season}\nRoster Size: ${rosterSize}\n\n`;

  csvContent += `TOURNAMENT COSTS\nTournament Name,Start Date,End Date,Entry Fee\n`;
  tournaments.forEach(t => {
    csvContent += `"${t.name}",${t.start},${t.end},${t.fee}\n`;
  });
  csvContent += `Total Tournament Costs,,,${tournamentTotal}\n\n`;

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
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const perPlayer = grandTotal / rosterSize;

  let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WGYS Budget - ${teamName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; margin: 0.5in; line-height: 1.6; color: #333; }
        h1 { color: #208085; font-size: 24px; margin: 20px 0 10px 0; }
        h2 { color: #208085; font-size: 16px; margin: 20px 0 10px 0; border-bottom: 2px solid #208085; padding-bottom: 6px; }
        .header-info { margin-bottom: 20px; background: #f5f5f5; padding: 12px; border-radius: 4px; }
        .info-row { margin: 6px 0; font-size: 12px; }
        .summary-section { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #f0f0f0; padding: 10px; text-align: left; border: 1px solid #999; font-weight: bold; font-size: 12px; }
        td { padding: 8px; border: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) { background: #fafafa; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .grand-total { font-weight: bold; font-size: 13px; background: #e8f4f5; }
        @media print {
            body { margin: 0.5in; }
            .page-break { page-break-after: always; }
        }
    </style>
</head>
<body>
    <h1>WGYS ${sport} - Budget &amp; Pricing Template</h1>
    
    <div class="header-info">
        <div class="info-row"><strong>Team:</strong> ${teamName}</div>
        <div class="info-row"><strong>Season:</strong> ${season}</div>
        <div class="info-row"><strong>Roster Size:</strong> ${rosterSize} Players</div>
    </div>

    <h2>Tournament Costs</h2>
    <table>
        <thead>
            <tr>
                <th>Tournament Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Entry Fee</th>
            </tr>
        </thead>
        <tbody>
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
        </tbody>
    </table>

    <h2>Equipment</h2>
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tbody>
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
        </tbody>
    </table>

    <h2>Insurance &amp; Memberships</h2>
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tbody>
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
        </tbody>
    </table>

    <h2>Training</h2>
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tbody>
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
        </tbody>
    </table>

    <div class="page-break"></div>

    <h2>Budget Summary</h2>
    <div class="summary-section">
        <table>
            <tr>
                <td><strong>Tournament Costs:</strong></td>
                <td>${formatCurrency(tournamentTotal)}</td>
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
    </div>
</body>
</html>`;

  // Open in new window for printing to PDF
  const printWindow = window.open('', '', 'height=800,width=1000');
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Delay to ensure content loads before printing
  setTimeout(() => {
    printWindow.print();
    // Close window after a delay
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }, 500);
}

function exportToDOCX() {
  const teamName = document.getElementById('teamName').value || 'WGYS Team';
  const sport = document.getElementById('sport').value;
  const season = document.getElementById('season').value;
  const rosterSize = document.getElementById('roster').value;

  const tournamentTotal = tournaments.reduce((sum, t) => sum + (parseFloat(t.fee) || 0), 0);
  const equipmentTotal = equipment.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const insuranceTotal = insurance.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const trainingTotal = training.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const operationsTotal = equipmentTotal + insuranceTotal + trainingTotal;
  const grandTotal = tournamentTotal + operationsTotal;
  const perPlayer = grandTotal / rosterSize;

  // Create HTML content that Word can open
  const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <title>WGYS Budget - ${teamName}</title>
    <style>
        body { font-family: Calibri, sans-serif; margin: 0.5in; }
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
<h1>WGYS ${sport} - Budget &amp; Pricing Template</h1>

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