const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/app/rituals/[id]/page.tsx',
    'src/components/BookingModal.tsx',
    'src/components/LocationClient.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Fix expand treatment buttons
    content = content.replace(
        /bg-white border border-white\/20 flex items-center justify-center text-white transition-all duration-300 \$\{expandedTreatmentId === t\.id \? 'rotate-45 bg-white text-black' : 'group-hover:bg-white group-hover:text-white'\}/g,
        "bg-transparent border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${expandedTreatmentId === t.id ? 'rotate-45 bg-white text-black' : 'group-hover:bg-white group-hover:text-black'}"
    );

    // Fix + and - buttons for guests
    content = content.replace(
        /bg-white border border-white\/20 flex items-center justify-center text-white/g,
        "bg-white flex items-center justify-center text-black"
    );
    // There are some with bg-white/50 border border-white (which were missed or changed) in BookingModal.tsx:
    content = content.replace(
        /bg-white\/50 border border-white flex items-center justify-center text-white/g,
        "bg-white flex items-center justify-center text-black"
    );

    // Fix Area buttons in BookingModal that got white text on white bg
    content = content.replace(
        /bg-white border-primary text-white shadow-md/g,
        "bg-white border-primary text-black shadow-md"
    );

    // Fix Therapist selection buttons
    content = content.replace(
        /bg-white border border-white\/20 text-white/g,
        "bg-transparent border border-white/20 text-white hover:bg-white/10"
    );

    // Fix time input padding
    content = content.replace(
        /rounded-xl px-4 py-4 text-sm text-white/g,
        "rounded-xl px-4 py-3 text-sm text-white"
    );

    // Fix green gradient in home page
    if (file === 'src/app/page.tsx') {
        content = content.replace(
            /from-\[\#D2F34C\]\/20 to-black/g,
            "from-transparent to-transparent"
        );
    }

    fs.writeFileSync(file, content, 'utf-8');
});
console.log('Buttons and styling patched!');
