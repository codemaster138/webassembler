/**
 * WebAssembler
 * A Node.js static site generator
 * Copyright (C) 2020 - Jake Sarjeant
 * Published under the GNU Public License v3
 */
const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const formatHTML = require('html-format');

/**
 * Utilities
 */

/**
 * Walk a directory
 * @param {string} dir Path to the directory
 */
var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

function evaluate(t, i, f) {
    let n = t.substr(3, t.length - 4);
    let _i = parseInt(n);
    if (_i >= i.length) throw `Input index out of range in ${f}: ${_i}`;
    return i[_i];
}

/**
 * Walk a directory and call `callback` for every item
 * @param {string} path The path to walk
 * @param {Function} callback Called after every item
 */
function dirWalk(path, callback) {
    let elements = walk(path);
    elements.forEach(el => callback(el, elements));
}

/**
 * Insert inputs into HTML template
 * @param {string} path Path to template
 * @param  {...string} inputs Array of substitutions
 */
function buildFromHTMLtemplate(path, ...inputs) {
    let template = fs.readFileSync(path).toString();
    let built = template.replace(/<%=[0-9]+%>/, t => evaluate(t, inputs, path));
    built = formatHTML(built);
    return built;
}

/**
 * Convert markdown to html
 * @param {string} path Path to .md file
 */
function buildMD(path) {
    let conv = new showdown.Converter();
    let text = fs.readFileSync(path).toString();
    let html = conv.makeHtml(text);
    return html;
}

module.exports = {
    dirWalk,
    buildFromHTMLtemplate,
    buildMD
}