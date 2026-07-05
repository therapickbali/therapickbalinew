const fs = require('fs');

function fixTimeInput() {
    const files = [
        'src/app/page.tsx',
        'src/components/LocationClient.tsx',
        'src/app/rituals/[id]/page.tsx',
        'src/components/BookingModal.tsx'
    ];
    
    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf-8');

        // The time input has this class:
        // w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[24px] px-4 py-4 text-sm text-white text-center placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
        // Or something similar. Let's find `<input type="time"` or `<input\n *type="time"` and change its w-full to something smaller.
        
        // I will replace 'w-full' with 'w-48 mx-auto block' specifically for the time input.
        
        // Let's use a regex that matches the class string of the time input.
        // It generally contains "px-4 py-4 text-sm text-white text-center"
        content = content.replace(
            /className="w-full (bg-white\/10 backdrop-blur-\[40px\][^"]+px-4 py-4 text-sm text-white text-center[^"]+)"/g,
            'className="w-48 mx-auto block $1"'
        );
        content = content.replace(
            /className=\{`w-full (\$\{liquidGlassClasses\}[^`]+px-4 py-4 text-sm text-white text-center[^`]+)`\}/g,
            'className={`w-48 mx-auto block $1`}'
        );
        
        fs.writeFileSync(file, content, 'utf-8');
    });
}

fixTimeInput();
console.log('Fixed time input width');
