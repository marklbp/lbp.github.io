// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Electron = require('electron');

const ipcRenderer = Electron.ipcRenderer;

const remote = Electron.remote;

const {Menu, dialog} = remote;

let config = {
  title: 'Notepad - Untitled',
  isSaved: true,
  currentFile: null,
  editor: document.getElementById('editor')
}

document.title = config.title;

const contextMenuTemplate = [
 	{role: 'undo'},
 	{role: 'redo'},
 	{type: 'separator'},
 	{role: 'cut'},
 	{role: 'copy'},
 	{role: 'paste'},
 	{role: 'delete'},
 	{type: 'separator'},
 	{role: 'selectall'}
];

const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

config.editor.addEventListener('contextmenu', function(e){
	e.preventDefault();
	contextMenu.popup(remote.getCurrentWindow());
});

config.editor.oninput = function(e){
	if(config.isSaved && !/\s\*$/.test(document.title)) document.title += " *";
	config.isSaved = false; 
}

ipcRenderer.on('action', (e, arg)=>{
	let responseSave;
	switch(arg){
		case 'new':
			responseSave = askSaveIfNeed();
			if(responseSave == 2)return;
      config.currentFile = null;
      config.editor.value = '';   
      document.title = config.title;
      //remote.getCurrentWindow().setTitle("Notepad - Untitled *");
      config.isSaved = true;
			break;
		case 'open':
			responseSave = askSaveIfNeed();
			if(responseSave == 2)return;
			const files = dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
          { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
          { name: 'All Files', extensions: ['*'] } 
        ],
        properties: ['openFile']
      });
      if(files){
        config.currentFile = files[0];
        const txtRead = readText(config.currentFile);
        config.editor.value = txtRead;
        document.title = "Notepad - " + config.currentFile;
        config.isSaved = true;
      }
			break;
		case 'save':
			saveCurrentDoc();
			break;
		case 'exiting':
			responseSave = askSaveIfNeed();
			if(responseSave == 2)return;
      ipcRenderer.sendSync('reqaction', 'exit');
			break;
		default:
			console.log(arg) 
			break;
	}
});

function askSaveIfNeed(){
	if(config.isSaved)return;
	const response = dialog.showMessageBox(remote.getCurrentWindow(), {
    message: 'Do you want to save the current document?',
    type: 'question',
    buttons: [ 'Yes', 'No', 'cancel']
  });
  if(response == 0) saveCurrentDoc(); //点击Yes按钮后保存当前文档
  return response; 
}

function saveCurrentDoc(){
	if(!config.currentFile){
    const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
      filters: [
        { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
        { name: 'All Files', extensions: ['*'] } 
      ]
    });
    if(file) config.currentFile = file;
  }
  if(config.currentFile){
    const txtSave = config.editor.value;
    saveText(txtSave, config.currentFile);
    config.isSaved = true;
    document.title = "Notepad - " + config.currentFile;
  }
}

function saveText(text, file){
	const fs = require('fs');
  fs.writeFileSync(file, text);
}

function readText(file){
  const fs = require('fs');
  return fs.readFileSync(file, 'utf8');
}