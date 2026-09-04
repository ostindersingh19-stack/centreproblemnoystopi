const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const partialsDir = path.join(root, 'partials');

const partials = {
    header: fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8').trim(),
    cta: fs.readFileSync(path.join(partialsDir, 'cta.html'), 'utf8').trim(),
    footer: fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8').trim(),
};

const pages = fs
    .readdirSync(root)
    .filter((file) => file.endsWith('.html'))
    .sort();

function withCurrentNav(header, filename) {
    return header.replace(
        new RegExp(`(<a href="${filename}" data-page="${filename}")`, 'g'),
        `$1 aria-current="page"`
    );
}

function withImageDefaults(html, filename) {
    let serviceImageCount = 0;

    return html.replace(/<img\b([^>]*?)>/g, (match, attrs) => {
        if (attrs.includes('images/services/var1.png')) {
            return match;
        }

        let nextAttrs = attrs;

        if (filename === 'index.html' && serviceImageCount < 3) {
            serviceImageCount += 1;
            nextAttrs = nextAttrs
                .replace(/\sloading="[^"]*"/g, '')
                .replace(/\sfetchpriority="[^"]*"/g, '');
            nextAttrs += ' loading="eager" fetchpriority="high"';
        } else {
            if (!/\sloading=/.test(nextAttrs)) {
                nextAttrs += ' loading="lazy"';
            }
        }

        if (!/\sdecoding=/.test(nextAttrs)) {
            nextAttrs += ' decoding="async"';
        }

        return `<img${nextAttrs}>`;
    });
}

for (const page of pages) {
    const filePath = path.join(root, page);
    let html = fs.readFileSync(filePath, 'utf8');

    html = html.replace(/<header class="header">[\s\S]*?<\/header>/, withCurrentNav(partials.header, page));

    if (html.includes('<section class="cta">')) {
        html = html.replace(/<section class="cta">[\s\S]*?<\/section>/, partials.cta);
    }

    html = html.replace(/<footer class="footer">[\s\S]*?<\/footer>/, partials.footer);

    if (!html.includes('<script src="js/script.js"></script>')) {
        html = html.replace(/\s*<\/body>/, '\n\n<script src="js/script.js"></script>\n\n</body>');
    }

    html = withImageDefaults(html, page);

    fs.writeFileSync(filePath, html.endsWith('\n') ? html : `${html}\n`);
}

console.log(`Updated ${pages.length} pages from partials.`);
