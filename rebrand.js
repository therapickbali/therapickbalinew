const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Clean up Pending Therapists
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1]] = match[2].trim();
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deletePendingTherapists() {
    console.log('Deleting pending therapists...');
    const { data, error } = await supabase
        .from('therapists')
        .delete()
        .eq('is_active', false);
        
    if (error) {
        console.error('Error deleting pending therapists:', error);
    } else {
        console.log('Successfully deleted pending therapists.');
    }
}

// 2. Global Find and Replace
const replacements = [
    { from: /Therapick Bali/g, to: 'Therapick Dubai' },
    { from: /therapickbali\.vercel\.app/g, to: 'therapickdubai.vercel.app' },
    { from: /Bali/g, to: 'Dubai' },
    { from: /bali/g, to: 'dubai' },
    { from: /Ubud/g, to: 'Downtown Dubai' },
    { from: /ubud/g, to: 'downtown-dubai' },
    { from: /Canggu/g, to: 'Dubai Marina' },
    { from: /canggu/g, to: 'dubai-marina' },
    { from: /Seminyak/g, to: 'Jumeirah' },
    { from: /seminyak/g, to: 'jumeirah' },
    { from: /Uluwatu/g, to: 'Palm Jumeirah' },
    { from: /uluwatu/g, to: 'palm-jumeirah' },
    { from: /Nusa Dua/g, to: 'Business Bay' },
    { from: /nusa-dua/g, to: 'business-bay' },
    { from: /Sanur/g, to: 'DIFC' },
    { from: /sanur/g, to: 'difc' },
    { from: /Kuta/g, to: 'Al Barsha' },
    { from: /kuta/g, to: 'al-barsha' },
    { from: /Legian/g, to: 'JLT' },
    { from: /legian/g, to: 'jlt' },
    { from: /Jimbaran/g, to: 'Dubai Creek' },
    { from: /jimbaran/g, to: 'dubai-creek' },
    { from: /All Dubai Areas/g, to: 'All Dubai Areas' } // fix if multiple replacements happen
];

const excludeDirs = ['node_modules', '.git', '.next'];
const targetExts = ['.ts', '.tsx', '.json', '.md'];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                processDirectory(fullPath);
            }
        } else if (stat.isFile() && targetExts.includes(path.extname(fullPath))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Apply replacements
            for (const { from, to } of replacements) {
                content = content.replace(from, to);
            }
            
            content = content.replace(/domain-dubai-only/g, 'domain-bali-only');
            content = content.replace(/therapickdubainew/g, 'therapickbalinew'); // restore github repo name if changed
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

async function run() {
    await deletePendingTherapists();
    console.log('Starting global find and replace...');
    processDirectory(path.join(__dirname, 'src'));
    
    const rootFiles = ['metadata.json', 'package.json'];
    for (const file of rootFiles) {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            for (const { from, to } of replacements) {
                content = content.replace(from, to);
            }
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
    console.log('Rebranding complete.');
}

run();
