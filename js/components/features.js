/**
 * Guruji VPN - Features Component
 * Dedicated 8-card grid highlighting performance, security, and Tailscale mesh capabilities
 */

const Features = {
    featuresList: [
        {
            icon: '🔒',
            title: 'Secure Encryption',
            description: 'State-of-the-art WireGuard® encryption protocol through Tailscale mesh, shielding all your private web traffic from eavesdroppers.'
        },
        {
            icon: '⚡',
            title: 'Fast Connections',
            description: 'Ultra-low latency routing with high-bandwidth 10Gbps exit nodes that maintain blazing download and streaming speeds.'
        },
        {
            icon: '🌐',
            title: 'Optimized Exit Nodes',
            description: 'Strategically located high-performance exit nodes worldwide, allowing you to route your traffic cleanly through preferred regions.'
        },
        {
            icon: '💻',
            title: 'Multi-device Support',
            description: 'Seamlessly protect all your personal hardware including macOS, Windows, Linux, Android, iOS, and router devices.'
        },
        {
            icon: '🚀',
            title: 'Easy Setup',
            description: 'No complicated firewall rules or ports to configure. Simply authenticate with Tailscale and switch exit nodes with one click.'
        },
        {
            icon: '🛡️',
            title: 'Privacy Focused',
            description: 'Strict zero-logging architecture. We never store browsing logs, connection timestamps, or DNS search records.'
        },
        {
            icon: '📶',
            title: 'Reliable Network',
            description: '99.9% uptime SLA powered by distributed mesh networking, self-healing routing paths, and redundant failover nodes.'
        },
        {
            icon: '🎧',
            title: '24/7 Support',
            description: 'Round-the-clock technical support from real networking engineers ready to help with setup, routing, and troubleshooting.'
        }
    ],

    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('features-container');
        if (!container) return;

        const cardsHtml = this.featuresList.map(feature => `
            <div class="bg-white border border-emerald-100/70 rounded-3xl p-7 soft-shadow hover:border-emerald-300 hover:-translate-y-1 transition duration-200 flex flex-col justify-start">
                <div class="w-12 h-12 rounded-2xl bg-[#E6F8F3] text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 mb-5 border border-[#A7F3D0]/60">
                    ${feature.icon}
                </div>
                <h3 class="text-lg font-bold text-slate-900 mb-2">
                    ${feature.title}
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    ${feature.description}
                </p>
            </div>
        `).join('');

        container.innerHTML = `
        <section id="features" class="py-20 md:py-28 bg-[#F7FCFA] border-t border-emerald-100/60">
            <div class="max-w-7xl mx-auto px-5 lg:px-8">
                
                <div class="text-center max-w-2xl mx-auto">
                    <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold mb-3">
                        🛡️ Enterprise-Grade Infrastructure
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Engineered for Speed, Privacy & Stability
                    </h2>
                    <p class="mt-3 text-base text-slate-600">
                        Everything you need from a modern VPN service, built on modern peer-to-peer mesh architecture.
                    </p>
                </div>

                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
                    ${cardsHtml}
                </div>

            </div>
        </section>
        `;
    }
};

window.Features = Features;
