var fs = require('fs');
var {remote} = require('electron');
window.jQuery = window.$ = require('jquery');
window.semantic = require('semantic-ui/dist/semantic');
var main = remote.require('./index.js');
const GLOBAL = remote.getGlobal('apps');

var $editor = $('.js-editor');
$editor.length && GLOBAL.temp && $editor.val(GLOBAL.temp);

var $btnSaveFile = $('.js-save-file');
$btnSaveFile.on('click', ()=>{
    fs.writeFile(GLOBAL.link, $editor.val(), 'utf8', err => {
        if(err) throw err;
        main.openWindow('select');
    });
});

$('.js-back-main').on('click', ()=>{
    main.openWindow('select');
});
