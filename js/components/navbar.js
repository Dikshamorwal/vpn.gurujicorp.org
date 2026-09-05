/**
 * Guruji VPN - Navbar Component
 * Handles sticky navigation, responsive mobile menu, active link detection, and auth actions
 */

const Navbar = {
    init() {
        this.render();
        this.bindEvents();
        this.subscribeState();
    },

    render() {
        const state = AppState.getState();
        const navContainer = document.getElementById('navbar-container');
        if (!navContainer) return;

        const authButtonsHtml = state.isAuthenticated ? `
            <div class="flex items-center gap-3">
                <a href="#dashboard" class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] text-emerald-800 text-xs font-semibold hover:bg-[#d5f5ec] transition">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Dashboard</span>
                </a>
                <div class="relative group">
                    <button id="user-menu-btn" class="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition">
                        <img src="${state.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guruji'}" alt="Avatar" class="w-8 h-8 rounded-full border border-emerald-400">
                        <span class="hidden lg:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">${state.user?.name || 'User'}</span>
                    </button>
                    <!-- Dropdown -->
                    <div class="hidden group-hover:block absolute right-0 top-full pt-2 w-48 z-50">
                        <div class="bg-[#06281E] border border-white/10 rounded-2xl soft-shadow p-2 text-xs text-white">
                            <div class="px-3 py-2 border-b border-white/10">
                                <p class="font-semibold text-white">${state.user?.name || 'User'}</p>
                                <p class="text-[11px] text-slate-400 truncate">${state.user?.email || 'user@example.com'}</p>
                            </div>
                            <a href="#dashboard" class="block px-3 py-2 text-slate-300 hover:bg-white/5 rounded-xl">Dashboard</a>
                            <button onclick="Navbar.handleLogout()" class="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 rounded-xl">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        ` : `
            <div class="flex items-center gap-3">
                <button
                    onclick="AuthModal.open('login')"
                    class="btn-header-login hidden sm:inline-flex"
                >
                    Log In
                </button>
                <button
                    onclick="AuthModal.open('signup')"
                    class="btn-header-signup inline-flex"
                >
                    Sign Up
                </button>
            </div>
        `;

        navContainer.innerHTML = `
        <header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 pt-4 pb-2">
            <div class="max-w-6xl mx-auto px-5 lg:px-6 h-16 sm:h-18 rounded-full bg-[#06281E]/92 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/25 flex items-center justify-between text-white">
                <!-- Logo -->
                <a href="#home" class="flex items-center gap-3 group">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition transform">
                        <svg width="20" height="24" viewBox="0 0 24 28" fill="none">
                            <path d="M12 1L21 5V13C21 19 17.5 24 12 27C6.5 24 3 19 3 13V5L12 1Z" fill="#06281E" />
                            <path d="M12 5V21" stroke="#00D5A5" stroke-width="2.5" />
                        </svg>
                    </div>
                    <div>
                        <div class="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight">
                            Guruji <span class="text-emerald-400">VPN</span>
                        </div>
                        <div class="text-[10px] text-slate-400 -mt-0.5 font-normal">
                            Powered by Tailscale
                        </div>
                    </div>
                </a>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-7 text-xs font-medium text-slate-200">
                    <a href="#home" class="nav-link py-1 text-emerald-400 font-bold relative">
                        Home
                        <span class="nav-indicator absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"></span>
                    </a>
                    <a href="#how-it-works" class="nav-link py-1 hover:text-emerald-400 text-slate-200 transition">How It Works</a>
                    <a href="#plans" class="nav-link py-1 hover:text-emerald-400 text-slate-200 transition">Plans</a>
                    <a href="#features" class="nav-link py-1 hover:text-emerald-400 text-slate-200 transition">Features</a>
                    <a href="#docs" class="nav-link py-1 hover:text-emerald-400 text-slate-200 transition">Docs</a>
                    <a href="#dashboard" class="nav-link py-1 hover:text-emerald-400 text-slate-200 transition">Dashboard</a>
                    <a href="#support" class="nav-link py-1 hover:text-emerald-400 text-slate-200 transition">Support</a>
                </nav>

                <!-- Auth Buttons / User Area -->
                <div class="flex items-center gap-2.5">
                    <div id="nav-auth-container">
                        ${authButtonsHtml}
                    </div>

                    <!-- Mobile Hamburger Button -->
                    <button id="mobile-menu-toggle" aria-label="Toggle navigation" class="md:hidden p-2 rounded-full text-white bg-white/10 hover:bg-white/20 border border-white/20 transition">
                        <svg id="hamburger-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        <svg id="close-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Drawer Menu -->
            <div id="mobile-menu" class="hidden md:hidden max-w-6xl mx-auto mt-2 bg-[#06281E]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-3 shadow-2xl text-white">
                <nav class="flex flex-col space-y-2 text-sm font-medium text-slate-300">
                    <a href="#home" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-emerald-400 font-semibold">Home</a>
                    <a href="#how-it-works" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white">How It Works</a>
                    <a href="#plans" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white">Plans</a>
                    <a href="#features" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white">Features</a>
                    <a href="#docs" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white">Docs</a>
                    <a href="#dashboard" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white">Dashboard</a>
                    <a href="#support" class="mobile-nav-link px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white">Support</a>
                </nav>

                <div class="pt-3 border-t border-white/10 flex gap-2.5">
                    ${!state.isAuthenticated ? `
                        <button onclick="AuthModal.open('login'); Navbar.closeMobileMenu();" class="flex-1 py-2.5 rounded-full border border-white/30 bg-white/10 text-white text-xs font-semibold text-center hover:bg-white/20 transition">
                            Log In
                        </button>
                        <button onclick="AuthModal.open('signup'); Navbar.closeMobileMenu();" class="flex-1 py-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-xs font-extrabold text-center hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-500/20 transition">
                            Sign Up
                        </button>
                    ` : `
                        <button onclick="Navbar.handleLogout(); Navbar.closeMobileMenu();" class="w-full py-2.5 rounded-full border border-red-500/40 text-red-400 text-xs font-semibold text-center hover:bg-red-500/10">
                            Sign Out (${state.user?.name || 'User'})
                        </button>
                    `}
                </div>
            </div>
        </header>
        `;
    },

    bindEvents() {
        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            if (header) {
                if (window.scrollY > 20) {
                    header.classList.add('pt-2');
                    header.classList.remove('pt-4');
                } else {
                    header.classList.add('pt-4');
                    header.classList.remove('pt-2');
                }
            }
        });

        // Mobile Menu Toggle
        document.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('#mobile-menu-toggle');
            if (toggleBtn) {
                const mobileMenu = document.getElementById('mobile-menu');
                const hamburger = document.getElementById('hamburger-icon');
                const closeIcon = document.getElementById('close-icon');

                if (mobileMenu) {
                    const isClosed = mobileMenu.classList.contains('hidden');
                    if (isClosed) {
                        mobileMenu.classList.remove('hidden');
                        hamburger?.classList.add('hidden');
                        closeIcon?.classList.remove('hidden');
                    } else {
                        mobileMenu.classList.add('hidden');
                        hamburger?.classList.remove('hidden');
                        closeIcon?.classList.add('hidden');
                    }
                }
            }

            if (e.target.closest('.mobile-nav-link')) {
                this.closeMobileMenu();
            }
        });
    },

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            hamburger?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
        }
    },

    async handleLogout() {
        await apiService.logout();
        Toast.show('You have been logged out safely.', 'info');
        this.render();
        Dashboard.render();
    },

    subscribeState() {
        AppState.subscribe(() => {
            this.render();
        });
    }
};

window.Navbar = Navbar;
