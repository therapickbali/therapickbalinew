const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Replace text in strings and normal text
    content = content.replace(/Elexoir Home Spa/g, 'Therapick');
    content = content.replace(/Elexoir Boutique/g, 'Therapick Store');
    content = content.replace(/Elexoir Admin/g, 'Therapick Admin');
    content = content.replace(/Elexoir Standard/g, 'Therapick Standard');
    content = content.replace(/ELEXOIR/g, 'THERAPICK');
    content = content.replace(/elexoirhomespa\.com/g, 'therapickbali.com');
    content = content.replace(/elexoirhomespaubud\.com/g, 'therapickbali.com');
    content = content.replace(/elexoirspa/g, 'therapickbali');
    content = content.replace(/Elexoir/g, 'Therapick');
    content = content.replace(/elexoir/g, 'therapick');
    
    // Add logo to Footer specifically since it's the main brand mention
    if (filePath.endsWith('Footer.tsx')) {
        content = content.replace(
            /<span className="font-serif text-xl font-medium tracking-wide">Therapick<\/span>/g,
            `<div className="flex items-center gap-2"><img src="/logo.png" alt="Therapick" className="h-6 object-contain" style={{ filter: 'invert(1)' }} /><span className="font-serif text-xl font-medium tracking-wide">Therapick</span></div>`
        );
        content = content.replace(
            /<span className="font-serif text-2xl font-medium tracking-wide">Therapick<\/span>/g,
            `<div className="flex items-center gap-2"><img src="/logo.png" alt="Therapick" className="h-6 object-contain" style={{ filter: 'invert(1)' }} /><span className="font-serif text-2xl font-medium tracking-wide">Therapick</span></div>`
        );
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

walkDir('./src', processFile);
console.log('Brand name replacement complete.');
