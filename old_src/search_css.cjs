const fs = require('fs');

const css = fs.readFileSync('extracted_styles.css', 'utf-8');

// Find all hex colors
const hexes = css.match(/#[a-fA-F0-9]{3,8}\b/g) || [];
const uniqueHexes = Array.from(new Set(hexes.map(h => h.toLowerCase())));
console.log("Unique hex colors in CSS:", uniqueHexes);

// Find custom variables
const vars = css.match(/--[a-zA-Z0-9_-]+:[^;}]+/g) || [];
const uniqueVars = Array.from(new Set(vars));
console.log("Custom variables in CSS:", uniqueVars.slice(0, 50));

// Find imported fonts
const fonts = css.match(/font-family:[^;}]+/g) || [];
const uniqueFonts = Array.from(new Set(fonts));
console.log("Font families in CSS:", uniqueFonts);
