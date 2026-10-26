<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f2eb">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="api-base" content="{{ url('/api') }}">
  <meta name="description" content="TRIPLE DOBLE: sistema de gestión de liga de básquetbol con equipos, jugadores, resultados y clasificación.">
  <title>TRIPLE DOBLE | Liga de Básquetbol</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏀</text></svg>">
  <link rel="stylesheet" href="{{ asset('css/triple.css') }}">
  <script defer src="{{ asset('js/app.js') }}"></script>
</head>
<body>
  <div class="announcement"><div class="shell announce-inner"><span><span class="live-indicator"></span> SISTEMA DE GESTIÓN DEPORTIVA</span><span>ABANCAY · TEMPORADA 2026 <span class="announcement-icon">↗</span></span></div></div>
  <header class="site-header shell">
    <button class="brand" data-go="inicio"><span class="brand-ball">🏀</span><span class="brand-type">TRIPLE<span>DOBLE</span><small>THE BASKETBALL LEAGUE</small></span></button>
    <nav class="nav-links" aria-label="Menú principal">
      <button class="nav-link active" data-view="inicio">Inicio</button>
      <button class="nav-link" data-view="equipos">Clubes</button>
      <button class="nav-link" data-view="jugadores">Jugadores</button>
      <button class="nav-link" data-view="partidos">Encuentros</button>
      <button class="nav-link" data-view="posiciones">Posiciones</button>
      <button class="nav-link" data-view="respaldo">Respaldo</button>
    </nav>
    <button class="header-cta" data-go="partidos">＋ Nuevo partido</button>
  </header>

  <main class="shell">
    <div class="page-intro"><div><p class="eyebrow"><span class="eyebrow-line"></span> LIGA DE BÁSQUETBOL · 2026</p><h1 id="page-title">El juego comienza aquí<span class="period">.</span></h1><p id="page-subtitle">Organiza tu campeonato desde una plataforma creada para la cancha.</p></div><div class="date-wrap"><small>HOY / FECHA DE CONSULTA</small><strong id="today-date"></strong></div></div>

    <section id="view-inicio" class="view">
      <div class="hero-grid">
        <div class="hero-photo"><img src="{{ asset('assets/hero.jpg') }}" alt="Dos jugadores disputando el balón en una cancha de básquetbol" fetchpriority="high"><div class="hero-shade"></div><span class="photo-label">LA PASIÓN DE CADA PARTIDO</span><div class="hero-text"><span class="hero-overline">VIVE LA TEMPORADA 2026</span><h2>NO ES SOLO<br><em>UN JUEGO.</em></h2><p>Cada punto cuenta, cada equipo importa, cada historia comienza en la cancha.</p><button class="btn btn-white" data-go="partidos">Explorar encuentros <span>↗</span></button></div><span class="hero-edge">TD / 26</span></div>
        <aside class="feature-card"><div class="feature-head"><span class="feature-tag"><span class="small-dot"></span> PRÓXIMA FECHA</span><span class="feature-arrow">↗</span></div><p class="feature-caption">EL SIGUIENTE GRAN ENCUENTRO</p><div class="versus-block"><div class="club-logo coral">L</div><strong id="hero-local">EQUIPO LOCAL</strong><span>LOCAL</span><div class="versus-label">VS</div><div class="club-logo green">V</div><strong id="hero-visitante">VISITANTE</strong><span>VISITANTE</span></div><div class="feature-bottom"><div><small>FECHA DE PARTIDO</small><strong id="hero-fecha">PRÓXIMAMENTE</strong></div><button class="circle-next" data-go="partidos" aria-label="Ver el calendario">↗</button></div></aside>
      </div>

      <div class="marquee-strip"><span>COMPITE CON PASIÓN</span><b>✳</b><span>JUEGA EN EQUIPO</span><b>✳</b><span>VIVE EL BÁSQUETBOL</span><b>✳</b><span>TRIPLE DOBLE 2026</span></div>

      <div class="section-heading"><div><p class="section-kicker">01 / VISIÓN GENERAL</p><h3>Todo el torneo <span>en cifras</span></h3></div><span class="section-hint">DATOS ACTUALIZADOS AUTOMÁTICAMENTE ↗</span></div>
      <div class="stats-grid">
        <article class="stat-card mint"><div class="stat-top"><span>01</span><span class="stat-icon">◈</span></div><p>EQUIPOS REGISTRADOS</p><div class="stat-value"><strong id="stat-equipos">0</strong><small>CLUBES</small></div></article>
        <article class="stat-card coral"><div class="stat-top"><span>02</span><span class="stat-icon">♟</span></div><p>JUGADORES ACTIVOS</p><div class="stat-value"><strong id="stat-jugadores">0</strong><small>ATLETAS</small></div></article>
        <article class="stat-card cream"><div class="stat-top"><span>03</span><span class="stat-icon">⌁</span></div><p>PARTIDOS POR JUGAR</p><div class="stat-value"><strong id="stat-partidos">0</strong><small>FECHAS</small></div></article>
        <article class="stat-card dark"><div class="stat-top"><span>04</span><span class="stat-icon">✓</span></div><p>PARTIDOS FINALIZADOS</p><div class="stat-value"><strong id="stat-finalizados">0</strong><small>RESULTADOS</small></div></article>
      </div>

      <div class="dashboard-grid">
        <section class="panel"><div class="panel-heading"><div><p class="section-kicker">02 / CALENDARIO</p><h3>Próximos partidos</h3><p>Conoce los encuentros que vienen.</p></div><button class="outline-link" data-go="partidos">Todos los partidos <span>↗</span></button></div><div id="home-matches" class="table-wrap"></div></section>
        <section class="panel highlight-panel"><div class="highlight-photo"><img src="{{ asset('assets/hoop.jpg') }}" alt="Balón de básquetbol entrando en el aro"><div class="image-label">BASKETBALL IS LIFE ↗</div></div><div class="panel-heading compact"><div><p class="section-kicker">03 / CLASIFICACIÓN</p><h3>Los que lideran</h3></div><button class="circle-next small" data-go="posiciones" aria-label="Ver clasificación">↗</button></div><div id="home-standings" class="leaders"></div></section>
      </div>
    </section>

    <section id="view-equipos" class="view hidden"><section class="panel panel-full"><div class="panel-heading"><div><p class="section-kicker">01 / ADMINISTRACIÓN DE CLUBES</p><h3>Los protagonistas del torneo</h3><p>Crea equipos, modifica datos y revisa los registros.</p></div><span class="section-stamp">CLUBES</span></div><form id="form-equipo" class="form-grid"><label>Nombre del equipo<input name="nombre" required minlength="2" maxlength="60" placeholder="Ej. Cóndores Abancay"></label><label>Entrenador<input name="entrenador" maxlength="60" placeholder="Nombre del entrenador"></label><label>Ciudad<input name="ciudad" maxlength="60" placeholder="Ej. Abancay"></label><button class="btn btn-primary form-button">＋ Registrar equipo</button></form><div class="table-toolbar"><h4>Equipos participantes <span id="count-equipos" class="count">0</span></h4><input class="search-input" data-search="equipos" placeholder="⌕ Buscar club o ciudad" aria-label="Buscar equipos"></div><div id="list-equipos" class="table-wrap"></div></section></section>

    <section id="view-jugadores" class="view hidden"><section class="panel panel-full"><div class="panel-heading"><div><p class="section-kicker">02 / GESTIÓN DE PLANTILLAS</p><h3>Jugadores de la liga</h3><p>Registra nombres, camisetas y clubes.</p></div><span class="section-stamp">ATLETAS</span></div><form id="form-jugador" class="form-grid"><label>Nombre del jugador<input name="nombre" required minlength="2" maxlength="80" placeholder="Nombre completo"></label><label>Número de camiseta<input name="numero" type="number" required min="0" max="99" placeholder="Ej. 23"></label><label>Equipo<select name="equipo" id="jugador-equipo" required></select></label><button class="btn btn-primary form-button">＋ Añadir jugador</button></form><div class="table-toolbar"><h4>Plantilla general <span id="count-jugadores" class="count">0</span></h4><input class="search-input" data-search="jugadores" placeholder="⌕ Buscar jugador o equipo" aria-label="Buscar jugadores"></div><div id="list-jugadores" class="table-wrap"></div></section></section>

    <section id="view-partidos" class="view hidden"><section class="panel panel-full"><div class="panel-heading"><div><p class="section-kicker">03 / CENTRO DE PARTIDOS</p><h3>Resultados y calendario</h3><p>Programa encuentros, registra marcadores y sigue la competencia.</p></div><span class="section-stamp">PARTIDOS</span></div><form id="form-partido" class="form-grid"><label>Equipo local<select name="local" id="partido-local" required></select></label><label>Equipo visitante<select name="visitante" id="partido-visitante" required></select></label><label>Fecha del partido<input type="date" name="fecha" id="partido-fecha" required></label><button class="btn btn-primary form-button">＋ Programar partido</button></form><div class="table-toolbar"><h4>Todos los encuentros <span id="count-partidos" class="count">0</span></h4><div class="filters"><select id="match-filter" aria-label="Filtrar partidos"><option value="todos">Todos los estados</option><option value="programado">Programados</option><option value="finalizado">Finalizados</option></select><input class="search-input" data-search="partidos" placeholder="⌕ Buscar equipos" aria-label="Buscar partidos"></div></div><div id="list-partidos" class="table-wrap"></div></section></section>

    <section id="view-posiciones" class="view hidden"><section class="panel panel-full"><div class="panel-heading"><div><p class="section-kicker">04 / LA LUCHA POR EL TÍTULO</p><h3>Tabla de posiciones</h3><p>La clasificación se calcula automáticamente con los marcadores finales.</p></div><span class="section-stamp">RANKING</span></div><div class="ranking-banner"><span>🏆</span><div><strong>EL CAMINO HACIA EL CAMPEONATO</strong><small>VICTORIAS · DIFERENCIA DE PUNTOS · PUNTOS A FAVOR</small></div></div><div id="list-posiciones" class="table-wrap"></div><p class="footnote">PJ: jugados · PG: ganados · PP: perdidos · PF: puntos a favor · PC: puntos en contra · DIF: diferencia.</p></section></section>

    <section id="view-respaldo" class="view hidden"><section class="panel panel-full"><div class="panel-heading"><div><p class="section-kicker">05 / RESPALDO DE INFORMACIÓN</p><h3>Cuida los datos de tu liga</h3><p>Guarda una copia de seguridad o restaura una anterior.</p></div><span class="section-stamp">DATOS</span></div><div class="backup-grid"><div class="backup-card"><span class="backup-symbol">↓</span><h4>Exportar datos</h4><p>Descarga equipos, jugadores y resultados en un archivo JSON.</p><button id="export-btn" class="btn btn-primary">Descargar JSON ↗</button></div><div class="backup-card"><span class="backup-symbol">↑</span><h4>Restaurar respaldo</h4><p>Importa un archivo JSON generado desde esta aplicación.</p><form id="form-import"><input type="file" name="archivo" accept=".json,application/json" required><button class="btn btn-dark">Restaurar datos ↗</button></form></div></div><div class="demo-reset"><div><strong>¿Quieres volver a comenzar?</strong><p>Reinicia la demostración con los equipos, jugadores y partidos de ejemplo.</p></div><button id="reset-demo" class="btn btn-dark">↻ Reiniciar demostración</button></div></section></section>

    <footer><span class="footer-brand">TRIPLE<span>DOBLE</span></span><p>© 2026 · Gestión deportiva para proyectos académicos</p><span class="footer-note">VERSIÓN LARAVEL · DATOS JSON EN EL SERVIDOR</span></footer>
  </main>

  <dialog id="record-dialog"><form id="form-dialog"><header class="modal-header"><div><p class="section-kicker" id="modal-kicker">EDITAR REGISTRO</p><h3 id="modal-title">Modificar información</h3></div><button type="button" class="icon-button" data-close aria-label="Cerrar">✕</button></header><div id="modal-fields" class="modal-fields"></div><div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary">Guardar cambios</button></div></form></dialog>
  <div id="toast" role="status" aria-live="polite"></div>
</body>
</html>
