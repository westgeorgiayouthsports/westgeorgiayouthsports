// Data storage
let tournaments = [];
let operations = [];
let nextTournamentId = 1;
let nextOperationId = 1;

// Initialize with 2023 data
const tournaments2023 = [
    { id: 1, name: "17BB: Beat the Freeze", startDate: "2023-02-25", endDate: "2023-02-26", entryFee: 450 },
    { id: 2, name: "PBR: Sunday Series #3", startDate: "2023-03-05", endDate: "2023-03-05", entryFee: 425 },
    { id: 3, name: "PG: For the Kids Classic (MINOR)", startDate: "2023-03-17", endDate: "2023-03-19", entryFee: 725 },
    { id: 4, name: "17BB: March Madness", startDate: "2023-03-25", endDate: "2023-03-26", entryFee: 550 },
    { id: 5, name: "PG: Southeast Backyard Brawl (MAJOR)", startDate: "2023-04-14", endDate: "2023-04-16", entryFee: 725 },
    { id: 6, name: "PG: Georgia State Championship (MAJOR)", startDate: "2023-04-21", endDate: "2023-04-23", entryFee: 750 },
    { id: 7, name: "PG: Southeast Youth World Series (Open)", startDate: "2023-05-05", endDate: "2023-05-07", entryFee: 725 },
    { id: 8, name: "PG: Georgia State Championship (MINOR)", startDate: "2023-05-12", endDate: "2023-05-14", entryFee: 725 },
    { id: 9, name: "PG: Greater Atlanta Open", startDate: "2023-05-19", endDate: "2023-05-21", entryFee: 725 },
    { id: 10, name: "PG: Youth Southeast Memorial Day Classic (Open)", startDate: "2023-05-26", endDate: "2023-05-29", entryFee: 725 },
    { id: 11, name: "PG: Southeast Elite Youth Championship (OPEN)", startDate: "2023-06-02", endDate: "2023-06-04", entryFee: 725 },
    { id: 12, name: "PG: Southeast World Series #2 (MINOR)", startDate: "2023-06-09", endDate: "2023-06-11", entryFee: 725 }
];

const operations2023 = [
    { id: 1, category: "Equipment", item: "Practice & Game Baseballs", cost: 500 },
    { id: 2, category: "Equipment", item: "Practice Jerseys (2) & Hats (screen print & embroidered logos/numbers)", cost: 900 },
    { id: 3, category: "Equipment", item: "Game Uniforms", cost: 4000 },
    { id: 4, category: "Insurance & Memberships", item: "Team Insurance", cost: 140 },
    { id: 5, category: "Insurance & Memberships", item: "TeamSnap Annual Subscription", cost: 100 },
    { id: 6, category: "Training", item: "Training Facility, HitTrax Cage, & Pitching Machine", cost: 1500 },
    { id: 7, category: "Training", item: "Speed & Agility Trainer (Feb-Jun)", cost: 1000 }
];

// Initialize app
function init() {
    tournaments = [...tournaments2023];
    nextTournamentId = Math.max(...tournaments.map(t => t.id)) + 1;
    
    operations = [...operations2023];
    nextOperationId = Math.max(...operations.map(o => o.id)) + 1;
    
    renderTournaments();
    renderOperations();
    attachEventListeners();
    calculateTotals();
}

// Attach event listeners to parameter inputs
function attachEventListeners() {
    document.getElementById('teamName').addEventListener('input', calculateTotals);
    document.getElementById('sport').addEventListener('change', calculateTotals);
    document.getElementById('seasonYear').addEventListener('input', calculateTotals);
    document.getElementById('rosterSize').addEventListener('input', calculateTotals);
}

// Render tournaments table
function renderTournaments() {
    const tbody = document.getElementById('tournamentBody');
    tbody.innerHTML = '';
    
    tournaments.forEach(tournament => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="text" class="input-table" value="${tournament.name}" 
                       onchange="updateTournament(${tournament.id}, 'name', this.value)">
            </td>
            <td>
                <input type="date" class="input-table" value="${tournament.startDate}" 
                       onchange="updateTournament(${tournament.id}, 'startDate', this.value)">
            </td>
            <td>
                <input type="date" class="input-table" value="${tournament.endDate}" 
                       onchange="updateTournament(${tournament.id}, 'endDate', this.value)">
            </td>
            <td class="text-right">
                <input type="number" class="input-table text-right" value="${tournament.entryFee}" 
                       min="0" step="25" onchange="updateTournament(${tournament.id}, 'entryFee', parseFloat(this.value))">
            </td>
            <td class="text-center">
                <button class="btn btn-secondary btn-icon" onclick="removeTournament(${tournament.id})" 
                        title="Remove tournament">×</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render operations table
function renderOperations() {
    const tbody = document.getElementById('operationsBody');
    tbody.innerHTML = '';
    
    const categories = {};
    operations.forEach(op => {
        if (!categories[op.category]) {
            categories[op.category] = [];
        }
        categories[op.category].push(op);
    });
    
    Object.keys(categories).forEach(category => {
        // Add category header
        const categoryRow = document.createElement('tr');
        categoryRow.innerHTML = `<td colspan="4" class="category-label">${category}</td>`;
        tbody.appendChild(categoryRow);
        
        // Add items in category
        categories[category].forEach(operation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="text" class="input-table" value="${operation.category}" 
                           onchange="updateOperation(${operation.id}, 'category', this.value)">
                </td>
                <td>
                    <input type="text" class="input-table" value="${operation.item}" 
                           onchange="updateOperation(${operation.id}, 'item', this.value)">
                </td>
                <td class="text-right">
                    <input type="number" class="input-table text-right" value="${operation.cost}" 
                           min="0" step="10" onchange="updateOperation(${operation.id}, 'cost', parseFloat(this.value))">
                </td>
                <td class="text-center">
                    <button class="btn btn-secondary btn-icon" onclick="removeOperation(${operation.id})" 
                            title="Remove item">×</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add subtotal for category
        const subtotal = categories[category].reduce((sum, op) => sum + op.cost, 0);
        const subtotalRow = document.createElement('tr');
        subtotalRow.className = 'subtotal-row';
        subtotalRow.innerHTML = `
            <td colspan="2" class="text-right"><em>${category} Subtotal:</em></td>
            <td class="text-right"><strong>$${subtotal.toFixed(2)}</strong></td>
            <td></td>
        `;
        tbody.appendChild(subtotalRow);
    });
}

// Add new tournament
function addTournament() {
    const newTournament = {
        id: nextTournamentId++,
        name: "New Tournament",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        entryFee: 500
    };
    tournaments.push(newTournament);
    renderTournaments();
    calculateTotals();
}

// Update tournament
function updateTournament(id, field, value) {
    const tournament = tournaments.find(t => t.id === id);
    if (tournament) {
        tournament[field] = value;
        calculateTotals();
    }
}

// Remove tournament
function removeTournament(id) {
    tournaments = tournaments.filter(t => t.id !== id);
    renderTournaments();
    calculateTotals();
}

// Add new operation item
function addOperationItem() {
    const newOperation = {
        id: nextOperationId++,
        category: "Other",
        item: "New Item",
        cost: 0
    };
    operations.push(newOperation);
    renderOperations();
    calculateTotals();
}

// Update operation
function updateOperation(id, field, value) {
    const operation = operations.find(o => o.id === id);
    if (operation) {
        operation[field] = value;
        renderOperations();
        calculateTotals();
    }
}

// Remove operation
function removeOperation(id) {
    operations = operations.filter(o => o.id !== id);
    renderOperations();
    calculateTotals();
}

// Calculate all totals
function calculateTotals() {
    const totalTournaments = tournaments.reduce((sum, t) => sum + (parseFloat(t.entryFee) || 0), 0);
    const totalOperations = operations.reduce((sum, o) => sum + (parseFloat(o.cost) || 0), 0);
    const grandTotal = totalTournaments + totalOperations;
    
    const rosterSize = parseInt(document.getElementById('rosterSize').value) || 1;
    const perPlayerFee = grandTotal / rosterSize;
    
    // Update tournament total
    document.getElementById('totalTournaments').textContent = `$${totalTournaments.toFixed(2)}`;
    
    // Update operations total
    document.getElementById('totalOperations').textContent = `$${totalOperations.toFixed(2)}`;
    
    // Update summary cards
    document.getElementById('summaryTournaments').textContent = `$${totalTournaments.toFixed(2)}`;
    document.getElementById('summaryOperations').textContent = `$${totalOperations.toFixed(2)}`;
    document.getElementById('summaryGrandTotal').textContent = `$${grandTotal.toFixed(2)}`;
    document.getElementById('summaryPerPlayer').textContent = `$${perPlayerFee.toFixed(2)}`;
    
    // Update percentages
    const tournamentPercentage = grandTotal > 0 ? (totalTournaments / grandTotal * 100).toFixed(1) : 0;
    const operationsPercentage = grandTotal > 0 ? (totalOperations / grandTotal * 100).toFixed(1) : 0;
    document.getElementById('tournamentPercentage').textContent = `${tournamentPercentage}%`;
    document.getElementById('operationsPercentage').textContent = `${operationsPercentage}%`;
}

// Export to Excel (CSV format)
function exportToExcel() {
    const teamName = document.getElementById('teamName').value;
    const sport = document.getElementById('sport').value;
    const seasonYear = document.getElementById('seasonYear').value;
    const rosterSize = document.getElementById('rosterSize').value;
    
    let csv = 'West Georgia Youth Sports - Budget Template\n';
    csv += `Team Name:,${teamName}\n`;
    csv += `Sport:,${sport}\n`;
    csv += `Season Year:,${seasonYear}\n`;
    csv += `Roster Size:,${rosterSize}\n`;
    csv += '\n';
    
    // Tournament section
    csv += 'TOURNAMENT COSTS\n';
    csv += 'Tournament Name,Start Date,End Date,Entry Fee\n';
    tournaments.forEach(t => {
        csv += `"${t.name}",${t.startDate},${t.endDate},${t.entryFee}\n`;
    });
    const totalTournaments = tournaments.reduce((sum, t) => sum + (parseFloat(t.entryFee) || 0), 0);
    csv += `Total Tournament Costs,,,${totalTournaments.toFixed(2)}\n`;
    csv += '\n';
    
    // Operations section
    csv += 'TEAM OPERATIONS COSTS\n';
    csv += 'Category,Item Description,Cost\n';
    operations.forEach(o => {
        csv += `"${o.category}","${o.item}",${o.cost}\n`;
    });
    const totalOperations = operations.reduce((sum, o) => sum + (parseFloat(o.cost) || 0), 0);
    csv += `Total Operations Costs,,${totalOperations.toFixed(2)}\n`;
    csv += '\n';
    
    // Summary
    const grandTotal = totalTournaments + totalOperations;
    const perPlayerFee = grandTotal / parseInt(rosterSize);
    csv += 'BUDGET SUMMARY\n';
    csv += `Total Tournament Costs,${totalTournaments.toFixed(2)}\n`;
    csv += `Total Operations Costs,${totalOperations.toFixed(2)}\n`;
    csv += `Grand Total,${grandTotal.toFixed(2)}\n`;
    csv += `Per-Player Fee,${perPlayerFee.toFixed(2)}\n`;
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `WGYS_Budget_${teamName}_${seasonYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize on page load
init();