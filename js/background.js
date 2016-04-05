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
			    	case "timer-starting":
			    		console.log(request)
			    		sendResponse({state:'timer-starting',timer:request.timer})
			    		break;
					case "timer-end":
						console.log(request)
						background.message_to_douyu_page('zhubo-time-result-backto-douyu',request.time_result)
						sendResponse({state:'timer-end',timer:request.timer,result:request.time_result})
						break;
					case "danmu-time-result":
						console.log(request)
						var content = {nickname:request.nickname,result:request.result}
						sendResponse({state:'douyu-danmu-timer-back',timer:'douyu',nickname:request.nickname,result:request.result})
						background.message_to_cstimer_page('douyu-danmu-timer-back',content)
						background.message_to_zhtimer_page('douyu-danmu-timer-back',content)
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

	},
	//发送message到 斗鱼页面的 content_scripts
	message_to_douyu_page:function(action,content){
		console.log('send message to douyu page')
		console.log(action,content)
		chrome.windows.getAll(function(wnds){
			for (var i = 0; i < wnds.length; i++) {
				chrome.tabs.query({windowId:wnds[i].id},function(tabs){
					for(var i=0; i < tabs.length; i++){
						if(tabs[i].url.indexOf('douyu')>=0){
							chrome.tabs.sendMessage(tabs[i].id,{action:action,content:content}, function(response) {
								console.log(tabs[i].id)
								console.log(response);
							});
							break;
						}
					}
				});
			};
		})
	},


	//发送message到 cstimer的 content_scripts
	message_to_cstimer_page: function (action,content) {
		console.log('send message backto cstimer page')
		console.log(action,content)
		chrome.windows.getAll(function(wnds){
			for (var i = 0; i < wnds.length; i++) {
				chrome.tabs.query({windowId:wnds[i].id},function(tabs){
					for(var i=0; i < tabs.length; i++){
						if(tabs[i].url.indexOf('cstimer')>=0){
							chrome.tabs.sendMessage(tabs[i].id,{action:action,content:content}, function(response) {
								console.log(tabs[i].id)
								console.log(response);
							});
							break;
						}
					}
				});
			};
		})
	},
	message_to_zhtimer_page: function (action,content) {
		console.log('send message backto zhtimer page')
		console.log(action,content)
		chrome.windows.getAll(function(wnds){
			for (var i = 0; i < wnds.length; i++) {
				chrome.tabs.query({windowId:wnds[i].id},function(tabs){
					for(var i=0; i < tabs.length; i++){
						if(tabs[i].url.indexOf('zhtimer')>=0){
							chrome.tabs.sendMessage(tabs[i].id,{action:action,content:content}, function(response) {
								console.log(tabs[i].id)
								console.log(response);
							});
							break;
						}
					}
				});
			};
		})
	}


}

background.init()
//background.BackCheck()
//bbb()