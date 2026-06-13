let _calcMode='concrete',_tilePre=0.36,_brickThick=0.25,_shellThick=0.19,_screedThick=5,_plasterKg=10,_roofAngle=30,_concMark=200,_insulSheet=0.5,_rebarSp=15,_rebarD=10,_laminWaste=5,_paintLM=0.12,_paintCoats=2,_foundW=0.4,_foundD=0.8,_hFType='lenta',_hFW=0.4,_hFD=0.8,_hFThick=0.20,_hFloors=1,_hWallMat='gb',_hWallH=3.0,_hSlabThick=0.20,_hRoofAngle=30,_hPlasterType='cement',_hPlasterThick=15,_hRebarDiam=12,_aFloorMat='screed',_aCeilType='paint',_aWallFinish='paint',_aScreedTh=5,_aRoomH=2.7,_aTileWst=10,_aLamWst=5,_aAPlType='gyps',_aAPlTh=10,_aWPCoats=2,_aCeilCoats=2;
const _rebarKgM={10:0.617,12:0.888,14:1.210};
const _hPriceDef={concrete:90,rebar:0.9,block:120,roof:15,plaster:14};
let _hCalcData={},_aCalcData={};
// ── Запоминание ввода калькулятора «по дому» ──
const _HCALC_KEY='isapp_housecalc';
let _hcInputs={L:0,W:0,prices:{}};
function _houseCalcSave(){
  try{
    const g=id=>document.getElementById(id);
    _hcInputs={L:parseFloat(g('calcL')?.value)||0,W:parseFloat(g('calcW')?.value)||0,prices:{}};
    localStorage.setItem(_HCALC_KEY,JSON.stringify({L:_hcInputs.L,W:_hcInputs.W,floors:_hFloors,fType:_hFType,fW:_hFW,fD:_hFD,fThick:_hFThick,wallMat:_hWallMat,wallH:_hWallH,slabThick:_hSlabThick,roof:_hRoofAngle,plType:_hPlasterType,plThick:_hPlasterThick,rebarD:_hRebarDiam}));
  }catch(e){}
}
function _houseCalcRestore(){
  try{
    const s=JSON.parse(localStorage.getItem(_HCALC_KEY)||'null');
    if(!s)return null;
    if(s.floors!=null)_hFloors=s.floors;
    if(s.fType)_hFType=s.fType;
    if(s.fW!=null)_hFW=s.fW;
    if(s.fD!=null)_hFD=s.fD;
    if(s.fThick!=null)_hFThick=s.fThick;
    if(s.wallMat)_hWallMat=s.wallMat;
    if(s.wallH!=null)_hWallH=s.wallH;
    if(s.slabThick!=null)_hSlabThick=s.slabThick;
    if(s.roof!=null)_hRoofAngle=s.roof;
    if(s.plType)_hPlasterType=s.plType;
    if(s.plThick!=null)_hPlasterThick=s.plThick;
    if(s.rebarD!=null)_hRebarDiam=s.rebarD;
    _hcInputs={L:s.L||0,W:s.W||0,prices:s.prices||{}};
    return s;
  }catch(e){return null;}
}
function _houseRestoreInputs(){
  const g=id=>document.getElementById(id);
  if(g('calcL')&&_hcInputs.L)g('calcL').value=_hcInputs.L;
  if(g('calcW')&&_hcInputs.W)g('calcW').value=_hcInputs.W;
}
function createStagesFromCalc(){
  const o=curObj();if(!o)return;
  const d=_hCalcData;
  const hasStages=(o.stages||[]).length>0;
  const proceed=()=>{
    const stages=[];
    const mk=(name,icon,color,posName,works,mats)=>({id:newId(),name,icon,color,status:'idle',positions:[{id:newId(),name:posName,status:'idle',works:(works||[]).map(w=>({id:newId(),contractAmount:0,paid:0,contractor:'',phone:'',startDate:'',endDate:'',note:lang==='ru'?'Укажите цену и подрядчика':'Set price & contractor',done:false,paymentHistory:[],...w})),mats:mats.map(m=>({id:newId(),...m}))}],endDate:'',note:''});
    if(d.found?.fVol>0){
      stages.push(mk(lang==='ru'?'Фундамент':'Foundation','⛏️','#CC7B7B',lang==='ru'?'Бетонирование':'Concreting',[{name:lang==='ru'?'Заливка фундамента':'Foundation works'}],[
        {name:lang==='ru'?'Бетон М200 (товарный)':'Concrete M200',qty:+d.found.fVol.toFixed(2),unit:'м³',price:d.found.pConc,note:''},
        {name:'Арматура Ø'+d.found.diam,qty:d.found.fRebarKg,unit:'кг',price:d.found.pReb,note:d.found.kgM+'кг/м'}
      ]));
    }
    if(d.walls?.nBlocks>0){
      const isGb=d.walls.wallMatName==='Газоблок';
      stages.push(mk(lang==='ru'?'Стены':'Walls','🧱','#C9AA7C',lang==='ru'?('Кладка — '+d.walls.wallMatName):('Laying — '+d.walls.wallMatName),[{name:lang==='ru'?'Кладка стен':'Wall laying'}],[
        {name:d.walls.wallMatName,qty:isGb?(d.walls.wallVol||0):d.walls.nBlocks,unit:isGb?'м³':(lang==='ru'?'шт':'pcs'),price:d.walls.pBlk,note:isGb?(d.walls.nBlocks+' шт'):''}
      ]));
    }
    if(d.slab?.slabVol>0){
      stages.push(mk(lang==='ru'?'Перекрытие':'Floor slab','🏗️','#7BB8CC',lang==='ru'?'Монолитное перекрытие':'Monolithic slab',[{name:lang==='ru'?'Заливка перекрытия':'Slab works'}],[
        {name:lang==='ru'?'Бетон М200 (товарный)':'Concrete M200',qty:+d.slab.slabVol.toFixed(2),unit:'м³',price:d.slab.pConcS||90,note:''},
        {name:'Арматура Ø'+d.slab.diam,qty:Math.round(d.slab.slabRebar*d.slab.kgMS),unit:'кг',price:d.slab.pRebS||0.9,note:d.slab.kgMS+'кг/м'}
      ]));
    }
    if(d.roof?.roofArea>0){
      stages.push(mk(lang==='ru'?'Кровля':'Roof','🏠','#80C89A',lang==='ru'?'Кровельные работы':'Roofing',[{name:lang==='ru'?'Монтаж кровли':'Roof installation'}],[
        {name:lang==='ru'?'Кровельный материал':'Roofing material',qty:d.roof.roofArea,unit:'м²',price:d.roof.pRoof,note:''}
      ]));
    }
    if(d.plaster?.bags>0){
      stages.push(mk(lang==='ru'?'Штукатурка':'Plaster','🖌️','#9B8EC4',lang==='ru'?'Наружная штукатурка':'Exterior plaster',[{name:lang==='ru'?'Оштукатуривание':'Plastering'}],[
        {name:d.plaster.typeLabel,qty:d.plaster.bags,unit:lang==='ru'?'меш':'bags',price:d.plaster.pPlaster,note:d.plaster.bagKg+'кг/меш'}
      ]));
    }
    if(!stages.length){showToast(lang==='ru'?'Введите размеры дома':'Enter house dimensions','err');return;}
    o.stages=[...(o.stages||[]),...stages];
    saveDB();
    closeModal();
    switchTab('home');
    setTimeout(()=>{renderDash();setTimeout(initCarouselDots,150);},50);
    showToast(lang==='ru'?`Создано ${stages.length} этапов`:`Created ${stages.length} stages`);
  };
  if(hasStages){
    showModal(`<div class="modal-handle"></div><div class="modal-title">${lang==='ru'?'Добавить этапы?':'Add stages?'}</div><p style="color:var(--text2);font-size:14px;margin-bottom:20px">${lang==='ru'?'В проекте уже есть этапы. Новые этапы будут добавлены в конец.':'Project already has stages. New stages will be appended.'}</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${lang==='ru'?'Отмена':'Cancel'}</button><button class="btn btn-primary" style="flex:1" onclick="(${proceed.toString()})()">${lang==='ru'?'Добавить':'Add'}</button></div>`);
  }else{proceed();}
}
function createApartStages(){
  const o=curObj();if(!o)return;
  if((o.stages||[]).length>0){showModal(`<div class="modal-handle"></div><div class="modal-title">${lang==='ru'?'Добавить этапы?':'Add stages?'}</div><p style="color:var(--text2);font-size:14px;margin-bottom:20px">${lang==='ru'?'В проекте уже есть этапы. Новые будут добавлены в конец.':'Project already has stages. New ones will be appended.'}</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${lang==='ru'?'Отмена':'Cancel'}</button><button class="btn btn-primary" style="flex:1" onclick="confirmApartStages()">${lang==='ru'?'Добавить':'Add'}</button></div>`);return;}
  _applyApartStages(o);
}
function confirmApartStages(){const o=curObj();if(o)_applyApartStages(o);}
function _applyApartStages(o){
  const d=_aCalcData,pbA=getPrices();
  const stages=[];
  const mk=(name,icon,color,posName,mats)=>({id:newId(),name,icon,color,status:'idle',positions:[{id:newId(),name:posName,status:'idle',works:[{id:newId(),name:lang==='ru'?'Работы (укажите подрядчика)':'Works (set contractor)',contractAmount:0,paid:0,contractor:'',phone:'',startDate:'',endDate:'',note:'',done:false,paymentHistory:[]}],mats:mats.map(m=>({id:newId(),...m}))}],endDate:'',note:''});
  if(d.floorAgg&&d.floorAgg.length)stages.push(mk(lang==='ru'?'Пол':'Floor','🪨','#7BB8CC',lang==='ru'?'Покрытие пола':'Flooring',d.floorAgg.map(m=>({name:m.n,qty:+m.q.toFixed(1),unit:m.u,price:pbA[m.k]||0,note:''}))));
  if(d.walls)stages.push(mk(lang==='ru'?'Отделка стен':'Wall finishing','🖌️','#9B8EC4',lang==='ru'?'Штукатурка и финиш':'Plaster & finish',[{name:d.walls.plLabel||(lang==='ru'?'Штукатурка':'Plaster'),qty:d.walls.bags,unit:lang==='ru'?'мешок':'bags',price:pbA[_aAPlType==='gyps'?'plasterGyps':'plasterCem']||0,note:(d.walls.wallArea||'')+'м²'}]));
  if(d.ceil&&d.ceil.type==='paint')stages.push(mk(lang==='ru'?'Отделка потолка':'Ceiling finishing','✨','#CC7B7B',lang==='ru'?'Покраска потолка':'Ceiling painting',[{name:lang==='ru'?'Краска (потолок)':'Ceiling paint',qty:d.ceil.liters,unit:'л',price:pbA.paint||0,note:''}]));
  if(!stages.length){showToast(lang==='ru'?'Введите размеры комнат':'Enter room sizes','err');return;}
  (o.stages=o.stages||[]).push(...stages);
  saveDB();closeModal();
  setTimeout(()=>{renderDash();setTimeout(initCarouselDots,150);},50);
  showToast(lang==='ru'?`Создано ${stages.length} этапов`:`Created ${stages.length} stages`);
}
// ── Шаблоны проектов: быстрый старт без калькулятора ──
// Общий блок отделки — одинаков для стройки и ремонта (DRY)
const _TPL_FINISH=[
  {ru:'Черновые работы',az:'Kobud işlər',en:'Rough works',icon:'🔧',color:'#7BB8CC',pos:[['Электрика','Elektrik','Electrical'],['Сантехника','Santexnika','Plumbing'],['Перегородки','Arakəsmələr','Partitions']]},
  {ru:'Стяжка пола',az:'Döşəmə qaralaması',en:'Floor screed',icon:'🪨',color:'#B8A99C',pos:[['Заливка стяжки','Qaralama','Screed pouring']]},
  {ru:'Штукатурка стен',az:'Divar suvağı',en:'Wall plaster',icon:'🖌️',color:'#9B8EC4',pos:[['Оштукатуривание','Suvaq','Plastering']]},
  {ru:'Плитка',az:'Kafel',en:'Tiling',icon:'🟫',color:'#C9AA7C',pos:[['Санузел','Sanitar qovşaq','Bathroom'],['Кухня','Mətbəx','Kitchen']]},
  {ru:'Чистовая отделка',az:'Tamamlama',en:'Finishing',icon:'✨',color:'#80C89A',pos:[['Напольное покрытие','Döşəmə örtüyü','Flooring'],['Покраска / обои','Boya / divar kağızı','Paint / wallpaper'],['Потолок','Tavan','Ceiling']]},
  {ru:'Установка',az:'Quraşdırma',en:'Installation',icon:'🚪',color:'#7BB8CC',pos:[['Двери','Qapılar','Doors'],['Сантехника','Santexnika','Fixtures'],['Электрофурнитура','Elektrik avadanlığı','Switches & sockets']]},
];
// Стройка = коробка + отделка; Ремонт = демонтаж + та же отделка
const PROJECT_TEMPLATES={
  build:{stages:[
    {ru:'Фундамент',az:'Özül',en:'Foundation',icon:'⛏️',color:'#CC7B7B',pos:[['Бетонирование','Betonlama','Concreting']]},
    {ru:'Стены',az:'Divarlar',en:'Walls',icon:'🧱',color:'#C9AA7C',pos:[['Кладка стен','Hörgü','Wall laying']]},
    {ru:'Перекрытие',az:'Örtük',en:'Floor slab',icon:'🏗️',color:'#7BB8CC',pos:[['Монолитное перекрытие','Monolit örtük','Monolithic slab']]},
    {ru:'Кровля',az:'Dam',en:'Roof',icon:'🏠',color:'#80C89A',pos:[['Монтаж кровли','Dam montajı','Roof installation']]},
    ..._TPL_FINISH,
  ]},
  repair:{stages:[
    {ru:'Демонтаж',az:'Sökülmə',en:'Demolition',icon:'🔨',color:'#CC7B7B',pos:[['Снос старого','Köhnənin sökülməsi','Strip-out']]},
    ..._TPL_FINISH,
  ]},
};
function _seedLbl(a){return lang==='ru'?a[0]:(lang==='az'?(a[1]||a[2]):a[2]);}
function _applySeed(o,tpl){
  const stages=tpl.stages.map(s=>({
    id:newId(),name:_seedLbl([s.ru,s.az,s.en]),icon:s.icon,color:s.color,status:'idle',endDate:'',note:'',
    positions:s.pos.map(p=>({id:newId(),name:_seedLbl(p),status:'idle',
      works:[{id:newId(),name:lang==='ru'?'Работы (укажите подрядчика)':'Works (set contractor)',contractAmount:0,paid:0,contractor:'',phone:'',startDate:'',endDate:'',note:'',done:false,paymentHistory:[]}],
      mats:[]}))
  }));
  o.stages=[...(o.stages||[]),...stages];
  saveDB();closeModal();switchTab('home');
  setTimeout(()=>{renderDash();setTimeout(initCarouselDots,150);},50);
  showToast(lang==='ru'?`Создано ${stages.length} этапов`:`Created ${stages.length} stages`);
}
function seedTemplate(kind){
  const o=curObj();if(!o)return;
  const tpl=PROJECT_TEMPLATES[kind];if(!tpl)return;
  if((o.stages||[]).length>0){
    window._seedKind=kind;
    showModal(`<div class="modal-handle"></div><div class="modal-title">${lang==='ru'?'Добавить этапы?':'Add stages?'}</div><p style="color:var(--text2);font-size:14px;margin-bottom:20px">${lang==='ru'?'В проекте уже есть этапы. Этапы шаблона добавятся в конец.':'Project already has stages. Template stages will be appended.'}</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" onclick="closeModal()">${lang==='ru'?'Отмена':'Cancel'}</button><button class="btn btn-primary" style="flex:1" onclick="confirmSeedTemplate()">${lang==='ru'?'Добавить':'Add'}</button></div>`);
    return;
  }
  _applySeed(o,tpl);
}
function confirmSeedTemplate(){const o=curObj();const tpl=PROJECT_TEMPLATES[window._seedKind];if(o&&tpl)_applySeed(o,tpl);}
// ── Комнатная модель «По квартире»: пол = система (финиш + основание) ──
// Каждый тип пола тянет свои материалы. Список расширяемый (кварцвинил/линолеум/паркет — добавятся сюда).
// Строка материала: [ключ_цены, ru, az, en, кол-во(area), ед.]
let _aRooms=[];
const FLOOR_SYSTEMS={
  ceramic:{ru:'Керамогранит',az:'Keramoqranit',en:'Porcelain',mats:a=>[
    ['screed','Стяжка ЦПС','Qaralama','Screed',Math.ceil(a*2.25),'мешок'],
    ['tileAdh','Плиточный клей','Plitə yapışqanı','Tile glue',Math.ceil(a*0.18),'мешок'],
    ['grout','Затирка','Dərz','Grout',Math.ceil(a*0.5),'кг'],
    ['tile','Керамогранит','Keramoqranit','Porcelain',+(a*1.1).toFixed(1),'м²']]},
  laminate:{ru:'Ламинат',az:'Laminat',en:'Laminate',mats:a=>[
    ['screed','Стяжка (выравн.)','Qaralama','Levelling',Math.ceil(a*1.35),'мешок'],
    ['underlay','Подложка','Altlıq','Underlay',+a.toFixed(1),'м²'],
    ['laminat','Ламинат','Laminat','Laminate',+(a*1.07).toFixed(1),'м²']]},
  plank:{ru:'Доска по лагам',az:'Taxta (laglar)',en:'Plank/joists',mats:a=>[
    ['lag','Лаги (брус)','Laglar','Joists',Math.ceil(a*2),'м'],
    ['plywood','Чёрный пол (фанера)','Qara döşəmə','Subfloor',+a.toFixed(1),'м²'],
    ['plank','Доска','Taxta','Plank',+(a*1.07).toFixed(1),'м²'],
    ['lacquer','Лак','Lak','Lacquer',Math.ceil(a*0.25),'л']]},
  screed:{ru:'Стяжка',az:'Qaralama',en:'Screed (bare)',mats:a=>[
    ['screed','Стяжка ЦПС','Qaralama','Screed',Math.ceil(a*2.25),'мешок']]},
};
function _aEnsureRooms(){if(!_aRooms.length)_aRooms=[{id:newId(),name:(lang==='ru'?'Комната 1':lang==='az'?'Otaq 1':'Room 1'),L:0,W:0,floor:'ceramic'}];}
function _aAddRoom(){_aRooms.push({id:newId(),name:(lang==='ru'?'Комната ':lang==='az'?'Otaq ':'Room ')+(_aRooms.length+1),L:0,W:0,floor:'ceramic'});_aReRooms();}
function _aDelRoom(id){_aRooms=_aRooms.filter(r=>r.id!==id);_aEnsureRooms();_aReRooms();}
function _aRoomName(id,v){const r=_aRooms.find(x=>x.id===id);if(r)r.name=v;if(typeof calcUpdate==='function')calcUpdate();}
function _aRoomDim(id,k,v){const r=_aRooms.find(x=>x.id===id);if(r){r[k]=parseFloat(v)||0;if(typeof calcUpdate==='function')calcUpdate();}}
function _aRoomFloor(id,v){const r=_aRooms.find(x=>x.id===id);if(r)r.floor=v;if(typeof calcUpdate==='function')calcUpdate();}
function _aReRooms(){const el=document.getElementById('calcBody');if(el&&window.renderCalcContent){el.innerHTML=window.renderCalcContent();calcUpdate();}}
function showCalc(){
  _houseCalcRestore();
  const modes=[
    {id:'house',icon:'ph-house',ru:'Стройка',az:'Tikinti',en:'Construction'},
    {id:'apart',icon:'ph-buildings',ru:'Ремонт',az:'Təmir',en:'Renovation'},
    {id:'concrete',icon:'ph-cube',ru:'Бетон',az:'Beton',en:'Concrete'},
    {id:'gas_block',icon:'ph-squares-four',ru:'Газоблок',az:'Qazblok',en:'Gas block'},
    {id:'brick',icon:'ph-wall',ru:'Кирпич',az:'Kərpic',en:'Brick'},
    {id:'shell',icon:'',ru:'Ракушечник',az:'Daş',en:'Shell rock'},
    {id:'tile',icon:'ph-grid-four',ru:'Плитка',az:'Kafel',en:'Tile'},
    {id:'screed',icon:'ph-paint-roller',ru:'Стяжка',az:'Döşəmə',en:'Screed'},
    {id:'area',icon:'ph-frame-corners',ru:'Площадь',az:'Sahə',en:'Area'},
    {id:'plaster',icon:'',ru:'Штукатурка',az:'Suvaq',en:'Plaster'},
    {id:'roof',icon:'ph-house-simple',ru:'Кровля',az:'Dam',en:'Roof'},
    {id:'insul',icon:'ph-thermometer',ru:'Утеплитель',az:'İzolyasiya',en:'Insulation'},
    {id:'rebar',icon:'',ru:'Арматура',az:'Armatur',en:'Rebar'},
    {id:'lamin',icon:'ph-grid-nine',ru:'Ламинат',az:'Laminat',en:'Laminate'},
    {id:'paint',icon:'ph-paint-bucket',ru:'Краска',az:'Boya',en:'Paint'},
    {id:'found',icon:'',ru:'Фундамент',az:'Özül',en:'Foundation'},
  ];
  const inp=(id,lbl,ph,val)=>{
    const vAttr=val!==undefined?'value="'+val+'"':'';
    return '<div style="margin-bottom:12px"><label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:6px">'+lbl+'</label><input type="number" id="'+id+'" placeholder="'+(ph||'0')+'" '+vAttr+' oninput="calcUpdate()" style="-webkit-user-select:text;user-select:text"/></div>';
  };
  const hint=(txt)=>'<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3);margin-bottom:16px;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:10px"><i class="ph ph-info"></i> '+txt+'</div>';
  const openFld=()=>inp('calcO',lang==='ru'?'Проёмы — окна+двери (м²)':'Openings — windows+doors (m²)','0');
  const res='<div class="calc-result" id="calcResult"></div>';
  const prow=(lbl,list,cur,fn,tol)=>{tol=tol||0.01;return '<div style="margin-bottom:16px"><label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:8px">'+lbl+'</label><div style="display:flex;flex-wrap:wrap;gap:6px">'+list.map(p=>{const act=Math.abs(p.v-cur)<tol;return '<button id="pr'+fn+p.v+'" onclick="'+fn+'('+p.v+')" style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg2)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+p.l+'</button>';}).join('')+'</div></div>';};
  const renderCalcContent=()=>{
    const m=_calcMode;
    if(m==='concrete')return hint(lang==='ru'?'Объём = Длина × Ширина × Высота':'Volume = Length × Width × Height')+inp('calcL',lang==='ru'?'Длина (м)':'Length (m)')+inp('calcW',lang==='ru'?'Ширина (м)':'Width (m)')+inp('calcH',lang==='ru'?'Высота (м)':'Height (m)')+prow(lang==='ru'?'Марка бетона':'Concrete grade',[{l:'М150',v:150},{l:'М200',v:200},{l:'М300',v:300}],_concMark,'_concSel',1)+res;
    if(m==='gas_block')return hint(lang==='ru'?'Газоблок 600×300мм, клей ~1 мешок/15 м² · −10% на проёмы':'Gas block 600×300mm, glue ~1 bag/15m² · −10% openings')+inp('calcL',lang==='ru'?'Длина стены (м)':'Wall length (m)')+inp('calcH',lang==='ru'?'Высота стены (м)':'Wall height (m)')+res;
    if(m==='brick'){const bpList=[{l:lang==='ru'?'1 кирпич':'1 brick',t:0.25},{l:lang==='ru'?'2 кирпича':'2 bricks',t:0.51}];const bchips=bpList.map(p=>{const act=Math.abs(p.t-_brickThick)<0.01;return '<button id="bp_'+p.t+'" onclick="_brickSelect('+p.t+')" style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg2)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+p.l+'</button>';}).join('');return hint(lang==='ru'?'Кирпич 250×120×65 мм, шов 10 мм · −10% на проёмы':'Brick 250×120×65mm, joint 10mm · −10% openings')+inp('calcL',lang==='ru'?'Длина стены (м)':'Wall length (m)')+inp('calcH',lang==='ru'?'Высота стены (м)':'Wall height (m)')+'<div style="margin-bottom:16px"><label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:8px">'+(lang==='ru'?'Толщина кладки':'Wall thickness')+'</label><div style="display:flex;gap:8px">'+bchips+'</div></div>'+res;}
    if(m==='shell'){const spList=[{l:lang==='ru'?'1 блок (19см)':'1 block (19cm)',t:0.19},{l:lang==='ru'?'2 блока (38см)':'2 blocks (38cm)',t:0.38}];const schips=spList.map(p=>{const act=Math.abs(p.t-_shellThick)<0.01;return '<button id="sh_'+p.t+'" onclick="_shellSelect('+p.t+')" style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg2)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+p.l+'</button>';}).join('');return hint(lang==='ru'?'Ракушечник 390×190×190 мм, шов 10 мм · −10% на проёмы':'Shell rock 390×190×190mm, joint 10mm · −10% openings')+inp('calcL',lang==='ru'?'Длина стены (м)':'Wall length (m)')+inp('calcH',lang==='ru'?'Высота стены (м)':'Wall height (m)')+'<div style="margin-bottom:16px"><label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:8px">'+(lang==='ru'?'Толщина кладки':'Wall thickness')+'</label><div style="display:flex;gap:8px">'+schips+'</div></div>'+res;}
    if(m==='tile'){const tpList=[{l:'20×20',a:0.04},{l:'30×30',a:0.09},{l:'30×60',a:0.18},{l:'60×60',a:0.36},{l:'60×120',a:0.72}];const chips=tpList.map(p=>{const act=Math.abs(p.a-_tilePre)<0.001;return '<button id="tp_'+p.l.replace('×','x')+'" onclick="_tileSelect('+p.a+')" style="padding:8px 16px;border-radius:10px;font-size:13px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg2)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+p.l+'</button>';}).join('');return hint(lang==='ru'?'Порез +10% уже учтён в расчёте':'+10% cut waste already included')+inp('calcL',lang==='ru'?'Длина помещения (м)':'Room length (m)')+inp('calcW',lang==='ru'?'Ширина помещения (м)':'Room width (m)')+'<div style="margin-bottom:16px"><label style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:8px">'+(lang==='ru'?'Размер плитки':'Tile size')+'</label><div style="display:flex;flex-wrap:wrap;gap:6px">'+chips+'</div></div>'+res;}
    if(m==='screed')return hint(lang==='ru'?'ЦПС стяжка, расход ≈ 18 кг/м²/см':'Cement screed ≈ 18 kg/m²/cm')+inp('calcL',lang==='ru'?'Длина (м)':'Length (m)')+inp('calcW',lang==='ru'?'Ширина (м)':'Width (m)')+prow(lang==='ru'?'Толщина стяжки':'Screed thickness',[{l:'3 см',v:3},{l:'5 см',v:5},{l:'7 см',v:7},{l:'10 см',v:10}],_screedThick,'_screedSel',0.1)+res;
    if(m==='area')return hint(lang==='ru'?'Площадь прямоугольника':'Rectangle area')+inp('calcL',lang==='ru'?'Длина (м)':'Length (m)')+inp('calcW',lang==='ru'?'Ширина (м)':'Width (m)')+res;
    if(m==='plaster')return hint(lang==='ru'?'Расход штукатурки · −10% на проёмы':'Plaster consumption · −10% openings')+inp('calcL',lang==='ru'?'Длина стены (м)':'Wall length (m)')+inp('calcH',lang==='ru'?'Высота стены (м)':'Wall height (m)')+prow(lang==='ru'?'Толщина слоя':'Layer thickness',[{l:lang==='ru'?'Тонкий 8 кг':'Thin 8kg',v:8},{l:lang==='ru'?'Стандарт 10 кг':'Std 10kg',v:10},{l:lang==='ru'?'Толстый 15 кг':'Thick 15kg',v:15}],_plasterKg,'_plasterSel',0.1)+res;
    if(m==='roof')return hint(lang==='ru'?'Площадь кровли увеличивается с уклоном':'Roof area increases with slope')+inp('calcL',lang==='ru'?'Длина (м)':'Length (m)')+inp('calcW',lang==='ru'?'Ширина (м)':'Width (m)')+prow(lang==='ru'?'Уклон кровли':'Roof slope',[{l:'15°',v:15},{l:'20°',v:20},{l:'30°',v:30},{l:'45°',v:45}],_roofAngle,'_roofSel',0.1)+res;
    if(m==='insul')return hint(lang==='ru'?'Утеплитель, −10% на проёмы, +5% запас':'Insulation, −10% openings, +5% waste')+inp('calcL',lang==='ru'?'Длина стены (м)':'Wall length (m)')+inp('calcH',lang==='ru'?'Высота стены (м)':'Wall height (m)')+prow(lang==='ru'?'Размер листа':'Sheet size',[{l:'100×50 (0.5 м²)',v:0.5},{l:'100×60 (0.6 м²)',v:0.6},{l:'120×60 (0.72 м²)',v:0.72}],_insulSheet,'_insulSel',0.01)+res;
    if(m==='rebar')return hint(lang==='ru'?'Арматурная сетка, +10% нахлёст, стержень 11.7 м':'Rebar grid, +10% overlap, rod 11.7m')+inp('calcL',lang==='ru'?'Длина (м)':'Length (m)')+inp('calcW',lang==='ru'?'Ширина (м)':'Width (m)')+prow(lang==='ru'?'Шаг сетки':'Grid spacing',[{l:'10 см',v:10},{l:'15 см',v:15},{l:'20 см',v:20},{l:'25 см',v:25}],_rebarSp,'_rebarSpSel',0.1)+prow(lang==='ru'?'Диаметр':'Diameter',[{l:'Ø8',v:8},{l:'Ø10',v:10},{l:'Ø12',v:12}],_rebarD,'_rebarDSel',0.1)+res;
    if(m==='lamin')return hint(lang==='ru'?'Ламинат/паркет, ~2 м² в упаковке':'Laminate/parquet, ~2 m² per pack')+inp('calcL',lang==='ru'?'Длина комнаты (м)':'Room length (m)')+inp('calcW',lang==='ru'?'Ширина комнаты (м)':'Room width (m)')+prow(lang==='ru'?'Запас на подрезку':'Cut waste',[{l:lang==='ru'?'Прямо +5%':'+5%',v:5},{l:lang==='ru'?'Диагональ +10%':'+10%',v:10},{l:lang==='ru'?'Ёлочка +15%':'+15%',v:15}],_laminWaste,'_laminSel',0.1)+res;
    if(m==='paint')return hint(lang==='ru'?'Водоэмульсионная краска, −10% на проёмы':'Water-based paint, −10% openings')+inp('calcL',lang==='ru'?'Длина стены (м)':'Wall length (m)')+inp('calcH',lang==='ru'?'Высота стены (м)':'Wall height (m)')+prow(lang==='ru'?'Расход':'Consumption',[{l:'100 мл/м²',v:0.10},{l:'120 мл/м²',v:0.12},{l:'150 мл/м²',v:0.15}],_paintLM,'_paintLMSel',0.001)+prow(lang==='ru'?'Слоёв':'Coats',[{l:lang==='ru'?'1 слой':'1 coat',v:1},{l:lang==='ru'?'2 слоя':'2 coats',v:2}],_paintCoats,'_paintCSel',0.1)+res;
    if(m==='house'){
      const ftBtns=['lenta','plita'].map(t=>{const act=_hFType===t;const lbl=t==='lenta'?(lang==='ru'?'Лента':'Strip'):(lang==='ru'?'Плита':'Slab');return '<button id="hft_'+t+'" onclick="_hFTSel(\''+t+'\')" style="flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg3)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+lbl+'</button>';}).join('');
      const ftPr=_hFType==='lenta'?prow(lang==='ru'?'Ширина ленты':'Strip width',[{l:'30 см',v:0.3},{l:'40 см',v:0.4},{l:'50 см',v:0.5},{l:'60 см',v:0.6}],_hFW,'_hFWSel',0.01)+prow(lang==='ru'?'Глубина':'Depth',[{l:'60 см',v:0.6},{l:'80 см',v:0.8},{l:'100 см',v:1.0},{l:'120 см',v:1.2}],_hFD,'_hFDSel',0.01):prow(lang==='ru'?'Толщина плиты':'Slab thickness',[{l:'15 см',v:0.15},{l:'20 см',v:0.20},{l:'25 см',v:0.25},{l:'30 см',v:0.30}],_hFThick,'_hFThSel',0.01);
      const matBtns=[{id:'gb',ru:'Газоблок'},{id:'br',ru:'Кирпич'},{id:'sh',ru:'Ракушечник'}].map(x=>{const act=_hWallMat===x.id;return '<button id="hwm_'+x.id+'" onclick="_hWMatSel(\''+x.id+'\')" style="flex:1;padding:8px 4px;border-radius:10px;font-size:12px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg3)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+x.ru+'</button>';}).join('');
      const SC=(num,icon,title,body,rid)=>'<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><div style="width:26px;height:26px;border-radius:50%;background:rgba(201,170,124,.15);border:1px solid rgba(201,170,124,.35);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--gold);font-family:\'DM Mono\',monospace;flex-shrink:0">'+num+'</div><i class="ph '+icon+'" style="font-size:16px;color:var(--gold)"></i><span style="font-family:\'Unbounded\',sans-serif;font-size:12px;font-weight:700">'+title+'</span></div>'+body+'<div id="'+rid+'" style="margin-top:8px"></div></div>';
      return '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><i class="ph ph-house" style="font-size:18px;color:var(--gold)"></i><span style="font-family:\'Unbounded\',sans-serif;font-size:13px;font-weight:700">'+(lang==='ru'?'Размеры дома':'House dimensions')+'</span></div>'+inp('calcL',lang==='ru'?'Длина (м)':'Length (m)')+inp('calcW',lang==='ru'?'Ширина (м)':'Width (m)')+prow(lang==='ru'?'Этажность':'Floors',[{l:lang==='ru'?'1 этаж':'1 floor',v:1},{l:lang==='ru'?'2 этажа':'2 floors',v:2}],_hFloors,'_hFloorsSel',0.1)+'</div>'+
        SC('1','ph-arrow-fat-lines-down',lang==='ru'?'Фундамент':'Foundation','<div style="display:flex;gap:8px;margin-bottom:14px">'+ftBtns+'</div>'+ftPr+prow(lang==='ru'?'Диаметр арматуры':'Rebar diameter',[{l:'Ø10',v:10},{l:'Ø12',v:12},{l:'Ø14',v:14}],_hRebarDiam,'_hRDSel',0.1),'calcResult')+
        SC('2','ph-wall',lang==='ru'?'Стены':'Walls','<div style="display:flex;gap:6px;margin-bottom:14px">'+matBtns+'</div>'+prow(lang==='ru'?'Высота потолка':'Ceiling height',[{l:'2.8 м',v:2.8},{l:'3.0 м',v:3.0},{l:'3.2 м',v:3.2}],_hWallH,'_hWHSel',0.01),'calcResult2')+
        SC('3','ph-squares-four',lang==='ru'?'Перекрытие':'Floor slab',prow(lang==='ru'?'Толщина':'Thickness',[{l:'15 см',v:0.15},{l:'20 см',v:0.20},{l:'25 см',v:0.25}],_hSlabThick,'_hSlabThSel',0.01),'calcResult3')+
        SC('4','ph-house-simple',lang==='ru'?'Кровля':'Roof',prow(lang==='ru'?'Уклон':'Slope',[{l:'15°',v:15},{l:'20°',v:20},{l:'30°',v:30},{l:'45°',v:45}],_hRoofAngle,'_hRoofSel',0.1),'calcResult4')+
        SC('5','ph-paint-roller',lang==='ru'?'Штукатурка':'Plaster',(()=>{const ptBtns=[{id:'cement',ru:'Цементная',en:'Cement'},{id:'gyps',ru:'Гипсовая',en:'Gypsum'}].map(p=>{const act=_hPlasterType===p.id;return'<button id="hpt_'+p.id+'" onclick="_hPTypeSel(\''+p.id+'\')" style="flex:1;padding:10px;border-radius:10px;font-size:12px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg2)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+(lang==='ru'?p.ru:p.en)+'</button>';}).join('');return'<div style="display:flex;gap:8px;margin-bottom:14px">'+ptBtns+'</div>'+prow(lang==='ru'?'Толщина слоя':'Layer thickness',[{l:'10 мм',v:10},{l:'15 мм',v:15},{l:'20 мм',v:20}],_hPlasterThick,'_hPlThSel',0.1);})(),'calcResult5')+
        '<div id="calcResult6"></div>';
    }
    if(m==='found')return hint(lang==='ru'?'Ленточный фундамент, М200, арматура 4 прутка':'Strip foundation, M200, 4 rebar rods')+inp('calcL',lang==='ru'?'Периметр ленты (м)':'Strip perimeter (m)')+prow(lang==='ru'?'Ширина ленты':'Strip width',[{l:'30 см',v:0.3},{l:'40 см',v:0.4},{l:'50 см',v:0.5},{l:'60 см',v:0.6}],_foundW,'_foundWSel',0.01)+prow(lang==='ru'?'Глубина':'Depth',[{l:'50 см',v:0.5},{l:'80 см',v:0.8},{l:'100 см',v:1.0},{l:'120 см',v:1.2}],_foundD,'_foundDSel',0.01)+res;
    if(m==='apart'){
      const SC=(num,icon,title,body,rid)=>'<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><div style="width:26px;height:26px;border-radius:50%;background:rgba(201,170,124,.15);border:1px solid rgba(201,170,124,.35);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--gold);font-family:\'DM Mono\',monospace;flex-shrink:0">'+num+'</div><i class="ph '+icon+'" style="font-size:16px;color:var(--gold)"></i><span style="font-family:\'Unbounded\',sans-serif;font-size:12px;font-weight:700">'+title+'</span></div>'+body+'<div id="'+rid+'" style="margin-top:8px"></div></div>';
      const abtn=(id,label,cur,fn,grp)=>{const act=cur===id;return '<button id="'+grp+'_'+id+'" onclick="'+fn+'(\''+id+'\')" style="flex:1;padding:8px 4px;border-radius:10px;font-size:12px;font-weight:700;font-family:Mulish,sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg3)')+';color:'+(act?'var(--gold)':'var(--text2)')+';cursor:pointer">'+label+'</button>';};
      const ifs='background:var(--bg2);border:1px solid rgba(255,255,255,.1);color:var(--text);border-radius:9px;padding:9px 8px;font-family:Mulish,sans-serif;font-size:13px;outline:none;-webkit-user-select:text;user-select:text';
      const fkeys=Object.keys(FLOOR_SYSTEMS);
      const roomCards=_aRooms.map(r=>{
        const opts=fkeys.map(k=>'<option value="'+k+'"'+(r.floor===k?' selected':'')+'>'+_seedLbl([FLOOR_SYSTEMS[k].ru,FLOOR_SYSTEMS[k].az,FLOOR_SYSTEMS[k].en])+'</option>').join('');
        return '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:10px 11px;margin-bottom:8px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input value="'+(r.name||'')+'" oninput="_aRoomName(\''+r.id+'\',this.value)" placeholder="'+(lang==='ru'?'Комната':lang==='az'?'Otaq':'Room')+'" style="flex:1;'+ifs+'"/>'+(_aRooms.length>1?'<button onclick="_aDelRoom(\''+r.id+'\')" style="width:30px;height:30px;border-radius:8px;background:rgba(204,123,123,.1);border:1px solid rgba(204,123,123,.25);color:var(--red);cursor:pointer;flex-shrink:0;font-size:16px;line-height:1">×</button>':'')+'</div><div style="display:flex;gap:7px;align-items:center"><input type="number" value="'+(r.L||'')+'" oninput="_aRoomDim(\''+r.id+'\',\'L\',this.value)" placeholder="'+(lang==='ru'?'Д':'L')+'" style="width:56px;text-align:center;'+ifs+'"/><span style="color:var(--text3)">×</span><input type="number" value="'+(r.W||'')+'" oninput="_aRoomDim(\''+r.id+'\',\'W\',this.value)" placeholder="'+(lang==='ru'?'Ш':'W')+'" style="width:56px;text-align:center;'+ifs+'"/><select onchange="_aRoomFloor(\''+r.id+'\',this.value)" style="flex:1;-webkit-appearance:none;'+ifs+'">'+opts+'</select></div></div>';
      }).join('');
      const addBtn='<button onclick="_aAddRoom()" style="width:100%;padding:11px;border-radius:11px;border:1px dashed rgba(201,170,124,.4);background:none;color:var(--gold);font-family:Mulish,sans-serif;font-size:13px;font-weight:600;cursor:pointer">＋ '+(lang==='ru'?'Добавить комнату':lang==='az'?'Otaq əlavə et':'Add room')+'</button>';
      const roomsSection='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><i class="ph ph-squares-four" style="font-size:18px;color:var(--gold)"></i><span style="font-family:\'Unbounded\',sans-serif;font-size:13px;font-weight:700">'+(lang==='ru'?'Комнаты и полы':lang==='az'?'Otaqlar və döşəmə':'Rooms & floors')+'</span></div>'+roomCards+addBtn+'<div id="aResult" style="margin-top:12px"></div></div>';
      const plTypeBtns='<div style="display:flex;gap:6px;margin-bottom:14px">'+abtn('gyps',lang==='ru'?'Гипсовая':'Gypsum',_aAPlType,'_aPlTypeSel','apt')+abtn('cement',lang==='ru'?'Цементная':'Cement',_aAPlType,'_aPlTypeSel','apt')+'</div>';
      const wallFinBtns='<div style="display:flex;gap:6px;margin-top:10px;margin-bottom:0">'+abtn('paint',lang==='ru'?'Краска':'Paint',_aWallFinish,'_aWallFinSel','awf')+abtn('wallpaper',lang==='ru'?'Обои':'Wallpaper',_aWallFinish,'_aWallFinSel','awf')+'</div>';
      const ceilBtns='<div style="display:flex;gap:6px;margin-bottom:14px">'+abtn('paint',lang==='ru'?'Краска':'Paint',_aCeilType,'_aCeilTypeSel','act')+abtn('stretch',lang==='ru'?'Натяжной':'Stretch',_aCeilType,'_aCeilTypeSel','act')+'</div>';
      const hRow=prow(lang==='ru'?'Высота потолка':'Ceiling height',[{l:'2.5 м',v:2.5},{l:'2.7 м',v:2.7},{l:'3.0 м',v:3.0}],_aRoomH,'_aRoomHSel',0.01);
      const wallSec=hRow+plTypeBtns+prow(lang==='ru'?'Толщина слоя':'Layer thickness',[{l:'10 мм',v:10},{l:'15 мм',v:15},{l:'20 мм',v:20}],_aAPlTh,'_aAPlThSel',0.1)+'<div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px">'+(lang==='ru'?'Финишная отделка':'Finish')+'</div>'+wallFinBtns+(_aWallFinish==='paint'?prow(lang==='ru'?'Слоёв':'Coats',[{l:'1 слой',v:1},{l:'2 слоя',v:2}],_aWPCoats,'_aWPCotsSel',0.1):'');
      const ceilSec=ceilBtns+(_aCeilType==='paint'?prow(lang==='ru'?'Слоёв':'Coats',[{l:'1 слой',v:1},{l:'2 слоя',v:2}],_aCeilCoats,'_aCeilCotsSel',0.1):'<div style="font-size:12px;color:var(--text2);padding:4px 0">'+(lang==='ru'?'Площадь = сумма комнат':'Area = sum of rooms')+'</div>');
      return roomsSection+SC('','ph-paint-roller',lang==='ru'?'Стены':'Walls',wallSec,'aResult2')+SC('','ph-sparkle',lang==='ru'?'Потолок':'Ceiling',ceilSec,'aResult3')+'<div id="aResult4" style="margin-top:4px"></div>';
    }
    return '';
  };
  window.renderCalcContent=renderCalcContent;
  const mkSel=(setFn,vals,fn,tol)=>(v)=>{setFn(v);vals.forEach(lv=>{const btn=document.getElementById('pr'+fn+lv);if(!btn)return;const act=Math.abs(lv-v)<(tol||0.01);btn.style.borderColor=act?'var(--gold)':'var(--border)';btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';btn.style.color=act?'var(--gold)':'var(--text2)';});calcUpdate();};
  window._concSel=mkSel(v=>{_concMark=v;},[150,200,300],'_concSel',1);
  window._insulSel=mkSel(v=>{_insulSheet=v;},[0.5,0.6,0.72],'_insulSel',0.01);
  window._rebarSpSel=mkSel(v=>{_rebarSp=v;},[10,15,20,25],'_rebarSpSel',0.1);
  window._rebarDSel=mkSel(v=>{_rebarD=v;},[8,10,12],'_rebarDSel',0.1);
  window._laminSel=mkSel(v=>{_laminWaste=v;},[5,10,15],'_laminSel',0.1);
  window._paintLMSel=mkSel(v=>{_paintLM=v;},[0.10,0.12,0.15],'_paintLMSel',0.001);
  window._paintCSel=mkSel(v=>{_paintCoats=v;},[1,2],'_paintCSel',0.1);
  window._foundWSel=mkSel(v=>{_foundW=v;},[0.3,0.4,0.5,0.6],'_foundWSel',0.01);
  window._foundDSel=mkSel(v=>{_foundD=v;},[0.5,0.8,1.0,1.2],'_foundDSel',0.01);
  window._hFloorsSel=mkSel(v=>{_hFloors=v;},[1,2],'_hFloorsSel',0.1);
  window._hWHSel=mkSel(v=>{_hWallH=v;},[2.8,3.0,3.2],'_hWHSel',0.01);
  window._hSlabThSel=mkSel(v=>{_hSlabThick=v;},[0.15,0.20,0.25],'_hSlabThSel',0.01);
  window._hRoofSel=mkSel(v=>{_hRoofAngle=v;},[15,20,30,45],'_hRoofSel',0.1);
  window._hPlThSel=mkSel(v=>{_hPlasterThick=v;},[10,15,20],'_hPlThSel',0.1);
  window._hRDSel=mkSel(v=>{_hRebarDiam=v;},[10,12,14],'_hRDSel',0.1);
  window._hPTypeSel=(t)=>{_hPlasterType=t;['cement','gyps'].forEach(v=>{const btn=document.getElementById('hpt_'+v);if(!btn)return;const act=v===t;btn.style.borderColor=act?'var(--gold)':'var(--border)';btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';btn.style.color=act?'var(--gold)':'var(--text2)';});calcUpdate();};
  window._hWMatSel=(v)=>{_hWallMat=v;['gb','br','sh'].forEach(t=>{const btn=document.getElementById('hwm_'+t);if(!btn)return;const act=t===v;btn.style.borderColor=act?'var(--gold)':'var(--border)';btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';btn.style.color=act?'var(--gold)':'var(--text2)';});calcUpdate();};
  window._hFWSel=mkSel(v=>{_hFW=v;},[0.3,0.4,0.5,0.6],'_hFWSel',0.01);
  window._hFDSel=mkSel(v=>{_hFD=v;},[0.6,0.8,1.0,1.2],'_hFDSel',0.01);
  window._hFThSel=mkSel(v=>{_hFThick=v;},[0.15,0.20,0.25,0.30],'_hFThSel',0.01);
  window._hFTSel=(t)=>{_hFType=t;['lenta','plita'].forEach(v=>{const btn=document.getElementById('hft_'+v);if(!btn)return;const act=v===t;btn.style.borderColor=act?'var(--gold)':'var(--border)';btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';btn.style.color=act?'var(--gold)':'var(--text2)';});_houseCalcSave();document.getElementById('calcBody').innerHTML=renderCalcContent();_houseRestoreInputs();calcUpdate();};
  window._aRoomHSel=mkSel(v=>{_aRoomH=v;},[2.5,2.7,3.0],'_aRoomHSel',0.01);
  window._aScreedThSel=mkSel(v=>{_aScreedTh=v;},[3,5,7,10],'_aScreedThSel',0.1);
  window._aLamWstSel=mkSel(v=>{_aLamWst=v;},[5,10,15],'_aLamWstSel',0.1);
  window._aTileWstSel=mkSel(v=>{_aTileWst=v;},[5,10,15],'_aTileWstSel',0.1);
  window._aAPlThSel=mkSel(v=>{_aAPlTh=v;},[10,15,20],'_aAPlThSel',0.1);
  window._aWPCotsSel=mkSel(v=>{_aWPCoats=v;},[1,2],'_aWPCotsSel',0.1);
  window._aCeilCotsSel=mkSel(v=>{_aCeilCoats=v;},[1,2],'_aCeilCotsSel',0.1);
  const _aRerender=()=>{_houseCalcSave();document.getElementById('calcBody').innerHTML=renderCalcContent();_houseRestoreInputs();calcUpdate();};
  window._aFloorSel=(t)=>{_aFloorMat=t;_aRerender();};
  window._aWallFinSel=(t)=>{_aWallFinish=t;_aRerender();};
  window._aPlTypeSel=(t)=>{_aAPlType=t;_aRerender();};
  window._aCeilTypeSel=(t)=>{_aCeilType=t;_aRerender();};
  window._screedSel=mkSel(v=>{_screedThick=v;},[3,5,7,10],'_screedSel',0.1);
  window._plasterSel=mkSel(v=>{_plasterKg=v;},[8,10,15],'_plasterSel',0.1);
  window._roofSel=mkSel(v=>{_roofAngle=v;},[15,20,30,45],'_roofSel',0.1);
  window._shellSelect=(t)=>{
    _shellThick=t;
    [0.20,0.40].forEach(v=>{
      const btn=document.getElementById('sh_'+v);if(!btn)return;
      const act=Math.abs(v-t)<0.01;
      btn.style.borderColor=act?'var(--gold)':'var(--border)';
      btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';
      btn.style.color=act?'var(--gold)':'var(--text2)';
    });
    calcUpdate();
  };
  window._brickSelect=(t)=>{
    _brickThick=t;
    [0.25,0.51].forEach(v=>{
      const btn=document.getElementById('bp_'+v);if(!btn)return;
      const act=Math.abs(v-t)<0.01;
      btn.style.borderColor=act?'var(--gold)':'var(--border)';
      btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';
      btn.style.color=act?'var(--gold)':'var(--text2)';
    });
    calcUpdate();
  };
  window._tileSelect=(a)=>{
    _tilePre=a;
    [{l:'20×20',a:0.04},{l:'30×30',a:0.09},{l:'30×60',a:0.18},{l:'60×60',a:0.36},{l:'60×120',a:0.72}].forEach(p=>{
      const btn=document.getElementById('tp_'+p.l.replace('×','x'));if(!btn)return;
      const act=Math.abs(p.a-a)<0.001;
      btn.style.borderColor=act?'var(--gold)':'var(--border)';
      btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';
      btn.style.color=act?'var(--gold)':'var(--text2)';
    });
    calcUpdate();
  };
  window._calcSwitch=(id)=>{
    _calcMode=id;
    modes.forEach(md=>{
      const btn=document.getElementById('ctab_'+md.id);if(!btn)return;
      const act=md.id===id;
      btn.style.borderColor=act?'var(--gold)':'var(--border)';
      btn.style.background=act?'rgba(201,170,124,.12)':'var(--bg2)';
      btn.style.color=act?'var(--gold)':'var(--text3)';
    });
    document.getElementById('calcBody').innerHTML=renderCalcContent();
    if(_calcMode==='house'||_calcMode==='apart')_houseRestoreInputs();
    calcUpdate();
  };
  const tabs=modes.map(md=>{
    const act=_calcMode===md.id;
    return '<button id="ctab_'+md.id+'" onclick="_calcSwitch(\''+md.id+'\')" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;font-family:\'Mulish\',sans-serif;border:1px solid '+(act?'var(--gold)':'var(--border)')+';background:'+(act?'rgba(201,170,124,.12)':'var(--bg2)')+';color:'+(act?'var(--gold)':'var(--text3)')+'">'+( md.icon?'<i class="ph '+md.icon+'" style="font-size:15px"></i> ':'' )+(md[lang]||md.ru)+'</button>';
  }).join('');
  showModal('<div class="modal-handle"></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:18px"><div style="width:40px;height:40px;border-radius:12px;background:rgba(201,170,124,.12);display:flex;align-items:center;justify-content:center"><i class="ph ph-calculator" style="font-size:20px;color:var(--gold)"></i></div><div><div style="font-family:\'Unbounded\',sans-serif;font-size:15px;font-weight:700">'+(lang==='ru'?'Калькулятор':'Calculator')+'</div><div style="font-size:11px;color:var(--text3)">'+(lang==='ru'?'Стройматериалы':'Construction materials')+'</div></div></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--border)">'+tabs+'</div><div id="calcBody">'+renderCalcContent()+'</div>');
  setTimeout(()=>{if(_calcMode==='house')_houseRestoreInputs();calcUpdate();},50);
}
function calcUpdate(){
  if(_calcMode==='house'){
    const L=parseFloat(document.getElementById('calcL')?.value)||0;
    const W=parseFloat(document.getElementById('calcW')?.value)||0;
    const perim=2*(L+W),area=L*W;
    const el1=document.getElementById('calcResult'),el2=document.getElementById('calcResult2'),el3=document.getElementById('calcResult3'),el4=document.getElementById('calcResult4'),el5=document.getElementById('calcResult5'),el6=document.getElementById('calcResult6');
    const pb=getPrices();
    const costLine=(c)=>c>0?'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding:8px 12px;background:rgba(201,170,124,.08);border-radius:10px;border:1px solid rgba(201,170,124,.2)"><span style="font-size:11px;color:var(--text3)">'+(lang==='ru'?'Ориентировочно':'Est. cost')+'</span><span style="font-family:\'DM Mono\',monospace;font-size:16px;font-weight:700;color:var(--gold)">'+Math.round(c).toLocaleString()+' ₼</span></div>':'';
    const rBlock=(label,val,sub)=>'<div style="background:rgba(201,170,124,.08);border:1px solid rgba(201,170,124,.25);border-radius:14px;padding:12px 16px;margin-top:4px"><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">'+label+'</div><div style="font-family:\'DM Mono\',monospace;font-size:20px;font-weight:700;color:var(--gold)">'+val+'</div><div style="font-size:11px;color:var(--text2);margin-top:5px">'+sub+'</div></div>';
    // Стоимости этапов — общая область блока, чтобы блок «Итого» их видел
    let costF=0,costW=0,costS=0,costR=0,costPl=0;
    // Фундамент
    if(el1){
      let fVol=0,fRebar=0,fStirrupKg=0,fInfo='';
      const STIR_KGM=0.395; // Ø8 — хомуты
      if(_hFType==='lenta'&&perim>0){fVol=perim*_hFW*_hFD;fRebar=Math.ceil(perim*4*1.1);const nStir=Math.ceil(perim/0.3);const stirLen=Math.max(0,2*((_hFW-0.08)+(_hFD-0.08)));fStirrupKg=Math.round(nStir*stirLen*STIR_KGM);fInfo='Периметр '+perim.toFixed(1)+' м · Лента '+(_hFW*100).toFixed(0)+'×'+(_hFD*100).toFixed(0)+' см';}
      else if(_hFType==='plita'&&area>0){fVol=area*_hFThick;const sp=0.15;fRebar=Math.ceil(((Math.floor(W/sp)+1)*L+(Math.floor(L/sp)+1)*W)*1.1*2);fInfo='Площадь '+area.toFixed(1)+' м² · Плита '+(_hFThick*100).toFixed(0)+' см';}
      const pConc=pb.concrete||_hPriceDef.concrete,pReb=pb.rebar||_hPriceDef.rebar;
      const kgM=_rebarKgM[_hRebarDiam]||0.888;
      const fRebarKg=Math.round(fRebar*kgM)+fStirrupKg;
      costF=fVol>0?fVol*pConc+fRebarKg*pReb:0;
      _hCalcData.found={fVol,fRebar,fRebarKg,pConc,pReb,costF,kgM,diam:_hRebarDiam};
      el1.innerHTML=fVol>0?rBlock(lang==='ru'?'Этап 1: Фундамент':'Stage 1: Foundation',fVol.toFixed(2)+' м³ бетона',fInfo+' · Арм. Ø'+_hRebarDiam+' ~'+fRebar+' м'+(fStirrupKg>0?' + хомуты Ø8':'')+' (~'+fRebarKg+' кг)')+costLine(costF):'';
    }
    // Стены
    if(el2){
      const totalH=_hWallH*_hFloors;
      const wallArea=perim*totalH*0.90;
      let wVal='',wSub='',gbVol=0;
      if(wallArea>0){
        if(_hWallMat==='gb'){const n=Math.ceil(wallArea/0.15*1.03);const glue=Math.ceil(wallArea/15);gbVol=+(wallArea*0.30).toFixed(2);wVal=n+' блоков';wSub='Пл. стен (−10%): '+wallArea.toFixed(0)+' м² · '+gbVol+' м³ · Клей: '+glue+' мешк.';}
        else if(_hWallMat==='br'){const bVol=0.26*0.13*0.075;const wVol=wallArea*0.25;const n=Math.ceil(wVol/bVol*1.05);wVal=n+' шт';wSub='Пл. стен: '+wallArea.toFixed(0)+' м² · Объём '+wVol.toFixed(1)+' м³ · 1 кирпич';}
        else if(_hWallMat==='sh'){const bVol=0.41*0.21*0.21;const wVol=wallArea*0.20;const n=Math.ceil(wVol/bVol*1.05);const mortar=Math.ceil(wallArea*20/40);wVal=n+' шт';wSub='Пл. стен: '+wallArea.toFixed(0)+' м² · Р-р: '+mortar+' мешк. по 40 кг';}
      }
      const pBlk=(_hWallMat==='gb'?pb.gasblock:_hWallMat==='br'?pb.brick:pb.shell)||1;
      const pGlue=pb.glue||6.5;
      let nBlocks=0,wallVol=gbVol,glueCount=0;
      if(_hWallMat==='gb'){nBlocks=Math.ceil(wallArea/0.15*1.03);glueCount=Math.ceil(wallArea/15);costW=wallVol*pBlk+glueCount*pGlue;}
      else if(_hWallMat==='br'){nBlocks=Math.ceil((wallArea*0.25)/(0.26*0.13*0.075)*1.05);costW=nBlocks*pBlk;}
      else if(_hWallMat==='sh'){nBlocks=Math.ceil((wallArea*0.20)/(0.41*0.21*0.21)*1.05);costW=nBlocks*pBlk;}
      const wallMatName=_hWallMat==='gb'?'Газоблок':_hWallMat==='br'?'Кирпич':'Ракушечник';
      _hCalcData.walls={nBlocks,wallVol,pBlk,costW,wallMatName,wallArea,glueCount,pGlue};
      el2.innerHTML=wVal?rBlock(lang==='ru'?'Этап 2: Стены':'Stage 2: Walls',wVal,wSub)+costLine(costW):'';
    }
    // Перекрытие
    if(el3){
      const slabArea=L*W;
      const slabs=_hFloors; // по одной плите на каждый этаж
      const slabVol=slabArea*_hSlabThick*slabs;
      const sp=0.15;
      const slabRebar=Math.ceil(((Math.floor(W/sp)+1)*L+(Math.floor(L/sp)+1)*W)*1.1*2*slabs);
      const pConcS=pb.concrete||_hPriceDef.concrete,pRebS=pb.rebar||_hPriceDef.rebar;
      const kgMS=_rebarKgM[_hRebarDiam]||0.888;
      costS=slabVol>0?slabVol*pConcS+slabRebar*kgMS*pRebS:0;
      _hCalcData.slab={slabRebar,slabVol,pConcS,pRebS,costS,kgMS,diam:_hRebarDiam};
      el3.innerHTML=slabVol>0?rBlock(lang==='ru'?'Этап 3: Перекрытие':'Stage 3: Floor slab',slabVol.toFixed(2)+' м³ бетона',slabArea.toFixed(1)+' м² × '+slabs+' пл. × '+(_hSlabThick*100).toFixed(0)+' см · Арм. Ø'+_hRebarDiam+': ~'+slabRebar+' м (~'+Math.round(slabRebar*kgMS)+' кг)')+costLine(costS):'';
    }
    // Кровля
    if(el4){
      const base=L*W;
      const angle=_hRoofAngle*Math.PI/180;
      const roofArea=base>0?Math.ceil(base/Math.cos(angle)*1.1):0; // +10% свесы
      const pRoof=pb.roof||_hPriceDef.roof;
      costR=roofArea>0?roofArea*pRoof:0;
      _hCalcData.roof={roofArea,pRoof,costR};
      el4.innerHTML=roofArea>0?rBlock(lang==='ru'?'Этап 4: Кровля':'Stage 4: Roof',roofArea+' м²','Горизонт. '+base.toFixed(1)+' м² · уклон '+_hRoofAngle+'° · +10% свесы')+costLine(costR):'';
    }
    // Штукатурка (наружные стены −15% проёмы)
    if(el5){
      const totalH=_hWallH*_hFloors;
      const plArea=perim>0?Math.round(perim*totalH*0.85):0;
      if(plArea>0){
        const kgPerM2=(_hPlasterType==='gyps'?9:16)*_hPlasterThick/10;
        const totalKg=Math.ceil(plArea*kgPerM2);
        const bagKg=_hPlasterType==='gyps'?30:50;
        const bags=Math.ceil(totalKg/bagKg);
        const typeLabel=lang==='ru'?(_hPlasterType==='gyps'?'Гипсовая':'Цементная'):(_hPlasterType==='gyps'?'Gypsum':'Cement');
        const pPlaster=(_hPlasterType==='cement'?pb.plasterCem:pb.plasterGyps)||_hPriceDef.plaster;
        costPl=bags*pPlaster;
        _hCalcData.plaster={bags,bagKg,pPlaster,costPl,typeLabel};
        el5.innerHTML=rBlock(lang==='ru'?'Этап 5: Штукатурка':'Stage 5: Plaster',bags+' мешк. × '+bagKg+' кг',typeLabel+' · '+_hPlasterThick+' мм · '+plArea+' м² · ~'+totalKg+' кг')+costLine(costPl);
        // Итог + кнопка
        if(el6){
          const costs=[costF||0,costW||0,costS||0,costR||0,costPl||0];
          const total=costs.reduce((a,b)=>a+b,0);
          const o=curObj();
          const hasData=(_hCalcData.found?.fVol>0)||(_hCalcData.walls?.nBlocks>0);
          if(total>0||hasData){
            const rows=[(lang==='ru'?'Фундамент':'Foundation'),(lang==='ru'?'Стены':'Walls'),(lang==='ru'?'Перекрытие':'Slab'),(lang==='ru'?'Кровля':'Roof'),(lang==='ru'?'Штукатурка':'Plaster')].map((n,i)=>costs[i]>0?'<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)"><span style="color:var(--text2)">'+n+'</span><span style="font-family:\'DM Mono\',monospace;color:var(--text)">'+Math.round(costs[i]).toLocaleString()+' ₼</span></div>':'').join('');
            const totalRow=total>0?'<div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:8px"><span style="font-size:13px;font-weight:700">'+(lang==='ru'?'ИТОГО':'TOTAL')+'</span><span style="font-family:\'DM Mono\',monospace;font-size:20px;font-weight:700;color:var(--gold)">'+Math.round(total).toLocaleString()+' ₼</span></div>':'';
            const createBtn=o&&hasData?'<button onclick="createStagesFromCalc()" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:14px;padding:13px;background:var(--gold);color:#0D0F14;border:none;border-radius:12px;font-family:\'Unbounded\',sans-serif;font-size:12px;font-weight:700;cursor:pointer"><i class="ph ph-folder-plus" style="font-size:16px"></i>'+(lang==='ru'?'Создать этапы в проекте':'Create stages in project')+'</button>':'';
            el6.innerHTML='<div style="background:var(--bg2);border:1px solid rgba(201,170,124,.3);border-radius:16px;padding:16px;margin-top:4px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><i class="ph ph-sigma" style="font-size:16px;color:var(--gold)"></i><span style="font-family:\'Unbounded\',sans-serif;font-size:12px;font-weight:700">'+(lang==='ru'?'Итого по материалам':'Total materials')+'</span></div>'+rows+totalRow+createBtn+'</div>';
          }else{el6.innerHTML='';}
        }
      }else{el5.innerHTML='';if(el6)el6.innerHTML='';}
    }
    _houseCalcSave();
    return;
  }
  if(_calcMode==='apart'){
    const pbA=getPrices();
    const costLine=(c)=>c>0?'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding:8px 12px;background:rgba(201,170,124,.08);border-radius:10px;border:1px solid rgba(201,170,124,.2)"><span style="font-size:11px;color:var(--text3)">'+(lang==='ru'?'Ориентировочно':'Est. cost')+'</span><span style="font-family:\'DM Mono\',monospace;font-size:16px;font-weight:700;color:var(--gold)">'+Math.round(c).toLocaleString()+' ₼</span></div>':'';
    const rBlock=(label,val,sub)=>'<div style="background:rgba(201,170,124,.08);border:1px solid rgba(201,170,124,.25);border-radius:14px;padding:12px 16px;margin-top:4px"><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">'+label+'</div><div style="font-family:\'DM Mono\',monospace;font-size:20px;font-weight:700;color:var(--gold)">'+val+'</div><div style="font-size:11px;color:var(--text2);margin-top:5px">'+sub+'</div></div>';
    // Комнаты → агрегат площадей по типу пола; рецепт считается на общую площадь типа (мешки округляются один раз)
    let totalArea=0,totalPerim=0;const areaByType={};
    (_aRooms||[]).forEach(r=>{const a=(r.L||0)*(r.W||0);if(a>0){areaByType[r.floor]=(areaByType[r.floor]||0)+a;totalArea+=a;totalPerim+=2*((r.L||0)+(r.W||0));}});
    const area=totalArea;
    const wallArea=totalPerim>0?Math.round(totalPerim*_aRoomH*0.85):0;
    const agg=[];const aggIdx={};let floorCost=0;
    Object.keys(areaByType).forEach(ft=>{const sys=FLOOR_SYSTEMS[ft];if(!sys)return;sys.mats(areaByType[ft]).forEach(m=>{const k=m[0],nm=_seedLbl([m[1],m[2],m[3]]),q=m[4],u=m[5];const key=k+'|'+u;if(aggIdx[key]==null){aggIdx[key]=agg.length;agg.push({k,n:nm,u,q:0});}agg[aggIdx[key]].q+=q;floorCost+=q*(pbA[k]||0);});});
    _aCalcData.floorAgg=agg;_aCalcData.floorCost=floorCost;_aCalcData.totalArea=totalArea;_aCalcData.areaByType=areaByType;
    let cF=floorCost,cW=0,cC=0;
    // Пол — агрегированный список материалов по всем комнатам
    const elF=document.getElementById('aResult');
    if(elF){
      if(totalArea>0){
        const typeLine=Object.keys(areaByType).map(ft=>_seedLbl([FLOOR_SYSTEMS[ft].ru,FLOOR_SYSTEMS[ft].az,FLOOR_SYSTEMS[ft].en])+' '+(+areaByType[ft].toFixed(1))+' м²').join(' · ');
        const matRows=agg.map(m=>{const c=m.q*(pbA[m.k]||0);return '<div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border)"><span style="color:var(--text2)">'+m.n+'</span><span style="font-family:\'DM Mono\',monospace;color:var(--text)">'+(+m.q.toFixed(1))+' '+m.u+(pbA[m.k]?'<span style="color:var(--text3)"> · '+Math.round(c).toLocaleString()+' ₼</span>':'')+'</span></div>';}).join('');
        elF.innerHTML='<div style="font-size:11px;color:var(--text3);margin-bottom:8px">'+(lang==='ru'?'Пол: ':'Floor: ')+(+totalArea.toFixed(1))+' м² · '+typeLine+'</div>'+matRows+costLine(floorCost);
      }else elF.innerHTML='<div style="font-size:12px;color:var(--text3)">'+(lang==='ru'?'Введите размеры комнат':'Enter room sizes')+'</div>';
    }
    // Стены
    const elW=document.getElementById('aResult2');
    if(elW){
      if(wallArea>0){
        const bagKg=_aAPlType==='gyps'?30:50;
        const kgM2=(_aAPlType==='gyps'?9:16)*_aAPlTh/10;
        const bags=Math.ceil(wallArea*kgM2/bagKg);
        const plLabel=_aAPlType==='gyps'?(lang==='ru'?'Гипсовая':'Gypsum'):(lang==='ru'?'Цементная':'Cement');
        const pPl=pbA[_aAPlType==='gyps'?'plasterGyps':'plasterCem']||_hPriceDef.plaster;
        cW=bags*pPl;
        let html=rBlock(lang==='ru'?'Штукатурка стен':'Wall plaster',bags+' мешк. × '+bagKg+' кг',wallArea+' м² · '+_aAPlTh+'мм · '+plLabel+' · ~'+Math.round(wallArea*kgM2)+' кг');
        if(_aWallFinish==='paint'){const liters=Math.ceil(wallArea*0.12*_aWPCoats);cW+=liters*(pbA.paint||0);html+=rBlock(lang==='ru'?'Краска стен':'Wall paint',liters+' л',wallArea+' м² · '+_aWPCoats+' сл. · '+Math.ceil(liters/10)+' ведёр по 10 л');}
        else{const rolls=Math.ceil(wallArea/5);html+=rBlock(lang==='ru'?'Обои':'Wallpaper',rolls+' рулонов',wallArea+' м² ÷ ~5 м²/рулон');}
        elW.innerHTML=html+costLine(cW);_aCalcData.walls={bags,bagKg,plLabel,wallArea,cW};
      }else elW.innerHTML='';
    }
    // Потолок
    const elC=document.getElementById('aResult3');
    if(elC){
      if(area>0){
        if(_aCeilType==='paint'){const liters=Math.ceil(area*0.12*_aCeilCoats);cC=liters*(pbA.paint||0);elC.innerHTML=rBlock(lang==='ru'?'Краска потолка':'Ceiling paint',liters+' л',area+' м² · '+_aCeilCoats+' сл. · '+Math.ceil(liters/10)+' ведёр')+costLine(cC);_aCalcData.ceil={type:'paint',liters,cC};}
        else{elC.innerHTML=rBlock(lang==='ru'?'Натяжной потолок':'Stretch ceiling',area+' м²',lang==='ru'?'Площадь для подрядчика':'Area for contractor');_aCalcData.ceil={type:'stretch',area};}
      }else elC.innerHTML='';
    }
    // Итого
    const elT=document.getElementById('aResult4');
    if(elT&&area>0&&wallArea>0){
      const total=cF+cW+cC;
      const o=curObj();
      const rows=[[lang==='ru'?'Пол':'Floor',area>0,cF],[lang==='ru'?'Стены':'Walls',wallArea>0,cW],[lang==='ru'?'Потолок':'Ceiling',area>0,cC]].filter(r=>r[1]).map(r=>'<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)"><span style="color:var(--text2)">'+r[0]+'</span><span style="font-family:\'DM Mono\',monospace;color:var(--text)">'+(r[2]>0?Math.round(r[2]).toLocaleString()+' ₼':'—')+'</span></div>').join('');
      const totalRow=total>0?'<div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:8px"><span style="font-size:13px;font-weight:700">'+(lang==='ru'?'ИТОГО':'TOTAL')+'</span><span style="font-family:\'DM Mono\',monospace;font-size:20px;font-weight:700;color:var(--gold)">'+Math.round(total).toLocaleString()+' ₼</span></div>':'';
      const createBtn=o?'<button onclick="createApartStages()" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:14px;padding:13px;background:var(--gold);color:#0D0F14;border:none;border-radius:12px;font-family:\'Unbounded\',sans-serif;font-size:12px;font-weight:700;cursor:pointer"><i class="ph ph-folder-plus" style="font-size:16px"></i>'+(lang==='ru'?'Создать этапы ремонта':'Create renovation stages')+'</button>':'';
      elT.innerHTML='<div style="background:var(--bg2);border:1px solid rgba(201,170,124,.3);border-radius:16px;padding:16px;margin-top:4px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><i class="ph ph-sigma" style="font-size:16px;color:var(--gold)"></i><span style="font-family:\'Unbounded\',sans-serif;font-size:12px;font-weight:700">'+(lang==='ru'?'Итого по ремонту':'Total renovation')+'</span></div>'+rows+totalRow+createBtn+'</div>';
    }else if(elT)elT.innerHTML='';
    return;
  }
  const L=parseFloat(document.getElementById('calcL')?.value)||0;
  const W=parseFloat(document.getElementById('calcW')?.value)||0;
  const H=parseFloat(document.getElementById('calcH')?.value)||0;
  const T=parseFloat(document.getElementById('calcT')?.value)||0;
  const K=parseFloat(document.getElementById('calcK')?.value)||0;
  const O=parseFloat(document.getElementById('calcO')?.value)||0;
  const TL=parseFloat(document.getElementById('calcTL')?.value)||0;
  const TW=parseFloat(document.getElementById('calcTW')?.value)||0;
  const el=document.getElementById('calcResult');if(!el)return;
  let result='',sub='';
  if(_calcMode==='concrete'){
    const v=L*W*H;
    const ckg={150:250,200:300,300:400}[_concMark]||300;
    result=v>0?v.toFixed(2)+' м³':'—';
    if(v>0)sub='≈ '+Math.ceil(v*ckg)+' кг цемента (М'+_concMark+') · '+Math.ceil(v*ckg/40)+' мешк. по 40 кг · ≈ '+Math.ceil(v*0.8)+' м³ щебня';
  }else if(_calcMode==='gas_block'){
    const wallArea=L*H*0.90;
    const n=wallArea>0?Math.ceil(wallArea/0.15*1.03):0;
    const glue=Math.ceil(wallArea/15);
    result=n>0?n+' шт':'—';
    if(n>0)sub='Площадь (−10%): '+wallArea.toFixed(1)+' м² · +3% бой · Клей: '+glue+' мешк. по 25 кг';
  }else if(_calcMode==='shell'){
    const wallArea=L*H*0.90;
    const blockVol=0.39*0.19*0.19;
    const wallVol=wallArea*_shellThick;
    const n=wallVol>0?Math.ceil(wallVol/blockVol*1.05):0;
    const mortarVol=wallArea*0.017;
    const shellBags=Math.ceil(wallArea/6.5);
    const cementKg=shellBags*40;
    const sandM3=(mortarVol*0.75).toFixed(2);
    result=n>0?n+' шт':'—';
    if(n>0)sub='Площадь (−10%): '+wallArea.toFixed(1)+' м² · Цемент: '+shellBags+' меш. по 40 кг · Песок: '+sandM3+' м³';
  }else if(_calcMode==='brick'){
    const wallArea=L*H*0.90;
    const thick=_brickThick||0.25;
    const brickVol=0.26*0.13*0.075;
    const wallVol=wallArea*thick;
    const n=wallVol>0?Math.ceil(wallVol/brickVol*1.05):0;
    result=n>0?n+' шт':'—';
    if(n>0)sub='Объём: '+wallVol.toFixed(2)+' м³ · Площадь (−10%): '+wallArea.toFixed(1)+' м²';
  }else if(_calcMode==='tile'){
    const roomArea=L*W;
    const tileArea=_tilePre||0.36;
    const n=roomArea>0?Math.ceil(roomArea*1.1/tileArea):0;
    const labels={0.04:'20×20',0.09:'30×30',0.18:'30×60',0.36:'60×60',0.72:'60×120'};
    result=n>0?n+' шт':'—';
    if(n>0)sub='Площадь: '+roomArea.toFixed(1)+' м² · +10% порез · ≈ '+Math.ceil(roomArea*1.1/1.44)+' кор. · плитка '+(labels[_tilePre]||'');
  }else if(_calcMode==='screed'){
    const area=L*W;
    const thick=_screedThick||5;
    const vol=area*thick/100;
    const kg=area*thick*18;
    result=vol>0?vol.toFixed(2)+' м³':'—';
    if(vol>0)sub='Смесь: ≈ '+Math.round(kg)+' кг · '+Math.ceil(kg/40)+' мешк. по 40 кг · '+area.toFixed(1)+' м²';
  }else if(_calcMode==='area'){
    const a=L*W;
    result=a>0?a.toFixed(2)+' м²':'—';
    if(a>0)sub='Периметр: '+(2*(L+W)).toFixed(1)+' м';
  }else if(_calcMode==='plaster'){
    const wallArea=L*H*0.90;
    const kg=wallArea*_plasterKg;
    const bags=Math.ceil(kg/25);
    result=wallArea>0?kg.toFixed(0)+' кг':'—';
    if(wallArea>0)sub=bags+' мешков по 25 кг · Площадь (−10%): '+wallArea.toFixed(1)+' м²';
  }else if(_calcMode==='roof'){
    const angle=_roofAngle*Math.PI/180;
    const base=L*W;
    const a=base>0?base/Math.cos(angle):0;
    result=a>0?a.toFixed(2)+' м²':'—';
    if(a>0)sub='Горизонт.: '+base.toFixed(1)+' м² · +'+((a/base-1)*100).toFixed(0)+'% · уклон '+_roofAngle+'°';
  }else if(_calcMode==='insul'){
    const wallArea=L*H*0.90;
    const n=wallArea>0?Math.ceil(wallArea/_insulSheet*1.05):0;
    const lbl={0.5:'100×50',0.6:'100×60',0.72:'120×60'}[_insulSheet]||'';
    result=n>0?n+' шт':'—';
    if(n>0)sub='Площадь (−10%): '+wallArea.toFixed(1)+' м² · лист '+lbl+' · +5% запас';
  }else if(_calcMode==='rebar'){
    const sp=_rebarSp/100;
    const totalM=L>0&&W>0?((Math.floor(W/sp)+1)*L+(Math.floor(L/sp)+1)*W)*1.1:0;
    const kgM={8:0.395,10:0.617,12:0.888}[_rebarD]||0.617;
    const rods=Math.ceil(totalM/11.7);
    result=totalM>0?Math.ceil(totalM)+' м':'—';
    if(totalM>0)sub=Math.ceil(totalM*kgM)+' кг · '+rods+' прутков по 11.7 м · шаг '+_rebarSp+'см · Ø'+_rebarD+'мм';
  }else if(_calcMode==='lamin'){
    const area=L*W;
    const packs=area>0?Math.ceil(area*(1+_laminWaste/100)/2.0):0;
    result=packs>0?packs+' уп.':'—';
    if(packs>0)sub='Площадь: '+area.toFixed(1)+' м² · +'+_laminWaste+'% подрезка · ~2 м²/уп.';
  }else if(_calcMode==='paint'){
    const wallArea=L*H*0.90;
    const liters=wallArea*_paintLM*_paintCoats;
    result=liters>0?liters.toFixed(1)+' л':'—';
    if(liters>0)sub='Площадь (−10%): '+wallArea.toFixed(1)+' м² · '+_paintCoats+' сл. · '+(_paintLM*1000).toFixed(0)+' мл/м²';
  }else if(_calcMode==='found'){
    const vol=L*_foundW*_foundD;
    const cement=Math.ceil(vol*300/40);
    const rebarM=Math.ceil(L*4*1.1);
    result=vol>0?vol.toFixed(2)+' м³':'—';
    if(vol>0)sub='Цемент М200: '+cement+' мешк. по 40 кг · Арм.: ~'+rebarM+' м (4 прутка) · Ш'+(_foundW*100).toFixed(0)+'×Г'+(_foundD*100).toFixed(0)+'см';
  }
  el.innerHTML=result==='—'?'':`<div style="background:rgba(201,170,124,.08);border:1px solid rgba(201,170,124,.25);border-radius:14px;padding:14px 16px;margin-top:4px"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">${lang==='ru'?'Результат':'Result'}</div><div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:700;color:var(--gold)">${result}</div>${sub?'<div style="font-size:11px;color:var(--text2);margin-top:6px">'+sub+'</div>':''}</div>`;
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='light'?null:'light';
  if(next)document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('isapp_theme',next||'dark');
  renderMore();
  // Обновить hero градиент
  renderDash();
}
// ── ГАЛЕРЕЯ ──
// Открыть альбом конкретного этапа (или журнала)
function openGalleryAlbum(albumId){
  const o=curObj();if(!o)return;
  const isJournal=albumId==='__journal__';
  const albumEl=document.createElement('div');
  albumEl.id='galleryAlbumPage';
  albumEl.style.cssText='position:fixed;inset:0;background:var(--bg);z-index:310;overflow-y:auto;-webkit-overflow-scrolling:touch;animation:slideLeft .22s ease';

  let albumName,albumItems=[];
  if(isJournal){
    albumName=lang==='ru'?'Журнал':'Journal';
    (o.journal||[]).filter(e=>e.meta&&e.meta.photoId).sort((a,b)=>b.ts-a.ts).forEach(e=>{
      albumItems.push({photoId:e.meta.photoId,args:`'${e.meta.photoId}','journal','${e.id}'`,sub:e.text||new Date(e.ts).toLocaleDateString('ru',{day:'2-digit',month:'short'})});
    });
  } else {
    const s=(o.stages||[]).find(x=>x.id===albumId);if(!s)return;
    albumName=tName(s)||s.name;
    (s.photos||[]).forEach(pid=>albumItems.push({photoId:pid,args:`'${pid}','stage','${s.id}'`,sub:''}));
    (s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>(w.photos||[]).forEach(pid=>albumItems.push({photoId:pid,args:`'${pid}','work','${s.id}','${p.id}','${w.id}'`,sub:tName(p)||p.name}))));
  }

  albumEl.innerHTML=`
    <div style="padding:calc(env(safe-area-inset-top,0px) + 16px) 16px 32px">
      <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:16px">
        <button class="back-btn" onclick="document.getElementById('galleryAlbumPage').remove()">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${lang==='ru'?'Галерея':'Gallery'}
        </button>
        <div style="flex:1;font-family:'Unbounded',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${albumName}</div>
        <span style="font-size:12px;color:var(--text3)">${albumItems.length}</span>
      </div>
      <div id="albumGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${!albumItems.length?`<div style="grid-column:1/-1;text-align:center;padding:48px 0;color:var(--text3)"><i class="ph ph-image" style="font-size:40px;opacity:.3;display:block;margin-bottom:10px"></i>${lang==='ru'?'Нет фото':'No photos'}</div>`:''}
      </div>
    </div>`;
  document.body.appendChild(albumEl);
  _addSwipeClose(albumEl);

  if(!albumItems.length)return;
  loadPhotos(albumItems.map(x=>x.photoId)).then(photos=>{
    const grid=document.getElementById('albumGrid');if(!grid)return;
    grid.innerHTML=albumItems.map(item=>{
      const src=photos[item.photoId];if(!src)return'';
      return`<div onclick="viewPhoto(${item.args})" style="aspect-ratio:1;overflow:hidden;background:var(--bg2);border-radius:10px;cursor:pointer;position:relative">
        <img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block"/>
        ${item.sub?`<div style="position:absolute;bottom:0;left:0;right:0;padding:18px 6px 5px;background:linear-gradient(transparent,rgba(0,0,0,.65));font-size:9px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2">${item.sub}</div>`:''}
      </div>`;
    }).join('');
  });
}

function _addSwipeClose(el){
  let tx0=0,ty0=0,sw=false;
  el.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;sw=false;},{passive:true});
  el.addEventListener('touchmove',e=>{const dx=e.touches[0].clientX-tx0,dy=Math.abs(e.touches[0].clientY-ty0);if(!sw&&dx>12&&dy<dx)sw=true;if(sw){const t=Math.max(0,dx);el.style.transform=`translateX(${t}px)`;el.style.opacity=String(Math.max(0,1-t/300));}},{passive:true});
  el.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx0;el.style.transition='transform .25s,opacity .25s';if(sw&&dx>80){el.style.transform='translateX(100%)';el.style.opacity='0';setTimeout(()=>el.remove(),250);}else{el.style.transform='';el.style.opacity='';setTimeout(()=>el.style.transition='',250);}sw=false;},{passive:true});
}

function showPhotoGallery(){
  const o=curObj();
  // Формируем альбомы
  const albums=[]; // {id, name, icon, coverPhotoId, count}
  if(o){
    (o.stages||[]).forEach(s=>{
      const stagePhotos=(s.photos||[]);
      const workPhotos=(s.positions||[]).flatMap(p=>(p.works||[]).flatMap(w=>w.photos||[]));
      const allIds=[...stagePhotos,...workPhotos];
      if(allIds.length)albums.push({id:s.id,name:tName(s)||s.name,icon:s.icon||'🏗',color:s.color||'var(--gold)',coverPhotoId:allIds[0],count:allIds.length});
    });
    const jPhotos=(o.journal||[]).filter(e=>e.meta&&e.meta.photoId);
    if(jPhotos.length)albums.push({id:'__journal__',name:lang==='ru'?'Журнал':'Journal',icon:'📓',color:'var(--gold)',coverPhotoId:jPhotos[0].meta.photoId,count:jPhotos.length});
  }

  const totalPh=albums.reduce((a,x)=>a+x.count,0);
  const el=document.createElement('div');
  el.id='photoGalleryPage';
  el.style.cssText='position:fixed;inset:0;background:var(--bg);z-index:300;overflow-y:auto;-webkit-overflow-scrolling:touch;animation:slideUp .25s ease';
  el.innerHTML=`
    <div style="padding:calc(env(safe-area-inset-top,0px) + 16px) 16px 32px">
      <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:16px">
        <button class="back-btn" onclick="document.getElementById('photoGalleryPage').remove()">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${lang==='ru'?'Назад':'Back'}
        </button>
        <div style="flex:1;font-family:'Unbounded',sans-serif;font-size:14px;font-weight:700">${lang==='ru'?'Галерея':'Gallery'}</div>
        <span style="font-size:12px;color:var(--text3)">${totalPh} ${lang==='ru'?'фото':'photos'}</span>
      </div>
      <div id="galleryAlbums" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${!albums.length?`<div style="grid-column:1/-1;text-align:center;padding:64px 0;color:var(--text3)"><i class="ph ph-images" style="font-size:48px;display:block;margin-bottom:12px;opacity:.3"></i><div style="font-size:14px">${lang==='ru'?'Фото пока нет':'No photos yet'}</div></div>`:''}
      </div>
    </div>`;
  document.body.appendChild(el);
  _addSwipeClose(el);

  if(!albums.length)return;
  // Загружаем обложки
  loadPhotos(albums.map(a=>a.coverPhotoId)).then(photos=>{
    const container=document.getElementById('galleryAlbums');if(!container)return;
    container.innerHTML=albums.map(a=>{
      const coverSrc=photos[a.coverPhotoId];
      return`<div onclick="openGalleryAlbum('${a.id}')" style="cursor:pointer">
        <div style="aspect-ratio:1;border-radius:14px;overflow:hidden;background:var(--bg2);position:relative;margin-bottom:7px;border:1px solid var(--border)">
          ${coverSrc?`<img src="${coverSrc}" style="width:100%;height:100%;object-fit:cover;display:block"/>`:
            `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px">${a.icon}</div>`}
          <div style="position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,.55);border-radius:8px;padding:2px 7px;font-size:11px;font-weight:700;color:white;font-family:'DM Mono',monospace">${a.count}</div>
        </div>
        <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.icon} ${a.name}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:1px">${a.count} ${lang==='ru'?'фото':'photos'}</div>
      </div>`;
    }).join('');
  });
}
function savePricesUI(){
  const g=id=>parseFloat(document.getElementById(id)?.value)||null;
  const prices={concrete:g('pb_concrete'),rebar:g('pb_rebar'),gasblock:g('pb_gasblock'),brick:g('pb_brick'),shell:g('pb_shell'),roof:g('pb_roof'),plasterCem:g('pb_plasterCem'),plasterGyps:g('pb_plasterGyps'),sand:g('pb_sand'),gravel:g('pb_gravel'),cement:g('pb_cement'),glue:g('pb_glue'),screed:g('pb_screed'),tileAdh:g('pb_tileAdh'),grout:g('pb_grout'),tile:g('pb_tile'),underlay:g('pb_underlay'),laminat:g('pb_laminat'),lag:g('pb_lag'),plywood:g('pb_plywood'),plank:g('pb_plank'),lacquer:g('pb_lacquer'),paint:g('pb_paint')};
  Object.keys(prices).forEach(k=>{if(prices[k]==null)delete prices[k];});
  savePrices(prices);
  showToast(lang==='ru'?'Прайс-лист сохранён ✓':lang==='az'?'Qiymət cədvəli saxlanıldı ✓':'Price list saved ✓');
}
function showPriceBook(){
  const pb=getPrices();
  const row=(id,lbl,unit)=>`<div style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="flex:1;font-size:13px;color:var(--text2)">${lbl}</span><input id="pb_${id}" type="number" min="0" step="0.01" value="${pb[id]||''}" placeholder="${_PRICES_DEF[id]||''}" style="width:72px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:14px;color:var(--text);font-family:'DM Mono',monospace;text-align:right;outline:none;-webkit-user-select:text;user-select:text"/><span style="font-size:12px;color:var(--text3);min-width:36px">${unit}</span></div>`;
  document.getElementById('moreContent').innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;padding:16px 16px 0">
      <button onclick="renderMore()" style="width:36px;height:36px;border-radius:50%;background:var(--bg2);border:1px solid var(--border);color:var(--text2);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0"><i class="ph ph-caret-left" style="font-size:18px"></i></button>
      <span style="font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700">${l3('Прайс-лист','Qiymət cədvəli','Price book')}</span>
    </div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px">
        <div style="font-size:11px;color:var(--text3);margin-bottom:12px">${l3('Заполни один раз — автоподставляется в калькулятор и материалы','Bir dəfə doldur — hər yerdə istifadə olunur','Fill once — auto-fills calculator & materials')}</div>
        ${row('concrete',l3('Бетон М200','Beton M200','Concrete M200'),'₼/м³')}
        ${row('rebar',l3('Арматура (любой Ø)','Armatur','Rebar'),'₼/кг')}
        ${row('gasblock',l3('Газоблок','Qazblok','Gas block'),'₼/м³')}
        ${row('brick',l3('Кирпич','Kərpic','Brick'),'₼/шт')}
        ${row('shell',l3('Ракушечник','Daş','Shell rock'),'₼/шт')}
        ${row('roof',l3('Кровля','Dam örtüyü','Roofing'),'₼/м²')}
        ${row('plasterCem',l3('Штукатурка цем.','Suvaq (sement)','Cement plaster'),'₼/меш')}
        ${row('plasterGyps',l3('Штукатурка гипс.','Suvaq (gips)','Gypsum plaster'),'₼/меш')}
        ${row('cement',l3('Цемент М400','Sement M400','Cement M400'),'₼/меш')}
        ${row('sand',l3('Песок','Qum','Sand'),'₼/м³')}
        ${row('gravel',l3('Щебень','Çınqıl','Gravel'),'₼/м³')}
        ${row('glue',l3('Клей газоблок','Qazblok yapışqanı','Block glue'),'₼/меш')}
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin:16px 0 6px">${l3('Полы и отделка','Döşəmə və bəzək','Floors & finish')}</div>
        ${row('tile',l3('Плитка / керамогранит','Plitə / keramoqranit','Tile / porcelain'),'₼/м²')}
        ${row('tileAdh',l3('Плиточный клей','Plitə yapışqanı','Tile glue'),'₼/меш')}
        ${row('grout',l3('Затирка','Dərz','Grout'),'₼/кг')}
        ${row('screed',l3('Стяжка ЦПС','Qaralama','Screed mix'),'₼/меш')}
        ${row('laminat',l3('Ламинат','Laminat','Laminate'),'₼/м²')}
        ${row('underlay',l3('Подложка','Altlıq','Underlay'),'₼/м²')}
        ${row('plank',l3('Доска','Taxta','Plank'),'₼/м²')}
        ${row('plywood',l3('Фанера','Faner','Plywood'),'₼/м²')}
        ${row('lag',l3('Лаги (брус)','Laglar','Joists'),'₼/м')}
        ${row('lacquer',l3('Лак','Lak','Lacquer'),'₼/л')}
        ${row('paint',l3('Краска','Boya','Paint'),'₼/л')}
        <button onclick="savePricesUI()" class="btn" style="width:100%;margin-top:16px;background:rgba(201,170,124,.15);color:var(--gold);border:1px solid rgba(201,170,124,.3);font-size:14px;padding:13px">${l3('Сохранить','Saxla','Save')}</button>
      </div>
    </div>`;
}
function renderMore(){
  const title=lang==='ru'?'Ещё':lang==='az'?'Daha çox':'More';
  document.getElementById('moreContent').innerHTML=`
    <div class="tab-page-title">${title}</div>
    <div style="padding:0 16px;display:flex;flex-direction:column;gap:10px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px">${lang==='ru'?'Язык':lang==='az'?'Dil':'Language'}</div>
        <div style="display:flex;gap:8px">
          ${['az','ru','en'].map(l=>`<button onclick="setLang('${l}')" style="flex:1;padding:10px;border-radius:10px;border:1px solid ${lang===l?'var(--gold)':'var(--border)'};background:${lang===l?'rgba(201,170,124,.1)':'none'};color:${lang===l?'var(--gold)':'var(--text2)'};font-size:13px;font-weight:700;cursor:pointer;font-family:'Mulish',sans-serif">${l.toUpperCase()}</button>`).join('')}
        </div>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:10px">
          <i class="ph ph-${document.documentElement.getAttribute('data-theme')==='light'?'sun':'moon'}" style="font-size:20px;color:var(--gold)"></i>
          <span style="font-size:14px;font-weight:600">${lang==='ru'?'Светлая тема':lang==='az'?'İşıqlı tema':'Light theme'}</span>
        </div>
        <div onclick="toggleTheme()" style="width:48px;height:28px;border-radius:14px;background:${document.documentElement.getAttribute('data-theme')==='light'?'var(--gold)':'rgba(255,255,255,.15)'};position:relative;cursor:pointer;transition:background .3s">
          <div style="position:absolute;top:3px;${document.documentElement.getAttribute('data-theme')==='light'?'right:3px':'left:3px'};width:22px;height:22px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,.3);transition:all .3s"></div>
        </div>
      </div>
      <button onclick="showPriceBook()" class="btn btn-secondary" style="justify-content:flex-start;gap:12px;padding:16px"><i class="ph ph-tag" style="font-size:20px"></i> ${l3('Прайс-лист материалов','Materialların qiymət cədvəli','Material price book')}<i class="ph ph-caret-right" style="font-size:16px;margin-left:auto;color:var(--text3)"></i></button>
      <button onclick="exportPDF()" class="btn btn-secondary" style="justify-content:flex-start;gap:12px;padding:16px"><i class="ph ph-file" style="font-size:20px"></i> PDF ${lang==='ru'?'Экспорт':'Export'}</button>
      <button onclick="showCalc()" class="btn btn-secondary" style="justify-content:flex-start;gap:12px;padding:16px"><i class="ph ph-calculator" style="font-size:20px"></i> ${lang==='ru'?'Калькулятор материалов':'Material calculator'}</button>
      <button onclick="showPhotoGallery()" class="btn btn-secondary" style="justify-content:flex-start;gap:12px;padding:16px"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor" style="flex-shrink:0"><path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.72,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.65-3.56L100.28,48h55.44l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"/></svg> ${lang==='ru'?'Галерея фото':'Photo gallery'}</button>
      <button onclick="pinSettings()" class="btn btn-secondary" style="justify-content:flex-start;gap:12px;padding:16px"><i class="ph ph-lock" style="font-size:20px"></i> PIN</button>
      <!-- Firebase Auth -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px 16px">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">☁️ ${l3('Облачный аккаунт','Bulud hesabı','Cloud account')}</div>
        ${_fbUser?`
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <img src="${_fbUser.photoURL||''}" style="width:36px;height:36px;border-radius:50%;${_fbUser.photoURL?'':'display:none'}"/>
            <div>
              <div style="font-size:13px;font-weight:600">${_fbUser.displayName||''}</div>
              <div style="font-size:11px;color:var(--text3)">${_fbUser.email||''}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="cloudSave();showToast('Синхронизировано ✓')" class="btn btn-sm" style="flex:1;background:rgba(128,200,154,.1);color:var(--green);border:1px solid rgba(128,200,154,.2)">☁️ ${l3('Синхronizasiya','Sinxronizasiya','Sync now')}</button>
            <button onclick="signOut()" class="btn btn-sm btn-secondary">${l3('Выйти','Çıxış','Sign out')}</button>
          </div>
        `:`
          <div style="font-size:13px;color:var(--text2);margin-bottom:10px">${lang==='ru'?'Войдите чтобы данные сохранялись в облаке и были доступны на всех устройствах':'Sign in to sync data across devices'}</div>
          <button onclick="signInWithGoogle()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:white;color:#1f1f1f;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:600;font-family:'Mulish',sans-serif;cursor:pointer">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            ${l3('Войти через Google','Google ilə daxil ol','Sign in with Google')}
          </button>
        `}
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px 16px;font-size:11px;color:var(--text3);display:flex;align-items:center;gap:10px">
        <i class="ph ph-coins" style="font-size:16px"></i>
        ${lang==='ru'?'Данные хранятся на устройстве':'Data stored on device'}
        <span id="storageBadge" style="margin-left:4px;color:var(--gold)"></span>
      </div>
    </div>`;
  // Импорт
  setTimeout(()=>{
    const btn=document.getElementById('moreImportBtn');
    if(btn)btn.onclick=()=>document.getElementById('importFile').click();
  },0);
  updateStorageBadge();
}

function onTabAdd(){
  const onPos=!document.getElementById('pagePos').classList.contains('page-hidden-right');
  const onDetail=!document.getElementById('pageDetail').classList.contains('page-hidden-right');
  // На детальных страницах — контекстное действие
  if(onPos){
    const wf=document.getElementById('workFormOuter');
    if(wf&&wf.style.display==='none'){toggleWorkForm();}
    document.getElementById('workFormOuter')?.scrollIntoView({behavior:'smooth',block:'center'});
    document.getElementById('newWorkName')?.focus();
    return;
  }
  if(onDetail){
    document.getElementById('newPosName')?.focus();
    document.getElementById('newPosName')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  // На главных экранах — быстрое меню
  showQuickActions();
}

function showObjectFinanceDetail(objId){
  const o=db.objects.find(x=>x.id===objId);
  if(!o)return;
  // Скрываем текущие страницы
  Object.values(TAB_PAGES).forEach(pg=>{
    const el=document.getElementById(pg);
    if(el&&!el.classList.contains('page-hidden-right'))el.classList.add('page-hidden-left');
  });
  const page=document.getElementById('pageObjFinance');
  page.classList.remove('page-hidden-right','page-hidden-left');

  const stages=o.stages||[];
  const totalBudget=o.totalBudget||0;
  const totalSpent=stages.reduce((a,s)=>a+stageFact(s),0);
  const totalDebt=stages.reduce((a,s)=>(s.positions||[]).reduce((b,p)=>(p.works||[]).reduce((c,w)=>c+Math.max(0,(w.contractAmount||0)-(w.paid||0)),b),a),0);
  const spentPct=totalBudget>0?Math.min(totalSpent/totalBudget*100,100):0;
  const isOver=totalBudget>0&&totalSpent>totalBudget;

  const STATUS_LABEL={done:lang==='ru'?'Готово':'Done',active:lang==='ru'?'В работе':'Active',idle:lang==='ru'?'Не начат':'Idle'};
  const STATUS_COLOR={done:'var(--green)',active:'var(--gold)',idle:'var(--text3)'};

  const stagesHTML=stages.map(s=>{
    const sFact=stageFact(s);
    const sSmeta=stageSmeta(s);
    const sPct=sSmeta>0?Math.min(sFact/sSmeta*100,100):0;
    const sOver=sSmeta>0&&sFact>sSmeta;
    const sDebt=(s.positions||[]).reduce((a,p)=>(p.works||[]).reduce((b,w)=>b+Math.max(0,(w.contractAmount||0)-(w.paid||0)),a),0);
    const worksCount=(s.positions||[]).reduce((a,p)=>a+(p.works||[]).filter(w=>(w.contractAmount||0)>0).length,0);
    const matsCount=(s.positions||[]).reduce((a,p)=>a+(p.mats||[]).filter(m=>((m.qty||0)*(m.price||0))>0).length,0);
    const isDone=s.status==='done';
    const isActive=s.status==='active';
    const col=isDone?'var(--green)':isActive?s.color||'var(--gold)':'var(--text3)';

    return`<div style="background:var(--bg2);border:1px solid ${sDebt>0&&!isDone?'rgba(204,123,123,.25)':isDone?'rgba(128,200,154,.2)':'var(--border)'};border-radius:14px;margin-bottom:8px;overflow:hidden;cursor:pointer" onclick="closeObjFinanceDetail();goDetail('${s.id}')">
      <div style="padding:13px 14px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:22px;flex-shrink:0">${s.icon||'🏗'}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</span>
              <span style="font-size:10px;color:${col};font-weight:600;flex-shrink:0">${STATUS_LABEL[s.status||'idle']}</span>
            </div>
            ${sSmeta>0?`<div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-bottom:6px">
              <div style="height:100%;width:${sPct}%;background:${sOver?'var(--red)':col};border-radius:2px;transition:width .4s"></div>
            </div>`:''}
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span style="font-size:12px;font-family:'DM Mono',monospace;font-weight:700;color:${sOver?'var(--red)':'var(--text)'}">${fmtShort(sFact)}</span>
              ${sSmeta>0?`<span style="font-size:11px;color:var(--text3)">/ ${fmtShort(sSmeta)}</span>`:''}
              ${sDebt>0&&!isDone?`<span style="font-size:11px;color:var(--red);font-weight:600;margin-left:auto">−${fmtShort(sDebt)}</span>`:''}
              ${isDone?`<span style="font-size:11px;color:var(--green);margin-left:auto"><i class="ph ph-check-circle"></i> ${lang==='ru'?'Оплачено':'Paid'}</span>`:''}
            </div>
            ${(worksCount||matsCount)?`<div style="font-size:10px;color:var(--text3);margin-top:5px">${worksCount?worksCount+' '+(lang==='ru'?'раб.':'works'):''}${worksCount&&matsCount?' · ':''}${matsCount?matsCount+' '+(lang==='ru'?'мат.':'mats'):''}</div>`:''}
          </div>
          <i class="ph ph-caret-right" style="font-size:16px;color:var(--text3);flex-shrink:0"></i>
        </div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('objFinanceContent').innerHTML=`
    <div style="padding:calc(var(--top) + 16px) 16px 14px;display:flex;align-items:center;gap:12px;position:sticky;top:0;background:var(--bg);z-index:5;border-bottom:1px solid var(--border)">
      <button class="back-btn" onclick="closeObjFinanceDetail()" style="flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polyline points="11,4 6,9 11,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${lang==='ru'?'Назад':'Back'}
      </button>
      <div style="font-family:'Unbounded',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1">${o.icon||''} ${o.name}</div>
    </div>
    <div style="padding:16px 16px 0">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:rgba(128,200,154,.08);border:1px solid rgba(128,200,154,.2);border-radius:12px;padding:12px">
          <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">${lang==='ru'?'Потрачено':'Spent'}</div>
          <div style="font-family:'DM Mono',monospace;font-size:17px;font-weight:700;color:var(--green)">${fmtShort(totalSpent)}</div>
          ${totalBudget>0?`<div style="font-size:10px;color:var(--text3);margin-top:1px">${lang==='ru'?'из':'of'} ${fmtShort(totalBudget)}</div>`:''}
        </div>
        <div style="background:${totalDebt>0?'rgba(204,123,123,.08)':'var(--bg2)'};border:1px solid ${totalDebt>0?'rgba(204,123,123,.2)':'var(--border)'};border-radius:12px;padding:12px">
          <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">${lang==='ru'?'Долги':'Debts'}</div>
          <div style="font-family:'DM Mono',monospace;font-size:17px;font-weight:700;color:${totalDebt>0?'var(--red)':'var(--text3)'}">${totalDebt>0?fmtShort(totalDebt):'—'}</div>
        </div>
      </div>
      ${totalBudget>0?`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-bottom:6px">
          <span>${lang==='ru'?'Бюджет':'Budget'}: ${fmtShort(totalBudget)}</span>
          <span style="color:${isOver?'var(--red)':'var(--text)'}">${isOver?'':'+'} ${fmtShort(Math.abs(totalBudget-totalSpent))} ${isOver?lang==='ru'?'перерасход':'over':lang==='ru'?'остаток':'left'}</span>
        </div>
        <div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${spentPct}%;background:${isOver?'var(--red)':spentPct>70?'var(--gold)':'var(--green)'};border-radius:3px"></div>
        </div>
        <div style="text-align:right;font-size:10px;color:var(--text3);margin-top:4px">${Math.round(spentPct)}%</div>
      </div>`:''}
      <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px">${lang==='ru'?'По этапам':'By stage'}</div>
      ${stagesHTML||`<div style="text-align:center;padding:32px 0;color:var(--text3)">${lang==='ru'?'Нет этапов':'No stages'}</div>`}
      <div style="height:calc(80px + env(safe-area-inset-bottom,0px))"></div>
    </div>`;
}

function closeObjFinanceDetail(){
  document.getElementById('pageObjFinance').classList.add('page-hidden-right');
  Object.values(TAB_PAGES).forEach(pg=>{
    const el=document.getElementById(pg);
    if(el&&el.classList.contains('page-hidden-left'))el.classList.remove('page-hidden-left');
  });
}

function showBudgetDetail(objId){
  const o=db.objects.find(x=>x.id===objId);
  if(!o)return;
  const stages=o.stages||[];
  const totalBudget=o.totalBudget||0;
  const totalFact=stages.reduce((a,s)=>a+stageFact(s),0);
  const totalSmeta=stages.reduce((a,s)=>a+stageSmeta(s),0);
  const remaining=totalBudget-totalFact;
  const isOver=remaining<0;
  const unallocated=totalBudget-totalSmeta;
  const rows=stages.map(s=>{
    const fact=stageFact(s),smeta=stageSmeta(s);
    const over=fact>smeta&&smeta>0;
    const pctSmeta=totalBudget>0?Math.min(smeta/totalBudget*100,100):0;
    const pctFact=totalBudget>0?Math.min(fact/totalBudget*100,100):0;
    return`<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:7px;min-width:0;flex:1">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.color||'var(--gold)'};flex-shrink:0"></div>
          <span style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</span>
          ${over?`<span style="font-size:9px;background:rgba(204,123,123,.15);color:var(--red);border-radius:4px;padding:1px 5px;font-weight:700;flex-shrink:0">${l3('ПЕРЕРАСХОД','HƏDDAŞIM','OVER')}</span>`:''}
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:10px">
          <span style="font-size:13px;font-weight:700;font-family:'DM Mono',monospace;color:${over?'var(--red)':'var(--text)'}">${fmt(fact)}</span>
          ${smeta>0?`<span style="font-size:11px;color:var(--text3)"> / ${fmt(smeta)}</span>`:''}
        </div>
      </div>
      <div style="position:relative;height:6px;background:rgba(255,255,255,.07);border-radius:3px">
        <div style="position:absolute;left:0;top:0;height:100%;width:${pctSmeta}%;background:${s.color||'var(--gold)'};opacity:.25;border-radius:3px"></div>
        <div style="position:absolute;left:0;top:0;height:100%;width:${pctFact}%;background:${over?'var(--red)':s.color||'var(--gold)'};border-radius:3px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:3px">
        <span style="font-size:9px;color:var(--text3)">${l3('смета','smeta','est.')} ${fmt(smeta)}</span>
        <span style="font-size:9px;color:var(--text3)">${totalBudget>0?Math.round(fact/totalBudget*100)+'% '+l3('бюджета','büdcə','of budget'):''}</span>
      </div>
    </div>`;
  }).join('');
  showModal(`<div class="modal-handle"></div>
    <div style="margin-bottom:18px">
      <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin-bottom:6px">${l3('Бюджет проекта','Layihə büdcəsi','Project budget')}</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px">
        <div>
          <div style="font-size:28px;font-weight:800;font-family:'DM Mono',monospace">${totalBudget>0?fmt(totalBudget):'—'}</div>
          <div style="font-size:12px;color:var(--text3);margin-top:2px">${l3('общий бюджет','ümumi büdcə','total budget')}</div>
        </div>
        ${totalBudget>0?`<div style="text-align:right">
          <div style="font-size:20px;font-weight:700;font-family:'DM Mono',monospace;color:${isOver?'var(--red)':'var(--green)'}">${isOver?'−':'+'} ${fmt(Math.abs(remaining))}</div>
          <div style="font-size:11px;color:${isOver?'var(--red)':'var(--text3)'}">${isOver?l3('перерасход','həddaşım','over budget'):l3('остаток','qalıq','remaining')}</div>
        </div>`:''}
      </div>
      ${totalBudget>0?`<div style="height:8px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden;margin-bottom:6px">
        <div style="height:100%;width:${Math.min(totalFact/totalBudget*100,100)}%;background:${isOver?'var(--red)':'var(--gold)'};border-radius:4px;transition:width .4s"></div>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="font-size:11px;color:var(--text3)">${l3('потрачено','xərcləndi','spent')} ${fmt(totalFact)}</span>
        <span style="font-size:11px;color:var(--text3)">${Math.round(totalFact/totalBudget*100)}%</span>
      </div>`:''}
    </div>
    <div style="background:var(--bg3);border-radius:12px;padding:12px 14px;margin-bottom:16px;display:flex;justify-content:space-between;gap:12px">
      <div><div style="font-size:10px;color:var(--text3);margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">${l3('СМЕТА ЭТАПОВ','MƏRHƏLƏ SMETASİ','STAGES EST.')}</div><div style="font-size:15px;font-weight:700;font-family:'DM Mono',monospace">${fmt(totalSmeta)}</div></div>
      <div style="width:1px;background:var(--border)"></div>
      <div><div style="font-size:10px;color:var(--text3);margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px">${l3('НЕ РАСПРЕДЕЛЕНО','BÖLÜŞDÜRÜLMƏYIB','UNALLOCATED')}</div><div style="font-size:15px;font-weight:700;font-family:'DM Mono',monospace;color:${unallocated<0?'var(--red)':unallocated===0?'var(--text)':'var(--text3)'}">${fmt(Math.abs(unallocated))}</div></div>
    </div>
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin-bottom:12px">${l3('По этапам','Mərhələlərə görə','By stage')}</div>
    ${rows||`<div style="text-align:center;padding:20px;color:var(--text3)">${l3('Нет этапов','Mərhələ yoxdur','No stages')}</div>`}
    <button onclick="closeModal();editObjectPrompt('${o.id}')" class="btn btn-secondary" style="width:100%;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:8px"><i class="ph ph-pencil-simple"></i> ${l3('Изменить бюджет','Büdcəni dəyiş','Edit budget')}</button>
    <button class="btn btn-secondary" onclick="closeModal()" style="width:100%">${l3('Закрыть','Bağla','Close')}</button>`);
}

function showDebtsDetail(objId){
  const o=db.objects.find(x=>x.id===objId);
  if(!o)return;
  // Собираем все долги
  const debts=[];
  (o.stages||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
    const debt=Math.max(0,(w.contractAmount||0)-(w.paid||0));
    if(debt>0)debts.push({stageId:s.id,posId:p.id,workId:w.id,stageName:s.name,stageColor:s.color||'var(--gold)',posName:p.name,name:w.name||l3('Без имени','Adsız','No name'),contractor:w.contractor||'',phone:w.phone||'',debt,contract:w.contractAmount||0,paid:w.paid||0});
  })));
  debts.sort((a,b)=>b.debt-a.debt);
  const total=debts.reduce((a,d)=>a+d.debt,0);
  const debtRows=debts.length?debts.map(d=>`
    <div style="background:var(--bg3);border-radius:14px;padding:14px;margin-bottom:10px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px">${d.name}${d.contractor&&d.contractor!==d.name?` <span style="font-size:11px;color:var(--text3);font-weight:400">· ${d.contractor}</span>`:''}</div>
          <div style="font-size:11px;color:var(--text3);display:flex;align-items:center;gap:5px">
            <div style="width:6px;height:6px;border-radius:50%;background:${d.stageColor};flex-shrink:0"></div>
            ${d.stageName} › ${d.posName}
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:10px">
          <div style="font-size:16px;font-weight:800;font-family:'DM Mono',monospace;color:var(--red)">${fmt(d.debt)}</div>
          <div style="font-size:10px;color:var(--text3)">${fmt(d.paid)} / ${fmt(d.contract)}</div>
        </div>
      </div>
      <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-bottom:10px">
        <div style="height:100%;width:${Math.round(d.paid/d.contract*100)}%;background:var(--green);border-radius:2px"></div>
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="closeModal();quickPayWork('${d.stageId}','${d.posId}','${d.workId}')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(204,123,123,.12);border:1px solid rgba(204,123,123,.25);color:var(--red);border-radius:10px;padding:9px 12px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Mulish',sans-serif">
          <i class="ph ph-coins" style="font-size:15px"></i>${l3('Выплатить','Ödəniş','Pay')}
        </button>
        ${d.phone?`<a href="tel:${d.phone}" onclick="event.stopPropagation()" style="width:40px;display:flex;align-items:center;justify-content:center;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text2);text-decoration:none"><i class="ph ph-phone" style="font-size:16px"></i></a>`:''}
      </div>
    </div>`).join('')
  :`<div style="text-align:center;padding:24px 0;color:var(--text3);font-size:14px"><i class="ph ph-check-circle" style="font-size:32px;display:block;margin-bottom:8px;color:var(--green)"></i>${l3('Долгов нет','Borc yoxdur','No debts')}</div>`;
  showModal(`<div class="modal-handle"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:16px">
      <div>
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin-bottom:4px">${l3('Долги по проекту','Layihə borcları','Project debts')}</div>
        <div style="font-size:28px;font-weight:800;font-family:'DM Mono',monospace;color:var(--red)">${fmt(total)}</div>
      </div>
      <div style="font-size:12px;color:var(--text3)">${debts.length} ${l3('подрядч.','podratçı','contractor'+(debts.length!==1?'s':''))}</div>
    </div>
    ${debtRows}
    <button class="btn btn-secondary" onclick="closeModal()" style="width:100%;margin-top:4px">${l3('Закрыть','Bağla','Close')}</button>`);
}

function showExpensesDetail(objId){
  const o=db.objects.find(x=>x.id===objId);
  if(!o)return;
  const stages=o.stages||[];
  const totalFact=stages.reduce((a,s)=>a+stageFact(s),0);
  const totalBudget=o.totalBudget||0;
  const pct=totalBudget>0?Math.min(totalFact/totalBudget*100,100):0;
  const isOver=totalBudget>0&&totalFact>totalBudget;
  // Расходы по этапам (только с расходами)
  const stageRows=stages.filter(s=>stageFact(s)>0).sort((a,b)=>stageFact(b)-stageFact(a));
  const stageHtml=stageRows.length?stageRows.map(s=>{
    const f=stageFact(s);
    const sm=stageSmeta(s);
    const sp=sm>0?Math.min(f/sm*100,100):100;
    const over=sm>0&&f>sm;
    return`<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <div style="display:flex;align-items:center;gap:7px">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.color||'var(--gold)'};flex-shrink:0"></div>
          <span style="font-size:13px;font-weight:600;color:var(--text)">${s.name}</span>
        </div>
        <span style="font-size:13px;font-weight:700;font-family:'DM Mono',monospace;color:${over?'var(--red)':'var(--text)'}">${fmt(f)}</span>
      </div>
      <div style="height:4px;background:var(--border);border-radius:2px">
        <div style="height:100%;width:${sp}%;background:${over?'var(--red)':s.color||'var(--gold)'};border-radius:2px"></div>
      </div>
      ${sm>0?`<div style="font-size:10px;color:var(--text3);margin-top:3px;text-align:right">${fmt(f)} / ${fmt(sm)}</div>`:''}
    </div>`;
  }).join(''):`<div style="text-align:center;padding:20px 0;color:var(--text3);font-size:13px">${l3('Нет расходов','Xərc yoxdur','No expenses')}</div>`;
  // Последние выплаты
  const pays=[];
  stages.forEach(s=>(s.positions||[]).forEach(p=>(p.works||[]).forEach(w=>{
    (w.paymentHistory||[]).forEach(ph=>pays.push({date:ph.date,name:w.name,amount:ph.amount,type:ph.type||''}));
    if(!(w.paymentHistory||[]).length&&w.paid>0)pays.push({date:w.startDate||'',name:w.name,amount:w.paid,type:''});
  })));
  pays.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const recentPays=pays.slice(0,5);
  const paysHtml=recentPays.length?`
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin:16px 0 10px">${l3('Последние выплаты','Son ödənişlər','Recent payments')}</div>
    ${recentPays.map(p=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${p.name}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${p.date?new Date(p.date).toLocaleDateString(lang==='ru'?'ru-RU':'az-AZ',{day:'numeric',month:'short'}):''}${p.type?' · '+p.type:''}</div>
      </div>
      <span style="font-size:14px;font-weight:700;font-family:'DM Mono',monospace;color:var(--red)">−${fmt(p.amount)}</span>
    </div>`).join('')}`:'';
  showModal(`<div class="modal-handle"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div>
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin-bottom:4px">${tName(o)||o.name}</div>
        <div style="font-size:28px;font-weight:800;font-family:'DM Mono',monospace;color:var(--gold)">${fmt(totalFact)}</div>
        ${totalBudget>0?`<div style="font-size:12px;color:${isOver?'var(--red)':'var(--text3)'};margin-top:2px">${isOver?'⚠ '+l3('Перерасход','Həddaşım','Over budget')+' '+fmt(totalFact-totalBudget):fmt(totalBudget-totalFact)+' '+l3('остаток','qalıq','left')}</div>`:''}
      </div>
      ${totalBudget>0?`<div style="text-align:right"><div style="font-size:22px;font-weight:800;color:${isOver?'var(--red)':'var(--text)'}">${Math.round(pct)}%</div><div style="font-size:10px;color:var(--text3)">${l3('бюджета','büdcə','of budget')}</div></div>`:''}
    </div>
    ${totalBudget>0?`<div style="height:6px;background:var(--border);border-radius:3px;margin-bottom:18px"><div style="height:100%;width:${pct}%;background:${isOver?'var(--red)':'var(--gold)'};border-radius:3px;transition:width .4s"></div></div>`:''}
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin-bottom:10px">${l3('По этапам','Mərhələlərə görə','By stage')}</div>
    ${stageHtml}
    ${paysHtml}
    <div style="margin-top:16px"><button class="btn btn-secondary" onclick="closeModal()" style="width:100%">${l3('Закрыть','Bağla','Close')}</button></div>`);
}

function showQuickActions(){
  const o=curObj();
  showModal(`<div class="modal-handle"></div>
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin-bottom:14px">${l3('Быстрые действия','Sürətli əməliyyatlar','Quick actions')}</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button onclick="closeModal();addObjectPrompt()" style="display:flex;align-items:center;gap:14px;background:var(--bg3);border:none;border-radius:14px;padding:14px 16px;cursor:pointer;width:100%;text-align:left">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(201,170,124,.12);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--gold);flex-shrink:0"><i class="ph ph-buildings"></i></div>
        <div><div style="font-size:14px;font-weight:700;color:var(--text)">${l3('Новый проект','Yeni layihə','New project')}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${l3('Добавить объект строительства','Tikinti layihəsi','Add a construction project')}</div></div>
      </button>
      ${o?`<button onclick="closeModal();showStageModal(null)" style="display:flex;align-items:center;gap:14px;background:var(--bg3);border:none;border-radius:14px;padding:14px 16px;cursor:pointer;width:100%;text-align:left">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(128,200,154,.1);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--green);flex-shrink:0"><i class="ph ph-hammer"></i></div>
        <div><div style="font-size:14px;font-weight:700;color:var(--text)">${l3('Новый этап','Yeni mərhələ','New stage')}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${tName(o)||o.name}</div></div>
      </button>`:``}
      ${o?`<button onclick="closeModal();goJournal()" style="display:flex;align-items:center;gap:14px;background:var(--bg3);border:none;border-radius:14px;padding:14px 16px;cursor:pointer;width:100%;text-align:left">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(123,184,204,.1);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--blue);flex-shrink:0"><i class="ph ph-note-pencil"></i></div>
        <div><div style="font-size:14px;font-weight:700;color:var(--text)">${l3('Заметка в журнал','Jurnala qeyd','Add note')}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${l3('Записать событие или заметку','Hadisə qeyd edin','Record an event or note')}</div></div>
      </button>`:``}
      <button onclick="closeModal();switchTab('masters')" style="display:flex;align-items:center;gap:14px;background:var(--bg3);border:none;border-radius:14px;padding:14px 16px;cursor:pointer;width:100%;text-align:left">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(204,123,123,.1);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--red);flex-shrink:0"><i class="ph ph-coins"></i></div>
        <div><div style="font-size:14px;font-weight:700;color:var(--text)">${l3('Выплатить мастеру','Usta ödənişi','Pay contractor')}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${l3('Перейти к списку мастеров','Ustalar siyahısı','Go to contractors')}</div></div>
      </button>
      <button onclick="closeModal();showCalc()" style="display:flex;align-items:center;gap:14px;background:var(--bg3);border:none;border-radius:14px;padding:14px 16px;cursor:pointer;width:100%;text-align:left">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(201,170,124,.12);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--gold);flex-shrink:0"><i class="ph ph-calculator"></i></div>
        <div><div style="font-size:14px;font-weight:700;color:var(--text)">${l3('Калькулятор','Kalkulyator','Calculator')}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${l3('Материалы, бетон, арматура','Materiallar, beton','Materials & concrete')}</div></div>
      </button>
    </div>`);
}

function showProjectsPage(){
  const objs=db.objects;
  const title=lang==='ru'?'Проекты':lang==='az'?'Layihələr':'Projects';
  const addLabel=lang==='ru'?'Новый объект':lang==='az'?'Yeni obyekt':'New project';
  let html='<div class="modal-handle"></div>'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'+
      '<div class="modal-title" style="margin-bottom:0"><i class="ph ph-folder-open"></i> '+title+'</div>'+
      '<button onclick="closeModal();showObjectModal()" style="background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.2);color:var(--gold);border-radius:10px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">＋ '+addLabel+'</button>'+
    '</div>';
  objs.forEach(function(o){
    const tf=(o.stages||[]).reduce(function(a,s){return (s.positions||[]).reduce(function(b,p){return b+posFact(p);},a);},0);
    const isActive=o.id===db.activeObjectId;
    html+='<div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;margin-bottom:8px;background:'+(isActive?'rgba(201,170,124,.08)':'var(--bg3)')+';border:1px solid '+(isActive?'rgba(201,170,124,.25)':'var(--border)')+';cursor:pointer" onclick="switchToObject(\''+o.id+'\')">'+
      '<div style="width:44px;height:44px;border-radius:12px;background:rgba(201,170,124,.1);border:1px solid rgba(201,170,124,.15);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">'+o.icon+'</div>'+
      '<div style="flex:1;min-width:0">'+
        '<div style="font-size:14px;font-weight:700;margin-bottom:2px">'+(o.name||'')+'</div>'+
        '<div style="font-size:11px;color:var(--text3)">'+(o.stages||[]).length+' '+(lang==='ru'?'этапов':'stages')+' · '+fmtShort(tf)+'</div>'+
      '</div>'+
      (isActive?'<div style="font-size:16px;color:var(--gold)"><i class="ph ph-check-circle"></i></div>':'')+
    '</div>';
  });
  showModal(html);
}

function switchToObject(id){
  db.activeObjectId=id;
  saveDB();
  switchTab('home');
}

function showMorePage(){
  const title=lang==='ru'?'Ещё':lang==='az'?'Daha çox':'More';
  const html='<div class="modal-handle"></div>'+
    '<div class="modal-title">••• '+title+'</div>'+
    '<div style="display:flex;flex-direction:column;gap:8px">'+
      // Язык
      '<div style="background:var(--bg3);border-radius:14px;padding:14px 16px">'+
        '<div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">'+(lang==='ru'?'Язык':lang==='az'?'Dil':'Language')+'</div>'+
        '<div style="display:flex;gap:8px">'+
          '<button data-lang="az" style="flex:1;padding:8px;border-radius:10px;border:1px solid '+(lang==='az'?'var(--gold)':'var(--border)')+';background:'+(lang==='az'?'rgba(201,170,124,.1)':'none')+';color:'+(lang==='az'?'var(--gold)':'var(--text2)')+';font-size:13px;font-weight:600;cursor:pointer">AZ</button>'+
          '<button data-lang="ru" style="flex:1;padding:8px;border-radius:10px;border:1px solid '+(lang==='ru'?'var(--gold)':'var(--border)')+';background:'+(lang==='ru'?'rgba(201,170,124,.1)':'none')+';color:'+(lang==='ru'?'var(--gold)':'var(--text2)')+';font-size:13px;font-weight:600;cursor:pointer">RU</button>'+
          '<button data-lang="en" style="flex:1;padding:8px;border-radius:10px;border:1px solid '+(lang==='en'?'var(--gold)':'var(--border)')+';background:'+(lang==='en'?'rgba(201,170,124,.1)':'none')+';color:'+(lang==='en'?'var(--gold)':'var(--text2)')+';font-size:13px;font-weight:600;cursor:pointer">EN</button>'+
        '</div>'+
      '</div>'+
      // PDF
      '<button onclick="closeModal();exportPDF()" style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:14px 16px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer;text-align:left"><i class="ph ph-file"></i> PDF '+(lang==='ru'?'Экспорт':'Export')+'</button>'+
      // PIN
      '<button onclick="closeModal();pinSettings()" style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:14px 16px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer;text-align:left"><i class="ph ph-lock"></i> PIN</button>'+
      // Хранилище
      '<div style="background:var(--bg3);border-radius:14px;padding:12px 16px;font-size:11px;color:var(--text3)">'+
        '<i class="ph ph-coins"></i> '+(lang==='ru'?'Данные хранятся на устройстве':'Data stored on device')+
        '<span id="storageBadge" style="margin-left:8px;color:var(--gold)"></span>'+
      '</div>'+
    '</div>';
  showModal(html);
  setTimeout(function(){
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.addEventListener('click',function(){setLang(btn.dataset.lang);});
    });
    const ib=document.getElementById('moreImportBtn');
    if(ib)ib.addEventListener('click',function(){closeModal();document.getElementById('importFile').click();});
  },0);
}

function setLang(l){
  lang=l;
  localStorage.setItem('isapp_lang',l);
  const prevTab=_activeTab; // сохраняем до closeModal который может сбросить таб
  closeModal();
  _activeTab=prevTab; // восстанавливаем
  updateTabLabels();
  // Перерисовать текущую активную вкладку
  if(prevTab==='home'){renderDash();setTimeout(initCarouselDots,150);}
  else if(prevTab==='masters'){renderMasters();}
  else if(prevTab==='more'){renderMore();}
  else{renderDash();setTimeout(initCarouselDots,150);}
}

function updateTabLabels(){
  const labels={
    home:{ru:'Главная',az:'Əsas',en:'Home'},
    masters:{ru:'Мастера',az:'Ustalar',en:'Masters'},
    projects:{ru:'Проекты',az:'Layihələr',en:'Projects'},
    more:{ru:'Ещё',az:'Daha',en:'More'}
  };
  Object.keys(labels).forEach(function(t){
    const el=document.getElementById('tabLabel'+t.charAt(0).toUpperCase()+t.slice(1));
    if(el)el.textContent=labels[t][lang]||labels[t].ru;
  });
  // Бейдж на Финансы если есть должники
  const financeTab=document.getElementById('tab-finance');
  if(financeTab){
    const hasDebt=loadContractors().some(c=>getContractorStats(c.name).debt>0);
    let badge=financeTab.querySelector('.tab-badge');
    if(hasDebt&&!badge){
      badge=document.createElement('div');badge.className='tab-badge';
      financeTab.appendChild(badge);
    }else if(!hasDebt&&badge){badge.remove();}
  }
  // Убрать старый бейдж с Мастеров если остался
  document.getElementById('tab-masters')?.querySelector('.tab-badge')?.remove();
}

function setupFormScroll(){
  document.addEventListener('focusin', e=>{
    const input=e.target;
    if(!input.matches('input,textarea'))return;
    const form=input.closest('#workFormOuter,#matFormOuter');
    if(!form)return;
    setTimeout(()=>{
      form.scrollIntoView({behavior:'smooth',block:'nearest'});
      input.scrollIntoView({behavior:'smooth',block:'center'});
    },300);
  });
}
function toggleWorkExtra(){
  const el=document.getElementById('workExtraFields');
  const btn=document.getElementById('workExtraBtn');
  if(!el)return;
  const open=el.style.display==='none';
  el.style.display=open?'block':'none';
  if(btn)btn.textContent=(open?'▾ ':'▸ ')+(lang==='ru'?'Дополнительно':lang==='az'?'Əlavə':'More');
}
function fadeOutForm(el, cb){
  if(!el||el.style.display==='none'){if(cb)cb();return;}
  el.style.transition='opacity .2s ease';
  el.style.opacity='0';
  setTimeout(()=>{
    el.style.display='none';
    el.style.opacity='';
    el.style.transition='';
    if(cb)cb();
  },200);
}
function toggleWorkForm(){
  const outer=document.getElementById('workFormOuter');
  const matOuter=document.getElementById('matFormOuter');
  if(!outer)return;
  const open=outer.style.display==='none';
  if(open){
    if(matOuter)matOuter.style.display='none';
    outer.style.display='block';
    outer.style.opacity='0';
    outer.classList.remove('form-slide');void outer.offsetWidth;
    outer.classList.add('form-slide');
    outer.style.opacity='';
  } else {
    fadeOutForm(outer);
  }
}
function toggleMatForm(){
  const outer=document.getElementById('matFormOuter');
  const workOuter=document.getElementById('workFormOuter');
  if(!outer)return;
  const open=outer.style.display==='none';
  if(open){
    if(workOuter)workOuter.style.display='none';
    outer.style.display='block';
    outer.style.opacity='0';
    outer.classList.remove('form-slide');void outer.offsetWidth;
    outer.classList.add('form-slide');
    outer.style.opacity='';
  } else {
    fadeOutForm(outer);
  }
}
function animateNums(){
  // Анимируем все числа с классом stat-val на текущей странице
  document.querySelectorAll('.stat-val,.bb-val,.scs-val').forEach(el=>{
    el.classList.remove('num-pop');
    void el.offsetWidth;
    el.classList.add('num-pop');
  });
}
