import { feedPet } from '../api.js';
import { store } from '../store.js';

const EMOJIS = {
    dog: '🐕',
    cat: '🐈',
    fish: '🐟',
    bird: '🐦',
    rabbit: '🐇',
    default: '🐾'
};

export function createAnimalCard(animal, notify) {
    const score = animal.health_score || 0;
    const species = animal.species ? animal.species.toLowerCase() : 'default';
    const emoji = EMOJIS[species] || EMOJIS.default;
    const isHealthy = score > 50;

    const card = document.createElement('div');
    card.className = 'animal-card';
    card.innerHTML = `
    <div class="animal-header">
      <div class="animal-icon">${emoji}</div>
      <div class="animal-info">
        <h3>${animal.name}</h3>
        <span>${animal.species || 'Sconosciuto'}</span>
      </div>
    </div>
    <div class="health-section">
      <div class="health-meta">
        <span style="color: var(--text-dim)">Salute</span>
        <span style="font-weight: 700; color: ${isHealthy ? 'var(--success)' : 'var(--danger)'}">${score}%</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${score}%; background: ${isHealthy ? 'var(--success)' : 'var(--danger)'}"></div>
      </div>
    </div>
    <button class="btn-feed">NUTRI 🍖</button>
  `;

    const btn = card.querySelector('.btn-feed');
    btn.onclick = async () => {
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = '... 🍖';

        try {
            await feedPet(animal.id);
            notify('Animale nutrito con successo!', 'success');
            btn.textContent = 'FATTO! ✨';
            // Trigger a refresh after a short delay
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('refresh-data'));
            }, 1500);
        } catch (err) {
            notify('Errore durante il pasto.', 'error');
            btn.disabled = false;
            btn.textContent = originalText;
        }
    };

    return card;
}
