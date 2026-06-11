const Views = (() => {
  const { escape, fmtDate, fmtDateTime, fmtDateInput, statusLabel } = UI;
  const view = () => document.getElementById('view');

  const ICONS = {
    device: '<svg viewBox="0 0 24 24" class="ico"><path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm-5 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4H7V4h10v14z"/></svg>',
    person: '<svg viewBox="0 0 24 24" class="ico"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" class="ico"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h5v-2h-4V6h-2v7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" class="ico"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
    box: '<svg viewBox="0 0 24 24" class="ico"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8zm-9 12l-7-4V9.5l7 3.9 7-3.9V16l-7 4z"/></svg>',
    search: '<svg viewBox="0 0 24 24" class="ico"><path d="M21 20l-5.6-5.6a8 8 0 1 0-1.4 1.4L19.6 21.4 21 20zM4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0z"/></svg>',
    camera: '<svg viewBox="0 0 24 24" class="ico"><path d="M9 3l-2 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3l-2-2H9zm3 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" class="ico"><path d="M3 17.2V21h3.8L17.8 9.9l-3.8-3.8L3 17.2zM20.7 7.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L15 4.9l3.8 3.8 1.9-1.4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" class="ico"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" class="ico"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" class="ico"><path d="M6 6h12v12H6z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" class="ico"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" class="ico"><path d="M19 18H6a4 4 0 0 1-.5-7.97A6 6 0 0 1 17 9a4 4 0 0 1 2 9z"/></svg>',
    save: '<svg viewBox="0 0 24 24" class="ico"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" class="ico"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1l-2.23 2.2z"/></svg>',
    upload: '<svg viewBox="0 0 24 24" class="ico"><path d="M9 16V10H5l7-7 7 7h-4v6H9zm-4 4v-2h14v2H5z"/></svg>'
  };

  // Estados disponibles (sin "awaiting" — quitado a pedido)
  const STATUS_KEYS = ['pending','in_progress','completed','delivered'];

  function emptyState(t,s){
    return `<div class="empty">${ICONS.box.replace('class="ico"','class="ico lg"')}<h3>${escape(t)}</h3><p>${escape(s)}</p></div>`;
  }

  function repairCard(r){
    const cover = (r.devicePhotos && r.devicePhotos[0]) || r.devicePhoto;
    const thumb = cover ? `<img src="${cover}" alt="">` : ICONS.device;
    return `
      <div class="repair-card" data-id="${r.id}">
        <div class="thumb">${thumb}</div>
        <div class="repair-info">
          <h3>${escape(r.device||'Equipo')} ${r.brand?'· '+escape(r.brand):''}</h3>
          <p>${escape(r.clientName||'Cliente')} · ${escape(r.id)}</p>
          <span class="status ${r.status}">${statusLabel(r.status)}</span>
        </div>
      </div>`;
  }
  function bindRepairCards(){
    view().querySelectorAll('.repair-card').forEach(c=>{
      c.addEventListener('click', ()=> showRepair(c.dataset.id));
    });
  }

  // Agrupación elegante por fecha
  function groupByDate(list){
    const now = new Date();
    const today0 = new Date(now); today0.setHours(0,0,0,0);
    const yest0 = new Date(today0); yest0.setDate(yest0.getDate()-1);
    // inicio de la semana (lunes)
    const wd = (today0.getDay()+6)%7;
    const week0 = new Date(today0); week0.setDate(week0.getDate()-wd);
    const month0 = new Date(today0.getFullYear(), today0.getMonth(), 1);
    const lastMonth0 = new Date(today0.getFullYear(), today0.getMonth()-1, 1);
    const year0 = new Date(today0.getFullYear(), 0, 1);

    const groups = [
      {key:'today', label:'Hoy', items:[]},
      {key:'yest', label:'Ayer', items:[]},
      {key:'week', label:'Esta semana', items:[]},
      {key:'month', label:'Este mes', items:[]},
      {key:'lmonth', label:'Mes pasado', items:[]},
      {key:'year', label:'Este año', items:[]},
      {key:'old', label:'Años anteriores', items:[]}
    ];
    for(const r of list){
      const t = r.createdAt || 0;
      if(t >= today0.getTime()) groups[0].items.push(r);
      else if(t >= yest0.getTime()) groups[1].items.push(r);
      else if(t >= week0.getTime()) groups[2].items.push(r);
      else if(t >= month0.getTime()) groups[3].items.push(r);
      else if(t >= lastMonth0.getTime()) groups[4].items.push(r);
      else if(t >= year0.getTime()) groups[5].items.push(r);
      else groups[6].items.push(r);
    }
    return groups.filter(g=>g.items.length);
  }

  // ============= DASHBOARD =============
  function dashboard(){
    const repairs = DB.repairs;
    const pending = DB.byStatus('pending').length + DB.byStatus('in_progress').length;
    const todayPending = DB.todayPending().length;
    const completed = DB.byStatus('completed').length + DB.byStatus('delivered').length;
    const recent = repairs.slice(0,5);

    view().innerHTML = `
      <div class="greeting">Bienvenido a <span>${escape(DB.settings.appName)}</span></div>
      ${todayPending>0 ? `
        <div class="admin-card" style="border-left:3px solid #ff7b6b;background:linear-gradient(90deg,rgba(255,123,107,.1),var(--surface))">
          <div class="row-between"><div>
            <h3>Reparaciones para hoy</h3>
            <p>Tienes <b>${todayPending}</b> reparación(es) con entrega para hoy o vencidas</p>
          </div>${ICONS.clock}</div>
        </div>` : ''}
      <div class="stats-grid two">
        <div class="stat-card pending" data-go="repairs:pending">${ICONS.clock}<div class="stat-num">${pending}</div><div class="stat-lbl">Pendientes</div></div>
        <div class="stat-card success" data-go="repairs:completed">${ICONS.check}<div class="stat-num">${completed}</div><div class="stat-lbl">Completadas</div></div>
      </div>
      <div class="section-title">Recientes</div>
      ${recent.length ? recent.map(repairCard).join('') : emptyState('Aún no hay reparaciones','Pulsa el botón + para registrar la primera')}
    `;
    view().querySelectorAll('[data-go]').forEach(el=>{
      el.addEventListener('click', ()=>{
        const [v, f] = el.dataset.go.split(':'); App.go(v, f);
      });
    });
    bindRepairCards();
  }

  // ============= LISTA =============
  function repairsList(filter){
    let list = DB.repairs;
    const filters = [
      {k:'all',label:'Todas'},{k:'pending',label:'Pendientes'},{k:'in_progress',label:'En proceso'},
      {k:'completed',label:'Completadas'},{k:'delivered',label:'Entregadas'}
    ];
    const active = filter || 'all';
    if(active!=='all') list = list.filter(r=>r.status===active);

    // siempre agrupar por fecha (elegante)
    const groups = groupByDate(list);
    const grouped = groups.map(g=>`
      <div class="date-group-header">
        <span class="dg-line"></span>
        <span class="dg-label">${escape(g.label)}</span>
        <span class="dg-count">${g.items.length}</span>
      </div>
      ${g.items.map(repairCard).join('')}
    `).join('');

    view().innerHTML = `
      <div class="chips">${filters.map(f=>`<button class="chip ${f.k===active?'active':''}" data-f="${f.k}">${f.label}</button>`).join('')}</div>
      ${list.length ? grouped : emptyState('Sin reparaciones','No hay registros en esta categoría')}
    `;
    view().querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>repairsList(c.dataset.f)));
    bindRepairCards();
  }

  // ============= NUEVA / EDITAR =============
  // Nuevo "Sin datos" elegante: botón pill en la esquina del campo
  function naWrap(fieldKey, label, inputHtml, naFields){
    const isNa = naFields.includes(fieldKey);
    return `<div class="form-group na-group ${isNa?'is-na':''}" data-na-group="${fieldKey}">
      <div class="label-row">
        <label>${label}</label>
        <button type="button" class="na-pill" data-na="${fieldKey}" aria-pressed="${isNa?'true':'false'}">
          <span class="dot"></span><span class="txt">${isNa?'Sin datos':'Marcar sin datos'}</span>
        </button>
      </div>
      <div class="na-input">${inputHtml}</div>
      <div class="na-placeholder">Sin datos asignados</div>
    </div>`;
  }

  function newRepair(existing){
    const r = existing || {};
    const photos = { device: (r.devicePhotos||[]).slice(), client: r.clientPhoto || null };
    let acceptAudio = r.acceptAudio || null;
    const naFields = (r.naFields||[]).slice();
    const phones = (r.clientPhones && r.clientPhones.length)
      ? r.clientPhones.slice()
      : (r.clientPhone ? [r.clientPhone] : ['']);
    if(!phones.length) phones.push('');

    const deviceOptions = DB.settings.deviceTypes.map(d=>`<option value="${escape(d)}">`).join('');

    view().innerHTML = `
      <h2 style="margin:0 0 16px;font-size:20px">${existing?'Editar reparación':'Nueva reparación'}</h2>
      <form id="repairForm" novalidate>

        <div class="section-title">Foto del cliente</div>
        <div class="photo-grid single">
          <label class="photo-input ${photos.client?'has-img':''}" id="clientPhotoBox"></label>
        </div>

        <div class="section-title">Fotos del equipo</div>
        <div id="devicePhotos" class="multi-photo-grid"></div>
        <label class="photo-add-btn">
          ${ICONS.plus}<span>Añadir foto del equipo</span>
          <input type="file" accept="image/*" capture="environment" id="addDevicePhoto" multiple>
        </label>

        <div class="section-title">Cliente</div>
        <div class="form-group">
          <label>Nombre del cliente *</label>
          <input name="clientName" id="clientNameInput" required autocapitalize="words" value="${escape(r.clientName||'')}">
        </div>

        <div class="form-group na-group ${naFields.includes('clientPhones')?'is-na':''}" data-na-group="clientPhones">
          <div class="label-row">
            <label>Teléfonos</label>
            <button type="button" class="na-pill" data-na="clientPhones" aria-pressed="${naFields.includes('clientPhones')?'true':'false'}">
              <span class="dot"></span><span class="txt">${naFields.includes('clientPhones')?'Sin datos':'Marcar sin datos'}</span>
            </button>
          </div>
          <div class="na-input">
            <div id="phonesList" class="phones-list"></div>
            <button type="button" class="btn-secondary btn-inline" id="addPhoneBtn">${ICONS.plus} Añadir otro número</button>
          </div>
          <div class="na-placeholder">Sin datos asignados</div>
        </div>

        ${naWrap('clientEmail','Email',`<input name="clientEmail" type="email" inputmode="email" value="${escape(r.clientEmail||'')}">`,naFields)}
        ${naWrap('clientAddress','Dirección',`<textarea name="clientAddress" rows="2">${escape(r.clientAddress||'')}</textarea>`,naFields)}
        ${naWrap('clientIdNumber','Nº de identidad',`<input name="clientIdNumber" value="${escape(r.clientIdNumber||'')}">`,naFields)}

        <div class="section-title">Equipo</div>
        <div class="form-group">
          <label>Equipo *</label>
          <input name="device" list="deviceTypesList" required placeholder="Selecciona o escribe" value="${escape(r.device||'')}">
          <datalist id="deviceTypesList">${deviceOptions}</datalist>
        </div>
        ${naWrap('brand','Marca',`<input name="brand" value="${escape(r.brand||'')}">`,naFields)}
        ${naWrap('model','Modelo',`<input name="model" value="${escape(r.model||'')}">`,naFields)}
        ${naWrap('serial','Nº de serie',`<input name="serial" value="${escape(r.serial||'')}">`,naFields)}

        <div class="form-group">
          <label>Falla reportada *</label>
          <textarea name="issue" required>${escape(r.issue||'')}</textarea>
        </div>

        <div class="section-title">Detalles</div>
        <div class="form-row">
          <div class="form-group">
            <label>Estado</label>
            <select name="status">
              ${STATUS_KEYS.map(s=>`<option value="${s}" ${r.status===s?'selected':''}>${statusLabel(s)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Fecha entrega</label><input name="dueDate" type="date" value="${fmtDateInput(r.dueDate)}"></div>
        </div>
        ${naWrap('price','Precio',`<input name="price" type="number" step="0.01" inputmode="decimal" value="${r.price!=null?r.price:''}">`,naFields)}
        ${naWrap('deposit','Anticipo',`<input name="deposit" type="number" step="0.01" inputmode="decimal" value="${r.deposit!=null?r.deposit:''}">`,naFields)}
        ${naWrap('notes','Notas',`<textarea name="notes">${escape(r.notes||'')}</textarea>`,naFields)}

        <div class="section-title">Audio: cliente aceptando la reparación</div>
        <div class="admin-card" id="audioBox"></div>

        <button type="submit" class="btn-primary">${existing?'Guardar cambios':'Registrar reparación'}</button>
      </form>
    `;

    // Auto-capitalización del nombre
    UI.attachAutoCapitalize(document.getElementById('clientNameInput'));

    // ---- Teléfonos múltiples ----
    function renderPhones(){
      const wrap = document.getElementById('phonesList');
      wrap.innerHTML = phones.map((p,i)=>`
        <div class="phone-row">
          <input type="tel" inputmode="tel" placeholder="Número ${i+1}" value="${escape(p||'')}" data-phone-idx="${i}">
          ${phones.length>1?`<button type="button" class="icon-btn-sm" data-rm-phone="${i}" aria-label="Quitar">${ICONS.trash}</button>`:''}
        </div>
      `).join('');
      wrap.querySelectorAll('input[data-phone-idx]').forEach(inp=>{
        inp.addEventListener('input', e=>{ phones[+inp.dataset.phoneIdx] = e.target.value; });
      });
      wrap.querySelectorAll('[data-rm-phone]').forEach(b=>{
        b.onclick = ()=>{ phones.splice(+b.dataset.rmPhone,1); if(!phones.length) phones.push(''); renderPhones(); };
      });
    }
    renderPhones();
    document.getElementById('addPhoneBtn').onclick = ()=>{ phones.push(''); renderPhones(); };

    // ---- N/A toggles (botón pill) ----
    function applyNaState(group, isNa){
      group.classList.toggle('is-na', isNa);
      const btn = group.querySelector('.na-pill');
      btn.setAttribute('aria-pressed', isNa?'true':'false');
      btn.querySelector('.txt').textContent = isNa ? 'Sin datos' : 'Marcar sin datos';
      group.querySelectorAll('.na-input input, .na-input textarea, .na-input button').forEach(el=>{
        el.disabled = isNa;
      });
    }
    view().querySelectorAll('.na-pill').forEach(btn=>{
      const key = btn.dataset.na;
      const group = btn.closest('[data-na-group]');
      applyNaState(group, naFields.includes(key));
      btn.addEventListener('click', ()=>{
        const idx = naFields.indexOf(key);
        if(idx>=0){ naFields.splice(idx,1); applyNaState(group,false); }
        else { naFields.push(key); applyNaState(group,true); }
      });
    });

    // ---- fotos del equipo (multi) ----
    function renderDevicePhotos(){
      const wrap = document.getElementById('devicePhotos');
      if(!photos.device.length){ wrap.innerHTML = '<p class="muted small">Aún no hay fotos del equipo.</p>'; return; }
      wrap.innerHTML = photos.device.map((src,i)=>`
        <div class="photo-item">
          <img src="${src}" data-view-dev="${i}">
          <button type="button" class="photo-remove" data-rm-dev="${i}">${ICONS.trash}</button>
        </div>
      `).join('');
      wrap.querySelectorAll('[data-rm-dev]').forEach(b=>{
        b.onclick = e=>{ e.preventDefault(); e.stopPropagation(); photos.device.splice(+b.dataset.rmDev,1); renderDevicePhotos(); };
      });
      wrap.querySelectorAll('[data-view-dev]').forEach(img=>{
        img.onclick = ()=> UI.openImageViewer(photos.device, +img.dataset.viewDev);
      });
    }
    renderDevicePhotos();
    document.getElementById('addDevicePhoto').addEventListener('change', async e=>{
      for(const f of Array.from(e.target.files||[])){
        try{ photos.device.push(await UI.resizeImage(f)); }catch(err){ UI.toast('Error con imagen'); }
      }
      e.target.value = '';
      renderDevicePhotos();
    });

    // ---- foto cliente ----
    function renderClient(){
      const box = document.getElementById('clientPhotoBox');
      box.classList.toggle('has-img', !!photos.client);
      box.innerHTML = photos.client
        ? `<img src="${photos.client}" id="clientPhotoImg"><input type="file" accept="image/*" capture="user" id="clientPhotoInput"><button type="button" class="photo-remove" id="clientPhotoRm">${ICONS.trash}</button>`
        : `${ICONS.person}<span>Foto del cliente</span><input type="file" accept="image/*" capture="user" id="clientPhotoInput">`;
      const inp = document.getElementById('clientPhotoInput');
      if(inp) inp.onchange = async e=>{
        const f = e.target.files[0]; if(!f) return;
        try{ photos.client = await UI.resizeImage(f); renderClient(); }catch(err){ UI.toast('Error con imagen'); }
      };
      const rm = document.getElementById('clientPhotoRm');
      if(rm) rm.onclick = e=>{ e.preventDefault(); e.stopPropagation(); photos.client = null; renderClient(); };
      const img = document.getElementById('clientPhotoImg');
      if(img) img.onclick = e=>{ e.stopPropagation(); UI.openImageViewer(photos.client); };
    }
    renderClient();

    // ---- audio ----
    let rec = null;
    let autoStartAttempted = false;
    function renderAudio(){
      const box = document.getElementById('audioBox');
      if(acceptAudio){
        box.innerHTML = `<audio controls src="${acceptAudio}" style="width:100%"></audio>
          <button type="button" class="btn-secondary" id="rmAudio" style="margin-top:10px">${ICONS.trash} Eliminar audio</button>`;
        document.getElementById('rmAudio').onclick = ()=>{ acceptAudio = null; renderAudio(); };
      } else {
        box.innerHTML = `
          <p class="muted small">Graba al cliente diciendo que acepta la reparación. Opcional.</p>
          <div class="audio-controls">
            <button type="button" class="btn-primary btn-inline" id="recStart">${ICONS.mic} Grabar</button>
            <button type="button" class="btn-secondary btn-inline" id="recStop" style="display:none">${ICONS.stop} Detener</button>
            <span id="recTimer" class="muted small"></span>
          </div>
          <label class="file-pill" for="audioFile">${ICONS.upload}<span>Subir archivo de audio</span></label>
          <input type="file" accept="audio/*" id="audioFile" hidden>
        `;
        const recStart = document.getElementById('recStart');
        const recStop = document.getElementById('recStop');
        async function startRec(){
          try{
            rec = UI.createRecorder();
            await rec.start(s=>{ const t = document.getElementById('recTimer'); if(t) t.textContent = `Grabando... ${s}s`; });
            recStart.style.display = 'none';
            recStop.style.display = '';
            return true;
          }catch(e){ return false; }
        }
        recStart.onclick = async ()=>{
          if(!(await startRec())) UI.toast('No se pudo acceder al micrófono');
        };
        recStop.onclick = async ()=>{
          try{ acceptAudio = await rec.stop(); renderAudio(); }catch(e){ UI.toast('Error al detener'); }
        };
        document.getElementById('audioFile').onchange = async e=>{
          const f = e.target.files[0]; if(!f) return;
          acceptAudio = await UI.blobToDataUrl(f); renderAudio();
        };

        // Auto-iniciar grabación al abrir Nueva Reparación
        if(!existing && !autoStartAttempted){
          autoStartAttempted = true;
          setTimeout(async ()=>{
            const ok = await startRec();
            if(!ok){
              // permiso denegado u otro error: queda listo para iniciar manualmente
              UI.toast('Pulsa Grabar para iniciar el audio');
            }
          }, 250);
        }
      }
    }
    renderAudio();

    // ---- submit ----
    document.getElementById('repairForm').addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {};
      ['clientName','clientEmail','clientAddress','clientIdNumber','device','brand','model','serial','issue','status','notes'].forEach(k=>{
        const v = fd.get(k);
        data[k] = naFields.includes(k) ? null : (v != null ? String(v).trim() || null : null);
      });
      data.clientName = (fd.get('clientName')||'').trim(); // requerido
      data.device = fd.get('device');
      data.issue = fd.get('issue');
      data.status = fd.get('status');
      // Teléfonos
      const cleanPhones = naFields.includes('clientPhones') ? [] : phones.map(p=>String(p||'').trim()).filter(Boolean);
      data.clientPhones = cleanPhones;
      data.clientPhone = cleanPhones[0] || null; // compat
      const due = fd.get('dueDate');
      data.dueDate = due ? new Date(due).getTime() : null;
      const price = fd.get('price'); const dep = fd.get('deposit');
      data.price = naFields.includes('price') ? null : (price ? parseFloat(price) : null);
      data.deposit = naFields.includes('deposit') ? null : (dep ? parseFloat(dep) : null);
      data.devicePhotos = photos.device;
      data.devicePhoto = photos.device[0] || null;
      data.clientPhoto = photos.client;
      data.acceptAudio = acceptAudio;
      data.naFields = naFields;

      if(existing){
        DB.updateRepair(existing.id, data);
        UI.toast('Reparación actualizada');
      } else {
        const nr = DB.addRepair(data);
        UI.toast('Reparación registrada: '+nr.id);
      }
      App.go('repairs');
    });
  }

  // ============= DETALLE =============
  function showRepair(id){
    const r = DB.findRepair(id);
    if(!r) return;
    const photos = (r.devicePhotos && r.devicePhotos.length) ? r.devicePhotos : (r.devicePhoto?[r.devicePhoto]:[]);
    const naFields = r.naFields || [];

    // Devuelve HTML seguro: o "Sin datos" estilizado, o el valor escapado, o em-dash
    function valHtml(key, transform){
      if(naFields.includes(key)) return '<span class="na-tag">Sin datos</span>';
      let v = r[key];
      if(v == null || v === '') return '<span class="muted">—</span>';
      return transform ? transform(v) : escape(v);
    }

    // Teléfonos
    const phones = (r.clientPhones && r.clientPhones.length) ? r.clientPhones : (r.clientPhone?[r.clientPhone]:[]);
    let phonesHtml;
    if(naFields.includes('clientPhones') || naFields.includes('clientPhone')){
      phonesHtml = '<span class="na-tag">Sin datos</span>';
    } else if(!phones.length){
      phonesHtml = '<span class="muted">—</span>';
    } else {
      phonesHtml = `<div class="phones-display">${phones.map(p=>`
        <a class="phone-link" href="tel:${escape(p)}">${ICONS.phone}<span>${escape(p)}</span></a>
      `).join('')}</div>`;
    }

    const html = `
      <h2 style="margin:0 0 4px;font-size:20px">${escape(r.device||'Equipo')}</h2>
      <p class="muted" style="margin:0 0 14px">${escape(r.id)} · <span class="status ${r.status}">${statusLabel(r.status)}</span></p>

      ${photos.length ? `<div class="detail-photo-strip">${photos.map((p,i)=>`<img src="${p}" data-view-idx="${i}">`).join('')}</div>` : ''}
      ${r.clientPhoto ? `<div class="detail-photos"><div class="thumb-big"><img src="${r.clientPhoto}" id="detailClientPhoto"></div></div>` : ''}

      <div class="detail-row"><span class="lbl">Cliente</span><span class="val">${escape(r.clientName||'—')}</span></div>
      <div class="detail-row"><span class="lbl">Teléfono</span><span class="val">${phonesHtml}</span></div>
      <div class="detail-row"><span class="lbl">Email</span><span class="val">${valHtml('clientEmail', v=>`<a href="mailto:${escape(v)}" class="link">${escape(v)}</a>`)}</span></div>
      <div class="detail-row"><span class="lbl">Dirección</span><span class="val">${valHtml('clientAddress')}</span></div>
      <div class="detail-row"><span class="lbl">Nº identidad</span><span class="val">${valHtml('clientIdNumber')}</span></div>
      <div class="detail-row"><span class="lbl">Marca</span><span class="val">${valHtml('brand')}</span></div>
      <div class="detail-row"><span class="lbl">Modelo</span><span class="val">${valHtml('model')}</span></div>
      <div class="detail-row"><span class="lbl">Nº serie</span><span class="val">${valHtml('serial')}</span></div>
      <div class="detail-row"><span class="lbl">Falla</span><span class="val">${escape(r.issue||'—')}</span></div>
      <div class="detail-row"><span class="lbl">Notas</span><span class="val">${valHtml('notes')}</span></div>
      <div class="detail-row"><span class="lbl">Ingreso</span><span class="val">${fmtDate(r.createdAt)}</span></div>
      <div class="detail-row"><span class="lbl">Entrega</span><span class="val">${r.dueDate?fmtDate(r.dueDate):'—'}</span></div>
      <div class="detail-row"><span class="lbl">Precio</span><span class="val">${naFields.includes('price')?'<span class="na-tag">Sin datos</span>':(r.price!=null?Number(r.price).toFixed(2):'<span class="muted">—</span>')}</span></div>
      <div class="detail-row"><span class="lbl">Anticipo</span><span class="val">${naFields.includes('deposit')?'<span class="na-tag">Sin datos</span>':(r.deposit!=null?Number(r.deposit).toFixed(2):'<span class="muted">—</span>')}</span></div>

      ${r.acceptAudio ? `<div class="section-title">Aceptación del cliente</div><audio controls src="${r.acceptAudio}" style="width:100%"></audio>` : ''}

      <div class="section-title">Cambiar estado</div>
      <div class="form-group">
        <select id="quickStatus">
          ${STATUS_KEYS.map(s=>`<option value="${s}" ${r.status===s?'selected':''}>${statusLabel(s)}</option>`).join('')}
        </select>
      </div>
      <div class="btn-row">
        <button class="btn-secondary" id="editBtn">${ICONS.edit} Editar</button>
        <button class="btn-primary btn-danger" id="delBtn">${ICONS.trash} Eliminar</button>
      </div>
    `;
    UI.openModal(html);

    // Lightbox para fotos
    document.querySelectorAll('[data-view-idx]').forEach(img=>{
      img.onclick = ()=> UI.openImageViewer(photos, +img.dataset.viewIdx);
    });
    const cp = document.getElementById('detailClientPhoto');
    if(cp) cp.onclick = ()=> UI.openImageViewer(r.clientPhoto);

    document.getElementById('quickStatus').addEventListener('change', e=>{
      DB.updateRepair(id, { status: e.target.value });
      UI.toast('Estado actualizado'); UI.closeModal(); App.refresh();
    });
    document.getElementById('editBtn').onclick = ()=>{ UI.closeModal(); App.go('new', null, r); };
    document.getElementById('delBtn').onclick = ()=>{
      if(confirm('¿Eliminar esta reparación?')){
        DB.deleteRepair(id); UI.toast('Eliminada'); UI.closeModal(); App.refresh();
      }
    };
  }

  // ============= BUSCAR =============
  function search(){
    view().innerHTML = `
      <div class="search-bar">${ICONS.search}
        <input id="searchInput" placeholder="Buscar cliente, equipo, teléfono o ID..." autofocus>
      </div>
      <div id="searchResults"></div>`;
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    function render(q){
      const list = DB.search(q);
      results.innerHTML = list.length ? list.map(repairCard).join('') : emptyState('Sin resultados','Prueba con otro término');
      results.querySelectorAll('.repair-card').forEach(c=>c.addEventListener('click',()=>showRepair(c.dataset.id)));
    }
    render('');
    input.addEventListener('input', e=>render(e.target.value));
  }

  // ============= ADMIN =============
  function admin(){
    const s = DB.settings;
    const g = s.github;
    const hasLocal = typeof LocalFile !== 'undefined' && LocalFile.hasHandle();
    const localSupported = typeof LocalFile !== 'undefined' && LocalFile.isSupported();

    view().innerHTML = `
      <h2 style="margin:0 0 16px;font-size:20px">Administración</h2>

      <div class="admin-card">
        <h3>Nombre del sistema</h3>
        <p>Aparece en la cabecera y pantalla de inicio</p>
        <input id="appNameInput" value="${escape(s.appName)}">
      </div>

      <div class="admin-card">
        <div class="row-between">
          <div style="flex:1;min-width:0"><h3>Pedir contraseña al entrar</h3><p>Si está apagado, no pedirá contraseña</p></div>
          <label class="switch"><input type="checkbox" id="reqPass" ${s.requirePassword?'checked':''}><span class="slider"></span></label>
        </div>
      </div>

      <div class="admin-card">
        <h3>Cambiar contraseña</h3>
        <p>Define una nueva contraseña de acceso</p>
        <div class="form-group"><input type="password" id="newPass" placeholder="Nueva contraseña"></div>
        <button class="btn-secondary" id="savePassBtn">Actualizar contraseña</button>
      </div>

      <div class="admin-card">
        <div class="row-between" style="margin-bottom:8px">
          <h3 style="margin:0">${ICONS.cloud} Sincronización GitHub</h3>
          <label class="switch"><input type="checkbox" id="ghEnabled" ${g.enabled?'checked':''}><span class="slider"></span></label>
        </div>
        <p>Sube/baja un JSON con todos tus datos usando la API de GitHub.</p>
        <div class="form-row">
          <div class="form-group"><label>Usuario / org</label><input id="ghUser" value="${escape(g.user)}" placeholder="tu-usuario"></div>
          <div class="form-group"><label>Repositorio</label><input id="ghRepo" value="${escape(g.repo)}" placeholder="taller-datos"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Rama</label><input id="ghBranch" value="${escape(g.branch||'main')}" placeholder="main"></div>
          <div class="form-group"><label>Ruta del archivo</label><input id="ghPath" value="${escape(g.path||'taller-data.json')}"></div>
        </div>
        <div class="form-group"><label>Token (se guarda solo en este dispositivo)</label><input id="ghToken" type="password" value="${escape(g.token||'')}" placeholder="github_pat_..."></div>
        <div class="form-group">
          <label class="inline-check"><input type="checkbox" id="ghAuto" ${g.autoSync?'checked':''}> Sincronización automática al guardar</label>
        </div>
        <div class="btn-row">
          <button class="btn-secondary" id="ghTest">Probar</button>
          <button class="btn-secondary" id="ghPull">Bajar de GitHub</button>
        </div>
        <button class="btn-primary" id="ghPush" style="margin-top:8px">Subir ahora a GitHub</button>
        <p class="muted small" style="margin-top:10px">Última sincronización: ${g.lastSyncAt?fmtDateTime(g.lastSyncAt):'nunca'}</p>
      </div>

      ${typeof LocalFile !== 'undefined' ? `
      <div class="admin-card">
        <h3>${ICONS.save} Guardar JSON en una ubicación</h3>
        <p>Elige una carpeta/archivo del dispositivo. El sistema escribirá ahí automáticamente cuando guardes cambios.</p>
        ${localSupported ? `
          <div class="btn-row">
            <button class="btn-secondary" id="pickLoc">${hasLocal?'Cambiar ubicación':'Elegir ubicación'}</button>
            <button class="btn-secondary" id="clearLoc" ${hasLocal?'':'disabled'}>Quitar ubicación</button>
          </div>
          <button class="btn-secondary" id="loadFromLoc" ${hasLocal?'':'disabled'} style="margin-top:8px">Cargar desde el archivo</button>
          <p class="muted small" style="margin-top:8px">Estado: ${hasLocal?'<b>Ubicación configurada</b>':'sin configurar'}</p>
        ` : `<p class="muted small">Tu navegador no soporta elegir ubicación. Usa "Exportar JSON" en su lugar.</p>`}
      </div>` : ''}

      <div class="admin-card">
        <h3>Copia local (manual)</h3>
        <p>Exporta o importa el JSON manualmente</p>
        <div class="btn-row">
          <button class="btn-secondary" id="exportBtn">Exportar JSON</button>
          <button class="btn-secondary" id="importBtn">Importar JSON</button>
        </div>
        <input type="file" id="importFile" accept="application/json" style="display:none">
      </div>

      <div class="admin-card">
        <h3>Equipos disponibles</h3>
        <p>Aparecen como sugerencias al registrar una reparación</p>
        <div class="chip-list" id="deviceTypes">
          ${s.deviceTypes.map(d=>`<span class="chip-static">${escape(d)} <button data-rm-dev="${escape(d)}">×</button></span>`).join('')}
        </div>
        <div class="form-row" style="margin-top:10px">
          <div class="form-group" style="margin:0"><input id="newDeviceType" placeholder="Nuevo equipo (ej. Soundbar)"></div>
          <div class="form-group" style="margin:0"><button class="btn-secondary" id="addDeviceBtn">Añadir</button></div>
        </div>
      </div>

      <div class="admin-card">
        <h3>Estadísticas</h3>
        <p>Total reparaciones: <b>${DB.repairs.length}</b> · Versión de datos: v${DB.all.schemaVersion}</p>
      </div>
    `;

    document.getElementById('appNameInput').addEventListener('change', e=>{
      DB.updateSettings({ appName: e.target.value.trim() || 'Taller' });
      document.getElementById('appTitle').textContent = DB.settings.appName;
      document.title = DB.settings.appName;
      UI.toast('Nombre actualizado');
    });
    document.getElementById('reqPass').addEventListener('change', e=>{
      DB.updateSettings({ requirePassword: e.target.checked });
      UI.toast(e.target.checked?'Contraseña activada':'Contraseña desactivada');
    });
    document.getElementById('savePassBtn').addEventListener('click', async ()=>{
      const v = document.getElementById('newPass').value;
      if(v.length<3) return UI.toast('Mínimo 3 caracteres');
      await Auth.setPassword(v);
      document.getElementById('newPass').value = '';
      UI.toast('Contraseña actualizada');
    });

    function readGh(){
      return {
        enabled: document.getElementById('ghEnabled').checked,
        user: document.getElementById('ghUser').value.trim(),
        repo: document.getElementById('ghRepo').value.trim(),
        branch: document.getElementById('ghBranch').value.trim() || 'main',
        path: document.getElementById('ghPath').value.trim() || 'taller-data.json',
        token: document.getElementById('ghToken').value.trim(),
        autoSync: document.getElementById('ghAuto').checked
      };
    }
    ['ghEnabled','ghUser','ghRepo','ghBranch','ghPath','ghToken','ghAuto'].forEach(id=>{
      document.getElementById(id).addEventListener('change', ()=> DB.updateGithub(readGh()));
    });
    document.getElementById('ghTest').onclick = async ()=>{
      DB.updateGithub(readGh());
      try{ await GitSync.test(); UI.toast('Conexión OK'); }catch(e){ UI.toast('Error: '+e.message); }
    };
    document.getElementById('ghPush').onclick = async ()=>{
      DB.updateGithub(readGh());
      try{ await GitSync.push(); UI.toast('Subido a GitHub'); App.refresh(); }catch(e){ UI.toast('Error: '+e.message); }
    };
    document.getElementById('ghPull').onclick = async ()=>{
      DB.updateGithub(readGh());
      if(!confirm('Esto reemplazará tus datos locales con los de GitHub. ¿Continuar?')) return;
      try{ await GitSync.pull(); UI.toast('Datos descargados'); App.refresh(); }catch(e){ UI.toast('Error: '+e.message); }
    };

    if(typeof LocalFile !== 'undefined' && localSupported){
      const pl = document.getElementById('pickLoc');
      if(pl) pl.onclick = async ()=>{
        try{ await LocalFile.pickLocation(); UI.toast('Ubicación guardada'); App.refresh(); }
        catch(e){ if(e.name!=='AbortError') UI.toast('Error: '+e.message); }
      };
      const clr = document.getElementById('clearLoc');
      if(clr) clr.onclick = async ()=>{ await LocalFile.clearHandle(); UI.toast('Ubicación quitada'); App.refresh(); };
      const lf = document.getElementById('loadFromLoc');
      if(lf) lf.onclick = async ()=>{
        if(!confirm('Reemplazar datos locales con los del archivo elegido?')) return;
        try{ const ok = await LocalFile.loadFromFile(); UI.toast(ok?'Cargado':'No se pudo cargar'); App.refresh(); }
        catch(e){ UI.toast('Error: '+e.message); }
      };
    }

    document.getElementById('exportBtn').onclick = ()=>{ DB.exportJson(); UI.toast('Descargado'); };
    document.getElementById('importBtn').onclick = ()=> document.getElementById('importFile').click();
    document.getElementById('importFile').onchange = e=>{
      const f = e.target.files[0]; if(!f) return;
      if(!confirm('Esto reemplazará todos los datos. ¿Continuar?')) return;
      const reader = new FileReader();
      reader.onload = ev=>{
        if(DB.importJson(ev.target.result)){ UI.toast('Importado'); App.refresh(); }
        else UI.toast('Archivo inválido');
      };
      reader.readAsText(f);
    };

    document.getElementById('addDeviceBtn').onclick = ()=>{
      const v = document.getElementById('newDeviceType').value;
      if(DB.addDeviceType(v)){ UI.toast('Equipo añadido'); admin(); }
      else UI.toast('Vacío o duplicado');
    };
    document.querySelectorAll('[data-rm-dev]').forEach(b=>{
      b.onclick = ()=>{ DB.removeDeviceType(b.dataset.rmDev); admin(); };
    });
  }

  return { dashboard, repairsList, newRepair, search, admin, showRepair };
})();
