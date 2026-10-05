// Builds ../index.html from the source parts: node src/build.js
const fs = require('fs');
const rd = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
const parts = ['core.js', 'world.js', 'vehicles.js', 'game.js', 'features.js', 'boats.js', 'moto.js', 'ui.js'];
const js = parts.map(rd).join('\n');
new Function(js); // syntax check
const body = rd('head.html') + '\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\n(() => {\n' + js + '\n})();\n</script>\n';
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(__dirname + '/../index.html', page);
console.log('built index.html', page.length, 'bytes');
