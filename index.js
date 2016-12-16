var userInfo;
var current_url = null;
var Blogs = null;
function HomePage(token){//token was grobaly defined in index.html
	if (token == null)//未认证，即第一次登陆时
	{
		alert("Please Login First.");
		var LoginHtml = "<li style='text-align:center'>Email:<input type='email' id='userEmail' placeholder='Enter email'> </li>";
		LoginHtml += "<li style='text-align:center'>Password:<input type='password' id='userPassword' placeholder='Password'></li>";
		LoginHtml += "<li align='center'><button type='button' onclick='userValidate()'>Sign in</button></li>";//click this button will lead to function userValidate
		document.getElementById('Login').innerHTML = LoginHtml;
	}
	else
	{
		return true;
	}
}
function userValidate()//To get a token
{
	console.log("enter userValidate");
	{	
		if ( document.getElementById("userEmail").value == "")
		{
			alert("Please enter Email!");
			return true;
		}
		else if ( document.getElementById("userPassword").value == "")
		{
			alert("Please enter Password!");
			return true;	
		}

		var userLoginInfo = document.getElementById("userEmail").value + ":" + document.getElementById("userPassword").value;	
		$.ajax({
			//async:false,
			beforeSend:function(){
				document.getElementById("Login").innerHTML = "<li>waiting for validation</li><li align='center' class='fa fa-spinner fa-pulse' ></li>";
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
				//document.getElementById('Login').style.display = 'none';
				document.getElementById('Blog_List').style.display = '';
				document.getElementById('Draft_List').style.display = '';
				document.getElementById('Tag_List').style.display = '';
				document.getElementById('Category_List').style.display = '';
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
		var Url = userInfo.url;
		var username = userInfo.username;
		
		document.getElementById("Login").innerHTML = "<li>User: " + username + "</li><li>Blog_count: " + Blog_count + "</li><li><a href='index.html' >Logout</a></li>";
		
		getBlogs_Draft(userInfo.blogs);
		getTag(userInfo.tags);
		getCategory(userInfo.categories);
		//$(CategoryList).appendTo("#userForm");
	}
}

function getMessage(urlWanted){
	console.log("entergetMessage");
	console.log(urlWanted);
	if (urlWanted == null || urlWanted == undefined)
	{
		alert("url null");
		return false;
	}
		
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
			Message = data;
		},
		error:function(msg){
			alert("ERROR: " + JSON.stringify(msg));
		},
		}).done(function(data){
			console.log(JSON.stringify(Message));
		//$("#plainText").text(JSON.stringify(data));
		});
	return Message;
}
function getBlogs_Draft(BlogsUrl){
	Blogs = getMessage( BlogsUrl );
	if (Blogs == null || Blogs == undefined || Blogs == false)
	{
		alert("No More");
		return false;
	}
	var BlogsList = "";
	var DraftList = "";
	var i = 0;
	for (i=0; Blogs.blogs[i] != null; i++)
	{
		if ( ! Blogs.blogs[i].draft )
		{
			console.log(Blogs.blogs[i].title);//the way to select blogs in Blogs is BlogsParsed.blogs[i].key, the later the former
			BlogsList += ("<li><a href='#' onclick='getABlog(Blogs.blogs[i].url)'>" + Blogs.blogs[i].title + "</a></li>" );
			//onclick here to get a certain blog				
		}
		else
		{
			DraftList += ("<li><a href='#' onclick='getABlog(Blogs.blogs[ i ].url)'>" + Blogs.blogs[i].title + "</a></li>");
		}		
	}
	BlogsList += "<li><a href='#' onclick='getBlogs_Draft(Blogs.prev)'><i class='fa fa-angle-double-left'></i></a> <a href='#' onclick='getBlogs_Draft(Blogs.next)'><i class='fa fa-angle-double-right'></i></a></li>";
	document.getElementById("BlogsList").innerHTML = BlogsList;//this will cover the form Login imformation innerHTML by function HomePage
	
	document.getElementById("DraftList").innerHTML = DraftList;
}
function getTag(TagUrl){
	var Tags = getMessage( TagUrl );
	var TagList = "";
	for (i=0; Tags.tags[i] != null; i++)
	{
		TagList += ("<li><a href='#' onclick='getABlog(BlogsParsed.blogs[" + i + "].url)'>" + Tags.tags[i].name + "</a></li>");
	}
	document.getElementById("TagList").innerHTML = TagList;
}
function getCategory(CategoryUrl){
	var Categories = getMessage( CategoryUrl );
	var CategoryList = "";
	for (i=0; Categories.categories[i] != null; i++)
	{
		CategoryList += ("<li><a href='#' onclick='getABlog(BlogsParsed.blogs[" + i + "].url)'>" + Categories.categories[i].name + "</a></li>");
	}
	document.getElementById("CategoryList").innerHTML = CategoryList;
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
function getABlog(BlogUrl){
	var ABlog = getMessage(BlogUrl);
	simplemde.value(ABlog.body);
	current_url = ABlog.url;
}