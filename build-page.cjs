// Produce un index.html autónomo para GitHub Pages, sin archivos externos.
const fs = require('fs');
const path = require('path');
const root = __dirname;
const read = name => fs.readFileSync(path.join(root,name),'utf8');
let html = read('index.template.html');
const css = read('style.css');
const js = read('app.js');
for (const name of ['hero','hoop']) {
  const tag = `src="assets/${name}.jpg"`;
  if (!html.includes(tag)) throw new Error(`Falta ${tag}`);
  const base64 = fs.readFileSync(path.join(root,`assets/${name}.jpg`)).toString('base64');
  html = html.replace(tag,()=>`src="data:image/jpeg;base64,${base64}"`);
}
const stylesheet = '<link rel="stylesheet" href="style.css">';
const script = '<script defer src="app.js"></script>';
if (!html.includes(stylesheet) || !html.includes(script)) throw new Error('No se encontraron las referencias de CSS y JS.');
html = html.replace(stylesheet,()=>`<style>\n${css}\n</style>`);
html = html.replace(script,()=>`<script type="module">\n${js}\n</script>`);
fs.writeFileSync(path.join(root,'index.html'),html);
console.log(`index.html generado: ${Buffer.byteLength(html)} bytes`);
