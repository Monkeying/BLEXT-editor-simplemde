var SimpleMDE = require('simplemde');
var simplemde = new SimpleMDE({ 
	autofocus: true,
    autosave: {
        enabled: true,
        uniqueId: "1",
        delay: 1000,
    },
    element: $("#editor")[0],
    
    initialValue: '---\ntitle:\ncategory:\ntags: [,]\n\n---\nYour summary here.\n<!-- more -->',
    toolbar: [
    	{
			name: "custom",
	        action: function customFunction(editor){
	            // Add your own code
	        },
	        className: "fa fa-cogs js-open-bottom-slidebar",
	        title: "Custom Button",
    	},
		'|',
		{
			name: "custom",
			action: function setFormat(){
				var format = '---\ntitle:\ncategory:\ntags: [,]\n\n---\nYour summary here.\n<!-- more -->';
				simplemde.value(format);
			},
			className: "fa fa-file-o",
			title: "Reset Format"
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
    	{
    		name: "save",
            action: function customFunction(editor){
 				console.log("enterSaveDraft");
				//var url_publish = "http://10.201.14.174:5000/api/v1.0/blogs/";
				var url_publish = "https://blext.herokuapp.com/api/v1.0/blogs/";
				var request = {
					body: simplemde.value(),
					draft: true
				}
				request_json = JSON.stringify(request); 
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
						console.log("result:"+result);
						console.log("status:"+status);
					},
					error:function(result,status){
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
					}
					}).done(function (result,status){
						alert("publishing done");
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
				});
            },
            className: "fa fa-save",
            title: "Save as draft",
    	},
    	{
    		name: "custom",
            action: function customFunction(editor){
				console.log("enterPublishing");
				//var url_publish = "http://10.201.14.174:5000/api/v1.0/blogs/";
				var url_publish = "https://blext.herokuapp.com/api/v1.0/blogs/";
				var request = {
					body: simplemde.value(),
					draft: false
				}
				request_json = JSON.stringify(request); 
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
						console.log("result:"+result);
						console.log("status:"+status);
					},
					error:function(result,status){
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
					}
					}).done(function (result,status){
						alert("publishing done");
						console.log("result:"+JSON.stringify(result));
						console.log("status:"+status);
				});
            },
            className: "fa fa-paper-plane",
            title: "Publish",
    	}
    ]
});
simplemde.toggleFullScreen();
