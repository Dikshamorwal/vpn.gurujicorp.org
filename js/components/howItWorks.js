/**
 * Guruji VPN - How It Works Component
 * 4 step process matching reference SaaS design with mint/emerald accents
 */

const HowItWorks = {
    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('how-it-works-container');
        if (!container) return;

        container.innerHTML = `
        <section id="how-it-works" class="py-20 md:py-28 bg-[#F7FCFA] border-t border-emerald-100/60">
            <div class="max-w-6xl mx-auto px-5 lg:px-8">
                
                <div class="text-center max-w-2xl mx-auto">
                    <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold mb-3">
                        ⚡ Seamless Onboarding
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        How It Works
                    </h2>
                    <p class="mt-3 text-base text-slate-600">
                        Get started in just a few simple steps. No complex network configuration required.
                    </p>
                </div>

                <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-16 relative">
                    
                    <!-- Step 1 -->
                    <div class="text-center relative group">
                        <div class="mx-auto w-20 h-20 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-3xl shadow-sm text-emerald-600 group-hover:border-emerald-300 group-hover:scale-105 transition transform">
                            ↓
                        </div>
                        <div class="mt-4 inline-flex w-7 h-7 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold items-center justify-center shadow-md shadow-emerald-600/30">
                            1
                        </div>
                        <h3 class="font-bold text-base text-slate-900 mt-3">
                            Install Tailscale
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            Download and install Tailscale on your device.
                        </p>
                    </div>

                    <!-- Step 2 -->
                    <div class="text-center relative group">
                        <div class="mx-auto w-20 h-20 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-3xl shadow-sm text-emerald-600 group-hover:border-emerald-300 group-hover:scale-105 transition transform">
                            ✉
                        </div>
                        <div class="mt-4 inline-flex w-7 h-7 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold items-center justify-center shadow-md shadow-emerald-600/30">
                            2
                        </div>
                        <h3 class="font-bold text-base text-slate-900 mt-3">
                            Sign Up
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            Sign up with your Gmail account on our website.
                        </p>
                    </div>

                    <!-- Step 3 -->
                    <div class="text-center relative group">
                        <div class="mx-auto w-20 h-20 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-3xl shadow-sm text-emerald-600 group-hover:border-emerald-300 group-hover:scale-105 transition transform">
                            💳
                        </div>
                        <div class="mt-4 inline-flex w-7 h-7 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold items-center justify-center shadow-md shadow-emerald-600/30">
                            3
                        </div>
                        <h3 class="font-bold text-base text-slate-900 mt-3">
                            Choose a Plan
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            Select a plan and complete your payment.
                        </p>
                    </div>

                    <!-- Step 4 -->
                    <div class="text-center relative group">
                        <div class="mx-auto w-20 h-20 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-3xl shadow-sm text-emerald-600 group-hover:border-emerald-300 group-hover:scale-105 transition transform">
                            ✓
                        </div>
                        <div class="mt-4 inline-flex w-7 h-7 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold items-center justify-center shadow-md shadow-emerald-600/30">
                            4
                        </div>
                        <h3 class="font-bold text-base text-slate-900 mt-3">
                            Connect & Browse
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            Connect using the provided instructions and enjoy secure browsing!
                        </p>
                    </div>

                </div>

            </div>
        </section>
        `;
    }
};

window.HowItWorks = HowItWorks;
