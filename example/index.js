/**
 * WebAssembler Example
 * build into static site
 */
const webAssembler = require('..');
const fs = require('fs');
const path = require('path');

webAssembler.dirWalk(path.resolve(__dirname, 'docs'), p => {
    console.log('building path:', p);
    let md = webAssembler.buildMD(p);
    let file = webAssembler.buildFromHTMLtemplate(path.resolve(__dirname, 'template.html'), md);
    fs.writeFileSync(path.dirname(p) + `/../${path.basename(p, '.md')}.html`, file);
});