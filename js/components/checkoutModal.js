/**
 * Guruji VPN - Checkout & Payment Modal Component
 * Step-by-step payment flow supporting cards, UPI, and crypto with real state updates
 */

const CheckoutModal = {
    selectedPlanId: 'monthly',
    isOpen: false,
    selectedMethod: 'card',

    init() {
        this.render();
    },

    render() {
        let modal = document.getElementById('checkout-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'checkout-modal';
            document.body.appendChild(modal);
        }

        if (!this.isOpen) {
            modal.innerHTML = '';
            modal.className = 'hidden';
            return;
        }

        modal.className = 'fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn';

        const plan = CONFIG.PLANS.find(p => p.id === this.selectedPlanId) || CONFIG.PLANS[1];

        modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 modal-shadow border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <!-- Close Button -->
            <button
                onclick="CheckoutModal.close()"
                class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <!-- Header -->
            <div class="mb-6">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F3] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold mb-2">
                    Secure 256-bit Encrypted Checkout
                </div>
                <h3 class="text-2xl font-extrabold text-slate-900">
                    Complete Subscription
                </h3>
            </div>

            <!-- Order Summary Card -->
            <div class="bg-[#F7FCFA] border border-emerald-100 rounded-2xl p-4 sm:p-5 mb-6">
                <div class="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <div>
                        <div class="font-bold text-slate-900">${plan.name}</div>
                        <div class="text-xs text-slate-500">${plan.devices} Device${plan.devices > 1 ? 's' : ''} • Full exit node access</div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-extrabold text-emerald-600">${plan.currency}${plan.price}</div>
                        <div class="text-[11px] text-slate-500">${plan.period}</div>
                    </div>
                </div>
                <div class="pt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>Includes high-speed WireGuard bandwidth</span>
                    <span class="text-emerald-600 font-semibold">✓ Instant Activation</span>
                </div>
            </div>

            <!-- Payment Method Selection -->
            <div class="mb-6">
                <label class="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
                <div class="grid grid-cols-3 gap-2.5">
                    <button
                        type="button"
                        onclick="CheckoutModal.selectMethod('card')"
                        class="p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                            this.selectedMethod === 'card' ? 'border-2 border-emerald-500 bg-[#E6F8F3] text-emerald-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }"
                    >
                        <span class="text-base">💳</span>
                        <span>Credit / Debit</span>
                    </button>
                    <button
                        type="button"
                        onclick="CheckoutModal.selectMethod('upi')"
                        class="p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                            this.selectedMethod === 'upi' ? 'border-2 border-emerald-500 bg-[#E6F8F3] text-emerald-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }"
                    >
                        <span class="text-base">📱</span>
                        <span>UPI / QR</span>
                    </button>
                    <button
                        type="button"
                        onclick="CheckoutModal.selectMethod('crypto')"
                        class="p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                            this.selectedMethod === 'crypto' ? 'border-2 border-emerald-500 bg-[#E6F8F3] text-emerald-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }"
                    >
                        <span class="text-base">🪙</span>
                        <span>Crypto</span>
                    </button>
                </div>
            </div>

            <!-- Dynamic Payment Form -->
            <form id="checkout-form" onsubmit="CheckoutModal.handlePay(event)" class="space-y-4">
                ${this.renderMethodFields()}

                <button
                    type="submit"
                    id="pay-submit-btn"
                    class="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition transform active:scale-98"
                >
                    Pay ${plan.currency}${plan.price} & Activate Plan
                </button>
            </form>

            <div class="mt-4 text-center">
                <p class="text-[11px] text-slate-400">
                    🔒 Protected by 256-bit TLS encryption. 30-day money-back guarantee.
                </p>
            </div>

        </div>
        `;
    },

    renderMethodFields() {
        if (this.selectedMethod === 'card') {
            return `
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                    <input type="text" required placeholder="4242 •••• •••• 4242" class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 outline-none" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                        <input type="text" required placeholder="MM / YY" class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 outline-none" />
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">CVC / CVV</label>
                        <input type="text" required placeholder="123" class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 outline-none" />
                    </div>
                </div>
            `;
        } else if (this.selectedMethod === 'upi') {
            return `
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Virtual Payment Address (VPA / UPI ID)</label>
                    <input type="text" required placeholder="username@upi" class="w-full px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:border-emerald-600 outline-none" />
                    <p class="text-[11px] text-slate-500 mt-1">Supports Google Pay, PhonePe, Paytm, and BHIM.</p>
                </div>
            `;
        } else {
            return `
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
                    <p class="font-semibold text-slate-900 mb-1">Accepted Cryptocurrencies:</p>
                    <p class="text-slate-600">Bitcoin (BTC), Ethereum (ETH), USDT (TRC-20 & ERC-20), Monero (XMR).</p>
                    <p class="mt-2 text-slate-500 text-[11px]">Instant automated confirmation upon mempool inclusion.</p>
                </div>
            `;
        }
    },

    selectMethod(method) {
        this.selectedMethod = method;
        this.render();
    },

    open(planId = 'monthly') {
        this.selectedPlanId = planId;
        this.isOpen = true;
        this.render();
    },

    close() {
        this.isOpen = false;
        this.render();
    },

    async handlePay(e) {
        e.preventDefault();
        const plan = CONFIG.PLANS.find(p => p.id === this.selectedPlanId) || CONFIG.PLANS[1];
        const btn = document.getElementById('pay-submit-btn');

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `
                <span class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                    <span>Verifying with Payment Gateway...</span>
                </span>
            `;
        }

        try {
            const orderRes = await apiService.createPayment(plan.id, this.selectedMethod);
            const verifyRes = await apiService.verifyPayment(orderRes.orderId, 'pay_' + Date.now());

            // Ensure user is signed in
            if (!AppState.getState().isAuthenticated) {
                AppState.setState({
                    isAuthenticated: true,
                    user: {
                        id: 'usr_' + Date.now(),
                        name: 'Guruji Member',
                        email: 'user@gurujicorp.org',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GurujiCorp'
                    }
                });
            }

            Toast.show(`Success! ${plan.name} has been activated.`, 'success');
            this.close();
            window.location.hash = '#dashboard';
        } catch (err) {
            Toast.show(err.message || 'Payment failed. Please try again.', 'error');
            if (btn) {
                btn.disabled = false;
                btn.textContent = `Pay ${plan.currency}${plan.price} & Activate Plan`;
            }
        }
    }
};

window.CheckoutModal = CheckoutModal;
