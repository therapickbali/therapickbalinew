const fs = require('fs');

function fixTreatmentCardShadow() {
    const files = [
        'src/app/page.tsx',
        'src/components/LocationClient.tsx',
        'src/app/rituals/[id]/page.tsx'
    ];
    
    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf-8');

        // Remove the glowing orb
        content = content.replace(
            /<div className="absolute -top-10 -right-10 w-32 h-32 bg-white\/60 blur-\[30px\] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"><\/div>/g,
            ''
        );
        
        fs.writeFileSync(file, content, 'utf-8');
    });
}

fixTreatmentCardShadow();
console.log('Removed white glowing orbs from treatment cards');
