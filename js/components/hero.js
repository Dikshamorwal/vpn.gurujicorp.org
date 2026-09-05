/**
 * Guruji VPN - Hero Component
 * Renders hero section with interactive connection illustration matching reference SaaS design
 */

const Hero = {
    init() {
        this.render();
        this.subscribeState();
    },

    render() {
        const container = document.getElementById('hero-container');
        if (!container) return;

        const { vpn } = AppState.getState();
        const isConnected = vpn?.connected;
        const activeNode = vpn?.activeNode || CONFIG.EXIT_NODES[0];

        container.innerHTML = `
        <section id="home" class="hero-bg pt-32 pb-20 md:pt-38 md:pb-24 overflow-hidden border-b border-emerald-100/60 relative">
            <div class="max-w-7xl mx-auto px-5 lg:px-8">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    <!-- LEFT COLUMN -->
                    <div>
                        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold mb-6 shadow-sm">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Next-Gen Mesh VPN Powered by Tailscale
                        </div>

                        <h1 class="text-4xl sm:text-5xl lg:text-[54px] leading-[1.12] font-extrabold tracking-tight text-slate-900">
                            Secure. Private.<br>
                            Limitless <span class="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">Internet.</span>
                        </h1>

                        <p class="mt-7 max-w-xl text-[16px] leading-7 text-slate-600">
                            Connect to our private network using Tailscale VPN and browse the internet through our optimized exit nodes with zero logging and top-tier WireGuard speed.
                        </p>

                        <!-- Buttons -->
                        <div class="mt-8 flex flex-wrap items-center gap-3.5">
                            <a
                                href="#plans"
                                class="btn-hero-primary inline-flex items-center gap-2.5"
                            >
                                <span>Get Started Now</span>
                                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>

                            <a
                                href="#docs"
                                class="btn-hero-secondary inline-flex items-center gap-2.5"
                            >
                                <span>View Documentation</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-emerald-600">
                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2.2"/>
                                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2.2"/>
                                </svg>
                            </a>
                        </div>

                        <!-- 4 Feature Highlights -->
                        <div class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/70">
                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 rounded-full bg-[#E6F8F3] border border-[#A7F3D0]/60 flex items-center justify-center text-emerald-600 text-base flex-shrink-0">
                                    🔒
                                </div>
                                <span class="text-xs font-semibold text-slate-700 leading-tight">
                                    End-to-end<br><span class="text-slate-500 font-normal">Encrypted</span>
                                </span>
                            </div>

                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 rounded-full bg-[#E6F8F3] border border-[#A7F3D0]/60 flex items-center justify-center text-emerald-600 text-base flex-shrink-0">
                                    ⚡
                                </div>
                                <span class="text-xs font-semibold text-slate-700 leading-tight">
                                    Blazing Fast<br><span class="text-slate-500 font-normal">Connections</span>
                                </span>
                            </div>

                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 rounded-full bg-[#E6F8F3] border border-[#A7F3D0]/60 flex items-center justify-center text-emerald-600 text-base flex-shrink-0">
                                    🌐
                                </div>
                                <span class="text-xs font-semibold text-slate-700 leading-tight">
                                    Optimized<br><span class="text-slate-500 font-normal">Exit Nodes</span>
                                </span>
                            </div>

                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 rounded-full bg-[#E6F8F3] border border-[#A7F3D0]/60 flex items-center justify-center text-emerald-600 text-base flex-shrink-0">
                                    🎧
                                </div>
                                <span class="text-xs font-semibold text-slate-700 leading-tight">
                                    24/7<br><span class="text-slate-500 font-normal">Support</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: INTERACTIVE CONNECTION DIAGRAM -->
                    <div class="relative h-[430px] w-full max-w-lg mx-auto select-none">
                        <!-- Dot Map Background -->
                        <div class="absolute inset-0 map-bg rounded-full scale-105 pointer-events-none"></div>

                        <!-- Top Node: Internet -->
                        <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                            <div class="bg-white rounded-2xl px-6 py-3.5 soft-shadow border border-emerald-100/80 text-center flex items-center gap-2.5">
                                <span class="text-2xl">🌐</span>
                                <div class="text-left">
                                    <div class="font-bold text-xs text-slate-900">Internet</div>
                                    <div class="text-[10px] text-slate-400 font-mono">Global Mesh</div>
                                </div>
                            </div>
                        </div>

                        <!-- Middle Badge: Guruji Encrypted Tunnel -->
                        <div class="absolute top-28 left-1/2 -translate-x-1/2 z-20">
                            <div class="bg-[#06281E] text-white border border-emerald-500/40 px-5 py-2 rounded-full shadow-xl shadow-emerald-950/20 font-semibold text-xs flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>🛡️ Guruji Encrypted Tunnel</span>
                            </div>
                        </div>

                        <!-- Connecting Dashed Lines -->
                        <!-- Vertical line from Internet to Tailscale -->
                        <div class="absolute top-14 left-1/2 w-0 h-14 border-l-2 border-dashed border-emerald-400 -translate-x-1/2"></div>
                        <!-- Vertical line from Tailscale to Laptop -->
                        <div class="absolute top-40 left-1/2 w-0 h-16 border-l-2 border-dashed ${isConnected ? 'border-emerald-400' : 'border-slate-300'} -translate-x-1/2"></div>
                        <!-- Left diagonal to Exit Node -->
                        <div class="absolute top-36 left-[18%] w-[32%] border-t-2 border-dashed ${isConnected ? 'border-emerald-400' : 'border-slate-300'} rotate-[-15deg] origin-right"></div>
                        <!-- Right diagonal to Device -->
                        <div class="absolute top-36 right-[18%] w-[32%] border-t-2 border-dashed ${isConnected ? 'border-emerald-400' : 'border-slate-300'} rotate-[15deg] origin-left"></div>

                        <!-- Left Node: Exit Node -->
                        <div class="absolute top-44 left-2 z-20">
                            <div class="bg-white rounded-2xl px-5 py-3.5 soft-shadow border border-emerald-100/80 text-center transition transform hover:scale-105">
                                <div class="text-2xl">${activeNode.flag}</div>
                                <div class="font-bold text-xs text-slate-800 mt-1">Exit Node</div>
                                <div class="text-[11px] font-semibold ${isConnected ? 'text-emerald-600' : 'text-slate-400'}">
                                    ${activeNode.code}
                                </div>
                            </div>
                        </div>

                        <!-- Right Node: Your Device -->
                        <div class="absolute top-44 right-2 z-20">
                            <div class="bg-white rounded-2xl px-5 py-3.5 soft-shadow border border-emerald-100/80 text-center transition transform hover:scale-105">
                                <div class="text-2xl">📱</div>
                                <div class="font-bold text-xs text-slate-800 mt-1">Your Device</div>
                                <div class="text-[11px] font-semibold ${isConnected ? 'text-emerald-600' : 'text-slate-400'}">
                                    ${isConnected ? 'Connected' : 'Disconnected'}
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Laptop Device Mockup -->
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
                            <div class="relative">
                                <!-- Screen Frame -->
                                <div class="w-[280px] sm:w-[300px] h-[175px] bg-[#06281E] rounded-t-2xl p-2.5 device-shadow border-t border-x border-slate-800">
                                    <!-- Inner Screen -->
                                    <div class="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
                                        <!-- Connection Status Circle -->
                                        <div class="w-11 h-11 rounded-full border-2 ${isConnected ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-300 bg-slate-50 text-slate-400'} flex items-center justify-center text-xl font-bold transition">
                                            ${isConnected ? '✓' : '✕'}
                                        </div>
                                        <div class="font-bold text-slate-900 text-sm mt-2">
                                            ${isConnected ? 'Connected' : 'Disconnected'}
                                        </div>
                                        <div class="text-[11px] text-slate-500 mt-0.5">
                                            ${isConnected ? 'Private • Secure • Unlimited' : 'Click Dashboard to Connect'}
                                        </div>
                                        <div class="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-[#E6F8F3] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                                            <span>${activeNode.name}</span>
                                            <span>•</span>
                                            <span>${isConnected ? vpn.latency : '--'}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Laptop Base Stand -->
                                <div class="w-[330px] sm:w-[350px] h-3 bg-slate-400 rounded-b-xl mx-auto shadow-md border-t border-slate-300"></div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
        `;
    },

    subscribeState() {
        AppState.subscribe(() => {
            this.render();
        });
    }
};

window.Hero = Hero;
