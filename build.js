const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

// Ensure build directory exists
const buildDir = 'build';
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Read the source file
const source = fs.readFileSync('src/bookmarklet.js', 'utf8');

// Minify the source code
const minified = UglifyJS.minify(source).code;

// Save the minified version
fs.writeFileSync('build/bookmarklet.min.js', minified);

// Create the bookmarklet
const encoded = 'javascript:' + encodeURIComponent(minified);
fs.writeFileSync('build/bookmarklet.txt', encoded);