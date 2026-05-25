const UI = {
  data: { stack:[], plan:[], wk:0, ch:{liv:true,car:true,hem:true} },
  init: function() {
    const s = document.getElementById('sel-sub');
    if(s) {
      s.innerHTML = '';
      DB_DATA.substances.forEach(x => {
        const o = document.createElement('option'); o.value=x.id; o.innerText=x.name; s.appendChild(o);
      });
    }
    this.renderSup(); this.renderArt(); this.renderShop(); this.renderGlos();
  },
  tab: function(id) {
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },
  loadEst: function() {
    const sub = document.getElementById('sel-sub').value;
    const sel = document.getElementById('sel-est');
    sel.innerHTML = '';
    const list = DB_DATA.esters[sub];
    if(list && list.length) {
      sel.disabled = false;
      list.forEach(x => { const o=document.createElement('option'); o.value=x.id; o.innerText=x.n+' ('+x.h+'д)'; sel.appendChild(o); });
    } else { sel.disabled = true; }
  },
  addDrug: function(e) {
    e.preventDefault();
    const sub = document.getElementById('sel-sub').value;
    const est = document.getElementById('sel-est').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    if(start >= end) return alert('Ошибка недель');
    this.data.stack.push({sub:sub, est:est, dose:dose, start:start, end:end});
    this.rStack();
    e.target.reset();
    document.getElementById('sel-est').disabled = true;
    document.getElementById('in-start').value = 1;
    document.getElementById('in-end').value = 8;
  },
  rStack: function() {
    const d = document.getElementById('list-stack'); d.innerHTML = '';
    this.data.stack.forEach((x,i) => {
      const s = DB_DATA.substances.find(z=>z.id===x.sub);
      const eList = DB_DATA.esters[x.sub];
      const e = eList ? eList.find(z=>z.id===x.est) : null;
      d.innerHTML += '<div class="item"><b>'+s.name+'</b> '+(e?e.n:'')+'<br>'+x.dose+'мг | '+x.start+'-'+x.end+' нед <button onclick="UI.data.stack.splice('+i+',1);UI.rStack()">✕</button></div>';
    });
  },
  calc: function() {
    this.data.plan = EngineCore.genPlan(this.data.stack);
    this.data.wk = 0;
    this.rHeat(); this.rChart();
    document.getElementById('out-plan').innerHTML = '<p style="color:#03dac6">Курс: '+this.data.plan.length+' нед</p>';
    if(this.data.plan[0]) document.getElementById('d-risk').innerText = Math.round(this.data.plan[0].r.liver.chol)+'%';
  },
  wk: function(dir) {
    if(!this.data.plan.length) return;
    this.data.wk += dir;
    if(this.data.wk<0) this.data.wk=0;
    if(this.data.wk>=this.data.plan.length) this.data.wk=this.data.plan.length-1;
    this.rHeat();
  },
  togChart: function(k) { this.data.ch[k] = !this.data.ch[k]; this.rChart(); },
  rHeat: function() {
    if(!this.data.plan.length) return;
    const p = this.data.plan[this.data.wk];
    document.getElementById('wk-txt').innerText = 'W'+p.w;
    const c = document.getElementById('heat'); c.innerHTML = '';
    for(let sys in DB_DATA.risks) {
      c.innerHTML += '<div class="h-head">'+sys.toUpperCase()+'</div>';
      DB_DATA.risks[sys].forEach(m => {
        const v = p.r[sys][m.id]||0;
        const d = document.createElement('div');
        d.className = 'h-cell';
        d.style.backgroundColor = EngineCore.getColor(v);
        d.style.color = v>50?'#000':'#fff';
        d.innerHTML = '<div>'+m.n+'</div><b>'+v+'%</b>';
        c.appendChild(d);
      });
    }
  },
  rChart: function() {
    const ctx = document.getElementById('chart-r');
    if(!ctx || !this.data.plan.length) return;
    if(window.gChart) window.gChart.destroy();
    const lbs = this.data.plan.map(x=>'W'+x.w);
    const ds = [];
    const cols = {liv:'#ff6384', car:'#36a2eb', hem:'#ff9f40'};
    const names = {liv:'Печень', car:'Сердце', hem:'Кровь'};
    for(let k in this.data.ch) {
      if(this.data.ch[k]) {
        const dt = this.data.plan.map(x => {
          let sum=0,cnt=0; for(let z in x.r[k]){sum+=x.r[k][z];cnt++;} return cnt?Math.round(sum/cnt):0;
        });
        ds.push({label:names[k], data:dt, borderColor:cols[k], borderWidth:2, fill:false});
      }
    }
    window.gChart = new Chart(ctx, {type:'line', data:{labels:lbs, datasets:ds}, options:{responsive:true, plugins:{legend:{labels:{color:'#fff'}}}, scales:{y:{ticks:{color:'#aaa'},grid:{color:'#333'}},x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}});
  },
  renderSup: function() {
    const d = document.getElementById('list-sup'); d.innerHTML = '';
    DB_DATA.support.forEach(b => {
      d.innerHTML += '<div class="blk"><h3>'+b.t+'</h3>'+b.items.map(i=>'<div class="item"><b>'+i.n+'</b> '+i.d+'<br><small>'+i.m+'</small></div>').join('')+'</div>';
    });
  },
  fert: function() {
    const v=parseFloat(document.getElementById('lab-v').value)||0;
    const c=parseFloat(document.getElementById('lab-c').value)||0;
    const res = Math.round((v/1.5)*20 + (c/16)*30);
    document.getElementById('res-fert').innerHTML = '<h3>IF: '+res+'/100</h3>';
  },
  renderArt: function() {
    const d = document.getElementById('list-art'); d.innerHTML = '';
    DB_DATA.articles.forEach(a => d.innerHTML += '<div class="item"><b>'+a.t+'</b><br><small>'+a.c+' | 👁'+a.v+'</small></div>');
  },
  renderShop: function() {
    const d = document.getElementById('list-shop'); d.innerHTML = '';
    for(let k in DB_DATA.shop) {
      DB_DATA.shop[k].forEach(i => d.innerHTML += '<div class="item"><b>'+k+'</b><br>'+i.p+' '+i.pr+' <a href="'+i.u+'" class="btn-s">Buy</a></div>');
    }
  },
  renderGlos: function() {
    const d = document.getElementById('list-glos'); d.innerHTML = '';
    for(let k in DB_DATA.glossary) d.innerHTML += '<div class="item"><b>'+k+'</b><p>'+DB_DATA.glossary[k]+'</p></div>';
  }
};
window.addEventListener('DOMContentLoaded', () => UI.init());
