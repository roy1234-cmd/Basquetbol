// Prueba rápida de la lógica de demostración. Ejecuta: node smoke-test.cjs
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const values = new Map();
const context = vm.createContext({
  console,
  localStorage: {getItem:key=>values.get(key)||null, setItem:(key,value)=>values.set(key,value)},
  document: {querySelector:()=>null, querySelectorAll:()=>[]},
  setTimeout,clearTimeout,
});
const js = fs.readFileSync(__dirname+'/app.js','utf8').replace(/\bstart\(\);\s*$/,'');
vm.runInContext(js,context);
const call = command => vm.runInContext(command,context);

(async()=>{
  let state=await call("api('estado')");
  assert.equal(state.equipos.length,6);
  assert.equal(state.jugadores.length,12);
  assert.equal(state.partidos.length,11);
  state=await call("api('equipos','POST',{nombre:'Club de Prueba',ciudad:'Abancay',entrenador:'Ana'})");
  assert.equal(state.equipos.length,7);
  context.teamId=state.equipos.at(-1).id;
  state=await call("api('jugadores','POST',{nombre:'Jugador Ejemplo',equipo:teamId,numero:99})");
  assert.equal(state.jugadores.length,13);
  state=await call("api('partidos','POST',{local:teamId,visitante:'t2',fecha:'2026-11-10'})");
  assert.equal(state.partidos.length,12);
  context.matchId=state.partidos.at(-1).id;
  state=await call("api('partidos/'+matchId,'PATCH',{estado:'finalizado',puntosLocal:87,puntosVisitante:72})");
  assert.equal(state.partidos.at(-1).estado,'finalizado');
  assert.equal(call('standings()').find(t=>t.id===context.teamId).pg,1);
  state=await call("api('equipos/'+teamId,'DELETE')");
  assert.equal(state.equipos.length,6);
  assert.equal(state.jugadores.length,12);
  assert.equal(state.partidos.length,11);
  console.log('Correcto: equipos, jugadores, partidos, resultados, clasificación y persistencia local.');
})().catch(error=>{console.error(error);process.exit(1);});
