/**
 * Guruji VPN - User Dashboard Component
 * Clean, modern user control center for connection status, exit node selection, subscription, and devices
 */

const Dashboard = {
    init() {
        this.render();
        this.subscribeState();
    },

    render() {
        const container = document.getElementById('dashboard-container');
        if (!container) return;

        const { isAuthenticated, user, subscription, vpn, devices } = AppState.getState();
        const isConnected = vpn?.connected;
        const activeNode = vpn?.activeNode || CONFIG.EXIT_NODES[0];

        if (!isAuthenticated) {
            container.innerHTML = `
            <section id="dashboard" class="py-20 md:py-28 bg-[#F7FCFA] border-t border-emerald-100/60">
                <div class="max-w-4xl mx-auto px-5 lg:px-8 text-center">
                    <div class="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 soft-shadow">
                        <div class="w-16 h-16 rounded-2xl bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-5 border border-[#A7F3D0]">
                            🔒
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Member Control Dashboard
                        </h2>
                        <p class="mt-3 text-slate-600 max-w-md mx-auto text-sm sm:text-base">
                            Sign in to manage your active Tailscale exit node routing, view connected devices, and inspect subscription details.
                        </p>
                        <div class="mt-8 flex flex-wrap justify-center gap-4">
                            <button
                                onclick="AuthModal.open('login')"
                                class="px-7 py-3.5 rounded-full bg-[#0B0F17] text-white font-semibold hover:bg-black shadow-md shadow-black/10 transition"
                            >
                                Log In to Dashboard
                            </button>
                            <button
                                onclick="AuthModal.open('signup')"
                                class="px-7 py-3.5 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-emerald-50/50 transition"
                            >
                                Create Free Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            `;
            return;
        }

        const devicesListHtml = (devices || []).map(device => `
            <div class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/70 transition">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${device.icon}</span>
                    <div>
                        <div class="font-bold text-sm text-slate-900">${device.name}</div>
                        <div class="text-[11px] text-slate-500">${device.type} • Last active: ${device.lastActive}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        device.status === 'Active' || device.status === 'Connected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                    }">
                        ${device.status}
                    </span>
                </div>
            </div>
        `).join('');

        const nodesOptionsHtml = CONFIG.EXIT_NODES.map(node => {
            const isCurrent = node.id === activeNode.id;
            return `
                <button
                    onclick="Dashboard.switchNode('${node.id}')"
                    class="w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                        isCurrent
                            ? 'bg-[#E6F8F3] border-2 border-emerald-500 text-emerald-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }"
                >
                    <div class="flex items-center gap-2.5">
                        <span class="text-xl">${node.flag}</span>
                        <div>
                            <div class="text-xs sm:text-sm font-bold">${node.name}</div>
                            <div class="text-[11px] text-slate-500">Latency: ${node.latency} • Load: ${node.load}</div>
                        </div>
                    </div>
                    ${isCurrent ? '<span class="text-emerald-800 text-xs font-bold px-2.5 py-0.5 bg-emerald-200/80 rounded-full">Active</span>' : ''}
                </button>
            `;
        }).join('');

        container.innerHTML = `
        <section id="dashboard" class="py-20 md:py-28 bg-[#F7FCFA] border-t border-emerald-100/60">
            <div class="max-w-7xl mx-auto px-5 lg:px-8">
                
                <!-- Dashboard Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F3] text-emerald-800 text-xs font-semibold mb-2 border border-[#A7F3D0]">
                            Active Session
                        </div>
                        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Welcome back, ${user?.name || 'Guruji Member'}
                        </h2>
                        <p class="text-sm text-slate-600">Account: ${user?.email || 'user@example.com'}</p>
                    </div>

                    <div class="flex items-center gap-3">
                        <button
                            onclick="Dashboard.toggleConnection()"
                            id="vpn-main-toggle-btn"
                            class="px-6 py-3 rounded-full font-semibold text-sm transition shadow-sm flex items-center gap-2 ${
                                isConnected
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                            }"
                        >
                            <span class="w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-red-500' : 'bg-white'} animate-pulse"></span>
                            <span>${isConnected ? 'Disconnect VPN' : 'Connect VPN'}</span>
                        </button>
                        <button
                            onclick="Navbar.handleLogout()"
                            class="px-5 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-white text-sm font-semibold transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <!-- Main Grid -->
                <div class="grid lg:grid-cols-12 gap-8">
                    
                    <!-- Left: Connection & Exit Node Status (7 cols) -->
                    <div class="lg:col-span-7 space-y-6">
                        
                        <!-- Status Banner Card -->
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 soft-shadow">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl ${isConnected ? 'bg-[#E6F8F3] text-emerald-600 border border-[#A7F3D0]' : 'bg-slate-100 text-slate-400 border border-slate-200'} flex items-center justify-center text-3xl flex-shrink-0">
                                        ${isConnected ? '🛡️' : '⚪'}
                                    </div>
                                    <div>
                                        <div class="text-xs text-slate-500 font-medium uppercase tracking-wider">VPN Connection Status</div>
                                        <div class="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                                            <span class="${isConnected ? 'text-emerald-600' : 'text-slate-400'}">${isConnected ? 'Connected' : 'Disconnected'}</span>
                                            <span class="w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-left sm:text-right">
                                    <div class="text-xs text-slate-500 font-medium">Virtual Mesh IP</div>
                                    <div class="text-sm font-mono font-bold text-slate-800">${vpn.ipAddress}</div>
                                </div>
                            </div>

                            <!-- Connection Metrics -->
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                <div class="bg-[#F7FCFA] p-3.5 rounded-2xl border border-emerald-100/60">
                                    <div class="text-[11px] text-slate-500">Current Node</div>
                                    <div class="font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                                        <span>${activeNode.flag}</span>
                                        <span class="truncate">${activeNode.code}</span>
                                    </div>
                                </div>
                                <div class="bg-[#F7FCFA] p-3.5 rounded-2xl border border-emerald-100/60">
                                    <div class="text-[11px] text-slate-500">Latency</div>
                                    <div class="font-bold text-sm text-emerald-600 mt-1">${isConnected ? vpn.latency : '--'}</div>
                                </div>
                                <div class="bg-[#F7FCFA] p-3.5 rounded-2xl border border-emerald-100/60">
                                    <div class="text-[11px] text-slate-500">Download</div>
                                    <div class="font-bold text-sm text-slate-900 mt-1">${isConnected ? vpn.downloadSpeed : '0 Mbps'}</div>
                                </div>
                                <div class="bg-[#F7FCFA] p-3.5 rounded-2xl border border-emerald-100/60">
                                    <div class="text-[11px] text-slate-500">Uptime</div>
                                    <div class="font-bold text-sm text-slate-900 mt-1">${isConnected ? vpn.connectedSince : '0m'}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Exit Nodes Switcher -->
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 soft-shadow">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-bold text-slate-900">Change Exit Node</h3>
                                    <p class="text-xs text-slate-500">Select an optimized regional gateway for your outgoing traffic</p>
                                </div>
                                <span class="text-xs font-semibold text-emerald-800 bg-[#E6F8F3] border border-[#A7F3D0] px-3 py-1 rounded-full">
                                    ${CONFIG.EXIT_NODES.length} Available
                                </span>
                            </div>

                            <div class="grid sm:grid-cols-2 gap-3 mt-4">
                                ${nodesOptionsHtml}
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 soft-shadow">
                            <h3 class="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
                                <a href="#docs" class="p-3.5 rounded-2xl border border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-200 transition text-slate-700 flex flex-col items-center text-center gap-1.5">
                                    <span class="text-xl">📖</span>
                                    <span>Documentation</span>
                                </a>
                                <a href="#plans" class="p-3.5 rounded-2xl border border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-200 transition text-slate-700 flex flex-col items-center text-center gap-1.5">
                                    <span class="text-xl">💳</span>
                                    <span>Manage Plan</span>
                                </a>
                                <a href="#support" class="p-3.5 rounded-2xl border border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-200 transition text-slate-700 flex flex-col items-center text-center gap-1.5">
                                    <span class="text-xl">🎧</span>
                                    <span>Contact Support</span>
                                </a>
                            </div>
                        </div>

                    </div>

                    <!-- Right: Subscription & Devices (5 cols) -->
                    <div class="lg:col-span-5 space-y-6">
                        
                        <!-- Subscription Card -->
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 soft-shadow">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-bold text-slate-900">Subscription</h3>
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                    ${subscription.status}
                                </span>
                            </div>

                            <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg shadow-emerald-600/20 mb-5">
                                <div class="text-xs text-emerald-100 font-medium">Current Active Plan</div>
                                <div class="text-2xl font-extrabold mt-1">${subscription.plan}</div>
                                <div class="flex items-center justify-between text-xs text-emerald-100 mt-4 pt-3 border-t border-emerald-500/40">
                                    <span>Price: <strong>${subscription.price}</strong></span>
                                    <span>Expires: <strong>${subscription.expiry}</strong></span>
                                </div>
                            </div>

                            <button
                                onclick="CheckoutModal.open('yearly')"
                                class="w-full py-3.5 rounded-full border-2 border-emerald-600 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition"
                            >
                                Upgrade or Renew Plan
                            </button>
                        </div>

                        <!-- Devices Manager Card -->
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 soft-shadow">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-bold text-slate-900">Connected Devices</h3>
                                    <p class="text-xs text-slate-500">3 of 3 slots utilized</p>
                                </div>
                                <button
                                    onclick="Dashboard.handleAddDevice()"
                                    class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                >
                                    <span>+ Add</span>
                                </button>
                            </div>

                            <div class="space-y-2.5">
                                ${devicesListHtml}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
        `;
    },

    async toggleConnection() {
        const { vpn } = AppState.getState();
        if (vpn.connected) {
            await apiService.disconnectVpn();
            Toast.show('VPN disconnected successfully.', 'info');
        } else {
            await apiService.connectVpn(vpn.activeNode?.id || 'in-mum-01');
            Toast.show(`Connected to Guruji VPN (${vpn.activeNode?.name || 'India'})`, 'success');
        }
    },

    async switchNode(nodeId) {
        const result = await apiService.connectVpn(nodeId);
        Toast.show(result.message || 'Exit node switched successfully!', 'success');
    },

    handleAddDevice() {
        Toast.show('To add a new device, simply install Tailscale and log in with your email.', 'info');
    },

    subscribeState() {
        AppState.subscribe(() => {
            this.render();
        });
    }
};

window.Dashboard = Dashboard;
