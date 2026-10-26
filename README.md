# TRIPLE DOBLE 🏀 — Sistema de Liga de Básquetbol

Un sistema deportivo con diseño editorial claro, fotografías originales y funciones completas para un examen de Ingeniería de Sistemas. Incluye dos modos de funcionamiento: **una demostración para GitHub Pages** y **una aplicación Laravel 12 para XAMPP**. No usa MySQL.

## Lo que incluye

- Portada con dos fotografías de básquetbol incluidas en el proyecto.
- Panel de estadísticas y próximo partido destacado.
- Registro, búsqueda, edición y eliminación de equipos.
- Registro de jugadores, asignación de clubes y control de dorsales repetidos.
- Programación de partidos, filtros, marcadores y modificación de resultados.
- Tabla de posiciones automática según victorias, diferencia de puntos y puntos a favor.
- Respaldo de datos con archivos JSON e importación.
- 6 equipos, 12 jugadores y 11 partidos **de ejemplo en la versión GitHub Pages** para que la presentación no aparezca vacía.

## OPCIÓN A — Publicar en GitHub Pages (la más rápida para el examen)

**Esta opción no requiere instalar Laravel, PHP ni XAMPP.**

1. Descomprime el ZIP.
2. Abre la carpeta `triple_doble` y localiza `index.html`.
3. Abre tu repositorio en GitHub. Asegúrate de que `index.html` esté en la **raíz del repositorio**, junto a los demás archivos y no dentro de otra carpeta.
4. Desde Visual Studio Code, haz **Commit** y luego **Push / Sync Changes**.
5. En GitHub entra a **Settings → Pages** y selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)**. Guarda si cambias algo.
6. Abre el enlace que GitHub muestra en la sección Pages. No inventes el enlace usando el nombre del ZIP: depende del **nombre real del repositorio**.

`index.html` ya incluye internamente los estilos, el JavaScript y las fotografías. Por eso, **para GitHub Pages basta con subir ese único archivo a la raíz**. Los archivos `style.css`, `app.js` y `assets/` también están incluidos por si deseas modificarlos.

**Aviso:** en esta demostración los datos se guardan con `localStorage` **en cada navegador**. Lo que registres en una computadora no se comparte automáticamente con otras.

## OPCIÓN B — Abrir con Laravel y XAMPP

Necesitas **PHP 8.2 o superior** (por ejemplo con XAMPP), [Composer](https://getcomposer.org/download/) y Visual Studio Code. No necesitas encender MySQL.

1. Abre `triple_doble` en Visual Studio Code.
2. Abre **Terminal → Nueva terminal** dentro de la carpeta que contiene `composer.json`.
3. Ejecuta uno por uno:

   ```powershell
   composer install
   copy .env.example .env
   php artisan key:generate
   php artisan serve
   ```

4. Abre `http://127.0.0.1:8000` en Chrome.

Si Windows no reconoce `php`, sustituye `php` por `C:\xampp\php\php.exe` en los comandos. `composer install` requiere conexión a Internet la primera vez para descargar Laravel; el ZIP incluye el código del proyecto, pero no la carpeta `vendor`.

La versión Laravel guarda equipos, jugadores y partidos en el archivo **`storage/app/private/liga.json`**, creado al usar el sistema. Es un almacenamiento distinto al `localStorage` de la demostración pública.

## Git y GitHub desde Visual Studio Code

Si ya tienes un repositorio vinculado a GitHub, **no reemplaces su carpeta `.git`**. Copia los archivos de este proyecto dentro de tu carpeta de trabajo y publica los cambios desde **Source Control**.

Si empiezas un repositorio desde cero, ejecuta:

```bash
git init
git add .
git commit -m "Crear TRIPLE DOBLE para examen"
git branch -M main
```

Luego vincúlalo con la URL real de un repositorio de GitHub y haz `git push -u origin main`.

## Cómo presentarlo en tu examen

1. Abre **Inicio** y explica los indicadores y el encuentro destacado.
2. Entra a **Clubes** y registra un nuevo equipo.
3. En **Jugadores**, registra un atleta para ese equipo.
4. En **Encuentros**, programa un partido y registra su resultado.
5. En **Posiciones**, muestra que la clasificación cambia automáticamente.
6. En **Respaldo**, descarga el JSON y explica cómo se pueden recuperar datos.

### Archivos importantes

| Archivo/carpeta | Uso |
|---|---|
| `index.html` | Página autónoma para GitHub Pages (incluye fotos y lógica) |
| `index.template.html` | Fuente HTML editable de la versión pública |
| `style.css`, `app.js`, `assets/` | Diseño, funcionalidad e imágenes originales |
| `build-page.cjs` | Regenera `index.html` después de modificar fuentes (requiere Node.js) |
| `resources/views/liga.blade.php` | Página Laravel con el mismo diseño |
| `public/css/triple.css`, `public/js/app.js` | Diseño y lógica de Laravel |
| `app/Http/Controllers/LigaController.php` | Operaciones y validaciones Laravel |
| `app/Services/LigaStore.php` | Almacenamiento JSON sin base de datos |

> Proyecto académico de demostración. La versión Laravel no incluye inicio de sesión; no se debe publicar abierta a Internet sin añadir autenticación y permisos.
