const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file)); 
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) { 
      results.push(file); 
    }
  });
  return results;
}

const files = walk('./src').concat(['./index.html']);
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if(content.includes('Outfit')) { 
    content = content.replace(/Outfit/g, 'Inter'); 
    changed = true; 
  }
  if(content.includes('#1a3ed4')) { 
    content = content.replace(/#1a3ed4/gi, '#0047BA'); 
    changed = true; 
  }
  
  if(changed) {
    fs.writeFileSync(f, content);
    console.log('Updated: ' + f);
  }
});
console.log('Replacement complete.');
