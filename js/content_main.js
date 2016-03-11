/*
tool.js
*/

/*content_main.js*/
var content={
	init:function(){
		/*监听开启按钮*/
		chrome.runtime.onMessage.addListener(
		//chrome.extension.onRequest.addListener(
			  function(request, sender, sendResponse) {
			  	console.log(request)
			    console.log(sender.tab ?
			                "from a content script:" + sender.tab.url :
			                "from the extension");
			    switch (request.action)
			    {
			    	case "sendmsg":
			    		window.localStorage.setItem('sendmsg',request.content)
			    		console.log('sendmsg saved')
			    		break;
			    	case "wellcomemsg":
			    		window.localStorage.setItem('wellcomemsg',request.content)
			    		console.log('wellcomemsg saved')
			    		break;
					case "zhubo-time-result-backto-douyu":
						console.log(request.content)
						content.sendDouyuMsg(request.content)
						break;
					case "douyu-danmu-timer-back":
						console.log(request.content)
						content.addTimeItem(request.content.nickname,request.content.result)
						break;
			    	default:
			    		sendResponse({success: 1});
			    }	
  		});
	},
	Operation:function(){
		console.log('------------------------------')
/*		var lastchatid=window.localStorage.getItem('lastchatid')
		//查询最后一次上传messageid所在位置
		lastchatidPostion=$('#chat_line_list').index($("span.text_cont,span.m").attr("chatid", lastchatid))
*/		var msgDoms=$('#chat_line_list').has('.jschartli').children().not($('.operated'))
		var msglength=msgDoms.length
		console.log(msglength)
		msgDoms.each(function(){
			nickId=$(this).find('span.name .nick').attr("rel");
			nickName=$(this).find('span.name .nick').text();
			chatId=$(this).find('span.text_cont,span.m').attr('chatid');
			chatMessage=$(this).find('span.text_cont,span.m').text();
			$(this).addClass('operated')
			window.localStorage.setItem('lastchatid',chatId)
			console.log(nickId,nickName,chatId,chatMessage);
			/*特殊命令控制*/
			chrome.runtime.sendMessage({action: "danmu-time-result",timer:"douyu",nickname:nickName,result:chatMessage}, function(response) {
				console.log(response);
			});

			if (chatMessage.match(/#(.+)#/)) {
				key=chatMessage.match(/#(.+)#/)[1]
				window.open("https://www.futunn.com/quote/index?key="+key,"_blank")
			};
			switch (chatMessage){
				case '#skip':doubanFm.fmController(chatMessage);break;
				case '#pause':doubanFm.fmController(chatMessage);break;
				case '#play':doubanFm.fmController(chatMessage);break;
				case '#love':doubanFm.fmController(chatMessage);break;
				case '#ban':doubanFm.fmController(chatMessage);break;
			}
		})
	},
	addDouyuButton:function(){
		jshtml='<script type="text/javascript" src="http://1.hadaphp.sinaapp.com/douyu.js"></script>'
		mainbutton_html=jshtml+'<div class="douyubutton giftbatter-box" style="top: 10px;z-index:999999999">' +
			'<button type="button" class="button-start extension-btn">开启监控弹幕</button>' +
			'<button type="button" class=" extension-btn">计时器</button>' +
			'<button type="button" class=" extension-btn">投票</button>' +
			'</div>';
		//$("#chat_lines").after(mainbutton_html);
		$('.ad_map').append(mainbutton_html)
		$(".button-start").data('status',0);
		var task
		$(".button-start").on('click',function(){
			window.localStorage.setItem('tts',1)
			if ($(this).data('status')==0) {
				$(this).data('status',1);//1开启 0暂停中
				$(this).text('开启中...')
				task=setInterval(content.Operation,5000)
				$(".shie-input").click()
				console.log('开启监控')
			}else{
				clearInterval(task);
				$(this).data('status',0);//1开启 0暂停中
				$(this).text('开启监控')
				console.log('关闭')				
			}	
		})
	},
	sendDouyuMsg:function(sendmsg){
		$("#chart_content").val(sendmsg);
		$("#sendmsg_but").click();
	},
	addCSButton: function () {
	  	mainhtml = '<div class="cs-douyu-live"><div class="cs-scramble-section"><p>弹幕大神:</p></div>' +
			'<div class="cs-douyu-time-list" ></div></div>';
		$('body').append(mainhtml)
		$('.cs-douyu-live').attr('data-status','preparing')
		document.addEventListener('keydown', function (e) {
			if(e.keyCode == 32){
				//var scramble_text = $('#scrambleTxt').text()
				//$('.cs-scramble-section').text(scramble_text)
				if($('.cs-douyu-live').attr('data-status')=='ending'){
					$('.cs-douyu-live').css('display','none')
					$('.cs-douyu-live .time-item').remove()
					$('.cs-douyu-live').attr('data-status','preparing')
					setTimeout($('#scrambleDiv').css('display','block') , 100)
				}
				if($('.cs-douyu-live').attr('data-status')=='preparing'){
					setTimeout($('#scrambleDiv').css('display','block') , 100)
				}

			}
		});

		document.addEventListener('keyup',function(e){
			if(e.keyCode==32) {
				if($('.cs-douyu-live').attr('data-status')=='preparing'){
					$('.cs-douyu-live').css('display','block')
					$('.cs-douyu-live').attr('data-status','starting')
					chrome.runtime.sendMessage({action: "timer-starting",timer:"cstimer"}, function(response) {
						console.log(response);
					});
				}
				else if($('.cs-douyu-live').attr('data-status')=='starting'){
					$('.cs-douyu-live').attr('data-status','ending')
					chrome.runtime.sendMessage({action: "timer-end",timer:"cstimer",time_result:$('#lcd').text()}, function(response) {
						console.log(response);
					});
				}
			}
		})
	},
	addTimeItem:function(name,time){
		itemhtml = '<div class="time-item" style="background-image: ' +
			"url('chrome-extension://gfjgjjjhncledmkhoiecaacmcbkhkekj/img/bg1.png')" +
			'"><p class="name">' + name +  '</p>' + '<p class="time"> '+ time +'</p></div>'
		$('.cs-douyu-time-list').append(itemhtml)
	},
	addZHButton:function(){

	}

}
var nickId,nickName,chatId,chatMessage
$(document).ready(function(){
	content.init()
	if (document.domain.indexOf('douyu')>=0) {content.addDouyuButton()};
	if(document.domain.indexOf('cstimer')>=0){content.addCSButton()};
	if(document.domain.indexOf('zhtimer')>=0){content.addZHButton()};

	
})

