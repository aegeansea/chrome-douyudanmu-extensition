/*background.js*/
var task
var background={
	init:function(){
		//首次运行 set ttsOption
		chrome.storage.local.get('ttsoption',function(items){
			if(items.ttsoption){console.log('ttsoption setted')}
			else{background.ttsOptionRest()}
		})
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
  			chrome.storage.local.get(['sendmsg','wellcomemsg','doubanfm'],function(items){
  				console.log('chrome storage发生改变')
  				console.log(items)
  				sendmsg=items.sendmsg
  				wellcomemsg=items.wellcomemsg
  				doubanfm=items.doubanfm
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
									chrome.tabs.sendRequest(tabs[i].id,{action:'doubanfm',content:doubanfm}, function(response) {
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
		/*监控关闭窗口*/
		chrome.windows.onRemoved.addListener(function(windowId){
			console.log(windowId)
			chrome.storage.local.get('doubanfmWindow',function(item){
				if (item.doubanfmWindow.id==windowId) {
					chrome.storage.local.set({'doubanfm':0})
				};
			})			
		
		})
	},
	SendMusicMessage:function(action){
		chrome.storage.local.get('doubanfmWindow',function(item){ 
            chrome.tabs.getAllInWindow(item.doubanfmWindow.id, function(tabs){ 
            	for(var i=0; i < tabs.length; i++){
            		if(tabs[i].url.indexOf('douban.fm')>=0){
            			chrome.tabs.sendRequest(tabs[i].id,{action: action}, function(response) {
  						console.log(response);
  						//alert('llll');
						});
            		} 
            	}
            });
        });
	},
	ttsMessage:function(msg){
		chrome.storage.local.get('ttsoption',function(items){
			ttsoption=items.ttsoption;
			chrome.tts.speak(msg,ttsoption);
		})
      	if (chrome.extension.lastError) {
      		console.log('TTS Error: ' + chrome.extension.lastError.message);
    	}
	},
	ttsOptionRest:function(){
		if(window.navigator.userAgent.indexOf("Macintosh")>0){
			ttsoption={"lang":"zh-CN","voiceName":"Ting-Ting","gender":"female","rate":1,"pitch":1,"volume":1,'enqueue': true}
		}else if(window.navigator.userAgent.indexOf("Windows")>0){
			ttsoption={"lang":"zh-CN","voiceName":"native","rate":1,"pitch":1,"volume":1,'enqueue': true}
		}else{
			ttsoption={"lang":"zh-CN","rate":1,"pitch":1,"volume":1,'enqueue': true}
		}
		chrome.storage.local.set({'ttsoption':ttsoption})
	}
}

background.init()
//background.BackCheck()
//bbb()