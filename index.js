/*
var editor;
$("#plainText").markdown({
		autofocus: true,
		iconlibrary: 'fa',
		height: 'editor',
		'fullscreen': false,
		onShow: function(e){
			editor = e;
		},
		onPreview: function(e){
			alert(e.tagName);
		},
		/*
		additionalButtons:[
		[{
			name:"Save to Local",
			data:[{
				icon:"fa fa-bars",
				callback:function(e){
				/*
					var JSONStorage = require('node-localstorage').JSONStorage;
						var storageLocation = app.getPath('LocalBlogs');
						global.nodeStorage = new JSONStorage(storageLocation);
				}
			}]
		}]
		
	});

$('#jsi-nav').sidebar({
	trigger: '.jsc-sidebar-trigger',
	scrollbarDisplay: true,
	pullCb: function() {
		console.log('pull');
	},
	pushCb: function() {
		console.log('push');
	}
});
*/
function reset_size() {
	$('.md-editor').height($('.wrapper').height() - $('.top-nav').outerHeight());
	$('textarea').height($('.md-editor').height() - $('.md-header').outerHeight());  
};
reset_size();
window.onresize = reset_size;

var token = null;
var BlogsParsed;
function getMessage(urlWanted){
	alert("getMessage");
	console.log("entergetMessage");
	console.log(urlWanted);
	var Message;
	$.ajax({
		async:false,
		xhrFields:{
			withCredentials:true
		},
		headers:{
				'Authorization': 'Basic ' + btoa(token+':')
		},
		//url:"http://10.201.14.174:5000/api/v1.0/user/",
		url:urlWanted,//"https://blext.herokuapp.com/api/v1.0/blogs/",
		dataType:"JSON",/*translate message get from sever into object */
		success:function(data){
			console.log("success");
			Message = data;
			//alert(JSON.stringify(data));
		},
		error:function(){
			alert("ERROR: " + data);
		},
		}).done(function(data){
			console.log(JSON.stringify(Message));
		//$("#plainText").text(JSON.stringify(data));
		});
	return Message;
}		

function userValidate() 
{
	console.log("enter userValidate");
	if (token == null)
	{	
		//var userLoginInfo = document.getElementById("userEmail").value + ":" + document.getElementById("userPassword").value;
		
		$.ajax({
			//async:false,
			xhrFields:{
				withCredentials:true
			},
			headers:{
					//'Authorization':'Basic ' +  btoa(userLoginInfo)
					//'Authorization':'Basic ' +  btoa('380554381@qq.com:cat')
					'Authorization':'Basic ' +  btoa('1960547638@qq.com:1')
			},
			//url:"http://10.201.14.174:5000/api/v1.0/token",
			url:"https://blext.herokuapp.com/api/v1.0/token",
			dataType:"JSON",/*translate message get from sever into object */
			success:function(data){
				console.log("done");
				token = data.token;
				userInfo = getMessage("https://blext.herokuapp.com/api/v1.0/user/");
			},
			error:function(){
				token = null;
				console.log("userValidate error");
			}
			}).done(function(data){
				console.log("done userValidate");
				console.log(typeof userInfo.blogs);
				
				var Avatar_url = userInfo.avatar_url;
				var Blog_count = userInfo.blog_count;
				var Blogs = getMessage( userInfo.blogs );
				var Categories = getMessage( userInfo.categories );
				var Tags = getMessage( userInfo.tags );
				var Url = userInfo.url;
				var username = userInfo.name;
				
				BlogsParsed = JSON.parse(JSON.stringify(Blogs));
				var i = 0;
				var BlogsList = "";
				for (i = 0; i < Blog_count; i++)
				{
					console.log(BlogsParsed.blogs[i].title);//the way to select blogs in Blogs is BlogsParsed.blogs[i].key, the later the former
					BlogsList += ("<hr><a onclick=\"simplemde.value( JSON.stringify( getMessage(BlogsParsed.blogs[" + i + "].url) ) )\">" + BlogsParsed.blogs[i].title + "</a></hr>" );
				}
				document.getElementById("blogList").innerHTML = BlogsList;
				//$(BlogsList).appendTo("#blogList");
			});
	}
	else{
		return true;
	}
}
function getMessage(urlWanted){
	//alert("getMessage");
	console.log("entergetMessage");
	console.log(urlWanted);
	var Message;
	$.ajax({
		async:false,
		xhrFields:{
			withCredentials:true
		},
		headers:{
				'Authorization': 'Basic ' + btoa(token+':')
		},
		//url:"http://10.201.14.174:5000/api/v1.0/user/",
		url:urlWanted,//"https://blext.herokuapp.com/api/v1.0/blogs/",
		dataType:"JSON",/*translate message get from sever into object */
		success:function(data){
			console.log("success");
			Message = data;
			//alert(JSON.stringify(data));
		},
		error:function(){
			alert("ERROR: " + data);
		},
		}).done(function(data){
			console.log(JSON.stringify(Message));
		//$("#plainText").text(JSON.stringify(data));
		});
	return Message;
}
function publishing(){
	console.log("enterPublishing");
	var url_publish = "https://blext.herokuapp.com/api/v1.0/blogs/"
	var Info = simplemde();
	console.log(typeof Info);
	$.ajax({
		type:'POST',
		data:Info,
		url:url_publish,
		headers:{
				'Authorization': 'Basic ' + btoa(token+':')
		},
		success:function(result,status){
			console.log("result:"+result);
			console.log("status:"+status);
		}
		}).done(function (result,status){
			alert("publishing done");
			console.log("result:"+result);
			console.log("status:"+status);
	});
}