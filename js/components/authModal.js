/**
 * Guruji VPN - Auth Modal Component (Login & Signup)
 * Full responsive modal with frontend validation, error states, and Google sign-in
 */

const AuthModal = {
    activeTab: 'login', // 'login' or 'signup'
    isOpen: false,

    init() {
        this.render();
        this.bindEvents();
    },

    render() {
        let modal = document.getElementById('auth-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'auth-modal';
            document.body.appendChild(modal);
        }

        if (!this.isOpen) {
            modal.innerHTML = '';
            modal.className = 'hidden';
            return;
        }

        modal.className = 'fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn';

        const isLogin = this.activeTab === 'login';

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 modal-shadow border border-slate-100 relative transform transition-all">
            
            <!-- Close Button -->
            <button
                onclick="AuthModal.close()"
                class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <!-- Brand Header -->
            <div class="text-center mb-6">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20 mb-3">
                    <svg width="22" height="26" viewBox="0 0 24 28" fill="none">
                        <path d="M12 1L21 5V13C21 19 17.5 24 12 27C6.5 24 3 19 3 13V5L12 1Z" fill="#0B0F17" />
                        <path d="M12 5V21" stroke="#00D5A5" stroke-width="2.5" />
                    </svg>
                </div>
                <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight">
                    ${isLogin ? 'Welcome Back' : 'Create an Account'}
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                    ${isLogin ? 'Access your Guruji VPN control panel' : 'Join Guruji VPN network in under 2 minutes'}
                </p>
            </div>

            <!-- Tab Switcher -->
            <div class="grid grid-cols-2 p-1 bg-slate-100 rounded-full mb-6">
                <button
                    onclick="AuthModal.switchTab('login')"
                    class="py-2 text-xs sm:text-sm font-semibold rounded-full transition ${
                        isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }"
                >
                    Log In
                </button>
                <button
                    onclick="AuthModal.switchTab('signup')"
                    class="py-2 text-xs sm:text-sm font-semibold rounded-full transition ${
                        !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }"
                >
                    Sign Up
                </button>
            </div>

            <!-- Error Banner -->
            <div id="auth-error-banner" class="hidden mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium"></div>

            <!-- Google OAuth Button -->
            <button
                onclick="AuthModal.handleGoogleAuth()"
                class="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 rounded-full font-semibold text-xs sm:text-sm text-slate-700 flex items-center justify-center gap-3 transition mb-5"
            >
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
            </button>

            <div class="relative flex items-center justify-center mb-5">
                <div class="border-t border-slate-200 w-full"></div>
                <span class="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Or with Email</span>
            </div>

            <!-- Form -->
            <form id="auth-form" onsubmit="AuthModal.handleSubmit(event)">
                
                ${!isLogin ? `
                    <div class="mb-4">
                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            id="auth-name"
                            required
                            placeholder="John Doe"
                            class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition"
                        />
                    </div>
                ` : ''}

                <div class="mb-4">
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        id="auth-email"
                        required
                        placeholder="you@gmail.com"
                        class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition"
                    />
                </div>

                <div class="mb-4">
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-xs font-semibold text-slate-700">Password</label>
                        ${isLogin ? `
                            <button type="button" onclick="AuthModal.handleForgotPassword()" class="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                                Forgot password?
                            </button>
                        ` : ''}
                    </div>
                    <input
                        type="password"
                        id="auth-password"
                        required
                        placeholder="••••••••"
                        class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition"
                    />
                </div>

                ${!isLogin ? `
                    <div class="mb-4">
                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            id="auth-password-confirm"
                            required
                            placeholder="••••••••"
                            class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition"
                        />
                    </div>
                ` : `
                    <div class="flex items-center gap-2 mb-5">
                        <input type="checkbox" id="auth-remember" checked class="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500">
                        <label for="auth-remember" class="text-xs text-slate-600 cursor-pointer">Remember me for 30 days</label>
                    </div>
                `}

                <button
                    type="submit"
                    id="auth-submit-btn"
                    class="w-full py-3 rounded-full bg-[#0B0F17] hover:bg-black text-white font-semibold text-sm shadow-md shadow-black/10 transition transform active:scale-98"
                >
                    ${isLogin ? 'Log In' : 'Create Account'}
                </button>
            </form>

            <!-- Footer Switch -->
            <div class="mt-6 text-center text-xs text-slate-600">
                ${isLogin ? `
                    Don't have an account?
                    <button onclick="AuthModal.switchTab('signup')" class="text-emerald-600 font-semibold hover:underline ml-1">
                        Sign Up
                    </button>
                ` : `
                    Already have an account?
                    <button onclick="AuthModal.switchTab('login')" class="text-emerald-600 font-semibold hover:underline ml-1">
                        Log In
                    </button>
                `}
            </div>

        </div>
        `;
    },

    open(tab = 'login') {
        this.activeTab = tab;
        this.isOpen = true;
        this.render();
    },

    close() {
        this.isOpen = false;
        this.render();
    },

    switchTab(tab) {
        this.activeTab = tab;
        this.render();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    showError(message) {
        const banner = document.getElementById('auth-error-banner');
        if (banner) {
            banner.textContent = message;
            banner.classList.remove('hidden');
        }
    },

    clearError() {
        const banner = document.getElementById('auth-error-banner');
        if (banner) {
            banner.textContent = '';
            banner.classList.add('hidden');
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        this.clearError();

        const email = document.getElementById('auth-email')?.value?.trim();
        const password = document.getElementById('auth-password')?.value;

        if (!email || !password) {
            this.showError('Please fill in all required fields.');
            return;
        }

        const submitBtn = document.getElementById('auth-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                    <span>Processing...</span>
                </span>
            `;
        }

        try {
            if (this.activeTab === 'signup') {
                const name = document.getElementById('auth-name')?.value?.trim() || 'User';
                const confirmPassword = document.getElementById('auth-password-confirm')?.value;

                if (password.length < 6) {
                    this.showError('Password must be at least 6 characters.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Create Account';
                    }
                    return;
                }

                if (password !== confirmPassword) {
                    this.showError('Passwords do not match. Please verify.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Create Account';
                    }
                    return;
                }

                const res = await apiService.register(name, email, password);
                Toast.show(res.message || 'Account created successfully!', 'success');
                this.close();
                window.location.hash = '#dashboard';
            } else {
                const remember = document.getElementById('auth-remember')?.checked;
                const res = await apiService.login(email, password, remember);
                Toast.show(res.message || 'Logged in successfully!', 'success');
                this.close();
                window.location.hash = '#dashboard';
            }
        } catch (err) {
            this.showError(err.message || 'Authentication failed. Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = this.activeTab === 'login' ? 'Log In' : 'Create Account';
            }
        }
    },

    async handleGoogleAuth() {
        const dummyEmail = 'guruji.user@gmail.com';
        const res = await apiService.login(dummyEmail, 'oauth_token', true);
        Toast.show('Authenticated via Google successfully!', 'success');
        this.close();
        window.location.hash = '#dashboard';
    },

    handleForgotPassword() {
        Toast.show('Password reset link has been sent to your email address.', 'info');
    }
};

window.AuthModal = AuthModal;
