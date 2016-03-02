/*background.js*/
var task
var background={
	init:function(){
		//监控消息
		chrome.runtime.onMessage.addListener(
			  function(request, sender, sendResponse) {
			  	console.log(request)
			    console.log(sender.tab ?
			                "from a content script:" + sender.tab.url :
			                "from the extension");
			    switch (request.action)
			    {
			    	case "ttsMessage":
			    		background.ttsMessage(request.content)
			    		console.log(request)
			    		sendResponse({success:'tts onMessage success'})
			    		break;		    		
			    	default:
			    		sendResponse({success: 1});
			    		break;
			    }	
  		});
  		//同步chrome storage 和local storage
  		chrome.storage.onChanged.addListener(function(){
  			chrome.storage.local.get(['sendmsg','wellcomemsg'],function(items){
  				console.log('chrome storage发生改变')
  				console.log(items)
  				sendmsg=items.sendmsg
  				wellcomemsg=items.wellcomemsg
  				chrome.windows.getAll(function(wnds){
  					for (var i = 0; i < wnds.length; i++) {
  						chrome.tabs.query({windowId:wnds[i].id},function(tabs){ 
			            	for(var i=0; i < tabs.length; i++){
			            		if(tabs[i].url.indexOf('douyu')>=0){
			            			chrome.tabs.sendRequest(tabs[i].id,{action:'sendmsg',content:sendmsg}, function(response) {
			  						console.log(response);
									});
									chrome.tabs.sendRequest(tabs[i].id,{action:'wellcomemsg',content:wellcomemsg}, function(response) {
			  						console.log(response);
									});
									break;
			            		} 
			            	}
			            });
  					};
		        })
  			});
  		});
	}
}

background.init()
//background.BackCheck()
//bbb()