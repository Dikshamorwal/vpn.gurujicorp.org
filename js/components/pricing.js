/**
 * Guruji VPN - Pricing Component
 * Exact pricing specifications: Trial ($1/7d), Monthly ($9/mo, popular), Yearly ($5/yr)
 */

const Pricing = {
    init() {
        this.render();
        this.subscribeState();
    },

    render() {
        const container = document.getElementById('pricing-container');
        if (!container) return;

        const currentSub = AppState.getState().subscription;

        container.innerHTML = `
        <section id="plans" class="py-20 md:py-28 bg-white border-t border-slate-100">
            <div class="max-w-6xl mx-auto px-5 lg:px-8">
                
                <!-- Header -->
                <div class="text-center max-w-2xl mx-auto">
                    <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold mb-3">
                        💎 Flexible Subscriptions
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Simple, Transparent Pricing
                    </h2>
                    <p class="mt-3 text-base text-slate-600">
                        Choose the plan that works best for you. No hidden fees or bandwidth throttling.
                    </p>
                </div>

                <!-- Pricing Cards Grid -->
                <div class="grid md:grid-cols-3 gap-8 mt-14 items-stretch">
                    
                    <!-- Trial Plan ($1 / 7 Days) -->
                    <div class="bg-white border border-slate-200 rounded-3xl p-8 pricing-shadow flex flex-col justify-between hover:border-emerald-300 transition duration-200">
                        <div>
                            <h3 class="text-center font-bold text-lg text-slate-900">
                                Trial Plan
                            </h3>
                            <div class="text-center mt-5">
                                <span class="text-5xl font-extrabold text-slate-900 tracking-tight">
                                    $1
                                </span>
                                <span class="text-sm font-medium text-slate-500 ml-1">
                                    / 7 Days
                                </span>
                            </div>

                            <ul class="mt-8 space-y-4 text-xs sm:text-sm text-slate-700">
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Full access to all 5 servers</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>1 Device</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>All WireGuard features included</span>
                                </li>
                            </ul>
                        </div>

                        <div class="mt-8">
                            <button
                                onclick="CheckoutModal.open('trial')"
                                class="w-full py-3.5 rounded-full border-2 border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition transform active:scale-98"
                            >
                                Start 7-Day Trial
                            </button>
                            <p class="text-center text-xs text-slate-500 mt-4">
                                No credit card required
                            </p>
                        </div>
                    </div>

                    <!-- Monthly Plan ($9 / Month - Most Popular) -->
                    <div class="relative bg-white border-2 border-emerald-500 rounded-3xl p-8 pricing-shadow-active flex flex-col justify-between transform md:-translate-y-2">
                        <!-- Most Popular Badge -->
                        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#06281E] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md border border-emerald-500/40">
                            Most Popular
                        </div>

                        <div>
                            <h3 class="text-center font-bold text-lg text-slate-900 mt-1">
                                Monthly Plan
                            </h3>
                            <div class="text-center mt-5">
                                <span class="text-5xl font-extrabold text-emerald-600 tracking-tight">
                                    $9
                                </span>
                                <span class="text-sm font-medium text-slate-500 ml-1">
                                    / Month
                                </span>
                            </div>

                            <ul class="mt-8 space-y-4 text-xs sm:text-sm text-slate-700">
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Full access to all 5 servers</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Up to 3 Devices</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>High speed & ultra-low latency</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>24/7 Dedicated Support</span>
                                </li>
                            </ul>
                        </div>

                        <div class="mt-8">
                            <button
                                onclick="CheckoutModal.open('monthly')"
                                class="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-600/25 transition transform active:scale-98"
                            >
                                Get Monthly Plan
                            </button>
                            <p class="text-center text-xs text-slate-500 mt-4">
                                Cancel anytime
                            </p>
                        </div>
                    </div>

                    <!-- Yearly Plan ($5 / Year) -->
                    <div class="bg-white border border-slate-200 rounded-3xl p-8 pricing-shadow flex flex-col justify-between hover:border-emerald-300 transition duration-200">
                        <div>
                            <h3 class="text-center font-bold text-lg text-slate-900">
                                Yearly Plan
                            </h3>
                            <div class="text-center mt-5">
                                <span class="text-5xl font-extrabold text-slate-900 tracking-tight">
                                    $5
                                </span>
                                <span class="text-sm font-medium text-slate-500 ml-1">
                                    / Year
                                </span>
                            </div>

                            <ul class="mt-8 space-y-4 text-xs sm:text-sm text-slate-700">
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Full access to all 5 servers</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Up to 3 Devices</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Best value for long term</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-5 h-5 rounded-full bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                                    <span>Priority Route Optimization</span>
                                </li>
                            </ul>
                        </div>

                        <div class="mt-8">
                            <button
                                onclick="CheckoutModal.open('yearly')"
                                class="w-full py-3.5 rounded-full border-2 border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition transform active:scale-98"
                            >
                                Get Yearly Plan
                            </button>
                            <p class="text-center text-xs text-slate-500 mt-4">
                                30-day money-back guarantee
                            </p>
                        </div>
                    </div>

                </div>

                <!-- Guarantee Banner -->
                <div class="mt-12 bg-[#F7FCFA] border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                    <div class="flex items-center gap-3.5">
                        <div class="w-10 h-10 rounded-full bg-[#E6F8F3] text-emerald-700 flex items-center justify-center text-lg flex-shrink-0 border border-[#A7F3D0]">
                            🛡️
                        </div>
                        <div>
                            <div class="font-bold text-sm text-slate-900">100% Risk-Free Guarantee</div>
                            <div class="text-xs text-slate-600">Try Guruji VPN with zero risk. Contact support if you need assistance at any time.</div>
                        </div>
                    </div>
                    <a href="#docs" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 whitespace-nowrap">
                        Explore setup guides →
                    </a>
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

window.Pricing = Pricing;
