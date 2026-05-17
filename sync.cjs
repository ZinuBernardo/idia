const fs = require('fs');

function extractTag(html, startTagOpen) {
    const startIndex = html.indexOf(startTagOpen);
    if (startIndex === -1) return null;
    
    // Find matching closing tag (we assume no nested nav/footer for simplicity, which is true in our pages)
    const endTag = startTagOpen.includes('nav') ? '</nav>' : '</footer>';
    const endIndex = html.indexOf(endTag, startIndex);
    if (endIndex === -1) return null;
    
    return {
        start: startIndex,
        end: endIndex + endTag.length,
        content: html.substring(startIndex, endIndex + endTag.length)
    };
}

const indexHtml = fs.readFileSync('index.html', 'utf8');

const targetNav = extractTag(indexHtml, '<nav class="main-nav');
const targetFooter = extractTag(indexHtml, '<footer class="footer-section"');

// Extract Mobile Menu from index.html
const mobStart = indexHtml.indexOf('<!-- MOBILE MENU -->');
const mobEnd = indexHtml.indexOf('</div>', mobStart) + 6; // Include </div>
let targetMob = null;
if (mobStart !== -1 && mobEnd !== -1) {
    targetMob = indexHtml.substring(mobStart, mobEnd);
}

if (!targetNav || !targetFooter) {
    console.error("Could not find nav or footer in index.html");
    process.exit(1);
}

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace nav safely using string slicing
    const fileNav = extractTag(content, '<nav class="main-nav');
    if (fileNav) {
        content = content.substring(0, fileNav.start) + targetNav.content + content.substring(fileNav.end);
    }
    
    // Replace footer safely
    const fileFooter = extractTag(content, '<footer class="footer-section"') || extractTag(content, '<footer');
    if (fileFooter) {
        content = content.substring(0, fileFooter.start) + targetFooter.content + content.substring(fileFooter.end);
    }
    
    // Replace or inject Mobile Menu
    if (targetMob) {
        const mobStartIndex = content.indexOf('<!-- MOBILE MENU -->');
        if (mobStartIndex !== -1) {
            const mobEndIndex = content.indexOf('</div>', mobStartIndex) + 6;
            content = content.substring(0, mobStartIndex) + targetMob + content.substring(mobEndIndex);
        } else {
            // Inject right after </nav>
            const navEndIndex = content.indexOf('</nav>');
            if (navEndIndex !== -1) {
                content = content.substring(0, navEndIndex + 6) + '\n\n    ' + targetMob + '\n' + content.substring(navEndIndex + 6);
            }
        }
    }
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
});

console.log("ALL FILES SYNCED SUCCESSFULLY!");
