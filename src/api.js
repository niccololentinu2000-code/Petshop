const ENDPOINTS = {
    data: 'https://doloris-unrecalcitrant-vanna.ngrok-free.dev/webhook/petshop-data',
    feed: 'https://doloris-unrecalcitrant-vanna.ngrok-free.dev/webhook/petshop-feed'
};

const FETCH_CONFIG = {
    headers: { 'ngrok-skip-browser-warning': 'true' }
};

export async function fetchDashboardData() {
    const res = await fetch(ENDPOINTS.data, FETCH_CONFIG);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
}

export async function feedPet(id) {
    const res = await fetch(ENDPOINTS.feed, {
        ...FETCH_CONFIG,
        method: 'POST',
        headers: {
            ...FETCH_CONFIG.headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Feed failed');
    return true;
}
