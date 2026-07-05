const fs = require('fs');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the image tag in the therapist card mapping with an interactive div
    const targetImage = '<img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-border" />';
    const newImage = `<div onClick={(e) => { e.stopPropagation(); setViewingTherapist(t); }} className="relative group/avatar cursor-pointer rounded-full overflow-hidden shrink-0 border border-border">
                                                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover transition-transform group-hover/avatar:scale-110" />
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                        <span className="text-[8px] font-bold text-white uppercase tracking-wider">Profile</span>
                                                    </div>
                                                </div>`;
    
    if (content.includes(targetImage)) {
        content = content.replace(targetImage, newImage);
        fs.writeFileSync(filePath, content);
        console.log("Patched " + filePath);
    } else {
        console.log("Image tag not found in " + filePath);
    }
}

patchFile('src/app/page.tsx');
patchFile('src/app/rituals/[id]/page.tsx');
