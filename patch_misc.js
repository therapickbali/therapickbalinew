const fs = require('fs');

function fixTopNav() {
    let content = fs.readFileSync('src/components/TopNav.tsx', 'utf-8');
    
    // Fix dropdown container
    content = content.replace(
        /bg-white\/10 backdrop-blur-\[40px\] border border-white\/40 shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.8\)\]/g,
        'bg-[#111111] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
    );
    
    // Fix active item background inside dropdown (bg-surface is #111111, so it blends in. Better use bg-white/10)
    content = content.replace(
        /'bg-surface text-white'/g,
        "'bg-white/10 text-white'"
    );
    content = content.replace(
        /hover:bg-surface\/50/g,
        "hover:bg-white/5"
    );

    // Fix therapist portal button in mobile dropdown
    content = content.replace(
        /'bg-\[\#292831\] text-white mt-2 text-center'/g,
        "'bg-white text-black mt-2 text-center'"
    );
    
    fs.writeFileSync('src/components/TopNav.tsx', content, 'utf-8');
}

function fixScroll() {
    let content = fs.readFileSync('src/app/globals.css', 'utf-8');
    if (!content.includes('overflow-x: hidden')) {
        content += '\n\nbody, html {\n  overflow-x: hidden;\n}\n';
        fs.writeFileSync('src/app/globals.css', content, 'utf-8');
    }
}

function fixTimeInputLength() {
    const files = [
        'src/app/rituals/[id]/page.tsx',
        'src/components/BookingModal.tsx',
        'src/components/LocationClient.tsx',
        'src/app/page.tsx'
    ];
    
    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf-8');
        
        // Let's make time input have a max-width to match calendar visually, or just adjust its padding.
        // Actually, if we just remove w-full and make it match the calendar container size...
        // Let's just wrap it or change w-full to something slightly narrower if that's what they mean, 
        // OR the horizontal scroll fix might just fix the visual bug they see.
        // I will change the padding to be even tighter and remove w-full if it's there? No, w-full is fine.
        // Let's just change it to bg-[#111111] to match the calendar if it has bg-white/10.
        // Wait, FloatingCalendar has: bg-white/10 backdrop-blur-[40px] border border-white/40
        // The time input has the same classes.
        
        // I'll make the time input's style exactly the same as the calendar's container.
        // Calendar is `rounded-[24px] p-4`. Time input is `rounded-xl px-4 py-3`.
        // Let's make time input `rounded-[24px] px-4 py-4` so they look like siblings.
        content = content.replace(
            /rounded-xl px-4 py-3 text-sm text-white/g,
            "rounded-[24px] px-4 py-4 text-sm text-white text-center"
        );
        content = content.replace(
            /rounded-xl px-4 py-4 text-sm text-white/g, // just in case
            "rounded-[24px] px-4 py-4 text-sm text-white text-center"
        );
        
        fs.writeFileSync(file, content, 'utf-8');
    });
}

fixTopNav();
fixScroll();
fixTimeInputLength();
console.log('Fixed TopNav, scroll, and time input style.');
