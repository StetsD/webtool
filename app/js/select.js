var fs = require('fs');
const path = require('path');
var {remote} = require('electron');
var {dialog} = remote;
window.jQuery = window.$ = require('jquery');
window.semantic = require('semantic-ui/dist/semantic');
var main = remote.require('./index.js');
const GLOBAL = remote.getGlobal('apps');

$('.js-run').on('click', ()=>{
    const res = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});

    var html = '';

    res && res.forEach(pathF => {
        if(fs.existsSync(pathF)){
            let {size, ctime, atime, mtime, uid, gid} = fs.statSync(pathF, 'utf8');
            let {name, ext, dir} = path.parse(pathF);
            html += `<tr>
                        <td><a class="js-btn-file" href="${pathF}">${name}</a></td>
                        <td>${ext}</td>
                        <td>${dir}</td>
                        <td>${size}</td>
                        <td>${ctime}</td>
                        <td>${atime}</td>
                        <td>${mtime}</td>
                        <td>${uid}</td>
                        <td>${gid}</td>
                    </tr>`;
        }
    });
    $('.js-table-res tbody').remove();
    $('.js-table-res').append(`<tbody>${html}</tbody>`);
});

$('.js-table-res').on('click', '.js-btn-file', function(e){
    e.preventDefault();
    let link = $(this).attr('href');
    let temp = fs.readFileSync(link, 'utf8');

    main.openWindow('editor', {temp, link});
});

$('.js-back-main').on('click', ()=>{
    main.openWindow();
});
