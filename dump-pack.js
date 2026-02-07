const fs = require('fs');
const path = require('path');

const mode = process.argv[2];
const srcDir = mode === 'unpack' ? 'dump' : 'text';
const dstDir = mode === 'unpack' ? 'text' : 'dump';

fs.mkdirSync(dstDir, { recursive: true });

const TEXT_ASSET_HEADER = '0 TextAsset Base';

fs.readdirSync(srcDir)
  .filter(name => name.endsWith('.txt'))
  .forEach(name => {
    const content = fs.readFileSync(path.join(srcDir, name), 'utf8');
    if (!content.startsWith(TEXT_ASSET_HEADER)) {
      return; // пропускаем файлы не TextAsset
    }
    const marker = 'm_Script = "';
    
    const start = content.indexOf(marker) + marker.length;
    const end = content.lastIndexOf('"');
    
    const script = content.slice(start, end);
    const transformed = mode === 'unpack' 
      ? script.replace(/\\n/g, '\n')
      : script.replace(/\r\n/g, '\n').replace(/\n/g, '\\n');
    
    const result = content.slice(0, start) + transformed + '"' + content.slice(end + 1);
    
    fs.writeFileSync(path.join(dstDir, name), result, 'utf8');
    console.log(`${mode}: ${name}`);
  });