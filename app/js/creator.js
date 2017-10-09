const fs = require('fs');
const {remote} = require('electron'),
        {dialog} = remote;
window.jQuery = window.$ = require('jquery');
window.semantic = require('semantic-ui/dist/semantic');
const main = remote.require('./index.js');

const $editor = $('.js-editor'),
    $btnSaveFile = $('.js-save-file'),
    $btnGoToMain = $('.js-back-main'),
    $popupStatus = $('.js-modal-status'),
    $popupStatusHeader = $('.js-modal-status .header');

$btnSaveFile.on('click', ()=>{
    let val = $editor.val();

    val && dialog.showSaveDialog({title: 'index.html', defaultPath: __dirname}, file => {
        fs.writeFile(file, val, 'utf8', err => {
            if(err){
                $popupStatusHeader.text(err);
                throw err;
            }else{
                $popupStatusHeader.text('Файл успешно сохранён');
            }

            $popupStatus.modal('show');
        });
    });
});

$btnGoToMain.on('click', ()=>{
    main.openWindow();
});
