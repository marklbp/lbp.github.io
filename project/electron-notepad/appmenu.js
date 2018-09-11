var Electron = require('electron');
const app = Electron.app;

module.exports = {
	appMenuTemplate: [
	    {
	        label: '文件(F)',
	        submenu: []
	    },
	    {
	        label: '编辑(E)',
	        submenu: [
	            {
	                role: 'undo'
	            },
	            {
	                role: 'redo'
	            },
	            {
	                type: 'separator'
	            },
	            {
	                role: 'cut'
	            },
	            {
	                role: 'copy'
	            },
	            {
	                role: 'paste'
	            },
	            {
	                role: 'pasteandmatchstyle'
	            },
	            {
	                role: 'delete'
	            },
	            {
	                role: 'selectall'
	            }
	        ]
	    },
	    {
	        label: '查看(V)',
	        submenu: [
	            {
	                role: 'reload'
	            },
	            {
	                role: 'forcereload'
	            },
	            {
	                role: 'toggledevtools'
	            },
	            {
	                type: 'separator'
	            },
	            {
	                role: 'resetzoom'
	            },
	            {
	                role: 'zoomin'
	            },
	            {
	                role: 'zoomout'
	            },
	            {
	                type: 'separator'
	            },
	            {
	                role: 'togglefullscreen'
	            }
	        ]
	    },
	    {
	        label: '帮助(H)',
	        submenu: [
	            {
	                label: '主页',
	                click() { Electron.shell.openExternal('http://www.marklbp.com'); }
	            }
	        ]
	    }
	]
};