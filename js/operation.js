/*popup.js*/
var Option ={
	init:function(){
		if (GetQueryString('action'))
		{
			Option.controlMusic(GetQueryString('action'))
		}

	},
	controlMusic:function(action){
		chrome.extension.getBackgroundPage().background.SendMusicMessage(action);
		window.close()
	}
}
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return r[2]; return null;
}
Option.init()