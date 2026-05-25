const App = {
    state: { stack:[], plan:[], weekIdx:0, charts:{liver:true,cardio:true,hemato:true} },
    init: function() {
        // Fill Substance Select
        const sel = document.getElementById('drug-substance');
        if(sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                const opt = document.createElement('option'); opt.value=s.id; opt.textContent=s.name; sel.appendChild(opt);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
    },
    switchTab: function(id) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.target.classList.add('active');
    },
    loadEsters: function() {
        const subId = document.getElementById('drug-substance').value;
        const estSel = document.getElementById('drug-ester');
        estSel.innerHTML = '';
        const esters = DB.esters[subId];
        if(esters && esters.length > 0) {
            estSel.disabled = false;
            esters.forEach(e => {
                const opt = document.createElement('option'); opt.value=e.id; opt.textContent=e.name+' ('+e.halfLife+'д)'; estSel.appendChild(opt);
            });
        } else { estSel.disabled = true; }
    },
    addDrug: function(e) {
        e.preventDefault();
        const sub = document.getElementById('drug-substance').value;
        const est = document.getElementById('drug-ester').value;
        const dose = parseFloat(document.getElementById('drug-dose').value);
        const start = parseInt(document.getElementById('drug-start').value);
        const end = parseInt(document.getElementById('drug-end').value);
        if(start >= end) return alert('Финиш должен быть больше старта!');
        this.state.stack.push({substanceId:sub, esterId:est, dose, startWeek:start, endWeek:end});
        this.renderStack();
        e.target.reset();
        document.getElementById('drug-ester').disabled = true;
        document.getElementById('drug-start').value = 1;
        document.getElementById('drug-end').value = 8;
    },
    renderStack: function() {
        const list = document.getElementById('stack-list'); list.innerHTML = '';
        this.state.stack.forEach((item, idx) => {
            const sub = DB.substances.find(s=>s.id===item.substanceId);
            const est = DB.esters[item.substanceId]?.find(e=>e.id===item.esterId);
            list.innerHTML += `<div class="drug-card"><div><b>${sub?.name}</b> ${est?'('+est.name+)':''}<br>${item.dose}мг | ${item.startWeek}-${item.endWeek} нед</div><button class="btn-delete" onclick="App.state.stack.splice(${idx},1);App.renderStack()">✕</button></div>`;
        });
    },
    generatePlan: function() {
        this.state.plan = Engine.generateWeeklyPlan(this.state.stack);
        this.state.weekIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6">Расчет на ${this.state.plan.length} недель</p>`;
        document.getElementById('dash-risk').textContent = Math.round(this.state.plan[0].risks.liver.cholestasis) + '%';
    },
    changeWeek: function(dir) {
        if(!this.state.plan.length) return;
        this.state.weekIdx += dir;
        if(this.state.weekIdx < 0) this.state.weekIdx = 0;
        if(this.state.weekIdx >= this.state.plan.length) this.state.weekIdx = this.state.plan.length-1;
        this.renderHeatmap();
    },
    toggleChart: function(sys) { this.state.charts[sys] = !this.state.charts[sys]; this.renderChart(); },
    renderHeatmap: function() {
        if(!this.state.plan.length) return;
        const data = this.state.plan[this.state.weekIdx];
        document.getElementById('week-display').textContent = 'Неделя '+data.week;
        const container = document.getElementById('heatmap'); container.innerHTML = '';
        for(let sys in DB.riskMatrix) {
            container.innerHTML += `<div style="grid-column:1/-1;color:#bb86fc;font-weight:bold;margin-top:10px">${sys.toUpperCase()}</div>`;
            DB.riskMatrix[sys].mechanisms.forEach(m => {
                const val = data.risks[sys][m.id]||0;
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.style.backgroundColor = Engine.getRiskColor(val);
                cell.style.color = val>50?'#000':'#fff';
                cell.innerHTML = `<div>${m.name}</div><b>${val}%</b>`;
                container.appendChild(cell);
            });
        }
    },
    renderChart: function() {
        const ctx = document.getElementById('risk-trend-chart');
        if(!ctx || !this.state.plan.length) return;
        if(window.riskChart) window.riskChart.destroy();
        const labels = this.state.plan.map(p=>'W'+p.week);
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum=0,cnt=0; for(let k in p.risks[sys]){sum+=p.risks[sys][k];cnt++;} return cnt?Math.round(sum/cnt):0;
                });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false});
            }
        }
        window.riskChart = new Chart(ctx, {type:'line', data:{labels, datasets}, options:{responsive:true, plugins:{legend:{labels:{color:'white'}}}, scales:{y:{ticks:{color:'#aaa'},grid:{color:'#333'}},x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}});
    },
    renderSupport: function() {
        const list = document.getElementById('support-list'); list.innerHTML = '';
        DB.supportProtocol.forEach(b => {
            list.innerHTML += `<div class="time-block"><h3>${b.title}</h3>${b.items.map(i=>`<div class="support-item"><b>${i.name}</b> ${i.dose}<br><small>${i.mechanism}</small></div>`).join('')}</div>`;
        });
    },
    calcFertility: function() {
        const v=parseFloat(document.getElementById('semen-vol').value)||0;
        const c=parseFloat(document.getElementById('semen-conc').value)||0;
        const res = Math.round((v/1.5)*20 + (c/16)*30);
        document.getElementById('fert-result').innerHTML = `<h3>IF: ${res}/100</h3>`;
    },
    renderArticles: function() {
        const list = document.getElementById('articles-list'); list.innerHTML = '';
        DB.articles.forEach(a => list.innerHTML += `<div class="drug-card"><b>${a.title}</b><br><small>${a.category} | 👁${a.views}</small></div>`);
    },
    renderShop: function() {
        const list = document.getElementById('shop-list'); list.innerHTML = '';
        for(let k in DB.shopItems) {
            DB.shopItems[k].forEach(i => list.innerHTML += `<div class="drug-card"><b>${k}</b><br>${i.platform} ${i.price} <a href="${i.url}" class="btn-primary" style="padding:5px;font-size:0.8em">Buy</a></div>`);
        }
    },
    renderGlossary: function() {
        const list = document.getElementById('glossary-list'); list.innerHTML = '';
        for(let k in DB.glossary) list.innerHTML += `<div class="drug-card"><b>${k}</b><p>${DB.glossary[k]}</p></div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => App.init());
