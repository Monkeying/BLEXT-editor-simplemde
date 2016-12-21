var userInfo;
var current_url = null;
var Blogs = null;
let token = null;

window.onload = function(){
//first hide information of userList
	document.getElementById('Blog_List').style.display = 'none';
	document.getElementById('Tag_List').style.display = 'none';
	document.getElementById('Draft_List').style.display = 'none';
	document.getElementById('Category_List').style.display = 'none';
	
//if token was sent by url, login direcrly	
	var URL = location.href;
	token = URL.split("?")[1];
	if ( !getUserInfoList() )
		token = null;
};
//HomePage onclick fucntion
function homePage(){//token was grobaly defined in index.html
	if (token == null)//unauthorized, userEmail and Password are needed
	{
		var LoginHtml = "<li style='text-align:center'>Email<input type='email' id='userEmail' placeholder='Enter Email'> </li>";
		LoginHtml += "<li style='text-align:center'>Password<input type='password' id='userPassword' placeholder='Enter Password'></li>";
		LoginHtml += "<li align='center'><button type='button' onclick='userValidate()'>Sign in</button></li>";//click this button will lead to function userValidate
		document.getElementById('Login').innerHTML = LoginHtml;
	}
	else
		return true;
}
//Validate Email and Password inputed with remote server via ajax get
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
			beforeSend:function(){
				document.getElementById("Login").innerHTML = "<li align='center'>waiting for validation</li><li align='center'><i class='icon fa-spinner fa-pulse' ></i><i class='icon fa-spinner fa-pulse' ></i><i class='icon fa-spinner fa-pulse' ></i></li>";
			},
			xhrFields:{
				withCredentials:true
			},
			headers:{
					'Authorization':'Basic ' +  btoa(userLoginInfo)
			},
			url:"https://blext.herokuapp.com/api/v1.0/token",
			dataType:"JSON",
			success:function(data){
				token = data.token;
				//store token grobaly
				//display BlogInfoList which were hidden when unauthorized
				document.getElementById('Blog_List').style.display = '';
				document.getElementById('Draft_List').style.display = '';
				document.getElementById('Tag_List').style.display = '';
				document.getElementById('Category_List').style.display = '';
				document.getElementById('HomePage').style.display = 'none';
				
			},
			error:function(){
				token = null;
				alert("UnAuthorized");
				//Validation failed return to Login Form
				HomePage();
				console.log("userValidate error");
			}
			}).done(function(data){
				console.log("done userValidate");

				//since authorization done, get userBlogInfo
				getUserInfoList();
			});
	}
}
function getUserInfoList(){
	if (token == null)
		return false;
	else
	{
		//get userInfo and url for BlogContent
		userInfo = getMessage("https://blext.herokuapp.com/api/v1.0/user/");
		if (userInfo == false)
			return false;
		var Avatar_url = userInfo.avatar_url;
		var Blog_count = userInfo.blog_count;
		var Url = userInfo.url;
		var username = userInfo.username;
		
		document.getElementById("Menu").innerHTML = "<li><b>"+ username + "'s blog</b><a href='index.html?' float:right>Logout</a></li>";
		document.getElementById("Login").style.display = "none";

		//get Blog Content
		getBlogs_Draft(userInfo.blogs);
		getTag(userInfo.tags);
		getCategory(userInfo.categories);
	}
}
//get json data via ajax with url given
function getMessage(urlWanted){
	console.log("entergetMessage");
	console.log(urlWanted);
	if (urlWanted == null || urlWanted == undefined || token == null)
	{
		console.log("url null");
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
		url:urlWanted,
		dataType:"JSON",
		success:function(data){
			Message = data;
		},
		error:function(msg){
			if (msg.status == 401)
			{
				Message = false;
				return false;
			}
			alert("ERROR: " + JSON.stringify(msg));
			return false;
		},
		}).done(function(data){
			console.log("getMessage done");
		});
	//if success return Message in json type, else Message is false
	return Message;
}
//get Blogs and Draft via ajax with url ~/blogs, each Blog and Draft is marked with title and url
function getBlogs_Draft(BlogsUrl){
	Blogs = getMessage( BlogsUrl );
	if (Blogs == null || Blogs == undefined || Blogs == false)
	{
		alert("No More");
		return false;
	}
	var BlogsList = "", DraftList = "";
	for (var i=0; Blogs.blogs[i] != null; i++)
	{
		if ( !Blogs.blogs[i].draft )
		{	
			console.log(Blogs.blogs[i].title);//the way to select blogs in Blogs is BlogsParsed.blogs[i].key, the later the former
			BlogsList += ("<li><a href='#' onclick='getABlog(Blogs.blogs[" + i + "].url)'>" + Blogs.blogs[i].title + "</a></li>" );
			//onclick to get a certain blog	via ajax			
		}
		else
			DraftList += ("<li><a href='#' onclick='getABlog(Blogs.blogs[" + i + "].url)'>" + Blogs.blogs[i].title + "</a></li>")
	}
	//apending prev/next page Info
	BlogsList += "<li><a href='#' onclick='getBlogs_Draft(Blogs.prev)' style='float:left' class='icon fa-arrow-left'></a><a href='#' onclick='getBlogs_Draft(Blogs.next)' style='float:right' class='icon fa-arrow-right'></a></li>";
	document.getElementById("BlogsList").innerHTML = BlogsList;//this will cover the form Login imformation innerHTML by function HomePage
	
	document.getElementById("DraftList").innerHTML = DraftList;
}
function getTag(TagUrl){
	var Tags = getMessage( TagUrl );
	var TagList = "";
	for (var i=0; Tags.tags[i] != null; i++)
		TagList += ("<li><a href='#'>" + Tags.tags[i].name + "</a></li>");
	
	document.getElementById("TagList").innerHTML = TagList;
}
function getCategory(CategoryUrl){
	var Categories = getMessage( CategoryUrl );
	var CategoryList = "";
	for (var i=0; Categories.categories[i] != null; i++)
		CategoryList += ("<li><a href='#'>" + Categories.categories[i].name + "</a></li>");
	
	document.getElementById("CategoryList").innerHTML = CategoryList;
}
//using function getMessage to get a single blog content via ajax, set simplemde.value and current_url to this blog
function getABlog(BlogUrl){
	var ABlog = getMessage(BlogUrl);
	simplemde.value(ABlog.body);
	current_url = ABlog.url;
}
//when opening a new window associating with this window, appending token info via url
function newWin(url){
	url += "?";
	if (token == null)
		 url += "null";
	else
		url += token;
	window.open(url);
}
//clean simplemde.value before window close
window.onbeforeunload = function(){
	if (simplemde.value() == '---\ntitle:\ncategory:\ntags: [,]\n\n---\nYour summary here.\n<!-- more -->' || simplemde.value() == "")
		return ;
	if ( ! window.confirm("Save this content until your next open?") )
		simplemde.value('---\ntitle:\ncategory:\ntags: [,]\n\n---\nYour summary here.\n<!-- more -->');
};