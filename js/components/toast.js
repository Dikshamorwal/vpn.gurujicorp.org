/**
 * Guruji VPN - Tailwind Toast Notification Component
 * Replaces intrusive alert() popups with sleek, accessible Tailwind notifications
 */

const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'success', duration = 3500) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto transform transition-all duration-300 translate-y-2 opacity-0 flex items-center gap-3 p-4 rounded-2xl soft-shadow border text-sm font-medium ${this.getTypeStyles(type)}`;

        const icon = this.getIcon(type);

        toast.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${this.getIconBg(type)}">
                ${icon}
            </div>
            <div class="flex-1 text-slate-800 text-sm leading-snug">
                ${message}
            </div>
            <button class="text-slate-400 hover:text-slate-600 p-1 transition" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        // Auto dismiss
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-2', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    getTypeStyles(type) {
        switch (type) {
            case 'success':
                return 'bg-white border-emerald-200 text-slate-900 border-l-4 border-l-emerald-500';
            case 'error':
                return 'bg-white border-red-200 text-slate-900 border-l-4 border-l-red-500';
            case 'info':
            default:
                return 'bg-white border-emerald-200 text-slate-900 border-l-4 border-l-emerald-600';
        }
    },

    getIconBg(type) {
        switch (type) {
            case 'success': return 'bg-[#E6F8F3] text-emerald-600';
            case 'error': return 'bg-red-50 text-red-600';
            case 'info':
            default: return 'bg-[#E6F8F3] text-emerald-600';
        }
    },

    getIcon(type) {
        switch (type) {
            case 'success':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>`;
            case 'error':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            case 'info':
            default:
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        }
    }
};

window.Toast = Toast;
window.showToast = (msg, type) => Toast.show(msg, type);
