import './styles/index.css';
import { fetchDashboardData } from './api.js';
import { store } from './store.js';
import { createAnimalCard } from './components/AnimalCard.js';
import { createToast } from './components/Toast.js';

// --- UI Syncing Functions ---

function updateConnectionStatus(isConnected) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('conn-text');
    if (!dot || !text) return;

    dot.style.background = isConnected ? 'var(--success)' : 'var(--danger)';
    dot.style.boxShadow = isConnected ? `0 0 10px var(--success)` : `0 0 10px var(--danger)`;
    text.textContent = isConnected ? 'CONNESSO' : 'ERRORE CONNESSIONE';
}

function renderAnimals(animals) {
    const grid = document.getElementById('animal-grid');
    if (!grid) return;

    if (!animals || animals.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-dim)">Nessun animale trovato.</p>';
        return;
    }

    grid.innerHTML = '';
    animals.forEach(animal => {
        grid.appendChild(createAnimalCard(animal, createToast));
    });
}

function renderInventory(inventory) {
    const invList = document.getElementById('inventory-list');
    if (!invList) return;

    if (!inventory || inventory.length === 0) {
        invList.innerHTML = '<p style="color: var(--text-dim)">Magazzino vuoto.</p>';
        return;
    }

    invList.innerHTML = inventory.map(item => {
        const isLow = (item.quantity || 0) <= 5;
        return `
      <div class="inventory-item">
        <div class="item-info">
          <p>${item.item_name}</p>
          <span class="item-stock">Disponibili: ${item.quantity}</span>
        </div>
        <span class="stock-level ${isLow ? 'low' : 'ok'}">${isLow ? 'SCARSO' : 'OTTIMO'}</span>
      </div>
    `;
    }).join('');
}

// --- Controller Logic ---

async function refreshData() {
    try {
        const data = await fetchDashboardData();
        store.setState({
            animals: data.animals || [],
            inventory: data.inventory || [],
            isConnected: true,
            lastUpdate: new Date()
        });
    } catch (err) {
        console.error('Fetch error:', err);
        store.setState({ isConnected: false });
        createToast('Errore nel recupero dati. Riprovo...', 'error');
    }
}

// Subscribe to store changes
store.subscribe((state) => {
    renderAnimals(state.animals);
    renderInventory(state.inventory);
    updateConnectionStatus(state.isConnected);
});

// Listen for refresh events (from components)
window.addEventListener('refresh-data', refreshData);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    refreshData();
    // Poll every 10 seconds
    setInterval(refreshData, 10000);
});
