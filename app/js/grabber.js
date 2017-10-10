const fs = require('fs');
const path = require('path');
const req = require('request');
const {remote} = require('electron');
const {dialog} = remote;
window.jQuery = window.$ = require('jquery');
window.semantic = require('semantic-ui/dist/semantic');
var main = remote.require('./index.js');
const GLOBAL = remote.getGlobal('apps');
const ModalStatus = require('./js/modules/modal.status.js');

let modalStatus = new ModalStatus({
    $elem: $('.js-modal-status')
});

let $editor = $('.js-grab-editor'),
    $urlGrabber = $('[name="grabber-val"]'),
    $tableRes = $('.js-table-res'),
    $btnSave = $('.js-save-temp'),
    $btnRunGrab = $('.js-run-brab'),
    $btnGoToMain = $('.js-back-main');


function tryOg(arr){
    if(Array.isArray(arr)){
        if(arr[0]){
            return arr[0];
        }
    }
    return false;
}

function pickContent(str){
    let res = str.match(/content="(.+)"/i)[1];
    if(res){
        return res;
    }
    return null;
}

$btnGoToMain.on('click', ()=>{
    main.openWindow();
});

$btnSave.on('click', ()=>{
    dialog.showSaveDialog({title: 'index.html', filters: '.html', defaultPath: __dirname}, file => {
        const FILE = path.parse(file);
        let {name, ext} = FILE;
        fs.writeFile(file, $editor.val(), 'utf8', (err)=>{
            if(err){
                modalStatus.addStatus(err);
                throw err;
            }
            modalStatus.addStatus('Файл успешно сохранён');
        });
        modalStatus.show();
    });
});

$btnRunGrab.on('click', ()=>{
    let val = $urlGrabber.val();

    val && req(val, (err, res, body) => {
        if(err) throw err;

        $editor.val(body).removeClass('hidden');
        $btnSave.removeClass('hidden');

        let summ = body.match(/./gi).length,
            summWithoutSpace = body.match(/\S/gi).length,
            summTag = body.match(/<[^/][^>]+>/gi).length,
            rawOgUrl = body.match(/<.*property="og:url".*>/gi),
            rawOgTitle = body.match(/<.*property="og:title".*>/gi),
            rawOgDesc = body.match(/<.*property="og:description".*>/gi),
            rawOgImg = body.match(/<.*property="og:img".*>/gi);

        $tableRes.find('tbody').remove();
        $tableRes.append(`
            <tbody>
                <tr>
                    <td>${summ}</td>
                    <td>${summWithoutSpace}</td>
                    <td>${summTag}</td>
                    <td>${tryOg(rawOgUrl) ? pickContent(rawOgUrl[0]) : null}</td>
                    <td>${tryOg(rawOgTitle) ? pickContent(rawOgTitle[0]) : null}</td>
                    <td>${tryOg(rawOgDesc) ? pickContent(rawOgDesc[0]) : null}</td>
                    <td>${tryOg(rawOgImg) ? pickContent(rawOgImg[0]) : null}</td>
                </tr>
            </tbody>
        `);
    });
});

//https://uralmedias.ru/
