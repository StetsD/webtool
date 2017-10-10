const fs = require('fs');
const {remote} = require('electron'),
        {dialog} = remote;
window.jQuery = window.$ = require('jquery');
window.semantic = require('semantic-ui/dist/semantic');
const main = remote.require('./index.js');
const ModalStatus = require('./js/modules/modal.status.js');

let modalStatus = new ModalStatus({
    $elem: $('.js-modal-status')
});

const $editor = $('.js-editor'),
    $btnSaveFile = $('.js-save-file'),
    $btnGoToMain = $('.js-back-main');

$btnSaveFile.on('click', ()=>{
    let val = $editor.val();

    val && dialog.showSaveDialog({title: 'index.html', defaultPath: __dirname}, file => {
        fs.writeFile(file, val, 'utf8', err => {
            if(err){
                modalStatus.addStatus(err);
                throw err;
            }else{
                modalStatus.addStatus('Файл успешно сохранён');
            }

            modalStatus.show();
        });
    });
});

$btnGoToMain.on('click', ()=>{
    main.openWindow();
});
