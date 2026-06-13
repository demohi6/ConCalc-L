// ── I18N ──
const LANGS={
az:{appName:'Construct',myObjects:'Mənim obyektlərim',objects:'OBYEKTLƏRİM',newObject:'＋ Yeni obyekt',pdfExport:'📄 PDF export',dataStored:'💾 Məlumatlar bu cihazda saxlanılır',totalBudget:'Ümumi büdcə',budgetNotSet:'Büdcə təyin edilməyib',budgetOver:'⚠️ Xərclər büdcəni keçir',budgetLeft:'Qalıq',setBudget:'Büdcəni ••• bölməsindən təyin edin',smeta:'Smeta (plan)',fact:'Xərcləndi',stages:'TİKİNTİ MƏRHƏLƏLƏRİ',factLabel:'xərcləndi',smetaLabel:'Smeta',factShort:'Xərcləndi',remainder:'Qalıq',debt:'Ödəniləcək',budget:'Büdcə',addStage:'Yeni mərhələ',editStage:'Mərhələni redaktə et',stageName:'Ad',stageNamePh:'Məs: Fasad',stageIcon:'İkon',stageColor:'Rəng',stageHint:'💡 Mərhələ büdcəsi mövqelərin cəmindən avtomatik hesablanır.',save:'Saxla',cancel:'Ləğv et',create:'Yarat',delete:'Sil',deleteStage:'Mərhələni sil',deleteStageConfirm:'Mərhələ və bütün mövqelər silinəcək.',addPos:'Mövqe əlavə et',posName:'Mövqenin adı',posNamePh:'Məs: Qəlib',statusIdle:'Başlamadı',statusActive:'Davam edir',statusDone:'Tamamlandı',positions:'Mövqelər',posAdded:'Əlavə edildi',posDeleted:'Silindi',editPos:'Mövqeni redaktə et',deletePos:'Mövqeni sil',deletePosConfirm:'Bütün işlər və materiallar silinəcək.',addWork:'👷 İş əlavə et',addMat:'🧱 Material əlavə et',contractAmount:'Müqavilə məbləği',paid:'Ödənildi',unpaid:'Qalıq',contractor:'Podratçı',contractorPh:'Məs: İvan',phone:'Telefon',phonePh:'+994 50 000 00 00',startDate:'Başlama tarixi',endDate:'Bitmə tarixi',note:'Qeyd',notePh:'Əlavə məlumat...',qty:'Miqdar',price:'Qiymət',unit:'Ölçü',unitPcs:'əd',unitM2:'m²',unitM3:'m³',unitLm:'x.m.',unitKg:'kq',unitBag:'kisə',unitL:'l',typeWork:'İş',typeMat:'Material',stageAdded:'Mərhələ əlavə edildi',stageUpdated:'Mərhələ yeniləndi',stageDeleted:'Mərhələ silindi',objCreated:'Obyekt yaradıldı',objUpdated:'Yadda saxlanıldı',objDeleted:'Obyekt silindi',enterName:'Ad daxil edin',enterBudget:'Məbləğ daxil edin',pdfOpening:'PDF açılır...',cantDeleteLast:'Son obyekti silmək olmaz',newObj:'Yeni obyekt',editObj:'Obyekti redaktə et',objName:'Ad',objNamePh:'Bağ evi, Qaraj...',objBudget:'Ümumi büdcə (₼)',objIcon:'İkon',deleteObj:'Obyekti sil',deleteObjConfirm:'Bütün məlumatlar silinəcək.',reportTitle:'Tikinti büdcəsi hesabatı',backBtn:'Geri',shareOfSmeta:'smeta payı',pctDone:'tamamlandı',stagesTitle:'Tikinti mərhələləri',noStages:'Mərhələ yoxdur. + düyməsinə basın',importJson:'İdxal JSON',importSuccess:'Məlumatlar idxal edildi',importError:'Yanlış fayl formatı',install:'Ev ekranına əlavə et',installHint:'Safari → Paylaş → «Ev ekranına əlavə et»',installBtn:'Quraşdır',workName:'İşin adı',matName:'Materialın adı'},
ru:{appName:'Construct',myObjects:'Мои объекты',objects:'МОИ ОБЪЕКТЫ',newObject:'＋ Новый объект',pdfExport:'📄 PDF экспорт',dataStored:'💾 Данные хранятся на устройстве',totalBudget:'Общий бюджет',budgetNotSet:'Бюджет не задан',budgetOver:'⚠️ Потрачено превышает бюджет',budgetLeft:'Остаток',setBudget:'Задайте бюджет во вкладке •••',smeta:'Смета (план)',fact:'Потрачено',stages:'ЭТАПЫ СТРОИТЕЛЬСТВА',factLabel:'потрачено',smetaLabel:'Смета',factShort:'Потрачено',remainder:'Остаток',debt:'К выплате',budget:'Бюджет',addStage:'Новый этап',editStage:'Редактировать этап',stageName:'Название',stageNamePh:'Например: Фасад',stageIcon:'Иконка',stageColor:'Цвет',stageHint:'💡 Бюджет этапа считается автоматически из позиций.',save:'Сохранить',cancel:'Отмена',create:'Создать',delete:'Удалить',deleteStage:'Удалить этап',deleteStageConfirm:'Этап и все позиции будут удалены.',addPos:'Добавить позицию',posName:'Название позиции',posNamePh:'Например: Опалубка',statusIdle:'Не начата',statusActive:'В процессе',statusDone:'Завершена',positions:'Позиции',posAdded:'Добавлено',posDeleted:'Удалено',editPos:'Редактировать позицию',deletePos:'Удалить позицию',deletePosConfirm:'Все работы и материалы будут удалены.',addWork:'👷 Добавить работу',addMat:'🧱 Добавить материал',contractAmount:'Сумма договора',paid:'Выплачено',unpaid:'Остаток',contractor:'Подрядчик',contractorPh:'Напр: Иван, "СтройГрупп"',phone:'Телефон',phonePh:'+7 000 000-00-00',startDate:'Дата начала',endDate:'Дата окончания',note:'Заметка',notePh:'Дополнительная информация...',qty:'Количество',price:'Цена',unit:'Ед. изм.',unitPcs:'шт',unitM2:'м²',unitM3:'м³',unitLm:'п.м.',unitKg:'кг',unitBag:'мешок',unitL:'л',typeWork:'Работа',typeMat:'Материал',stageAdded:'Этап добавлен',stageUpdated:'Этап обновлён',stageDeleted:'Этап удалён',objCreated:'Объект создан',objUpdated:'Сохранено',objDeleted:'Объект удалён',enterName:'Введите название',enterBudget:'Введите сумму',pdfOpening:'Открываю PDF...',cantDeleteLast:'Нельзя удалить единственный объект',newObj:'Новый объект',editObj:'Редактировать объект',objName:'Название',objNamePh:'Дача, Гараж, Квартира...',objBudget:'Общий бюджет (₼)',objIcon:'Иконка',deleteObj:'Удалить объект',deleteObjConfirm:'Все данные будут удалены навсегда.',reportTitle:'Отчёт о бюджете строительства',backBtn:'Назад',shareOfSmeta:'доля в смете',pctDone:'выполнено',stagesTitle:'Этапы строительства',noStages:'Нет этапов. Нажмите + чтобы добавить',importJson:'Импорт JSON',importSuccess:'Данные импортированы',importError:'Неверный формат файла',install:'Установить на рабочий стол',installHint:'Safari → Поделиться → «На экран "Домой"»',installBtn:'Установить',workName:'Название работы',matName:'Название материала'},
en:{appName:'Construct',myObjects:'My projects',objects:'MY PROJECTS',newObject:'＋ New project',pdfExport:'📄 Export PDF',dataStored:'💾 Data stored on this device',totalBudget:'Total budget',budgetNotSet:'Not set',budgetOver:'⚠️ Spent exceeds budget',budgetLeft:'Remaining',setBudget:'Set budget in ••• tab',smeta:'Estimate (plan)',fact:'Spent',stages:'CONSTRUCTION STAGES',factLabel:'spent',smetaLabel:'Estimate',factShort:'Spent',remainder:'Left',debt:'To pay',budget:'Budget',addStage:'New stage',editStage:'Edit stage',stageName:'Name',stageNamePh:'E.g.: Facade',stageIcon:'Icon',stageColor:'Color',stageHint:'💡 Stage budget is calculated automatically from positions.',save:'Save',cancel:'Cancel',create:'Create',delete:'Delete',deleteStage:'Delete stage',deleteStageConfirm:'Stage and all positions will be permanently deleted.',addPos:'Add position',posName:'Position name',posNamePh:'E.g.: Formwork',statusIdle:'Not started',statusActive:'In progress',statusDone:'Completed',positions:'Positions',posAdded:'Added',posDeleted:'Deleted',editPos:'Edit position',deletePos:'Delete position',deletePosConfirm:'All works and materials will be deleted.',addWork:'👷 Add labour',addMat:'🧱 Add material',contractAmount:'Contract amount',paid:'Paid',unpaid:'Remaining',contractor:'Contractor',contractorPh:'E.g.: John, "BuildCo"',phone:'Phone',phonePh:'+1 000-000-0000',startDate:'Start date',endDate:'End date',note:'Note',notePh:'Additional info...',qty:'Quantity',price:'Price',unit:'Unit',unitPcs:'pcs',unitM2:'m²',unitM3:'m³',unitLm:'l.m.',unitKg:'kg',unitBag:'bag',unitL:'l',typeWork:'Labour',typeMat:'Material',stageAdded:'Stage added',stageUpdated:'Stage updated',stageDeleted:'Stage deleted',objCreated:'Project created',objUpdated:'Saved',objDeleted:'Project deleted',enterName:'Enter name',enterBudget:'Enter amount',pdfOpening:'Opening PDF...',cantDeleteLast:'Cannot delete the only project',newObj:'New project',editObj:'Edit project',objName:'Name',objNamePh:'Cottage, Garage...',objBudget:'Total budget (₼)',objIcon:'Icon',deleteObj:'Delete project',deleteObjConfirm:'All data will be permanently deleted.',reportTitle:'Construction budget report',backBtn:'Back',shareOfSmeta:'share of estimate',pctDone:'completed',stagesTitle:'Construction stages',noStages:'No stages. Tap + to add',importJson:'Import JSON',importSuccess:'Data imported',importError:'Invalid file format',install:'Add to home screen',installHint:'Safari → Share → "Add to Home Screen"',installBtn:'Install',workName:'Work name',matName:'Material name'}
};
let lang=localStorage.getItem('isapp_lang')||'ru';
const t=k=>LANGS[lang][k]||LANGS['ru'][k]||k;
// Хелпер для 3 языков без ключа
const l3=(ru,az,en)=>lang==='az'?az:lang==='en'?en:ru;
// ── FORMAT ──
const fmt=n=>{const neg=n<0?'−':'';return neg+Math.abs(Math.round(n||0)).toLocaleString('en-US')+' ₼';};
const fmtShort=n=>{const abs=Math.abs(n),s=n<0?'−':'';if(abs>=1e6)return s+(abs/1e6).toFixed(1).replace('.0','')+' млн ₼';return fmt(n);};
// ── PRICE BOOK ──
const _PRICES_KEY='isapp_prices';
const _PRICES_DEF={concrete:90,rebar:0.9,gasblock:120,brick:2,shell:8,roof:15,plasterCem:14,plasterGyps:10,sand:25,gravel:30,cement:12,glue:6.5,screed:5,tileAdh:9,grout:3,tile:25,underlay:2,laminat:18,lag:3,plywood:15,plank:40,lacquer:12,paint:8};
function getPrices(){try{return{..._PRICES_DEF,...JSON.parse(localStorage.getItem(_PRICES_KEY)||'{}')};}catch(e){return{..._PRICES_DEF};}}
function savePrices(obj){try{localStorage.setItem(_PRICES_KEY,JSON.stringify(obj));}catch(e){}}
// ── DATA SCHEMA v9 ──
// Object → Stage → Position{id,name,status,works[],mats[]}
// Work:{id,name,contractAmount,paid,contractor,phone,startDate,endDate,note,done}
// Mat:{id,name,qty,unit,price,note}
const STORE_KEY='isapp_v9';
const IDB_NAME='tikinti_db';
const IDB_STORE='data';
const IDB_KEY='main';
const IDB_PHOTOS='photos';

// ── IndexedDB ──
let _idb=null;

function openIDB(){
  return new Promise((resolve,reject)=>{
    if(_idb){resolve(_idb);return;}
    const req=indexedDB.open(IDB_NAME,2);
    req.onupgradeneeded=e=>{
      const db=e.target.result;
      if(!db.objectStoreNames.contains(IDB_STORE))db.createObjectStore(IDB_STORE);
      if(!db.objectStoreNames.contains(IDB_PHOTOS))db.createObjectStore(IDB_PHOTOS);
    };
    req.onsuccess=e=>{_idb=e.target.result;resolve(_idb);};
    req.onerror=e=>reject(e);
  });
}

// ── ФОТО: сжатие + IndexedDB ──
function compressPhoto(file,maxPx,quality){
  maxPx=maxPx||1200;quality=quality||0.75;
  return new Promise(function(resolve,reject){
    const reader=new FileReader();
    reader.onerror=reject;
    reader.onload=function(e){
      const img=new Image();
      img.onerror=reject;
      img.onload=function(){
        let w=img.width,h=img.height;
        if(w>maxPx||h>maxPx){
          if(w>h){h=Math.round(h*maxPx/w);w=maxPx;}
          else{w=Math.round(w*maxPx/h);h=maxPx;}
        }
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
function savePhoto(photoId,dataUrl){
  return openIDB().then(function(db){
    return new Promise(function(resolve,reject){
      const tx=db.transaction(IDB_PHOTOS,'readwrite');
      const req=tx.objectStore(IDB_PHOTOS).put(dataUrl,String(photoId));
      req.onsuccess=function(){resolve();};
      req.onerror=reject;
    });
  });
}
function loadPhoto(photoId){
  return openIDB().then(function(db){
    return new Promise(function(resolve,reject){
      const req=db.transaction(IDB_PHOTOS,'readonly').objectStore(IDB_PHOTOS).get(String(photoId));
      req.onsuccess=function(e){resolve(e.target.result||null);};
      req.onerror=reject;
    });
  });
}
function deletePhoto(photoId){
  return openIDB().then(function(db){
    return new Promise(function(resolve,reject){
      const tx=db.transaction(IDB_PHOTOS,'readwrite');
      tx.objectStore(IDB_PHOTOS).delete(String(photoId));
      tx.oncomplete=function(){resolve();};
      tx.onerror=reject;
    });
  });
}
function loadPhotos(photoIds){
  if(!photoIds||!photoIds.length)return Promise.resolve({});
  return openIDB().then(function(db){
    return new Promise(function(resolve,reject){
      const result={};
      const tx=db.transaction(IDB_PHOTOS,'readonly');
      const store=tx.objectStore(IDB_PHOTOS);
      let done=0;
      photoIds.forEach(function(id){
        const req=store.get(String(id));
        req.onsuccess=function(e){result[id]=e.target.result||null;done++;if(done===photoIds.length)resolve(result);};
        req.onerror=function(){done++;if(done===photoIds.length)resolve(result);};
      });
    });
  });
}
// Генерация ID для фото
function newPhotoId(){return 'ph_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);}
function idbSave(data){
  openIDB().then(db=>{
    const tx=db.transaction(IDB_STORE,'readwrite');
    tx.objectStore(IDB_STORE).put(JSON.stringify(data),IDB_KEY);
  }).catch(e=>console.warn('IDB save error:',e));
  // fallback
  try{localStorage.setItem(STORE_KEY,JSON.stringify(data));}catch(e){}
}
function idbLoad(){
  return openIDB().then(db=>new Promise((resolve,reject)=>{
    const req=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(IDB_KEY);
    req.onsuccess=e=>resolve(e.target.result?JSON.parse(e.target.result):null);
    req.onerror=e=>reject(e);
  }));
}
const DEFAULT_OBJECT={id:1,name:'Мой дом',icon:'🏠',totalBudget:0,stages:[]};
function tName(o){if(!o)return'';return o['name_'+lang]||o.name_ru||o.name||'';}
function migrateV8toV9(old){
  const db={objects:[],activeObjectId:old.activeObjectId};
  (old.objects||[]).forEach(o=>{
    const no={id:o.id,name:tName(o)||'Object',icon:o.icon||'🏠',totalBudget:o.totalBudget||0,stages:[]};
    (o.stages||[]).forEach(s=>{
      const ns={id:s.id,name:tName(s)||'Stage',icon:s.icon||'🏗',color:s.color||'#C9AA7C',status:s.status||'idle',positions:[]};
      (s.items||[]).forEach(item=>{
        const pos={id:newId(),name:tName(item)||item.name||'Позиция',status:item.done?'done':'idle',works:[],mats:[]};
        if(item.type==='mat'){pos.mats.push({id:newId(),name:tName(item)||item.name||'',qty:item.qty||1,unit:item.unit||'шт',price:item.price||0,note:item.note||''});}
        else{pos.works.push({id:newId(),name:tName(item)||item.name||'',contractAmount:item.contractAmount||item.price||0,paid:item.paid||0,contractor:item.contractor||'',phone:item.phone||'',startDate:item.startDate||'',endDate:item.endDate||'',note:item.note||'',done:item.done||false});}
        ns.positions.push(pos);
      });
      no.stages.push(ns);
    });
    db.objects.push(no);
  });
  return db;
}
function loadDBFallback(){
  try{
    const d=JSON.parse(localStorage.getItem(STORE_KEY));
    if(d&&d.objects&&(d.objects[0]?.stages?.length===0||d.objects[0]?.stages?.[0]?.positions))return normalizeIds(d);
    const d8=JSON.parse(localStorage.getItem('isapp_v8'));
    if(d8&&d8.objects){const m=migrateV8toV9(d8);return normalizeIds(m);}
  }catch(e){console.warn(e);}
  return{objects:[],activeObjectId:null};
}
function loadDB(){
  // Синхронно из localStorage пока IDB не загрузится
  return loadDBFallback();
}
let _storageSource='localStorage';
// Нормализация всех ID в строки (newId() возвращает число, а onclick передаёт строку)
function normalizeIds(data){
  if(!data||!data.objects)return data;
  const sid=v=>(v==null?'':String(v));
  data.activeObjectId=sid(data.activeObjectId)||null;
  data.objects=(data.objects||[]).map(o=>({
    ...o,id:sid(o.id),
    payments:(o.payments||[]).map(p=>({...p,id:sid(p.id),workId:sid(p.workId),stageId:sid(p.stageId),posId:sid(p.posId)})),
    stages:(o.stages||[]).map(s=>({
      ...s,id:sid(s.id),
      positions:(s.positions||[]).map(p=>({
        ...p,id:sid(p.id),
        works:(p.works||[]).map(w=>({...w,id:sid(w.id)})),
        mats:(p.mats||[]).map(m=>({...m,id:sid(m.id)}))
      }))
    }))
  }));
  migratePayments(data);
  normalizeStatuses(data);
  return data;
}
// Инвариант статусов: выплата по работе = работа началась.
// idle-позиция с оплаченной работой → active; статус этапа выводится из позиций
// (та же логика, что autoStageStatus, но чистая — для любых потоков выплат).
function normalizeStatuses(data){
  (data.objects||[]).forEach(o=>(o.stages||[]).forEach(s=>{
    (s.positions||[]).forEach(p=>{
      if(p.status==='idle'&&(p.works||[]).some(w=>(w.paid||0)>0))p.status='active';
    });
    const pos=s.positions||[];
    if(pos.length){
      const allDone=pos.every(p=>p.status==='done');
      const anyActive=pos.some(p=>p.status!=='idle');
      s.status=allDone?'done':anyActive?'active':'idle';
    }
  }));
}
// Леджер выплат: obj.payments[] — единый источник для графиков/аналитики.
// paymentHistory остаётся для детализации по работе (тип/план) и НЕ удаляется.
// Идемпотентно: каждую запись истории зеркалим в obj.payments ровно один раз
// (ключ workId|amount|ts), плюс разово учитываем legacy w.paid без истории.
// Безопасно вызывать на каждый load и save (не плодит дубли).
function migratePayments(data){
  let uid=Date.now();
  (data.objects||[]).forEach(o=>{
    if(!Array.isArray(o.payments))o.payments=[];
    const key=(wid,amt,ts)=>String(wid)+'|'+Math.round((amt||0)*100)+'|'+(ts||0);
    const counts={};
    o.payments.forEach(pm=>{const k=key(pm.workId,pm.amount,pm.ts);counts[k]=(counts[k]||0)+1;});
    // 1) Зеркалим историю выплат в леджер (без дублей по ключу)
    (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
      (w.paymentHistory||[]).forEach(ph=>{
        const k=key(w.id,ph.amount,ph.ts);
        if(counts[k]>0){counts[k]--;return;}
        o.payments.push({id:String(uid++),workId:String(w.id),stageId:String(s.id),posId:String(p.id),contractor:w.contractor||'',amount:ph.amount||0,ts:ph.ts||Date.now(),note:ph.note||ph.type||''});
      });
    })));
    // 2) Legacy: paid>0 без истории и не покрыт леджером — добавить разницу (идемпотентно)
    (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
      if((w.paymentHistory||[]).length>0)return;
      const recorded=o.payments.filter(pm=>String(pm.workId)===String(w.id)).reduce((a,pm)=>a+(pm.amount||0),0);
      const gap=(w.paid||0)-recorded;
      if(gap>0.5)o.payments.push({id:String(uid++),workId:String(w.id),stageId:String(s.id),posId:String(p.id),contractor:w.contractor||'',amount:gap,ts:w.startDate?new Date(w.startDate).getTime():Date.now(),note:''});
    })));
  });
}
// Добавить выплату — пишет в object.payments[] и обновляет w.paid
function addPayment({workId,stageId,posId,contractor,amount,note}){
  const o=curObj();if(!o)return;
  const amt=parseFloat(amount)||0;if(!amt)return;
  const payment={id:newId(),workId:String(workId),stageId:String(stageId),posId:String(posId),contractor:contractor||'',amount:amt,ts:Date.now(),note:note||''};
  db.objects=db.objects.map(obj=>{
    if(obj.id!==o.id)return obj;
    const payments=[...(obj.payments||[]),payment];
    const totalPaid=payments.filter(pm=>pm.workId===String(workId)).reduce((a,pm)=>a+pm.amount,0);
    const stgs=(obj.stages||[]).map(s=>s.id!==String(stageId)?s:{...s,positions:(s.positions||[]).map(p=>p.id!==String(posId)?p:{...p,works:(p.works||[]).map(w=>w.id!==String(workId)?w:{...w,paid:totalPaid})})});
    return{...obj,payments,stages:stgs};
  });
  addJournalEntry(o.id,'payment',(lang==='ru'?'Выплата: ':'Payment: ')+fmtShort(amt)+(contractor?' → '+contractor:''),{amount:amt,contractor});
  if(contractor){const allWorks=(o.stages||[]).flatMap(s=>(s.positions||[]).flatMap(p=>p.works||[])).find(w=>w.id===String(workId));upsertContractor(contractor,allWorks?.phone||'');}
  saveDB();
  return payment;
}
function initDB(){
  idbLoad().then(idbData=>{
    if(idbData&&idbData.objects&&idbData.objects.length>0){
      db=normalizeIds(idbData);
      _storageSource='IndexedDB';
    } else {
      const fallback=loadDBFallback();
      db=normalizeIds(fallback);
      _storageSource='localStorage→IDB';
      idbSave(db);
    }
    renderDash();setTimeout(initCarouselDots,100);
    updateStorageBadge();
  }).catch(e=>{
    console.warn('IDB load failed, using localStorage:',e);
    db=normalizeIds(loadDBFallback());
    _storageSource='localStorage (IDB error)';
    renderDash();setTimeout(initCarouselDots,100);
    updateStorageBadge();
    loadWeather();
  });
}
let _weatherCache=null,_weatherTs=0;
function _fetchWeather(lat,lon){
  fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current_weather=true&timezone=auto')
    .then(function(r){return r.json();})
    .then(function(data){
      const w=data.current_weather,code=w.weathercode;
      let icon='☀️';
      if(code===0)icon='☀️';
      else if(code<=2)icon='🌤️';
      else if(code<=3)icon='☁️';
      else if(code<=48)icon='🌫️';
      else if(code<=55)icon='🌦️';
      else if(code<=65)icon='🌧️';
      else if(code<=77)icon='❄️';
      else if(code<=82)icon='🌧️';
      else icon='⛈️';
      const result={icon,temp:Math.round(w.temperature)};
      _weatherCache=result;_weatherTs=Date.now();
      renderWeather(result);
    }).catch(function(){renderWeather(null);});
}
function loadWeather(){
  const now=Date.now();
  if(_weatherCache&&now-_weatherTs<30*60000){renderWeather(_weatherCache);return;}
  if(!navigator.geolocation){_fetchWeather('40.4093','49.8671');return;}
  navigator.geolocation.getCurrentPosition(
    function(pos){_fetchWeather(pos.coords.latitude.toFixed(4),pos.coords.longitude.toFixed(4));},
    function(){_fetchWeather('40.4093','49.8671');}, // fallback Баку
    {timeout:5000}
  );
}
function renderWeather(w){
  const el=document.getElementById('weatherWidget');
  if(!el)return;
  if(!w){el.style.display='none';return;}
  el.style.display='flex';
  el.innerHTML='<span style="font-size:18px;line-height:1">'+w.icon+'</span><span style="font-size:13px;font-weight:700;font-family:\'DM Mono\',monospace">'+w.temp+'°</span>';
}
function updateStorageBadge(){
  const el=document.getElementById('storageBadge');
  if(!el)return;
  // Показываем только если что-то не так (fallback на localStorage)
  if(_storageSource==='IndexedDB')el.textContent='';
  else el.textContent='⚠ '+( lang==='ru'?'резервный режим':'fallback mode');
}
function saveDB(){migratePayments(db);normalizeStatuses(db);idbSave(db);updateTabLabels();localStorage.setItem('db_updated',String(Date.now()));cloudSave();}

// ── FIREBASE CLOUD ──
let _fbUser=null;
let _cloudSaveTimer=null;

function cloudSave(){
  if(!_fbUser)return;
  // Дебаунс — не чаще раза в 3 секунды
  clearTimeout(_cloudSaveTimer);
  _cloudSaveTimer=setTimeout(async()=>{
    try{
      await _fbDb.collection('users').doc(_fbUser.uid).set({
        data:JSON.stringify(db),
        updated:Date.now(),
        version:1
      });
    }catch(e){console.warn('Cloud save failed:',e.message);}
  },3000);
}

async function cloudLoad(){
  if(!_fbUser)return null;
  try{
    const doc=await _fbDb.collection('users').doc(_fbUser.uid).get();
    // doc.data() === undefined если документа нет. (doc.exists в compat-SDK — свойство,
    // а не метод: doc.exists() бросало TypeError → облако никогда не загружалось)
    const d=doc.data();
    if(d&&d.data){
      return{data:JSON.parse(d.data),updated:d.updated};
    }
  }catch(e){console.warn('Cloud load failed:',e.message);}
  return null;
}

async function signInWithGoogle(){
  const provider=new firebase.auth.GoogleAuthProvider();
  // В установленном PWA (standalone) и WebView popup часто блокируется → redirect
  const standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
  try{
    if(standalone){await _fbAuth.signInWithRedirect(provider);return;}
    await _fbAuth.signInWithPopup(provider);
  }catch(e){
    const code=e&&e.code||'';
    if(code==='auth/popup-blocked'||code==='auth/popup-closed-by-user'||code==='auth/cancelled-popup-request'||code==='auth/operation-not-supported-in-this-environment'){
      try{await _fbAuth.signInWithRedirect(provider);return;}catch(e2){showToast('Ошибка входа: '+e2.message,'err');return;}
    }
    showToast('Ошибка входа: '+(e&&e.message||code),'err');
  }
}

function signOut(){
  _fbAuth.signOut();
  _fbUser=null;
  renderMore();
  showToast(lang==='ru'?'Вышли из аккаунта':'Signed out');
}

// Слушаем статус авторизации
_fbAuth.onAuthStateChanged(async user=>{
  _fbUser=user;
  if(user){
    // Пробуем загрузить облачные данные
    const cloud=await cloudLoad();
    if(cloud){
      const localUpdated=parseInt(localStorage.getItem('db_updated')||'0');
      if(cloud.updated>localUpdated&&cloud.data.objects?.length>0){
        // Облако новее — берём его
        db=normalizeIds(cloud.data);
        idbSave(db);
        localStorage.setItem('db_updated',String(cloud.updated));
        renderDash();setTimeout(initCarouselDots,150);
        showToast(lang==='ru'?'Данные синхронизированы ☁️':'Synced from cloud ☁️');
      } else if(db.objects?.length>0){
        // Локальные данные новее — пушим в облако
        cloudSave();
      }
    } else if(db.objects?.length>0){
      // Аккаунт новый — заливаем локальные данные
      cloudSave();
    }
    updateCloudBadge();
    renderMore();
  } else {
    updateCloudBadge();
  }
});

// Завершаем вход через redirect (установленный PWA). onAuthStateChanged подхватит юзера;
// здесь только всплываем ошибки (напр. auth/unauthorized-domain — добавьте домен в Firebase Console).
_fbAuth.getRedirectResult().catch(e=>{
  const code=e&&e.code||'';
  if(code&&code!=='auth/no-auth-event')showToast('Вход: '+(e.message||code),'err');
});

function updateCloudBadge(){
  const badge=document.getElementById('cloudBadge');
  if(!badge)return;
  badge.textContent=_fbUser?'☁️ '+(_fbUser.displayName||_fbUser.email):'—';
}

// ── INIT: DB + BUSINESS LOGIC (moved from bottom) ──
let db=loadDB();
let activeStageId=null,activePosId=null;
const curObj=()=>db.objects.find(o=>o.id===db.activeObjectId)||db.objects[0];
const stages=()=>curObj().stages||[];
const newId=()=>String(Date.now()+Math.floor(Math.random()*9999));
// calcs
const workTotal=w=>w.contractAmount||0;
const matTotal=m=>(m.qty||1)*(m.price||0);
const posSmeta=p=>(p.works||[]).reduce((a,w)=>a+workTotal(w),0)+(p.mats||[]).reduce((a,m)=>a+matTotal(m),0);
const posDebt=p=>(p.works||[]).reduce((a,w)=>a+Math.max(0,(w.contractAmount||0)-(w.paid||0)),0);
const posFact=p=>(p.works||[]).reduce((a,w)=>a+(w.paid||0),0)+(p.mats||[]).reduce((a,m)=>a+matTotal(m),0);
const stageSmeta=s=>(s.positions||[]).reduce((a,p)=>a+posSmeta(p),0);
const stageDebt=s=>(s.positions||[]).reduce((a,p)=>a+(p.works||[]).reduce((b,w)=>b+Math.max(0,(w.contractAmount||0)-(w.paid||0)),0),0);
// Долг только по начатым позициям (idle = план, не долг) — для полосы этапа и героя дашборда
const stageDebtStarted=s=>(s.positions||[]).filter(p=>p.status!=='idle').reduce((a,p)=>a+posDebt(p),0);
const stagePaid=s=>(s.positions||[]).reduce((a,p)=>a+(p.works||[]).reduce((b,w)=>b+(w.paid||0),0),0);
const stageContract=s=>(s.positions||[]).reduce((a,p)=>a+(p.works||[]).reduce((b,w)=>b+(w.contractAmount||0),0),0);
const isOverdue=w=>{if(w.done||!w.endDate)return false;const t=new Date();t.setHours(0,0,0,0);return new Date(w.endDate)<t;};
const posHasOverdue=p=>(p.works||[]).some(w=>isOverdue(w));
const stageHasOverdue=s=>(s.positions||[]).some(p=>posHasOverdue(p));
const stageOverdueCount=s=>(s.positions||[]).reduce((a,p)=>a+(p.works||[]).filter(w=>isOverdue(w)).length,0);
const isStageDeadlineOverdue=s=>{if(!s.endDate||s.status==='done')return false;const t=new Date();t.setHours(0,0,0,0);return new Date(s.endDate)<t;};
// Ориентир срока этапа: ручная дата (сезонные ворота) приоритетна, иначе агрегат из дат незакрытых работ
const stageDeadline=s=>{
  if(s.endDate)return{date:s.endDate,src:'stage'};
  let max='';
  (s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{if(!w.done&&w.endDate&&w.endDate>max)max=w.endDate;}));
  return max?{date:max,src:'works'}:null;
};
const stageFact=s=>(s.positions||[]).reduce((a,p)=>a+posFact(p),0);
const totalSmeta=()=>stages().reduce((a,s)=>a+stageSmeta(s),0);
const totalFact=()=>stages().reduce((a,s)=>a+stageFact(s),0);
const totalBudget=()=>curObj().totalBudget||0;
const OBJ_ICONS=['🏠','🏡','🏗','🏢','🏬','🏭','🌳','🌿','🏊','🔑','⬛','🧱'];
const ICONS=['🏠','🏗','⬛','🪟','⚙️','🎨','🌿','🧱','🔧','💡','🚿','🛠','🏡','🌲','🪣','🔑','🏊','🌳'];
const COLORS=['#C9AA7C','#7BB8CC','#CC7B7B','#9E8ED4','#80C89A','#C8C07E','#CC9B7B','#7BC4CC','#B87BB8','#7BA8CC'];

// Словарь переводов для шаблонов
const TPL_TR={
  'Фундамент':{az:'Özül',en:'Foundation'},
  'Коробка дома':{az:'Ev korpusu',en:'House shell'},
  'Окна и двери':{az:'Pəncərə və qapılar',en:'Windows & doors'},
  'Электрика':{az:'Elektrik',en:'Electrical'},
  'Водопровод':{az:'Su kəməri',en:'Plumbing'},
  'Отопление':{az:'İstilik',en:'Heating'},
  'Отделка':{az:'Bəzək işləri',en:'Finishing'},
  'Бассейн':{az:'Hovuz',en:'Swimming pool'},
  'Земляные работы':{az:'Torpaq işləri',en:'Earthworks'},
  'Копка котлована':{az:'Qazmaq',en:'Excavation'},
  'Вывоз грунта':{az:'Torpaq daşıma',en:'Soil removal'},
  'Опалубка':{az:'Qəlib',en:'Formwork'},
  'Монтаж опалубки':{az:'Qəlib qurulması',en:'Formwork installation'},
  'Доски':{az:'Taxtalar',en:'Boards'},
  'Крепёж':{az:'Bərkitmə',en:'Fasteners'},
  'Армирование':{az:'Armatura işləri',en:'Reinforcement'},
  'Вязка арматуры':{az:'Armatura bağlama',en:'Rebar tying'},
  'Арматура 12мм':{az:'Armatura 12mm',en:'Rebar 12mm'},
  'Проволока':{az:'Məftil',en:'Wire'},
  'Бетонирование':{az:'Betonlama',en:'Concreting'},
  'Заливка бетона':{az:'Beton tökmə',en:'Concrete pouring'},
  'Бетон М300':{az:'Beton M300',en:'Concrete M300'},
  'Кладка стен':{az:'Divar hörməsi',en:'Wall masonry'},
  'Каменщики':{az:'Hörücülər',en:'Bricklayers'},
  'Кирпич/блок':{az:'Kərpic/blok',en:'Brick/block'},
  'Цемент':{az:'Sement',en:'Cement'},
  'Песок':{az:'Qum',en:'Sand'},
  'Перекрытие':{az:'Döşəmə',en:'Floor slab'},
  'Монтаж плит':{az:'Plitələrin quraşdırılması',en:'Slab installation'},
  'Плиты перекрытия':{az:'Döşəmə plitələri',en:'Floor slabs'},
  'Кровля':{az:'Dam',en:'Roof'},
  'Монтаж стропил':{az:'Çərçivə quraşdırılması',en:'Rafter installation'},
  'Укладка кровли':{az:'Dam örtüyü',en:'Roofing'},
  'Стропила':{az:'Çərçivə taxtaları',en:'Rafters'},
  'Кровельный материал':{az:'Dam örtüyü materialı',en:'Roofing material'},
  'Окна':{az:'Pəncərələr',en:'Windows'},
  'Установка окон':{az:'Pəncərə quraşdırılması',en:'Window installation'},
  'Окна ПВХ':{az:'PVC pəncərələr',en:'PVC windows'},
  'Откосы':{az:'Yan tərəflər',en:'Window reveals'},
  'Входная дверь':{az:'Giriş qapısı',en:'Front door'},
  'Установка двери':{az:'Qapı quraşdırılması',en:'Door installation'},
  'Дверь входная':{az:'Giriş qapısı',en:'Front door'},
  'Межкомнатные двери':{az:'Otaq qapıları',en:'Interior doors'},
  'Установка дверей':{az:'Qapıların quraşdırılması',en:'Doors installation'},
  'Двери':{az:'Qapılar',en:'Doors'},
  'Разводка':{az:'Elektrik xətləri',en:'Wiring'},
  'Прокладка кабеля':{az:'Kabel çəkilməsi',en:'Cable laying'},
  'Кабель ВВГ 3х2.5':{az:'Kabel VVG 3x2.5',en:'Cable VVG 3x2.5'},
  'Кабель ВВГ 3х1.5':{az:'Kabel VVG 3x1.5',en:'Cable VVG 3x1.5'},
  'Гофра':{az:'Qoruyucu boru',en:'Conduit'},
  'Щиток':{az:'Elektrik paneli',en:'Distribution board'},
  'Монтаж щитка':{az:'Panel quraşdırılması',en:'Board installation'},
  'Автоматы':{az:'Avtomatlar',en:'Circuit breakers'},
  'Розетки и выключатели':{az:'Rozetkalar və açarlar',en:'Sockets & switches'},
  'Установка':{az:'Quraşdırılma',en:'Installation'},
  'Розетки':{az:'Rozetkalar',en:'Sockets'},
  'Выключатели':{az:'Açarlar',en:'Switches'},
  'Холодная вода':{az:'Soyuq su',en:'Cold water'},
  'Монтаж труб':{az:'Boru çəkilməsi',en:'Pipe installation'},
  'Трубы ХВС':{az:'Soyuq su boruları',en:'Cold water pipes'},
  'Фитинги':{az:'Fitinqlər',en:'Fittings'},
  'Горячая вода':{az:'İsti su',en:'Hot water'},
  'Трубы ГВС':{az:'İsti su boruları',en:'Hot water pipes'},
  'Канализация':{az:'Kanalizasiya',en:'Sewage'},
  'Монтаж':{az:'Quraşdırılma',en:'Installation'},
  'Трубы канализационные':{az:'Kanalizasiya boruları',en:'Sewer pipes'},
  'Котельная':{az:'Qazan otağı',en:'Boiler room'},
  'Монтаж котла':{az:'Qazan quraşdırılması',en:'Boiler installation'},
  'Котёл':{az:'Qazan',en:'Boiler'},
  'Расширительный бак':{az:'Genişləndirici çən',en:'Expansion tank'},
  'Трубы отопления':{az:'İstilik boruları',en:'Heating pipes'},
  'Радиаторы':{az:'Radiatorlar',en:'Radiators'},
  'Установка радиаторов':{az:'Radiator quraşdırılması',en:'Radiator installation'},
  'Кронштейны':{az:'Kronşteynlər',en:'Brackets'},
  'Стяжка пола':{az:'Döşəmə hamarlanması',en:'Floor screed'},
  'Заливка стяжки':{az:'Stяжка tökmə',en:'Screed pouring'},
  'Маяки':{az:'Mayaklar',en:'Screeding rails'},
  'Штукатурка':{az:'Divar suvağı',en:'Wall plastering'},
  'Штукатурка стен':{az:'Divar suvağı',en:'Wall plastering'},
  'Штукатурная смесь':{az:'Suvaq qarışığı',en:'Plaster mix'},
  'Грунтовка':{az:'Astar',en:'Primer'},
  'Плитка':{az:'Kafel',en:'Tiling'},
  'Укладка плитки':{az:'Kafel döşənməsi',en:'Tile laying'},
  'Клей плиточный':{az:'Kafel yapışdırıcısı',en:'Tile adhesive'},
  'Затирка':{az:'Birləşdirici',en:'Grout'},
  'Покраска':{az:'Rəngləmə',en:'Painting'},
  'Покраска стен':{az:'Divar rəngləməsi',en:'Wall painting'},
  'Краска':{az:'Boya',en:'Paint'},
  'Валики и кисти':{az:'Val və fırçalar',en:'Rollers & brushes'},
  'Котлован':{az:'Qazmaq',en:'Excavation pit'},
  'Чаша бассейна':{az:'Hovuz gövdəsi',en:'Pool shell'},
  'Бетон М350':{az:'Beton M350',en:'Concrete M350'},
  'Гидроизоляция':{az:'Hidroizolyasiya',en:'Waterproofing'},
  'Отделка чаши':{az:'Hovuz örtüyü',en:'Pool finish'},
  'Укладка мозаики':{az:'Mozaika döşənməsi',en:'Mosaic laying'},
  'Мозаика/плитка':{az:'Mozaika/kafel',en:'Mosaic/tiles'},
  'Клей водостойкий':{az:'Su keçirməz yapışdırıcı',en:'Waterproof adhesive'},
  'Оборудование':{az:'Avadanlıq',en:'Equipment'},
  'Монтаж оборудования':{az:'Avadanlıq quraşdırılması',en:'Equipment installation'},
  'Насос/фильтр':{az:'Nasos/filtr',en:'Pump/filter'},
  'Скиммеры':{az:'Skimmerlər',en:'Skimmers'},
  'Форсунки':{az:'Forsunkalar',en:'Jets'},
  'Прожекторы':{az:'Proyektorlar',en:'Spotlights'},
  'Обвязка труб':{az:'Boru bağlantısı',en:'Pipe connections'},
  'Трубы ПВХ':{az:'PVC borular',en:'PVC pipes'},
  'Отмостка':{az:'Ətraf döşəmə',en:'Pool surround'},
  'Тротуарная плитка':{az:'Yol kafelı',en:'Paving tiles'},
};
function tr(key){if(!key)return'';if(lang==='ru')return key;const d=TPL_TR[key];if(!d)return key;return d[lang]||key;}

const BUILTIN_TEMPLATES=[
  {id:'f',name:'Фундамент',icon:'⬛',color:'#C9AA7C',positions:[
    {name:'Земляные работы',works:[{name:'Копка котлована'},{name:'Вывоз грунта'}],mats:[]},
    {name:'Опалубка',works:[{name:'Монтаж опалубки'}],mats:[{name:'Доски',unit:'шт'},{name:'Крепёж',unit:'шт'}]},
    {name:'Армирование',works:[{name:'Вязка арматуры'}],mats:[{name:'Арматура 12мм',unit:'кг'},{name:'Проволока',unit:'кг'}]},
    {name:'Бетонирование',works:[{name:'Заливка бетона'}],mats:[{name:'Бетон М300',unit:'м³'}]}
  ]},
  {id:'s',name:'Коробка дома',icon:'🏗',color:'#7BB8CC',positions:[
    {name:'Кладка стен',works:[{name:'Каменщики'}],mats:[{name:'Кирпич/блок',unit:'шт'},{name:'Цемент',unit:'мешок'},{name:'Песок',unit:'м³'}]},
    {name:'Перекрытие',works:[{name:'Монтаж плит'}],mats:[{name:'Плиты перекрытия',unit:'шт'}]},
    {name:'Кровля',works:[{name:'Монтаж стропил'},{name:'Укладка кровли'}],mats:[{name:'Стропила',unit:'шт'},{name:'Кровельный материал',unit:'м²'}]}
  ]},
  {id:'w',name:'Окна и двери',icon:'🪟',color:'#9E8ED4',positions:[
    {name:'Окна',works:[{name:'Установка окон'}],mats:[{name:'Окна ПВХ',unit:'шт'},{name:'Откосы',unit:'шт'}]},
    {name:'Входная дверь',works:[{name:'Установка двери'}],mats:[{name:'Дверь входная',unit:'шт'}]},
    {name:'Межкомнатные двери',works:[{name:'Установка дверей'}],mats:[{name:'Двери',unit:'шт'}]}
  ]},
  {id:'e',name:'Электрика',icon:'💡',color:'#C8C07E',positions:[
    {name:'Разводка',works:[{name:'Прокладка кабеля'}],mats:[{name:'Кабель ВВГ 3х2.5',unit:'л'},{name:'Кабель ВВГ 3х1.5',unit:'л'},{name:'Гофра',unit:'л'}]},
    {name:'Щиток',works:[{name:'Монтаж щитка'}],mats:[{name:'Автоматы',unit:'шт'},{name:'Щиток',unit:'шт'}]},
    {name:'Розетки и выключатели',works:[{name:'Установка'}],mats:[{name:'Розетки',unit:'шт'},{name:'Выключатели',unit:'шт'}]}
  ]},
  {id:'p',name:'Водопровод',icon:'🚿',color:'#7BC4CC',positions:[
    {name:'Холодная вода',works:[{name:'Монтаж труб'}],mats:[{name:'Трубы ХВС',unit:'л'},{name:'Фитинги',unit:'шт'}]},
    {name:'Горячая вода',works:[{name:'Монтаж труб'}],mats:[{name:'Трубы ГВС',unit:'л'},{name:'Фитинги',unit:'шт'}]},
    {name:'Канализация',works:[{name:'Монтаж'}],mats:[{name:'Трубы канализационные',unit:'л'},{name:'Фитинги',unit:'шт'}]}
  ]},
  {id:'h',name:'Отопление',icon:'🔧',color:'#CC9B7B',positions:[
    {name:'Котельная',works:[{name:'Монтаж котла'}],mats:[{name:'Котёл',unit:'шт'},{name:'Расширительный бак',unit:'шт'}]},
    {name:'Разводка',works:[{name:'Монтаж труб'}],mats:[{name:'Трубы отопления',unit:'л'},{name:'Фитинги',unit:'шт'}]},
    {name:'Радиаторы',works:[{name:'Установка радиаторов'}],mats:[{name:'Радиаторы',unit:'шт'},{name:'Кронштейны',unit:'шт'}]}
  ]},
  {id:'fin',name:'Отделка',icon:'🎨',color:'#80C89A',positions:[
    {name:'Стяжка пола',works:[{name:'Заливка стяжки'}],mats:[{name:'Цемент',unit:'мешок'},{name:'Песок',unit:'м³'},{name:'Маяки',unit:'шт'}]},
    {name:'Штукатурка',works:[{name:'Штукатурка стен'}],mats:[{name:'Штукатурная смесь',unit:'мешок'},{name:'Грунтовка',unit:'л'}]},
    {name:'Плитка',works:[{name:'Укладка плитки'}],mats:[{name:'Плитка',unit:'м²'},{name:'Клей плиточный',unit:'мешок'},{name:'Затирка',unit:'кг'}]},
    {name:'Покраска',works:[{name:'Покраска стен'}],mats:[{name:'Краска',unit:'л'},{name:'Грунтовка',unit:'л'},{name:'Валики и кисти',unit:'шт'}]}
  ]},
  {id:'pool',name:'Бассейн',icon:'🏊',color:'#7BA8CC',positions:[
    {name:'Котлован',works:[{name:'Копка котлована'},{name:'Вывоз грунта'}],mats:[]},
    {name:'Чаша бассейна',works:[{name:'Армирование'},{name:'Бетонирование'}],mats:[{name:'Арматура',unit:'кг'},{name:'Бетон М350',unit:'м³'},{name:'Гидроизоляция',unit:'м²'}]},
    {name:'Отделка чаши',works:[{name:'Укладка мозаики'}],mats:[{name:'Мозаика/плитка',unit:'м²'},{name:'Клей водостойкий',unit:'мешок'},{name:'Затирка',unit:'кг'}]},
    {name:'Оборудование',works:[{name:'Монтаж оборудования'}],mats:[{name:'Насос/фильтр',unit:'шт'},{name:'Скиммеры',unit:'шт'},{name:'Форсунки',unit:'шт'},{name:'Прожекторы',unit:'шт'}]},
    {name:'Обвязка труб',works:[{name:'Монтаж труб'}],mats:[{name:'Трубы ПВХ',unit:'л'},{name:'Фитинги',unit:'шт'}]},
    {name:'Отмостка',works:[{name:'Укладка плитки'}],mats:[{name:'Тротуарная плитка',unit:'м²'}]}
  ]}
];
const TPLS_KEY='isapp_tpls';
const CONTRACTORS_KEY='tikinti_contractors';

// ── БАЗА ПОДРЯДЧИКОВ ──
const SPECIALIZATIONS={
  ru:['Каменщик','Электрик','Сантехник','Кровельщик','Плотник','Штукатур','Плиточник','Маляр','Сварщик','Разнорабочий','Другое'],
  az:['Hörücü','Elektrik','Santexnik','Damçı','Dülgər','Suvaqçı','Kafelçi','Rəngkar','Qaynaqçı','Fəhlə','Digər'],
  en:['Mason','Electrician','Plumber','Roofer','Carpenter','Plasterer','Tiler','Painter','Welder','Labourer','Other']
};
function getSpecializations(){return SPECIALIZATIONS[lang]||SPECIALIZATIONS.ru;}

function loadContractors(){try{return JSON.parse(localStorage.getItem(CONTRACTORS_KEY))||[];}catch{return[];}}
function saveContractors(list){localStorage.setItem(CONTRACTORS_KEY,JSON.stringify(list));}

function upsertContractor(name,phone){
  if(!name)return;
  const list=loadContractors();
  const existing=list.find(c=>c.name.toLowerCase()===name.toLowerCase());
  if(existing){
    if(phone&&!existing.phone)existing.phone=phone;
    existing.lastUsed=Date.now();
  } else {
    list.push({id:newId(),name,phone:phone||'',specialization:'',lastUsed:Date.now()});
  }
  saveContractors(list);
}

function getContractorByName(name){
  return loadContractors().find(c=>c.name.toLowerCase()===name.toLowerCase());
}

function searchContractors(query){
  if(!query)return[];
  return loadContractors()
    .filter(c=>c.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b)=>(b.lastUsed||0)-(a.lastUsed||0))
    .slice(0,5);
}

// Собрать всех подрядчиков из всех объектов и добавить в базу
function syncContractorsFromData(){
  db.objects.forEach(o=>{
    (o.stages||[]).forEach(s=>{
      (s.positions||[]).forEach(p=>{
        (p.works||[]).forEach(w=>{
          if(w.contractor)upsertContractor(w.contractor,w.phone||'');
        });
      });
    });
  });
}

// Получить статистику подрядчика
function getContractorStats(name,objId){
  let total=0,paid=0,works=[];
  db.objects.forEach(o=>{
    if(objId&&o.id!==objId)return;
    (o.stages||[]).forEach(s=>{
      (s.positions||[]).forEach(p=>{
        (p.works||[]).forEach(w=>{
          if(w.contractor&&w.contractor.toLowerCase()===name.toLowerCase()){
            total+=w.contractAmount||0;
            paid+=w.paid||0;
            works.push({stageName:tName(s),posName:p.name,workName:w.name,contract:w.contractAmount||0,paid:w.paid||0,done:w.done});
          }
        });
      });
    });
  });
  return{total,paid,debt:total-paid,works};
}
function payContractorPrompt(name,objId){
  const stats=getContractorStats(name,objId);
  if(stats.debt<=0){showToast(lang==='ru'?'Долгов нет':'No debt');return;}
  const unpaidWorks=[];
  db.objects.forEach(o=>{if(objId&&o.id!==objId)return;(o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
    if(w.contractor&&w.contractor.toLowerCase()===name.toLowerCase()&&w.paid<w.contractAmount)
      unpaidWorks.push({objId:o.id,stageId:s.id,posId:p.id,workId:w.id,name:w.name,
        debt:w.contractAmount-w.paid,contract:w.contractAmount,paid:w.paid,stageName:tName(s)||s.name});
  })));});
  const safeName=name.replace(/'/g,"\\'");
  const worksHTML=unpaidWorks.map(w=>`
    <div style="background:var(--bg3);border-radius:12px;padding:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;margin-bottom:2px">${w.name}</div>
          <div style="font-size:11px;color:var(--text3)">${w.stageName}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:8px">
          <div style="font-size:14px;font-weight:700;color:var(--red)">${fmtShort(w.debt)}</div>
          <div style="font-size:10px;color:var(--text3)">${lang==='ru'?'долг':'borc'}</div>
        </div>
      </div>
      <button onclick="payOneWork('${w.objId}','${w.stageId}','${w.posId}','${w.workId}','${safeName}',${w.debt})"
        class="btn btn-secondary" style="width:100%;padding:8px;font-size:12px;justify-content:center">
        ${lang==='ru'?'Оплатить эту работу':'Pay this work'}
      </button>
    </div>`).join('');
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title"><i class="ph ph-coins" style="color:var(--gold)"></i> ${lang==='ru'?'Выплата':'Payment'} — ${name}</div>
    ${worksHTML}
    <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0 12px;font-size:13px;font-weight:700">
      <span style="color:var(--text2)">${lang==='ru'?'Итого долг':'Total debt'}</span>
      <span style="color:var(--red)">${fmtShort(stats.debt)}</span>
    </div>
    <div class="form-group">
      <label class="form-label">${lang==='ru'?'Оплатить всё (сумма ₼)':'Pay all (amount ₼)'}</label>
      <input type="number" id="ctPayAmt" value="${stats.debt}" inputmode="decimal" style="font-size:18px;font-weight:700"/>
    </div>
    <div style="display:flex;gap:10px;margin-top:4px">
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
      <button id="payAllBtn" class="btn btn-primary" style="flex:1" onclick="payAllConfirmStep('${safeName}',this,'${objId||''}')"><i class="ph ph-check"></i> ${lang==='ru'?'Оплатить всё':'Pay all'}</button>
    </div>`);
}
function payOneWork(objId,stageId,posId,workId,name,defaultAmt){
  const safeName=name.replace(/'/g,"\\'");
  const safeObj=(objId||'').replace(/'/g,"\\'");
  showModal(`<div class="modal-handle"></div>
    <div class="modal-title"><i class="ph ph-coins" style="color:var(--gold)"></i> ${lang==='ru'?'Выплата по работе':'Work payment'}</div>
    <div class="form-group">
      <label class="form-label">${lang==='ru'?'Сумма ₼':'Amount ₼'}</label>
      <input type="number" id="ctOnePayAmt" value="${defaultAmt}" inputmode="decimal" style="font-size:18px;font-weight:700"/>
    </div>
    <div style="display:flex;gap:10px;margin-top:4px">
      <button class="btn btn-secondary" onclick="payContractorPrompt('${safeName}','${safeObj}')">← ${lang==='ru'?'Назад':'Back'}</button>
      <button class="btn btn-primary" style="flex:1" onclick="confirmOneWorkPay('${objId}','${stageId}','${posId}','${workId}','${safeName}')"><i class="ph ph-check"></i> ${lang==='ru'?'Выплатить':'Pay'}</button>
    </div>`);
}
function confirmOneWorkPay(objId,stageId,posId,workId,name){
  const amt=parseFloat(document.getElementById('ctOnePayAmt')?.value)||0;
  if(!amt){showToast(t('enterBudget'),'err');return;}
  const ts=Date.now();
  db.objects.forEach(o=>{
    if(o.id!==objId)return;
    (o.stages||[]).forEach(s=>{
      if(s.id!==stageId)return;
      (s.positions||[]).forEach(p=>{
        if(p.id!==posId)return;
        p.works=(p.works||[]).map(w=>{
          if(w.id!==workId)return w;
          const maxPay=Math.max(0,(w.contractAmount||0)-(w.paid||0));
          const pay=Math.min(amt,maxPay);
          return{...w,paid:(w.paid||0)+pay,paymentHistory:[...(w.paymentHistory||[]),{amount:pay,ts,contractor:name,name:w.name}]};
        });
      });
    });
  });
  addJournalEntry(db.activeObjectId,'payment',(lang==='ru'?'Выплата: ':'Payment: ')+fmtShort(amt)+' → '+name,{amount:amt,contractor:name});
  saveDB();closeModal();
  // Обновляем все возможные открытые экраны (выплата зовётся из Мастеров и из позиции)
  if(typeof renderMasters==='function')renderMasters();
  if(typeof renderPos==='function')renderPos();
  if(typeof renderDetail==='function')renderDetail();
  if(typeof renderDashBottom==='function')renderDashBottom();
  showToast((lang==='ru'?'Выплачено: ':'Paid: ')+fmtShort(amt));
}
function payAllConfirmStep(name,btn,objId){
  const amt=parseFloat(document.getElementById('ctPayAmt')?.value)||0;
  if(!amt){showToast(t('enterBudget'),'err');return;}
  // Первый тап — меняем кнопку на подтверждение
  btn.innerHTML=`<i class="ph ph-warning"></i> ${lang==='ru'?'Уверены? '+fmtShort(amt):'Sure? '+fmtShort(amt)}`;
  btn.style.background='var(--red)';
  btn.style.borderColor='var(--red)';
  btn.onclick=()=>confirmContractorPay(name,objId);
  // Через 3 секунды — откатываем если не нажали
  setTimeout(()=>{
    if(document.getElementById('payAllBtn')===btn){
      btn.innerHTML=`<i class="ph ph-check"></i> ${lang==='ru'?'Оплатить всё':'Pay all'}`;
      btn.style.background='';btn.style.borderColor='';
      btn.onclick=()=>payAllConfirmStep(name,btn,objId);
    }
  },3000);
}
function confirmContractorPay(name,objId){
  const amt=parseFloat(document.getElementById('ctPayAmt')?.value)||0;
  if(!amt){showToast(t('enterBudget'),'err');return;}
  let remaining=amt;
  const ts=Date.now();
  db.objects.forEach(o=>{if(objId&&o.id!==objId)return;(o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>{
    p.works=(p.works||[]).map(w=>{
      if(remaining<=0)return w;
      if(!w.contractor||w.contractor.toLowerCase()!==name.toLowerCase())return w;
      const debt=Math.max(0,(w.contractAmount||0)-(w.paid||0));
      if(debt<=0)return w;
      const pay=Math.min(remaining,debt);
      remaining-=pay;
      return{...w,paid:(w.paid||0)+pay,paymentHistory:[...(w.paymentHistory||[]),{amount:pay,ts,contractor:name,name:w.name}]};
    });
  }));});
  addJournalEntry(db.activeObjectId,'payment',(lang==='ru'?'Выплата: ':'Payment: ')+fmtShort(amt)+' → '+name,{amount:amt,contractor:name});
  saveDB();closeModal();
  // Обновляем все возможные открытые экраны (выплата зовётся из Мастеров и из позиции)
  if(typeof renderMasters==='function')renderMasters();
  if(typeof renderPos==='function')renderPos();
  if(typeof renderDetail==='function')renderDetail();
  if(typeof renderDashBottom==='function')renderDashBottom();
  showToast((lang==='ru'?'Выплачено: ':'Paid: ')+fmtShort(amt));
}
function loadMyTemplates(){try{return JSON.parse(localStorage.getItem(TPLS_KEY))||[];}catch{return[];}}
function openStageDatePicker(){
  const cur=document.getElementById('stageEndDate')?.value||'';
  openDrumPicker('stageEnd',cur);
}
function saveMyTemplates(t){localStorage.setItem(TPLS_KEY,JSON.stringify(t));}
function tplName(tpl){return tr(tpl.name)||tpl.name||'';}
function applyTemplate(tpl){
  const positions=(tpl.positions||[]).map(p=>({
    id:newId(),name:tr(p.name)||p.name||'',status:'idle',
    works:(p.works||[]).map(w=>({id:newId(),name:tr(w.name)||w.name||'',contractAmount:0,paid:0,contractor:'',phone:'',startDate:'',endDate:'',note:'',done:false})),
    mats:(p.mats||[]).map(m=>({id:newId(),name:tr(m.name)||m.name||'',qty:1,unit:m.unit||'шт',price:0,note:''}))
  }));
  const sid=newId();
  updateStages(ss=>[...ss,{id:sid,name:tplName(tpl),icon:tpl.icon||'🏗',color:tpl.color||'#7BB8CC',status:'idle',positions}]);
  closeModal();activeStageId=sid;
  document.getElementById('pageDash').classList.add('page-hidden-left');
  document.getElementById('pageDetail').classList.remove('page-hidden-right');
  renderDetail();
  showToast(lang==='ru'?'Этап создан из шаблона':lang==='az'?'Şablondan yaradıldı':'Stage created from template');
}
function saveAsTemplate(){
  const s=stages().find(st=>st.id===activeStageId);if(!s)return;
  const myTpls=loadMyTemplates();
  myTpls.push({id:'my_'+newId(),name:tplName(s),icon:s.icon,color:s.color,
    positions:(s.positions||[]).map(p=>({name:p.name,works:(p.works||[]).map(w=>({name:w.name})),mats:(p.mats||[]).map(m=>({name:m.name,unit:m.unit||'шт'}))}))
  });
  saveMyTemplates(myTpls);
  showToast(lang==='ru'?'Шаблон сохранён':'Template saved');
}
function ringHTML(pct,color,size){const r=size/2-5,circ=2*Math.PI*r,off=circ*(1-pct/100);return`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;flex-shrink:0"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="4"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})" style="transition:stroke-dashoffset .5s"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="${color}" font-family="'DM Mono',monospace" font-size="${size>50?11:9}" font-weight="700">${Math.round(pct)}%</text></svg>`;}
// ── TOAST ──
function showToast(msg,type='ok'){const el=document.getElementById('toast');el.textContent=(type==='ok'?'✓ ':type==='err'?'✕ ':'')+msg;el.className='toast show';clearTimeout(el._to);el._to=setTimeout(()=>{el.className='toast';},2400);}
function switchObject(id){db.activeObjectId=id;activeStageId=null;activePosId=null;saveDB();switchTab('home');showToast(tName(curObj()));}
function scrollCarouselTo(i){const c=document.getElementById('projCarousel');if(!c)return;const cards=c.querySelectorAll('.proj-carousel-card');if(cards[i])cards[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});}
let _stackIdx=0;
function initStack(){
  const stack=document.getElementById('projStack');
  if(!stack)return;
  const cards=[...stack.querySelectorAll('.proj-stack-card')];
  const M=cards.length;
  if(!M)return;
  _stackIdx=Math.max(0,cards.findIndex(c=>String(c.dataset.objId)===String(db.activeObjectId)));
  requestAnimationFrame(()=>{
    const CARD_H=Math.max(...cards.map(c=>c.offsetHeight||0),200);
    // Все карточки одной высоты — без эффекта лесенки при свайпе
    cards.forEach(c=>c.style.minHeight=CARD_H+'px');
    const PEEK=0;
    stack.style.height=CARD_H+'px';
    positionStack(cards,_stackIdx,PEEK,CARD_H,M);
    // Точки-индикаторы под карточкой
    const dots=document.getElementById('projDots');
    if(dots&&M>1){
      dots.style.cssText='display:flex;justify-content:center;gap:6px;padding:8px 0 2px';
      // Создаём точки один раз, потом только обновляем
      if(dots.children.length!==M){
        dots.innerHTML=cards.map((_,i)=>`<div data-dot="${i}" style="width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.2);transition:width .3s ease,background .3s ease"></div>`).join('');
      }
      updateDots(_stackIdx);
    } else if(dots){dots.style.display='none';}
    // Лонг-тап на активной карточке → редактировать проект
    let _lpT=null;
    stack.addEventListener('touchstart',e=>{
      const idx=_stackIdx;
      _lpT=setTimeout(()=>{
        _lpT=null;
        if(navigator.vibrate)navigator.vibrate(40);
        const obj=db.objects[idx];
        const ac=cards[idx];
        if(ac){ac.style.transition='transform .25s cubic-bezier(.34,1.4,.64,1)';ac.style.transform='scale(1)';}
        if(obj)editObjectPrompt(obj.id);
      },600);
      // Запускаем scale после того как свайп-хендлер поставил transition:none
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(_lpT===null)return; // уже отменён
        const ac=cards[idx];
        if(ac){ac.style.transition='transform .6s ease';ac.style.transform='scale(0.96)';}
      }));
    },{passive:true});
    stack.addEventListener('touchend',()=>{
      clearTimeout(_lpT);_lpT=null;
      const ac=cards[_stackIdx];
      if(ac){ac.style.transition='transform .3s cubic-bezier(.34,1.4,.64,1)';ac.style.transform='scale(1)';}
    },{passive:true});
    stack.addEventListener('touchmove',()=>{
      clearTimeout(_lpT);_lpT=null;
      const ac=cards[_stackIdx];
      if(ac){ac.style.transition='none';ac.style.transform='scale(1)';}
    },{passive:true});
    // Горизонтальный свайп
    let tx0=0,ty0=0,swiping=false,hSwipe=false,_swipeDir=0;
    stack.addEventListener('touchstart',e=>{
      tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;
      swiping=true;hSwipe=false;_swipeDir=0;
      const ac=cards[_stackIdx];if(ac)ac.style.transition='none';
    },{passive:true});
    stack.addEventListener('touchmove',e=>{
      if(!swiping)return;
      const dx=e.touches[0].clientX-tx0,dy=e.touches[0].clientY-ty0;
      if(!hSwipe){
        if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
        hSwipe=Math.abs(dx)>Math.abs(dy);
        if(!hSwipe){swiping=false;return;}
      }
      const ac=cards[_stackIdx];if(!ac)return;
      const dir=dx<0?1:-1;
      // При первом определении направления — ставим нужную карточку за активной
      if(_swipeDir!==dir){
        _swipeDir=dir;
        const oldNi=Math.max(0,Math.min(M-1,_stackIdx-dir));
        if(oldNi!==_stackIdx){
          const oc=cards[oldNi];
          oc.style.transition='none';oc.style.top='-9999px';oc.style.opacity='0';
        }
        const ni=Math.max(0,Math.min(M-1,_stackIdx+dir));
        if(ni!==_stackIdx){
          const nc=cards[ni];
          nc.style.transition='none';
          nc.style.transformOrigin='top center';
          nc.style.top='8px';
          nc.style.transform='scale(0.92)';
          nc.style.opacity='1';
          nc.style.zIndex='5';
        }
      }
      const pct=Math.min(Math.abs(dx)/200,1);
      ac.style.transform=`translateX(${dx}px)`;
      const ni=Math.max(0,Math.min(M-1,_stackIdx+dir));
      if(ni!==_stackIdx){
        const nc=cards[ni];
        nc.style.transition='none';
        nc.style.top=`${8*(1-pct)}px`;
        nc.style.transform=`scale(${0.92+0.08*pct})`;
      }
      // Данные под карусельи плавно исчезают вместе со свайпом
      const dbSwipe=document.getElementById('dashBottom');
      if(dbSwipe&&ni!==_stackIdx){dbSwipe.style.transition='none';dbSwipe.style.opacity=String(Math.max(0,1-pct*1.2));}
    },{passive:true});
    stack.addEventListener('touchend',e=>{
      if(!swiping)return;swiping=false;
      const dx=e.changedTouches[0].clientX-tx0;
      const ac=cards[_stackIdx];if(!ac)return;
      if(hSwipe&&Math.abs(dx)>70){
        const dir=dx<0?1:-1;
        const newIdx=Math.max(0,Math.min(M-1,_stackIdx+dir));
        if(newIdx!==_stackIdx){
          const nc=cards[newIdx];
          // Активная уезжает влево/вправо
          ac.style.transition='transform .35s cubic-bezier(.4,0,.6,1),opacity .25s';
          ac.style.transform=`translateX(${-dir*110}vw)`;
          ac.style.opacity='0';
          // Следующая плавно занимает место (без bounce)
          nc.style.transition='transform .32s ease-out,top .32s ease-out,opacity .25s ease';
          nc.style.transformOrigin='top center';
          nc.style.top=PEEK+'px';
          nc.style.transform='scale(1)';
          nc.style.opacity='1';
          nc.style.zIndex='10';
          updateDots(newIdx);
          setTimeout(()=>stackGoTo(newIdx,cards,PEEK,CARD_H,M),340);
          return;
        }
      }
      // Отмена — возврат карточки и данных
      ac.style.transition='transform .3s ease-out';
      ac.style.transform='scale(1)';
      const dbCancel=document.getElementById('dashBottom');
      if(dbCancel){dbCancel.style.transition='opacity .3s ease';dbCancel.style.opacity='1';setTimeout(()=>{dbCancel.style.transition='';},320);}
      const dir2=dx<0?1:-1;
      const ni=Math.max(0,Math.min(M-1,_stackIdx+dir2));
      if(ni!==_stackIdx){
        const nc=cards[ni];
        nc.style.transition='transform .3s ease-out,top .3s ease-out';
        nc.style.top='8px';nc.style.transform='scale(0.92)';nc.style.opacity='1';
      }
    },{passive:true});
  });
}
function positionStack(cards,activeIdx,PEEK,CARD_H,M){
  cards.forEach((card,i)=>{
    const depth=(i-activeIdx+M)%M;
    card.style.transition='none';
    if(depth===0){
      // Активная — спереди, полный размер
      card.style.top=PEEK+'px';
      card.style.transformOrigin='top center';
      card.style.transform='scale(1)';
      card.style.opacity='1';
      card.style.zIndex='10';
      card.style.boxShadow='0 8px 32px rgba(0,0,0,.4)';
      card.classList.add('stack-active');
    } else if(depth===1){
      card.style.top='8px';
      card.style.transform='scale(0.92)';
      card.style.transformOrigin='top center';
      card.style.opacity='1';
      card.style.zIndex='5';
      card.style.boxShadow='none';
      card.classList.remove('stack-active');
    } else {
      // Остальные — скрыты
      card.style.top='-9999px';
      card.style.opacity='0';
      card.style.zIndex='1';
      card.classList.remove('stack-active');
    }
  });
}
function updateDots(activeIdx){
  const dots=document.getElementById('projDots');
  if(!dots)return;
  dots.querySelectorAll('[data-dot]').forEach(el=>{
    const i=parseInt(el.dataset.dot);
    el.style.width=i===activeIdx?'16px':'6px';
    el.style.background=i===activeIdx?'var(--gold)':'rgba(255,255,255,.2)';
  });
}
function stackGoTo(idx,cards,PEEK,CARD_H,M){
  const prevIdx=_stackIdx;
  _stackIdx=idx;
  // Обновляем высоту стека под новую активную карточку
  const stack=document.getElementById('projStack');
  const newH=cards[idx]?.offsetHeight||CARD_H;
  if(stack)stack.style.height=newH+'px';
  positionStack(cards,idx,PEEK,CARD_H,M);
  updateDots(idx);
  // Старая карточка теперь позади — прячем мгновенно, потом плавно появляется
  const prevCard=prevIdx!==idx?cards[prevIdx]:null;
  if(prevCard){
    prevCard.style.transition='none';
    prevCard.style.opacity='0';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      prevCard.style.transition='opacity .5s ease';
      prevCard.style.opacity='1';
      setTimeout(()=>{prevCard.style.transition='';prevCard.style.opacity='';},540);
    }));
  }
  const obj=db.objects[idx];
  if(obj&&obj.id!==db.activeObjectId){
    db.activeObjectId=obj.id;
    saveDB();
    // Данные уже исчезли во время свайпа — рендерим невидимо, потом плавно появляемся
    renderDashBottom();
    const dbEl=document.getElementById('dashBottom');
    if(dbEl){
      dbEl.style.transition='none';
      dbEl.style.opacity='0';
      dbEl.style.transform='translateY(10px)';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        dbEl.style.transition='opacity .4s ease,transform .45s cubic-bezier(.34,1.1,.64,1)';
        dbEl.style.opacity='1';
        dbEl.style.transform='translateY(0)';
        setTimeout(()=>{dbEl.style.cssText='';},460);
      }));
    }
  }
}
function initCarouselDots(){initStack();}
function scrollCarouselTo(){}
function _objPhotoBlock(existingPhoto){
  return`<div class="form-group">
    <label class="form-label">${l3('Фото объекта','Layihə fotosu','Project photo')}</label>
    <div style="display:flex;align-items:center;gap:12px">
      <div onclick="document.getElementById('objPhotoInput').click()" style="width:72px;height:72px;border-radius:16px;border:2px dashed var(--border2);overflow:hidden;cursor:pointer;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center">
        <input type="file" id="objPhotoInput" accept="image/*" style="display:none" onchange="onObjPhotoChange(this)">
        <img id="objPhotoPrev" src="${existingPhoto||''}" style="display:${existingPhoto?'block':'none'};width:100%;height:100%;object-fit:cover;position:absolute;inset:0">
        <div id="objPhotoPlaceholder" style="display:${existingPhoto?'none':'flex'};flex-direction:column;align-items:center;gap:3px;pointer-events:none">
          <i class="ph ph-camera" style="font-size:26px;color:var(--text3)"></i>
          <span style="font-size:9px;color:var(--text3)">${l3('Фото','Foto','Photo')}</span>
        </div>
      </div>
      <div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:6px">${l3('Нажмите чтобы добавить фото','Foto əlavə edin','Tap to add photo')}</div>
        <button id="objPhotoRemove" onclick="clearObjPhoto()" style="display:${existingPhoto?'inline-flex':'none'};align-items:center;gap:5px;background:rgba(204,123,123,.1);border:none;border-radius:8px;padding:5px 10px;font-size:12px;color:var(--red);cursor:pointer;font-family:Mulish,sans-serif"><i class="ph ph-trash"></i> ${l3('Удалить','Sil','Remove')}</button>
      </div>
    </div>
  </div>`;
}
function addObjectPrompt(){window._objfd={icon:'🏠',photo:null};showModal(`<div class="modal-handle"></div><div class="modal-title">${t('newObj')}</div>${_objPhotoBlock(null)}<div class="form-group"><label class="form-label">${t('objName')}</label><input type="text" id="oName" placeholder="${t('objNamePh')}"/></div><div class="form-group"><label class="form-label">${t('objBudget')}</label><input type="number" id="oBudget" placeholder="200000"/></div><div class="form-group" id="objIconSection"><label class="form-label">${t('objIcon')}</label><div class="icon-grid">${OBJ_ICONS.map(ic=>`<div class="icon-opt ${ic==='🏠'?'sel':''}" onclick="selObjIcon('${ic}')">${ic}</div>`).join('')}</div></div><div style="display:flex;gap:10px;margin-top:4px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="createObject()">${t('create')}</button></div>`);}
function editObjectPrompt(id){const o=db.objects.find(x=>x.id===id);if(!o)return;window._objfd={id,icon:o.icon,photo:o.photo||null};showModal(`<div class="modal-handle"></div><div class="modal-title">${t('editObj')}</div>${_objPhotoBlock(o.photo||null)}<div class="form-group"><label class="form-label">${t('objName')}</label><input type="text" id="oName" value="${tName(o).replace(/"/g,'&quot;')}"/></div><div class="form-group"><label class="form-label">${t('objBudget')}</label><input type="number" id="oBudget" value="${o.totalBudget||''}"/></div><div class="form-group" id="objIconSection" style="${o.photo?'display:none':''}"><label class="form-label">${t('objIcon')}</label><div class="icon-grid">${OBJ_ICONS.map(ic=>`<div class="icon-opt ${ic===o.icon?'sel':''}" onclick="selObjIcon('${ic}')">${ic}</div>`).join('')}</div></div><div style="display:flex;gap:10px;margin-top:4px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger btn-sm" onclick="deleteObjectConfirm('${id}')" >${t('delete')}</button><button class="btn btn-primary" style="flex:1" onclick="saveObject()">${t('save')}</button></div>`);}
function selObjIcon(ic){window._objfd.icon=ic;document.querySelectorAll('.icon-opt').forEach(el=>el.classList.toggle('sel',el.textContent===ic));}
function _compressPhoto(file,cb){
  const r=new FileReader();
  r.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      let w=img.width,h=img.height,mx=800;
      if(w>mx){h=Math.round(h*mx/w);w=mx;}
      if(h>mx){w=Math.round(w*mx/h);h=mx;}
      const c=document.createElement('canvas');c.width=w;c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      cb(c.toDataURL('image/jpeg',.72));
    };
    img.src=e.target.result;
  };
  r.readAsDataURL(file);
}
function onObjPhotoChange(el){
  const file=el.files[0];if(!file)return;
  _compressPhoto(file,b64=>{
    window._objfd.photo=b64;
    const prev=document.getElementById('objPhotoPrev');
    if(prev){prev.src=b64;prev.style.display='block';}
    document.getElementById('objPhotoPlaceholder').style.display='none';
    document.getElementById('objPhotoRemove').style.display='inline-flex';
    document.getElementById('objIconSection').style.display='none';
  });
}
function clearObjPhoto(){
  window._objfd.photo=null;
  const prev=document.getElementById('objPhotoPrev');
  if(prev){prev.src='';prev.style.display='none';}
  document.getElementById('objPhotoPlaceholder').style.display='flex';
  document.getElementById('objPhotoRemove').style.display='none';
  document.getElementById('objIconSection').style.display='';
}
function createObject(){const name=document.getElementById('oName')?.value.trim();const budget=parseInt(document.getElementById('oBudget')?.value)||0;if(!name){showToast(t('enterName'),'err');return;}const id=newId();db.objects.push({id,name,icon:window._objfd.icon||'🏠',photo:window._objfd.photo||null,totalBudget:budget,stages:[]});db.activeObjectId=id;saveDB();closeModal();switchTab('home');setTimeout(initCarouselDots,150);showToast(t('objCreated'));}
function saveObject(){const name=document.getElementById('oName')?.value.trim();const budget=parseInt(document.getElementById('oBudget')?.value)||0;if(!name){showToast(t('enterName'),'err');return;}const id=window._objfd.id;db.objects=db.objects.map(o=>o.id===id?{...o,name,icon:window._objfd.icon||o.icon,photo:'photo' in window._objfd?window._objfd.photo:o.photo,totalBudget:budget}:o);saveDB();closeModal();renderDash();showToast(t('objUpdated'));}
function deleteObjectConfirm(id){showModal(`<div class="modal-handle"></div><div class="modal-title">${t('deleteObj')}?</div><p style="color:var(--text2);font-size:14px;margin-bottom:20px">${t('deleteObjConfirm')}</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" style="flex:1" onclick="deleteObject('${id}')">${t('delete')}</button></div>`);}
function deleteObject(id){if(db.objects.length<=1){showToast(t('cantDeleteLast'),'err');closeModal();return;}db.objects=db.objects.filter(o=>o.id!==id);db.activeObjectId=db.objects[0].id;saveDB();closeModal();['pageDetail','pagePos'].forEach(pg=>document.getElementById(pg).classList.add('page-hidden-right'));renderDash();showToast(t('objDeleted'));}
