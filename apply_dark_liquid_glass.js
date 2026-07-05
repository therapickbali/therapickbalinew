const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
    'src/app',
    'src/components'
];

function scanDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath, fileList);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function replaceStylesInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    const newLiquidGlass = 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]';

    // Replace hardcoded backgrounds
    content = content.replace(/bg-\[\#FDFBF7\]/g, 'bg-black');
    content = content.replace(/bg-background/g, 'bg-black');
    content = content.replace(/bg-\[\#F5F5F7\]/g, 'bg-[#111]');
    content = content.replace(/bg-gray-50/g, 'bg-white/10');
    content = content.replace(/bg-gray-100/g, 'bg-white/20');
    content = content.replace(/bg-gray-200/g, 'bg-white/30');

    // Simplify replacement by targeting common glass strings and using generic regex for tailwind glass styles
    content = content.replace(/bg-white\/[0-9]+\s+backdrop-blur-[a-z0-9\[\]]+\s+border\s+border-white\/[0-9]+\s+shadow-[a-z0-9\[\]_,().]+/g, newLiquidGlass);
    
    // Top Nav / Header specific backgrounds
    content = content.replace(/bg-white\/[0-9]+\s+backdrop-blur-[a-z]+(\s+border\s+border-white\/[0-9]+)?/g, newLiquidGlass);
    
    // Specifically target some known strings
    content = content.replace(/bg-white\/80 backdrop-blur-md border border-white\/60/g, newLiquidGlass);
    content = content.replace(/bg-white\/40 backdrop-blur-md/g, newLiquidGlass);
    content = content.replace(/bg-white\/60 backdrop-blur-sm border border-primary\/10/g, newLiquidGlass);
    
    // Convert text colors for dark mode
    content = content.replace(/text-primary/g, 'text-white');
    content = content.replace(/text-text/g, 'text-white/90');
    content = content.replace(/text-text-muted/g, 'text-white/60');
    content = content.replace(/text-gray-900/g, 'text-white');
    content = content.replace(/text-gray-400/g, 'text-white/50');

    // Buttons
    content = content.replace(/bg-primary text-white/g, 'bg-white text-black');
    content = content.replace(/bg-primary/g, 'bg-white'); 
    
    // Borders
    content = content.replace(/border-border/g, 'border-white/20');
    content = content.replace(/border-gray-100/g, 'border-white/10');

    // Fix specific classes on page.tsx
    content = content.replace(/from-\[\#D2F34C\] to-\[\#FDFBF7\]/g, 'from-[#D2F34C]/20 to-black');
    
    content = content.replace(/bg-white shadow-sm/g, 'bg-white/20 shadow-md');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

function run() {
    const files = [];
    DIRECTORIES_TO_SCAN.forEach(dir => {
        files.push(...scanDir(path.join(__dirname, dir)));
    });

    for (const file of files) {
        replaceStylesInFile(file);
    }
    console.log("Done patching liquid glass styles for dark theme!");
}

run();
