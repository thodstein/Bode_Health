const LabsModule = {
    init() {
        this.calcFertility();
    },
    calcFertility() {
        // Mock расчет индекса фертильности (WHO 2021)
        const div = document.getElementById('fertilityIndex');
        div.innerHTML = `
            <h3>🧬 Индекс фертильности (IF)</h3>
            <p>Введите данные спермограммы для расчета.</p>
            <div style="background:rgba(59, 130, 246, 0.1); padding:10px; border-radius:6px">
                Прогноз восстановления: <strong>12 недель</strong> (стандартный цикл)
            </div>
        `;
    }
};
