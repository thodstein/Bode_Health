console.log("APP STARTING v99...");
const App = {
    data: { stack:[], plan:[], w:0, xp:0, ch:{liver:true,cardio:true,hemato:true} },
    init: function() {
        if(typeof DB==='undefined') { alert("DB Error"); return; }
        let sel=document.getElementById('sub-s');
        if(sel) {
            sel.innerHTML='';
            DB.substances.forEach(s=>{ let o=document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o); });
        }
        this.rSupport(); this.rShop(); this.rArt();
        console.log("APP INIT DONE");
    },
    tab: function(id) {
        document.querySelectorAll('.view').forEach(e=>e.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(e=>e.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.currentTarget.classList.add('active');
        if(id==='risks' && this.data.plan.length) this.drawChart();
    },
    loadEst: function() {
        let sub=document.getElementById('sub-s').value;
        let es=document.getElementById('est-s');
        es.innerHTML='';
        let list=DB.esters[sub];
        if(list) {
            es.disabled=false;
            list.forEach(e=>{ let o=document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+'d)'; es.appendChild(o); });
        } else es.disabled=true;
    },
    add: function() {
        let sub=document.getElementById('sub-s').value;
        let est=document.getElementById('est-s').value;
        let dose=parseFloat(document.getElementById('in-d').value);
        let st=parseInt(document.getElementById('in-st').value);
        let en=parseInt(document.getElementById('in-en').value);
        if(!dose||st>=en) return alert("Error");
        this.data.stack.push({sub,est,dose,start:st,end:en});
        this.rStack();
        document.getElementById('in-d').value='';
    },
    rStack: function() {
        let d=document.getElementById('stack-l'); d.innerHTML='';
        this.data.stack.forEach((it,i)=>{
            let s=DB.substances.find(x=>x.id===it.sub);
            let e=DB.esters[it.sub]?.find(x=>x.id===it.est);
            d.innerHTML+='<div class="item"><div><b>'+s.name+'</b> '+ (e?'('+e.name+')':'') +'<br>'+it.dose+'mg | '+it.start+'-'+it.end+'</div><button class="btn-del" onclick="App.data.stack.splice('+i+',1);App.rStack()">X</button></div>';
        });
    },
    calc: function() {
        if(!this.data.stack.length) return alert("Empty");
        this.data.plan=Eng.plan(this.data.stack);
        this.data.w=0;
        this.drawMap(); this.drawChart();
        document.getElementById('msg').innerText="Calculated: "+this.data.plan.length+" weeks";
        this.data.xp+=100; document.getElementById('xp').innerText="XP:"+this.data.xp;
    },
    chW: function(d) {
        if(!this.data.plan.length) return;
        this.data.w+=d;
        if(this.data.w<0) this.data.w=0;
        if(this.data.w>=this.data.plan.length) this.data.w=this.data.plan.length-1;
        this.drawMap();
    },
    drawMap: function() {
        if(!this.data.plan.length) return;
        let p=this.data.plan[this.data.w];
        document.getElementById('w-lbl').innerText="Week "+p.w;
        let c=document.getElementById('hm'); c.innerHTML='';
        for(let s in DB.risks) {
            c.innerHTML+='<div style="grid-column:1/-1;color:#bb86fc;font-weight:bold;margin-top:10px">'+s.toUpperCase()+'</div>';
            DB.risks[s].forEach(m=>{
                let v=p.r[s][m.id]||0;
                let el=document.createElement('div');
                el.className='hm-cell';
                el.style.background=Eng.col(v);
                el.style.color=v>50?'#000':'#fff';
                el.innerHTML='<b>'+m.n+'</b><br>'+v+'%';
                c.appendChild(el);
            });
        }
    },
    drawChart: function() {
        let ctx=document.getElementById('ch-c');
        if(!ctx||!this.data.plan.length) return;
        if(window.myC) window.myC.destroy();
        let lbs=this.data.plan.map(x=>'W'+x.w);
        let ds=[];
        let cols={liver:'#ff6384',cardio:'#36a2eb',hemato:'#ff9f40'};
        for(let k in this.data.ch) {
            if(this.data.ch[k]) {
                let d=this.data.plan.map(p=>{ let sum=0,cnt=0; for(let x in p.r[k]){sum+=p.r[k][x];cnt++;} return cnt?Math.round(sum/cnt):0; });
                ds.push({label:k,data:d,borderColor:cols[k],borderWidth:2,fill:false});
            }
        }
        window.myC=new Chart(ctx.getContext('2d'),{type:'line',data:{labels:lbs,datasets:ds},options:{responsive:true,plugins:{legend:{labels:{color:'#aaa'}}},scales:{y:{beginAtZero:true,max:100,ticks:{color:'#aaa'},grid:{color:'#333'}},x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}});
    },
    rSupport: function() {
        let d=document.getElementById('sup-l'); if(!d)return;
        DB.support.forEach(b=>{
            d.innerHTML+='<div class="time-block"><h3>'+b.t+'</h3>'+b.items.map(i=>'<div class="item" style="padding:10px;margin:5px 0"><b>'+i.n+'</b> '+i.d+'<br><small>'+i.m+'</small></div>').join('')+'</div>';
        });
    },
    rArt: function() {
        let d=document.getElementById('art-l'); if(!d)return;
        DB.articles.forEach(a=>d.innerHTML+='<div class="item"><b>'+a.t+'</b><br><small>'+a.c+'</small></div>');
    },
    rShop: function() {
        let d=document.getElementById('shop-l'); if(!d)return;
        for(let k in DB.shop) DB.shop[k].forEach(i=>d.innerHTML+='<div class="item"><b>'+k+'</b> '+i.p+' '+i.pr+'</div>');
    }
};
window.App=App;
document.addEventListener('DOMContentLoaded',()=>App.init());
console.log("APP SCRIPT LOADED v99");
