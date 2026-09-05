/**
 * Guruji VPN - State Management
 * Simple reactive store for managing application state across components
 */

class AppState {
    constructor() {
        this.listeners = [];
        this.state = this.loadInitialState();
    }

    loadInitialState() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        const storedSub = localStorage.getItem(CONFIG.STORAGE_KEYS.SUBSCRIPTION);
        const storedVpn = localStorage.getItem(CONFIG.STORAGE_KEYS.VPN_STATE);
        const storedNode = localStorage.getItem(CONFIG.STORAGE_KEYS.ACTIVE_NODE);
        const storedDevices = localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICES);

        return {
            isAuthenticated: !!token,
            user: storedUser ? JSON.parse(storedUser) : null,
            subscription: storedSub ? JSON.parse(storedSub) : {
                plan: 'Monthly Plan',
                status: 'Active',
                price: '$9/mo',
                expiry: '2026-10-02',
                autoRenew: true
            },
            vpn: storedVpn ? JSON.parse(storedVpn) : {
                connected: true,
                status: 'Connected',
                activeNode: storedNode ? JSON.parse(storedNode) : CONFIG.EXIT_NODES[0],
                ipAddress: '100.84.120.45',
                latency: '12 ms',
                downloadSpeed: '185.4 Mbps',
                uploadSpeed: '94.2 Mbps',
                connectedSince: '2 hours 15 mins'
            },
            devices: storedDevices ? JSON.parse(storedDevices) : [
                { id: 'dev-01', name: 'MacBook Pro 16"', type: 'Laptop', icon: '💻', status: 'Active', lastActive: 'Now' },
                { id: 'dev-02', name: 'Samsung Galaxy S24', type: 'Android Phone', icon: '📱', status: 'Connected', lastActive: '5m ago' },
                { id: 'dev-03', name: 'Home Office Workstation', type: 'Windows PC', icon: '🖥️', status: 'Offline', lastActive: 'Yesterday' }
            ]
        };
    }

    getState() {
        return this.state;
    }

    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.persist();
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (err) {
                console.error('Error in state subscriber:', err);
            }
        });
    }

    persist() {
        if (this.state.user) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(this.state.user));
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(this.state.subscription));
        localStorage.setItem(CONFIG.STORAGE_KEYS.VPN_STATE, JSON.stringify(this.state.vpn));
        localStorage.setItem(CONFIG.STORAGE_KEYS.ACTIVE_NODE, JSON.stringify(this.state.vpn.activeNode));
        localStorage.setItem(CONFIG.STORAGE_KEYS.DEVICES, JSON.stringify(this.state.devices));
    }
}

window.AppState = new AppState();
