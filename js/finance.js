// ── ФИНАНСЫ ──
let _financeTab='overview'; // 'overview' | 'debts' | 'payments' | 'analytics'

function switchFinanceTab(tab){
  _financeTab=tab;
  // Подсветка активной вкладки в сегмент-баре
  ['overview','debts','payments','analytics'].forEach(k=>{
    const b=document.getElementById('finTab_'+k);if(!b)return;
    const on=k===tab;
    b.style.background=on?'rgba(201,170,124,.15)':'transparent';
    b.style.color=on?'var(--gold)':'var(--text3)';
    b.style.boxShadow=on?'0 1px 4px rgba(0,0,0,.25)':'none';
  });
  _finRenderObjSel();
  const body=document.getElementById('financeBody');
  if(!body)return;
  if(tab==='overview')renderFinanceOverview(body);
  else if(tab==='debts')renderFinanceDebts(body);
  else if(tab==='analytics')renderFinanceAnalytics(body);
  else renderFinancePayments(body);
}
function _finRenderObjSel(){
  const el=document.getElementById('finObjSel');if(!el)return;
  const objs=db.objects||[];
  if(objs.length<2){el.innerHTML='';return;}
  el.innerHTML=`<div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px">${objs.map(ob=>{const isA=ob.id===_financeObjId;return`<button onclick="_financeObjId='${ob.id}';_finRenderObjSel();switchFinanceTab(_financeTab)" style="display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:20px;border:1px solid ${isA?'rgba(201,170,124,.4)':'var(--border)'};background:${isA?'rgba(201,170,124,.1)':'var(--bg2)'};color:${isA?'var(--gold)':'var(--text3)'};font-size:12px;font-weight:${isA?'700':'500'};font-family:Mulish,sans-serif;cursor:pointer;white-space:nowrap;flex-shrink:0"><span>${ob.icon||'🏗'}</span><span>${ob.name}</span></button>`;}).join('')}</div>`;
}

let _financeObjId=null;

function renderFinanceOverview(body){
  const objs=db.objects||[];
  if(!objs.length){body.innerHTML=`<div style="text-align:center;padding:48px 0;color:var(--text3)">${lang==='ru'?'Нет объектов':'No projects'}</div>`;return;}
  // Используем активный объект или первый
  if(!_financeObjId||!objs.find(o=>o.id===_financeObjId))_financeObjId=(db.activeObjectId&&objs.find(o=>o.id===db.activeObjectId))?db.activeObjectId:objs[0].id;
  const o=objs.find(x=>x.id===_financeObjId)||objs[0];
  const stages=o.stages||[];
  const spent=stages.reduce((a,s)=>a+stageFact(s),0);
  const budget=o.totalBudget||0;
  const oDebt=stages.reduce((a,s)=>(s.positions||[]).reduce((b,p)=>(p.works||[]).reduce((c,w)=>c+Math.max(0,(w.contractAmount||0)-(w.paid||0)),b),a),0);
  const spentPct=budget>0?Math.min(spent/budget*100,100):0;
  const isOver=budget>0&&spent>budget;
  const stagesActive=stages.filter(s=>s.status==='active').length;
  const stagesDone=stages.filter(s=>s.status==='done').length;
  // Работы vs Материалы
  const spentWorks=stages.reduce((a,s)=>(s.positions||[]).reduce((b,p)=>(p.works||[]).reduce((c,w)=>c+(w.paid||0),b),a),0);
  const spentMats=stages.reduce((a,s)=>(s.positions||[]).reduce((b,p)=>(p.mats||[]).reduce((c,m)=>c+(m.qty||0)*(m.price||0),b),a),0);
  const spentTotal=spentWorks+spentMats||1;
  const worksPct=Math.round(spentWorks/spentTotal*100);
  const matsPct=100-worksPct;

  // Переключатель объектов
  const objSelector=objs.length>1?`<div style="display:flex;gap:6px;margin-bottom:14px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none">
    ${objs.map(ob=>{
      const isActive=ob.id===o.id;
      return`<button onclick="_financeObjId='${ob.id}';renderFinanceOverview(document.getElementById('financeBody'))" style="display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:20px;border:1px solid ${isActive?'rgba(201,170,124,.4)':'var(--border)'};background:${isActive?'rgba(201,170,124,.1)':'var(--bg2)'};color:${isActive?'var(--gold)':'var(--text3)'};font-size:12px;font-weight:${isActive?'700':'500'};font-family:Mulish,sans-serif;cursor:pointer;white-space:nowrap;flex-shrink:0">
        <span>${ob.icon||'🏗'}</span><span>${ob.name}</span>
      </button>`;
    }).join('')}
  </div>`:'' ;

  // Аккордеон этапов
  if(!window._finExp)window._finExp=new Set();
  const STATUS_LABEL={done:lang==='ru'?'Готово':'Done',active:lang==='ru'?'В работе':'Active',idle:lang==='ru'?'Не начат':'Idle'};
  const stagesCards=stages.map(s=>{
    const sFact=stageFact(s);
    const sSmeta=stageSmeta(s);
    const sPct=sSmeta>0?Math.min(sFact/sSmeta*100,100):0;
    const sOver=sSmeta>0&&sFact>sSmeta;
    const sDebt=(s.positions||[]).reduce((a,p)=>(p.works||[]).reduce((b,w)=>b+Math.max(0,(w.contractAmount||0)-(w.paid||0)),a),0);
    const isDone=s.status==='done';
    const isActive=s.status==='active';
    const col=isDone?'var(--green)':isActive?s.color||'var(--gold)':'var(--text3)';
    const isExp=window._finExp.has(s.id);

    // Детальное содержимое
    const allWorks=[];const allMats=[];
    (s.positions||[]).forEach(p=>{
      (p.works||[]).filter(w=>(w.contractAmount||0)>0).forEach(w=>allWorks.push({...w,posName:p.name}));
      (p.mats||[]).filter(m=>((m.qty||0)*(m.price||0))>0).forEach(m=>allMats.push({...m,posName:p.name}));
    });
    const detailHtml=isExp?`<div style="border-top:1px solid var(--border);margin:0 14px"></div>
      <div style="padding:10px 14px 13px;animation:slideDown .22s cubic-bezier(.4,0,.2,1)">
        ${allWorks.length?`<div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">${lang==='ru'?'Работы':'Works'}</div>
        ${allWorks.map(w=>{
          const wDebt=Math.max(0,(w.contractAmount||0)-(w.paid||0));
          const wPct=w.contractAmount>0?Math.min((w.paid||0)/w.contractAmount*100,100):0;
          return`<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.name}</div>
              ${w.contractor?`<div style="font-size:10px;color:var(--text3);margin-top:1px">${w.contractor}</div>`:''}
              ${w.contractAmount>0?`<div style="height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:5px"><div style="height:100%;width:${wPct}%;background:${wDebt>0?'var(--gold)':'var(--green)'};border-radius:2px"></div></div>`:''}
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:12px;font-weight:700;font-family:'DM Mono',monospace">${fmtShort(w.contractAmount)}</div>
              ${w.paid>0?`<div style="font-size:10px;color:var(--green)">✓ ${fmtShort(w.paid)}</div>`:''}
              ${wDebt>0?`<div style="font-size:10px;color:var(--red)">− ${fmtShort(wDebt)}</div>`:''}
            </div>
          </div>`;
        }).join('')}`:''}
        ${allMats.length?`<div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin:${allWorks.length?'10px':0} 0 6px">${lang==='ru'?'Материалы':'Materials'}</div>
        ${allMats.map(m=>{
          const tot=(m.qty||0)*(m.price||0);
          return`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)">
            <i class="ph ph-package" style="font-size:13px;color:var(--text3);flex-shrink:0"></i>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.name}</div>
              <div style="font-size:10px;color:var(--text3)">${m.qty} ${m.unit} × ${fmtShort(m.price)}</div>
            </div>
            <div style="font-size:12px;font-weight:700;font-family:'DM Mono',monospace;flex-shrink:0">${fmtShort(tot)}</div>
          </div>`;
        }).join('')}`:''}
        ${!allWorks.length&&!allMats.length?`<div style="text-align:center;padding:8px 0;color:var(--text3);font-size:12px">${lang==='ru'?'Нет данных':'No data'}</div>`:''}
      </div>`:'';

    return`<div style="background:var(--bg2);border:1px solid ${sDebt>0&&!isDone?'rgba(204,123,123,.25)':isDone?'rgba(128,200,154,.2)':'var(--border)'};border-radius:14px;margin-bottom:8px;overflow:hidden">
      <div style="padding:13px 14px;cursor:pointer" onclick="_finToggle('${s.id}')">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:22px;flex-shrink:0">${s.icon||'🏗'}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tName(s)||s.name}</span>
              <span style="font-size:10px;color:${col};font-weight:600;flex-shrink:0">${STATUS_LABEL[s.status||'idle']}</span>
            </div>
            ${sSmeta>0?`<div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-bottom:6px">
              <div style="height:100%;width:${sPct}%;background:${sOver?'var(--red)':col};border-radius:2px"></div>
            </div>`:''}
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:12px;font-family:'DM Mono',monospace;font-weight:700;color:${sOver?'var(--red)':'var(--text)'}">${fmtShort(sFact)}</span>
              ${sSmeta>0?`<span style="font-size:11px;color:var(--text3)">/ ${fmtShort(sSmeta)}</span>`:''}
              ${sDebt>0&&!isDone?`<span style="font-size:11px;color:var(--red);font-weight:600;margin-left:auto">−${fmtShort(sDebt)}</span>`:''}
              ${isDone?`<span style="font-size:11px;color:var(--green);margin-left:auto"><i class="ph ph-check-circle"></i></span>`:''}
            </div>
          </div>
          <i class="ph ph-caret-${isExp?'up':'down'}" style="font-size:15px;color:var(--text3);flex-shrink:0;margin-left:4px"></i>
        </div>
      </div>
      ${detailHtml}
    </div>`;
  }).join('');
  window._finToggle=(id)=>{if(window._finExp.has(id))window._finExp.delete(id);else window._finExp.add(id);renderFinanceOverview(document.getElementById('financeBody'));};

  body.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div style="background:rgba(128,200,154,.08);border:1px solid rgba(128,200,154,.2);border-radius:16px;padding:16px">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${lang==='ru'?'Расходы':'Spent'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700;color:var(--green);line-height:1.1">${fmtShort(spent)}</div>
        ${budget>0?`<div style="margin-top:8px"><div style="height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden"><div style="height:100%;width:${spentPct}%;background:var(--green);border-radius:2px"></div></div><div style="font-size:10px;color:var(--text3);margin-top:4px">${lang==='ru'?'из':'of'} ${fmtShort(budget)}</div></div>`:''}
      </div>
      <div style="background:${oDebt>0?'rgba(204,123,123,.08)':'var(--bg2)'};border:1px solid ${oDebt>0?'rgba(204,123,123,.25)':'var(--border)'};border-radius:16px;padding:16px;cursor:pointer" onclick="switchFinanceTab('debts')">
        <div style="font-size:10px;color:${oDebt>0?'var(--red)':'var(--text3)'};text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${lang==='ru'?'Долги':'Debts'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700;color:${oDebt>0?'var(--red)':'var(--text3)'};line-height:1.1">${oDebt>0?fmtShort(oDebt):'—'}</div>
        ${oDebt>0?`<div style="font-size:10px;color:var(--red);margin-top:8px">${lang==='ru'?'нажмите чтобы оплатить':'tap to pay'} →</div>`:'<div style="font-size:10px;color:var(--green);margin-top:8px">✓ ${lang==="ru"?"всё оплачено":"all clear"}</div>'}
      </div>
    </div>
    ${(()=>{const pmts=(o.payments||[]);const totalPmts=pmts.reduce((a,p)=>a+p.amount,0);const recentPmt=pmts.sort((a,b)=>b.ts-a.ts)[0];const relTime=recentPmt?((Date.now()-recentPmt.ts)<86400000?(lang==='ru'?'сегодня':'today'):(lang==='ru'?'недавно':'recently')):'';return`<div style="background:rgba(201,170,124,.06);border:1px solid rgba(201,170,124,.2);border-radius:16px;padding:14px 16px;margin-bottom:14px;cursor:pointer;display:flex;align-items:center;gap:14px" onclick="switchFinanceTab('payments')">
      <div style="width:40px;height:40px;border-radius:12px;background:rgba(201,170,124,.12);border:1px solid rgba(201,170,124,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ph ph-coins" style="font-size:20px;color:var(--gold)"></i></div>
      <div style="flex:1">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Выплаты':'Payments'} · ${pmts.length}</div>
        <div style="font-family:'DM Mono',monospace;font-size:20px;font-weight:700;color:var(--gold)">${totalPmts>0?fmtShort(totalPmts):'—'}</div>
        ${relTime?`<div style="font-size:10px;color:var(--text3);margin-top:2px">${lang==='ru'?'последняя':'last'}: ${relTime}</div>`:''}
      </div>
      <i class="ph ph-caret-right" style="font-size:18px;color:var(--text3)"></i>
    </div>`;})()}
    ${typeof weeklyChartHTML==='function'?weeklyChartHTML(o):''}
    ${stages.length?`<div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;font-weight:600">${lang==='ru'?'По этапам':'By stage'}</div>${stagesCards}`:`<div style="text-align:center;padding:24px 0;color:var(--text3)">${lang==='ru'?'Нет этапов':'No stages'}</div>`}`;
}

function renderFinanceDebts(body){
  const objs=db.objects||[];
  const o=objs.find(x=>x.id===_financeObjId)||curObj();
  const saved=loadContractors();
  // Долги в рамках выбранного объекта
  const cmap={};
  (o&&o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
    if(!w.contractor)return;
    const key=w.contractor;
    if(!cmap[key])cmap[key]={name:w.contractor,phone:w.phone||'',total:0,paid:0,works:[]};
    cmap[key].total+=w.contractAmount||0;
    cmap[key].paid+=w.paid||0;
    if(!cmap[key].phone&&w.phone)cmap[key].phone=w.phone;
    cmap[key].works.push({name:w.name,stageName:tName(s)||s.name,contractAmount:w.contractAmount||0,paid:w.paid||0,done:w.done});
  })));
  const debtors=Object.values(cmap).map(c=>({...c,debt:c.total-c.paid})).filter(c=>c.debt>0).sort((a,b)=>b.debt-a.debt);
  const totalDebt=debtors.reduce((a,c)=>a+c.debt,0);
  if(!debtors.length){
    body.innerHTML=`<div style="text-align:center;padding:64px 0 32px">
      <i class="ph ph-check-circle" style="font-size:52px;color:var(--green);display:block;margin-bottom:12px"></i>
      <div style="font-size:15px;font-weight:600;color:var(--text2)">${lang==='ru'?'Долгов нет':'No debts'}</div>
      <div style="font-size:12px;color:var(--text3);margin-top:6px">${lang==='ru'?'Все расчёты закрыты':'All payments settled'}</div>
    </div>`;
    return;
  }
  body.innerHTML=`
    <div style="background:rgba(204,123,123,.08);border:1px solid rgba(204,123,123,.2);border-radius:14px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
      <i class="ph ph-coins" style="font-size:28px;color:var(--red)"></i>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">${lang==='ru'?'Всего к выплате':'Total owed'} · ${debtors.length} ${lang==='ru'?'подрядч.':'contractors'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700;color:var(--red)">${fmtShort(totalDebt)}</div>
      </div>
    </div>
    ${debtors.map(c=>{
      const pct=c.total>0?Math.min(c.paid/c.total*100,100):0;
      const activeWork=c.works.find(w=>!w.done);
      const unpaidWorks=c.works.filter(w=>w.contractAmount>(w.paid||0));
      const sc=saved.find(x=>x.name.toLowerCase()===c.name.toLowerCase());
      const safeName=c.name.replace(/'/g,"\\'");
      return`<div style="background:var(--bg2);border:1px solid rgba(204,123,123,.2);border-radius:16px;margin-bottom:10px;overflow:hidden">
        <div style="display:flex;align-items:center;gap:12px;padding:14px 14px 10px;cursor:pointer" onclick="showContractorDetail('${sc?sc.id:''}')">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(204,123,123,.15);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--red);flex-shrink:0;border:2px solid rgba(204,123,123,.25)">${c.name[0].toUpperCase()}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:700;margin-bottom:2px">${c.name}</div>
            ${activeWork?`<div style="font-size:11px;color:var(--text3)"><i class="ph ph-map-pin" style="font-size:10px"></i> ${activeWork.stageName}</div>`:''}
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-family:'DM Mono',monospace;font-size:16px;font-weight:700;color:var(--red)">${fmtShort(c.debt)}</div>
            <div style="font-size:10px;color:var(--text3)">${lang==='ru'?'из':'of'} ${fmtShort(c.total)}</div>
          </div>
        </div>
        <div style="padding:0 14px 4px">
          <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-bottom:8px">
            <div style="height:100%;width:${pct}%;background:var(--red);border-radius:2px"></div>
          </div>
          ${unpaidWorks.slice(0,2).map(w=>`<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${w.name}</span>
            <span style="flex-shrink:0;margin-left:8px;color:var(--red);font-family:'DM Mono',monospace">${fmtShort(w.contractAmount-(w.paid||0))}</span>
          </div>`).join('')}
          ${unpaidWorks.length>2?`<div style="font-size:10px;color:var(--text3);padding:4px 0">+${unpaidWorks.length-2} ${lang==='ru'?'ещё':'more'}</div>`:''}
        </div>
        <div style="display:flex;gap:8px;padding:10px 14px 14px">
          ${c.phone?`<a href="tel:${c.phone}" onclick="event.stopPropagation()" style="width:42px;height:42px;border-radius:12px;background:rgba(123,184,204,.1);display:flex;align-items:center;justify-content:center;color:var(--blue);text-decoration:none;flex-shrink:0">
            <i class="ph ph-phone" style="font-size:18px"></i>
          </a>`:''}
          <button onclick="event.stopPropagation();payContractorPrompt('${safeName}','${o.id}')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.3);border-radius:12px;color:var(--gold);font-size:14px;font-weight:700;font-family:'Mulish',sans-serif;cursor:pointer">
            <i class="ph ph-coins" style="font-size:17px"></i>${lang==='ru'?'Выплатить':'Pay'} ${fmtShort(c.debt)}
          </button>
        </div>
      </div>`;
    }).join('')}`;
}

function renderFinancePayments(body){
  const objs=db.objects||[];
  const o=objs.find(x=>x.id===_financeObjId)||curObj();if(!o){body.innerHTML='';return;}
  const payments=(o.payments||[]).slice().sort((a,b)=>b.ts-a.ts);
  const totalPaid=payments.reduce((a,p)=>a+p.amount,0);
  const addBtn=`<button onclick="showAddPaymentFreeModal()" style="display:flex;align-items:center;gap:8px;padding:13px 16px;width:100%;background:rgba(201,170,124,.08);border:1px dashed rgba(201,170,124,.3);border-radius:14px;color:var(--gold);font-size:14px;font-weight:600;font-family:Mulish,sans-serif;cursor:pointer;margin-bottom:16px"><i class="ph ph-plus-circle" style="font-size:20px"></i>${lang==='ru'?'Добавить выплату':'Add payment'}</button>`;
  if(!payments.length){
    body.innerHTML=addBtn+`<div style="text-align:center;padding:48px 0;color:var(--text3)"><i class="ph ph-coins" style="font-size:40px;display:block;margin-bottom:12px;opacity:.4"></i><div style="font-size:14px">${lang==='ru'?'Выплат пока нет':'No payments yet'}</div></div>`;
    return;
  }
  // Группировка по дате
  const groups={};
  payments.forEach(p=>{
    const d=new Date(p.ts);
    const key=d.toLocaleDateString('ru',{day:'2-digit',month:'long',year:'numeric'});
    if(!groups[key])groups[key]=[];
    groups[key].push(p);
  });
  const rows=Object.entries(groups).map(([date,ps])=>`
    <div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin:14px 0 6px">${date}</div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;overflow:hidden">
      ${ps.map((p,i)=>{
        // Найдём работу для контекста
        const stage=(o.stages||[]).find(s=>s.id===p.stageId);
        const pos=(stage?.positions||[]).find(pos=>pos.id===p.posId);
        const work=(pos?.works||[]).find(w=>w.id===p.workId);
        return`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;${i>0?'border-top:1px solid var(--border)':''}">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(128,200,154,.12);border:1px solid rgba(128,200,154,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ph ph-coins" style="font-size:16px;color:var(--green)"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.contractor||(lang==='ru'?'Выплата':'Payment')}</div>
            <div style="font-size:11px;color:var(--text3)">${work?work.name:''}${stage?' · '+stage.name:''}${p.note?' · '+p.note:''}</div>
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:var(--green);flex-shrink:0">+${fmtShort(p.amount)}</div>
        </div>`;
      }).join('')}
    </div>`).join('');
  body.innerHTML=`
    <div style="background:rgba(128,200,154,.08);border:1px solid rgba(128,200,154,.2);border-radius:14px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
      <i class="ph ph-coins" style="font-size:28px;color:var(--green)"></i>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">${lang==='ru'?'Всего выплачено':'Total paid'} · ${payments.length} ${lang==='ru'?'операций':'payments'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700;color:var(--green)">${fmtShort(totalPaid)}</div>
      </div>
    </div>
    ${addBtn}${rows}`;
}
// Свободная выплата (без привязки к конкретной работе из renderPos)
let _freePaySel=null; // {workId,stageId,posId,contractor,unpaid}
function showAddPaymentFreeModal(){
  const o=curObj();if(!o)return;
  _freePaySel=null;
  const unpaidWorks=(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>(p.works||[]).filter(w=>(w.contractAmount||0)>(w.paid||0)).map(w=>({...w,stageId:s.id,posId:p.id,stageName:tName(s)||s.name}))));
  const cardsHtml=unpaidWorks.length?unpaidWorks.map(w=>{
    const unpaid=Math.max(0,(w.contractAmount||0)-(w.paid||0));
    const letter=(w.contractor||'?')[0].toUpperCase();
    const colors=['#7BB8CC','#C9AA7C','#80C89A','#CC7B7B','#B07BCC'];
    const col=colors[(w.contractor||'').charCodeAt(0)%colors.length];
    return`<div id="_fpCard_${w.id}" onclick="_fpSelectWork('${w.id}','${w.stageId}','${w.posId}','${(w.contractor||'').replace(/'/g,'')}')" style="display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:13px;border:1.5px solid var(--border);background:var(--bg3);cursor:pointer;margin-bottom:7px;transition:border-color .15s,background .15s">
      <div style="width:36px;height:36px;border-radius:10px;background:${col}22;border:1px solid ${col}44;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;font-weight:700;color:${col}">${letter}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.contractor||w.name}</div>
        <div style="font-size:11px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.contractor?w.name+' · ':''}'${w.stageName}'</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:var(--red)">${fmtShort(unpaid)}</div>
        <div style="font-size:9px;color:var(--text3);margin-top:1px">${lang==='ru'?'остаток':'left'}</div>
      </div>
    </div>`;
  }).join(''):`<div style="text-align:center;padding:20px 0;color:var(--text3);font-size:13px"><i class="ph ph-check-circle" style="font-size:28px;display:block;margin-bottom:8px;color:var(--green);opacity:.6"></i>${lang==='ru'?'Все работы оплачены':'All works are paid'}</div>`;
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title"><i class="ph ph-coins"></i> ${lang==='ru'?'Выплата':'Payment'}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:12px;scrollbar-width:none">${cardsHtml}</div>
    <div id="_fpAmtWrap" style="display:${unpaidWorks.length?'none':'block'}">
      <div class="form-group"><label class="form-label">${lang==='ru'?'Сумма':'Amount'} ₼</label>
        <input type="number" id="_freePayAmt" placeholder="0" oninput="_fpSyncChips()"/>
        <div id="_fpChips" style="display:flex;gap:6px;margin-top:8px"></div>
      </div>
      <div class="form-group"><label class="form-label">${lang==='ru'?'Примечание':'Note'}</label>
        <input type="text" id="_freePayNote" placeholder="${lang==='ru'?'Аванс, расчёт...':'Advance, final...'}"/>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="confirmFreePayment()">${lang==='ru'?'Выплатить':'Pay'}</button>
    </div>`);
}
function _fpSelectWork(workId,stageId,posId,contractor){
  const o=curObj();if(!o)return;
  // Находим работу
  let unpaid=0;
  (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{if(w.id===workId)unpaid=Math.max(0,(w.contractAmount||0)-(w.paid||0));})));
  _freePaySel={workId,stageId,posId,contractor,unpaid};
  // Подсветить карточку
  document.querySelectorAll('[id^="_fpCard_"]').forEach(el=>{
    const isThis=el.id==='_fpCard_'+workId;
    el.style.borderColor=isThis?'var(--gold)':'var(--border)';
    el.style.background=isThis?'rgba(201,170,124,.08)':'var(--bg3)';
  });
  // Показать поле суммы
  const wrap=document.getElementById('_fpAmtWrap');
  if(wrap){wrap.style.display='block';}
  // Авто-заполнить сумму остатком
  const amtInp=document.getElementById('_freePayAmt');
  if(amtInp){amtInp.value=unpaid;amtInp.focus();}
  // Чипсы быстрых сумм
  _fpRenderChips(unpaid);
}
function _fpRenderChips(unpaid){
  const ch=document.getElementById('_fpChips');if(!ch)return;
  const chips=[
    {label:lang==='ru'?'Остаток':'Full',val:unpaid},
    {label:'50%',val:Math.round(unpaid*0.5)},
    {label:'30%',val:Math.round(unpaid*0.3)},
  ];
  ch.innerHTML=chips.map(c=>`<button onclick="_fpSetAmt(${c.val})" style="padding:5px 11px;border-radius:8px;border:1px solid rgba(201,170,124,.3);background:rgba(201,170,124,.07);color:var(--gold);font-size:12px;font-weight:600;font-family:Mulish,sans-serif;cursor:pointer">${c.label} ${fmtShort(c.val)}</button>`).join('');
}
function _fpSetAmt(val){
  const inp=document.getElementById('_freePayAmt');if(inp)inp.value=val;
  // Подсветить активный чип
  document.querySelectorAll('#_fpChips button').forEach(b=>{
    const isActive=b.textContent.includes(String(val));
    b.style.background=isActive?'rgba(201,170,124,.2)':'rgba(201,170,124,.07)';
    b.style.borderColor=isActive?'var(--gold)':'rgba(201,170,124,.3)';
  });
}
function _fpSyncChips(){
  // Снять подсветку чипов если сумму изменили вручную
  document.querySelectorAll('#_fpChips button').forEach(b=>{
    b.style.background='rgba(201,170,124,.07)';
    b.style.borderColor='rgba(201,170,124,.3)';
  });
}
function confirmFreePayment(){
  const amt=parseFloat(document.getElementById('_freePayAmt')?.value)||0;
  const note=document.getElementById('_freePayNote')?.value.trim()||'';
  if(!amt){showToast(t('enterBudget'),'err');return;}
  if(_freePaySel&&_freePaySel.workId){
    const{workId,stageId,posId,contractor}=_freePaySel;
    addPayment({workId,stageId,posId,contractor,amount:amt,note});
  } else {
    const o=curObj();if(!o)return;
    const payment={id:newId(),workId:'',stageId:'',posId:'',contractor:'',amount:amt,ts:Date.now(),note};
    db.objects=db.objects.map(obj=>obj.id!==o.id?obj:{...obj,payments:[...(obj.payments||[]),payment]});
    saveDB();
  }
  _freePaySel=null;
  closeModal();
  const body=document.getElementById('financeBody');
  if(body)renderFinancePayments(body);
  renderDashBottom();
  showToast((lang==='ru'?'Выплачено: ':'Paid: ')+fmtShort(amt));
}
function _finMonthBuckets(o,monthsBack){
  const now=new Date();const buckets=[];
  for(let i=monthsBack-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);buckets.push({y:d.getFullYear(),m:d.getMonth(),amount:0});}
  const idx=ts=>{const d=new Date(ts);return buckets.findIndex(b=>b.y===d.getFullYear()&&b.m===d.getMonth());};
  (o.payments||[]).forEach(p=>{if(!p.ts)return;const i=idx(p.ts);if(i>=0)buckets[i].amount+=p.amount||0;});
  (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>{
    (p.mats||[]).forEach(m=>{if(!m.addedAt)return;const c=(m.qty||0)*(m.price||0);if(!c)return;const i=idx(m.addedAt);if(i>=0)buckets[i].amount+=c;});
  }));
  return buckets;
}
function renderFinanceAnalytics(body){
  const objs=db.objects||[];if(!objs.length){body.innerHTML='';return;}
  if(!_financeObjId||!objs.find(o=>o.id===_financeObjId))_financeObjId=(db.activeObjectId&&objs.find(o=>o.id===db.activeObjectId))?db.activeObjectId:objs[0].id;
  const o=objs.find(x=>x.id===_financeObjId)||objs[0];
  // ── Помесячно ──
  const buckets=_finMonthBuckets(o,6);
  const months=getMonths();
  const maxAmt=Math.max(...buckets.map(b=>b.amount),1);
  const totalSpan=buckets.reduce((a,b)=>a+b.amount,0);
  const spendMonths=buckets.filter(b=>b.amount>0).length;
  const avgBurn=spendMonths?Math.round(totalSpan/spendMonths):0;
  const nowM=new Date().getMonth(),nowY=new Date().getFullYear();
  const barsHtml=buckets.map(b=>{
    const hp=Math.round(b.amount/maxAmt*100);
    const isCur=b.m===nowM&&b.y===nowY;
    return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0">
      <div style="font-size:8px;color:var(--text3);font-family:'DM Mono',monospace;height:10px;white-space:nowrap;overflow:hidden">${b.amount>0?fmtShort(b.amount):''}</div>
      <div style="width:100%;max-width:30px;height:88px;display:flex;align-items:flex-end">
        <div style="width:100%;height:${b.amount>0?Math.max(hp,6):0}%;background:${isCur?'linear-gradient(180deg,#e8c97e,var(--gold))':'linear-gradient(180deg,var(--gold),rgba(201,170,124,.35))'};border-radius:5px 5px 0 0;transition:height .6s"></div>
      </div>
      <div style="font-size:10px;color:${isCur?'var(--gold)':'var(--text3)'};font-weight:${isCur?'700':'400'}">${months[b.m]}</div>
    </div>`;
  }).join('');
  // ── Прогноз бюджета ──
  const totalSpent=(o.stages||[]).flatMap(s=>s.positions||[]).reduce((a,p)=>a+posFact(p),0);
  const budget=o.totalBudget||0;const remaining=budget-totalSpent;
  let fIcon='ph-chart-bar',fCol='var(--text2)',fTitle='',fSub='';
  if(budget<=0){fTitle=lang==='ru'?'Бюджет не задан':'No budget set';fSub=lang==='ru'?'Укажите бюджет проекта для прогноза':'Set project budget to forecast';}
  else if(remaining<=0){fCol='var(--red)';fIcon='ph-warning';fTitle=lang==='ru'?'Бюджет превышен':'Over budget';fSub=(lang==='ru'?'Перерасход ':'Over by ')+fmtShort(Math.abs(remaining));}
  else if(avgBurn>0){const ml=remaining/avgBurn;const fd=new Date();fd.setMonth(fd.getMonth()+Math.round(ml));fCol=ml<2?'var(--red)':ml<4?'var(--gold)':'var(--green)';fTitle=(lang==='ru'?'Хватит до ':'Lasts until ')+months[fd.getMonth()]+' '+fd.getFullYear();fSub=(lang==='ru'?'При темпе ~':'~')+fmtShort(avgBurn)+(lang==='ru'?'/мес · ещё ~':'/mo · ~')+Math.round(ml)+(lang==='ru'?' мес':' mo');}
  else{fTitle=lang==='ru'?'Недостаточно данных':'Not enough data';fSub=lang==='ru'?'Выплаты с датами появятся здесь':'Dated payments will show here';}
  // ── Donut работа/материалы ──
  let workTotal=0,matTotal=0;
  (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>{
    workTotal+=(p.works||[]).reduce((a,w)=>a+(w.paid||0),0);
    matTotal+=(p.mats||[]).reduce((a,m)=>a+(m.qty||0)*(m.price||0),0);
  }));
  const gt=workTotal+matTotal||1;const workPct=Math.round(workTotal/gt*100);
  const r=40,circ=2*Math.PI*r;
  const donut=`<svg width="84" height="84" viewBox="0 0 100 100" style="flex-shrink:0">
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--blue)" stroke-width="13"/>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--gold)" stroke-width="13" stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-workPct/100)}" transform="rotate(-90 50 50)"/>
    <text x="50" y="46" text-anchor="middle" fill="var(--text)" font-family="DM Mono,monospace" font-size="14" font-weight="700">${workPct}%</text>
    <text x="50" y="61" text-anchor="middle" fill="var(--text3)" font-size="8">${lang==='ru'?'работа':'work'}</text>
  </svg>`;
  // ── Топ подрядчиков (по объекту) ──
  const cm={};
  (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
    if(!w.contractor)return;const k=w.contractor;
    if(!cm[k])cm[k]={name:k,paid:0,debt:0};
    cm[k].paid+=(w.paid||0);cm[k].debt+=Math.max(0,(w.contractAmount||0)-(w.paid||0));
  })));
  const topC=Object.values(cm).filter(c=>c.paid>0||c.debt>0).sort((a,b)=>b.paid-a.paid).slice(0,5);
  const maxPaid=Math.max(...topC.map(c=>c.paid),1);
  body.innerHTML=`
    <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;font-weight:600">${lang==='ru'?'Расходы по месяцам':'Monthly spending'}</div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px 14px 12px;margin-bottom:14px">
      ${totalSpan>0?`<div style="display:flex;align-items:flex-end;gap:6px">${barsHtml}</div>`:`<div style="text-align:center;padding:18px 0;color:var(--text3);font-size:13px"><i class="ph ph-chart-bar" style="font-size:26px;display:block;margin-bottom:8px;opacity:.4"></i>${lang==='ru'?'Нет выплат с датами':'No dated payments yet'}</div>`}
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:14px">
      <div style="width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ph ${fIcon}" style="font-size:20px;color:${fCol}"></i></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:700;color:${fCol};margin-bottom:2px">${fTitle}</div>
        <div style="font-size:11px;color:var(--text3)">${fSub}</div>
      </div>
    </div>
    <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;font-weight:600">${lang==='ru'?'Структура расходов':'Spending split'}</div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:14px">
      ${donut}
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:9px;height:9px;border-radius:2px;background:var(--gold)"></div><div style="flex:1;font-size:13px">${lang==='ru'?'Работы':'Labour'}</div><div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700">${fmtShort(workTotal)}</div></div>
        <div style="display:flex;align-items:center;gap:8px"><div style="width:9px;height:9px;border-radius:2px;background:var(--blue)"></div><div style="flex:1;font-size:13px">${lang==='ru'?'Материалы':'Materials'}</div><div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700">${fmtShort(matTotal)}</div></div>
      </div>
    </div>
    ${topC.length?`<div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;font-weight:600">${lang==='ru'?'Топ подрядчиков':'Top contractors'}</div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:14px 16px">
      ${topC.map((c,i)=>{const bp=Math.round(c.paid/maxPaid*100);return`<div style="${i>0?'margin-top:12px':''}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span style="font-size:13px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.name}</span>
          <span style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700;color:var(--green)">${fmtShort(c.paid)}</span>
          ${c.debt>0?`<span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--red)">−${fmtShort(c.debt)}</span>`:''}
        </div>
        <div style="height:5px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden"><div style="height:100%;width:${bp}%;background:var(--green);border-radius:3px"></div></div>
      </div>`;}).join('')}
    </div>`:''}
    <div style="height:8px"></div>`;
}
function renderFinance(){
  _financeTab='overview'; // всегда начинаем с обзора
  syncContractorsFromData();
  const objs=db.objects||[];
  if(objs.length&&(!_financeObjId||!objs.find(o=>o.id===_financeObjId)))_financeObjId=(db.activeObjectId&&objs.find(o=>o.id===db.activeObjectId))?db.activeObjectId:objs[0].id;
  const title=lang==='ru'?'Финансы':lang==='az'?'Maliyyə':'Finance';
  const tabs=[['overview',l3('Обзор','İcmal','Overview')],['debts',l3('Долги','Borclar','Debts')],['payments',l3('Выплаты','Ödəniş','Payments')],['analytics',l3('Аналитика','Analitika','Analytics')]];
  document.getElementById('financeContent').innerHTML=`
    <div style="padding:calc(var(--top) + 28px) 16px 12px">
      <span style="font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700">${title}</span>
    </div>
    <div id="finObjSel" style="padding:0 16px"></div>
    <div style="padding:6px 16px 0">
      <div style="display:flex;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:3px;gap:2px">
        ${tabs.map(([k,lbl])=>`<button id="finTab_${k}" onclick="switchFinanceTab('${k}')" style="flex:1;padding:8px 4px;border:none;border-radius:9px;background:transparent;color:var(--text3);font-size:12px;font-weight:600;font-family:Mulish,sans-serif;cursor:pointer;white-space:nowrap;transition:all .15s">${lbl}</button>`).join('')}
      </div>
    </div>
    <div id="financeBody" style="padding:14px 16px;padding-bottom:calc(80px + env(safe-area-inset-bottom,0px))"></div>`;
  switchFinanceTab('overview');
}
function showProjectsSheet(){
  const addLabel=lang==='ru'?'Новый объект':lang==='az'?'Yeni obyekt':'New project';
  const title=lang==='ru'?'Все проекты':lang==='az'?'Bütün layihələr':'All projects';
  const html='<div class="modal-handle"></div>'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'+
      '<div class="modal-title" style="margin-bottom:0">'+title+'</div>'+
      '<button onclick="closeModal();addObjectPrompt()" style="background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.2);color:var(--gold);border-radius:10px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:Mulish,sans-serif">＋ '+addLabel+'</button>'+
    '</div>'+
    db.objects.map(o=>{
      const tf=(o.stages||[]).reduce((a,s)=>(s.positions||[]).reduce((b,p)=>b+posFact(p),a),0);
      const oSmeta=(o.stages||[]).reduce((a,s)=>(s.positions||[]).reduce((b,p)=>b+posSmeta(p),a),0);
      const pct=oSmeta>0?Math.min(tf/oSmeta*100,100):0;
      const isActive=o.id===db.activeObjectId;
      const ringCol=pct>=80?'var(--green)':pct>=40?'var(--gold)':'var(--blue)';
      return'<div style="display:flex;align-items:center;gap:14px;padding:14px;background:'+(isActive?'rgba(201,170,124,.06)':'var(--bg3)')+';border:1px solid '+(isActive?'rgba(201,170,124,.3)':'var(--border)')+';border-radius:16px;margin-bottom:10px">'+
        '<div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">'+o.icon+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:14px;font-weight:700;margin-bottom:3px">'+o.name+'</div>'+
          '<div style="font-size:11px;color:var(--text3)">'+(o.stages||[]).length+' '+(lang==='ru'?'эт.':'stages')+' · '+fmtShort(tf)+'</div>'+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0">'+
          (isActive?'<i class="ph ph-check-circle" style="font-size:18px;color:var(--gold)"></i>':'')+
          ringHTML(pct,ringCol,44)+
        '</div>'+
      '</div>';
    }).join('');
  showModal(html);
}
