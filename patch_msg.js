const fs = require('fs');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const oldMsgLogic = `const therapistDetails = selectedTherapist 
                ? MOCK_THERAPISTS.find(t => t.id === selectedTherapist)
                : null;
            const therapistMsg = therapistDetails ? \`\\n*Therapist Request:* \${therapistDetails.name}\` : '\\n*Therapist Request:* Any Available Therapist';`;

    const newMsgLogic = `const therapistMsg = selectedTherapists.length > 0
                ? \`\\n*Therapist Request:* \${selectedTherapists.map(id => MOCK_THERAPISTS.find(t => t.id === id)?.name).join(', ')}\`
                : '\\n*Therapist Request:* Assign Automatically';`;
    
    // Also we need to catch if it's slightly different formatting
    // Let's use a regex to be safer
    const msgRegex = /const therapistDetails = selectedTherapist[\s\S]*?therapistMsg = therapistDetails \?[\s\S]*?Any Available Therapist';/g;
    content = content.replace(msgRegex, newMsgLogic);
    
    fs.writeFileSync(filePath, content);
    console.log("Patched msg in " + filePath);
}

patchFile('src/app/page.tsx');
patchFile('src/app/rituals/[id]/page.tsx');
