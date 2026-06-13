// ── MODAL ──
function showModal(html){
  closeModal();
  const bd=document.createElement('div');
  bd.className='modal-backdrop';bd.id='modalBackdrop';
  bd.innerHTML=`<div class="modal">${html}</div>`;
  bd.addEventListener('click',e=>{if(e.target===bd)closeModal();});
  document.body.appendChild(bd);
  // Свайп вниз в любом месте модалки — закрыть
  const modal=bd.querySelector('.modal');
  if(modal){
    let ty0=0,tx0=0,dragging=false,scrollLocked=false;
    modal.addEventListener('touchstart',e=>{
      ty0=e.touches[0].clientY;tx0=e.touches[0].clientX;
      dragging=false;scrollLocked=false;
    },{passive:true});
    modal.addEventListener('touchmove',e=>{
      const dy=e.touches[0].clientY-ty0;
      const dx=Math.abs(e.touches[0].clientX-tx0);
      // Определяем направление один раз
      if(!dragging&&!scrollLocked){
        if(Math.abs(dy)<5&&dx<5)return;
        if(dy>0&&dx<dy&&modal.scrollTop===0){dragging=true;modal.style.transition='none';}
        else{scrollLocked=true;return;}
      }
      if(!dragging||scrollLocked)return;
      const offset=Math.max(0,dy);
      modal.style.transform=`translateY(${offset}px)`;
      modal.style.opacity=String(Math.max(0,1-offset/250));
    },{passive:true});
    modal.addEventListener('touchend',e=>{
      if(!dragging)return;dragging=false;scrollLocked=false;
      const dy=e.changedTouches[0].clientY-ty0;
      modal.style.transition='';
      if(dy>90){closeModal();}
      else{modal.style.transform='';modal.style.opacity='';}
    },{passive:true});
  }
}
function closeModal(){
  document.getElementById('modalBackdrop')?.remove();
}
function showDrumOverlay(html){closeDrumOverlay();const bd=document.createElement('div');bd.className='modal-backdrop';bd.id='drumOverlay';bd.style.zIndex='250';bd.innerHTML=`<div class="modal">${html}</div>`;bd.addEventListener('click',e=>{if(e.target===bd)closeDrumOverlay();});document.body.appendChild(bd);}
function closeDrumOverlay(){document.getElementById('drumOverlay')?.remove();}
// ── DRUM DATE PICKER ──
const MONTHS_RU=['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
const MONTHS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_AZ=['Yan','Fev','Mar','Apr','May','İyn','İyl','Avq','Sen','Okt','Noy','Dek'];
const getMonths=()=>lang==='en'?MONTHS_EN:lang==='az'?MONTHS_AZ:MONTHS_RU;
let _drum={field:null,day:1,month:1,year:new Date().getFullYear()};
function openDrumPicker(field,currentVal){
  const now=new Date();_drum.field=field;
  if(currentVal&&currentVal.length===10){const p=currentVal.split('-').map(Number);_drum.day=p[2];_drum.month=p[1];_drum.year=p[0];}
  else{_drum.day=now.getDate();_drum.month=now.getMonth()+1;_drum.year=now.getFullYear();}
  const days=Array.from({length:31},(_,i)=>String(i+1).padStart(2,'0'));
  const months=getMonths();
  const years=Array.from({length:8},(_,i)=>String(now.getFullYear()+i));
  const clr=lang==='en'?'Clear':lang==='az'?'Sil':'Очистить';
  const dl=lang==='en'?'Day':lang==='az'?'Gün':'День';
  const ml=lang==='en'?'Month':lang==='az'?'Ay':'Месяц';
  const yl=lang==='en'?'Year':lang==='az'?'İl':'Год';
  const isOv=(field==='ewStart'||field==='ewEnd'||field==='stageEnd');
  const showFn=isOv?showDrumOverlay:showModal;
  showFn('<div class="modal-handle"></div>'
    +'<div class="modal-title">'+(field.includes('Start')||field==='nwStart'?t('startDate'):t('endDate'))+'</div>'
    +'<div class="drum-picker">'
      +'<div class="drum-col"><div class="drum-col-label">'+dl+'</div>'+buildDrum('day',days,_drum.day-1)+'</div>'
      +'<div class="drum-divider"></div>'
      +'<div class="drum-col"><div class="drum-col-label">'+ml+'</div>'+buildDrum('month',months,_drum.month-1)+'</div>'
      +'<div class="drum-divider"></div>'
      +'<div class="drum-col"><div class="drum-col-label">'+yl+'</div>'+buildDrum('year',years,Math.max(0,years.indexOf(String(_drum.year))))+'</div>'
    +'</div>'
    +'<div style="display:flex;gap:10px;margin-top:16px">'
      +'<button class="btn btn-secondary" onclick="clearDrumDate(\''+field+'\')">'+clr+'</button>'
      +'<button class="btn btn-primary" onclick="confirmDrumDate()">'+t('save')+'</button>'
    +'</div>');
  setTimeout(()=>{initDrum('day',days,_drum.day-1);initDrum('month',months,_drum.month-1);initDrum('year',years,Math.max(0,years.indexOf(String(_drum.year))));},50);
}
function buildDrum(name,items,activeIdx){let h='<div class="drum-wrap" id="drum-'+name+'"><div class="drum-selector"></div><div class="drum-list" id="drumlist-'+name+'"><div class="drum-item"></div><div class="drum-item"></div>';items.forEach((it,i)=>{h+='<div class="drum-item'+(i===activeIdx?' active':'')+'" data-i="'+i+'">'+it+'</div>';});h+='<div class="drum-item"></div><div class="drum-item"></div></div></div>';return h;}
function initDrum(name,items,activeIdx){
  const list=document.getElementById('drumlist-'+name),wrap=document.getElementById('drum-'+name);if(!list||!wrap)return;
  const itemH=44;let curIdx=Math.max(0,Math.min(items.length-1,activeIdx));
  function scrollTo(idx,animate){curIdx=Math.max(0,Math.min(items.length-1,idx));list.style.transition=animate?'transform .22s cubic-bezier(.25,.46,.45,.94)':'none';list.style.transform='translateY('+(-curIdx*itemH)+'px)';list.querySelectorAll('.drum-item').forEach((el,i)=>{const rel=i-2-curIdx;el.classList.toggle('active',rel===0);el.classList.toggle('near',Math.abs(rel)===1);});if(name==='day')_drum.day=curIdx+1;else if(name==='month')_drum.month=curIdx+1;else _drum.year=parseInt(items[curIdx]);}
  scrollTo(curIdx,false);
  let ty=0,ti=0;
  wrap.addEventListener('touchstart',e=>{ty=e.touches[0].clientY;ti=curIdx;list.style.transition='none';},{passive:true});
  wrap.addEventListener('touchmove',e=>{scrollTo(Math.round(ti+(ty-e.touches[0].clientY)/itemH),false);},{passive:true});
  wrap.addEventListener('touchend',()=>{list.style.transition='transform .15s ease';scrollTo(curIdx,true);},{passive:true});
  wrap.addEventListener('wheel',e=>{e.preventDefault();scrollTo(curIdx+(e.deltaY>0?1:-1),true);},{passive:false});
}
function confirmDrumDate(){
  const d=String(_drum.day).padStart(2,'0'),m=String(_drum.month).padStart(2,'0'),y=String(_drum.year);
  const val=y+'-'+m+'-'+d,disp=d+'.'+m+'.'+y,f=_drum.field;
  const MAP={nwStart:['nwStartVal','nwStartDisp','<i class="ph ph-calendar"></i> '],nwEnd:['nwEndVal','nwEndDisp','<i class="ph ph-flag"></i> '],ewStart:['ewStartVal','ewStartDisp','<i class="ph ph-calendar"></i> '],ewEnd:['ewEndVal','ewEndDisp','<i class="ph ph-flag"></i> '],stageEnd:['stageEndDate','stageEndDateDisp','<i class="ph ph-flag"></i> ']};
  const e=MAP[f];if(e){const h=document.getElementById(e[0]);if(h)h.value=val;const dis=document.getElementById(e[1]);if(dis){dis.innerHTML=e[2]+disp;dis.classList.add('has-value');}}
  if(f==='ewStart'||f==='ewEnd'||f==='stageEnd')closeDrumOverlay();else closeModal();showToast(disp);
}
function clearDrumDate(field){
  const MAP={nwStart:['nwStartVal','nwStartDisp','<i class="ph ph-calendar"></i> '+t('startDate')],nwEnd:['nwEndVal','nwEndDisp','<i class="ph ph-flag"></i> '+t('endDate')],ewStart:['ewStartVal','ewStartDisp','<i class="ph ph-calendar"></i> '+t('startDate')],ewEnd:['ewEndVal','ewEndDisp','<i class="ph ph-flag"></i> '+t('endDate')]};
  const e=MAP[field];if(e){const h=document.getElementById(e[0]);if(h)h.value='';const dis=document.getElementById(e[1]);if(dis){dis.innerHTML=e[2];dis.classList.remove('has-value');}}
  if(field==='ewStart'||field==='ewEnd')closeDrumOverlay();else closeModal();
}
// ── PDF EXPORT ──
function exportPDF(){
  const obj=curObj(),st=stages(),tf=totalFact(),tb=totalBudget();
  const now=new Date(),dateStr=now.toLocaleDateString('ru-RU',{day:'2-digit',month:'long',year:'numeric'});
  const totalDebt=st.reduce((a,s)=>a+stageDebt(s),0);

  const stHTML=st.map(s=>{
    const fc=stageFact(s),sd=stageDebt(s),sc=stageContract(s),sp=sc>0?Math.min(stagePaid(s)/sc*100,100):0;
    const positions=s.positions||[];
    const posHTML=positions.map(p=>{
      const pd=posDebt(p);
      const worksHTML=(p.works||[]).length>0?`<table class="it"><thead><tr><th></th><th>${lang==='ru'?'Работа':'Work'}</th><th>${lang==='ru'?'Договор':'Contract'}</th><th>${lang==='ru'?'Выплачено':'Paid'}</th><th>${lang==='ru'?'Долг':'Debt'}</th></tr></thead><tbody>${(p.works||[]).map(w=>`<tr><td>👷</td><td>${w.name}${w.contractor?` (${w.contractor})`:''}</td><td style="text-align:right">${fmt(w.contractAmount||0)}</td><td style="text-align:right;color:#4a9b6a">${fmt(w.paid||0)}</td><td style="text-align:right;color:${Math.max(0,(w.contractAmount||0)-(w.paid||0))>0?'#c0392b':'#888'}">${fmt(Math.max(0,(w.contractAmount||0)-(w.paid||0)))}</td></tr>`).join('')}</tbody></table>`:'';
      const matsHTML=(p.mats||[]).length>0?`<table class="it"><thead><tr><th></th><th>${lang==='ru'?'Материал':'Material'}</th><th>${lang==='ru'?'Кол-во':'Qty'}</th><th>${lang==='ru'?'Цена':'Price'}</th><th>Σ</th></tr></thead><tbody>${(p.mats||[]).map(m=>`<tr><td>🧱</td><td>${m.name}</td><td style="text-align:center">${m.qty||1} ${m.unit||'шт'}</td><td style="text-align:right">${fmt(m.price||0)}</td><td style="text-align:right">${fmt(matTotal(m))}</td></tr>`).join('')}</tbody></table>`:'';
      return `<div class="pos-block"><div class="pos-header"><span class="pos-dot pos-dot-${p.status}">●</span><span class="pos-name">${p.name}</span>${pd>0?`<span style="color:#c0392b;font-weight:700;font-size:11px;margin-left:auto">⚠ ${fmt(pd)}</span>`:''}</div>${worksHTML}${matsHTML}</div>`;
    }).join('');
    return `<div class="stage-block"><div class="stage-header" style="border-left:4px solid ${s.color}">
      <div><div class="stage-name">${s.icon} ${tName(s)}</div>
      <div class="stage-sub">${positions.filter(p=>p.status==='done').length}/${positions.length} ${lang==='ru'?'позиций':'positions'}${s.endDate?' · 🏁 '+s.endDate.split('-').reverse().join('.'):''}${s.note?' · '+s.note:''}</div></div>
      <div class="stage-pct" style="color:${s.color}">${Math.round(sp)}%</div></div>
      <div class="stage-stats">
        <div class="stat-cell"><div class="stat-label">${l3('Потрачено','Xərcləndi','Spent')}</div><div class="stat-value green">${fmt(fc)}</div></div>
        <div class="stat-cell"><div class="stat-label">${l3('К выплате','Ödəniləcək','To pay')}</div><div class="stat-value ${sd>0?'red':'grey'}">${sd>0?fmt(sd):'—'}</div></div>
        <div class="stat-cell"><div class="stat-label">${lang==='ru'?'Позиции':'Positions'}</div><div class="stat-value">${positions.filter(p=>p.status==='done').length}/${positions.length}</div></div>
      </div>${posHTML}</div>`;
  }).join('');

  const html=`<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Mulish',sans-serif;background:#fff;color:#1a1a2e;font-size:13px;line-height:1.5}
  @page{size:A4;margin:16mm 14mm}
  .doc-header{background:#0D0F14;color:#EAE6DE;padding:20px 24px;border-radius:10px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}
  .doc-title{font-size:22px;font-weight:700;color:#C9AA7C;margin-bottom:4px}.doc-sub{font-size:12px;color:#888}
  .summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px}
  .sum-box{border-radius:8px;padding:14px 16px;border:1px solid #e8e4dc}
  .sum-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#999;margin-bottom:6px}
  .sum-val{font-family:'DM Mono',monospace;font-size:17px;font-weight:700}
  .green{color:#4a9b6a}.red{color:#c0392b}.blue{color:#4a7fb8}.grey{color:#aaa}
  .stage-block{border:1px solid #e8e4dc;border-radius:10px;margin-bottom:16px;overflow:hidden;break-inside:avoid}
  .stage-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#f9f8f6}
  .stage-name{font-size:14px;font-weight:700;margin-bottom:2px}.stage-sub{font-size:11px;color:#999}
  .stage-pct{font-family:'DM Mono',monospace;font-size:20px;font-weight:700}
  .stage-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#e8e4dc;border-top:1px solid #e8e4dc;border-bottom:1px solid #e8e4dc}
  .stat-cell{background:#fff;padding:10px 12px}.stat-label{font-size:9px;text-transform:uppercase;letter-spacing:.6px;color:#aaa;margin-bottom:4px}
  .stat-value{font-family:'DM Mono',monospace;font-size:13px;font-weight:600}
  .pos-block{border-top:1px solid #f0ede8;padding:8px 16px}
  .pos-header{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:13px}
  .pos-name{font-weight:600;flex:1}.pos-dot{font-size:8px}
  .pos-dot-done{color:#4a9b6a}.pos-dot-active{color:#b8924a}.pos-dot-idle{color:#ccc}
  .it{width:100%;border-collapse:collapse;margin-bottom:6px}
  .it thead tr{background:#f5f3ef}.it th{padding:5px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#999;border-bottom:1px solid #e8e4dc;text-align:left}
  .it td{padding:6px 8px;border-bottom:1px solid #f0ede8;font-size:12px}
  .doc-footer{margin-top:24px;padding-top:12px;border-top:1px solid #e8e4dc;display:flex;justify-content:space-between;font-size:10px;color:#bbb}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
  <div class="doc-header"><div><div class="doc-title">${obj.icon} ${tName(obj)||obj.name}</div><div class="doc-sub">${lang==='ru'?'Отчёт о бюджете строительства':'Construction budget report'}</div></div><div style="font-size:11px;color:#888">${dateStr}</div></div>
  <div class="summary">
    <div class="sum-box" style="border-top:3px solid #80C89A"><div class="sum-lbl">${l3('Потрачено','Xərcləndi','Spent')}</div><div class="sum-val green">${fmt(tf)}</div></div>
    <div class="sum-box" style="border-top:3px solid #CC7B7B"><div class="sum-lbl">${l3('К выплате','Ödəniləcək','To pay')}</div><div class="sum-val ${totalDebt>0?'red':'grey'}">${totalDebt>0?fmt(totalDebt):'—'}</div></div>
    <div class="sum-box" style="border-top:3px solid #7BB8CC"><div class="sum-lbl">${lang==='ru'?'Бюджет':'Budget'}</div><div class="sum-val blue">${tb>0?fmt(tb):'—'}</div></div>
  </div>
  ${stHTML}
  <div class="doc-footer"><span>${obj.icon} ${tName(obj)||obj.name}</span><span>${dateStr}</span></div>
    <!-- TAB BAR -->
  <div class="tab-bar" id="tabBar">
    <div class="tab-item active" id="tab-home" onclick="switchTab('home')">
      <i class="tab-icon ph ph-house"></i>
      <div class="tab-label" id="tabLabelHome">Главная</div>
    </div>
    <div class="tab-item" id="tab-masters" onclick="switchTab('masters')">
      <i class="tab-icon ph ph-hard-hat"></i>
      <div class="tab-label" id="tabLabelMasters">Мастера</div>
    </div>
    <div class="tab-item tab-item-add" id="tabAdd" onclick="onTabAdd()">
      <div class="tab-add-bubble"><i class="ph ph-plus"></i></div>
    </div>
    <div class="tab-item" id="tab-projects" onclick="switchTab('projects')">
      <i class="tab-icon ph ph-folder-open"></i>
      <div class="tab-label" id="tabLabelProjects">Проекты</div>
    </div>
    <div class="tab-item" id="tab-more" onclick="switchTab('more')">
      <i class="tab-icon ph ph-dots-three"></i>
      <div class="tab-label" id="tabLabelMore">Ещё</div>
    </div>
  </div>
</body></html>`;

  const w=window.open('','_blank','width=900,height=700');
  if(!w){showToast(lang==='ru'?'Разрешите всплывающие окна':'Allow popups','err');return;}
  w.document.write(html);w.document.close();
  w.onload=()=>{w.focus();w.print();};
  showToast(lang==='ru'?'PDF открывается...':'Opening PDF...');
}

function triggerImport(){document.getElementById('importFile').click();}
function handleImport(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const data=JSON.parse(ev.target.result);if(data.objects&&data.activeObjectId){if(data.objects[0]?.stages?.[0]?.positions!==undefined||data.objects[0]?.stages?.length===0){db=data;}else{db=migrateV8toV9(data);}saveDB();renderDash();showToast(t('importSuccess'));}else{showToast(t('importError'),'err');}}catch{showToast(t('importError'),'err');}};reader.readAsText(file);e.target.value='';}

// ── ФОТО ──
let _photoTarget=null;
function openWorkPhotoInput(sId,pId,wId){
  event&&event.stopPropagation();
  _photoTarget={type:'work',sId:sId,pId:pId,wId:wId};
  document.getElementById('photoInput').click();
}
function openStagePhotoInput(sId){
  event&&event.stopPropagation();
  _photoTarget={type:'stage',sId:sId};
  document.getElementById('photoInput').click();
}
function openJournalPhotoInput(){
  _photoTarget={type:'journal'};
  document.getElementById('photoInput').click();
}
function handlePhotoInput(e){
  var file=e.target.files[0];
  e.target.value='';
  if(!file||!_photoTarget)return;
  var target=_photoTarget;_photoTarget=null;
  showToast(lang==='ru'?'Сжимаю фото...':lang==='az'?'Sıxılır...':'Processing...');
  compressPhoto(file).then(function(dataUrl){
    var photoId=newPhotoId();
    return savePhoto(photoId,dataUrl).then(function(){
      var obj=db.objects.find(function(o){return o.id===db.activeObjectId;});
      if(!obj)return;
      if(target.type==='journal'){
        // Сохраняем временно, пользователь добавит текст и нажмёт "Записать"
        _journalPendingPhoto={photoId:photoId,dataUrl:dataUrl};
        var pr=document.getElementById('journalPhotoPreview');
        var btn=document.getElementById('journalCamBtn');
        if(pr){
          pr.style.display='block';
          pr.innerHTML='<div style="position:relative;display:inline-block;margin-bottom:4px">'
            +'<img src="'+dataUrl+'" style="max-width:80px;height:60px;object-fit:cover;border-radius:8px"/>'
            +'<button onclick="clearJournalPhoto()" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:var(--red);border:none;border-radius:50%;color:white;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">×</button>'
            +'</div>';
        }
        if(btn)btn.style.color='var(--gold)';
        var homeBtn=document.getElementById('homeNoteCamBtn');
        if(homeBtn)homeBtn.style.color='var(--gold)';
        var quickBtn=document.getElementById('quickNoteCamBtn');
        if(quickBtn)quickBtn.style.color='var(--gold)';
        // фото не сохраняем в IDB ещё — сохраним при addJournalNote
        return;
      } else if(target.type==='stage'){
        var s=(obj.stages||[]).find(function(st){return st.id===target.sId;});
        if(!s)return;
        if(!s.photos)s.photos=[];
        s.photos.push(photoId);
        idbSave(db);
        renderDetail();
        showToast(lang==='ru'?'Фото добавлено':lang==='az'?'Şəkil əlavə edildi':'Photo added');
      } else {
        var s2=(obj.stages||[]).find(function(st){return st.id===target.sId;});
        var p=s2?(s2.positions||[]).find(function(pos){return pos.id===target.pId;}):null;
        var w=p?(p.works||[]).find(function(wk){return wk.id===target.wId;}):null;
        if(!w)return;
        if(!w.photos)w.photos=[];
        w.photos.push(photoId);
        idbSave(db);
        renderPos();
        showToast(lang==='ru'?'Фото добавлено':lang==='az'?'Şəkil əlavə edildi':'Photo added');
      }
    });
  }).catch(function(err){
    console.error(err);
    showToast(lang==='ru'?'Ошибка загрузки фото':'Photo error');
  });
}
// Обратная совместимость (старый onchange)
function handleWorkPhoto(e){handlePhotoInput(e);}
function deleteWorkPhoto(photoId,sId,pId,wId){
  deletePhoto(photoId).then(function(){
    var obj=db.objects.find(function(o){return o.id===db.activeObjectId;});
    if(!obj)return;
    var s=(obj.stages||[]).find(function(st){return st.id===sId;});
    var p=s?(s.positions||[]).find(function(pos){return pos.id===pId;}):null;
    var w=p?(p.works||[]).find(function(wk){return wk.id===wId;}):null;
    if(!w)return;
    w.photos=(w.photos||[]).filter(function(id){return id!==photoId;});
    idbSave(db);
    var viewer=document.getElementById('photoViewer');
    if(viewer)viewer.remove();
    renderPos();
    showToast(lang==='ru'?'Фото удалено':lang==='az'?'Şəkil silindi':'Photo deleted');
  });
}
function deleteJournalPhoto(photoId,entryId){
  deletePhoto(photoId).then(function(){
    var o=curObj();if(!o)return;
    var entry=(o.journal||[]).find(function(e){return String(e.id)===String(entryId);});
    if(entry&&entry.meta)delete entry.meta.photoId;
    saveDB();
    var viewer=document.getElementById('photoViewer');
    if(viewer)viewer.remove();
    renderJournal();
    showToast(lang==='ru'?'Фото удалено':'Photo deleted');
  });
}
function deleteStagePhoto(photoId,sId){
  deletePhoto(photoId).then(function(){
    var obj=db.objects.find(function(o){return o.id===db.activeObjectId;});
    if(!obj)return;
    var s=(obj.stages||[]).find(function(st){return st.id===sId;});
    if(!s)return;
    s.photos=(s.photos||[]).filter(function(id){return id!==photoId;});
    idbSave(db);
    var viewer=document.getElementById('photoViewer');
    if(viewer)viewer.remove();
    renderDetail();
    showToast(lang==='ru'?'Фото удалено':lang==='az'?'Şəkil silindi':'Photo deleted');
  });
}

// ── PIN ──
const PIN_KEY='tikinti_pin',PIN_BIO='tikinti_bio';
let _pinMode=null,_pinEntered='',_pinTarget='';
const KEYPAD=[{n:'1',s:''},{n:'2',s:'ABC'},{n:'3',s:'DEF'},{n:'4',s:'GHI'},{n:'5',s:'JKL'},{n:'6',s:'MNO'},{n:'7',s:'PQRS'},{n:'8',s:'TUV'},{n:'9',s:'WXYZ'},null,{n:'0',s:'+'},'del'];
function pinLabel(mode){if(mode==='enter')return lang==='en'?'Enter PIN':lang==='az'?'PIN daxil edin':'Введите PIN';if(mode==='set')return lang==='en'?'Set new PIN':lang==='az'?'Yeni PIN':'Задайте PIN';return lang==='en'?'Confirm PIN':lang==='az'?'Təsdiq':'Подтвердите PIN';}
async function checkBiometric(){if(!window.PublicKeyCredential)return false;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();}catch{return false;}}
function showPinOverlay(mode,onSuccess){
  _pinMode=mode;_pinEntered='';_pinTarget='';
  const hasBio=localStorage.getItem(PIN_BIO)==='1',bioAvail='PublicKeyCredential' in window;
  const overlay=document.createElement('div');overlay.className='pin-overlay';overlay.id='pinOverlay';
  overlay.innerHTML=`<div class="pin-logo">🏡 Tikinti</div><div class="pin-subtitle">${pinLabel(mode)}</div><div class="pin-dots">${[0,1,2,3].map(i=>`<div class="pin-dot" id="pd${i}"></div>`).join('')}</div><div class="pin-pad">${KEYPAD.map(k=>{if(!k)return'<button class="pin-key empty"></button>';if(k==='del')return`<button class="pin-key del" onclick="pinDel()">⌫</button>`;return`<button class="pin-key" onclick="pinKey('${k.n}')"><span>${k.n}</span>${k.s?`<span class="pin-key-sub">${k.s}</span>`:''}</button>`;}).join('')}</div>${mode==='enter'&&hasBio&&bioAvail?`<button class="pin-bio" onclick="biometricAuth()">🫆</button>`:''} ${mode==='enter'?`<button style="background:none;border:none;color:var(--text3);font-size:12px;cursor:pointer;font-family:'Mulish',sans-serif;margin-top:4px" onclick="document.getElementById('pinOverlay').remove()">${t('cancel')}</button>`:''}`;
  overlay._onSuccess=onSuccess;document.body.appendChild(overlay);
  if(mode==='enter'&&hasBio&&bioAvail)setTimeout(()=>biometricAuth(),400);
}
async function biometricAuth(){if(!('credentials' in navigator))return;try{const c=await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rpId:location.hostname,userVerification:'required',allowCredentials:[],timeout:30000}});if(c){const ov=document.getElementById('pinOverlay'),cb=ov?._onSuccess;ov?.remove();if(cb)cb();showToast('✓');}}catch(e){console.log('Bio:',e.name);}}
function pinKey(n){if(_pinEntered.length>=4)return;_pinEntered+=n;updatePinDots();if(_pinEntered.length===4)setTimeout(processPinInput,150);}
function pinDel(){if(!_pinEntered.length)return;_pinEntered=_pinEntered.slice(0,-1);updatePinDots();}
function updatePinDots(error){for(let i=0;i<4;i++){const d=document.getElementById('pd'+i);if(!d)continue;d.classList.toggle('filled',!error&&i<_pinEntered.length);d.classList.toggle('error',!!error);}}
function processPinInput(){
  const stored=localStorage.getItem(PIN_KEY);
  if(_pinMode==='enter'){if(_pinEntered===stored){const ov=document.getElementById('pinOverlay'),cb=ov?._onSuccess;ov?.remove();if(cb)cb();}else{updatePinDots(true);setTimeout(()=>{_pinEntered='';updatePinDots();},600);if(navigator.vibrate)navigator.vibrate([50,30,50]);showToast(lang==='en'?'Wrong PIN':'Неверный PIN','err');}}
  else if(_pinMode==='set'){_pinTarget=_pinEntered;_pinEntered='';updatePinDots();const sub=document.querySelector('.pin-subtitle');if(sub)sub.textContent=pinLabel('confirm');_pinMode='confirm';}
  else if(_pinMode==='confirm'){if(_pinEntered===_pinTarget){localStorage.setItem(PIN_KEY,_pinEntered);document.getElementById('pinOverlay')?.remove();askBiometric();showToast('PIN ✓');}else{updatePinDots(true);setTimeout(()=>{_pinEntered='';_pinTarget='';_pinMode='set';updatePinDots();const sub=document.querySelector('.pin-subtitle');if(sub)sub.textContent=pinLabel('set');},600);showToast(lang==='en'?"PINs don't match":'PIN не совпадает','err');}}
}
async function askBiometric(){const avail=await checkBiometric();if(!avail)return;showModal(`<div class="modal-handle"></div><div class="modal-title" style="font-size:14px">${lang==='en'?'Enable fingerprint?':'Включить отпечаток?'}</div><div style="font-size:32px;text-align:center;margin:10px 0">🫆</div><div style="display:flex;gap:10px;margin-top:8px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="localStorage.setItem('${PIN_BIO}','1');closeModal();showToast('✓')">${lang==='en'?'Enable':'Включить'}</button></div>`);}
function checkPin(){const pin=localStorage.getItem(PIN_KEY);if(!pin)return;document.getElementById('pageDash').style.visibility='hidden';showPinOverlay('enter',()=>{document.getElementById('pageDash').style.visibility='';});}
function pinSettings(){const hasPin=!!localStorage.getItem(PIN_KEY),hasBio=localStorage.getItem(PIN_BIO)==='1';let h='<div class="modal-handle"></div><div class="modal-title">🔐 PIN</div><div style="display:flex;flex-direction:column;gap:10px">';h+=`<button class="btn btn-secondary" onclick="closeModal();showPinOverlay('set')">${hasPin?(lang==='en'?'Change PIN':'Изменить PIN'):(lang==='en'?'Set PIN':'Задать PIN')}</button>`;if(hasPin){h+=`<button class="btn btn-secondary" onclick="closeModal();confirmRemovePin()">${lang==='en'?'Remove PIN':'Удалить PIN'}</button>`;h+=`<button class="btn btn-secondary" onclick="toggleBio()">${hasBio?(lang==='en'?'Disable fingerprint':'Отключить отпечаток'):(lang==='en'?'Enable fingerprint':'Включить отпечаток')}</button>`;}h+='</div>';showModal(h);}
function toggleBio(){const h=localStorage.getItem(PIN_BIO)==='1';localStorage.setItem(PIN_BIO,h?'0':'1');closeModal();showToast('✓');}
function confirmRemovePin(){showModal(`<div class="modal-handle"></div><div class="modal-title">${lang==='en'?'Remove PIN?':'Удалить PIN?'}</div><div style="display:flex;gap:10px;margin-top:4px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" style="flex:1" onclick="localStorage.removeItem('${PIN_KEY}');localStorage.removeItem('${PIN_BIO}');closeModal();showToast(lang==='en'?'PIN removed':'PIN удалён')">${t('delete')}</button></div>`);}
// ── PWA / SWIPE ──
window._installPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window._installPrompt=e;renderDash();});
function installApp(){if(!window._installPrompt)return;window._installPrompt.prompt();window._installPrompt.userChoice.then(()=>{window._installPrompt=null;renderDash();});}
const dashPage=document.getElementById('pageDash');
// ── SWIPE BACK (detail/pos → назад) ──
function addSwipeBack(pageEl, onSwipeBack) {
  let txS=0,tyS=0,swD=null,swing=false;
  pageEl.addEventListener('touchstart',e=>{txS=e.touches[0].clientX;tyS=e.touches[0].clientY;swD=null;swing=false;},{passive:true});
  pageEl.addEventListener('touchmove',e=>{const dx=e.touches[0].clientX-txS,dy=e.touches[0].clientY-tyS;if(!swD)swD=Math.abs(dx)>Math.abs(dy)?'h':'v';if(swD==='h'&&dx>0){swing=true;const off=Math.min(dx,window.innerWidth);pageEl.style.transition='none';pageEl.style.transform='translateX('+off+'px)';pageEl.style.opacity=String(1-off/window.innerWidth);}},{passive:true});
  pageEl.addEventListener('touchend',e=>{if(!swing)return;const dx=e.changedTouches[0].clientX-txS;pageEl.style.transition='';pageEl.style.transform='';pageEl.style.opacity='';if(dx>80){onSwipeBack();}swing=false;},{passive:true});
}
addSwipeBack(document.getElementById('pageDetail'), goBack);
addSwipeBack(document.getElementById('pagePos'), goBack);
addSwipeBack(document.getElementById('pageJournal'), goBackJournal);

// ── TAB SWIPE (главная ↔ мастера ↔ финансы ↔ ещё) ──
function initTabSwipe(){
  const ORD=['home','masters','finance','more'];
  let txS=0,tyS=0,skip=false;
  document.getElementById('app').addEventListener('touchstart',e=>{
    skip=!!e.target.closest('.proj-carousel,#projStack,.proj-stack-card,.modal-backdrop');
    txS=e.touches[0].clientX;tyS=e.touches[0].clientY;
  },{passive:true});
  document.getElementById('app').addEventListener('touchend',e=>{
    if(skip||!TAB_PAGES[_activeTab])return;
    // Не переключаем табы если открыта любая drill-down страница
    const drillDown=['pageDetail','pagePos','pageObjFinance','pageJournal'];
    const onDrill=drillDown.some(function(id){
      var el=document.getElementById(id);
      return el&&!el.classList.contains('page-hidden-right');
    });
    if(onDrill)return;
    const dx=e.changedTouches[0].clientX-txS;
    const dy=e.changedTouches[0].clientY-tyS;
    if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*.75)return;
    const i=ORD.indexOf(_activeTab);
    if(i<0)return;
    if(dx<0&&i<ORD.length-1)switchTab(ORD[i+1]);
    else if(dx>0&&i>0)switchTab(ORD[i-1]);
  },{passive:true});
}

// ── INIT ──
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
// Инициализация: сначала показываем из localStorage, потом обновляем из IDB
db=loadDB();
// Применяем тему до рендера (по умолчанию — светлая)
(function(){const t=localStorage.getItem('isapp_theme')||'light';document.documentElement.setAttribute('data-theme',t);})();
renderDash();
setTimeout(initCarouselDots,150);
initTabSwipe();
checkPin();
// Асинхронно подгружаем из IndexedDB
initDB();
const urlParams=new URLSearchParams(window.location.search);
const action=urlParams.get('action');
if(action==='addStage')setTimeout(()=>showStageModal(null),400);
if(action==='addObject')setTimeout(()=>addObjectPrompt(),400);







