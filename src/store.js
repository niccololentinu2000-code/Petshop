export const store = {
    state: {
        animals: [],
        inventory: [],
        isConnected: false,
        lastUpdate: null
    },

    listeners: [],

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    },

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    },

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
};
