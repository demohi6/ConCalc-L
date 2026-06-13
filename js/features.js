// ── ЖУРНАЛ ──
function addJournalEntry(objId,type,text,meta){
  const o=db.objects.find(x=>x.id==objId);
  if(!o)return;
  if(!o.journal)o.journal=[];
  o.journal.unshift({id:newId(),ts:Date.now(),type,text,meta:meta||{}});
  if(o.journal.length>200)o.journal=o.journal.slice(0,200);
}
const JOURNAL_ICONS={note:'<i class="ph ph-note-pencil"></i>',payment:'<i class="ph ph-coins"></i>',payment_adjust:'<i class="ph ph-pencil"></i>',stage_done:'<i class="ph ph-check-circle"></i>',stage_active:'<i class="ph ph-hammer"></i>',stage_created:'<i class="ph ph-plus-circle"></i>',work_added:'<i class="ph ph-hard-hat"></i>',mat_added:'<i class="ph ph-package"></i>',reassign:'<i class="ph ph-arrows-left-right"></i>',delivery:'<i class="ph ph-package"></i>',worker:'<i class="ph ph-users"></i>',problem:'<i class="ph ph-warning"></i>',task:'<i class="ph ph-check-circle"></i>'};
const JOURNAL_COLORS={note:'var(--gold)',payment:'var(--green)',payment_adjust:'var(--text2)',stage_done:'var(--green)',stage_active:'var(--blue)',stage_created:'var(--gold)',work_added:'var(--blue)',mat_added:'var(--gold)',reassign:'var(--gold)',delivery:'var(--blue)',worker:'var(--gold)',problem:'var(--red)',task:'var(--green)'};
function goJournal(){
  // Скрываем текущую страницу (дашборд или аналитику)
  ['pageDash','pageMasters','pageMore'].forEach(pg=>{
    const el=document.getElementById(pg);
    if(el&&!el.classList.contains('page-hidden-right'))el.classList.add('page-hidden-left');
  });
  document.getElementById('pageJournal').classList.remove('page-hidden-right');
  renderJournal();
}
function renderJournal(){
  const o=curObj();if(!o)return;
  const entries=o.journal||[];
  const el=document.getElementById('journalContent');if(!el)return;
  const pg=document.getElementById('pageJournal');
  if(pg)pg.style.overflow='hidden';
  el.style.cssText='height:100%;display:flex;flex-direction:column;padding:0;';
  el.innerHTML=`<div style="display:flex;flex-direction:column;height:calc(100% - 72px)">
    <!-- Хедер -->
    <div style="padding:calc(var(--top,0px) + 12px) 16px 12px;background:var(--bg);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0;z-index:5">
      <button class="back-btn" onclick="goBackJournal()"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('backBtn')}</button>
      <div style="flex:1;font-family:'Unbounded',sans-serif;font-size:13px;font-weight:700">${lang==='ru'?'Журнал':'Journal'} · ${tName(o)||o.name}</div>
    </div>
    <!-- Лента событий (скролл) -->
    <div id="journalMessages" style="flex:1;overflow-y:auto;padding:16px 16px 8px;scrollbar-width:none;-webkit-overflow-scrolling:touch">
      ${entries.length?entries.map(function(e){
        const d=new Date(e.ts);
        const dateStr=d.toLocaleDateString('ru-RU',{day:'2-digit',month:'short'})+' '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
        const icon=JOURNAL_ICONS[e.type]||'<i class="ph ph-info"></i>';
        const color=JOURNAL_COLORS[e.type]||'var(--text3)';
        return`<div style="display:flex;gap:12px;margin-bottom:16px;animation:fadeUp .3s ease both">
          <div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:15px;color:${color};flex-shrink:0;margin-top:2px">${icon}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;line-height:1.5;margin-bottom:3px">${e.text}</div>
            ${(e.meta&&e.meta.photoId)?`<div id="jph_${e.id}" style="margin-top:6px"></div>`:''}
            <div style="font-size:11px;color:var(--text3);margin-top:3px">${dateStr}</div>
          </div>
          ${['note','delivery','worker','problem','task'].includes(e.type)?`<button onclick="deleteJournalEntry('${e.id}')" style="background:none;border:none;color:var(--text3);font-size:16px;cursor:pointer;padding:4px;align-self:flex-start"><i class="ph ph-x"></i></button>`:''}
        </div>`;
      }).join(''):`<div style="text-align:center;padding:48px 0;color:var(--text3)"><i class="ph ph-list" style="font-size:36px;display:block;margin-bottom:12px"></i>${lang==='ru'?'Журнал пока пуст':'Journal is empty'}</div>`}
      <div style="height:4px"></div>
    </div>
    <!-- Форма ввода (внизу) -->
    <div style="flex-shrink:0;background:var(--bg);border-top:1px solid var(--border);padding:8px 12px calc(var(--bottom,0px) + 4px)">
      <div id="journalHintBox" style="display:none;margin-bottom:6px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;overflow:hidden"></div>
      <div id="journalActionPreview" style="display:none;font-size:12px;color:var(--green);margin-bottom:6px;padding:6px 10px;background:rgba(128,200,154,.08);border-radius:8px;border:1px solid rgba(128,200,154,.2)"></div>
      <div id="journalPhotoPreview" style="display:none;margin-bottom:6px"></div>
      <div style="background:var(--bg3);border-radius:14px;display:flex;align-items:center;min-height:54px;overflow:hidden">
        <textarea id="journalNoteInput" placeholder="${lang==='ru'?'Что произошло?..':`What happened?`}" oninput="journalInputHint(this);this.style.height='auto';this.style.height=Math.min(this.scrollHeight,120)+'px'" style="flex:1;resize:none;height:20px;max-height:120px;background:none;border:none;color:var(--text);padding:0 14px;font-family:'Mulish',sans-serif;font-size:14px;outline:none;line-height:1.4;overflow-y:hidden;-webkit-user-select:text;user-select:text;align-self:center;box-sizing:content-box"></textarea>
        <button id="journalCamBtn" onclick="openJournalPhotoInput()" style="background:none;border:none;cursor:pointer;color:rgba(234,230,222,.35);padding:10px 6px;flex-shrink:0;display:flex;align-items:center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
        <button onclick="addJournalNote()" style="background:none;border:none;cursor:pointer;color:var(--gold);font-size:26px;padding:10px 14px 10px 4px;flex-shrink:0;display:flex;align-items:center"><i class="ph ph-paper-plane-right"></i></button>
      </div>
    </div>
  </div>`;
  if(entries.length)setTimeout(function(){initJournalPhotos(entries);},0);
}
function initJournalPhotos(entries){
  entries.forEach(function(e){
    if(!e.meta||!e.meta.photoId)return;
    var container=document.getElementById('jph_'+e.id);
    if(!container)return;
    loadPhoto(e.meta.photoId).then(function(dataUrl){
      if(!dataUrl)return;
      container.innerHTML='<img src="'+dataUrl+'" onclick="viewPhoto(\''+e.meta.photoId+'\',\'journal\',\''+e.id+'\')" style="width:100%;max-width:200px;border-radius:10px;cursor:pointer;display:block;margin-top:2px"/>';
    });
  });
}
let _journalPendingPhoto=null;
function clearJournalPhoto(){
  _journalPendingPhoto=null;
  var pr=document.getElementById('journalPhotoPreview');
  if(pr){pr.style.display='none';pr.innerHTML='';}
  ['journalCamBtn','homeNoteCamBtn','quickNoteCamBtn'].forEach(function(id){
    var btn=document.getElementById(id);
    if(btn)btn.style.color='rgba(234,230,222,.3)';
  });
}
function goBackJournal(){
  const pg=document.getElementById('pageJournal');
  pg.classList.add('page-hidden-right');
  pg.style.overflow='';
  // Возвращаемся на страницу которая была скрыта
  const prevPages=['pageDash','pageMasters','pageMore'];
  let returned=false;
  prevPages.forEach(pg=>{
    const el=document.getElementById(pg);
    if(el&&el.classList.contains('page-hidden-left')){
      el.classList.remove('page-hidden-left');
      if(pg==='pageDash'){renderDash();setTimeout(initCarouselDots,150);}
      returned=true;
    }
  });
  if(!returned){renderDash();}
}
function journalInputHint(inp){
  const val=inp.value;
  const hint=document.getElementById('journalHintBox');
  const preview=document.getElementById('journalActionPreview');
  if(!hint||!preview)return;
  // Парсим @Имя [сумма]
  const match=val.match(/^@(\S*)\s*(\d+)?/);
  if(match){
    const nameQ=match[1].toLowerCase();
    const amount=match[2]?parseInt(match[2]):null;
    // Автодополнение по подрядчикам
    if(!nameQ){
      const ctrs=loadContractors().slice(0,5);
      hint.style.display=ctrs.length?'block':'none';
      hint.innerHTML=ctrs.map(c=>`<div onclick="document.getElementById('journalNoteInput').value='@${c.name} ';journalInputHint(document.getElementById('journalNoteInput'))" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border)"><span style="color:var(--gold)">@</span>${c.name}<span style="font-size:11px;color:var(--text3);margin-left:8px">${c.specialization||''}</span></div>`).join('');
      preview.style.display='none';
    } else {
      // Нашли подрядчика
      const ctr=loadContractors().find(c=>c.name.toLowerCase().startsWith(nameQ));
      if(ctr&&amount){
        hint.style.display='none';
        const stats=getContractorStats(ctr.name);
        preview.style.display='block';
        preview.innerHTML=`<i class="ph ph-coins"></i> ${lang==='ru'?'Выплата':'Payment'} <b>${fmtShort(amount)}</b> → <b>${ctr.name}</b>${stats.debt>0?' · '+lang==='ru'?'долг':'debt'+' '+fmtShort(stats.debt):''}`;
      } else if(ctr){
        hint.style.display='none';
        preview.style.display='block';
        const stats=getContractorStats(ctr.name);
        preview.innerHTML=`<i class="ph ph-user"></i> ${ctr.name} · ${lang==='ru'?'долг':'debt'}: <b style="color:${stats.debt>0?'var(--red)':'var(--green)'}">${fmtShort(stats.debt)}</b> · ${lang==='ru'?'выплачено':'paid'}: ${fmtShort(stats.paid)} · ${lang==='ru'?'добавьте сумму для выплаты':'add amount to pay'}`;
      } else {
        hint.style.display='none';
        preview.style.display='none';
      }
    }
  } else {
    hint.style.display='none';
    preview.style.display='none';
  }
}
function homeAddNote(){
  const inp=document.getElementById('homeQuickNote');
  const text=inp?.value.trim();
  if(!text)return;
  const o=curObj();if(!o)return;
  const pending=_journalPendingPhoto;
  _journalPendingPhoto=null;
  const meta=pending?{photoId:pending.photoId}:{};
  const camBtn=document.getElementById('homeNoteCamBtn');
  if(camBtn)camBtn.style.color='rgba(234,230,222,.35)';
  function _finish(){
    addJournalEntry(o.id,'note',text,meta);
    saveDB();
    inp.value='';
    renderDashBottom();
    showToast(l3('Записано','Yadda saxlandı','Saved'));
  }
  if(pending){
    savePhoto(pending.photoId,pending.dataUrl).then(_finish).catch(_finish);
  } else {
    _finish();
  }
}
function addJournalNote(){
  const inp=document.getElementById('journalNoteInput');
  const text=inp?.value.trim();
  if(!text)return;
  const o=curObj();if(!o)return;
  // Парсим @Имя сумма
  const match=text.match(/^@(.+?)\s+(\d+)$/);
  if(match){
    const name=match[1].trim();
    const amount=parseInt(match[2]);
    const ctr=loadContractors().find(c=>c.name.toLowerCase()===name.toLowerCase()||c.name.toLowerCase().startsWith(name.toLowerCase()));
    if(ctr&&amount>0){
      // Найти работу с долгом у этого подрядчика
      let paid=false;
      const stages=o.stages||[];
      for(const s of stages){
        for(const p of s.positions||[]){
          for(const w of p.works||[]){
            if(w.contractor&&w.contractor.toLowerCase()===ctr.name.toLowerCase()){
              const unpaid=Math.max(0,(w.contractAmount||0)-(w.paid||0));
              if(unpaid>0){
                const newPaid=Math.min((w.paid||0)+amount,(w.contractAmount||0));
                const payTs=Date.now();
                // Обновляем выплату + добавляем в paymentHistory (для графиков)
                const stageId=s.id,posId=p.id,workId=w.id;
                updatePos(stageId,posId,pos=>({...pos,works:(pos.works||[]).map(wk=>wk.id!==workId?wk:{...wk,paid:newPaid,paymentHistory:[...(wk.paymentHistory||[]),{amount:amount,ts:payTs,contractor:ctr.name,name:wk.name}]})}));
                addJournalEntry(o.id,'payment',(lang==='ru'?'Выплата: ':'Payment: ')+fmtShort(amount)+' → '+ctr.name+' · '+w.name,{amount,contractor:ctr.name});
                upsertContractor(ctr.name,ctr.phone||'');
                saveDB();renderDashBottom();
                inp.value='';
                document.getElementById('journalHintBox').style.display='none';
                document.getElementById('journalActionPreview').style.display='none';
                renderJournal();
                showToast((lang==='ru'?'Выплачено: ':'Paid: ')+fmtShort(amount)+' → '+ctr.name);
                paid=true;break;
              }
            }
          }if(paid)break;
        }if(paid)break;
      }
      if(!paid){
        showToast(lang==='ru'?'Нет долга у '+ctr.name:'No debt for '+ctr.name,'err');
      }
      return;
    }
  }
  // Обычная заметка (с фото или без)
  const pending=_journalPendingPhoto;
  _journalPendingPhoto=null;
  const meta=pending?{photoId:pending.photoId}:{};
  var _notesDone=false;
  function _finishNote(){
    if(_notesDone)return;_notesDone=true;
    addJournalEntry(o.id,'note',text,meta);
    saveDB();
    inp.value='';
    clearJournalPhoto();
    var hb=document.getElementById('journalHintBox');if(hb)hb.style.display='none';
    var ap=document.getElementById('journalActionPreview');if(ap)ap.style.display='none';
    renderJournal();
    showToast(l3('Записано','Yadda saxlandı','Saved'));
  }
  if(pending){
    savePhoto(pending.photoId,pending.dataUrl).then(_finishNote).catch(function(e){console.warn('photo save err',e);_finishNote();});
  } else {
    _finishNote();
  }
}
function deleteJournalEntry(entryId){
  const o=curObj();if(!o)return;
  o.journal=(o.journal||[]).filter(e=>String(e.id)!==String(entryId));
  saveDB();renderJournal();
}

// ── АВТОДОПОЛНЕНИЕ ПОДРЯДЧИКОВ ──
function showContractorPicker(nameId, phoneId){
  const all=loadContractors().sort((a,b)=>a.name.localeCompare(b.name));
  if(!all.length){showToast(lang==='ru'?'Нет подрядчиков в базе':'No contractors yet');return;}
  window._ctPickData={list:all,nameId,phoneId};
  const rows=all.map((c,i)=>{
    const stats=getContractorStats(c.name);
    const isWorking=stats.works.some(w=>!w.done);
    return`<div data-cpi="${i}" style="display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--border);cursor:pointer">
      <div style="width:40px;height:40px;border-radius:50%;background:rgba(201,170,124,.12);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;color:var(--gold);flex-shrink:0">${c.name[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
          <span style="width:7px;height:7px;border-radius:50%;background:${isWorking?'var(--gold)':'var(--green)'};flex-shrink:0"></span>
          <span style="font-size:14px;font-weight:600">${c.name}</span>
          <span style="font-size:10px;color:${isWorking?'var(--gold)':'var(--green)'}">${isWorking?(lang==='ru'?'Занят':'Active'):(lang==='ru'?'Свободен':'Free')}</span>
        </div>
        ${c.specialization?`<div style="font-size:11px;color:var(--text3)">${c.specialization}</div>`:''}
        ${c.phone?`<div style="font-size:11px;color:var(--text3)">${c.phone}</div>`:''}
      </div>
      ${stats.debt>0?`<div style="font-size:11px;color:var(--red);font-weight:700;flex-shrink:0">${fmtShort(stats.debt)}</div>`:''}
    </div>`;
  }).join('');
  // Используем drumOverlay чтобы не закрывать родительскую модалку
  showDrumOverlay(`<div class="modal-handle"></div>
    <div style="font-size:15px;font-weight:700;padding:4px 0 12px">${lang==='ru'?'Выбрать подрядчика':'Select contractor'}</div>
    <div id="ctPickList" style="margin:0 -16px;max-height:60vh;overflow-y:auto">${rows}</div>`);
  setTimeout(()=>{
    document.querySelectorAll('#ctPickList [data-cpi]').forEach(el=>{
      el.addEventListener('click',()=>{
        const idx=parseInt(el.dataset.cpi);
        const {list,nameId:nId,phoneId:pId}=window._ctPickData;
        const c=list[idx];if(!c)return;
        closeDrumOverlay();
        assignContractorWithCheck(c,nId,pId);
      });
    });
  },50);
}

function assignContractorWithCheck(c,nId,pId){
  const doAssign=()=>{
    const nEl=document.getElementById(nId);
    const pEl=document.getElementById(pId);
    if(nEl)nEl.value=c.name;
    if(pEl&&c.phone)pEl.value=c.phone;
  };
  const stats=getContractorStats(c.name);
  const activeWorks=stats.works.filter(w=>!w.done);
  if(!activeWorks.length){doAssign();return;}
  const activeWork=activeWorks[0];
  // Мастер занят — показываем подтверждение с объяснением что произойдёт
  window._pendingAssign=()=>{
    // Снимаем мастера со всех активных работ и пишем в журнал
    db.objects.forEach(o=>{
      let changed=false;
      (o.stages||[]).forEach(s=>{
        (s.positions||[]).forEach(p=>{
          (p.works||[]).forEach(w=>{
            if(w.contractor&&w.contractor.toLowerCase()===c.name.toLowerCase()&&!w.done){
              const fromStage=tName(s)||s.name;
              const fromWork=w.name;
              w.contractor='';
              w.phone='';
              changed=true;
              addJournalEntry(o.id,'reassign',
                lang==='ru'
                  ?`${c.name} переопределён: снят с «${fromWork}» (${fromStage})`
                  :`${c.name} reassigned: removed from "${fromWork}" (${fromStage})`,
                {contractor:c.name,fromWork,fromStage}
              );
            }
          });
        });
      });
      if(changed)saveDB();
    });
    doAssign();
    showToast(lang==='ru'?`${c.name} переопределён`:`${c.name} reassigned`);
  };
  showModal(`<div class="modal-handle"></div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(201,170,124,.15);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--gold);flex-shrink:0;border:2px solid rgba(201,170,124,.25)">${c.name[0].toUpperCase()}</div>
      <div>
        <div style="font-size:16px;font-weight:700">${c.name}</div>
        <div style="font-size:12px;color:var(--gold);margin-top:2px">● ${lang==='ru'?'Занят':'Busy'}</div>
      </div>
    </div>
    <div style="background:rgba(201,170,124,.06);border:1px solid rgba(201,170,124,.2);border-radius:12px;padding:12px;margin-bottom:12px">
      <div style="font-size:11px;color:var(--text3);margin-bottom:4px">${lang==='ru'?'Сейчас работает на:':'Currently working on:'}</div>
      <div style="font-size:13px;font-weight:600"><i class="ph ph-map-pin" style="font-size:12px;color:var(--gold)"></i> ${activeWork.stageName}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:2px">${activeWork.workName}</div>
    </div>
    <div style="background:rgba(204,123,123,.06);border:1px solid rgba(204,123,123,.2);border-radius:12px;padding:10px 12px;margin-bottom:16px;font-size:12px;color:var(--text2)">
      <i class="ph ph-warning" style="color:var(--red);margin-right:4px"></i>
      ${lang==='ru'?'Мастер будет снят с текущей работы и переопределён на новую. Запись добавится в журнал.':'Contractor will be removed from current work and reassigned. A log entry will be added.'}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="closeModal();window._pendingAssign&&window._pendingAssign()">${lang==='ru'?'Переопределить':'Reassign'}</button>
    </div>`);
}
function showContractorSuggest(input, nameId, phoneId, listId){
  const lid=listId||'contractorSuggest';
  const query=input.value.trim();
  const list=document.getElementById(lid);
  if(!list)return;
  if(!query){list.style.display='none';return;}
  const results=searchContractors(query);
  if(!results.length){list.style.display='none';return;}
  window._cSuggests=results;
  list.innerHTML=results.map(function(c,i){
    const avatar='<div style="width:32px;height:32px;border-radius:50%;background:rgba(201,170,124,.15);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--gold);flex-shrink:0">'+c.name[0].toUpperCase()+'</div>';
    const info='<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600">'+c.name+'</div>'+(c.phone?'<div style="font-size:11px;color:var(--text3)">'+c.phone+'</div>':'')+(c.specialization?'<div style="font-size:10px;color:var(--gold)">'+c.specialization+'</div>':'')+'</div>';
    return '<div class="autocomplete-item" data-idx="'+i+'">'+avatar+info+'</div>';
  }).join('');
  list.querySelectorAll('.autocomplete-item').forEach(function(el){
    el.addEventListener('click',function(){
      selectContractorByIdx(parseInt(el.dataset.idx),nameId,phoneId,lid);
    });
  });
  list.style.display='block';
}

function selectContractorByIdx(idx, nameId, phoneId, listId){
  const c=window._cSuggests&&window._cSuggests[idx];
  if(!c)return;
  // Просто заполняем имя+телефон. Переназначение занятого мастера — отдельно, через «Выбрать из списка»
  const nEl=document.getElementById(nameId);if(nEl)nEl.value=c.name;
  const pEl=phoneId&&document.getElementById(phoneId);if(pEl&&c.phone)pEl.value=c.phone;
  const list=document.getElementById(listId||'contractorSuggest');
  if(list)list.style.display='none';
}
function selectContractor(name, phone, nameId, phoneId){
  const nameEl=document.getElementById(nameId);
  const phoneEl=document.getElementById(phoneId);
  if(nameEl)nameEl.value=name;
  if(phoneEl&&phone)phoneEl.value=phone;
  const list=document.getElementById('contractorSuggest');
  if(list)list.style.display='none';
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.autocomplete-wrap')){
    document.querySelectorAll('.autocomplete-list').forEach(l=>l.style.display='none');
  }
});

// ── СТРАНИЦА ПОДРЯДЧИКОВ ──
function showContractorsPage(){
  syncContractorsFromData();
  const list=loadContractors().sort((a,b)=>(b.lastUsed||0)-(a.lastUsed||0));
  const title=lang==='ru'?'Подрядчики':lang==='az'?'Podratçılar':'Contractors';
  const addLabel=lang==='ru'?'Добавить':lang==='az'?'Əlavə et':'Add';
  const noLabel=lang==='ru'?'Нет подрядчиков':lang==='az'?'Podratçı yoxdur':'No contractors';
  showModal('<div class="modal-handle"></div>'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'+
      '<div class="modal-title" style="margin-bottom:0"><i class="ph ph-hard-hat"></i> '+title+'</div>'+
      '<button onclick="addContractorManual()" style="background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.2);color:var(--gold);border-radius:10px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:Mulish,sans-serif">＋ '+addLabel+'</button>'+
    '</div>'+
    (list.length?list.map(c=>{
      const stats=getContractorStats(c.name);
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick=showContractorDetail('+c.id+')>'+
        '<div style="width:40px;height:40px;border-radius:50%;background:rgba(201,170,124,.12);border:1px solid rgba(201,170,124,.2);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--gold);flex-shrink:0">'+c.name[0].toUpperCase()+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:14px;font-weight:600;margin-bottom:2px">'+c.name+'</div>'+
          '<div style="font-size:11px;color:var(--text3)">'+
            (c.phone?'<i class="ph ph-phone"></i> '+c.phone+' · ':'')+
            (c.specialization?c.specialization+' · ':'')+
            stats.works.length+' '+(lang==='ru'?'работ':lang==='az'?'iş':'works')+
          '</div>'+
        '</div>'+
        '<div style="text-align:right;flex-shrink:0">'+
          (stats.debt>0?'<div style="font-size:11px;color:var(--red);font-weight:700"><i class="ph ph-warning"></i> '+fmtShort(stats.debt)+'</div>':'')+
          '<div style="font-size:11px;color:var(--text3);color:var(--green)"><i class="ph ph-check"></i> '+fmtShort(stats.paid)+'</div>'+
        '</div>'+
      '</div>';
    }).join(''):'<div style="text-align:center;padding:32px 0;color:var(--text3)">'+noLabel+'</div>')+
  '</div>');
}

function showContractorDetail(id){
  const c=loadContractors().find(function(x){return x.id==id;});
  if(!c)return;
  const stats=getContractorStats(c.name);
  const specs=getSpecializations();
  const specHTML=specs.map(function(s){
    const active=c.specialization===s;
    return '<div data-spec="'+s+'" style="padding:5px 10px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid '+(active?'var(--gold)':'var(--border)')+';background:'+(active?'rgba(201,170,124,.15)':'none')+';color:'+(active?'var(--gold)':'var(--text2)')+'">'+s+'</div>';
  }).join('');

  const worksHTML=stats.works.map(function(w){
    return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">'+
      '<div style="flex:1;min-width:0">'+
        '<div style="font-size:13px;font-weight:500">'+w.workName+'</div>'+
        '<div style="font-size:11px;color:var(--text3)">'+w.stageName+' → '+w.posName+'</div>'+
      '</div>'+
      '<div style="text-align:right;flex-shrink:0">'+
        '<div style="font-size:12px">'+fmtShort(w.contract)+'</div>'+
        (w.paid>0?'<div style="font-size:10px;color:var(--green)"><i class="ph ph-check"></i> '+fmtShort(w.paid)+'</div>':'')+
      '</div>'+
    '</div>';
  }).join('');

  const cSpecs=c.specs||(c.specialization?[c.specialization]:[]);
  const isWorking=stats.works.some(w=>!w.done);
  const statusCol=isWorking?'var(--gold)':'var(--green)';
  const statusLabel=isWorking?(lang==='ru'?'Занят':'Busy'):(lang==='ru'?'Свободен':'Free');
  const stars=[1,2,3,4,5].map(n=>`<i class="ph ph-star" style="color:${(c.rating||0)>=n?'var(--gold)':'var(--text3)'}"></i>`).join('');
  // История выплат из работ
  const payHistory=stats.works.filter(w=>w.paid>0).map(w=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)"><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500">${w.workName}</div><div style="font-size:11px;color:var(--text3)">${w.stageName}</div></div><div style="font-size:13px;font-weight:700;color:var(--green)">+ ${fmtShort(w.paid)}</div></div>`).join('');
  const html='<div class="modal-handle"></div>'+
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'+
      '<div style="width:52px;height:52px;border-radius:50%;background:rgba(201,170,124,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:var(--gold)">'+c.name[0].toUpperCase()+'</div>'+
      '<div style="flex:1">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">'+
          '<div style="font-size:16px;font-weight:700">'+c.name+'</div>'+
          '<span style="font-size:10px;padding:2px 8px;border-radius:20px;border:1px solid '+statusCol+';color:'+statusCol+';background:'+statusCol.replace(')',',0.1)').replace('var(','rgba(')+'">'+'● '+statusLabel+'</span>'+
        '</div>'+
        (c.phone?'<div style="margin-bottom:2px"><a href="tel:'+c.phone+'" style="color:var(--blue);font-size:12px;text-decoration:none"><i class="ph ph-phone"></i> '+c.phone+'</a></div>':'')+
        (cSpecs.length?'<div style="font-size:11px;color:var(--text2)">'+cSpecs.join(' · ')+'</div>':'')+
      '</div>'+
    '</div>'+
    (c.rating?'<div style="display:flex;gap:2px;margin-bottom:10px">'+stars+'</div>':'')+
    (c.note?'<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:10px 12px;font-size:13px;color:var(--text2);margin-bottom:12px;font-style:italic">"'+c.note+'"</div>':'')+
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">'+
      '<div style="background:var(--bg3);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:4px">'+(lang==='ru'?'Договор':'Contract')+'</div><div style="font-size:13px;font-weight:700">'+fmtShort(stats.total)+'</div></div>'+
      '<div style="background:var(--bg3);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:4px">'+(lang==='ru'?'Выплачено':'Paid')+'</div><div style="font-size:13px;font-weight:700;color:var(--green)">'+fmtShort(stats.paid)+'</div></div>'+
      '<div style="background:var(--bg3);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:'+(stats.debt>0?'var(--red)':'var(--text3)')+';text-transform:uppercase;margin-bottom:4px">'+(lang==='ru'?'Долг':'Debt')+'</div><div style="font-size:13px;font-weight:700;color:'+(stats.debt>0?'var(--red)':'var(--text3)')+'">'+( stats.debt>0?fmtShort(stats.debt):'—')+'</div></div>'+
    '</div>'+
    (stats.works.length&&!payHistory?'<div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">'+(lang==='ru'?'Работы':'Works')+'</div>'+worksHTML:'') +
    '<button onclick="showAssignMasterToWork('+id+')" class="btn btn-secondary" style="width:100%;margin-top:14px;justify-content:center"><i class="ph ph-hammer"></i> '+(lang==='ru'?'Назначить на работу':'Assign to work')+'</button>'+
    '<div style="margin-top:8px;display:flex;gap:8px">'+
      '<button onclick="editContractorPrompt('+id+')" class="btn btn-secondary" style="flex:1"><i class="ph ph-pencil"></i> '+(lang==='ru'?'Изменить':'Edit')+'</button>'+
      '<button class="btn btn-danger" style="flex:1" onclick="deleteContractor('+id+')">'+(lang==='ru'?'Удалить':'Delete')+'</button>'+
    '</div>';
  showModal(html);
  setTimeout(function(){
    const specWrap=document.querySelector('[data-spec]')?.parentElement;
    if(specWrap){
      specWrap.addEventListener('click',function(e){
        const el=e.target.closest('[data-spec]');
        if(el)setContractorSpec(id,el.dataset.spec);
      });
    }
  },0);
}

function showAssignMasterToWork(contractorId){
  const c=loadContractors().find(x=>x.id==contractorId);
  if(!c)return;
  const freeWorks=[];
  db.objects.forEach(o=>(o.stages||[]).forEach(s=>{
    if(s.status==='done')return;
    (s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
      if(!w.done)
        freeWorks.push({objId:o.id,objName:tName(o)||o.name,stageId:s.id,stageName:tName(s)||s.name,posId:p.id,posName:p.name,workId:w.id,workName:w.name,contractor:w.contractor||''});
    }));
  }));
  if(!freeWorks.length){showToast(lang==='ru'?'Нет свободных работ':'No free works');return;}
  const worksHTML=freeWorks.map(w=>`
    <div onclick="confirmAssignMaster(${contractorId},'${w.objId}','${w.stageId}','${w.posId}','${w.workId}')"
      style="padding:12px;border-radius:12px;background:var(--bg3);margin-bottom:8px;cursor:pointer;border:1px solid var(--border)">
      <div style="font-size:13px;font-weight:600;margin-bottom:2px">${w.workName}</div>
      <div style="font-size:11px;color:var(--text3)">${w.stageName} · ${w.posName}${w.contractor?` · <span style="color:var(--text2)">${w.contractor}</span>`:''}  </div>
    </div>`).join('');
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title"><i class="ph ph-hammer"></i> ${lang==='ru'?'Назначить':'Assign'} ${c.name}</div>
    <div style="max-height:55vh;overflow-y:auto;margin-bottom:10px">${worksHTML}</div>
    <button class="btn btn-secondary" style="width:100%" onclick="showContractorDetail(${contractorId})">← ${lang==='ru'?'Назад':'Back'}</button>`);
}
function confirmAssignMaster(contractorId,objId,stageId,posId,workId){
  const c=loadContractors().find(x=>x.id==contractorId);
  if(!c)return;
  db.objects.forEach(o=>{
    if(o.id!==objId)return;
    (o.stages||[]).forEach(s=>{
      if(s.id!==stageId)return;
      (s.positions||[]).forEach(p=>{
        if(p.id!==posId)return;
        p.works=(p.works||[]).map(w=>w.id!==workId?w:{...w,contractor:c.name,phone:c.phone||''});
      });
    });
  });
  upsertContractor(c.name,c.phone||'');
  saveDB();closeModal();renderMasters();
  showToast((lang==='ru'?'Назначен: ':'Assigned: ')+c.name);
}
function setContractorSpec(id,spec){
  const list=loadContractors();
  const c=list.find(x=>String(x.id)===String(id));
  if(c){c.specialization=c.specialization===spec?'':spec;saveContractors(list);}
  closeModal();
  setTimeout(function(){showContractorDetail(id);},50);
}

function showMasterMenu(e,id){
  if(document.getElementById('ctxMenu'))return; // уже открыто
  const c=loadContractors().find(x=>x.id==id);if(!c)return;
  const x=Math.min((e.clientX||150),window.innerWidth-220);
  const y=Math.min((e.clientY||150),window.innerHeight-220);
  const menu=document.createElement('div');menu.className='ctx-menu';menu.id='ctxMenu';
  menu.style.left=x+'px';menu.style.top=y+'px';
  menu.innerHTML=
    `<div style="padding:10px 14px 6px;font-size:13px;font-weight:700;color:var(--text2)">${c.name}</div>`+
    `<div style="height:1px;background:var(--border);margin:0 0 4px"></div>`+
    (c.phone?
      `<div class="ctx-item" onclick="closeCtxMenu();location.href='tel:${c.phone}'"><i class="ph ph-phone"></i> ${lang==='ru'?'Позвонить':'Call'}</div>`+
      `<div class="ctx-item" style="color:#25D366" onclick="closeCtxMenu();window.open('https://wa.me/${c.phone.replace(/\D/g,'')}')"><i class="ph ph-chat-circle"></i> WhatsApp</div>`+
      `<div style="height:1px;background:var(--border);margin:4px 0"></div>`
    :'')+
    `<div class="ctx-item" onclick="closeCtxMenu();editContractorPrompt('${id}')"><i class="ph ph-pencil"></i> ${lang==='ru'?'Редактировать':'Edit'}</div>`+
    `<div class="ctx-item ctx-item-danger" onclick="closeCtxMenu();deleteContractor('${id}')"><i class="ph ph-trash"></i> ${lang==='ru'?'Удалить':'Delete'}</div>`;
  document.body.appendChild(menu);
  setTimeout(()=>document.addEventListener('click',closeCtxMenuOnOut,true),0);
}
const ALL_SPECS_RU=['Каменщик','Плотник','Кровельщик','Печник','Сантехник','Электрик','Штукатур','Маляр','Сварщик','Разнорабочий'];
function editContractorPrompt(id){
  const c=loadContractors().find(x=>x.id==id);
  if(!c)return;
  const cSpecs=c.specs||(c.specialization?[c.specialization]:[]);
  window._editCSpecs=[...cSpecs];
  window._editCRating=c.rating||0;
  const specsHTML=ALL_SPECS_RU.map(s=>{
    const active=cSpecs.includes(s);
    return`<div data-s="${s}" onclick="toggleSpecChip(this,'${s}')" style="padding:5px 10px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid ${active?'var(--gold)':'var(--border)'};background:${active?'rgba(201,170,124,.12)':'none'};color:${active?'var(--gold)':'var(--text2)'}">${s}</div>`;
  }).join('');
  const stars=[1,2,3,4,5].map(n=>`<i class="ph ph-star" data-star="${n}" onclick="setEditStar(${n})" style="font-size:26px;cursor:pointer;color:${(c.rating||0)>=n?'var(--gold)':'var(--text3)'}"></i>`).join('');
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title" style="margin-bottom:14px">${lang==='ru'?'Редактировать':'Edit'}</div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Имя':'Name'}</label>
      <input type="text" id="editCName" value="${c.name.replace(/"/g,'&quot;')}"/></div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Телефон':'Phone'}</label>
      <input type="text" id="editCPhone" value="${(c.phone||'').replace(/"/g,'&quot;')}" placeholder="+994 50 000 00 00"/></div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Специализации':'Skills'}</label>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${specsHTML}</div></div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Оценка':'Rating'}</label>
      <div id="starsRow" style="display:flex;gap:4px">${stars}</div></div>
    <div class="form-group"><label class="form-label">${lang==='ru'?'Заметка':'Note'}</label>
      <textarea id="editCNote" placeholder="${lang==='ru'?'Надёжный, опаздывает, рекомендую...':'Notes...'}" style="height:60px">${(c.note||'')}</textarea></div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-secondary" onclick="closeModal();showContractorDetail('${id}')">${t('cancel')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="saveContractorEdit('${id}')">${t('save')}</button>
    </div>`);
}
function toggleSpecChip(el,spec){
  const idx=window._editCSpecs.indexOf(spec);
  if(idx>=0)window._editCSpecs.splice(idx,1);
  else window._editCSpecs.push(spec);
  const active=window._editCSpecs.includes(spec);
  el.style.borderColor=active?'var(--gold)':'var(--border)';
  el.style.background=active?'rgba(201,170,124,.12)':'none';
  el.style.color=active?'var(--gold)':'var(--text2)';
}
function setEditStar(n){
  window._editCRating=n;
  document.querySelectorAll('[data-star]').forEach(el=>{el.style.color=+el.dataset.star<=n?'var(--gold)':'var(--text3)';});
}
function setEditStatus(s){
  const cfg={free:{col:'var(--green)',bg:'rgba(128,200,154,.1)'},working:{col:'var(--gold)',bg:'rgba(201,170,124,.1)'}};
  ['free','working'].forEach(st=>{
    const btn=document.getElementById('status'+st.charAt(0).toUpperCase()+st.slice(1));
    if(!btn)return;
    const on=st===s;
    btn.style.borderColor=on?cfg[st].col:'var(--border)';
    btn.style.background=on?cfg[st].bg:'none';
    btn.style.color=on?cfg[st].col:'var(--text3)';
  });
}
function saveContractorEdit(id){
  const name=document.getElementById('editCName')?.value.trim();
  const phone=document.getElementById('editCPhone')?.value.trim();
  const note=document.getElementById('editCNote')?.value.trim();
  if(!name){showToast(t('enterName'),'err');return;}
  const list=loadContractors().map(c=>c.id==id?{...c,name,phone:phone||c.phone||'',specs:window._editCSpecs||[],specialization:(window._editCSpecs||[])[0]||c.specialization||'',rating:window._editCRating||0,note:note||''}:c);
  saveContractors(list);
  closeModal();
  renderMasters();
  showToast(t('objUpdated'));
}
function deleteContractor(id){
  const list=loadContractors().filter(c=>c.id!=id);
  saveContractors(list);
  closeModal();
  showContractorsPage();
  showToast(lang==='ru'?'Подрядчик удалён':'Contractor deleted');
}

function addContractorManual(){
  showModal('<div class="modal-handle"></div>'+
    '<div class="modal-title"><i class="ph ph-hard-hat"></i> '+(lang==='ru'?'Новый подрядчик':'New contractor')+'</div>'+
    '<div class="form-group"><label class="form-label">'+(lang==='ru'?'Имя':'Name')+'</label><input type="text" id="cnName" placeholder="'+(lang==='ru'?'Иван Петров':'John Smith')+'"/></div>'+
    '<div class="form-group"><label class="form-label">'+(lang==='ru'?'Телефон':'Phone')+'</label><input type="text" id="cnPhone" placeholder="+7 000 000-00-00"/></div>'+
    '<div style="display:flex;gap:10px">'+
      '<button class="btn btn-secondary" onclick="closeModal()">'+(lang==='ru'?'Отмена':'Cancel')+'</button>'+
      '<button class="btn btn-primary" onclick="saveNewContractor()">'+(lang==='ru'?'Добавить':'Add')+'</button>'+
    '</div>');
}

function saveNewContractor(){
  const name=document.getElementById('cnName')?.value.trim();
  const phone=document.getElementById('cnPhone')?.value.trim()||'';
  if(!name){showToast(t('enterName'),'err');return;}
  upsertContractor(name,phone);
  closeModal();
  showContractorsPage();
  showToast(lang==='ru'?'Добавлен':'Added');
}

// Скроллим форму в видимую область когда появляется клавиатура
// ── TAB BAR ──
let _activeTab='home';
let _tabAnimTimer=null;

const TAB_PAGES={home:'pageDash',masters:'pageMasters',finance:'pageFinance',more:'pageMore'};
function switchTab(tab){
  if(_activeTab===tab)return;
  clearTimeout(_tabAnimTimer);
  const prev=_activeTab;
  _activeTab=tab;
  const tabOrd={home:0,masters:1,finance:2,more:3};
  const goRight=(tabOrd[tab]??0)>(tabOrd[prev]??0);
  ['home','masters','finance','more'].forEach(t=>{
    document.getElementById('tab-'+t)?.classList.toggle('active',t===tab);
  });
  // Мгновенно скрываем все drill-down страницы (без анимации, чтобы не мешали табу)
  ['pageDetail','pagePos','pageObjFinance','pageJournal'].forEach(function(id){
    var el=document.getElementById(id);
    if(!el)return;
    el.style.transition='none';
    el.style.transform='translateX(100%)';
    el.style.opacity='0';
    el.style.pointerEvents='none';
    el.classList.remove('page-hidden-left');
    el.classList.add('page-hidden-right');
    requestAnimationFrame(function(){el.style.cssText='';});
  });
  // Контент рендерим до анимации
  if(tab==='home'){renderDash();setTimeout(initCarouselDots,150);}
  else if(tab==='masters'){renderMasters();}
  else if(tab==='finance'){renderFinance();}
  else if(tab==='more'){renderMore();}
  const prevEl=prev?document.getElementById(TAB_PAGES[prev]):null;
  const newEl=document.getElementById(TAB_PAGES[tab]);
  const dur='.26s cubic-bezier(.25,.46,.45,.94)';
  // Скрыть несвязанные табы мгновенно
  Object.entries(TAB_PAGES).forEach(([t,pg])=>{
    if(t!==tab&&t!==prev){const el=document.getElementById(pg);if(el)el.classList.add('page-hidden-right');}
  });
  // Новая страница: стартовая позиция → анимация в центр
  if(newEl){
    newEl.classList.remove('page-hidden-right','page-hidden-left');
    newEl.style.cssText=`transition:none;transform:translateX(${goRight?'100%':'-100%'});opacity:0;`;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      newEl.style.cssText=`transition:transform ${dur},opacity .2s ease;transform:translateX(0);opacity:1;`;
      setTimeout(()=>{newEl.style.cssText='';},280);
    }));
  }
  // Предыдущая страница: анимация выхода (симметрично)
  if(prevEl){
    prevEl.classList.remove('page-hidden-right','page-hidden-left');
    prevEl.style.cssText=`transition:transform ${dur},opacity .2s ease;transform:translateX(${goRight?'-100%':'100%'});opacity:0;pointer-events:none;`;
    _tabAnimTimer=setTimeout(()=>{prevEl.classList.add('page-hidden-right');prevEl.style.cssText='';},270);
  }
}
let _mastersSearch='';

function renderMastersList(){
  const allList=loadContractors().sort((a,b)=>{
    const da=getContractorStats(a.name).debt>0?1:0;
    const db2=getContractorStats(b.name).debt>0?1:0;
    return db2-da||(b.lastUsed||0)-(a.lastUsed||0);
  });
  let list=_mastersSearch?allList.filter(c=>c.name.toLowerCase().includes(_mastersSearch.toLowerCase())):allList;
  const el=document.getElementById('mastersListContainer');
  if(!el)return;
  let _mlpT=null,_mlpId=null;
  setTimeout(()=>{
    if(!el)return;
    el.addEventListener('pointerdown',e=>{const card=e.target.closest('[data-cid]');if(!card)return;_mlpId=+card.dataset.cid;_mlpT=setTimeout(()=>{_mlpT=null;if(navigator.vibrate)navigator.vibrate(40);showMasterMenu(e,_mlpId);},600);},{passive:true});
    el.addEventListener('pointerup',()=>{clearTimeout(_mlpT);_mlpT=null;},{passive:true});
    el.addEventListener('pointermove',()=>{clearTimeout(_mlpT);_mlpT=null;},{passive:true});
    el.addEventListener('pointercancel',()=>{clearTimeout(_mlpT);_mlpT=null;},{passive:true});
    el.addEventListener('contextmenu',e=>{e.preventDefault();const card=e.target.closest('[data-cid]');if(card)showMasterMenu(e,+card.dataset.cid);});
  },0);
  const noLabel=_mastersSearch?(lang==='ru'?'Никого не нашлось':'No results'):(lang==='ru'?'Нет мастеров — добавьте первого':'No contractors yet');
  el.innerHTML=list.length?list.map(c=>{
    const stats=getContractorStats(c.name);
    const hasDebt=stats.debt>0;
    const activeWork=stats.works.find(w=>!w.done);
    const isWorking=!!activeWork;
    const specs=(c.specs&&c.specs.length)?c.specs.join(' · '):(c.specialization||'');
    return`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;margin-bottom:10px;overflow:hidden" data-cid="${c.id}">
      <div style="display:flex;align-items:center;gap:12px;padding:14px;cursor:pointer" onclick="showContractorDetail(${c.id})">
        <div style="position:relative;flex-shrink:0">
          <div style="width:50px;height:50px;border-radius:50%;background:rgba(201,170,124,.15);display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:700;color:var(--gold);border:2px solid rgba(201,170,124,.25)">${c.name[0].toUpperCase()}</div>
          ${hasDebt?`<div style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:var(--red);border:2px solid var(--bg2)"></div>`:''}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-wrap:wrap">
            <span style="font-size:16px;font-weight:700">${c.name}</span>
            <span style="font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600;background:${isWorking?'rgba(201,170,124,.12)':'rgba(128,200,154,.12)'};color:${isWorking?'var(--gold)':'var(--green)'};border:1px solid ${isWorking?'rgba(201,170,124,.3)':'rgba(128,200,154,.3)'}">${isWorking?(lang==='ru'?'Занят':'Busy'):(lang==='ru'?'Свободен':'Free')}</span>
          </div>
          ${specs?`<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px">${specs.split(' · ').map(s=>`<span style="font-size:10px;padding:2px 7px;border-radius:10px;background:rgba(123,184,204,.1);color:var(--blue);border:1px solid rgba(123,184,204,.2)">${s}</span>`).join('')}</div>`:''}
          ${activeWork?`<div style="font-size:11px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><i class="ph ph-map-pin" style="font-size:10px"></i> ${activeWork.stageName}</div>`:''}
        </div>
        ${c.phone?`<div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          <a href="tel:${c.phone}" onclick="event.stopPropagation()" style="width:36px;height:36px;border-radius:50%;background:rgba(123,184,204,.12);display:flex;align-items:center;justify-content:center;color:var(--blue);text-decoration:none">
            <i class="ph ph-phone" style="font-size:17px"></i>
          </a>
          <a href="https://wa.me/${c.phone.replace(/\D/g,'')}" target="_blank" onclick="event.stopPropagation()" style="width:36px;height:36px;border-radius:50%;background:rgba(37,211,102,.10);display:flex;align-items:center;justify-content:center;color:#25D366;text-decoration:none">
            <i class="ph ph-chat-circle" style="font-size:17px"></i>
          </a>
        </div>`:''}
      </div>
    </div>`;
  }).join(''):`<div style="text-align:center;padding:48px 0;color:var(--text3);font-size:14px">${noLabel}</div>`;
}

function renderMasters(){
  _mastersSearch='';
  syncContractorsFromData();
  const title=lang==='ru'?'Мастера':lang==='az'?'Ustalar':'Masters';
  document.getElementById('mastersContent').innerHTML=`
    <div style="padding:calc(var(--top) + 28px) 16px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700;flex:1">${title}</span>
      <button onclick="addContractorManual()" style="display:flex;align-items:center;gap:6px;background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.2);color:var(--gold);border-radius:10px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:Mulish,sans-serif"><i class="ph ph-plus" style="font-size:14px"></i>${lang==='ru'?'Добавить':'Add'}</button>
    </div>
    <div style="padding:0 16px;margin-bottom:12px;position:relative">
      <i class="ph ph-magnifying-glass" style="position:absolute;left:28px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:15px;pointer-events:none"></i>
      <input type="text" placeholder="${lang==='ru'?'Поиск...':'Search...'}" id="mastersSearchInput" oninput="_mastersSearch=this.value;renderMastersList()" style="width:100%;padding:10px 12px 10px 36px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-family:'Mulish',sans-serif;font-size:14px;outline:none"/>
    </div>
    <div style="padding:0 16px;padding-bottom:calc(80px + env(safe-area-inset-bottom,0px))" id="mastersListContainer"></div>`;
  renderMastersList();
}

