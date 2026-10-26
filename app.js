// TRIPLE DOBLE: demo para GitHub Pages, datos separados por navegador.
const DATA_KEY = 'tripleDobleLigaV1';
let data = {equipos: [], jugadores: [], partidos: []};
let modalMode = '';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const nameOf = id => data.equipos.find(t => t.id === id)?.nombre || 'Equipo eliminado';
const dateOf = value => value ? value.split('-').reverse().join('/') : 'Sin fecha';
const initials = name => String(name).trim().split(/\s+/).slice(0,2).map(p => p.charAt(0)).join('').toUpperCase();
const teamCell = id => `<span class="team-cell"><span class="team-badge">${esc(initials(nameOf(id)))}</span>${esc(nameOf(id))}</span>`;
const empty = (columns, msg) => `<tr><td colspan="${columns}"><div class="empty">${esc(msg)}</div></td></tr>`;
const table = (heads, rows) => `<table><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
const normalized = text => String(text || '').toLocaleLowerCase('es');
const search = section => normalized($(`[data-search="${section}"]`)?.value || '');
const sortByDate = matches => matches.slice().sort((a,b) => a.fecha.localeCompare(b.fecha));

function exampleData() {
  const teams = [
    ['t1','Cóndores Abancay','Miguel Quispe','Abancay'],
    ['t2','Titanes BC','Ángel Huamán','Andahuaylas'],
    ['t3','Halcones Andinos','David Vargas','Abancay'],
    ['t4','Leones del Sur','Luis Mendoza','Cusco'],
    ['t5','Panteras Club','José Rojas','Chalhuanca'],
    ['t6','Águilas Azules','Carlos Flores','Abancay']
  ].map(([id,nombre,entrenador,ciudad]) => ({id,nombre,entrenador,ciudad}));
  const players = [
    ['Luis Quispe',7,'t1'],['Marco Ramos',23,'t1'],['Diego Huamán',10,'t2'],['Andrés Flores',8,'t2'],
    ['Franco Vásquez',11,'t3'],['Jorge Cárdenas',6,'t3'],['Pedro Sánchez',24,'t4'],['Mario Díaz',9,'t4'],
    ['Elías Torres',30,'t5'],['Kevin Gutiérrez',5,'t5'],['Renato Chávez',12,'t6'],['Josué Paredes',21,'t6']
  ].map(([nombre,numero,equipo],i) => ({id:`j${i+1}`,nombre,numero,equipo}));
  const fixtures = [
    ['t1','t2','2026-10-13',81,76],['t3','t4','2026-10-14',68,72],['t5','t6','2026-10-15',94,88],
    ['t1','t3','2026-10-17',70,66],['t2','t5','2026-10-19',86,80],['t6','t4','2026-10-21',74,80],
    ['t2','t4','2026-10-24',76,73],['t1','t5','2026-10-28'],['t3','t6','2026-10-30'],
    ['t2','t6','2026-11-02'],['t4','t5','2026-11-05']
  ];
  const matches = fixtures.map(([local,visitante,fecha,puntosLocal,puntosVisitante],i) => {
    const finished = puntosLocal !== undefined;
    return {id:`p${i+1}`,local,visitante,fecha,estado:finished?'finalizado':'programado',
      ...(finished?{puntosLocal,puntosVisitante}:{})};
  });
  return {equipos:teams,jugadores:players,partidos:matches};
}

const clone = state => JSON.parse(JSON.stringify(state));
const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const fail = message => {throw new Error(message);};

function validateBackup(state) {
  if (!state || !['equipos','jugadores','partidos'].every(key => Array.isArray(state[key]))) fail('El respaldo debe contener equipos, jugadores y partidos.');
  if (state.equipos.length>500 || state.jugadores.length>10000 || state.partidos.length>20000) fail('El archivo contiene demasiados registros.');
  for(const kind of ['equipos','jugadores','partidos']) {
    const ids = new Set();
    for (const item of state[kind]) {
      if (!item || typeof item.id !== 'string' || !item.id || item.id.length>128 || ids.has(item.id)) fail(`Identificadores incorrectos en ${kind}.`);
      ids.add(item.id);
    }
  }
  const teamIds = new Set(state.equipos.map(t=>t.id));
  for (const t of state.equipos) {
    if (typeof t.nombre !== 'string' || !t.nombre.trim() || t.nombre.length>60 ||
        (t.entrenador!=null && (typeof t.entrenador !== 'string' || t.entrenador.length>60)) ||
        (t.ciudad!=null && (typeof t.ciudad !== 'string' || t.ciudad.length>60))) fail('Datos inválidos de equipos.');
  }
  for (const j of state.jugadores) {
    if (typeof j.nombre !== 'string' || !j.nombre.trim() || j.nombre.length>80 ||
        !Number.isInteger(Number(j.numero)) || Number(j.numero)<0 || Number(j.numero)>99 || !teamIds.has(j.equipo)) fail('Datos inválidos de jugadores.');
  }
  for (const p of state.partidos) {
    if (!teamIds.has(p.local) || !teamIds.has(p.visitante) || p.local === p.visitante ||
        !/^\d{4}-\d{2}-\d{2}$/.test(p.fecha) || !['programado','finalizado'].includes(p.estado)) fail('Datos inválidos de partidos.');
    if (p.estado === 'finalizado' && (!Number.isInteger(Number(p.puntosLocal)) || !Number.isInteger(Number(p.puntosVisitante)) ||
        Number(p.puntosLocal)<0 || Number(p.puntosVisitante)<0 || Number(p.puntosLocal)>300 || Number(p.puntosVisitante)>300 ||
        Number(p.puntosLocal) === Number(p.puntosVisitante))) fail('El respaldo contiene resultados incorrectos.');
  }
  return {equipos:state.equipos,jugadores:state.jugadores,partidos:state.partidos};
}

function saveLocal(state) {
  localStorage.setItem(DATA_KEY,JSON.stringify(state));
  data = state;
  return clone(state);
}

function loadLocal() {
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return saveLocal(exampleData());
  try {return validateBackup(JSON.parse(raw));}
  catch {throw new Error('No se pudieron leer los datos guardados. Usa la opción Reiniciar demostración.');}
}

const ensureTeam = (state,id) => {
  if (!state.equipos.some(t=>t.id===id)) fail('Selecciona un equipo registrado.');
};

async function api(path, method='GET', body=null) {
  if (method==='GET' && path==='estado') return clone(loadLocal());
  if (path==='importar' && method==='POST') {
    const file = body?.get('archivo');
    if (!(file instanceof File) || file.size>2*1024*1024) fail('Selecciona un archivo JSON de hasta 2 MB.');
    let incoming;
    try {incoming=JSON.parse(await file.text());} catch {fail('No se pudo leer el archivo JSON.');}
    return saveLocal(validateBackup(incoming));
  }

  const [kind,encodedId] = path.split('/');
  if (!['equipos','jugadores','partidos'].includes(kind) || !['POST','PATCH','DELETE'].includes(method)) fail('Acción no disponible.');
  const id = encodedId ? decodeURIComponent(encodedId) : null;
  const state = clone(data);
  const collection = state[kind];
  const previous = id ? collection.find(item=>item.id===id) : null;
  if (id && !previous) fail('No se encontró el registro.');

  if (method==='DELETE') {
    if (!id) fail('Selecciona un registro.');
    state[kind] = collection.filter(item=>item.id!==id);
    if (kind==='equipos') {
      state.jugadores = state.jugadores.filter(j=>j.equipo!==id);
      state.partidos = state.partidos.filter(p=>p.local!==id && p.visitante!==id);
    }
    return saveLocal(state);
  }

  const input = {...body};
  let updated;
  if (kind==='equipos') {
    const nombre=String(input.nombre || '').trim();
    if (nombre.length<2 || nombre.length>60) fail('El nombre del equipo debe tener entre 2 y 60 caracteres.');
    if (collection.some(t=>t.id!==id && normalized(t.nombre)===normalized(nombre))) fail('Ese nombre de equipo ya está registrado.');
    const entrenador=String(input.entrenador || '').trim(),ciudad=String(input.ciudad || '').trim();
    if (entrenador.length>60 || ciudad.length>60) fail('Entrenador y ciudad admiten máximo 60 caracteres.');
    updated={id:id||uid(),nombre,entrenador,ciudad};
  } else if (kind==='jugadores') {
    const nombre=String(input.nombre || '').trim(),numero=Number(input.numero),equipo=input.equipo;
    if (nombre.length<2 || nombre.length>80) fail('El nombre del jugador debe tener entre 2 y 80 caracteres.');
    if (!Number.isInteger(numero)||numero<0||numero>99) fail('El dorsal debe ser un número del 0 al 99.');
    ensureTeam(state,equipo);
    if (collection.some(j=>j.id!==id && j.equipo===equipo && Number(j.numero)===numero)) fail('Ese dorsal ya está usado en el equipo.');
    updated={id:id||uid(),nombre,numero,equipo};
  } else {
    const local=input.local ?? previous?.local,visitante=input.visitante ?? previous?.visitante,fecha=input.fecha ?? previous?.fecha;
    ensureTeam(state,local); ensureTeam(state,visitante);
    if (local===visitante) fail('Un equipo no puede jugar contra sí mismo.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fail('Selecciona una fecha válida.');
    const teamsChanged=previous && (local!==previous.local || visitante!==previous.visitante);
    const estado=teamsChanged?'programado':(input.estado ?? previous?.estado ?? 'programado');
    updated={id:id||uid(),local,visitante,fecha,estado};
    if (estado==='finalizado') {
      const a=Number(input.puntosLocal ?? previous?.puntosLocal),b=Number(input.puntosVisitante ?? previous?.puntosVisitante);
      if (![a,b].every(n=>Number.isInteger(n) && n>=0 && n<=300)) fail('El marcador debe contener números entre 0 y 300.');
      if (a===b) fail('El partido no puede terminar empatado.');
      updated.puntosLocal=a;updated.puntosVisitante=b;
    }
  }
  if (method==='POST') collection.push(updated);
  else collection[collection.findIndex(item=>item.id===id)] = updated;
  return saveLocal(state);
}

function toast(message, isError = false) {
  const box = $('#toast');
  box.textContent = message;
  box.classList.toggle('error', isError);
  box.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => box.classList.remove('show'), 3600);
}

async function mutate(path, method, body, message) {
  try {
    data = await api(path, method, body);
    render();
    toast(message);
    return true;
  } catch (e) {toast(e.message, true); return false;}
}

function showView(view) {
  $$('.view').forEach(el => el.classList.toggle('hidden', el.id !== `view-${view}`));
  $$('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  const titles = {inicio:['El juego comienza aquí.','Organiza tu campeonato desde una plataforma creada para la cancha.'],equipos:['Los clubes de la liga.','Conoce y administra a todos los equipos participantes.'],jugadores:['Jugadores del torneo.','Las personas que hacen posible cada victoria.'],partidos:['El calendario de juego.','Programa cada encuentro y guarda los resultados.'],posiciones:['La carrera por el título.','Sigue a los equipos que luchan por el campeonato.'],respaldo:['Protege tu información.','Exporta, importa y conserva los datos de tu liga.']};
  $('#page-title').textContent = titles[view]?.[0] || titles.inicio[0];
  $('#page-subtitle').textContent = titles[view]?.[1] || titles.inicio[1];
  window.scrollTo({top:0, behavior:'smooth'});
}

function fillOptions() {
  const values = data.equipos.map(t => `<option value="${esc(t.id)}">${esc(t.nombre)}</option>`).join('');
  ['#jugador-equipo','#partido-local','#partido-visitante'].forEach(selector => {
    const field = $(selector), old = field.value;
    field.innerHTML = `<option value="">${data.equipos.length ? 'Seleccionar equipo' : 'Registra primero un equipo'}</option>${values}`;
    if (data.equipos.some(t => t.id === old)) field.value = old;
    field.disabled = data.equipos.length === 0;
  });
}

function renderTeams() {
  const query = search('equipos');
  const teams = data.equipos.filter(t => normalized(`${t.nombre} ${t.ciudad} ${t.entrenador}`).includes(query));
  $('#count-equipos').textContent = data.equipos.length;
  $('#list-equipos').innerHTML = table(['Equipo','Entrenador','Ciudad','Jugadores','Acciones'],teams.length ? teams.map(t =>
    `<tr><td>${teamCell(t.id)}</td><td>${esc(t.entrenador || '—')}</td><td>${esc(t.ciudad || '—')}</td><td><strong>${data.jugadores.filter(j => j.equipo === t.id).length}</strong></td><td><button class="action-btn" data-edit="equipo" data-id="${esc(t.id)}">Editar</button><button class="action-btn danger" data-delete="equipo" data-id="${esc(t.id)}">Eliminar</button></td></tr>`).join('') : empty(5,'No hay equipos que mostrar.'));
}

function renderPlayers() {
  const query = search('jugadores');
  const players = data.jugadores.filter(j => normalized(`${j.nombre} ${nameOf(j.equipo)} ${j.numero}`).includes(query));
  $('#count-jugadores').textContent = data.jugadores.length;
  $('#list-jugadores').innerHTML = table(['Jugador','Dorsal','Equipo','Acciones'],players.length ? players.map(j =>
    `<tr><td><strong>${esc(j.nombre)}</strong></td><td><span class="score">#${esc(j.numero)}</span></td><td>${teamCell(j.equipo)}</td><td><button class="action-btn" data-edit="jugador" data-id="${esc(j.id)}">Editar</button><button class="action-btn danger" data-delete="jugador" data-id="${esc(j.id)}">Eliminar</button></td></tr>`).join('') : empty(4,'No hay jugadores que mostrar.'));
}

function matchRow(p, home = false) {
  const done = p.estado === 'finalizado';
  return `<tr><td>${esc(dateOf(p.fecha))}</td><td>${teamCell(p.local)}</td><td><span class="score">${done ? `${esc(p.puntosLocal)} – ${esc(p.puntosVisitante)}` : 'VS'}</span></td><td>${teamCell(p.visitante)}</td><td><span class="pill ${done ? '' : 'pending'}">${done ? 'Finalizado' : 'Programado'}</span></td>${home ? '' : `<td><button class="action-btn" data-edit="resultado" data-id="${esc(p.id)}">${done ? 'Marcador' : 'Resultado'}</button><button class="action-btn" data-edit="partido" data-id="${esc(p.id)}">Editar</button>${done ? `<button class="action-btn" data-reset="${esc(p.id)}">Reabrir</button>` : ''}<button class="action-btn danger" data-delete="partido" data-id="${esc(p.id)}">Eliminar</button></td>`}</tr>`;
}

function renderMatches() {
  const query = search('partidos'), filter = $('#match-filter').value;
  const all = sortByDate(data.partidos);
  const matches = all.filter(p => (filter === 'todos' || p.estado === filter) && normalized(`${nameOf(p.local)} ${nameOf(p.visitante)} ${p.fecha}`).includes(query));
  $('#count-partidos').textContent = data.partidos.length;
  $('#list-partidos').innerHTML = table(['Fecha','Local','Marcador','Visitante','Estado','Acciones'],matches.length ? matches.map(p => matchRow(p)).join('') : empty(6,'No hay partidos con ese filtro.'));
  const upcoming = all.filter(p => p.estado === 'programado').slice(0,4);
  $('#home-matches').innerHTML = table(['Fecha','Local','Marcador','Visitante','Estado'],upcoming.length ? upcoming.map(p => matchRow(p,true)).join('') : empty(5,'Programa un partido para verlo aquí.'));
}

function standings() {
  const standings = data.equipos.map(team => ({id:team.id,nombre:team.nombre,pj:0,pg:0,pp:0,pf:0,pc:0}));
  const lookup = new Map(standings.map(s => [s.id,s]));
  data.partidos.filter(p => p.estado === 'finalizado').forEach(p => {
    const local = lookup.get(p.local), away = lookup.get(p.visitante);
    if (!local || !away) return;
    const a = Number(p.puntosLocal), b = Number(p.puntosVisitante);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return;
    local.pj++; away.pj++; local.pf += a; local.pc += b; away.pf += b; away.pc += a;
    if (a > b) {local.pg++; away.pp++;} else if (b > a) {away.pg++; local.pp++;}
  });
  return standings.sort((a,b) => b.pg-a.pg || (b.pf-b.pc)-(a.pf-a.pc) || b.pf-a.pf || a.nombre.localeCompare(b.nombre));
}

function renderStandings() {
  const ranking = standings();
  $('#list-posiciones').innerHTML = table(['Pos.','Equipo','PJ','PG','PP','PF','PC','DIF'],ranking.length ? ranking.map((t,i) =>
    `<tr><td class="${i < 3 ? 'top-rank' : ''}">${i+1}${i===0?' 🏆':''}</td><td>${teamCell(t.id)}</td><td>${t.pj}</td><td><strong>${t.pg}</strong></td><td>${t.pp}</td><td>${t.pf}</td><td>${t.pc}</td><td><strong>${t.pf-t.pc > 0 ? '+' : ''}${t.pf-t.pc}</strong></td></tr>`).join('') : empty(8,'Registra equipos para generar la clasificación.'));
  $('#home-standings').innerHTML = ranking.length ? ranking.slice(0,4).map((t,i) =>
    `<div class="leader"><span class="rank">${i+1}</span><span class="team-badge">${esc(initials(t.nombre))}</span><span class="leader-name">${esc(t.nombre)}<small>${t.pj} partidos jugados</small></span><strong>${t.pg}<small>VICTORIAS</small></strong></div>`).join('') : '<p class="leader-empty">Cuando registres equipos y resultados, aquí aparecerán los líderes del torneo.</p>';
}

function renderStats() {
  $('#stat-equipos').textContent = data.equipos.length;
  $('#stat-jugadores').textContent = data.jugadores.length;
  $('#stat-partidos').textContent = data.partidos.filter(p => p.estado !== 'finalizado').length;
  $('#stat-finalizados').textContent = data.partidos.filter(p => p.estado === 'finalizado').length;
}

function renderHero() {
  const next = sortByDate(data.partidos.filter(p => p.estado !== 'finalizado'))[0];
  $('#hero-local').textContent = next ? nameOf(next.local) : 'LIGA';
  $('#hero-visitante').textContent = next ? nameOf(next.visitante) : 'COMPLETADA';
  $('#hero-fecha').textContent = next ? dateOf(next.fecha) : 'SIN PARTIDOS PENDIENTES';
  $('.club-logo.coral').textContent = next ? initials(nameOf(next.local)).slice(0,2) : 'TD';
  $('.club-logo.green').textContent = next ? initials(nameOf(next.visitante)).slice(0,2) : '26';
}

function render() {fillOptions(); renderTeams(); renderPlayers(); renderMatches(); renderStandings(); renderStats(); renderHero();}

function optionList(selected = '') {
  return `<option value="">Seleccionar equipo</option>` + data.equipos.map(t => `<option value="${esc(t.id)}" ${t.id === selected ? 'selected' : ''}>${esc(t.nombre)}</option>`).join('');
}

function field(label,name,value = '',type = 'text',extra = '') {
  return `<label>${esc(label)}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
}

function selectField(label,name,selected) {
  return `<label>${esc(label)}<select name="${name}" required>${optionList(selected)}</select></label>`;
}

function openModal(type,id) {
  const source = type === 'equipo' ? data.equipos : type === 'jugador' ? data.jugadores : data.partidos;
  const item = source.find(x => x.id === id);
  if (!item) return;
  modalMode = type;
  const names = {equipo:'Editar equipo',jugador:'Editar jugador',partido:'Editar partido',resultado:'Registrar marcador'};
  $('#modal-title').textContent = names[type];
  $('#modal-kicker').textContent = type === 'resultado' ? `${nameOf(item.local)} VS ${nameOf(item.visitante)}` : 'MODIFICAR REGISTRO';
  const content = type === 'equipo'
    ? field('Nombre del equipo','nombre',item.nombre,'text','required minlength="2" maxlength="60"') + field('Entrenador','entrenador',item.entrenador,'text','maxlength="60"') + field('Ciudad','ciudad',item.ciudad,'text','maxlength="60"')
    : type === 'jugador'
      ? field('Nombre completo','nombre',item.nombre,'text','required minlength="2" maxlength="80"') + field('Dorsal','numero',item.numero,'number','required min="0" max="99"') + selectField('Equipo','equipo',item.equipo)
      : type === 'partido'
        ? selectField('Equipo local','local',item.local) + selectField('Equipo visitante','visitante',item.visitante) + field('Fecha','fecha',item.fecha,'date','required')
        : field(nameOf(item.local),'puntosLocal',item.puntosLocal ?? 0,'number','required min="0" max="300"') + field(nameOf(item.visitante),'puntosVisitante',item.puntosVisitante ?? 0,'number','required min="0" max="300"');
  $('#modal-fields').innerHTML = content;
  $('#form-dialog').dataset.id = id;
  $('#record-dialog').showModal();
}

function closeModal() {$('#record-dialog').close();}

function bindForms() {
  const forms = [
    {id:'#form-equipo',endpoint:'equipos',names:['nombre','entrenador','ciudad'],text:'Equipo registrado correctamente.'},
    {id:'#form-jugador',endpoint:'jugadores',names:['nombre','numero','equipo'],text:'Jugador añadido correctamente.'},
    {id:'#form-partido',endpoint:'partidos',names:['local','visitante','fecha'],text:'Partido programado correctamente.'},
  ];
  forms.forEach(({id,endpoint,names,text}) => {
    $(id).addEventListener('submit', async event => {
      event.preventDefault();
      const f = new FormData(event.currentTarget);
      const body = Object.fromEntries(names.map(n => [n,f.get(n)]));
      if (endpoint === 'partidos' && body.local === body.visitante) return toast('Selecciona dos equipos diferentes.',true);
      if (await mutate(endpoint,'POST',body,text)) event.currentTarget.reset();
    });
  });
  $('#form-dialog').addEventListener('submit', async event => {
    event.preventDefault();
    const id = event.currentTarget.dataset.id;
    const f = new FormData(event.currentTarget);
    const body = Object.fromEntries(f.entries());
    if (modalMode === 'resultado') {
      if (Number(body.puntosLocal) === Number(body.puntosVisitante)) return toast('No se permiten empates: juega un tiempo extra.',true);
      body.estado = 'finalizado';
    }
    const endpoint = modalMode === 'equipo' ? 'equipos' : modalMode === 'jugador' ? 'jugadores' : 'partidos';
    if (await mutate(`${endpoint}/${encodeURIComponent(id)}`,'PATCH',body,'Cambios guardados correctamente.')) closeModal();
  });
}

function bindButtons() {
  document.addEventListener('click', async event => {
    const goto = event.target.closest('[data-view],[data-go]');
    if (goto) {showView(goto.dataset.view || goto.dataset.go); return;}
    if (event.target.closest('[data-close]')) {closeModal(); return;}
    const edit = event.target.closest('[data-edit]');
    if (edit) {openModal(edit.dataset.edit,edit.dataset.id); return;}
    const reset = event.target.closest('[data-reset]');
    if (reset) {
      if (confirm('¿Volver este encuentro a Programado? Se borrará su resultado.')) await mutate(`partidos/${encodeURIComponent(reset.dataset.reset)}`,'PATCH',{estado:'programado'},'El partido volvió a Programado.');
      return;
    }
    const del = event.target.closest('[data-delete]');
    if (del) {
      const type = del.dataset.delete, noun = {equipo:'equipo y todos sus jugadores y partidos',jugador:'jugador',partido:'partido'}[type];
      if (!confirm(`¿Eliminar este ${noun}? Esta acción no se puede deshacer.`)) return;
      const endpoint = {equipo:'equipos',jugador:'jugadores',partido:'partidos'}[type];
      await mutate(`${endpoint}/${encodeURIComponent(del.dataset.id)}`,'DELETE',null,'Registro eliminado.');
    }
  });
  $$('[data-search]').forEach(el => el.addEventListener('input',() => ({equipos:renderTeams,jugadores:renderPlayers,partidos:renderMatches}[el.dataset.search]())));
  $('#match-filter').addEventListener('change',renderMatches);
  $('#export-btn').addEventListener('click',() => {
    const file = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href=url;link.download='liga-pro-respaldo.json';document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('Respaldo JSON descargado.');
  });
  $('#form-import').addEventListener('submit',async event => {
    event.preventDefault();
    if (!confirm('¿Restaurar el archivo? Los datos actuales serán sustituidos. Descarga antes un respaldo si lo necesitas.')) return;
    const ok = await mutate('importar','POST',new FormData(event.currentTarget),'Respaldo importado correctamente.');
    if (ok) event.currentTarget.reset();
  });
  $('#reset-demo').addEventListener('click',() => {
    if (!confirm('¿Restablecer todos los datos de ejemplo? Se borrarán los cambios guardados en este navegador.')) return;
    try {saveLocal(exampleData());render();showView('inicio');toast('Demostración reiniciada.');}
    catch(e){toast(e.message,true);}
  });
}

async function start() {
  $('#today-date').textContent = new Intl.DateTimeFormat('es-PE',{day:'numeric',month:'short',year:'numeric'}).format(new Date());
  $('#partido-fecha').value = new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
  bindForms(); bindButtons();
  try {data = await api('estado'); render();} catch (e) {toast(e.message,true);}
}
start();
