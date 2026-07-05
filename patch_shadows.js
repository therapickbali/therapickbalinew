const fs = require('fs');

function fixPopularCategories() {
    const file = 'src/app/page.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Fix category buttons styling
    content = content.replace(
        /'bg-white\/10 backdrop-blur-\[40px\] border border-white\/40 shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.8\)\] text-white border border-white\/60 hover:bg-white\/80 hover:scale-\[1\.02\]'/g,
        "'bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:scale-[1.02]'"
    );
    
    fs.writeFileSync(file, content, 'utf-8');
}

function fixServiceAreas() {
    const file = 'src/components/ServiceAreas.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Remove the light background div from the cards
    content = content.replace(
        /<div className="absolute inset-0 bg-gradient-to-br from-\[\#FDFBF7\] to-\[\#F3F4F6\] z-0"><\/div>/g,
        ''
    );
    
    fs.writeFileSync(file, content, 'utf-8');
}

fixPopularCategories();
fixServiceAreas();
console.log('Fixed category shadows and service area backgrounds');
