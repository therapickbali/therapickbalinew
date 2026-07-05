const fs = require('fs');

function fixGreenGlows() {
    const file = 'src/app/page.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Remove green glowing orbs from page.tsx
    content = content.replace(
        /bg-secondary\/30 blur-\[120px\]/g,
        'bg-transparent blur-[120px]'
    );
    content = content.replace(
        /bg-accent\/20 blur-\[100px\]/g,
        'bg-transparent blur-[100px]'
    );
    content = content.replace(
        /bg-secondary\/30 rounded-full blur-2xl/g,
        'bg-transparent rounded-full blur-2xl'
    );
    
    // Also change bgPattern in SpaContext.tsx just to be safe
    const contextFile = 'src/context/SpaContext.tsx';
    if (fs.existsSync(contextFile)) {
        let ctxContent = fs.readFileSync(contextFile, 'utf-8');
        ctxContent = ctxContent.replace(/from-secondary\/80/g, 'from-transparent');
        ctxContent = ctxContent.replace(/from-secondary\/10/g, 'from-transparent');
        ctxContent = ctxContent.replace(/to-highlight\/40/g, 'to-transparent');
        ctxContent = ctxContent.replace(/via-highlight\/40/g, 'via-transparent');
        fs.writeFileSync(contextFile, ctxContent, 'utf-8');
    }
    
    // Check if bgPattern has defaults in page.tsx that use highlight/secondary
    content = content.replace(/from-secondary\/80 to-highlight\/40/g, 'from-transparent to-transparent');
    
    // Fix popular categories glow
    content = content.replace(/bg-gradient-to-br from-highlight\/60 to-surface/g, 'bg-transparent');
    
    fs.writeFileSync(file, content, 'utf-8');
}

fixGreenGlows();
console.log('Removed green glows from page.tsx and context');
