const path = require('path');
const electron = require('electron');
const {app, BrowserWindow, dialog} = electron;
let win;

global.apps = {};

app.on('ready', ()=>{
    win = new BrowserWindow({
        width: 800,
        height: 600
    });
    load();
    win.webContents.openDevTools();
});

exports.openWindow = (filename, file) => {
    global.apps = file;
    load(filename);
}

function load(filename){
    let fileName;
    filename ? fileName = `app/${filename}` : fileName = 'main';
    win.loadURL(`file://${__dirname}/` + fileName + '.html');
}
