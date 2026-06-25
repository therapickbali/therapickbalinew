const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/app/rituals/[id]/page.tsx',
  'src/components/LocationClient.tsx',
  'therapick/src/app/page.tsx',
  'therapick/src/app/rituals/[id]/page.tsx',
  'therapick/src/components/LocationClient.tsx',
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`File ${file} not found, skipping.`);
    continue;
  }
  let content = fs.readFileSync(file, 'utf-8');

  // Replace function signature
  content = content.replace(/paymentMethod: 'crypto' \| 'whatsapp'/g, '');
  content = content.replace(/, paymentMethod: 'crypto' \| 'whatsapp'/g, '');

  // The NowPayments generation block
  const nowPaymentsRegex = /\s*let invoiceUrl = '';\s*\/\/ Generate NowPayments invoice\s*const response = await fetch\('\/api\/checkout\/nowpayments'[\s\S]*?let cryptoPaymentNote = '';\s*if \(response\.ok\) \{[\s\S]*?\}\s*\}/;
  content = content.replace(nowPaymentsRegex, '');
  
  const nowPaymentsRegex2 = /\s*\/\/ Generate NowPayments invoice\s*const response = await fetch\('\/api\/checkout\/nowpayments'[\s\S]*?if \(response\.ok\) \{[\s\S]*?\}\s*\}/;
  content = content.replace(nowPaymentsRegex2, '');

  // The routing logic
  const routingRegex = /\s*if \(paymentMethod === 'crypto' && invoiceUrl\) \{[\s\S]*?\} else \{\s*const fullMessage = baseMessage \+ cryptoPaymentNote;\s*const waUrl = `https:\/\/wa\.me\/\$\{waNumber\}\?text=\$\{encodeURIComponent\(fullMessage\)\}`;\s*if \(newWindow\) \{\s*newWindow\.location\.href = waUrl;\s*\} else \{\s*window\.location\.href = waUrl; \/\/ Fallback if popup blocker blocked the initial window\s*\}\s*\}/;
  content = content.replace(routingRegex, `
            const waUrl = \`https://wa.me/\${waNumber}?text=\${encodeURIComponent(baseMessage)}\`;
            if (newWindow) {
                newWindow.location.href = waUrl;
            } else {
                window.location.href = waUrl;
            }`);

  // Safe button removal
  const buttonRegex = /\s*<button[^>]*?onClick=\{\(e\) => handle(?:CampaignBooking|Booking)\(e, 'crypto'\)\}[^>]*?>(?:(?!<\/button>)[\s\S])*?PAY WITH CRYPTO(?:(?!<\/button>)[\s\S])*?<\/button>/g;
  content = content.replace(buttonRegex, '');

  // Remove the passing of 'whatsapp' to the function
  content = content.replace(/\(e\) => handleCampaignBooking\(e, 'whatsapp'\)/g, '(e) => handleCampaignBooking(e)');
  content = content.replace(/\(e\) => handleBooking\(e, 'whatsapp'\)/g, '(e) => handleBooking(e)');
  content = content.replace(/\(e\) => handleSubmit\(e, 'whatsapp'\)/g, '(e) => handleSubmit(e)');

  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Updated ${file}`);
}

const successFiles = [
  'src/app/payment/success/page.tsx',
  'therapick/src/app/payment/success/page.tsx'
];
for (const file of successFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/const finalMessage = pendingMessage \+ '\\n\\n\*\[PAID VIA CRYPTO\]\*';/g, 'const finalMessage = pendingMessage;');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}
