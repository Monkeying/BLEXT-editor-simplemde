var SimpleMDE = require('simplemde');

const electron = require('electron');
const {dialog} = electron.remote

var simplemde = new SimpleMDE({ 
	autofocus: true,
    autosave: {
        enabled: true,
        uniqueId: "1",
        delay: 1000,
    },
    element: $("#editor")[0],
    
    initialValue: '---\ntitle:\ncategory:\ntags: [,]\n\n---\nYour summary here.\n<!-- more -->',
	toolbarTips: true,
	spellChecker: false,
    toolbar: [
	//sidebarTrigger
    	{
			name: "custom",
	        action: function customFunction(editor){
	            // Add your own code
	        },
	        className: "fa fa-cogs js-open-bottom-slidebar",
	        title: "Custom Button",
    	},
		'|',
	//Reset Format
		{
			name: "custom",
			action: function setFormat(){
				var format = '---\ntitle:\ncategory:\ntags: [,]\n\n---\nYour summary here.\n<!-- more -->';
				simplemde.value(format);
				current_url = null;
			},
			className: "fa fa-file-o",
			title: "Reset Format"
		},
	//undo
		{
			name: "undo",
			action: function undo(editor) {
				var cm = editor.codemirror;
				cm.undo();
				cm.focus();
			},
			className: "fa fa-reply",
			title: "Undo Ctrl-Z",
		},
	//redo
		{
			name: "redo",
			action: function redo(editor) {
				var cm = editor.codemirror;
				cm.redo();
				cm.focus();
			},
			className: "fa fa-share",
			title: "Redo Ctrl-Y",
		},
    	'|',
    	'bold',
    	'italic',
    	'strikethrough',
    	'heading',
    	'|',
    	'code',
    	'quote',
    	'|',
    	'unordered-list',
    	'ordered-list',
    	'|',
    	'link',
    	'image',
    	'table',
    	'|',
    	'preview',
    	'side-by-side',
    	'|',
	//Open File using dialog
    	{
    		name: "OpenFile",
            action: function ReadFromLocal(editor){//本地文件读入
				var fs = require('fs');
				var _path = dialog.showOpenDialog({ properties: [ 'openFile' ]});
				if (_path == undefined)
					return false;
				fs.readFile(_path[0], 'utf8', function (err, data) {
					if (err) return console.log(err);
					simplemde.value(data);
				});
            },
            className: "fa fa-folder-open-o",
            title: "Open File",
    	},
	//SaveToLocal using dialog
    	{
    		name: "SaveToLocal",
            action: function (editor){//写入本地文件
				var fs = require('fs');
				var _path = dialog.showSaveDialog({filters: [{ name: '文本文档', extensions: ['txt', 'pdf'] },{ name: 'All Files', extensions: ['*'] }]});
				//dialog.showOpenDialog({ properties: [ 'openDirectory']}); only txt pdf are showing
				if (_path == undefined)
					return false;
				console.log(_path);
				fs.readFile(_path, 'utf8', function (err, data) {
					if (err) return console.log(err);
				});

				fs.writeFile(_path, simplemde.value(), function (err) {
				if (!err)
				  console.log("写入成功！");
				});
			},
            className: "fa fa-folder",
            title: "Save on local Ctrl-S",
    	},	
		'|',
	//SaveAsDraft using ajax Post json
    	{
    		name: "SaveAsDraft",
            action: function SaveAsDraft(editor){
 				console.log("enterSaveDraft");
				//var url_publish = "http://10.201.14.171:5000/api/v1.0/blogs/";
				if (token == null)
				{
					alert("Have not Login");
					return false;
				};
				var url_publish = "https://blext.herokuapp.com/api/v1.0/blogs/";
				var request = {
					body: simplemde.value(),
					draft: true
				};
				var request_json = JSON.stringify(request); 
				$.ajax({
					type:'POST',
					data: request_json,
					url:url_publish,
					dataType:'json',
					contentType: "application/json; charset=utf-8",
					headers:{
							'Authorization': 'Basic ' + btoa(token+':')
					},
					success:function(result,status){
						console.log(request);
					},
					error:function(result,status){
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
						if (result.status == 401)
							alert("Have not Login");
					}
					}).done(function (result,status){
						alert("Sucessfully SaveAsDraft");
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
						getUserInfoList();
				});
            },
            className: "fa fa-save",
            title: "Save as draft",
    	},
	//Publish using ajax post/get(publish new/modify exist) json
    	{
    		name: "Publish",
            action: function Publish(editor){
				console.log("enterPublishing");
				//var url_publish = "http://10.201.14.174:5000/api/v1.0/blogs/";
//choose proper publish url
				var url_publish;
				if (token == null)
				{
					alert("Have not Login");
					return false;
				};					
				if (current_url != null)
				{
					if (window.confirm("Publish as a modified Blog?This will cover the former blog."))
						url_publish = current_url;					
				}
				else
					url_publish = "https://blext.herokuapp.com/api/v1.0/blogs/";
//validate title inputed				
				var title = simplemde.value().split("title:")[1];
				title = title.split("\n")[0];
				var regu = "^[ ]+$";
				var re = new RegExp(regu);//judge whether title is space 
				if ( re.test(title) || title == "")
				{
					alert("Title should not be null.");
					return ;
				}				
				
				var request = {
					body: simplemde.value(),
					draft: false
				};
				var request_json = JSON.stringify(request); 
				$.ajax({
					type:current_url == null?'POST':'PUT',
					data: request_json,
					url:url_publish,
					dataType:'json',
					contentType: "application/json; charset=utf-8",
					headers:{
							'Authorization': 'Basic ' + btoa(token+':')
					},
					success:function(result,status){
						console.log("result:"+result);
						console.log("status:"+status);
					},
					error:function(result,status){
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
						if (result.status == 401)
							alert("Have not Login");
					},
					}).done(function (result,status){
						alert("Sucessfully Publishing");
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
						getUserInfoList();
				});
            },
            className: "fa fa-paper-plane",
            title: "Publish Ctrl-Shift-P",
    	},
    ],
});
//simplemde initializing

//turn it in to fullScreen at the beginning
simplemde.toggleFullScreen();

const remote = electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Alt+Command+I';
          else
            return 'Ctrl+Shift+I';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'FullScreen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return '';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More about Local',
        click: function() { require('electron').shell.openExternal('https://github.com/Monkeying/BLEXT-editor-simplemde') }
      },
      {
        label: 'Learn More about Remote',
        click: function() { require('electron').shell.openExternal('https://github.com/seagullbird/BLEXT') }
      },
    ]
  },
];

if (process.platform == 'darwin') {//MAC
  var name = require('electron').remote.app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        role: 'close',
      },
    ]
  });
  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  );
}
var menu = Menu.buildFromTemplate(template);
//右键菜单
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);
//顶端菜单
//Menu.setApplicationMenu(menu);