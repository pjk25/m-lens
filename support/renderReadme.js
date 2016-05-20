'use strict';

const child_process = require('child_process');
const fs = require('fs');
const Mustache = require('mustache');
const path = require('path');

let exampleJs = path.join(__dirname, 'example.js');

fs.readFile(exampleJs,  'utf8', function (error, example) {
    let root = path.join(__dirname, '..');
    fs.symlink(path.join(root, 'src'), path.join(root, 'node_modules', 'm-lens'), function () {
        child_process.exec(`cat ${exampleJs} | dist-es6-run`, function (error, stdout) {
            fs.readFile(path.join(__dirname, 'README.md.mustache'), 'utf8', function (error, template) {
                console.log(Mustache.render(template, {
                    code: indent(example),
                    output: indent(stdout)
                }));
            });
        });
    });
});

function indent(string) {
    return string.split('\n').map(function (l) {
        return `    ${l}`;
    }).join('\n');
}
