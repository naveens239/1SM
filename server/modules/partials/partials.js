module.exports = {
    register    : register,
    registerAll : registerAll
};

var file_walker = require('filewalker'),
    path       = require('path'),
    hbs       = require('hbs'),
    fs       = require('fs');

function registerAll(scanPath) {
    var started = Date.now();
    file_walker(scanPath)
        .on('file', function (p, s) {
            //console.log('file: %s', p);
            register(scanPath, p);
        }).on('done', function () {
            var duration = Date.now() - started;
            console.log('Scanned partials from %d dirs, %d files in %d ms', this.dirs, this.files, duration);
        })
        .walk();
}

function register(scanPath, file) {
    var template, tagStart = "", tagEnd = "",
        ext = path.extname(file);

    if (ext === '.js') {
        tagStart = '<script>';
        tagEnd = '</script>';
    } else if (ext === '.css') {
        tagStart = '<style>';
        tagEnd = '</style>';
    }
    template = tagStart + fs.readFileSync(path.join(scanPath, file), 'utf8') + tagEnd;
    hbs.registerPartial(file, template);
}