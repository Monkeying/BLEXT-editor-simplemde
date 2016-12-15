var BlogsParsed;
var userInfo;
function userValidate()
{
	console.log("enter userValidate");
	{	
		if ( document.getElementById("userEmail").value == null)
		{
			alert("Please enter Email!")
			return true;
		}
		else if ( document.getElementById("userPassword").value == null)
		{
			alert("Please enter Email!")
			return true;	
		}

		var userLoginInfo = document.getElementById("userEmail").value + ":" + document.getElementById("userPassword").value;	
		$.ajax({
			//async:false,
			beforeSend:function(){
				document.getElementById("userForm").innerHTML = "waiting for validation";
			},
			xhrFields:{
				withCredentials:true
			},
			headers:{
					'Authorization':'Basic ' +  btoa(userLoginInfo)
					//'Authorization':'Basic ' +  btoa('380554381@qq.com:cat')
					//'Authorization':'Basic ' +  btoa('1960547638@qq.com:1')
			},
			//url:"http://10.201.14.174:5000/api/v1.0/token",
			url:"https://blext.herokuapp.com/api/v1.0/token",
			dataType:"JSON",/*translate message get from sever into object */
			success:function(data){
				token = data.token;
			},
			error:function(){
				token = null;
				HomePage();
				console.log("userValidate error");
			}
			}).done(function(data){
				console.log("done userValidate");
				getUserInfoList();
			});
	}
}
function getUserInfoList(){
	if (token == null)
		return false;
	else
	{
		userInfo = getMessage("https://blext.herokuapp.com/api/v1.0/user/");
		var Avatar_url = userInfo.avatar_url;
		var Blog_count = userInfo.blog_count;
		var Blogs = getMessage( userInfo.blogs );
		var Categories = getMessage( userInfo.categories );
		var Tags = getMessage( userInfo.tags );
		var Url = userInfo.url;
		var username = userInfo.name;
		
		BlogsParsed = JSON.parse(JSON.stringify(Blogs));
		var i = 0;
		var BlogsList = "<li><span class='opener' href='#'>BlogList</span><ul id='blogList'>";
		for (i = 0; i < Blog_count; i++)
		{
			console.log(BlogsParsed.blogs[i].title);//the way to select blogs in Blogs is BlogsParsed.blogs[i].key, the later the former
			BlogsList += ("<li><a href='#' onclick='simplemde.value( JSON.stringify( getMessage(BlogsParsed.blogs[" + i + "].url) ) )'>" + BlogsParsed.blogs[i].title + "</a></li>" );
		}
		BlogsList += "</ul></li>";
		document.getElementById("userForm").innerHTML = BlogsList;//this will cover the form Login imformation innerHTML by function HomePage
		
		var TagList = "<li><span class='opener' href='#'>TagList</span><ul id='tagList'><li>asdf</li></ul></li>";
		$(TagList).appendTo("#userForm");		
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
function HomePage(token){
	if (token == null)//未认证，即第一次登陆时
	{
		var LoginHtml = "<li>Email:<input type='email' id='userEmail' placeholder='Enter email'> </li>";
		LoginHtml += "<li>Password:<input type='password' id='userPassword' placeholder='Password'></li>";
		LoginHtml += "<li><button type='button' onclick='userValidate()'>Sign in</button></li>";
		document.getElementById('userForm').innerHTML = LoginHtml;
	}
	else
	{
		return true;
	}
}
function newWin(url){
	url += "?";
	if (token == null)
	{
		 url += "null";
	}
	else
	{
		url += token;
	}
	window.open(url);
}