document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Telegram WebApp
    if(window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
    }

    // Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Запуск модулей
    DrugsModule.init();
    SupportModule.init();
    NutritionModule.init();
    LabsModule.init();
    
    console.log('Bode Health v11.0 Loaded');
});
