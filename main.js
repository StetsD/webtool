const electron = require('electron');
var fs = require('fs');
var {remote} = electron;
window.jQuery = window.$ = require('jquery');
var main = remote.require('./index.js');

$('.js-btn-link').on('click', function(){
    let name = $(this).data('link');
    main.openWindow(name);
});
