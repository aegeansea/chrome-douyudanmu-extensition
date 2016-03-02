/*
tool.js
*/

/*content_main.js*/
var content={
	init:function(){
		/*监听开启按钮*/
		//监听music事件
		chrome.extension.onRequest.addListener(
			  function(request, sender, sendResponse) {
			  	console.log(request)
			    console.log(sender.tab ?
			                "from a content script:" + sender.tab.url :
			                "from the extension");
			    switch (request.action)
			    {
			    	case "skip":
			    		console.log($('.bn-skip'))
			    		Zepto('.bn-skip').trigger('click')
			    		break;
			    	//sendResponse({farewell: "goodbye"});
			    	case "love":
			    		Zepto('.bn-love').trigger('click')
			    		console.log('love music')
			    		break;
			    	case "ban":
			    		Zepto('.bn-ban').trigger('click')
			    		console.log('ban music')
			    		break;
			    	case "pause":
			    		Zepto('.bn-pause').trigger('click')
			    		console.log('pause music')
			    		break;
			    	case "play":
			    		Zepto('.bn-play').trigger('click')
			    		console.log('play music')
			    		break;
			    	case "sendmsg":
			    		window.localStorage.setItem('sendmsg',request.content)
			    		console.log('sendmsg saved')
			    		break;
			    	case "wellcomemsg":
			    		window.localStorage.setItem('wellcomemsg',request.content)
			    		console.log('wellcomemsg saved')
			    		break;
			    	case "doubanfm":
			    		window.localStorage.setItem('doubanfm',request.content)
			    		console.log('doubanfm saved')
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
*/		var msgDoms=$('#chat_line_list').has('.chartli').children().not($('.operated'))
		var msglength=msgDoms.length
		var randomi=Math.floor(Math.random()*msglength)
		console.log(msglength)
		msgDoms.each(function(i){
/*			var data=$(this).find('span')
			data.each(function(i){
				if (i==1) {console.log($(this).text())};
			})*/
			nickId=$(this).find('span.name .nick').attr("rel");
			nickName=$(this).find('span.name .nick').text();
			chatId=$(this).find('span.text_cont,span.m').attr('chatid');
			chatMessage=$(this).find('span.text_cont,span.m').text();
			$(this).addClass('operated')
			window.localStorage.setItem('lastchatid',chatId)

			console.log(nickId,nickName,chatId,chatMessage);
			/*选项控制：语音 等。。。*/
			if (msglength>5) {
				console.log('>>>>>开启随机tts<<<<<')
				if (randomi==i) {
					ttsMessage.init()
					};
			}else{ttsMessage.init()};
			/*特殊命令控制*/
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
		mainbutton_html=jshtml+'<div class="douyubutton giftbatter-box" style="top: 450px;z-index:999999999"><button type="button" class="button-start extension-btn">开启监控弹幕</button><button type="button" class="button-send-msg extension-btn">666刷屏</button></div>';
		$("#chat_lines").after(mainbutton_html);
		$(".button-start").data('status',0);
		$(".button-send-msg").data('status',0);
		console.log($(".button-start").data('status'))
		//$(".chat_top_pic,.sign_posid").empty();
		//console.log($(".chat_top_pic,.sign_posid"))
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
		if (window.localStorage.getItem('')) {};
		$(".button-send-msg").on('click',function(){
			if ($(this).data('status')==0) {
				$(this).data('status',1);//1开启 0暂停中
				$(this).text('666中...')
				sendmsgtask=setInterval("content.sendDouyuMsgTask()",3000)
				console.log('开启666')
			}else{
				clearInterval(sendmsgtask);
				$(this).data('status',0);//1开启 0暂停中
				$(this).text('666刷屏')
				console.log('关闭')				
			}	
		})
		/*进入房间自动发送欢迎信息*/
		setTimeout("content.wellcomeMsg()",3000)
	},
	sendDouyuMsgTask:function(){
		var myDate=new Date()
		var timeMsg='【北京时间 '+myDate.getHours()+':'+myDate.getMinutes()+'】'
		sendmsg=window.localStorage.getItem('sendmsg')?window.localStorage.getItem('sendmsg'):'666666666666'
		if (sendmsg=='time') {sendmsg=timeMsg};
		var randommsg=['.','..','...',',',',,',',,,','...','.','..','`',' ']
		content.sendDouyuMsg(sendmsg+randommsg[(Math.floor(Math.random()*10))])
	},
	sendDouyuMsg:function(sendmsg){
		$("#chart_content").val(sendmsg);
		$("#sendmsg_but").click();
	},
	wellcomeMsg:function(){
		var myDate=new Date()
		var timeMsg=myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds()
		var msg1=window.localStorage.getItem('wellcomemsg')?window.localStorage.getItem('wellcomemsg'):"注意!「超管」进入房间 北京时间"
		var msg=msg1+timeMsg
		//var msg="戒撸提醒 北京时间"+timeMsg
		content.sendDouyuMsg(msg)
		
	}
}
var nickId,nickName,chatId,chatMessage
$(document).ready(function(){
	content.init()
	if (document.domain.indexOf('douyu')>=0) {content.addDouyuButton()};
	if (document.domain.indexOf('douban.fm')>=0) {doubanFm.init()};
	if (document.domain.indexOf('futunn')>=0) {
		futu.futucss()
		futu.scrollLi()
		if (GetQueryString("key")) {
		key=GetQueryString("key")
		futu.searchKey(key)
		};
	};

	
})
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return r[2]; return null;
}
var futu={
	init:function(){

	},
	futucss:function(){
		$('.header').css('display','none')
		$('.headerGap01').css('display','none')
		$('.main04Right').children('.cBox01').each(function(i){
			if (i!=1) {$(this).css('display','none')};
		})
		$('.myStockList01').css('height','500px')
	},
	searchKey:function(key){
		$.ajax({
			url:'https://www.futunn.com/trade/search?k='+key,
			dataType: "JSON",
			success:function(response){
				console.log(response)
				if (response.data.length==0) {

				}else{
					security_id=response.data[0].security_id
					futu.addWatch(security_id)
				}
			}
		})
	},
	addWatch:function(security_id){
		$.ajax({
			type:'POST',
			url:'https://www.futunn.com/trade/watch-add',
			data:{'_csrf':$("head meta[name='csrf-token']").attr('content'),'security_id':security_id},
			dataType:"JSON",
			success:function(response){
				console.log(response)
				window.close()
			}
		})
	},
	scrollLi:function(){
		$("div.myStockList01").myScroll({
		speed:40, 
		rowHeight:50
		});
	}
}
var doubanFm={
	init:function(){
		//监控关闭doubanfm 设置loacalsorage doubanfm=0
		console.log("init开始")

	},
	fmController:function(msg){
		if (window.localStorage.getItem('doubanfm')==1) {
			window.open(chrome.extension.getURL('/template/operation.html')+'?action='+msg.substr(1))
		}else{console.log('监控到是豆瓣命令，但是没有开启 请到选项页设置开启')}
	}
}
var ttsMessage={
	init:function(){
		if (window.localStorage.getItem('tts')==1) {
			msg=nickName+'说'+chatMessage
			chrome.runtime.sendMessage({action:'ttsMessage',content:msg},function(response){
				console.log(response)
			})			
		};		
	}
}
