/**
 * Guruji VPN - Documentation Component
 * Getting Started guides, Platform-specific setups (Windows, Linux, macOS, Android, iOS), and Troubleshooting
 */

const Docs = {
    activePlatform: 'windows',

    platformsData: {
        windows: {
            title: 'Windows Setup Guide',
            description: 'Step-by-step setup for Windows 10 & 11 via Tailscale client.',
            steps: [
                {
                    title: '1. Download Tailscale for Windows',
                    content: 'Download the official installer from <a href="https://tailscale.com/download/windows" target="_blank" class="text-emerald-600 font-semibold underline">tailscale.com/download/windows</a> and run the <code>.exe</code> file.'
                },
                {
                    title: '2. Log in with your registered account',
                    content: 'Click the Tailscale icon in the system tray and log in using the email linked to your Guruji VPN subscription.'
                },
                {
                    title: '3. Select Guruji Exit Node',
                    content: 'Right-click the Tailscale tray icon → <strong>Exit Nodes</strong> → select <strong>Guruji VPN India</strong> (or your desired location).'
                },
                {
                    title: '4. Verify Connection',
                    content: 'Enable "Run Exit Node" and test your IP address. You are now securely tunneling through Guruji VPN.'
                }
            ],
            cliCommand: 'tailscale up --exit-node=in-mum-01 --accept-routes'
        },
        linux: {
            title: 'Linux (Ubuntu/Debian/Arch/Fedora)',
            description: 'Fast terminal setup using the official Tailscale package repository.',
            steps: [
                {
                    title: '1. Install Tailscale via curl script',
                    content: 'Run the one-line installer command in your terminal:'
                },
                {
                    title: '2. Authenticate & Connect to Exit Node',
                    content: 'Run the tailscale CLI command with your designated Guruji VPN exit node flag:'
                },
                {
                    title: '3. Check status',
                    content: 'Run <code>tailscale status</code> to verify your mesh network link and active exit node routing.'
                }
            ],
            cliCommand: 'curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --exit-node=in-mum-01'
        },
        macos: {
            title: 'macOS Setup Guide (Apple Silicon & Intel)',
            description: 'Install the native standalone app from the Mac App Store or Homebrew.',
            steps: [
                {
                    title: '1. Install Tailscale',
                    content: 'Install via Mac App Store or run <code>brew install --cask tailscale</code>.'
                },
                {
                    title: '2. Sign In',
                    content: 'Open Tailscale from the Menu Bar and authenticate with your Guruji account.'
                },
                {
                    title: '3. Choose Exit Node',
                    content: 'Click the Menu Bar icon → Exit Nodes → Choose <strong>Guruji-India-01</strong> and check <strong>Allow Local Network Access</strong>.'
                }
            ],
            cliCommand: '/Applications/Tailscale.app/Contents/MacOS/Tailscale up --exit-node=in-mum-01'
        },
        android: {
            title: 'Android (Phones & Tablets)',
            description: 'Simple mobile setup via Google Play Store.',
            steps: [
                {
                    title: '1. Install from Google Play',
                    content: 'Search for "Tailscale" in Google Play Store and install the official app.'
                },
                {
                    title: '2. Sign In',
                    content: 'Launch the app and log in with your account credentials.'
                },
                {
                    title: '3. Enable Exit Node',
                    content: 'Tap the three dots (⋮) in the top right → <strong>Exit Nodes</strong> → select <strong>Guruji VPN India</strong> → Toggle VPN switch ON.'
                }
            ],
            cliCommand: 'Available in Google Play Store & F-Droid'
        },
        ios: {
            title: 'iOS & iPadOS',
            description: 'Setup for iPhone and iPad via Apple App Store.',
            steps: [
                {
                    title: '1. Download from App Store',
                    content: 'Install Tailscale from the Apple App Store on your iPhone or iPad.'
                },
                {
                    title: '2. Allow VPN Configuration',
                    content: 'Open app, sign in, and tap "Allow" when iOS prompts to install VPN profiles.'
                },
                {
                    title: '3. Switch Exit Node',
                    content: 'Tap the top-right menu → Exit Nodes → Choose <strong>Guruji VPN India</strong> and flip the toggle switch to Connected.'
                }
            ],
            cliCommand: 'Available on the Apple App Store'
        }
    },

    troubleshootingList: [
        {
            q: 'VPN not connecting or stuck on "Starting..."',
            a: 'Ensure your device has an active internet connection. Try restarting the Tailscale background daemon or run <code>tailscale down</code> followed by <code>tailscale up</code>. Make sure no conflicting WireGuard or OpenVPN tunnels are actively taking precedence.'
        },
        {
            q: 'Exit node unavailable or grayed out',
            a: 'Exit nodes require an active Guruji VPN subscription. Visit your <a href="#dashboard" class="text-emerald-600 font-semibold underline">Dashboard</a> to check your subscription status. If your subscription is active, re-authenticate your Tailscale node key.'
        },
        {
            q: 'Slow connection speeds or high latency',
            a: 'Switch to a geographically closer exit node (e.g., India or Singapore for Asian regions, Germany for Europe, US for Americas). Check if local network throttling or firewall inspection is active on your router.'
        },
        {
            q: 'Tailscale authentication issues / Expired key',
            a: 'Tailscale node keys expire periodically for security. Simply log out from the Tailscale client application, re-authenticate via your Guruji registered email, and accept node approval.'
        }
    ],

    init() {
        this.render();
        this.bindEvents();
    },

    render() {
        const container = document.getElementById('docs-container');
        if (!container) return;

        const currentPlatformData = this.platformsData[this.activePlatform];

        const platformButtons = Object.keys(this.platformsData).map(key => {
            const isActive = this.activePlatform === key;
            const names = { windows: 'Windows', linux: 'Linux', macos: 'macOS', android: 'Android', ios: 'iOS' };
            return `
                <button
                    onclick="Docs.switchPlatform('${key}')"
                    class="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                        isActive
                            ? 'bg-[#0B0F17] text-white shadow-md'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }"
                >
                    ${names[key]}
                </button>
            `;
        }).join('');

        const stepsHtml = currentPlatformData.steps.map(s => `
            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 mb-3">
                <h4 class="font-bold text-slate-900 text-sm mb-1">${s.title}</h4>
                <div class="text-slate-600 text-xs sm:text-sm leading-relaxed">${s.content}</div>
            </div>
        `).join('');

        const troubleshootingHtml = this.troubleshootingList.map((item, idx) => `
            <div class="border border-slate-200/80 rounded-2xl overflow-hidden bg-white mb-3">
                <button
                    onclick="Docs.toggleAccordion(${idx})"
                    class="w-full text-left px-5 py-4 font-semibold text-slate-800 text-sm flex items-center justify-between hover:bg-slate-50 transition"
                >
                    <span>${item.q}</span>
                    <span id="accordion-arrow-${idx}" class="text-emerald-600 transition-transform transform">▼</span>
                </button>
                <div id="accordion-body-${idx}" class="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 hidden">
                    <div class="pt-3">${item.a}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
        <section id="docs" class="py-20 md:py-28 bg-white border-t border-slate-100">
            <div class="max-w-6xl mx-auto px-5 lg:px-8">
                
                <div class="text-center max-w-2xl mx-auto mb-16">
                    <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold mb-3">
                        📚 Documentation & Guides
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Quick Setup & Support Center
                    </h2>
                    <p class="mt-3 text-base text-slate-600">
                        Everything you need to connect Tailscale with Guruji VPN nodes across all major operating systems.
                    </p>
                </div>

                <!-- Getting Started 5-step Summary -->
                <div class="bg-[#F7FCFA] border border-emerald-100 rounded-3xl p-6 sm:p-8 soft-shadow mb-12">
                    <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center text-sm font-bold">🚀</span>
                        <span>Getting Started in 5 Simple Steps</span>
                    </h3>
                    <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 1</span>
                            <div class="font-bold text-sm text-slate-900 mt-1">Create Account</div>
                            <div class="text-xs text-slate-500 mt-1">Sign up with your email on Guruji VPN.</div>
                        </div>
                        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 2</span>
                            <div class="font-bold text-sm text-slate-900 mt-1">Install Tailscale</div>
                            <div class="text-xs text-slate-500 mt-1">Download app for your OS.</div>
                        </div>
                        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 3</span>
                            <div class="font-bold text-sm text-slate-900 mt-1">Join Network</div>
                            <div class="text-xs text-slate-500 mt-1">Log in using matching email.</div>
                        </div>
                        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 4</span>
                            <div class="font-bold text-sm text-slate-900 mt-1">Select Exit Node</div>
                            <div class="text-xs text-slate-500 mt-1">Pick India or global nodes.</div>
                        </div>
                        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 5</span>
                            <div class="font-bold text-sm text-slate-900 mt-1">Connect</div>
                            <div class="text-xs text-slate-500 mt-1">Browse safely with high speed.</div>
                        </div>
                    </div>
                </div>

                <!-- Platform Guides -->
                <div class="grid lg:grid-cols-12 gap-8 items-start">
                    
                    <!-- Left: OS Selector & Guide -->
                    <div class="lg:col-span-7">
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 soft-shadow">
                            <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span>Platform Installation Guides</span>
                            </h3>

                            <!-- Platform Switcher Buttons -->
                            <div class="flex flex-wrap gap-2 mb-6">
                                ${platformButtons}
                            </div>

                            <!-- Guide Content -->
                            <div class="border-t border-slate-100 pt-6">
                                <h4 class="text-lg font-bold text-slate-900">${currentPlatformData.title}</h4>
                                <p class="text-xs sm:text-sm text-slate-600 mb-6">${currentPlatformData.description}</p>

                                ${stepsHtml}

                                <!-- CLI Snippet if applicable -->
                                <div class="mt-6 bg-[#0B0F17] rounded-2xl p-4 text-white border border-white/10">
                                    <div class="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                                        <span>Quick Command / Terminal</span>
                                        <button
                                            onclick="Docs.copyCommand('${currentPlatformData.cliCommand.replace(/'/g, "\\'")}')"
                                            class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                    <pre class="text-xs sm:text-sm font-mono overflow-x-auto text-emerald-400">${currentPlatformData.cliCommand}</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Troubleshooting FAQs -->
                    <div class="lg:col-span-5">
                        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 soft-shadow">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span>Troubleshooting</span>
                                </h3>
                                <span class="text-xs px-3 py-1 bg-[#E6F8F3] text-emerald-800 font-semibold rounded-full border border-[#A7F3D0]">FAQs</span>
                            </div>

                            ${troubleshootingHtml}

                            <div class="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p class="text-xs text-slate-500 mb-3">Still facing issues? Our team is available 24/7.</p>
                                <a
                                    href="#support"
                                    class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition"
                                >
                                    <span>Contact 24/7 Help Desk</span>
                                    <span>→</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
        `;
    },

    switchPlatform(platformKey) {
        this.activePlatform = platformKey;
        this.render();
    },

    toggleAccordion(index) {
        const body = document.getElementById(`accordion-body-${index}`);
        const arrow = document.getElementById(`accordion-arrow-${index}`);
        if (body) {
            const isHidden = body.classList.contains('hidden');
            if (isHidden) {
                body.classList.remove('hidden');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        }
    },

    copyCommand(text) {
        navigator.clipboard.writeText(text).then(() => {
            Toast.show('Command copied to clipboard!', 'success');
        }).catch(() => {
            Toast.show('Failed to copy command.', 'error');
        });
    },

    bindEvents() {}
};

window.Docs = Docs;
