// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, dialog, ipcMain} = require('electron')


const {appMenuTemplate} = require('./appmenu.js');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let saveExit = false;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    icon: './notepad.png'
    //backgroundColor: '#0f0'
    //opacity: 0.85
    //transparent: true
    //titleBarStyle: 'hiddenInset'
  })

  /*var childWin = new BrowserWindow({parent: mainWindow, modal: true, show: false});
  childWin.loadURL('https://m.baidu.com')
	childWin.once('ready-to-show', () => {
	  childWin.show()
	})*/


  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  //console.log(__dirname);
  //mainWindow.loadURL(__dirname + '/index.html');
  //mainWindow.loadURL('https://m.jd.com')
  //mainWindow.setTitle('你好，世界')
  //mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  const menu = Menu.buildFromTemplate(appMenuTemplate); 
  const menuItem0submenu = menu.items[0].submenu;
  menuItem0submenu.append(new MenuItem({
    label: 'New',
    click(menuItem, browserWin, keyCodeObj){
    	/*
    		menuItem = {
    								label(Sting), click(Function), accelerator(String), 
    								submenu(Array), type(String), role(String), 
    								icon(String), sublabel(String), enable(Boolean), 
    								visible(Boolean), checked(Boolean), commandId(Number)
    							}
    		browserWin = {_events(Object), _eventsCount(Number), devToolsWebContents(Getter)}
    		keyCodeObj = {shiftKey(Boolean), ctrlKey(Boolean)...}	
    	*/
      mainWindow.webContents.send('action', 'new');
    },
    accelerator: 'CmdOrCtrl+N'
  }));
  menuItem0submenu.append(new MenuItem({
  	label: "Open",
  	click(menuItem, browserWin, keyCodeObj){
  		mainWindow.webContents.send('action', 'open');
  	},
  	accelerator: 'CmdOrCtrl+O'
  }));
  menuItem0submenu.append(new MenuItem({
  	label: 'Save',
  	click(menuItem, browserWin, keyCodeObj){
  		mainWindow.webContents.send('action', 'save');
  	},
  	accelerator: 'CmdOrCtrl+S'
  }));
  menuItem0submenu.append(new MenuItem({
  	type: 'separator'
  }));
  menuItem0submenu.append(new MenuItem({
  	role: 'quit'
  }));
  Menu.setApplicationMenu(menu);

  mainWindow.on('close', e=>{
  	if(!saveExit){
  		e.preventDefault();
  		mainWindow.webContents.send('action', 'exiting')
  	}
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('reqaction', (e, arg)=>{
	switch(arg){
		case 'exit':
			saveExit = true;
			app.quit();
			break;
		default:
			break;
	}
})