var SimpleMDE = require('simplemde');
var simplemde = new SimpleMDE({ 
	autofocus: true,
    autosave: {
        enabled: true,
        uniqueId: "1",
        delay: 1000,
    },
    element: $("#editor")[0],
    initialValue: 'BLOG FORMAT',
    toolbar: [
    	{
			name: "custom",
	        action: function customFunction(editor){
	            // Add your own code
	        },
	        className: "fa fa-cogs",
	        title: "Custom Button",
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
    		name: "custom",
            action: function customFunction(editor){
                // Save draft
            },
            className: "fa fa-star",
            title: "Custom Button",
    	},
    	{
    		name: "custom",
            action: function customFunction(editor){
                // Publish
            },
            className: "fa fa-star",
            title: "Custom Button",
    	}
    ]
});
simplemde.toggleFullScreen();