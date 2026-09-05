/**
 * Guruji VPN - API Service Layer
 * Clean REST API client prepared for Flask + MongoDB backend with fallback simulation
 */

class ApiService {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
    }

    getAuthHeader() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...this.getAuthHeader(),
            ...options.headers
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // When Flask backend is not running, gracefully use the mock service layer
            // while logging in console for developer transparency
            console.warn(`[Guruji VPN API] Endpoint ${endpoint} unreachable or offline, using fallback mock response:`, error.message);
            return this.handleMockFallback(endpoint, options);
        }
    }

    // ==========================================
    // AUTHENTICATION ENDPOINTS
    // ==========================================

    async register(name, email, password) {
        return this.request(CONFIG.ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    }

    async login(email, password, remember = true) {
        return this.request(CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password, remember })
        });
    }

    async logout() {
        return this.request(CONFIG.ENDPOINTS.LOGOUT, {
            method: 'POST'
        });
    }

    // ==========================================
    // USER PROFILE & DATA ENDPOINTS
    // ==========================================

    async getUserProfile() {
        return this.request(CONFIG.ENDPOINTS.USER_PROFILE, {
            method: 'GET'
        });
    }

    async getSubscription() {
        return this.request(CONFIG.ENDPOINTS.USER_SUBSCRIPTION, {
            method: 'GET'
        });
    }

    async getDevices() {
        return this.request(CONFIG.ENDPOINTS.USER_DEVICES, {
            method: 'GET'
        });
    }

    // ==========================================
    // VPN ENDPOINTS
    // ==========================================

    async getVpnStatus() {
        return this.request(CONFIG.ENDPOINTS.VPN_STATUS, {
            method: 'GET'
        });
    }

    async getExitNodes() {
        return this.request(CONFIG.ENDPOINTS.VPN_EXIT_NODES, {
            method: 'GET'
        });
    }

    async connectVpn(nodeId) {
        return this.request(CONFIG.ENDPOINTS.VPN_CONNECT, {
            method: 'POST',
            body: JSON.stringify({ nodeId })
        });
    }

    async disconnectVpn() {
        return this.request(CONFIG.ENDPOINTS.VPN_DISCONNECT, {
            method: 'POST'
        });
    }

    // ==========================================
    // PAYMENT ENDPOINTS
    // ==========================================

    async createPayment(planId, paymentMethod = 'card') {
        return this.request(CONFIG.ENDPOINTS.PAYMENT_CREATE, {
            method: 'POST',
            body: JSON.stringify({ planId, paymentMethod })
        });
    }

    async verifyPayment(orderId, paymentId) {
        return this.request(CONFIG.ENDPOINTS.PAYMENT_VERIFY, {
            method: 'POST',
            body: JSON.stringify({ orderId, paymentId })
        });
    }

    // ==========================================
    // NEWSLETTER ENDPOINT
    // ==========================================

    async subscribeNewsletter(email) {
        return this.request(CONFIG.ENDPOINTS.NEWSLETTER_SUBSCRIBE, {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // ==========================================
    // REALISTIC MOCK FALLBACK HANDLER
    // (Used when backend is not deployed/offline)
    // ==========================================

    async handleMockFallback(endpoint, options = {}) {
        // Simulated network latency
        await new Promise(resolve => setTimeout(resolve, 300));
        const body = options.body ? JSON.parse(options.body) : {};

        switch (endpoint) {
            case CONFIG.ENDPOINTS.REGISTER: {
                const user = {
                    id: 'usr_' + Date.now(),
                    name: body.name || 'User',
                    email: body.email,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name || 'user')}`,
                    createdAt: new Date().toISOString()
                };
                const token = 'jwt_mock_token_' + Date.now();
                localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
                AppState.setState({ isAuthenticated: true, user });
                return { success: true, message: 'Account created successfully', user, token };
            }

            case CONFIG.ENDPOINTS.LOGIN: {
                const name = body.email.split('@')[0];
                const user = {
                    id: 'usr_active_01',
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    email: body.email,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
                    role: 'member'
                };
                const token = 'jwt_mock_token_' + Date.now();
                localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
                AppState.setState({ isAuthenticated: true, user });
                return { success: true, message: 'Logged in successfully', user, token };
            }

            case CONFIG.ENDPOINTS.LOGOUT: {
                localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                AppState.setState({ isAuthenticated: false, user: null });
                return { success: true, message: 'Logged out successfully' };
            }

            case CONFIG.ENDPOINTS.USER_PROFILE: {
                const state = AppState.getState();
                return { success: true, user: state.user };
            }

            case CONFIG.ENDPOINTS.USER_SUBSCRIPTION: {
                const state = AppState.getState();
                return { success: true, subscription: state.subscription };
            }

            case CONFIG.ENDPOINTS.USER_DEVICES: {
                const state = AppState.getState();
                return { success: true, devices: state.devices };
            }

            case CONFIG.ENDPOINTS.VPN_STATUS: {
                const state = AppState.getState();
                return { success: true, vpn: state.vpn };
            }

            case CONFIG.ENDPOINTS.VPN_EXIT_NODES: {
                return { success: true, nodes: CONFIG.EXIT_NODES };
            }

            case CONFIG.ENDPOINTS.VPN_CONNECT: {
                const targetNode = CONFIG.EXIT_NODES.find(n => n.id === body.nodeId) || CONFIG.EXIT_NODES[0];
                const newVpnState = {
                    connected: true,
                    status: 'Connected',
                    activeNode: targetNode,
                    ipAddress: '100.84.120.' + Math.floor(Math.random() * 200 + 10),
                    latency: targetNode.latency,
                    downloadSpeed: '185.4 Mbps',
                    uploadSpeed: '94.2 Mbps',
                    connectedSince: 'Just now'
                };
                AppState.setState({ vpn: newVpnState });
                return { success: true, message: `Connected to ${targetNode.name}`, vpn: newVpnState };
            }

            case CONFIG.ENDPOINTS.VPN_DISCONNECT: {
                const newVpnState = {
                    ...AppState.getState().vpn,
                    connected: false,
                    status: 'Disconnected',
                    ipAddress: 'Not Assigned',
                    latency: '--',
                    downloadSpeed: '0 Mbps',
                    uploadSpeed: '0 Mbps'
                };
                AppState.setState({ vpn: newVpnState });
                return { success: true, message: 'VPN Disconnected', vpn: newVpnState };
            }

            case CONFIG.ENDPOINTS.PAYMENT_CREATE: {
                const plan = CONFIG.PLANS.find(p => p.id === body.planId) || CONFIG.PLANS[1];
                return {
                    success: true,
                    orderId: 'ord_' + Math.random().toString(36).substr(2, 9),
                    amount: plan.price,
                    currency: 'USD',
                    plan: plan.name
                };
            }

            case CONFIG.ENDPOINTS.PAYMENT_VERIFY: {
                const newSubscription = {
                    plan: body.planName || 'Monthly Plan',
                    status: 'Active',
                    price: body.amount ? `$${body.amount}` : '$9/mo',
                    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    autoRenew: true
                };
                AppState.setState({ subscription: newSubscription });
                return { success: true, message: 'Subscription activated!', subscription: newSubscription };
            }

            case CONFIG.ENDPOINTS.NEWSLETTER_SUBSCRIBE: {
                return {
                    success: true,
                    message: 'Thank you! You have been subscribed to Guruji VPN updates.'
                };
            }

            default:
                return { success: true, message: 'Operation completed' };
        }
    }
}

window.apiService = new ApiService();
