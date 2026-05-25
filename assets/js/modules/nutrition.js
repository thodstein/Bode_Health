const NutritionModule = {
    init() {
        document.getElementById('voiceBtn').addEventListener('click', () => {
            const status = document.getElementById('voiceStatus');
            if(!('webkitSpeechRecognition' in window)) {
                alert('Голосовой ввод не поддерживается браузером');
                return;
            }
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'ru-RU';
            recognition.onstart = () => status.textContent = '🎤 Слушаю...';
            recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                document.getElementById('foodSearch').value = text;
                status.textContent = `Распознано: "${text}"`;
                this.search(text);
            };
            recognition.onerror = () => status.textContent = '❌ Ошибка';
            recognition.start();
        });
        
        document.getElementById('foodSearch').addEventListener('input', (e) => {
            if(e.target.value.length > 2) this.search(e.target.value);
        });
    },
    search(query) {
        // Mock поиск (в реальной версии API FatSecret)
        const results = document.getElementById('foodResults');
        results.innerHTML = `<p>Поиск: "${query}"... (Интеграция API в процессе)</p>
        <div class="drug-card"><div>Куриная грудка (100г)</div><div>110 ккал</div></div>
        <div class="drug-card"><div>Гречка (100г)</div><div>340 ккал</div></div>`;
    }
};
