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
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) { 
      results.push(file); 
    }
  });
  return results;
}

const files = walk('./src');
let totalReplacements = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  // Replace fontSize: 12 or fontSize:12
  const regex1 = /fontSize\s*:\s*(\d+)/g;
  content = content.replace(regex1, (match, p1) => {
    const newSize = parseInt(p1) + 1;
    changed = true;
    totalReplacements++;
    return `fontSize: ${newSize}`;
  });

  // Replace fontSize: "12px" or fontSize:"12px"
  const regex2 = /fontSize\s*:\s*["'](\d+)px["']/g;
  content = content.replace(regex2, (match, p1) => {
    const newSize = parseInt(p1) + 1;
    changed = true;
    totalReplacements++;
    return `fontSize: "${newSize}px"`;
  });

  // Replace font-size: 12px in CSS files
  if (f.endsWith('.css')) {
    const regex3 = /font-size\s*:\s*(\d+)(?:\.\d+)?px/g;
    content = content.replace(regex3, (match, p1) => {
      const newSize = parseInt(p1) + 1;
      changed = true;
      totalReplacements++;
      return `font-size: ${newSize}px`;
    });
  }

  if(changed) {
    fs.writeFileSync(f, content);
    console.log('Updated font sizes in: ' + f);
  }
});
console.log('Total fontSize replacements: ' + totalReplacements);
