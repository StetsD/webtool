var fs = require('fs');
const path = require('path');
var {remote} = require('electron');
var {dialog} = remote;
window.jQuery = window.$ = require('jquery');
window.semantic = require('semantic-ui/dist/semantic');
var main = remote.require('./index.js');
const GLOBAL = remote.getGlobal('apps');

let $popupDelete = $('.js-popup-confirm-delete'),
    $popupDeleteStatus = $popupDelete.find('.header');

const STORE = {
    $tr: null,
    fileForDel: null
}


function showConfirmPopup($popup, msg, filepath){
    if(!$popup.modal) throw new TypeError('Selector does not a modal');
    $popup.find('.header').text(msg);
    $popup.modal('show');
    STORE.fileForDel = filepath;
}

function refreshTable(that){
    STORE.$tr && STORE.$tr.remove();
}

function delOrEdit(that, command, callback){
    let link = typeof that == 'string' ? that : that.closest('tr').data('file');

    if(command == 'edit'){
        let temp = fs.readFileSync(link, 'utf8');
        main.openWindow('editor', {temp, link});
    }
    if(command == 'del'){
        fs.unlink(link, err => {
            if(err) throw err;

            callback(that);
        });
    }
}

$('.js-run').on('click', ()=>{
    const res = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});

    var html = '';

    res && res.forEach(pathF => {
        if(fs.existsSync(pathF)){
            let {size, ctime, atime, mtime, uid, gid} = fs.statSync(pathF, 'utf8');
            let {name, ext, dir} = path.parse(pathF);
            html += `<tr data-file="${pathF}">
                        <td><a class="js-btn-file" href="${pathF}">${name}</a></td>
                        <td>${ext}</td>
                        <td>${dir}</td>
                        <td>${size}</td>
                        <td>${ctime}</td>
                        <td>${atime}</td>
                        <td>${mtime}</td>
                        <td>${uid}</td>
                        <td>${gid}</td>
                        <td>
                            <div class="ui vertical buttons">
                                <button class="js-file-edit button compact ui grey">edit</button>
                                <button class="js-file-delete button compact ui red">del</button>
                            </div>
                        </td>
                    </tr>`;
        }
    });
    $('.js-table-res tbody').remove();
    $('.js-table-res').append(`<tbody>${html}</tbody>`);
});

$popupDelete.modal('setting', {
    onApprove: obj => {
        delOrEdit(STORE.fileForDel, 'del', refreshTable);
    }
})

$('.js-table-res').on('click', '.js-file-delete', function(e){
    let filename = $(this).closest('tr').data('file');
    let filenameParse = path.parse(filename);
    STORE.$tr = $(this).closest('tr');
    showConfirmPopup($popupDelete, `Вы уверены, что хотите удалить ${filenameParse.name}${filenameParse.ext}`, filename);
});

$('.js-table-res').on('click', '.js-file-edit', function(e){
    delOrEdit($(this), 'edit');
});

$('.js-table-res').on('click', '.js-btn-file', function(e){
    e.preventDefault();
    delOrEdit($(this), 'edit');
});

$('.js-back-main').on('click', ()=>{
    main.openWindow();
});
