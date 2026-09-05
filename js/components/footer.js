/**
 * Guruji VPN - Footer Component
 * Matching reference design with validated newsletter subscription and quick links
 */

const Footer = {
    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('footer-container');
        if (!container) return;

        container.innerHTML = `
        <footer id="support" class="border-t border-slate-200 bg-white">
            <div class="max-w-7xl mx-auto px-5 lg:px-8 py-14">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

                    <!-- Brand Column -->
                    <div class="sm:col-span-2 md:col-span-1">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <svg width="22" height="26" viewBox="0 0 24 28" fill="none">
                                    <path d="M12 1L21 5V13C21 19 17.5 24 12 27C6.5 24 3 19 3 13V5L12 1Z" fill="#0B0F17" />
                                    <path d="M12 5V21" stroke="#00D5A5" stroke-width="2.5" />
                                </svg>
                            </div>
                            <div>
                                <div class="text-xl font-extrabold text-slate-900 tracking-tight">
                                    Guruji <span class="text-emerald-600">VPN</span>
                                </div>
                                <div class="text-[11px] text-slate-500">
                                    Powered by Tailscale
                                </div>
                            </div>
                        </div>

                        <p class="text-sm text-slate-600 leading-6 mt-5 max-w-xs">
                            Secure. Private. Limitless. Your gateway to a better, faster, and truly open internet experience.
                        </p>

                        <!-- Social Icons -->
                        <div class="flex gap-2.5 mt-5">
                            <a href="https://x.com" target="_blank" aria-label="X (Twitter)" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#E6F8F3] hover:text-emerald-700 text-slate-600 flex items-center justify-center font-bold text-sm transition">
                                𝕏
                            </a>
                            <a href="https://github.com" target="_blank" aria-label="GitHub" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#E6F8F3] hover:text-emerald-700 text-slate-600 flex items-center justify-center text-sm transition">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                            </a>
                            <a href="https://t.me" target="_blank" aria-label="Telegram" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#E6F8F3] hover:text-emerald-700 text-slate-600 flex items-center justify-center text-sm transition">
                                ➤
                            </a>
                            <a href="mailto:support@gurujicorp.org" aria-label="Email" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#E6F8F3] hover:text-emerald-700 text-slate-600 flex items-center justify-center text-sm transition">
                                ✉
                            </a>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h4 class="font-bold text-sm text-slate-900">
                            Quick Links
                        </h4>
                        <ul class="mt-5 space-y-3 text-sm text-slate-600">
                            <li><a href="#home" class="hover:text-emerald-600 transition">Home</a></li>
                            <li><a href="#how-it-works" class="hover:text-emerald-600 transition">How It Works</a></li>
                            <li><a href="#plans" class="hover:text-emerald-600 transition">Plans</a></li>
                            <li><a href="#features" class="hover:text-emerald-600 transition">Features</a></li>
                            <li><a href="#docs" class="hover:text-emerald-600 transition">Documentation</a></li>
                            <li><a href="#dashboard" class="hover:text-emerald-600 transition">User Dashboard</a></li>
                        </ul>
                    </div>

                    <!-- Resources -->
                    <div>
                        <h4 class="font-bold text-sm text-slate-900">
                            Resources
                        </h4>
                        <ul class="mt-5 space-y-3 text-sm text-slate-600">
                            <li><a href="#docs" class="hover:text-emerald-600 transition">Setup Guide</a></li>
                            <li><a href="#docs" class="hover:text-emerald-600 transition">FAQs</a></li>
                            <li><a href="javascript:void(0)" onclick="Footer.showPolicy('Privacy Policy')" class="hover:text-emerald-600 transition">Privacy Policy</a></li>
                            <li><a href="javascript:void(0)" onclick="Footer.showPolicy('Terms & Conditions')" class="hover:text-emerald-600 transition">Terms & Conditions</a></li>
                            <li><a href="javascript:void(0)" onclick="Footer.showPolicy('Refund Policy')" class="hover:text-emerald-600 transition">Refund Policy</a></li>
                        </ul>
                    </div>

                    <!-- Support -->
                    <div>
                        <h4 class="font-bold text-sm text-slate-900">
                            Support
                        </h4>
                        <ul class="mt-5 space-y-3 text-sm text-slate-600">
                            <li><a href="mailto:support@gurujicorp.org" class="hover:text-emerald-600 transition">Contact Us</a></li>
                            <li><a href="#docs" class="hover:text-emerald-600 transition">Support Center</a></li>
                            <li><a href="javascript:void(0)" onclick="Toast.show('All Guruji VPN Exit Nodes are 100% Operational (99.99% Uptime).', 'success')" class="hover:text-emerald-600 transition flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>Network Status</span>
                            </a></li>
                            <li><a href="mailto:abuse@gurujicorp.org" class="hover:text-emerald-600 transition">Report an Issue</a></li>
                        </ul>
                    </div>

                    <!-- Newsletter Form -->
                    <div>
                        <div class="bg-[#F7FCFA] border border-emerald-100 rounded-3xl p-5">
                            <h4 class="font-bold text-slate-900 text-sm">
                                Stay Updated
                            </h4>
                            <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
                                Subscribe to get updates and exclusive offers.
                            </p>

                            <form id="newsletter-form" onsubmit="Footer.handleSubscribe(event)" class="mt-4">
                                <input
                                    type="email"
                                    id="newsletter-email"
                                    placeholder="Enter your email"
                                    class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-full text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                />
                                <div id="newsletter-error" class="hidden text-red-500 text-[11px] mt-1.5 font-medium"></div>

                                <button
                                    type="submit"
                                    id="newsletter-btn"
                                    class="w-full mt-2.5 bg-[#0B0F17] hover:bg-black text-white py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-sm transition transform active:scale-98"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

                <!-- Bottom Copyright -->
                <div class="mt-12 pt-7 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                    <p>
                        © 2026 Guruji VPN. All rights reserved.
                    </p>
                    <p class="flex items-center gap-1">
                        Made with <span class="text-red-500">❤️</span> for a better, open internet
                    </p>
                </div>

            </div>
        </footer>
        `;
    },

    async handleSubscribe(e) {
        e.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        const errorDiv = document.getElementById('newsletter-error');
        const btn = document.getElementById('newsletter-btn');

        if (errorDiv) errorDiv.classList.add('hidden');

        const email = emailInput?.value?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            if (errorDiv) {
                errorDiv.textContent = 'Please enter your email address.';
                errorDiv.classList.remove('hidden');
            }
            return;
        }

        if (!emailRegex.test(email)) {
            if (errorDiv) {
                errorDiv.textContent = 'Please enter a valid email address.';
                errorDiv.classList.remove('hidden');
            }
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Subscribing...';
        }

        try {
            const res = await apiService.subscribeNewsletter(email);
            Toast.show(res.message || 'Thank you! You have been subscribed.', 'success');
            if (emailInput) emailInput.value = '';
        } catch (err) {
            Toast.show('Failed to subscribe. Please try again.', 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Subscribe';
            }
        }
    },

    showPolicy(title) {
        Toast.show(`${title} details: Guruji VPN enforces a zero-logs policy and protects user anonymity.`, 'info');
    }
};

window.Footer = Footer;
