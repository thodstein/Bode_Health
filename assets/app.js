window.app = {
    init() {
        Store.init().then(() => {
            StackModule.init();
            NutritionModule.init();
            LabsModule.init();
            
            // Nav logic
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    btn.classList.add('active');
                    document.getElementById(btn.dataset.tab).classList.add('active');
                    
                    if(btn.dataset.tab === 'support') SupportModule.render(StackModule.items);
                });
            });
            
            // Telegram Init
            if(window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                document.body.style.backgroundColor = Telegram.WebApp.themeParams.bg_color || '#0f172a';
            }
            
            console.log('Bode Health v11 Ready');
        });
    },
    navigate(tabId) {
        document.querySelector(`[data-tab="${tabId}"]`).click();
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
