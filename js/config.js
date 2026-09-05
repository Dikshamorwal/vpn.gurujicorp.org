/**
 * Guruji VPN - Configuration & Endpoints
 * Flask + MongoDB Ready Configuration
 */

const CONFIG = {
    APP_NAME: 'Guruji VPN',
    TAGLINE: 'Secure. Private. Limitless Internet.',
    POWERED_BY: 'Tailscale',
    
    // Backend API Base URL (Flask backend endpoint)
    // In production or local Flask server, this can be set to window.__API_BASE_URL__ or http://localhost:5000
    API_BASE_URL: window.__API_BASE_URL__ || 'http://localhost:5000',
    
    // API Route endpoints
    ENDPOINTS: {
        // Auth
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        
        // User Profile & Devices
        USER_PROFILE: '/api/user/profile',
        USER_SUBSCRIPTION: '/api/user/subscription',
        USER_DEVICES: '/api/user/devices',
        
        // VPN State & Exit Nodes
        VPN_STATUS: '/api/vpn/status',
        VPN_EXIT_NODES: '/api/vpn/exit-nodes',
        VPN_CONNECT: '/api/vpn/connect',
        VPN_DISCONNECT: '/api/vpn/disconnect',
        
        // Payments
        PAYMENT_CREATE: '/api/payment/create',
        PAYMENT_VERIFY: '/api/payment/verify',
        
        // Newsletter
        NEWSLETTER_SUBSCRIBE: '/api/newsletter/subscribe'
    },

    // Available Exit Nodes
    EXIT_NODES: [
        { id: 'in-mum-01', name: 'India (Mumbai)', code: 'India', flag: '🇮🇳', latency: '12 ms', load: '38%', status: 'optimal' },
        { id: 'sg-sin-01', name: 'Singapore', code: 'Singapore', flag: '🇸🇬', latency: '35 ms', load: '45%', status: 'optimal' },
        { id: 'us-nyc-01', name: 'United States (NY)', code: 'USA', flag: '🇺🇸', latency: '142 ms', load: '62%', status: 'normal' },
        { id: 'de-fra-01', name: 'Germany (Frankfurt)', code: 'Germany', flag: '🇩🇪', latency: '118 ms', load: '51%', status: 'normal' },
        { id: 'jp-tyo-01', name: 'Japan (Tokyo)', code: 'Japan', flag: '🇯🇵', latency: '85 ms', load: '40%', status: 'optimal' }
    ],

    // Default Pricing Plans (matching exact requested specs)
    PLANS: [
        {
            id: 'trial',
            name: 'Trial Plan',
            price: 1,
            currency: '$',
            period: '/ 7 Days',
            devices: 1,
            features: [
                'Full access to all servers',
                '1 Device',
                'All features included'
            ],
            cta: 'Start 7-Day Trial',
            popular: false,
            badge: null,
            subtext: 'No credit card required'
        },
        {
            id: 'monthly',
            name: 'Monthly Plan',
            price: 9,
            currency: '$',
            period: '/ Month',
            devices: 3,
            features: [
                'Full access to all servers',
                'Up to 3 Devices',
                'High speed & reliable'
            ],
            cta: 'Get Monthly Plan',
            popular: true,
            badge: 'Most Popular',
            subtext: 'Cancel anytime'
        },
        {
            id: 'yearly',
            name: 'Yearly Plan',
            price: 5,
            currency: '$',
            period: '/ Year',
            devices: 3,
            features: [
                'Full access to all servers',
                'Up to 3 Devices',
                'Best value for long term'
            ],
            cta: 'Get Yearly Plan',
            popular: false,
            badge: null,
            subtext: '30-day money-back guarantee'
        }
    ],

    // Storage keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'guruji_vpn_token',
        USER_DATA: 'guruji_vpn_user',
        SUBSCRIPTION: 'guruji_vpn_sub',
        VPN_STATE: 'guruji_vpn_state',
        ACTIVE_NODE: 'guruji_vpn_node',
        DEVICES: 'guruji_vpn_devices'
    }
};

window.CONFIG = CONFIG;
