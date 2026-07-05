const fs = require('fs');

function fixTherapistLogin() {
    const file = 'src/app/therapist-login/page.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Fix main background
    content = content.replace(/bg-\[\#FDFDFD\]/g, 'bg-black');
    
    // Fix main form card
    content = content.replace(
        /bg-white\/40 backdrop-blur-\[40px\] border border-white\/60 rounded-\[32px\] p-6 sm:p-8 shadow-\[inset_0_1px_1px_rgba\(255,255,255,1\),0_24px_48px_-12px_rgba\(0,0,0,0\.05\)\]/g,
        'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 sm:p-8'
    );
    
    // Fix toggle background slider
    content = content.replace(
        /bg-white rounded-xl shadow-sm/g,
        'bg-white/20 rounded-xl shadow-sm'
    );
    
    // Fix input backgrounds
    content = content.replace(
        /bg-white\/50 border border-white\/20\/50/g,
        'bg-white/5 border border-white/20'
    );
    
    fs.writeFileSync(file, content, 'utf-8');
}

function fixContact() {
    const file = 'src/app/contact/page.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Fix "Have Questions?" card
    content = content.replace(
        /'bg-white text-black p-8 rounded-3xl text-center'/g, // wait, it might not have quotes in grep
        '"bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white p-8 rounded-3xl text-center"'
    );
    content = content.replace(
        /className="bg-white text-black p-8 rounded-3xl text-center"/g,
        'className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white p-8 rounded-3xl text-center"'
    );
    
    // Fix whatsapp button
    content = content.replace(
        /bg-white text-white/g,
        'bg-white text-black hover:bg-white/90'
    );
    
    fs.writeFileSync(file, content, 'utf-8');
}

function fixFaq() {
    const file = 'src/components/FaqSection.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    content = content.replace(
        /bg-white border \$\{openIdx/g,
        'bg-[#111111] border border-white/10 ${openIdx'
    );
    
    fs.writeFileSync(file, content, 'utf-8');
}

function fixServiceAreas() {
    const file = 'src/components/ServiceAreas.tsx';
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    content = content.replace(
        /bg-white\/40 backdrop-blur-2xl border border-white\/50/g,
        'bg-[#111111] border border-white/10'
    );
    // There is also `border border-white/60` at the end of the class string, let's remove it to avoid double borders
    content = content.replace(
        / h-full flex flex-col relative overflow-hidden border border-white\/60/g,
        ' h-full flex flex-col relative overflow-hidden'
    );
    
    fs.writeFileSync(file, content, 'utf-8');
}

fixTherapistLogin();
fixContact();
fixFaq();
fixServiceAreas();
console.log('Fixed white backgrounds in Therapist Login, Contact, FAQ, and Service Areas.');
