const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');

const navMatch = index.match(/<nav class="main-nav(?:\s|[^>])*?>[\s\S]*?<\/nav>/);
const footerMatch = index.match(/<footer class="footer-section"[\s\S]*?<\/footer>/);
const mobileMenuMatch = index.match(/<!-- MOBILE MENU -->[\s\S]*?<\/div>\n\n/);

if (!navMatch || !footerMatch) {
    console.error("Could not find nav or footer in index.html");
    process.exit(1);
}

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace Nav
    content = content.replace(/<nav class="main-nav(?:[\s\S]*?)<\/nav>/, navMatch[0]);
    
    // Replace Footer
    if (content.includes('<footer class="footer-section"')) {
        content = content.replace(/<footer class="footer-section"[\s\S]*?<\/footer>/, footerMatch[0]);
    } else if (content.includes('<footer')) {
        content = content.replace(/<footer[\s\S]*?<\/footer>/, footerMatch[0]);
    }
    
    // Replace Mobile Menu
    if (mobileMenuMatch) {
        if (content.includes('<!-- MOBILE MENU -->')) {
            content = content.replace(/<!-- MOBILE MENU -->[\s\S]*?<\/div>(?:\n\n|\n)/, mobileMenuMatch[0]);
        } else {
            content = content.replace(/<\/nav>/, '</nav>\n\n    ' + mobileMenuMatch[0]);
        }
    }
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
});
