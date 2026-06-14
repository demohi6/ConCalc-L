// ── PRICE BOOK SUGGESTION ──
function suggestMatPrice(){
  const name=(document.getElementById('newMatName')?.value||'').toLowerCase();
  if(!name)return;
  const pb=getPrices();
  let price=null,unit=null;
  if(name.includes('бетон')){price=pb.concrete;unit='м³';}
  else if(name.includes('арматур')){price=pb.rebar;unit='кг';}
  else if(name.includes('газоблок')||name.includes('газ блок')){price=pb.gasblock;unit='м³';}
  else if(name.includes('кирпич')||name.includes('kərpic')){price=pb.brick;unit='шт';}
  else if(name.includes('ракушечник')||name.includes('daş')){price=pb.shell;unit='шт';}
  else if(name.includes('штукатурк')&&(name.includes('гипс')||name.includes('gips'))){price=pb.plasterGyps;unit='мешок';}
  else if(name.includes('штукатурк')||name.includes('suvaq')){price=pb.plasterCem;unit='мешок';}
  else if(name.includes('цемент')||name.includes('sement')){price=pb.cement;unit='мешок';}
  else if(name.includes('песок')||name.includes('песч')||name.includes('qum')){price=pb.sand;unit='м³';}
  else if(name.includes('щебен')||name.includes('гравий')||name.includes('çınqıl')){price=pb.gravel;unit='м³';}
  else if(name.includes('кровл')||name.includes('профнастил')||name.includes('черепиц')){price=pb.roof;unit='м²';}
  if(price==null)return;
  const prEl=document.getElementById('newMatPrice');
  const uEl=document.getElementById('newMatUnit');
  if(prEl&&!prEl.value)prEl.value=price;
  if(uEl&&unit)uEl.value=unit;
}
// ── NAVIGATION ──
function goDetail(stageId){activeStageId=stageId;document.getElementById('pageDash').classList.add('page-hidden-left');document.getElementById('pageDetail').classList.remove('page-hidden-right');document.getElementById('pagePos').classList.add('page-hidden-right');renderDetail();}
function goPos(posId){activePosId=posId;document.getElementById('pageDetail').classList.add('page-hidden-left');document.getElementById('pagePos').classList.remove('page-hidden-right');renderPos();}
function goBack(){
  const pp=document.getElementById('pagePos');
  if(!pp.classList.contains('page-hidden-right')){
    pp.classList.add('page-hidden-right');
    document.getElementById('pageDetail').classList.remove('page-hidden-left');
    renderDetail();
  } else {
    document.getElementById('pageDetail').classList.add('page-hidden-right');
    document.getElementById('pageDash').classList.remove('page-hidden-left');
    // Только обновляем данные под карточкой — не пересоздаём карусель
    renderDashBottom();
  }
}
// ── DASH ──
function renderDash(){
  setTimeout(initCarouselDots,100);
  if(db.objects.length===0){
    document.getElementById('dashContent').innerHTML=`
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;padding:32px 24px;text-align:center">
        <!-- Один ореол снизу вверх -->
        <div style="position:fixed;bottom:0;left:0;right:0;height:55vh;background:radial-gradient(ellipse at 50% 100%,rgba(24,165,88,.16) 0%,rgba(24,165,88,.05) 40%,transparent 70%);pointer-events:none;z-index:0"></div>
        <!-- Контент -->
        <div style="position:relative;z-index:1">
          <div style="font-size:72px;margin-bottom:24px">🏗️</div>
          <div style="font-family:'Unbounded',sans-serif;font-size:20px;font-weight:700;color:var(--text);margin-bottom:10px">${lang==='ru'?'Начнём стройку':'Tikintiyə başlayaq'}</div>
          <div style="font-size:14px;color:var(--text3);line-height:1.7;margin-bottom:36px;max-width:260px">${lang==='ru'?'Добавьте первый объект — дом, дачу или любой другой проект':'İlk obyekti əlavə edin'}</div>
          <button onclick="addObjectPrompt()" style="display:inline-flex;align-items:center;gap:10px;background:var(--gold);color:var(--on-accent);border:none;border-radius:16px;padding:15px 32px;font-family:'Unbounded',sans-serif;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 22px rgba(24,165,88,.32)">
            <i class="ph ph-plus" style="font-size:18px"></i>${lang==='ru'?'Новый проект':'Yeni layihə'}
          </button>
        </div>
      </div>`;
    return;
  }
  // ── Stats across all objects ──
  const allStages=db.objects.flatMap(o=>o.stages||[]);
  const allPos=allStages.flatMap(s=>s.positions||[]);
  const tb=db.objects.reduce((a,o)=>a+(o.totalBudget||0),0);
  const tf=allPos.reduce((a,p)=>a+posFact(p),0);
  const avgCpl=allStages.length>0?Math.round(allStages.reduce((a,s)=>{const sm=stageSmeta(s),fc=stageFact(s);return a+(sm>0?Math.min(fc/sm*100,100):0);},0)/allStages.length):0;
  const totalOvd=allStages.reduce((a,s)=>a+stageOverdueCount(s),0);
  const totalDebt=allStages.reduce((a,s)=>a+stageDebt(s),0);
  const isOver=tf>tb&&tb>0;
  const rem=tb-tf;
  // ── Header ──
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
  const isStandalone=window.matchMedia('(display-mode:standalone)').matches||navigator.standalone;
  const hr=new Date().getHours();
  const greet=lang==='ru'?(hr<12?'Доброе утро':hr<17?'Добрый день':'Добрый вечер'):lang==='az'?(hr<12?'Sabahınız xeyir':hr<17?'Günortanız xeyir':'Axşamınız xeyir'):(hr<12?'Good morning':hr<17?'Good afternoon':'Good evening');
  const st=stages();
  document.getElementById('dashContent').innerHTML=`
    <div class="dash-hero">
    <div style="display:flex;justify-content:flex-end;margin-bottom:10px">
      <div id="weatherWidget" style="display:none;align-items:center;gap:5px;background:var(--inset);border:1px solid var(--border);border-radius:20px;padding:4px 10px;cursor:pointer" onclick="loadWeather()"></div>
    </div>
    ${(!isStandalone&&isIOS)?`<div class="budget-banner" style="background:var(--inset-2);border-color:var(--border);padding:12px 14px;margin-bottom:12px"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:24px;color:var(--gold)"><i class="ph ph-device-mobile"></i></div><div><div style="font-size:13px;font-weight:600;margin-bottom:2px">${t('install')}</div><div style="font-size:11px;color:var(--text3)">${t('installHint')}</div></div></div></div>`:''}
    ${(!isStandalone&&!isIOS&&window._installPrompt)?`<div class="budget-banner" style="background:var(--inset-2);border-color:var(--border);padding:12px 14px;margin-bottom:12px"><div style="display:flex;align-items:center;gap:10px"><div style="flex:1"><div style="font-size:13px;font-weight:600">${t('install')}</div></div><button class="btn btn-sm" style="background:var(--accent-tint);color:var(--accent-deep);border:1px solid var(--accent-line)" onclick="installApp()">${t('installBtn')}</button></div></div>`:''}
    <div class="proj-stack" id="projStack">
    ${db.objects.map((o,i)=>{
      const oSt=o.stages||[];
      const oFact=oSt.reduce((a,s)=>(s.positions||[]).reduce((b,p)=>b+posFact(p),a),0);
      const oSmeta=oSt.reduce((a,s)=>(s.positions||[]).reduce((b,p)=>b+posSmeta(p),a),0);
      // Прогресс по общему бюджету (если задан) — честнее чем по смете незавершённых этапов
      const oDenom=o.totalBudget>0?o.totalBudget:oSmeta;
      const oPct=oDenom>0?Math.min(oFact/oDenom*100,100):0;
      const oOvd=oSt.reduce((a,s)=>a+stageOverdueCount(s),0);
      const oDebt=oSt.reduce((a,s)=>a+stageDebt(s),0);
      const ringCol=oPct>=80?'var(--green)':'var(--gold)';
      const doneStages=oSt.filter(s=>s.status==='done').length;
      const budgetLeft=o.totalBudget>0?o.totalBudget-oFact:null;
      const isOverBudget=budgetLeft!==null&&budgetLeft<0;
      const cover=o.photo||((o.journal||[]).slice().reverse().find(e=>e.photo)||{}).photo||'icons/cover-house.jpg';
      const stagesLeft=Math.max(0,oSt.length-doneStages);
      return`<div class="proj-stack-card proj-hero-card" data-idx="${i}" data-obj-id="${o.id}" style="padding:0;overflow:hidden;border:none;height:252px">
        <img src="${cover}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 42%;display:block">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(8,20,14,.86),rgba(8,20,14,.12) 50%,rgba(8,20,14,0) 72%)"></div>
        ${oOvd>0?`<span onclick="event.stopPropagation();showOverdueModal('${o.id}')" style="position:absolute;top:12px;left:12px;display:inline-flex;align-items:center;gap:5px;background:rgba(224,75,75,.96);color:#fff;font-size:11px;font-weight:600;padding:5px 10px;border-radius:999px;cursor:pointer"><i class="ph ph-warning" style="font-size:13px"></i> ${oOvd} ${l3('просрочено','gecikmiş','overdue')}</span>`:''}
        <button onclick="event.stopPropagation();editObjectPrompt('${o.id}')" style="position:absolute;top:11px;right:11px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.92);border:none;color:#16201A;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px"><i class="ph ph-dots-three"></i></button>
        <div style="position:absolute;left:14px;right:14px;bottom:13px">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-bottom:11px">
            <div style="min-width:0">
              <div style="font-family:'Unbounded',sans-serif;font-size:19px;font-weight:700;color:#fff;line-height:1.12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tName(o)||o.name}</div>
              <div onclick="event.stopPropagation();showStagesPage()" style="font-size:12px;color:rgba(255,255,255,.85);display:flex;align-items:center;gap:4px;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer">${o.city?`<i class="ph ph-map-pin" style="font-size:13px;flex-shrink:0"></i> ${o.city} · `:''}${oSt.length} ${l3('этапов','mərhələ','stages')} · ${doneStages} ${l3('готово','hazır','done')}</div>
            </div>
            <div style="flex-shrink:0;background:rgba(255,255,255,.96);border-radius:999px;padding:6px 11px;display:flex;align-items:baseline;gap:4px"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:500;color:var(--accent-deep)">${Math.round(oPct)}%</span><span style="font-size:11px;color:var(--text2);font-weight:600">${l3('освоено','mənims.','done')}</span></div>
          </div>
          <div style="display:flex;background:rgba(10,24,17,.5);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:11px 4px">
            <div onclick="event.stopPropagation();switchTab('finance')" style="flex:1;text-align:center;cursor:pointer">
              <div style="font-size:11px;color:rgba(255,255,255,.62);margin-bottom:3px">${l3('Расходы','Xərclər','Expenses')}</div>
              <div style="font-family:'DM Mono',monospace;font-size:14px;color:#fff">${fmtShort(oFact)}</div>
            </div>
            <div onclick="event.stopPropagation();showBudgetDetail('${o.id}')" style="flex:1;text-align:center;cursor:pointer;border-left:1px solid rgba(255,255,255,.16)">
              <div style="font-size:11px;color:rgba(255,255,255,.62);margin-bottom:3px">${isOverBudget?l3('Перерасход','Aşıb','Over'):l3('Остаток','Qalıq','Left')}</div>
              <div style="font-family:'DM Mono',monospace;font-size:14px;color:${budgetLeft===null?'rgba(255,255,255,.5)':isOverBudget?'#FF9D9D':'#fff'}">${budgetLeft===null?'—':fmtShort(budgetLeft)}</div>
            </div>
            <div onclick="event.stopPropagation();switchTab('finance');switchFinanceTab('debts')" style="flex:1;text-align:center;cursor:pointer;border-left:1px solid rgba(255,255,255,.16)">
              <div style="font-size:11px;color:rgba(255,255,255,.62);margin-bottom:3px">${l3('Долги','Borclar','Debts')}</div>
              <div style="font-family:'DM Mono',monospace;font-size:14px;color:${oDebt>0?'#FF9D9D':'rgba(255,255,255,.45)'}">${oDebt>0?fmtShort(oDebt):'—'}</div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('')}
    </div>
    <div class="proj-dots" id="projDots" style="display:none"></div>
    </div>
    <div class="dash-body"><div id="dashBottom"></div></div>`;
  renderDashBottom();
}
function getWeeklyData(obj,weekOffset){
  weekOffset=weekOffset||0;
  const allWorks=(obj?[obj]:db.objects).flatMap(o=>(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>p.works||[])));
  const today=new Date();
  const dow=today.getDay();
  const todayIdx=weekOffset===0?(dow===0?6:dow-1):-1; // -1 если не текущая неделя
  // Начало нужной недели (понедельник 00:00:00)
  const monday=new Date(today);
  monday.setDate(today.getDate()-(dow===0?6:dow-1)+weekOffset*7);
  monday.setHours(0,0,0,0);
  // Все материалы с датой добавления
  const allMats=(obj?[obj]:db.objects).flatMap(o=>(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>p.mats||[])));
  // Выплаты из object.payments[] (Finance «Добавить выплату» + оплата работы)
  const allPayments=(obj?[obj]:db.objects).flatMap(o=>o.payments||[]);
  const hasHistory=allPayments.some(p=>p.ts)||allMats.some(m=>m.addedAt);
  let dayAmounts=[0,0,0,0,0,0,0];
  if(hasHistory){
    // Единый леджер выплат (obj.payments зеркалит paymentHistory — без двойного счёта)
    allPayments.forEach(p=>{
      if(!p.ts)return;
      const d=new Date(p.ts);d.setHours(0,0,0,0);
      const diff=Math.round((d-monday)/(1000*60*60*24));
      if(diff>=0&&diff<=6)dayAmounts[diff]+=p.amount||0;
    });
    // Материалы по дате добавления (только если есть addedAt)
    allMats.forEach(m=>{
      if(!m.addedAt)return;
      const cost=(m.qty||0)*(m.price||0);if(!cost)return;
      const d=new Date(m.addedAt);d.setHours(0,0,0,0);
      const diff=Math.round((d-monday)/(1000*60*60*24));
      if(diff>=0&&diff<=6)dayAmounts[diff]+=cost;
    });
  }else{
    // Нет timestamps — показываем всё в сегодняшнем баре
    const totalPaid=allWorks.reduce((a,w)=>a+(w.paid||0),0);
    const totalMats=allMats.reduce((a,m)=>a+(m.qty||0)*(m.price||0),0);
    dayAmounts[todayIdx]=totalPaid+totalMats;
  }
  const days=dayAmounts.map((amount,i)=>({
    label:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i],
    amount,
    isToday:i===todayIdx,
    isFuture:weekOffset===0&&i>todayIdx // будущее только для текущей недели
  }));
  const sunday=new Date(monday);sunday.setDate(monday.getDate()+6);
  const fmtD=d=>d.toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
  const weekLabel=fmtD(monday)+' – '+fmtD(sunday);
  const weekTotal=days.filter(d=>!d.isFuture).reduce((a,d)=>a+d.amount,0);
  return{days,weekTotal,hasHistory,monday,weekLabel};
}
function getSpendBreakdown(obj){
  const objects=obj?[obj]:db.objects;
  const allPos=objects.flatMap(o=>(o.stages||[]).flatMap(s=>s.positions||[]));
  const laborPaid=allPos.flatMap(p=>p.works||[]).reduce((a,w)=>a+(w.paid||0),0);
  const matsCost=allPos.flatMap(p=>p.mats||[]).reduce((a,m)=>a+(m.qty||0)*(m.price||0),0);
  const total=laborPaid+matsCost;
  const ctMap=new Map();
  allPos.flatMap(p=>p.works||[]).forEach(w=>{
    if(!w.contractor||!w.paid)return;
    ctMap.set(w.contractor,(ctMap.get(w.contractor)||0)+w.paid);
  });
  const topCt=Array.from(ctMap.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return{laborPaid,matsCost,total,topCt};
}
function getYearlyData(obj,yearOffset){
  yearOffset=yearOffset||0;
  const allWorks=(obj?[obj]:db.objects).flatMap(o=>(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>p.works||[])));
  const allMats=(obj?[obj]:db.objects).flatMap(o=>(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>p.mats||[])));
  const year=new Date().getFullYear()+yearOffset;
  const monthAmounts=Array(12).fill(0);
  const todayMonth=new Date().getMonth();
  const allPayments=(obj?[obj]:db.objects).flatMap(o=>o.payments||[]);
  const hasHistory=allPayments.some(p=>p.ts)||allMats.some(m=>m.addedAt);
  if(hasHistory){
    allPayments.forEach(p=>{
      if(!p.ts)return;
      const d=new Date(p.ts);
      if(d.getFullYear()===year)monthAmounts[d.getMonth()]+=p.amount||0;
    });
    allMats.forEach(m=>{
      if(!m.addedAt)return;
      const d=new Date(m.addedAt);
      if(d.getFullYear()===year)monthAmounts[d.getMonth()]+=(m.qty||0)*(m.price||0);
    });
  }else{
    // Fallback: нет timestamp — кладём всё в текущий месяц
    const totalPaid=allWorks.reduce((a,w)=>a+(w.paid||0),0);
    const totalMats=allMats.reduce((a,m)=>a+(m.qty||0)*(m.price||0),0);
    monthAmounts[todayMonth]=totalPaid+totalMats;
  }
  const MONTHS=['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  const isPastYear=yearOffset<0;
  const months=monthAmounts.map((amount,i)=>({label:MONTHS[i],amount:Math.round(amount),isNow:i===todayMonth&&!isPastYear,isFuture:!isPastYear&&i>todayMonth}));
  const yearTotal=months.filter(m=>!m.isFuture).reduce((a,m)=>a+m.amount,0);
  return{months,yearTotal,year,hasHistory};
}
function monthDetailHTML(monthIdx,obj){
  // Собираем работы с контекстом этапа
  const allWorksCtx=(obj?[obj]:db.objects).flatMap(o=>(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>(p.works||[]).map(w=>({...w,stageName:tName(s)||s.name,posName:p.name})))));
  const allMats=(obj?[obj]:db.objects).flatMap(o=>(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>(p.mats||[]).map(m=>({...m,stageName:tName(s)||s.name})))));
  const year=new Date().getFullYear();
  const MONTHS_FULL=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const works=[],mats=[];
  // Выплаты из единого леджера obj.payments[] за этот месяц
  (obj?[obj]:db.objects).forEach(o=>(o.payments||[]).forEach(p=>{
    if(!p.ts)return;
    const d=new Date(p.ts);
    if(d.getFullYear()!==year||d.getMonth()!==monthIdx)return;
    const wk=allWorksCtx.find(w=>w.id===p.workId);
    works.push({name:(wk&&wk.name)||p.note||(lang==='ru'?'Выплата':'Payment'),contractor:p.contractor||(wk&&wk.contractor)||'',stageName:(wk&&wk.stageName)||'',dayAmt:p.amount||0,ts:p.ts});
  }));
  const hasHistoryYear=allMats.some(m=>m.addedAt)||(obj?[obj]:db.objects).some(o=>(o.payments||[]).some(p=>p.ts));
  allMats.forEach(m=>{
    if(!m.addedAt){
      if(!hasHistoryYear&&monthIdx===new Date().getMonth())
        mats.push({...m,dayAmt:Math.round((m.qty||0)*(m.price||0))});
      return;
    }
    const d=new Date(m.addedAt);
    if(d.getFullYear()===year&&d.getMonth()===monthIdx)
      mats.push({...m,dayAmt:Math.round((m.qty||0)*(m.price||0))});
  });
  if(!hasHistoryYear&&monthIdx===new Date().getMonth()){
    allWorksCtx.forEach(w=>{if(w.paid>0)works.push({name:w.name,contractor:w.contractor||'',stageName:w.stageName,dayAmt:w.paid,ts:Date.now()});});
  }
  const dTotal=[...works,...mats].reduce((a,x)=>a+x.dayAmt,0);
  if(dTotal===0)return`<div id="dayDetail" style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:20px;margin-top:16px;margin-bottom:32px;text-align:center;color:var(--text3);font-size:13px;animation:spendFadeIn .2s ease">${l3('Нет данных за этот месяц','Bu ay məlumat yoxdur','No data for this month')}</div>`;
  let rowIdx=0;
  const row=(inner)=>{const d=rowIdx*50;rowIdx++;return`<div style="animation:spendRowIn .3s ease ${d}ms both">${inner}</div>`;};
  return`<div id="dayDetail" style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;overflow:hidden;margin-top:16px;margin-bottom:32px;animation:spendFadeIn .2s ease">
    <div style="padding:14px 16px 12px;border-bottom:1px solid var(--border)">
      <div style="font-size:11px;color:var(--gold);margin-bottom:4px">${MONTHS_FULL[monthIdx]} ${year}</div>
      <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700">${fmtShort(dTotal)}</div>
    </div>
    ${works.length?`<div style="padding:10px 16px 4px;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">${l3('Рабочие','İşçilər','Labor')}</div>
    ${works.sort((a,b)=>a.ts-b.ts).map((w,i)=>{
      const ds=w.ts?new Date(w.ts).toLocaleDateString('ru-RU',{day:'2-digit',month:'short'}):'';
      return row(`<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;${i<works.length-1||mats.length?'border-bottom:1px solid var(--border)':''}">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(123,184,204,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ph ph-hard-hat" style="font-size:16px;color:var(--blue)"></i></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.name}</div>
          <div style="font-size:11px;color:var(--text3)">${w.stageName||''}</div>
          <div style="font-size:11px;color:var(--text3)">${[w.contractor,ds].filter(Boolean).join(' · ')}</div>
        </div>
        <div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700;flex-shrink:0">${fmtShort(w.dayAmt)}</div>
      </div>`);
    }).join('')}`:''}
    ${mats.length?`<div style="padding:10px 16px 4px;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">${l3('Материалы','Materiallar','Materials')}</div>
    ${mats.map((m,i)=>{
      const ds=m.addedAt?new Date(m.addedAt).toLocaleDateString('ru-RU',{day:'2-digit',month:'short'}):'';
      return row(`<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;${i<mats.length-1?'border-bottom:1px solid var(--border)':''}">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(128,200,154,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ph ph-package" style="font-size:16px;color:var(--green)"></i></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.name}</div>
          <div style="font-size:11px;color:var(--text3)">${m.stageName||''}</div>
          <div style="font-size:11px;color:var(--text3)">${[m.qty+' '+m.unit,ds].filter(Boolean).join(' · ')}</div>
        </div>
        <div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700;flex-shrink:0">${fmtShort(m.dayAmt)}</div>
      </div>`);
    }).join('')}`:''}
  </div>`;
}
function showSpendDetail(objId){
  const o=(objId&&(db.objects||[]).find(x=>x.id===objId))||curObj();if(!o)return;
  let weekOffset=0,yearOffset=0;
  const{laborPaid,matsCost}=getSpendBreakdown(o);
  const dayWeights=[.19,.13,.22,.12,.21,.06,.07];
  // Все работы и материалы объекта с контекстом этапа
  const allWorks=(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>(p.works||[]).map(w=>({...w,stageName:tName(s)||s.name})))).filter(w=>w.paid>0);
  const allMats=(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>(p.mats||[]).map(m=>({...m,stageName:tName(s)||s.name})))).filter(m=>m.qty>0&&m.price>0);
  // Дефолт — сегодня или последний прошедший день (текущая неделя)
  const _initWeek=getWeeklyData(o,0);
  const todayI=_initWeek.days.findIndex(d=>d.isToday);
  let selIdx=todayI>=0?todayI:_initWeek.days.filter(d=>!d.isFuture).length-1;

  function dayDetailHTML(idx,days,monday,hasHistory){
    if(!days[idx]||days[idx].isFuture)return`<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">${l3('Данных пока нет','Məlumat yoxdur','No data yet')}</div>`;
    // Дата выбранного дня
    const dayDate=new Date(monday);
    dayDate.setDate(monday.getDate()+idx);
    const dayStart=new Date(dayDate);dayStart.setHours(0,0,0,0);
    const dayEnd=new Date(dayDate);dayEnd.setHours(23,59,59,999);
    const dateStr=dayDate.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
    // Реальные платежи из единого леджера obj.payments[] в окне дня
    const realPayments=[];
    (o.payments||[]).forEach(p=>{
      if(!(p.ts>=dayStart.getTime()&&p.ts<=dayEnd.getTime()))return;
      const wk=allWorks.find(w=>w.id===p.workId);
      realPayments.push({name:(wk&&wk.name)||p.note||(lang==='ru'?'Выплата':'Payment'),contractor:p.contractor||(wk&&wk.contractor)||'',stageName:(wk&&wk.stageName)||'',dayAmt:p.amount||0});
    });
    // Реальные материалы по дате добавления
    const realMats=allMats.filter(m=>{
      const ts=m.addedAt||0;
      return ts>=dayStart.getTime()&&ts<=dayEnd.getTime()&&(m.qty||0)*(m.price||0)>0;
    }).map(m=>({...m,dayAmt:Math.round((m.qty||0)*(m.price||0))}));
    // Если нет реальных дат и сегодня — показываем все данные без дат
    const isToday=days[idx]?.isToday;
    const dayWorks=realPayments.length>0?realPayments
      :(!hasHistory&&isToday?allWorks.filter(wk=>wk.paid>0).map(wk=>({name:wk.name,contractor:wk.contractor||'',dayAmt:wk.paid})):[]);
    const dayMatsArr=realMats.length>0?realMats
      :(!hasHistory&&isToday?allMats.filter(m=>(m.qty||0)*(m.price||0)>0).map(m=>({...m,dayAmt:Math.round((m.qty||0)*(m.price||0))})):[]);
    const dTotal=[...dayWorks,...dayMatsArr].reduce((a,x)=>a+x.dayAmt,0);
    let rowIdx=0;
    const row=(inner)=>{const d=rowIdx*55;rowIdx++;return`<div style="animation:spendRowIn .3s ease ${d}ms both">${inner}</div>`;};
    return`
      <div id="dayDetail" style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;overflow:hidden;margin-top:16px;margin-bottom:32px;animation:spendFadeIn .2s ease">
        <div style="padding:14px 16px 12px;border-bottom:1px solid var(--border)">
          <div style="font-size:11px;color:var(--gold);text-transform:capitalize;margin-bottom:4px">${dateStr}</div>
          <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700">${fmtShort(dTotal)}</div>
        </div>
        ${dayWorks.length?`
          <div style="padding:10px 16px 4px;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">${l3('Рабочие','İşçilər','Labor')}</div>
          ${dayWorks.map((wk,i)=>row(`
            <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;${i<dayWorks.length-1||dayMatsArr.length?'border-bottom:1px solid var(--border)':''}">
              <div style="width:34px;height:34px;border-radius:10px;background:rgba(123,184,204,.12);display:flex;align-items:center;justify-content:center">
                <i class="ph ph-hard-hat" style="font-size:16px;color:var(--blue)"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${wk.name}</div>
                ${wk.stageName?`<div style="font-size:11px;color:var(--text3)">${wk.stageName}</div>`:''}
                <div style="font-size:11px;color:var(--text3)">${wk.contractor||''}</div>
              </div>
              <div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700;color:var(--text)">${fmtShort(wk.dayAmt)}</div>
            </div>`)).join('')}`:''}
        ${dayMatsArr.length?`
          <div style="padding:10px 16px 4px;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">${l3('Материалы','Materiallar','Materials')}</div>
          ${dayMatsArr.map((m,i)=>row(`
            <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;${i<dayMatsArr.length-1?'border-bottom:1px solid var(--border)':''}">
              <div style="width:34px;height:34px;border-radius:10px;background:rgba(128,200,154,.12);display:flex;align-items:center;justify-content:center">
                <i class="ph ph-package" style="font-size:16px;color:var(--green)"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.name}</div>
                <div style="font-size:11px;color:var(--text3)">${m.qty} ${m.unit}${m.addedAt?' · '+new Date(m.addedAt).toLocaleDateString('ru-RU',{day:'2-digit',month:'short'}):''}</div>
              </div>
              <div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700;color:var(--text)">${fmtShort(m.dayAmt)}</div>
            </div>`)).join('')}`:''}
      </div>`;
  }

  const el=document.createElement('div');
  el.id='spendPage';
  el.style.cssText='position:fixed;inset:0;background:var(--bg);z-index:200;overflow-y:auto;-webkit-overflow-scrolling:touch;animation:slideUp .25s ease';
  let period='week'; // 'week' | 'year'
  function buildHTML(si){
    const isYear=period==='year';
    const{days,weekTotal,monday,hasHistory,weekLabel}=getWeeklyData(o,weekOffset);
    const wMax=Math.max(...days.map(d=>d.amount),1);
    const{months,yearTotal,year}=getYearlyData(o,yearOffset);
    const yMax=Math.max(...months.map(m=>m.amount),1);
    const total=isYear?yearTotal:weekTotal;
    const isCurrentPeriod=isYear?(yearOffset===0):(weekOffset===0);
    const navBtn=(dir,label)=>`<button onclick="_spendNav(${dir})" style="background:rgba(255,255,255,.07);border:none;border-radius:8px;padding:5px 10px;color:${dir===1&&isCurrentPeriod?'var(--text3)':'var(--text)'};cursor:${dir===1&&isCurrentPeriod?'default':'pointer'};font-size:12px;font-family:'Mulish',sans-serif;opacity:${dir===1&&isCurrentPeriod?.35:1}">${label}</button>`;
    const periodLabel=isYear?String(year):weekLabel;
    const barsHTML=isYear
      ?months.map((m,i)=>{
          const barH=m.isFuture?8:Math.max(6,Math.round((m.amount/yMax)*110));
          const isSel=i===si;
          const barBg=m.isFuture?'rgba(255,255,255,.07)':isSel?'linear-gradient(180deg,rgba(201,170,124,1) 0%,rgba(201,170,124,.55) 100%)':'linear-gradient(180deg,rgba(201,170,124,.45) 0%,rgba(201,170,124,.18) 100%)';
          const amtStr=m.isFuture?'':m.amount>=1000?(Math.round(m.amount/100)/10)+'k':String(m.amount);
          return`<div onclick="_spendSel(${i})" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;height:120px;cursor:pointer">
            <div style="font-family:'DM Mono',monospace;font-size:8px;color:${isSel?'var(--gold)':'var(--text3)'};min-height:10px">${amtStr}</div>
            <div style="width:100%;height:${barH}px;border-radius:4px 4px 2px 2px;background:${barBg}${isSel?';box-shadow:0 0 8px rgba(201,170,124,.3)':''};animation:barGrow .4s cubic-bezier(.34,1.2,.64,1) ${i*25}ms both;transform-origin:bottom"></div>
            <div style="font-size:8px;font-weight:${isSel?'700':'400'};color:${isSel?'var(--gold)':'var(--text3)'}">${m.label}</div>
          </div>`;
        }).join('')
      :days.map((d,i)=>{
          const barH=d.isFuture?10:Math.max(8,Math.round((d.amount/wMax)*110));
          const isSel=i===si;
          const barBg=d.isFuture?'rgba(255,255,255,.07)':isSel?'linear-gradient(180deg,rgba(201,170,124,1) 0%,rgba(201,170,124,.55) 100%)':'linear-gradient(180deg,rgba(201,170,124,.45) 0%,rgba(201,170,124,.18) 100%)';
          const amtStr=d.isFuture?'':d.amount>=1000?(Math.round(d.amount/100)/10)+'k':String(d.amount);
          return`<div onclick="_spendSel(${i})" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;height:120px;cursor:pointer">
            <div class="bar-amt" style="font-family:'DM Mono',monospace;font-size:9px;color:${isSel?'var(--gold)':'var(--text3)'};min-height:12px">${amtStr}</div>
            <div data-bar style="width:100%;height:${barH}px;border-radius:5px 5px 2px 2px;background:${barBg}${isSel?';box-shadow:0 0 10px rgba(201,170,124,.3)':''};animation:barGrow .4s cubic-bezier(.34,1.2,.64,1) ${i*40}ms both;transform-origin:bottom"></div>
            <div class="bar-lbl" style="font-size:10px;font-weight:${isSel?'700':'500'};color:${isSel?'var(--gold)':'var(--text3)'}">${d.label}</div>
          </div>`;
        }).join('');
    return`<div style="padding:calc(env(safe-area-inset-top,0px) + 16px) 16px 0">
      <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:16px">
        <button class="back-btn" onclick="document.getElementById('spendPage').remove()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${l3('Назад','Geri','Back')}</button>
        <div style="flex:1;font-family:'Unbounded',sans-serif;font-size:14px;font-weight:700">${l3('Расходы','Xərclər','Expenses')}</div>
        <div style="display:flex;background:var(--bg3);border-radius:10px;padding:3px;gap:2px;border:1px solid var(--border)">
          <button onclick="_spendPeriod('week')" style="padding:5px 12px;border-radius:8px;border:none;font-size:12px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer;transition:all .2s;background:${!isYear?'var(--gold)':'transparent'};color:${!isYear?'var(--bg)':'var(--text3)'}">${l3('Неделя','Həftə','Week')}</button>
          <button onclick="_spendPeriod('year')" style="padding:5px 12px;border-radius:8px;border:none;font-size:12px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer;transition:all .2s;background:${isYear?'var(--gold)':'transparent'};color:${isYear?'var(--bg)':'var(--text3)'}">${l3('Год','İl','Year')}</button>
        </div>
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:28px;font-weight:700;color:var(--text);margin-bottom:12px">${fmtShort(total)}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        ${navBtn(-1,'←')}
        <div style="font-size:13px;color:var(--text2);font-weight:600">${periodLabel}</div>
        ${navBtn(1,'→')}
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:16px 14px 12px">
        <div style="display:flex;align-items:flex-end;gap:${isYear?3:6}px;height:120px">${barsHTML}</div>
      </div>
      ${isYear?monthDetailHTML(si,o):dayDetailHTML(si,days,monday,hasHistory)}
    </div>`;
  }
  el.innerHTML=buildHTML(selIdx);
  window._spendSel=function(i){
    if(i===selIdx)return;
    selIdx=i;
    const scrollY=el.scrollTop;
    el.innerHTML=buildHTML(i);
    el.scrollTop=scrollY;
  };
  window._spendPeriod=function(p){
    period=p; weekOffset=0; yearOffset=0;
    selIdx=period==='week'?0:new Date().getMonth();
    el.innerHTML=buildHTML(selIdx);
  };
  window._spendNav=function(dir){
    // dir: -1 назад, +1 вперёд
    if(period==='week'){
      if(dir===1&&weekOffset===0)return; // нельзя идти в будущее
      weekOffset+=dir;
      selIdx=weekOffset===0?0:3; // середина недели для прошлых
    }else{
      if(dir===1&&yearOffset===0)return;
      yearOffset+=dir;
      selIdx=yearOffset===0?new Date().getMonth():6;
    }
    el.innerHTML=buildHTML(selIdx);
  };
  document.body.appendChild(el);
  // Свайп вправо для закрытия
  let tx0=0,ty0=0,swiping=false;
  el.addEventListener('touchstart',e=>{
    tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;swiping=false;
  },{passive:true});
  el.addEventListener('touchmove',e=>{
    const dx=e.touches[0].clientX-tx0;
    const dy=Math.abs(e.touches[0].clientY-ty0);
    if(!swiping&&dx>12&&dy<dx){swiping=true;}
    if(swiping){
      const t=Math.max(0,dx);
      el.style.transform=`translateX(${t}px)`;
      el.style.opacity=String(Math.max(0,1-t/300));
    }
  },{passive:true});
  el.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-tx0;
    el.style.transition='transform .25s ease,opacity .25s ease';
    if(swiping&&dx>80){
      el.style.transform='translateX(100%)';el.style.opacity='0';
      setTimeout(()=>el.remove(),250);
    }else{
      el.style.transform='';el.style.opacity='';
      setTimeout(()=>el.style.transition='',250);
    }
    swiping=false;
  },{passive:true});
}
function showOverdueModal(objId){
  const o=db.objects.find(x=>x.id===objId);if(!o)return;
  const today=new Date();today.setHours(0,0,0,0);
  const dleft=ed=>{const e=new Date(ed);e.setHours(0,0,0,0);return Math.round((today-e)/(1000*60*60*24));};
  const dw=lang==='ru'?'дн.':lang==='az'?'gün':'d';
  const groups=(o.stages||[]).map(s=>{
    const items=[];
    (s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{if(isOverdue(w))items.push({w,p});}));
    items.sort((a,b)=>dleft(b.w.endDate)-dleft(a.w.endDate));
    return{s,items};
  }).filter(g=>g.items.length>0);
  const total=groups.reduce((a,g)=>a+g.items.length,0);
  if(total===0){showToast(lang==='ru'?'Просрочек нет':lang==='az'?'Gecikmə yoxdur':'No overdue');return;}
  const body=groups.map(g=>`
    <div style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:9px;padding:0 2px">
        <span style="font-size:16px">${g.s.icon||'🏗'}</span>
        <span style="font-size:13px;font-weight:700;color:var(--text2)">${tName(g.s)||g.s.name}</span>
        <span style="font-size:11px;color:var(--text3);margin-left:auto">${g.items.length}</span>
      </div>
      ${g.items.map(({w,p})=>{const d=dleft(w.endDate);
        return`<div onclick="closeModal();db.activeObjectId='${o.id}';goDetail('${g.s.id}');goPos('${p.id}')" style="display:flex;align-items:center;gap:11px;background:var(--bg2);border:1px solid rgba(204,123,123,.22);border-radius:12px;padding:11px 13px;margin-bottom:7px;cursor:pointer">
          <div style="flex:1;min-width:0">
            <div style="font-size:14px;font-weight:700;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${w.name}</div>
            <div style="font-size:12px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${tName(p)||p.name}${w.contractor?' · '+w.contractor:''}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px;flex-shrink:0">
            <span style="font-size:13px;font-weight:700;color:var(--red)">${d} ${dw}</span>
            <span style="font-size:10px;color:var(--text3)">${w.endDate}</span>
          </div>
          <i class="ph ph-caret-right" style="font-size:15px;color:var(--text3);flex-shrink:0"></i>
        </div>`;}).join('')}
    </div>`).join('');
  showModal(`<div class="modal-handle"></div>
    <div style="display:flex;align-items:center;gap:9px;margin-bottom:18px">
      <div style="width:34px;height:34px;border-radius:10px;background:rgba(204,123,123,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ph ph-warning" style="font-size:19px;color:var(--red)"></i></div>
      <div style="flex:1">
        <div style="font-size:17px;font-weight:700">${lang==='ru'?'Просрочено':lang==='az'?'Gecikmiş':'Overdue'}</div>
        <div style="font-size:12px;color:var(--text3)">${total} ${lang==='ru'?'работ':lang==='az'?'iş':'works'} · ${tName(o)||o.name}</div>
      </div>
    </div>
    <div style="max-height:60vh;overflow-y:auto;-webkit-overflow-scrolling:touch">${body}</div>`);
}
function showStagesPage(){
  const o=curObj();if(!o)return;
  const st=o.stages||[];
  const stOrd={active:0,idle:1,done:2};
  const stSorted=[...st].sort((a,b)=>(stOrd[a.status]??1)-(stOrd[b.status]??1));
  const el=document.createElement('div');
  el.id='stagesPage';
  el.style.cssText='position:fixed;inset:0;background:var(--bg);z-index:200;overflow-y:auto;-webkit-overflow-scrolling:touch;animation:slideUp .25s ease';
  const stHtml=stSorted.length?stSorted.map((s,i)=>{
    const sm=stageSmeta(s),fc=stageFact(s);
    const pc=(s.positions||[]).length,dc=(s.positions||[]).filter(p=>p.status==='done').length;
    const sOvCount=stageOverdueCount(s);
    const _sPos=s.positions||[],_sDone=_sPos.filter(function(p){return p.status==='done';}).length,sPct=s.status==='done'?100:(_sPos.length>0?Math.round(_sDone/_sPos.length*100):0);
    const isDone=s.status==='done',isIdle=s.status==='idle';
    const borderCol=isDone?s.color:isIdle?'rgba(255,255,255,.12)':s.color;
    const opacity=isIdle?'.65':'1';
    return`<div class="proj-card" style="animation-delay:${i*.07}s;border-left:3px solid ${borderCol};opacity:${opacity};${stageHasOverdue(s)?'border-color:rgba(204,123,123,.5);':''}" onclick="document.getElementById('stagesPage').remove();goDetail('${s.id}')">
      <div class="proj-card-icon" style="background:rgba(255,255,255,.06);border-radius:12px">${s.icon||'🏗'}</div>
      <div class="proj-card-info">
        <div class="proj-card-name">${tName(s)}</div>
        <div class="proj-card-meta">${pc>0?dc+'/'+pc+' поз':'—'} · ${isDone?fmtShort(fc):isIdle?'—':fmtShort(fc)}</div>
        ${sOvCount>0?`<div style="font-size:11px;color:var(--red)"><i class="ph ph-warning"></i> ${sOvCount} просрочено</div>`:''}
      </div>
      <div class="proj-card-ring">${ringHTML(sPct,isDone?'#80C89A':isIdle?'rgba(255,255,255,.15)':s.color,52)}</div>
    </div>`;
  }).join(''):`<div class="empty"><div style="font-size:48px;opacity:.3;margin-bottom:12px"><i class="ph ph-buildings"></i></div><div style="font-size:14px;margin-bottom:20px">${t('noStages')}</div><button class="btn btn-primary" style="max-width:220px;margin:0 auto" onclick="showStageModal(null)">＋ ${t('addStage')}</button></div>`;
  el.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 16px) 16px 32px">
    <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:16px">
      <button class="back-btn" onclick="document.getElementById('stagesPage').remove()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('backBtn')}</button>
      <div style="flex:1;font-family:'Unbounded',sans-serif;font-size:14px;font-weight:700">${tName(o)||o.name}</div>
      <button onclick="showStageModal(null)" style="background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.2);color:var(--gold);border-radius:10px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:Mulish,sans-serif">＋ ${lang==='ru'?'Этап':'Stage'}</button>
    </div>
    ${stHtml}
  </div>`;
  document.body.appendChild(el);
  // Свайп вправо для закрытия
  let tx0=0,ty0=0,sw=false;
  el.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;sw=false;},{passive:true});
  el.addEventListener('touchmove',e=>{const dx=e.touches[0].clientX-tx0,dy=Math.abs(e.touches[0].clientY-ty0);if(!sw&&dx>12&&dy<dx)sw=true;if(sw){const t=Math.max(0,dx);el.style.transform=`translateX(${t}px)`;el.style.opacity=String(Math.max(0,1-t/300));}},{passive:true});
  el.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx0;el.style.transition='transform .25s,opacity .25s';if(sw&&dx>80){el.style.transform='translateX(100%)';el.style.opacity='0';setTimeout(()=>el.remove(),250);}else{el.style.transform='';el.style.opacity='';setTimeout(()=>el.style.transition='',250);}sw=false;},{passive:true});
}
function getTodayData(o){
  const now=new Date();
  const dayStart=new Date(now);dayStart.setHours(0,0,0,0);
  const dayEnd=new Date(now);dayEnd.setHours(23,59,59,999);
  const allPos=(o.stages||[]).flatMap(s=>(s.positions||[]).map(p=>({...p,stageName:tName(s)||s.name,stageColor:s.color})));
  // Кто сегодня на объекте — работы начаты, не завершены, есть подрядчик
  const todayStr2=now.toISOString().slice(0,10);
  const onSite=[];
  const ctrs=new Set();
  allPos.forEach(p=>(p.works||[]).forEach(w=>{
    if(!w.done&&w.contractor&&!ctrs.has(w.contractor)&&(!w.startDate||w.startDate<=todayStr2)){ctrs.add(w.contractor);onSite.push({name:w.contractor,work:w.name,stage:p.stageName});}
  }));
  // Выплачено сегодня — из единого леджера obj.payments[]
  let todayPaid=0;
  const todayPayments=[];
  (o.payments||[]).forEach(p=>{
    if(p.ts>=dayStart.getTime()&&p.ts<=dayEnd.getTime()){
      todayPaid+=p.amount||0;
      const wk=allPos.flatMap(pp=>pp.works||[]).find(w=>w.id===p.workId);
      todayPayments.push({amount:p.amount||0,contractor:p.contractor||(wk&&wk.contractor)||'',work:(wk&&wk.name)||p.note||''});
    }
  });
  // Материалы добавленные сегодня
  const todayMats=[];
  allPos.forEach(p=>(p.mats||[]).forEach(m=>{
    if(m.addedAt&&m.addedAt>=dayStart.getTime()&&m.addedAt<=dayEnd.getTime())
      todayMats.push({name:m.name,qty:m.qty,unit:m.unit});
  }));
  // Позиции завершённые сегодня
  const todayPosDone=[];
  allPos.forEach(p=>{
    if(p.status==='done'){
      // Проверяем последнюю запись журнала с типом stage_done или по последнему paymentHistory
      const lastPay=((p.works||[]).flatMap(w=>w.paymentHistory||[])).sort((a,b)=>b.ts-a.ts)[0];
      if(lastPay&&lastPay.ts>=dayStart.getTime()&&lastPay.ts<=dayEnd.getTime())
        todayPosDone.push({name:p.name,stage:p.stageName});
    }
  });
  return{onSite,todayPaid,todayPayments,todayMats,todayPosDone,todayDeadlines:[]};
}
function quickNotePrompt(){
  const wrap=document.getElementById('quickNoteWrap');
  if(!wrap)return;
  const isOpen=wrap.style.display!=='none';
  if(isOpen){wrap.style.display='none';return;}
  wrap.style.display='flex';
  setTimeout(()=>document.getElementById('quickNoteInp')?.focus(),50);
}
function saveQuickNote(){
  const inp=document.getElementById('quickNoteInp');
  const text=inp?.value.trim();
  if(!text)return;
  const o=curObj();if(!o)return;
  const pending=_journalPendingPhoto;
  _journalPendingPhoto=null;
  const meta=pending?{photoId:pending.photoId}:{};
  const camBtn=document.getElementById('quickNoteCamBtn');
  if(camBtn)camBtn.style.color='rgba(234,230,222,.35)';
  const typ=window._quickType||'note';
  let _done=false;
  function _finish(){
    if(_done)return;_done=true;
    addJournalEntry(o.id,typ,text,meta);
    window._quickType=null;
    saveDB();
    inp.value='';
    const wrap=document.getElementById('quickNoteWrap');
    if(wrap)wrap.style.display='none';
    renderDashBottom();
    showToast(l3('Записано ✓','Yadda saxlandı ✓','Saved ✓'));
  }
  if(pending){
    savePhoto(pending.photoId,pending.dataUrl).then(_finish).catch(function(e){console.warn('photo save err',e);_finish();});
  } else {
    _finish();
  }
}
function todayBlockHTML(o){
  const td=getTodayData(o);
  const ds=new Date();ds.setHours(0,0,0,0);
  const allJ=(o.journal||[]).slice().sort((a,b)=>b.ts-a.ts);
  const tj=allJ.filter(e=>e.ts>=ds.getTime());
  const past=allJ.filter(e=>e.ts<ds.getTime()).slice(0,3);
  const att=tj.find(e=>e.type==='worker'&&e.meta&&e.meta.attendance);
  const tjShow=tj.filter(e=>!(e.meta&&e.meta.attendance));
  const loc=lang==='az'?'az-AZ':lang==='en'?'en-US':'ru-RU';
  const dateStr=new Date().toLocaleDateString(loc,{weekday:'short',day:'numeric',month:'long'});
  const pillSt='display:inline-flex;align-items:center;gap:7px;padding:7px 11px;background:var(--bg3);border:1px solid var(--border);border-radius:11px;font-size:12px;cursor:pointer';
  const stats=[];
  if(td.todayPaid>0)stats.push(`<div onclick="showSpendDetail()" style="${pillSt}"><i class="ph ph-coins" style="font-size:14px;color:var(--green)"></i><span style="color:var(--text2)">${l3('Потрачено','Xərc','Spent')}</span><b style="font-family:'DM Mono',monospace;color:var(--green)">${fmtShort(td.todayPaid)}</b></div>`);
  if(td.onSite.length>0){
    const total=att?((att.meta.names?att.meta.names.length:0)+(att.meta.extra||0)):0;
    const nm=att?(total+' '+l3('чел сегодня','nəfər','on site')):(td.onSite[0].name+(td.onSite.length>1?' +'+(td.onSite.length-1):''));
    const dot=att?'<span style="width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0"></span>':'';
    stats.push(`<div onclick="showCrewAttendance()" style="${pillSt}"><i class="ph ph-users" style="font-size:14px;color:var(--gold)"></i>${dot}<span style="color:var(--text);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${nm}</span></div>`);
  }
  const events=tjShow.map(e=>{
    const tm=new Date(e.ts).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
    const icon=(typeof JOURNAL_ICONS!=='undefined'&&JOURNAL_ICONS[e.type])||'<i class="ph ph-info"></i>';
    const color=(typeof JOURNAL_COLORS!=='undefined'&&JOURNAL_COLORS[e.type])||'var(--text3)';
    const canDel=e.type==='note'||e.type==='delivery'||e.type==='worker'||e.type==='problem'||e.type==='task';
    return`<div style="display:flex;align-items:flex-start;gap:9px;padding:7px 0">
      <span style="font-size:14px;color:${color};flex-shrink:0;margin-top:1px">${icon}</span>
      <div style="flex:1;min-width:0;font-size:12.5px;color:var(--text);line-height:1.35">${e.text}</div>
      <span style="font-size:10px;color:var(--text3);font-family:'DM Mono',monospace;flex-shrink:0;margin-top:2px">${tm}</span>
      ${canDel?`<button onclick="event.stopPropagation();deleteJournalEntry('${e.id}')" style="background:none;border:none;color:var(--text3);font-size:13px;cursor:pointer;padding:0 0 0 2px;flex-shrink:0"><i class="ph ph-x"></i></button>`:''}
    </div>`;
  }).join('');
  // Тип события — одна кнопка слева от поля + компактный поповер над ней
  const QTYPES=[['delivery','ph-package',l3('Доставка','Çatdırılma','Delivery')],['worker','ph-users',l3('Бригада','Briqada','Crew')],['problem','ph-warning',l3('Проблема','Problem','Issue')],['task','ph-check-circle',l3('Готово','Hazır','Done')]];
  const curType=window._quickType;
  const curIc=curType?(QTYPES.find(x=>x[0]===curType)||[])[1]:'ph-plus-circle';
  const typeControl=`<div style="position:relative;flex-shrink:0">
    <div id="qtypePop" style="display:none;position:absolute;bottom:calc(100% + 8px);left:0;z-index:30;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:6px;box-shadow:0 8px 24px rgba(0,0,0,.45)">
      <div style="display:flex;gap:4px">
        ${QTYPES.map(([t,ic,lbl])=>{const act=curType===t;return`<button id="qpop_${t}" onclick="quickType('${t}')" title="${lbl}" style="width:40px;height:40px;border-radius:10px;background:${act?'rgba(201,170,124,.18)':'var(--bg2)'};border:1px solid ${act?'var(--gold)':'var(--border)'};color:${act?'var(--gold)':'var(--text2)'};font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0"><i class="ph ${ic}"></i></button>`;}).join('')}
      </div>
    </div>
    <button id="qtypeBtn" onclick="toggleQTypePop(event)" style="width:32px;height:32px;border-radius:9px;background:${curType?'rgba(201,170,124,.18)':'var(--bg3)'};border:1px solid ${curType?'var(--gold)':'var(--border)'};color:${curType?'var(--gold)':'var(--text3)'};font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0"><i class="ph ${curIc}"></i></button>
  </div>`;
  const pastRows=past.map(e=>{
    const d=new Date(e.ts);
    const dStr=d.toLocaleDateString(loc,{day:'2-digit',month:'short'});
    const ic=(typeof JOURNAL_ICONS!=='undefined'&&JOURNAL_ICONS[e.type])||'<i class="ph ph-info"></i>';
    const cl=(typeof JOURNAL_COLORS!=='undefined'&&JOURNAL_COLORS[e.type])||'var(--text3)';
    return`<div onclick="goJournal()" style="display:flex;align-items:flex-start;gap:9px;padding:6px 0;cursor:pointer">
      <span style="font-size:13px;color:${cl};flex-shrink:0;margin-top:1px;opacity:.7">${ic}</span>
      <div style="flex:1;min-width:0;font-size:12px;color:var(--text2);line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.text}</div>
      <span style="font-size:10px;color:var(--text3);font-family:'DM Mono',monospace;flex-shrink:0;margin-top:2px">${dStr}</span>
    </div>`;
  }).join('');
  const earlier=past.length?`<div onclick="goJournal()" style="display:flex;align-items:center;gap:8px;margin-top:10px;cursor:pointer">
      <span style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px">${l3('Ранее','Əvvəl','Earlier')}</span>
      <div style="flex:1;height:1px;background:var(--border)"></div>
      <span style="font-size:11px;color:var(--gold)">${l3('Весь журнал','Bütün jurnal','All')} <i class="ph ph-caret-right" style="font-size:9px"></i></span>
    </div>${pastRows}`:'';
  const noteRow=`<div style="display:flex;align-items:center;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
    ${typeControl}
    <input id="quickNoteInp" type="text" placeholder="${l3('Что произошло?..','Nə baş verdi?..','What happened?..')}" style="flex:1;min-width:0;background:none;border:none;color:var(--text);font-family:Mulish,sans-serif;font-size:13px;outline:none;-webkit-user-select:text;user-select:text;margin-left:2px" onkeydown="if(event.key==='Enter')saveQuickNote()"/>
    <button id="quickNoteCamBtn" onclick="openJournalPhotoInput()" style="background:none;border:none;cursor:pointer;color:var(--text3);padding:2px;display:flex;align-items:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></button>
    <button onclick="saveQuickNote()" style="background:none;border:none;color:var(--gold);font-size:20px;cursor:pointer;padding:2px;flex-shrink:0"><i class="ph ph-paper-plane-right"></i></button>
  </div>`;
  const isEmpty=!stats.length&&!tjShow.length&&!past.length;
  return`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:14px 16px;margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:7px;margin-bottom:${stats.length||tjShow.length?'12':'10'}px">
      <i class="ph ph-calendar" style="font-size:16px;color:var(--gold)"></i>
      <span style="font-size:13px;font-weight:700">${l3('Сегодня','Bu gün','Today')}</span>
      <span style="font-size:11px;color:var(--text3);margin-left:auto;text-transform:capitalize">${dateStr}</span>
    </div>
    ${stats.length?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:${tjShow.length?'4':'0'}px">${stats.join('')}</div>`:''}
    ${tjShow.length?`<div style="${stats.length?'border-top:1px solid var(--border);margin-top:10px;padding-top:4px;':''}">${events}</div>`:''}
    ${earlier}
    ${isEmpty?`<div style="font-size:12px;color:var(--text3);padding:2px 0 6px">${l3('Запишите что происходит на объекте','Obyektdə nə baş verir?','Log what is happening on site')}</div>`:''}
    ${noteRow}
  </div>`;
}
// Поповер выбора типа: открыть/закрыть
function toggleQTypePop(e){
  if(e)e.stopPropagation();
  const p=document.getElementById('qtypePop');if(!p)return;
  const open=p.style.display!=='block';
  p.style.display=open?'block':'none';
  if(open){
    // закрыть по тапу вне
    setTimeout(()=>{
      const close=(ev)=>{
        if(ev.target.closest('#qtypePop')||ev.target.closest('#qtypeBtn'))return;
        p.style.display='none';document.removeEventListener('click',close);
      };
      document.addEventListener('click',close);
    },0);
  }
}
// Выбрать тип быстрой записи (из поповера). Повтор по активному — снять.
function quickType(t){
  window._quickType=window._quickType===t?null:t;
  const cur=window._quickType;
  // главная кнопка
  const btn=document.getElementById('qtypeBtn');
  if(btn){
    const ic={delivery:'ph-package',worker:'ph-users',problem:'ph-warning',task:'ph-check-circle'}[cur]||'ph-plus-circle';
    btn.innerHTML='<i class="ph '+ic+'"></i>';
    btn.style.background=cur?'rgba(201,170,124,.18)':'var(--bg3)';
    btn.style.borderColor=cur?'var(--gold)':'var(--border)';
    btn.style.color=cur?'var(--gold)':'var(--text3)';
  }
  // подсветка в поповере
  ['delivery','worker','problem','task'].forEach(x=>{
    const b=document.getElementById('qpop_'+x);if(!b)return;
    const act=cur===x;
    b.style.background=act?'rgba(201,170,124,.18)':'var(--bg2)';
    b.style.borderColor=act?'var(--gold)':'var(--border)';
    b.style.color=act?'var(--gold)':'var(--text2)';
  });
  const pop=document.getElementById('qtypePop');if(pop)pop.style.display='none';
  const inp=document.getElementById('quickNoteInp');
  if(inp){
    const ph={
      delivery:['Что привезли?..','Nə gətirdilər?..','What was delivered?..'],
      worker:['Кто работает сегодня?..','Kim işləyir?..','Who is working?..'],
      problem:['Что случилось?..','Nə baş verdi?..','What happened?..'],
      task:['Что сделали?..','Nə edildi?..','What was done?..']
    }[cur];
    inp.placeholder=ph?(lang==='az'?ph[1]:lang==='en'?ph[2]:ph[0]):l3('Что произошло?..','Nə baş verdi?..','What happened?..');
    inp.focus();
  }
}
function quickEvent(type){
  const o=curObj();if(!o)return;
  const cfg={
    delivery:{ru:'Доставка',az:'Çatdırılma',en:'Delivery',ph:['Что привезли?..','Nə gətirdilər?..','What was delivered?..'],ic:'ph-package'},
    worker:{ru:'Бригада на объекте',az:'Briqada',en:'Crew on site',ph:['Кто работает сегодня?..','Kim işləyir?..','Who is working?..'],ic:'ph-users'},
    problem:{ru:'Проблема',az:'Problem',en:'Issue',ph:['Что случилось?..','Nə baş verdi?..','What happened?..'],ic:'ph-warning'},
    task:{ru:'Выполнено',az:'Hazır',en:'Done',ph:['Что сделали?..','Nə edildi?..','What was done?..'],ic:'ph-check-circle'}
  }[type];
  if(!cfg)return;
  const title=lang==='az'?cfg.az:lang==='en'?cfg.en:cfg.ru;
  const ph=lang==='az'?cfg.ph[1]:lang==='en'?cfg.ph[2]:cfg.ph[0];
  showModal(`<div class="modal-handle"></div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="width:40px;height:40px;border-radius:12px;background:rgba(201,170,124,.12);display:flex;align-items:center;justify-content:center"><i class="ph ${cfg.ic}" style="font-size:20px;color:var(--gold)"></i></div>
      <div style="font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700">${title}</div>
    </div>
    <input id="quickEventInp" type="text" placeholder="${ph}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:13px 14px;font-size:14px;color:var(--text);font-family:Mulish,sans-serif;margin-bottom:14px;-webkit-user-select:text;user-select:text" onkeydown="if(event.key==='Enter')saveQuickEvent('${type}')"/>
    <div style="display:flex;gap:10px">
      <button class="btn btn-secondary" onclick="closeModal()">${l3('Отмена','Ləğv','Cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="saveQuickEvent('${type}')">${l3('Записать','Yaz','Log')}</button>
    </div>`);
  setTimeout(()=>document.getElementById('quickEventInp')?.focus(),60);
}
function saveQuickEvent(type){
  const inp=document.getElementById('quickEventInp');
  const text=inp&&inp.value.trim();
  if(!text)return;
  const o=curObj();if(!o)return;
  addJournalEntry(o.id,type,text);
  saveDB();
  closeModal();
  renderDashBottom();
  showToast(l3('Записано ✓','Yadda saxlandı ✓','Saved ✓'));
}
function showCrewAttendance(){
  const o=curObj();if(!o)return;
  const crew=getTodayData(o).onSite;
  if(!crew.length){quickEvent('worker');return;}
  const ds=new Date();ds.setHours(0,0,0,0);
  const att=(o.journal||[]).find(e=>e.ts>=ds.getTime()&&e.type==='worker'&&e.meta&&e.meta.attendance);
  const present=att&&att.meta.names?att.meta.names:crew.map(c=>c.name);
  const extra0=att&&att.meta.extra?att.meta.extra:0;
  window._crewNames=crew.map(c=>c.name);
  const rows=crew.map((c,i)=>{
    const checked=present.indexOf(c.name)>=0;
    const sub=[c.stage,c.work].filter(Boolean).join(' · ');
    return`<label style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);cursor:pointer">
      <input type="checkbox" id="crew_${i}" ${checked?'checked':''} style="width:20px;height:20px;accent-color:var(--gold);flex-shrink:0"/>
      <div style="width:34px;height:34px;border-radius:50%;background:rgba(201,170,124,.15);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--gold);flex-shrink:0">${c.name[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:600">${c.name}</div>
        ${sub?`<div style="font-size:11px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${sub}</div>`:''}
      </div>
    </label>`;
  }).join('');
  showModal(`<div class="modal-handle"></div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="width:40px;height:40px;border-radius:12px;background:rgba(201,170,124,.12);display:flex;align-items:center;justify-content:center"><i class="ph ph-users" style="font-size:20px;color:var(--gold)"></i></div>
      <div><div style="font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700">${l3('Кто сегодня','Bu gün kim','On site today')}</div><div style="font-size:11px;color:var(--text3)">${l3('Отметьте кто на объекте','Obyektdə kim var','Mark who is on site')}</div></div>
    </div>
    ${rows}
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px">
      <span style="font-size:13px;color:var(--text2)">${l3('Ещё рабочих','Əlavə işçi','Extra workers')}</span>
      <input type="number" id="crewExtra" min="0" value="${extra0||''}" placeholder="0" style="width:70px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:8px 10px;font-size:14px;color:var(--text);font-family:'DM Mono',monospace;text-align:center;-webkit-user-select:text;user-select:text"/>
    </div>
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="btn btn-secondary" onclick="closeModal()">${l3('Отмена','Ləğv','Cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="saveCrewAttendance()">${l3('Отметить','Qeyd et','Mark')}</button>
    </div>`);
}
function saveCrewAttendance(){
  const o=curObj();if(!o)return;
  const names=(window._crewNames||[]).filter((n,i)=>document.getElementById('crew_'+i)&&document.getElementById('crew_'+i).checked);
  const extra=parseInt(document.getElementById('crewExtra')?.value)||0;
  const total=names.length+extra;
  if(total<=0){showToast(l3('Никто не отмечен','Heç kim','Nobody marked'),'err');return;}
  let txt=names.join(', ');
  if(extra>0)txt+=(names.length?' + ':'')+extra+' '+l3('раб.','işçi','workers');
  txt+=' · '+total+' '+l3('чел','nəfər','ppl');
  const ds=new Date();ds.setHours(0,0,0,0);
  o.journal=(o.journal||[]).filter(e=>!(e.ts>=ds.getTime()&&e.type==='worker'&&e.meta&&e.meta.attendance));
  addJournalEntry(o.id,'worker',txt,{attendance:true,names:names,extra:extra});
  saveDB();closeModal();renderDashBottom();
  showToast(l3('Отмечено ✓','Qeyd edildi ✓','Marked ✓'));
}
function weeklyChartHTML(o){
  if(!o)return'';
  const{days:wDays,weekTotal:wTotal}=getWeeklyData(o);
  const wMax=Math.max(...wDays.map(d=>d.amount),1);
  return`<div onclick="showSpendDetail('${o.id}')" style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:16px 16px 12px;margin-bottom:14px;cursor:pointer">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:7px">
          <i class="ph ph-chart-bar" style="font-size:15px;color:var(--gold)"></i>
          <span style="font-size:13px;font-weight:600">${l3('Расходы за неделю','Həftəlik xərclər','Weekly expenses')}</span>
        </div>
        <i class="ph ph-caret-right" style="font-size:13px;color:var(--text3)"></i>
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:20px;font-weight:700;margin-bottom:14px">${fmtShort(wTotal)}</div>
      <div style="display:flex;align-items:flex-end;gap:5px;height:72px">
        ${wDays.map(d=>{
          const barH=d.isFuture?8:Math.max(6,Math.round((d.amount/wMax)*58));
          const barBg=d.isFuture?'rgba(255,255,255,.07)':d.isToday?'linear-gradient(180deg,rgba(201,170,124,1) 0%,rgba(201,170,124,.6) 100%)':'linear-gradient(180deg,rgba(201,170,124,.55) 0%,rgba(201,170,124,.25) 100%)';
          const amtStr=d.isFuture?'':d.amount>=1000?Math.round(d.amount/100)/10+'k':d.amount;
          return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;height:72px">
            <div style="font-family:'DM Mono',monospace;font-size:8px;color:${d.isToday?'var(--gold)':'var(--text3)'};min-height:10px">${amtStr}</div>
            <div style="width:100%;height:${barH}px;border-radius:4px 4px 2px 2px;background:${barBg}"></div>
            <div style="font-size:9px;font-weight:${d.isToday?'700':'500'};color:${d.isToday?'var(--gold)':'var(--text3)'}">${d.label}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}
function startCardHTML(o){
  const btn=(kind,icon,title,sub)=>`<button onclick="seedTemplate('${kind}')" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:14px;cursor:pointer;margin-bottom:8px;font-family:Mulish,sans-serif">
    <span style="font-size:24px;flex-shrink:0">${icon}</span>
    <div style="flex:1;min-width:0">
      <div style="font-size:14px;font-weight:700;color:var(--text)">${title}</div>
      <div style="font-size:11px;color:var(--text2)">${sub}</div>
    </div>
    <i class="ph ph-arrow-right" style="font-size:16px;color:var(--gold);flex-shrink:0"></i>
  </button>`;
  return`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:16px;margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
      <i class="ph ph-stack" style="font-size:16px;color:var(--gold)"></i>
      <span style="font-size:14px;font-weight:700">${l3('С чего начать','Haradan başlayaq','Get started')}</span>
    </div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:14px">${l3('Выберите шаблон — этапы создадутся сами','Şablon seçin — mərhələlər yaranacaq','Pick a template — stages are created for you')}</div>
    ${btn('build','🏗️',l3('Стройка','Tikinti','Construction'),l3('10 этапов: фундамент → установка','10 mərhələ: özül → quraşdırma','10 stages: foundation → install'))}
    ${btn('repair','🔨',l3('Ремонт','Təmir','Renovation'),l3('7 этапов: демонтаж → установка','7 mərhələ: sökülmə → quraşdırma','7 stages: demolition → install'))}
    <button onclick="showStageModal(null)" style="display:block;width:100%;text-align:center;background:none;border:none;color:var(--text3);font-size:12px;padding:8px 0 2px;cursor:pointer;font-family:Mulish,sans-serif">${l3('или добавить этап вручную','və ya əl ilə əlavə et','or add a stage manually')}</button>
  </div>`;
}
function stagesCardHTML(o){
  const st=o.stages||[];
  if(!st.length)return'';
  const doneCount=st.filter(s=>s.status==='done').length;
  const stPct=s=>{const sm=stageSmeta(s),fc=stageFact(s);return sm>0?Math.min(Math.round(fc/sm*100),100):(s.status==='done'?100:0);};
  // ── Полоса-путь: вся последовательность одним взглядом ──
  const strip=`<div style="display:flex;gap:3px;margin-bottom:14px">${st.map(s=>{
    const isDone=s.status==='done',isActive=s.status==='active';
    const pct=isDone?100:isActive?stPct(s):0;
    const ovd=stageHasOverdue(s);
    const col=ovd?'var(--red)':isDone?'var(--green)':isActive?(s.color||'var(--gold)'):'transparent';
    return`<div style="flex:1;height:6px;border-radius:3px;overflow:hidden;background:var(--inset)"><div style="height:100%;width:${pct}%;background:${col};border-radius:3px${isActive?';box-shadow:0 0 6px '+(s.color||'var(--gold)'):''}"></div></div>`;
  }).join('')}</div>`;
  // ── Герой: активный этап ──
  const active=st.find(s=>s.status==='active');
  const idleNext=st.find(s=>s.status==='idle');
  const lastDone=[...st].reverse().find(s=>s.status==='done');
  let hero='',ctx='';
  if(active){
    const pct=stPct(active),fc=stageFact(active),sm=stageSmeta(active),debt=stageDebtStarted(active);
    const ovd=stageHasOverdue(active),ovdN=stageOverdueCount(active);
    const col=ovd?'var(--red)':(active.color||'var(--gold)');
    let dl='';
    const dlInfo=stageDeadline(active);
    if(dlInfo){
      const end=new Date(dlInfo.date+'T00:00:00'),now=new Date();now.setHours(0,0,0,0);
      const days=Math.round((end-now)/86400000),dStr=dlInfo.date.split('-').reverse().slice(0,2).join('.');
      const pref=dlInfo.src==='works'?l3('по работам','işlər üzrə','works')+': ':'';
      dl=days<0
        ?`<span style="color:var(--red)"><i class="ph ph-warning-circle" style="font-size:12px"></i> ${pref}${l3('просрочен на','gecikib','overdue')} ${Math.abs(days)} ${l3('дн','gün','d')}</span>`
        :`<span style="color:${days<=3?'var(--gold)':'var(--text3)'}"><i class="ph ph-clock" style="font-size:12px"></i> ${pref}${l3('до','-dək','by')} ${dStr} · ${days} ${l3('дн','gün','d')}</span>`;
    }
    hero=`<div onclick="goDetail('${active.id}')" style="background:var(--inset-2);border:1px solid ${ovd?'var(--red-line)':'var(--accent-line)'};border-radius:14px;padding:12px 14px;margin-bottom:10px;cursor:pointer">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
        <span style="font-size:18px;flex-shrink:0">${active.icon||'🔨'}</span>
        <span style="font-size:14px;font-weight:700;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tName(active)||active.name}</span>
        <span style="font-size:10px;font-weight:700;color:${col};background:${ovd?'var(--red-tint)':'var(--accent-tint)'};padding:3px 8px;border-radius:6px;flex-shrink:0">${ovd?(ovdN+' '+l3('просроч.','gecik.','overdue')):l3('идёт','gedir','active')}</span>
      </div>
      <div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:${pct}%;background:${col};border-radius:3px"></div></div>
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;gap:8px">
        <span style="color:var(--text2);font-family:'DM Mono',monospace">${fmtShort(fc)}${sm>0?' / '+fmtShort(sm):''}</span>
        ${debt>0?`<span style="color:var(--red);font-weight:700;font-family:'DM Mono',monospace">−${fmtShort(debt)}</span>`:''}
      </div>
      ${dl?`<div style="font-size:11px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">${dl}</div>`:''}
    </div>`;
    const nextAfter=st.slice(st.indexOf(active)+1).find(s=>s.status!=='done');
    const parts=[];
    if(lastDone)parts.push(`<span style="color:var(--green)"><i class="ph ph-check" style="font-size:10px"></i> ${tName(lastDone)||lastDone.name}</span>`);
    if(nextAfter)parts.push(`<span style="color:var(--text3)">${l3('Дальше','Sonra','Next')}: ${tName(nextAfter)||nextAfter.name}</span>`);
    if(parts.length)ctx=`<div style="display:flex;gap:8px;align-items:center;font-size:11px;flex-wrap:wrap">${parts.join('<span style="color:var(--text3)">·</span>')}</div>`;
  } else if(idleNext){
    hero=`<div onclick="goDetail('${idleNext.id}')" style="display:flex;align-items:center;gap:10px;padding:8px 2px 2px;cursor:pointer">
      <span style="font-size:18px;opacity:.75">${idleNext.icon||'🔨'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tName(idleNext)||idleNext.name}</div>
        <div style="font-size:11px;color:var(--text3)">${l3('Следующий — не начат','Növbəti — başlanmayıb','Next — not started')}</div>
      </div>
      <i class="ph ph-arrow-right" style="font-size:15px;color:var(--text3)"></i>
    </div>`;
  } else {
    hero=`<div style="text-align:center;padding:14px 0 4px"><i class="ph ph-check-circle" style="font-size:26px;color:var(--green)"></i><div style="font-size:13px;color:var(--green);font-weight:600;margin-top:6px">${l3('Все этапы готовы','Hamısı hazır','All stages done')}</div></div>`;
  }
  return`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:14px 16px;margin-bottom:14px">
    <div onclick="showStagesPage()" style="display:flex;align-items:center;gap:7px;margin-bottom:12px;cursor:pointer">
      <i class="ph ph-stack" style="font-size:15px;color:var(--gold)"></i>
      <span style="font-size:13px;font-weight:600">${l3('Этапы','Mərhələlər','Stages')}</span>
      <span style="font-size:12px;color:var(--text3)">${doneCount}/${st.length}</span>
      <i class="ph ph-caret-right" style="font-size:13px;color:var(--text3);margin-left:auto"></i>
    </div>
    ${strip}
    ${hero}
    ${ctx}
  </div>`;
}
function renderDashBottom(){
  const o=curObj();if(!o)return;
  const oSt=o.stages||[];
  const el=document.getElementById('dashBottom');if(!el)return;
  el.innerHTML=oSt.length?`
    ${todayBlockHTML(o)}
    ${stagesCardHTML(o)}

    <div style="height:8px"></div>`:`
    ${startCardHTML(o)}
    ${todayBlockHTML(o)}

    <div style="height:8px"></div>`;
}
// ── DETAIL (Stage → Positions) ──
function renderDetail(){
  const s=stages().find(st=>st.id===activeStageId);if(!s)return;
  const sm=stageSmeta(s),fc=stageFact(s),fp=sm>0?Math.min(fc/sm*100,100):0;
  const positions=s.positions||[];
  const debt=stageDebtStarted(s);
  const posDoneN=positions.filter(p=>p.status==='done').length;
  const ovdN=stageOverdueCount(s);
  const stDone=s.status==='done',stActive=s.status==='active';
  const heroCol=(ovdN>0&&!stDone)?'var(--red)':s.color;
  // Строка метаданных: дедлайн · статус · просрочка
  const metaChips=(()=>{
    const chips=[];
    const dlInfo=stageDeadline(s);
    if(dlInfo){
      const end=new Date(dlInfo.date+'T00:00:00'),today=new Date();today.setHours(0,0,0,0);
      const days=Math.round((end-today)/86400000);
      const dStr=dlInfo.date.split('-').reverse().slice(0,2).join('.');
      const pref=dlInfo.src==='works'?l3('по работам','işlər üzrə','works')+': ':'';
      if(stDone)chips.push(`<span style="color:var(--text3)"><i class="ph ph-clock" style="font-size:12px"></i> ${dStr}</span>`);
      else if(days<0)chips.push(`<span style="color:var(--red);font-weight:700"><i class="ph ph-warning-circle" style="font-size:12px"></i> ${pref}${l3('просрочен на','gecikib','overdue')} ${Math.abs(days)} ${l3('дн','gün','d')}</span>`);
      else chips.push(`<span style="color:${days<=3?'var(--gold)':'var(--text2)'}"><i class="ph ph-clock" style="font-size:12px"></i> ${pref}${l3('до','-dək','by')} ${dStr} · ${days} ${l3('дн','gün','d')}</span>`);
    }
    chips.push(stDone?`<span style="color:var(--green);font-weight:700"><i class="ph ph-check-circle" style="font-size:12px"></i> ${l3('готов','hazır','done')}</span>`
      :stActive?`<span style="color:var(--gold);font-weight:700">${l3('идёт','gedir','active')}</span>`
      :`<span style="color:var(--text3)">${l3('не начат','başlanmayıb','not started')}</span>`);
    if(ovdN>0&&!stDone)chips.push(`<span style="color:var(--red);font-weight:700"><i class="ph ph-warning" style="font-size:12px"></i> ${ovdN} ${l3('просроч.','gecik.','overdue')}</span>`);
    return chips.join('<span style="color:var(--text3)">·</span>');
  })();
  document.getElementById('detailHero').innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="back-btn" onclick="goBack()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('backBtn')}</button>
      <button class="btn btn-icon btn-sm" onclick="editStage('${s.id}')"><i class="ph ph-pencil"></i></button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:10px">
      <div style="font-size:36px">${s.icon||'🏗'}</div>
      <div style="flex:1;min-width:0">
        <div class="detail-hero-name">${tName(s)}</div>
        ${s.note?`<div style="font-size:12px;color:var(--text2);margin-top:3px;font-style:italic">${s.note}</div>`:''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700;color:${heroCol}">${Math.round(fp)}%</div>
        ${positions.length?`<div style="font-size:10px;color:var(--text3);margin-top:1px">${posDoneN}/${positions.length} ${l3('поз.','mövq.','pos.')}</div>`:''}
      </div>
    </div>
    <div style="height:6px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;margin-bottom:9px">
      <div style="height:100%;width:${fp}%;background:${heroCol};border-radius:3px;transition:width .5s"></div>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:11.5px">${metaChips}</div>
        <div id="stagePh_${s.id}" style="min-width:0"></div>
      </div>
      <button onclick="openStagePhotoInput('${s.id}')" style="width:38px;height:38px;border-radius:12px;background:${(s.photos&&s.photos.length)?'rgba(201,170,124,.15)':'rgba(255,255,255,.05)'};border:1.5px solid ${(s.photos&&s.photos.length)?'rgba(201,170,124,.4)':'rgba(255,255,255,.1)'};cursor:pointer;display:flex;align-items:center;justify-content:center;color:${(s.photos&&s.photos.length)?'var(--gold)':'rgba(234,230,222,.35)'};position:relative;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        ${(s.photos&&s.photos.length)?`<span style="position:absolute;top:-5px;right:-5px;background:var(--gold);color:#0D0F14;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center">${s.photos.length}</span>`:''}
      </button>
    </div>`;
  document.getElementById('detailContent').innerHTML=`
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;display:flex;margin-top:12px;margin-bottom:14px;overflow:hidden">
      <div style="flex:1;padding:12px 14px;border-right:1px solid var(--border)">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">${t('factShort')}</div>
        <div style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:var(--green)">${fmtShort(fc)}</div>
      </div>
      <div style="flex:1;padding:12px 14px;border-right:1px solid var(--border)">
        <div style="font-size:9px;color:${debt>0?'var(--red)':'var(--text3)'};text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">${t('debt')}</div>
        <div style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:${debt>0?'var(--red)':'var(--text3)'}">${debt>0?fmtShort(debt):'—'}</div>
      </div>
      <div style="flex:1;padding:12px 14px">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">${lang==='ru'?'Смета':'Budget'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700">${sm>0?fmtShort(sm):'—'}</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:7px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)">
      <i class="ph ph-list-checks" style="font-size:15px;color:var(--gold)"></i>
      <span style="font-size:13px;font-weight:600">${t('positions')}</span>
      ${positions.length>0?`<span style="font-size:12px;color:var(--text3);margin-left:auto">${positions.filter(p=>p.status==='done').length}/${positions.length}</span>`:''}
    </div>
    ${positions.slice().sort((a,b)=>{const o={'active':0,'idle':1,'done':2};return (o[a.status]??1)-(o[b.status]??1);}).map((p,i)=>{
      const ps=posSmeta(p),pf=posFact(p);
      const works=p.works||[],mats=p.mats||[];
      const wc=works.length,mc=mats.length;
      const wDone=works.filter(w=>w.done).length;
      const ovCount=works.filter(w=>isOverdue(w)).length;
      const pDebt=p.status==='idle'?0:posDebt(p);
      const isDone=p.status==='done',isActive=p.status==='active';
      // Бар: готова=100, активная=по деньгам (галочки работ бинарны при 1 работе), иначе по работам
      const wPct=isDone?100:isActive&&ps>0?Math.min(Math.round(pf/ps*100),100):(wc>0?Math.round(wDone/wc*100):0);
      const accent=isDone?'var(--green)':isActive?'var(--gold)':'rgba(255,255,255,.18)';
      const cardBg=isActive?'rgba(201,170,124,.05)':'var(--bg2)';
      const cardBorder=ovCount>0?'rgba(204,123,123,.4)':isActive?'rgba(201,170,124,.3)':isDone?'rgba(128,200,154,.18)':'var(--border)';
      const glow=isActive&&ovCount===0?'box-shadow:0 0 0 1px rgba(201,170,124,.12),0 4px 14px rgba(201,170,124,.05);':'';
      return`<div class="pos-card" style="animation-delay:${i*.05}s;background:${cardBg};border:1px solid ${cardBorder};border-left:3px solid ${ovCount>0?'var(--red)':accent};opacity:${isDone?'.62':'1'};${glow}cursor:pointer;padding:0" onclick="handlePosClick(event,'${p.id}')" oncontextmenu="event.preventDefault();showPosMenu(event,'${s.id}','${p.id}')" onpointerdown="startLongPress(event,'${s.id}','${p.id}')" onpointerup="cancelLongPress()" onpointercancel="cancelLongPress()" onpointermove="cancelLongPress()">
        <div style="padding:12px 14px ${wc>0?'10px':'12px'}">
          <div style="display:flex;align-items:center;gap:9px;${wc>0?'margin-bottom:9px':''}">
            ${isDone
              ?`<div style="width:18px;height:18px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0D0F14" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
              :`<div style="width:10px;height:10px;border-radius:50%;background:${accent};flex-shrink:0;box-shadow:${isActive?'0 0 6px '+accent:'none'}"></div>`}
            <div style="font-size:15px;font-weight:700;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${isDone?'color:var(--text2)':''}">${p.name}</div>
            ${wc>0?`<div style="font-family:'DM Mono',monospace;font-size:13px;font-weight:700;color:${isDone?'var(--green)':'var(--text2)'};flex-shrink:0">${wDone}/${wc}</div>`:`<div style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text3);flex-shrink:0">${ps>0?fmtShort(ps):'—'}</div>`}
          </div>
          ${wc>0?`<div style="height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${wPct}%;background:${isDone?'var(--green)':'var(--gold)'};border-radius:3px;transition:width .5s"></div>
          </div>`:''}
        </div>
        ${(wc>0||mc>0||pDebt>0||ovCount>0)?`<div style="padding:7px 14px;border-top:1px solid ${cardBorder};background:rgba(0,0,0,.12);display:flex;gap:12px;align-items:center">
          ${wc>0?`<span style="font-size:11px;color:var(--text3)"><i class="ph ph-hard-hat"></i> ${wc}</span>`:''}
          ${mc>0?`<span style="font-size:11px;color:var(--text3)"><i class="ph ph-package"></i> ${mc}</span>`:''}
          <span style="margin-left:auto;display:flex;align-items:center;gap:11px">
            ${ovCount>0?`<span style="font-size:11px;color:var(--red);font-weight:700"><i class="ph ph-warning"></i> ${ovCount}</span>`:''}
            ${pDebt>0?`<span style="font-size:11px;color:var(--red);font-weight:700">−${fmtShort(pDebt)}</span>`:''}
          </span>
        </div>`:''}
      </div>`;
    }).join('')}
    ${positions.length===0?`<div class="empty" style="padding:24px 16px"><div style="font-size:28px;opacity:.3;margin-bottom:8px;color:var(--text2)"><i class="ph ph-list"></i></div><div style="font-size:13px">${lang==='ru'?'Нет позиций':lang==='az'?'Mövqe yoxdur':'No positions'}</div></div>`:''}
    <button id="posFormToggle" onclick="togglePosForm()" style="width:100%;background:none;border:1px dashed var(--border);border-radius:14px;padding:12px;color:var(--text3);font-size:13px;font-weight:600;font-family:Mulish,sans-serif;cursor:pointer">＋ ${t('addPos')}</button>
    <div class="add-form" id="posFormOuter" style="display:none;margin-top:0">
      <input type="text" id="newPosName" placeholder="${t('posNamePh')}" onkeydown="if(event.key==='Enter')addPosition('${s.id}')"/>
      <button class="btn btn-primary" style="margin-top:10px" onclick="addPosition('${s.id}')">＋ ${t('addPos')}</button>
    </div>
    <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);text-align:center">
      <button onclick="confirmDeleteStage('${s.id}')" style="background:none;border:none;color:rgba(204,123,123,.4);font-size:12px;font-family:'Mulish',sans-serif;cursor:pointer;padding:4px 12px">${t('deleteStage')}</button>
    </div>
    <div style="height:8px"></div>`;
  setTimeout(function(){initStagePhotos(s.id);},0);
}
// ── PAYMENT PLAN ──
function renderPaymentPlan(w){
  const contract=w.contractAmount||0;
  const plan=w.paymentPlan||{a:30,i:40,f:30};
  const labels=lang==='ru'?['Аванс','Промежуточный','Расчёт']:['Advance','Interim','Final'];
  const keys=['a','i','f'];
  const types=lang==='ru'?['Аванс','Промежуточный','Расчёт']:['Advance','Interim','Final'];
  // Сколько выплачено по каждому типу из paymentHistory
  const hist=w.paymentHistory||[];
  const paidByType={};
  types.forEach((t,i)=>{
    paidByType[i]=hist.filter(p=>p.type===t).reduce((a,p)=>a+(p.amount||0),0);
  });
  return keys.map((k,i)=>{
    const pct=plan[k]||0;
    const planned=Math.round(contract*pct/100);
    const paid=paidByType[i]||0;
    const isPaid=paid>=planned&&planned>0;
    const isPartial=paid>0&&paid<planned;
    return`<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <div style="width:14px;height:14px;border-radius:50%;border:1.5px solid ${isPaid?'var(--green)':isPartial?'var(--gold)':'rgba(255,255,255,.2)'};background:${isPaid?'var(--green)':'none'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${isPaid?'<svg width="8" height="8" viewBox="0 0 8 8"><polyline points="1.5,4 3.2,6 6.5,2" fill="none" stroke="#0D0F14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}
      </div>
      <span style="font-size:10px;color:var(--text3);flex:1">${labels[i]} ${pct}%</span>
      <span style="font-size:11px;font-family:'DM Mono',monospace;font-weight:600;color:${isPaid?'var(--green)':isPartial?'var(--gold)':'var(--text2)'}">${fmtShort(planned)}</span>
      ${isPartial?`<span style="font-size:9px;color:var(--gold)">(+${fmtShort(paid)})</span>`:''}
    </div>`;
  }).join('');
}

// ── POS PAGE (Works & Mats inside position) ──
let _expandedWorks=new Set();
function toggleWorkExpand(wId){
  const el=document.getElementById('wexp_'+wId);
  if(!el)return;
  const isOpen=_expandedWorks.has(wId);
  if(isOpen){
    _expandedWorks.delete(wId);
    el.style.maxHeight=el.scrollHeight+'px';
    requestAnimationFrame(()=>{el.style.maxHeight='0';el.style.opacity='0';});
  } else {
    _expandedWorks.add(wId);
    el.style.maxHeight=el.scrollHeight+'px';
    el.style.opacity='1';
    setTimeout(()=>{el.style.maxHeight='none';},350);
  }
}
function showWorkMenu(sId,pId,wId){
  const s=stages().find(st=>st.id===sId);
  const p=(s?.positions||[]).find(pos=>pos.id===pId);
  const w=(p?.works||[]).find(wk=>wk.id===wId);
  if(!w)return;
  const unpaid=Math.max(0,(w.contractAmount||0)-(w.paid||0));
  const payName=(w.contractor||w.name||'').replace(/'/g,"\\'");
  const objId=(curObj()||{}).id;
  showModal(`<div class="modal-handle"></div>
    <div style="font-size:15px;font-weight:700;margin-bottom:14px">${w.name}</div>
    ${unpaid>0?`<button class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:8px" onclick="closeModal();payOneWork('${objId}','${sId}','${pId}','${wId}','${payName}',${unpaid})"><i class="ph ph-coins"></i> ${l3('Оплатить','Ödə','Pay')} ${fmtShort(unpaid)}</button>`:''}
    <button class="btn btn-secondary" style="width:100%;justify-content:center;margin-bottom:8px" onclick="closeModal();editWorkPrompt('${sId}','${pId}','${wId}')"><i class="ph ph-pencil"></i> ${lang==='ru'?'Редактировать':'Edit'}</button>
    <button class="btn btn-danger" style="width:100%;justify-content:center" onclick="closeModal();deleteWork('${sId}','${pId}','${wId}')"><i class="ph ph-trash"></i> ${lang==='ru'?'Удалить':'Delete'}</button>`);
}
function renderPos(){
  const s=stages().find(st=>st.id===activeStageId);if(!s)return;
  const p=(s.positions||[]).find(pos=>pos.id===activePosId);if(!p)return;
  const works=p.works||[],mats=p.mats||[];
  const wTotal=works.reduce((a,w)=>a+workTotal(w),0);
  const mTotal=mats.reduce((a,m)=>a+matTotal(m),0);
  const wFact=works.reduce((a,w)=>a+(w.paid||0),0);
  // Бар позиции — по оплате работ (материалы это закупка, не «прогресс»); done=100
  const fp=p.status==='done'?100:(wTotal>0?Math.min(wFact/wTotal*100,100):0);
  const sl=p.status==='done'?t('statusDone'):p.status==='active'?t('statusActive'):t('statusIdle');
  const sp=p.status==='done'?'status-done':p.status==='active'?'status-active':'status-idle';
  // ── Насыщенная шапка позиции (как у этапа): % освоено, долг/план, бар, факт/контракт, дедлайн ──
  const _pdebt=posDebt(p),_pstarted=p.status!=='idle',_povN=works.filter(w=>isOverdue(w)).length;
  const _heroCol=_povN>0?'var(--red)':s.color;
  let _heroRight='';
  if(_pstarted&&_pdebt>0)_heroRight=`<div style="text-align:right"><div style="font-family:'DM Mono',monospace;font-size:18px;font-weight:500;color:var(--red);line-height:1">−${fmtShort(_pdebt)}</div><div style="font-size:11px;color:var(--text3);margin-top:3px">${l3('долг','borc','debt')}</div></div>`;
  else if(!_pstarted&&_pdebt>0)_heroRight=`<div style="text-align:right"><div style="font-family:'DM Mono',monospace;font-size:18px;font-weight:500;color:var(--text2);line-height:1">${fmtShort(_pdebt)}</div><div style="font-size:11px;color:var(--text3);margin-top:3px">${l3('план','plan','plan')}</div></div>`;
  let _dlChip='';
  if(_povN>0){_dlChip=`<span style="color:var(--red);font-weight:700"><i class="ph ph-warning" style="font-size:11px"></i> ${_povN} ${l3('просроч.','gecik.','overdue')}</span>`;}
  else{let _posDl='';works.forEach(w=>{if(!w.done&&w.endDate&&w.endDate>_posDl)_posDl=w.endDate;});if(_posDl){const _e=new Date(_posDl+'T00:00:00'),_td=new Date();_td.setHours(0,0,0,0);const _d=Math.round((_e-_td)/86400000),_ds=_posDl.split('-').reverse().slice(0,2).join('.');_dlChip=`<span style="color:${_d<=3?'var(--gold)':'var(--text3)'}"><i class="ph ph-clock" style="font-size:11px"></i> ${l3('до','-dək','by')} ${_ds} · ${_d} ${l3('дн','gün','d')}</span>`;}}
  document.getElementById('posHero').innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="back-btn" onclick="goBack()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('backBtn')}</button>
      <button onclick="editPosPrompt('${s.id}','${p.id}')" class="btn btn-icon btn-sm" style="margin-left:auto"><i class="ph ph-pencil"></i></button>
    </div>
    <div style="margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <div class="detail-hero-name" style="flex:1">${p.name}</div>
        <span class="status-pill ${sp}">${sl}</span>
      </div>
    </div>
    <div style="background:var(--bg2);border-radius:16px;padding:15px 16px;margin-bottom:2px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
        <div><div style="font-family:'DM Mono',monospace;font-size:27px;font-weight:500;color:${_heroCol};line-height:1">${Math.round(fp)}%</div><div style="font-size:11px;color:var(--text3);margin-top:3px">${l3('освоено','mənimsənilib','done')}</div></div>
        ${_heroRight}
      </div>
      <div style="height:7px;background:var(--bg3);border-radius:4px;overflow:hidden;margin-bottom:9px"><div style="height:100%;width:${fp}%;background:${_heroCol}"></div></div>
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px">
        <span style="font-family:'DM Mono',monospace;color:var(--text2)">${Math.round(wFact).toLocaleString('en-US')} / ${fmtShort(wTotal)}</span>
        ${_dlChip}
      </div>
    </div>`;
  document.getElementById('posContent').innerHTML=`
    <div style="height:12px"></div>
    ${works.length>0?`<div style="display:flex;align-items:center;gap:7px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border)"><i class="ph ph-hard-hat" style="font-size:15px;color:var(--blue)"></i><span style="font-size:13px;font-weight:600;color:var(--blue)">${t('typeWork')}</span><span style="font-size:11px;color:var(--text3);margin-left:auto">${works.length}</span></div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${works.map((w,i)=>{
        const unpaid=Math.max(0,(w.contractAmount||0)-(w.paid||0));
        const started=p.status!=='idle';       // позиция начата → unpaid это долг, иначе план
        const overdue=isOverdue(w);
        // Пилюля = состояние во времени; «−X» отдельно = деньги
        const stLabel=w.done?l3('Готово','Hazır','Done'):overdue?l3('Просрочено','Gecikib','Overdue'):started?l3('Идёт','Gedir','Active'):l3('План','Plan','Planned');
        const stColor=w.done?'var(--green)':overdue?'var(--red)':started?'var(--gold)':'var(--text3)';
        const stBg=w.done?'rgba(128,200,154,.12)':overdue?'rgba(204,123,123,.12)':started?'rgba(201,170,124,.12)':'rgba(255,255,255,.04)';
        const stBorder=w.done?'rgba(128,200,154,.3)':overdue?'rgba(204,123,123,.3)':started?'rgba(201,170,124,.3)':'var(--border)';
        let ovTxt='';
        if(overdue){const _td=new Date();_td.setHours(0,0,0,0);const d=Math.round((_td-new Date(w.endDate+'T00:00:00'))/86400000);ovTxt=l3('просрочен на','gecikib','overdue')+' '+d+' '+l3('дн','gün','d');}
        return`<div style="animation-delay:${i*.04}s;background:var(--bg2);border:1px solid ${overdue?'rgba(204,123,123,.4)':'rgba(255,255,255,.06)'};border-radius:14px;display:flex;align-items:stretch;overflow:hidden">
          <div style="width:3px;background:${stColor};flex-shrink:0"></div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;flex:1;min-width:0">
          <div onclick="event.stopPropagation();toggleWork('${s.id}','${p.id}','${w.id}')" style="width:22px;height:22px;border-radius:6px;border:1.5px solid ${w.done?'transparent':'rgba(255,255,255,.2)'};background:${w.done?'var(--blue)':'none'};display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .2s">
            ${w.done?'<svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#0D0F14" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}
          </div>
          <div onclick="showWorkMenu('${s.id}','${p.id}','${w.id}')" style="flex:1;min-width:0;cursor:pointer">
            <div style="margin-bottom:5px">
              <span style="font-size:15px;font-weight:700;${w.done?'opacity:.5;text-decoration:line-through':''}">${w.name}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              ${w.contractor?`<span style="font-size:12px;color:var(--text3)">${w.contractor}</span>`:''}
              ${unpaid>0?`<span style="font-size:12px;font-weight:700;color:${started?'var(--red)':'var(--text2)'};white-space:nowrap">${started?'−'+fmtShort(unpaid):fmtShort(unpaid)+' '+l3('план','plan','plan')}</span>`:''}
              <span style="font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600;background:${stBg};color:${stColor};border:1px solid ${stBorder};margin-left:auto;white-space:nowrap">${stLabel}</span>
            </div>
            ${overdue?`<div style="font-size:11px;color:var(--red);margin-top:4px"><i class="ph ph-warning-circle" style="font-size:11px"></i> ${ovTxt}</div>`:''}
          </div>
          ${w.phone?`<a href="tel:${w.phone}" onclick="event.stopPropagation()" style="width:40px;height:40px;border-radius:50%;background:rgba(123,184,204,.12);display:flex;align-items:center;justify-content:center;color:var(--blue);text-decoration:none;flex-shrink:0"><i class="ph ph-phone" style="font-size:18px"></i></a>`:''}
        </div></div>`;
      }).join('')}
    </div>`:''}
    ${mats.length>0?`<div style="display:flex;align-items:center;gap:7px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border)"><i class="ph ph-package" style="font-size:15px;color:var(--gold)"></i><span style="font-size:13px;font-weight:600;color:var(--gold)">${t('typeMat')}</span><span style="font-size:12px;color:var(--text2);margin-left:auto;font-family:'DM Mono',monospace">${fmtShort(mTotal)}</span></div>
    <div style="background:var(--bg2);border:1px solid rgba(201,170,124,.15);border-radius:14px;overflow:hidden;margin-bottom:14px">
      ${mats.map((m,i)=>`<div class="pos-item-row" style="animation-delay:${i*.04}s">
        <div style="width:22px;height:22px;border-radius:6px;background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.2);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--gold);flex-shrink:0;margin-top:1px"><i class="ph ph-package"></i></div>
        <div class="pos-item-info" onclick="editMatPrompt('${s.id}','${p.id}','${m.id}')" style="cursor:pointer">
          <div class="pos-item-name">${m.name}</div>
          <div class="pos-item-sub">${m.qty||1} ${m.unit||t('unitPcs')} × ${fmtShort(m.price||0)} = <span style="color:var(--gold)">${fmtShort(matTotal(m))}</span></div>
          ${m.note?`<div class="pos-item-sub">${m.note}</div>`:''}
        </div>
        <div class="pos-item-cost">${fmtShort(matTotal(m))}</div>
        <button class="pos-item-del" onclick="deleteMat('${s.id}','${p.id}','${m.id}')">×</button>
      </div>`).join('')}
    </div>`:''}
    ${works.length===0&&mats.length===0?`<div class="empty" style="padding:20px 16px"><div style="font-size:28px;opacity:.3;margin-bottom:6px;color:var(--text2)"><i class="ph ph-list"></i></div><div style="font-size:12px">${lang==='ru'?'Добавьте работы или материалы':lang==='az'?'İş və ya material əlavə edin':'Add works or materials'}</div></div>`:''}
    <div style="display:flex;gap:8px;margin-bottom:10px">
      <button style="flex:1;background:none;border:1px solid rgba(123,184,204,.25);color:var(--blue);border-radius:10px;padding:9px 12px;font-size:13px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s" onclick="toggleWorkForm()">
        <i class="ph ph-hard-hat" style="font-size:18px"></i> ${lang==='ru'?'Работа':lang==='az'?'İş':'Labour'}
      </button>
      <button style="flex:1;background:none;border:1px solid rgba(201,170,124,.25);color:var(--gold);border-radius:10px;padding:9px 12px;font-size:13px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s" onclick="toggleMatForm()">
        <i class="ph ph-package" style="font-size:18px"></i> ${lang==='ru'?'Материал':lang==='az'?'Material':'Material'}
      </button>
    </div>
    <div class="add-form" style="border-color:rgba(123,184,204,.2);display:none" id="workFormOuter">
      <div class="add-form-title" style="color:var(--blue)">${t('addWork')}</div>
      <div id="workFormBody">
      <input type="text" id="newWorkName" placeholder="${t('workName')}"/>
      <div style="margin-top:8px">
        <div class="form-label" style="font-size:10px;margin-bottom:4px">${t('contractAmount')} ₼</div>
        <input type="number" id="newWorkContract" placeholder="0" oninput="updateNwPlan()"/>
      </div>
      <div class="autocomplete-wrap" style="margin-top:8px">
        <input type="text" id="newWorkContractor" placeholder="👤 ${t('contractorPh')}" oninput="showContractorSuggest(this,'newWorkContractor','newWorkPhone')" autocomplete="off"/>
        <div id="contractorSuggest" class="autocomplete-list" style="display:none"></div>
      </div>
      <button onclick="showContractorPicker('newWorkContractor','newWorkPhone')" style="background:none;border:none;color:var(--gold);font-size:12px;font-weight:600;cursor:pointer;font-family:'Mulish',sans-serif;padding:4px 0;display:block"><i class="ph ph-user-list"></i> ${lang==='ru'?'Выбрать из списка':'Pick from list'}</button>
      <input type="text" id="newWorkPhone" placeholder="📞 ${t('phonePh')}" style="margin-top:8px"/>
      <div id="workExtraFields" style="display:none">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          <div><div class="drum-date-display" id="nwStartDisp" onclick="openDrumPicker('nwStart','')" style="padding:8px 10px;font-size:12px"><i class="ph ph-calendar"></i> ${t('startDate')}</div><input type="hidden" id="nwStartVal"/></div>
          <div><div class="drum-date-display" id="nwEndDisp" onclick="openDrumPicker('nwEnd','')" style="padding:8px 10px;font-size:12px"><i class="ph ph-flag"></i> ${t('endDate')}</div><input type="hidden" id="nwEndVal"/></div>
        </div>
        <input type="text" id="newWorkNote" placeholder="${t('notePh')}" style="margin-top:8px"/>
      </div>
      <button onclick="toggleWorkExtra()" id="workExtraBtn" style="background:none;border:none;color:var(--text3);font-size:12px;font-family:'Mulish',sans-serif;cursor:pointer;padding:6px 0;text-align:left">▸ ${lang==='ru'?'Дополнительно':lang==='az'?'Əlavə':'More'}</button>
      <button class="btn btn-sm" style="background:rgba(123,184,204,.12);color:var(--blue);border:1px solid rgba(123,184,204,.3);width:100%;margin-top:8px" onclick="addWork('${s.id}','${p.id}')">＋ ${t('addWork')}</button>
      </div>
    </div>
    <div class="add-form" style="margin-top:0;border-color:rgba(201,170,124,.2);display:none" id="matFormOuter">
      <div class="add-form-title" style="color:var(--gold)">${t('addMat')}</div>
      <div id="matFormBody">
      <input type="text" id="newMatName" placeholder="${t('matName')}" oninput="suggestMatPrice()"/>
      <div style="display:grid;grid-template-columns:1fr 80px 1fr;align-items:center;gap:6px;margin-top:8px">
        <input type="number" id="newMatQty" placeholder="${t('qty')}" value="1"/>
        <select id="newMatUnit" style="background:rgba(255,255,255,.05);border:1px solid var(--border2);color:var(--text);border-radius:10px;padding:10px 6px;font-family:'Mulish',sans-serif;font-size:13px;outline:none;-webkit-appearance:none;text-align:center">
          <option value="шт">${t('unitPcs')}</option><option value="м²">${t('unitM2')}</option><option value="м³">${t('unitM3')}</option><option value="п.м.">${t('unitLm')}</option><option value="кг">${t('unitKg')}</option><option value="мешок">${t('unitBag')}</option><option value="л">${t('unitL')}</option>
        </select>
        <input type="number" id="newMatPrice" placeholder="${t('price')} ₼"/>
      </div>
      <input type="text" id="newMatNote" placeholder="${t('notePh')}" style="margin-top:8px"/>
      <button class="btn btn-sm" style="background:rgba(201,170,124,.12);color:var(--gold);border:1px solid rgba(201,170,124,.3);width:100%;margin-top:8px" onclick="addMat('${s.id}','${p.id}')">＋ ${t('addMat')}</button>
      </div>
    </div>
    <div style="height:8px"></div>`;
  setTimeout(function(){initWorkPhotos(s.id,p.id);},0);
}

// ── WORK PHOTOS (async render) ──
function initWorkPhotos(sId,pId){
  const st=stages().find(s=>s.id===sId);
  if(!st)return;
  const pos=(st.positions||[]).find(p=>p.id===pId);
  if(!pos)return;
  (pos.works||[]).forEach(function(w){
    const ids=w.photos||[];
    if(!ids.length)return;
    const container=document.getElementById('wph_'+w.id);
    if(!container)return;
    loadPhotos(ids).then(function(photos){
      const imgs=ids.filter(function(id){return photos[id];}).map(function(id){
        return'<img src="'+photos[id]+'" onclick="viewPhoto(\''+id+'\',\'work\',\''+sId+'\',\''+pId+'\',\''+w.id+'\')" style="width:54px;height:54px;object-fit:cover;border-radius:9px;cursor:pointer;flex-shrink:0;border:1.5px solid rgba(255,255,255,.08);"/>';
      }).join('');
      if(imgs)container.innerHTML='<div style="display:flex;gap:5px;overflow-x:auto;padding:5px 0 2px;scrollbar-width:none;-webkit-overflow-scrolling:touch">'+imgs+'</div>';
    });
  });
}
function initStagePhotos(sId){
  const s=stages().find(st=>st.id===sId);
  if(!s)return;
  const container=document.getElementById('stagePh_'+sId);
  if(!container)return;
  const ids=s.photos||[];
  const wrapper='<div style="display:flex;gap:5px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:4px 0 6px;min-height:70px;align-items:center">';
  if(!ids.length){container.innerHTML=wrapper+'</div>';return;}
  loadPhotos(ids).then(function(photos){
    const imgs=ids.filter(function(id){return photos[id];}).map(function(id){
      return'<img src="'+photos[id]+'" onclick="viewPhoto(\''+id+'\',\'stage\',\''+sId+'\')" style="width:60px;height:60px;object-fit:cover;border-radius:10px;cursor:pointer;flex-shrink:0;border:1.5px solid rgba(255,255,255,.08);"/>';
    }).join('');
    container.innerHTML=wrapper+imgs+'</div>';
  });
}
// viewPhoto(photoId, 'work', sId, pId, wId)
// viewPhoto(photoId, 'stage', sId)
// viewPhoto(photoId, 'journal', entryId)
function viewPhoto(photoId,ctxType,id1,id2,id3){
  loadPhoto(photoId).then(function(dataUrl){
    if(!dataUrl)return;
    var existing=document.getElementById('photoViewer');
    if(existing)existing.remove();
    var delCall='';
    if(ctxType==='stage') delCall='deleteStagePhoto(\''+photoId+'\',\''+id1+'\')';
    else if(ctxType==='journal') delCall='deleteJournalPhoto(\''+photoId+'\',\''+id1+'\')';
    else delCall='deleteWorkPhoto(\''+photoId+'\',\''+id1+'\',\''+id2+'\',\''+id3+'\')';
    var overlay=document.createElement('div');
    overlay.id='photoViewer';
    overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.96);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:calc(var(--top,0px) + 56px) 20px calc(var(--safe,0px) + 20px);box-sizing:border-box;overflow-y:auto';
    overlay.innerHTML='<button onclick="document.getElementById(\'photoViewer\').remove()" style="position:fixed;top:calc(var(--top,0px) + 12px);right:16px;background:rgba(255,255,255,.12);border:none;color:white;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:22px;display:flex;align-items:center;justify-content:center;z-index:1">×</button>'
      +'<img src="'+dataUrl+'" style="max-width:100%;max-height:65vh;object-fit:contain;border-radius:12px;flex-shrink:0"/>'
      +'<button onclick="'+delCall+'" style="margin-top:20px;flex-shrink:0;background:rgba(204,123,123,.15);border:1.5px solid var(--red);color:var(--red);padding:11px 28px;border-radius:12px;cursor:pointer;font-size:14px;font-family:\'Mulish\',sans-serif;font-weight:600;display:flex;align-items:center;gap:8px"><i class="ph ph-trash"></i> '+(lang==='ru'?'Удалить фото':lang==='az'?'Şəkli sil':'Delete photo')+'</button>';
    document.body.appendChild(overlay);
  });
}

// ── STAGE ACTIONS ──
function updateStages(fn){const activeId=(curObj()||{}).id;db.objects=db.objects.map(o=>o.id===activeId?{...o,stages:fn(o.stages||[])}:o);saveDB();}
function confirmDeleteStage(id){const s=stages().find(st=>st.id===id);if(!s)return;showModal(`<div class="modal-handle"></div><div class="modal-title">${t('deleteStage')} «${tName(s)}»?</div><p style="color:var(--text2);font-size:14px;margin-bottom:20px">${t('deleteStageConfirm')}</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" style="flex:1" onclick="deleteStage('${id}')">${t('delete')}</button></div>`);}
function deleteStage(id){updateStages(ss=>ss.filter(s=>s.id!==id));closeModal();goBack();renderDash();showToast(t('stageDeleted'));}
function showStageModal(existing){
  const isEdit=!!existing,data=existing||{name:'',icon:'🏠',color:'#7BB8CC'};
  window._sfd={...data};
  const allTpls=[...BUILTIN_TEMPLATES,...loadMyTemplates()];
  window._allTpls=allTpls;
  const tplHtml=!isEdit?('<div class="form-group"><label class="form-label">'+(lang==='ru'?'Из шаблона':lang==='az'?'Şablondan':'From template')+'</label><div style="display:flex;gap:6px;flex-wrap:wrap">'+allTpls.map(function(tpl,i){return '<div data-ti="'+i+'" class="tpl-chip">'+tpl.icon+' '+tplName(tpl)+'</div>';}).join('')+'</div></div><hr style="border:none;border-top:1px solid var(--border);margin:0 0 14px"/>'):'';
  showModal(`<div class="modal-handle"></div><div class="modal-title">${isEdit?t('editStage'):t('addStage')}</div>
    ${tplHtml}
    <div class="form-group"><label class="form-label">${t('stageName')}</label><input type="text" id="sName" placeholder="${t('stageNamePh')}" value="${(tName(data)||data.name||'').replace(/"/g,'&quot;')}"/></div>
    <div class="form-group"><label class="form-label">${t('stageIcon')}</label><div class="icon-grid">${ICONS.map(ic=>`<div class="icon-opt ${ic===data.icon?'sel':''}" onclick="selIcon('${ic}')">${ic}</div>`).join('')}</div></div>
    <div class="form-group"><label class="form-label">${t('stageColor')}</label><div class="color-grid">${COLORS.map(c=>`<div class="color-opt ${c===data.color?'sel':''}" style="background:${c}" onclick="selColor('${c}')"></div>`).join('')}</div></div>
    <p style="font-size:12px;color:var(--text3);margin-bottom:16px;line-height:1.5">${t('stageHint')}</p>
    <div class="form-group">
      <label class="form-label">${t('note')}</label>
      <textarea id="stageNote" placeholder="${t('notePh')}" style="height:60px">${data.note||''}</textarea>
    </div>
    <div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="saveStage('${isEdit?data.id:''}')">${isEdit?t('save'):t('create')}</button></div>`);
  setTimeout(function(){document.querySelector('.modal')?.addEventListener('click',function(e){
    const el=e.target.closest('[data-ti]');if(el)applyTemplate(window._allTpls[+el.dataset.ti]);
    if(e.target.id==='stageEndDateDisp'||e.target.closest('#stageEndDateDisp')){
      openStageDatePicker();
    }
  });},0);
}
function selColor(c){window._sfd.color=c;document.querySelectorAll('.color-opt').forEach(el=>el.classList.toggle('sel',el.getAttribute('onclick')===`selColor('${c}')`))}
function selIcon(ic){window._sfd.icon=ic;document.querySelectorAll('.icon-opt').forEach(el=>el.classList.toggle('sel',el.textContent===ic))}
function saveStage(editId){
  const name=document.getElementById('sName')?.value.trim(),icon=window._sfd?.icon||'🏠',color=window._sfd?.color||'#7BB8CC';window._sfd.endDate=document.getElementById('stageEndDate')?.value||'';window._sfd.note=document.getElementById('stageNote')?.value||'';
  if(!name){showToast(t('enterName'),'err');return;}
  if(editId){updateStages(ss=>ss.map(s=>s.id==editId?{...s,name,icon,color,endDate:window._sfd.endDate||s.endDate||'',note:window._sfd.note||s.note||''}:s));showToast(t('stageUpdated'));}
  else{updateStages(ss=>[...ss,{id:newId(),name,icon,color,status:'idle',positions:[],endDate:window._sfd.endDate||'',note:window._sfd.note||''}]);addJournalEntry(db.activeObjectId,'stage_created',(lang==='ru'?'Создан этап: ':'Stage created: ')+name);showToast(t('stageAdded'));}
  if(!editId){
    document.getElementById('pageDetail').classList.add('page-hidden-right');
    document.getElementById('pagePos').classList.add('page-hidden-right');
    document.getElementById('pageDash').classList.remove('page-hidden-left');
    renderDash();
  } else {
    if(!document.getElementById('pageDetail').classList.contains('page-hidden-right'))renderDetail();
    renderDash();
  }
  closeModal();
}
function editStage(id){const s=stages().find(st=>st.id===id);if(s)showStageModal(s);}
// ── POSITION ACTIONS ──
// ── LONG PRESS ──
let _lpTimer=null,_lpTriggered=false,_menuJustClosed=false;

function handlePosClick(e,posId){
  if(_lpTriggered){_lpTriggered=false;return;}
  goPos(posId);
}

function startLongPress(e,stageId,posId){
  _lpTriggered=false;
  // Ripple анимация
  const card=e.currentTarget;
  const rect=card.getBoundingClientRect();
  const size=Math.max(rect.width,rect.height)*1.5;
  const ripple=document.createElement('div');
  ripple.className='lp-ripple';
  ripple.style.cssText='width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px';
  card.style.position='relative';card.style.overflow='hidden';
  card.appendChild(ripple);
  _lpTimer=setTimeout(()=>{
    _lpTriggered=true;
    ripple.remove();
    if(navigator.vibrate)navigator.vibrate(40);
    showPosMenu(e,stageId,posId);
    setTimeout(()=>{_lpTriggered=false;},300);
  },500);
}
function cancelLongPress(){
  clearTimeout(_lpTimer);
  _lpTimer=null;
  document.querySelectorAll('.lp-ripple').forEach(r=>r.remove());
}

function showPosMenu(e,stageId,posId){
  e.preventDefault();e.stopPropagation();
  cancelLongPress();
  closeCtxMenu();
  const s=stages().find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  if(!p)return;

  const menu=document.createElement('div');
  menu.className='ctx-menu';menu.id='ctxMenu';

  const renameLabel=lang==='ru'?'Переименовать':lang==='az'?'Adını dəyişdir':'Rename';
  const addLabel=lang==='ru'?'Добавить работу':lang==='az'?'İş əlavə et':'Add work';
  const delLabel=lang==='ru'?'Удалить позицию':lang==='az'?'Mövqeni sil':'Delete position';

  menu.innerHTML=
    '<div class="ctx-item" onclick="closeCtxMenu();inlineEditPos('+stageId+','+posId+')"><i class="ph ph-pencil"></i> '+renameLabel+'</div>'+
    '<div class="ctx-item" onclick="closeCtxMenu();quickAddWork('+stageId+','+posId+')">＋ '+addLabel+'</div>'+
    '<div style="height:1px;background:var(--border);margin:4px 0"></div>'+
    '<div class="ctx-item ctx-item-danger" onclick="closeCtxMenu();deletePosConfirm('+stageId+','+posId+')"><i class="ph ph-trash"></i> '+delLabel+'</div>';

  // Позиционируем меню
  const x=Math.min(e.clientX||e.touches?.[0]?.clientX||100, window.innerWidth-220);
  const y=Math.min(e.clientY||e.touches?.[0]?.clientY||100, window.innerHeight-200);
  menu.style.left=x+'px';
  menu.style.top=y+'px';

  document.body.appendChild(menu);
  // capture:true — перехватываем ДО того как click дойдёт до карточки
  setTimeout(()=>document.addEventListener('click',closeCtxMenuOnOut,true),0);
}
function closeCtxMenu(){
  document.getElementById('ctxMenu')?.remove();
  document.removeEventListener('click',closeCtxMenuOnOut,true);
}
function closeCtxMenuOnOut(e){
  if(!e.target.closest('#ctxMenu')){
    e.stopPropagation();
    e.preventDefault();
    closeCtxMenu();
  }
}

function inlineEditPos(stageId,posId){
  const s=stages().find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  if(!p)return;
  // Найдём элемент с именем позиции
  const cards=document.querySelectorAll('.pos-card-name');
  let el=null;
  cards.forEach(c=>{if(c.textContent.trim()===p.name)el=c;});
  if(!el)return showModal('<div class="modal-handle"></div><div class="modal-title">'+(lang==='ru'?'Переименовать':'Rename')+'</div><div class="form-group"><input type="text" id="renameInput" value="'+p.name.replace(/"/g,'&quot;')+'"/></div><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">'+(lang==='ru'?'Отмена':'Cancel')+'</button><button class="btn btn-primary" onclick="saveRename('+stageId+','+posId+')">'+(lang==='ru'?'Сохранить':'Save')+'</button></div>');
  el.contentEditable='true';
  el.style.cssText='outline:1px solid rgba(201,170,124,.5);border-radius:4px;padding:2px 6px;min-width:60px';
  el.focus();
  const range=document.createRange();range.selectNodeContents(el);
  const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
  function finish(){
    const newName=el.textContent.trim()||p.name;
    el.contentEditable='false';el.style.cssText='';
    if(newName!==p.name){
      updateStages(ss=>ss.map(s=>s.id!==stageId?s:{...s,positions:(s.positions||[]).map(pos=>pos.id!==posId?pos:{...pos,name:newName})}));
      renderDetail();showToast(t('objUpdated'));
    }
  }
  el.onblur=finish;
  el.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();el.blur();}if(ev.key==='Escape'){el.textContent=p.name;el.blur();}};
}
function saveRename(stageId,posId){
  const name=document.getElementById('renameInput')?.value.trim();
  if(!name){showToast(t('enterName'),'err');return;}
  updateStages(ss=>ss.map(s=>s.id!==stageId?s:{...s,positions:(s.positions||[]).map(p=>p.id!==posId?p:{...p,name})}));
  closeModal();renderDetail();showToast(t('objUpdated'));
}

function quickAddWork(stageId,posId){
  showModal('<div class="modal-handle"></div><div class="modal-title"><i class="ph ph-hard-hat"></i> '+(lang==='ru'?'Быстрая работа':lang==='az'?'Tez iş':'Quick work')+'</div>'+
    '<div class="form-group"><label class="form-label">'+(lang==='ru'?'Название':'Name')+'</label><input type="text" id="qwName" placeholder="'+(lang==='ru'?'Например: Копка':'E.g.: Digging')+'"/></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'+
      '<div><label class="form-label">'+(lang==='ru'?'Договор ₼':'Contract ₼')+'</label><input type="number" id="qwContract" placeholder="0"/></div>'+
      '<div><label class="form-label">'+(lang==='ru'?'Выплачено ₼':'Paid ₼')+'</label><input type="number" id="qwPaid" placeholder="0"/></div>'+
    '</div>'+
    '<div class="form-group"><label class="form-label">'+(lang==='ru'?'Подрядчик':'Contractor')+'</label><div class="autocomplete-wrap"><input type="text" id="qwContractor" placeholder="'+(lang==='ru'?'Имя или компания':'Name or company')+'" oninput="showContractorSuggest(this,\'qwContractor\',\'\',\'qwContractorSuggest\')" autocomplete="off"/><div id="qwContractorSuggest" class="autocomplete-list" style="display:none"></div></div></div>'+
    '<div style="display:flex;gap:10px">'+
      '<button class="btn btn-secondary" onclick="closeModal()">'+(lang==='ru'?'Отмена':'Cancel')+'</button>'+
      '<button class="btn btn-primary" onclick="saveQuickWork('+stageId+','+posId+')">'+(lang==='ru'?'Добавить':'Add')+'</button>'+
    '</div>');
}
function saveQuickWork(stageId,posId){
  const name=document.getElementById('qwName')?.value.trim();
  if(!name){showToast(t('enterName'),'err');return;}
  const ca=parseFloat(document.getElementById('qwContract')?.value)||0;
  const pd=parseFloat(document.getElementById('qwPaid')?.value)||0;
  const ctr=document.getElementById('qwContractor')?.value.trim()||'';
  updatePos(stageId,posId,p=>({...p,works:[...(p.works||[]),{id:newId(),name,contractAmount:ca,paid:pd,contractor:ctr,phone:'',startDate:'',endDate:'',note:'',done:false}]}));
  autoStageStatus(stageId);
  closeModal();renderDetail();renderDash();
  showToast(t('posAdded'));
}
function togglePosForm(){
  const f=document.getElementById('posFormOuter'),b=document.getElementById('posFormToggle');
  if(!f)return;
  f.style.display='block';if(b)b.style.display='none';
  setTimeout(()=>document.getElementById('newPosName')?.focus(),50);
}
function addPosition(stageId){
  const name=document.getElementById('newPosName')?.value.trim();if(!name){showToast(t('enterName'),'err');return;}
  updateStages(ss=>ss.map(s=>s.id!==stageId?s:{...s,positions:[...(s.positions||[]),{id:newId(),name,status:'idle',works:[],mats:[]}]}));
  document.getElementById('newPosName').value='';renderDetail();showToast(t('posAdded'));
}

function deletePosConfirm(stageId,posId){const s=stages().find(st=>st.id===stageId);const p=(s?.positions||[]).find(pos=>pos.id===posId);if(!p)return;showModal(`<div class="modal-handle"></div><div class="modal-title">${t('deletePos')} «${p.name}»?</div><p style="color:var(--text2);font-size:14px;margin-bottom:20px">${t('deletePosConfirm')}</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" style="flex:1" onclick="deletePos('${stageId}','${posId}')">${t('delete')}</button></div>`);}
function deletePos(stageId,posId){updateStages(ss=>ss.map(s=>s.id!==stageId?s:{...s,positions:(s.positions||[]).filter(p=>p.id!==posId)}));closeModal();renderDetail();showToast(t('posDeleted'));}
function editPosPrompt(stageId,posId){const s=stages().find(st=>st.id===stageId);const p=(s?.positions||[]).find(pos=>pos.id===posId);if(!p)return;showModal(`<div class="modal-handle"></div><div class="modal-title">${t('editPos')}</div><div class="form-group"><label class="form-label">${t('posName')}</label><input type="text" id="epName" value="${p.name.replace(/"/g,'&quot;')}"/></div><div style="display:flex;gap:10px;margin-top:4px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger btn-sm" onclick="closeThendeletePos('${stageId}','${posId}')">${t('deletePos')}</button><button class="btn btn-primary" style="flex:1" onclick="savePosEdit('${stageId}','${posId}')">${t('save')}</button></div>`);}
function closeThenDeletePos(stageId,posId){closeModal();deletePosConfirm(stageId,posId);}
function savePosEdit(stageId,posId){const name=document.getElementById('epName')?.value.trim();if(!name){showToast(t('enterName'),'err');return;}updateStages(ss=>ss.map(s=>s.id!==stageId?s:{...s,positions:(s.positions||[]).map(p=>p.id!==posId?p:{...p,name})}));closeModal();renderPos();showToast(t('objUpdated'));}
// ── WORK/MAT ACTIONS ──
function updatePos(stageId,posId,fn){updateStages(ss=>ss.map(s=>s.id!==stageId?s:{...s,positions:(s.positions||[]).map(p=>p.id!==posId?p:fn(p))}));}
function updateNwPlan(){
  const ca=parseFloat(document.getElementById('newWorkContract')?.value)||0;
  ['a','i','f'].forEach(k=>{
    const pct=parseFloat(document.getElementById('nwPlan_'+k)?.value)||0;
    const el=document.getElementById('nwPlanAmt_'+k);
    if(el)el.textContent=ca>0?fmtShort(Math.round(ca*pct/100)):'—';
  });
}
function updateEwPlan(){
  const ca=parseFloat(document.getElementById('ewContract')?.value)||0;
  ['a','i','f'].forEach(k=>{
    const pct=parseFloat(document.getElementById('ewPlan_'+k)?.value)||0;
    const el=document.getElementById('ewPlanAmt_'+k);
    if(el)el.textContent=fmtShort(Math.round(ca*pct/100));
  });
}
function getPaymentPlan(prefix){
  return{
    a:parseFloat(document.getElementById(prefix+'_a')?.value)||30,
    i:parseFloat(document.getElementById(prefix+'_i')?.value)||40,
    f:parseFloat(document.getElementById(prefix+'_f')?.value)||30
  };
}
function addWork(stageId,posId){
  const name=document.getElementById('newWorkName')?.value.trim();
  const ca=parseFloat(document.getElementById('newWorkContract')?.value)||0;
  const ctr=document.getElementById('newWorkContractor')?.value.trim()||'';
  const phn=document.getElementById('newWorkPhone')?.value.trim()||'';
  const sd=document.getElementById('nwStartVal')?.value||'';
  const ed=document.getElementById('nwEndVal')?.value||'';
  const note=document.getElementById('newWorkNote')?.value.trim()||'';
  const paymentPlan={a:30,i:40,f:30};
  if(!name){showToast(t('enterName'),'err');return;}
  if(!ca){showToast(t('enterBudget'),'err');return;}
  updatePos(stageId,posId,p=>({...p,works:[...(p.works||[]),{id:newId(),name,contractAmount:ca,paid:0,contractor:ctr,phone:phn,startDate:sd,endDate:ed,note,done:false,paymentPlan,paymentHistory:[]}]}));
  if(ctr)upsertContractor(ctr,phn);
  ['newWorkName','newWorkContract','newWorkContractor','newWorkPhone','newWorkNote'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const sd2=document.getElementById('nwStartDisp');if(sd2){sd2.innerHTML='<i class="ph ph-calendar"></i> '+t('startDate');sd2.classList.remove('has-value');}
  const ed2=document.getElementById('nwEndDisp');if(ed2){ed2.innerHTML='<i class="ph ph-flag"></i> '+t('endDate');ed2.classList.remove('has-value');}
  if(navigator.vibrate)navigator.vibrate(30);
  toggleWorkForm();
  renderPos();renderDetail();renderDashBottom();showToast(t('posAdded'));
}
function addMat(stageId,posId){
  const name=document.getElementById('newMatName')?.value.trim();
  const qty=parseFloat(document.getElementById('newMatQty')?.value)||1;
  const unit=document.getElementById('newMatUnit')?.value||'шт';
  const price=parseFloat(document.getElementById('newMatPrice')?.value)||0;
  const note=document.getElementById('newMatNote')?.value.trim()||'';
  if(!name){showToast(t('enterName'),'err');return;}
  if(!price){showToast(t('enterBudget'),'err');return;}
  updatePos(stageId,posId,p=>({...p,mats:[...(p.mats||[]),{id:newId(),name,qty,unit,price,note,addedAt:Date.now()}]}));
  ['newMatName','newMatPrice','newMatNote'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const qel=document.getElementById('newMatQty');if(qel)qel.value='1';
  if(navigator.vibrate)navigator.vibrate(30);
  toggleMatForm();
  renderPos();renderDetail();renderDashBottom();showToast(t('posAdded'));
}
function autoStageStatus(stageId){
  const prevStatus=(stages().find(s=>s.id===stageId)||{}).status;
  updateStages(ss=>ss.map(s=>{
    if(s.id!==stageId)return s;
    const pos=s.positions||[];if(!pos.length)return s;
    const allDone=pos.every(p=>p.status==='done');
    const anyActive=pos.some(p=>p.status!=='idle');
    const newStatus=allDone?'done':anyActive?'active':'idle';
    if(newStatus!==prevStatus){
      if(newStatus==='done')addJournalEntry(db.activeObjectId,'stage_done',(lang==='ru'?'Этап завершён: ':'Stage done: ')+(tName(s)||s.name));
      else if(newStatus==='active'&&prevStatus==='idle')addJournalEntry(db.activeObjectId,'stage_active',(lang==='ru'?'Этап начат: ':'Stage started: ')+(tName(s)||s.name));
    }
    return{...s,status:newStatus};
  }));
}
function toggleWork(stageId,posId,workId){
  updatePos(stageId,posId,p=>{
    const works=(p.works||[]).map(w=>w.id!==workId?w:{...w,done:!w.done});
    const anyDone=works.some(w=>w.done);
    const allDone=works.length>0&&works.every(w=>w.done);
    return{...p,works,status:allDone?'done':anyDone?'active':'idle'};
  });
  autoStageStatus(stageId);
  renderPos();renderDetail();renderDashBottom();
  setTimeout(animateNums,50);
}
function deleteWork(stageId,posId,workId){
  const s=stages().find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  const w=(p?.works||[]).find(wk=>wk.id===workId);
  if(!w)return;
  showModal('<div class="modal-handle"></div><div class="modal-title">'+(lang==='ru'?'Удалить работу?':lang==='az'?'İşi silin?':'Delete work?')+'</div>'+
    '<p style="color:var(--text2);font-size:14px;margin-bottom:20px">«'+w.name+'»</p>'+
    '<div style="display:flex;gap:10px">'+
      '<button class="btn btn-secondary" onclick="closeModal()">'+t('cancel')+'</button>'+
      '<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteWork(\''+stageId+'\',\''+posId+'\',\''+workId+'\')">'+t('delete')+'</button>'+
    '</div>');
}
function confirmDeleteWork(stageId,posId,workId){
  updatePos(stageId,posId,p=>({...p,works:(p.works||[]).filter(w=>w.id!==workId)}));
  closeModal();renderPos();renderDetail();renderDashBottom();showToast(t('posDeleted'));
}
function deleteMat(stageId,posId,matId){
  const s=stages().find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  const m=(p?.mats||[]).find(mt=>mt.id===matId);
  if(!m)return;
  showModal('<div class="modal-handle"></div><div class="modal-title">'+(lang==='ru'?'Удалить материал?':lang==='az'?'Materialı silin?':'Delete material?')+'</div>'+
    '<p style="color:var(--text2);font-size:14px;margin-bottom:20px">«'+m.name+'»</p>'+
    '<div style="display:flex;gap:10px">'+
      '<button class="btn btn-secondary" onclick="closeModal()">'+t('cancel')+'</button>'+
      '<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteMat(\''+stageId+'\',\''+posId+'\',\''+matId+'\')">'+t('delete')+'</button>'+
    '</div>');
}
function confirmDeleteMat(stageId,posId,matId){
  updatePos(stageId,posId,p=>({...p,mats:(p.mats||[]).filter(m=>m.id!==matId)}));
  closeModal();renderPos();renderDetail();renderDashBottom();showToast(t('posDeleted'));
}
function editWorkPrompt(stageId,posId,workId){
  const s=stages().find(st=>st.id===stageId);const p=(s?.positions||[]).find(pos=>pos.id===posId);const w=(p?.works||[]).find(wk=>wk.id===workId);if(!w)return;
  const sDisp=w.startDate?'<i class="ph ph-calendar"></i> '+w.startDate.split('-').reverse().join('.'):'<i class="ph ph-calendar"></i> '+t('startDate');
  const eDisp=w.endDate?'<i class="ph ph-flag"></i> '+w.endDate.split('-').reverse().join('.'):'<i class="ph ph-flag"></i> '+t('endDate');
  showModal(`<div class="modal-handle"></div><div class="modal-title"><i class="ph ph-hard-hat"></i> ${lang==='ru'?'Редактировать работу':lang==='az'?'İşi redaktə et':'Edit work'}</div>
    <div class="form-group"><label class="form-label">${t('workName')}</label><input type="text" id="ewName" value="${w.name.replace(/"/g,'&quot;')}"/></div>
    <div style="margin-bottom:14px">
      <label class="form-label">${t('contractAmount')} ₼</label>
      <input type="number" id="ewContract" value="${w.contractAmount||0}" oninput="updateEwPlan()"/>
    </div>
    <div class="form-group">
      <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">${t('contractor')} <button onclick="showContractorPicker('ewContractor','ewPhone')" style="background:none;border:none;color:var(--gold);font-size:12px;font-weight:600;cursor:pointer;font-family:'Mulish',sans-serif;padding:0"><i class="ph ph-user-list"></i> ${lang==='ru'?'Выбрать из списка':'Pick from list'}</button></label>
      <div class="autocomplete-wrap">
        <input type="text" id="ewContractor" value="${(w.contractor||'').replace(/"/g,'&quot;')}" oninput="showContractorSuggest(this,'ewContractor','ewPhone','ewContractorSuggest')" autocomplete="off"/>
        <div id="ewContractorSuggest" class="autocomplete-list" style="display:none"></div>
      </div>
    </div>
    <div class="form-group"><label class="form-label">${t('phone')}</label><input type="text" id="ewPhone" value="${(w.phone||'').replace(/"/g,'&quot;')}"/></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div><label class="form-label" style="font-size:10px;display:block;margin-bottom:6px">${t('startDate')}</label><div class="drum-date-display ${w.startDate?'has-value':''}" id="ewStartDisp" onclick="pickEwDate('ewStart')" style="padding:8px 10px;font-size:12px;cursor:pointer">${sDisp}</div><input type="hidden" id="ewStartVal" value="${w.startDate||''}"/></div>
      <div><label class="form-label" style="font-size:10px;display:block;margin-bottom:6px">${t('endDate')}</label><div class="drum-date-display ${w.endDate?'has-value':''}" id="ewEndDisp" onclick="pickEwDate('ewEnd')" style="padding:8px 10px;font-size:12px;cursor:pointer">${eDisp}</div><input type="hidden" id="ewEndVal" value="${w.endDate||''}"/></div>
    </div>
    <div class="form-group"><label class="form-label">${t('note')}</label><input type="text" id="ewNote" value="${(w.note||'').replace(/"/g,'&quot;')}"/></div>
    <div style="display:flex;gap:10px;margin-top:4px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="saveWorkEdit('${stageId}','${posId}','${workId}')">${t('save')}</button></div>`);
}
function pickEwDate(f){const hidId=f==='ewStart'?'ewStartVal':'ewEndVal';openDrumPicker(f,document.getElementById(hidId)?.value||'');}
// ── PAYMENTS ──
function showAddPaymentModal(stageId,posId,workId){
  const o=curObj();if(!o)return;
  const s=(o.stages||[]).find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  const w=(p?.works||[]).find(wk=>wk.id===workId);
  if(!w)return;
  const paid=w.paid||0;
  const unpaid=Math.max(0,(w.contractAmount||0)-paid);
  const contract=w.contractAmount||0;
  // Подсказки
  const hints=[];
  if(unpaid>0)hints.push({lbl:lang==='ru'?'Остаток':'Remaining',val:unpaid});
  if(!paid&&contract>0)hints.push({lbl:'30%',val:Math.round(contract*0.3)});
  const hintBtns=hints.map(h=>`<button type="button" onclick="document.getElementById('_payAmt').value='${h.val}'" style="padding:5px 10px;border-radius:8px;background:var(--bg3);border:1px solid var(--border);color:var(--text2);font-size:12px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer">${h.lbl}: ${fmtShort(h.val)}</button>`).join('');
  // История из payments[]
  const hist=(o.payments||[]).filter(pm=>pm.workId===String(workId)).slice().reverse()
    .map(pm=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:11px;color:var(--text3);flex:1">${pm.ts?new Date(pm.ts).toLocaleDateString('ru',{day:'2-digit',month:'2-digit'}):'—'}${pm.note?' · '+pm.note:''}</span>
      <span style="font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:var(--green)">+${fmtShort(pm.amount)}</span>
    </div>`).join('');
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title"><i class="ph ph-coins"></i> ${lang==='ru'?'Выплата':'Payment'}</div>
    <div style="font-size:13px;font-weight:600;margin-bottom:4px">${w.name}${w.contractor?' · <span style="color:var(--text2);font-weight:400">'+w.contractor+'</span>':''}</div>
    <div style="display:flex;background:var(--bg3);border-radius:10px;overflow:hidden;margin-bottom:14px">
      <div style="flex:1;padding:10px 12px;border-right:1px solid var(--border)">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Договор':'Contract'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700">${fmtShort(contract)}</div>
      </div>
      <div style="flex:1;padding:10px 12px;border-right:1px solid var(--border)">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Выплачено':'Paid'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:var(--green)">${fmtShort(paid)}</div>
      </div>
      <div style="flex:1;padding:10px 12px">
        <div style="font-size:9px;color:${unpaid>0?'var(--red)':'var(--text3)'};text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Остаток':'Left'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:${unpaid>0?'var(--red)':'var(--text3)'}">${fmtShort(unpaid)}</div>
      </div>
    </div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Сумма':'Amount'} ₼</label>
      <input type="number" id="_payAmt" placeholder="0" value="${!paid&&unpaid>0?Math.round(contract*0.3):''}"/>
      ${hintBtns?`<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">${hintBtns}</div>`:''}
    </div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Примечание':'Note'}</label><input type="text" id="_payNote" placeholder="${lang==='ru'?'Аванс, расчёт...':'Advance, final...'}"/></div>
    ${hist?`<div style="margin-bottom:12px"><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px">${lang==='ru'?'История':'History'}</div>${hist}</div>`:''}
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="confirmAddPayment('${stageId}','${posId}','${workId}','${w.contractor||''}')">${lang==='ru'?'Выплатить':'Pay'}</button>
    </div>`);
  setTimeout(()=>document.getElementById('_payAmt')?.select(),100);
}
function confirmAddPayment(stageId,posId,workId,contractor){
  const amt=parseFloat(document.getElementById('_payAmt')?.value)||0;
  const note=document.getElementById('_payNote')?.value.trim()||'';
  if(!amt){showToast(t('enterBudget'),'err');return;}
  addPayment({workId,stageId,posId,contractor,amount:amt,note});
  closeModal();renderPos();renderDetail();renderDashBottom();
  if(typeof renderFinancePayments==='function'){}
  showToast((lang==='ru'?'Выплачено: ':'Paid: ')+fmtShort(amt));
}
function quickPayWork(stageId,posId,workId){
  const s=stages().find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  const w=(p?.works||[]).find(wk=>wk.id===workId);
  if(!w)return;
  const unpaid=Math.max(0,(w.contractAmount||0)-(w.paid||0));
  const contract=w.contractAmount||0;
  const hasPayments=(w.paymentHistory||[]).length>0;
  // Подсказки сумм
  const avans=Math.round(contract*0.3);
  const hints=!hasPayments&&contract>0?[
    {lbl:lang==='ru'?'Аванс 30%':'Adv. 30%',val:avans},
    {lbl:lang==='ru'?'Аванс 50%':'Adv. 50%',val:Math.round(contract*0.5)},
  ]:[
    {lbl:lang==='ru'?'Весь остаток':'Full remaining',val:unpaid},
  ];
  const hintBtns=hints.map(h=>`<button type="button" onclick="document.getElementById('quickPayAmt').value='${h.val}'" style="padding:5px 10px;border-radius:8px;background:var(--bg3);border:1px solid var(--border);color:var(--text2);font-size:12px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer">${h.lbl}: ${fmtShort(h.val)}</button>`).join('');
  // Типы
  const types=lang==='ru'?['Аванс','Промежуточный','Расчёт']:['Advance','Progress','Final'];
  const defType=!hasPayments?0:unpaid===0?2:1;
  const typeChips=types.map((t,i)=>`<button type="button" id="ptype_${i}" onclick="document.querySelectorAll('[id^=ptype_]').forEach(b=>{b.style.background='var(--bg2)';b.style.borderColor='var(--border)';b.style.color='var(--text2)'});this.style.background='rgba(201,170,124,.15)';this.style.borderColor='var(--gold)';this.style.color='var(--gold)';window._qpType='${t}'" style="flex:1;padding:8px 4px;border-radius:10px;border:1px solid ${i===defType?'var(--gold)':'var(--border)'};background:${i===defType?'rgba(201,170,124,.15)':'var(--bg2)'};color:${i===defType?'var(--gold)':'var(--text2)'};font-size:12px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer">${t}</button>`).join('');
  window._qpType=types[defType];
  // История
  const hist=(w.paymentHistory||[]).slice().reverse().map(ph=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)"><span style="font-size:11px;color:var(--text3);flex:1">${ph.type||'—'} · ${ph.ts?new Date(ph.ts).toLocaleDateString('ru',{day:'2-digit',month:'2-digit'}):'—'}</span><span style="font-family:'DM Mono',monospace;font-size:12px;font-weight:700;color:var(--green)">+${fmtShort(ph.amount)}</span></div>`).join('');
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title"><i class="ph ph-coins"></i> ${lang==='ru'?'Выплата':'Payment'}</div>
    <div style="font-size:13px;font-weight:600;margin-bottom:4px">${w.name}${w.contractor?' · <span style="color:var(--text2);font-weight:400">'+w.contractor+'</span>':''}</div>
    <div style="display:flex;gap:0;background:var(--bg3);border-radius:10px;overflow:hidden;margin-bottom:14px">
      <div style="flex:1;padding:10px 12px;border-right:1px solid var(--border)">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Договор':'Contract'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700">${fmtShort(contract)}</div>
      </div>
      <div style="flex:1;padding:10px 12px;border-right:1px solid var(--border)">
        <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Выплачено':'Paid'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:var(--green)">${fmtShort(w.paid||0)}</div>
      </div>
      <div style="flex:1;padding:10px 12px">
        <div style="font-size:9px;color:${unpaid>0?'var(--red)':'var(--text3)'};text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${lang==='ru'?'Остаток':'Left'}</div>
        <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:${unpaid>0?'var(--red)':'var(--text3)'}">${fmtShort(unpaid)}</div>
      </div>
    </div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Сумма':'Amount'} ₼</label>
      <input type="number" id="quickPayAmt" placeholder="0" value="${!hasPayments&&avans>0?avans:''}"/>
      ${hintBtns?`<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">${hintBtns}</div>`:''}
    </div>
    ${hist?`<div style="margin-bottom:12px"><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px">${lang==='ru'?'История выплат':'History'}</div>${hist}</div>`:''}
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="confirmQuickPay('${stageId}','${posId}','${workId}')">${lang==='ru'?'Выплатить':'Pay'}</button>
    </div>`);
  setTimeout(()=>document.getElementById('quickPayAmt')?.select(),100);
}
function confirmQuickPay(stageId,posId,workId){
  const amt=parseFloat(document.getElementById('quickPayAmt')?.value)||0;
  if(!amt){showToast(t('enterBudget'),'err');return;}
  const s=stages().find(st=>st.id===stageId);
  const p=(s?.positions||[]).find(pos=>pos.id===posId);
  const w=(p?.works||[]).find(wk=>wk.id===workId);
  if(!w)return;
  const newPaid=(w.paid||0)+amt;
  const payType=window._qpType||'';
  const payEntry={amount:amt,ts:Date.now(),type:payType,contractor:w.contractor||'',name:w.name||''};
  updatePos(stageId,posId,p=>({...p,works:(p.works||[]).map(wk=>wk.id!==workId?wk:{...wk,paid:newPaid,paymentHistory:[...(wk.paymentHistory||[]),payEntry]})}));
  const rest=Math.max(0,(w.contractAmount||0)-newPaid);
  addJournalEntry(db.activeObjectId,'payment',
    (payType?payType+': ':lang==='ru'?'Выплата: ':'Payment: ')+fmtShort(amt)+
    (w.contractAmount?(rest>0?' · '+(lang==='ru'?'ост. ':'left ')+fmtShort(rest):(lang==='ru'?' · расчёт':' · settled')):'') +
    (w.contractor?' → '+w.contractor:''),
    {amount:amt,contract:w.contractAmount,work:w.name,contractor:w.contractor});
  if(w.contractor)upsertContractor(w.contractor,w.phone||'');
  saveDB();
  closeModal();renderPos();renderDetail();renderDashBottom();
  showToast((lang==='ru'?'Выплачено: ':'Paid: ')+fmtShort(amt));
}
function saveWorkEdit(stageId,posId,workId){
  const name=document.getElementById('ewName')?.value.trim();if(!name){showToast(t('enterName'),'err');return;}
  const ctr=document.getElementById('ewContractor')?.value.trim()||'';
  const paymentPlan={a:30,i:40,f:30};
  const patch={name,contractAmount:parseFloat(document.getElementById('ewContract')?.value)||0,paymentPlan,contractor:ctr,phone:document.getElementById('ewPhone')?.value.trim()||'',startDate:document.getElementById('ewStartVal')?.value||'',endDate:document.getElementById('ewEndVal')?.value||'',note:document.getElementById('ewNote')?.value.trim()||''};
  updatePos(stageId,posId,p=>({...p,works:(p.works||[]).map(w=>w.id!==workId?w:{...w,...patch})}));
  if(ctr)upsertContractor(ctr,patch.phone||'');
  closeModal();renderPos();renderDetail();renderDashBottom();showToast(t('objUpdated'));
}
function editMatPrompt(stageId,posId,matId){const s=stages().find(st=>st.id===stageId);const p=(s?.positions||[]).find(pos=>pos.id===posId);const m=(p?.mats||[]).find(mt=>mt.id===matId);if(!m)return;const UNITS=['шт','м²','м³','п.м.','кг','мешок','л'];showModal(`<div class="modal-handle"></div><div class="modal-title">🧱 ${t('editPos')}</div><div class="form-group"><label class="form-label">${t('matName')}</label><input type="text" id="emName" value="${m.name.replace(/"/g,'&quot;')}"/></div><div class="form-group"><label class="form-label">${t('qty')} / ${t('unit')}</label><div style="display:grid;grid-template-columns:1fr 80px 1fr;align-items:center;gap:6px"><input type="number" id="emQty" value="${m.qty||1}"/><select id="emUnit" style="background:rgba(255,255,255,.05);border:1px solid var(--border2);color:var(--text);border-radius:10px;padding:10px 6px;font-family:'Mulish',sans-serif;font-size:13px;outline:none;-webkit-appearance:none;text-align:center">${UNITS.map(u=>`<option value="${u}"${(m.unit||'шт')===u?' selected':''}>${u}</option>`).join('')}</select><input type="number" id="emPrice" value="${m.price||0}"/></div></div><div class="form-group"><label class="form-label">${t('note')}</label><input type="text" id="emNote" value="${(m.note||'').replace(/"/g,'&quot;')}"/></div><div style="display:flex;gap:10px;margin-top:4px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="saveMatEdit('${stageId}','${posId}','${matId}')">${t('save')}</button></div>`);}
function saveMatEdit(stageId,posId,matId){const name=document.getElementById('emName')?.value.trim();if(!name){showToast(t('enterName'),'err');return;}const patch={name,qty:parseFloat(document.getElementById('emQty')?.value)||1,unit:document.getElementById('emUnit')?.value||'шт',price:parseFloat(document.getElementById('emPrice')?.value)||0,note:document.getElementById('emNote')?.value.trim()||'',addedAt:Date.now()};updatePos(stageId,posId,p=>({...p,mats:(p.mats||[]).map(m=>m.id!==matId?m:{...m,...patch})}));closeModal();renderPos();renderDetail();renderDashBottom();showToast(t('objUpdated'));}
