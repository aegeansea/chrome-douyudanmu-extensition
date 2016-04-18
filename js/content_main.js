/*
tool.js
*/

/*content_main.js*/
//remove element in an array
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};


var RandomEffect={
	color:function(){
		return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).substr(-6);
	},
	fontsize: function () {
		var size = (Math.floor(Math.random()*12)+1)*3+25;
		return size.toString() + 'px'
	},
	position_t: function(){
		var num = Math.floor(Math.random()*40);
		var pos = (40 + num*(1-(num%2)*2)).toString() + '%';
		return pos
	}
}
var draw_name_list = []

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

			    	case "vote_list_update":
						var jsoncontent = JSON.stringify(request.content)      //存储前先用JSON.stringify()方法将json对象转换成字符串形式
			    		window.localStorage.setItem('vote_list',jsoncontent)
			    		console.log('vote_list saved')
			    		break;
					case "zhubo-time-result-backto-douyu":
						console.log(request.content)
						content.sendDouyuMsg(request.content)
						break;
					case "douyu-danmu-timer-back":
						console.log(request.content);
						content.addTimeItem(request.content.nickname,request.content.result)
						break;
			    	default:
			    		sendResponse({success: 1});
			    }	
  		});
	},
	Operation:function(){
		console.log('------------------------------')

		var msgDoms_old
		if($('#chat_line_list').length){
			msgDoms_old=$('#chat_line_list').has('.jschartli').children().children().not('.operated')
		}
		else{
			msgDoms_old=$('.c-list').has('.jschartli').children().children().not('.operated')
		}
		var msgDoms = msgDoms_old.children('.name').parent()
		var msglength=msgDoms.length
		console.log(msglength)
		msgDoms.each(function(){
			nickId=$(this).find('span.name .nick').attr("rel");
			nickName=$(this).find('span.name .nick').text();
			chatId=$(this).find('span.text-cont,span.m').attr('chatid');    //斗鱼4.1日由 text_cont 改为了 text-cont
			chatMessage=$(this).find('span.text-cont,span.m').text();
			$(this).addClass('operated')
			window.localStorage.setItem('lastchatid',chatId)
			console.log(nickId,nickName,chatId,chatMessage);
			/*特殊命令控制*/
			if(isNaN(chatMessage)){

			}
			else{
				chrome.runtime.sendMessage({action: "danmu-time-result",timer:"douyu",nickname:nickName,result:chatMessage}, function(response) {
					console.log(response);
				});
			}


			//if (chatMessage.match(/#(.+)#/)) {
			//	key=chatMessage.match(/#(.+)#/)[1]
			//	window.open("https://www.futunn.com/quote/index?key="+key,"_blank")
			//};
			switch (chatMessage){
				case '#skip':doubanFm.fmController(chatMessage);break;
				case '#pause':doubanFm.fmController(chatMessage);break;
				case '#play':doubanFm.fmController(chatMessage);break;
				case '#love':doubanFm.fmController(chatMessage);break;
				case '#ban':doubanFm.fmController(chatMessage);break;
			}
		})
	},
	luckyDraw: function () {
		var msgDoms_old
		if($('#chat_line_list').length){
			msgDoms_old=$('#chat_line_list').has('.jschartli').children().children().not('.operated')
		}
		else{
			msgDoms_old=$('.c-list').has('.jschartli').children().children().not('.operated')
		}
		var msgDoms = msgDoms_old.children('.name').parent()
		var msglength=msgDoms.length
		console.log(msglength)
		msgDoms.each(function(){
			nickId=$(this).find('span.name .nick').attr("rel");
			nickName_old=$(this).find('span.name .nick').text();
			nickName = nickName_old.substring(0,nickName_old.length-1);
			$(this).addClass('operated')
			window.localStorage.setItem('lastchatid',chatId)
			if($.inArray(nickName,draw_name_list)==-1){
				draw_name_list.push(nickName);
				var draw_user_color = RandomEffect.color()
				var draw_user_size = RandomEffect.fontsize()
				var draw_user_left = RandomEffect.position_t()
				var draw_user_top = RandomEffect.position_t()
				var draw_user_html = '<p '+ 'style="position:absolute;'+ 'font-size:'+ draw_user_size + ';color:'+draw_user_color + ';left:'+draw_user_left + ';top:' + draw_user_top + '">'+ nickName +'</p>';
				console.log(draw_user_html)
				$('.lucky-draw-panel').append(draw_user_html)
				console.log(nickName + '添加完毕');

			}
			else{
				console.log(nickName + '已存在');
			}

			/*特殊命令控制*/
		})
	},
	addDouyuButton:function(){
		jshtml='<script type="text/javascript" src="http://1.hadaphp.sinaapp.com/douyu.js"></script>'
		mainbutton_html=jshtml+'<div class="douyubutton" style="top: 0px;float:left; margin-left: 20px; position: relative; z-index:999999999">' +
			'<button type="button" class="button-start extension-btn">监控弹幕</button>' +
			'<button type="button" class="special-btn extension-btn">100连拧</button>' +
			'<button type="button" class="vote-open extension-btn">投票</button>' +
			'<button type="button" class="lucky-draw extension-btn">抽奖</button>' +
			'<button type="button" class="cubing-link extension-btn">粗饼网</button>' +
			'</div>';

		draw_html = '<div class="lucky-draw-panel">' +
			'<button class="extension-btn" style="position: absolute;left: 95%;margin:20px;z-index: 999" id="draw-close">X</button>' +
			'<button class="button-draw-listen extension-btn" style="z-index: 999;position:absolute;margin:20px;">开始接受弹幕</button>' +
			'<div style="text-align: center"><button class="draw-button extension-btn">抽奖</button></div>' +
			'</div>'+ '<div class="lucky-draw-result"><h5 style="font-size: 30px">获奖名单：</h5></div>'


		vote_html = '<div class="vote-panel">' +
			'<button class="extension-btn" style="position: absolute;left: 95%;margin:20px;z-index: 999" id="vote-close">X</button>' +
			'<button class="button-vote-listen extension-btn" style="z-index: 999;position:absolute;margin:20px;">开始接受弹幕</button>' +
			'</div>'


		sloving_html = '<div class="sloving-panel"><button class="extension-btn" style="position: absolute;left: 95%;margin:20px;z-index: 999" id="sloving-close">X</button>' +
			'<div style="font-size: 50px;"><span style="color: green">复原:</span><span id="htimer-sloved">0</span><span style="color: darkred">\t剩余:</span><span id="htimer-unsloved">100</span></div>'+
			'<div id="htimer" class="timer_section"><div id="msms" class="msms"><span id="h2">0</span>小时<span id="m1">0</span><span id="m2">0</span>分钟<span id="s1">0</span>' +
			'<span id="s2">0</span>秒</div> </div></div>'



		cubing_html = '<div class="cubing-panel"><button class="extension-btn" style="position: absolute;left: 95%;margin:20px;z-index: 999" id="cubing-close">X</button>' +
			'<iframe src="http://cubingchina.com/" style="width: 100%;height: 100%"></iframe></div>'

		$('body').append(draw_html)
		$('body').append(vote_html)
		$('body').append(cubing_html)
		$('body').append(sloving_html)
		//$("#chat_lines").after(mainbutton_html);
		//$('.ad_map').append(mainbutton_html)
		$('#box_div').after(mainbutton_html)
		$('.get-yw').after(mainbutton_html)
		$(".button-start").data('status',0);
		$(".button-draw-listen").data('status',0);
		$(".button-vote-listen").data('status',0);
		$(".sloving-panel").data('status',0);

		var draw_task

		$(".button-draw-listen").on('click',function(){
			if ($(this).data('status')==0) {
				$(this).data('status',1);//1开启 0暂停中
				$(this).text('停止接受弹幕...')
				$('.lucky-draw-panel .random-name-display').remove()
				draw_task=setInterval(content.luckyDraw,500)
				$(".shie-input").click()
				console.log('开启获取id')
			}else{
				clearInterval(draw_task);
				$(this).data('status',0);//1开启 0暂停中
				$(this).text('开始接受弹幕')
			}
		})


		var task
		// douyu page 开始监控按钮
		$(".button-start").on('click',function(){
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
		// douyu page 抽奖按钮
		$(".lucky-draw").on('click',function(){
			$(".lucky-draw-panel").css('display','block')
			$(".lucky-draw-result").css('display','block')
			var msgDoms_old
			if($('#chat_line_list').length){
				msgDoms_old=$('#chat_line_list').has('.jschartli').children().children().not('.operated')
			}
			else{
				msgDoms_old=$('.c-list').has('.jschartli').children().children().not('.operated')
			}
			msgDoms_old.children('.name').parent().addClass('operated')
		})
		// douyu page 投票按钮
		$(".vote-open").on('click',function(){
			$(".vote-panel").css('display','block')
			var msgDoms_old
			if($('#chat_line_list').length){
				msgDoms_old=$('#chat_line_list').has('.jschartli').children().children().not('.operated')
			}
			else{
				msgDoms_old=$('.c-list').has('.jschartli').children().children().not('.operated')
			}
			msgDoms_old.children('.name').parent().addClass('operated')
		})

		// cubing page button
		$(".cubing-link").on('click', function () {
			$(".cubing-panel").css('display','block')
		})
		//te shu page button
		$(".special-btn").on('click', function () {
			$(".sloving-panel").css('display','block')
			$(".sloving-panel").data('status',1);

		})

		$("#sloving-close").on('click', function () {
			$(this).parent().css('display','none')
			$(".sloving-panel").data('status',0);
			$("#htimer-sloved").text(0)
			$("#htimer-unsloved").text(100)
		})
		$("#cubing-close").on('click',function(){
			$(".cubing-panel").css('display','none')
		})

		$("#vote-close").on('click',function(){
			$(".vote-panel").css('display','none')
		})

		$("#draw-close").on('click',function(){
			draw_name_list = [];
			$('.lucky-draw-panel p').remove();
			$('.lucky-draw-panel .random-name-display').remove()
			$(".lucky-draw-panel").css('display','none');
			$(".lucky-draw-result").css('display','none');
			$(".lucky-draw-result p").remove();
		})

		var randomNameDisplay = function () {
			$('.lucky-draw-panel .random-name-display').remove()
			nameDisplay = draw_name_list[Math.floor(Math.random()*draw_name_list.length)]
			name_color = RandomEffect.color()
			name_html = '<div class="random-name-display" style="position:absolute;top: 0%;bottom: 0%;left:0%;right: 0%;text-align: center;' +
				'background:white"><p style="position:absolute;font-size: 80px;top:20%;bottom:20%;left:10%;right:10%;color:'+ name_color + '" >' + nameDisplay + '</p></div>'
			console.log(name_html)
			setTimeout($('.lucky-draw-panel').append(name_html),500)
		}

		var randomtask
		$(".draw-button").on('click',function(){
			if ($(this).data('status')==0) {
				$(this).data('status',1);//1开启 0暂停中
				$(this).text('停止...')
				randomtask=setInterval(randomNameDisplay,50)
			}else{
				clearInterval(randomtask);
				var draw_result_html = '<p style="font-size: 20px">'+ $('.random-name-display p').text() +'</p>'
				$('.lucky-draw-result').append(draw_result_html)
				setTimeout(draw_name_list.remove($('.random-name-display p').text()))
				$(this).data('status',0);//1开启 0暂停中
				$(this).text('抽奖')

			}
		})
	},
	sendDouyuMsg:function(sendmsg){
		$(".cs-textarea").val(sendmsg);        //弹幕输入框
		$(".b-btn").click();					//弹幕发送button
	},
	addCSButton: function () {
	  	mainhtml = '<div class="cs-douyu-live"><div class="cs-scramble-section"><p style="font-size: 30px;text-align: center">弹幕大神:</p></div>' +
			'<div class="cs-douyu-time-list" ></div></div>';
		//mainhtml = '<div class="cs-douyu-live"><div class="cs-scramble-section"><p>弹幕大神:</p><button id="addbutton">add</button></div>' +
		//	'<div class="cs-douyu-time-list" ></div></div>';
		$('body').append(mainhtml)
		$('.cs-douyu-live').attr('data-status','preparing')
		$('#addbutton').on('click', function () {
			var time = (Math.random()*20).toFixed(3)
			content.addTimeItem('kira',time)
		})
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
		var danmu_item = $('.time-item')
		var danmu_length =danmu_item.length
		var new_order
		var itemhtml,rank

		if(danmu_length==0){
			new_order=0

		}
		else if(danmu_length==1){
			if(Number($('.time-item').children('.time').text())>Number(time))
				new_order = 0
			else
				new_order = 1
			console.log(new_order)
		}
		else{
			for(i=1;i<=danmu_length;i++){
				if(Number($('.time-item').children('.time').eq(0).text())>Number(time)){
					new_order=0
					console.log(new_order)
					break;
				}
				else if(Number($('.time-item').children('.time').eq(i-1).text())<Number(time) && Number($('.time-item').children('.time').eq(i).text())>Number(time))
				{
					new_order=i
					console.log(new_order)
					break;
				}
				else if(Number($('.time-item').children('.time').eq(-1).text())<Number(time)){
					new_order=danmu_length
					console.log(new_order)
					break;
				}
			}
		}

		switch(new_order)
		{
			case 0:
				itemhtml = '<div class="time-item" style="height:80px;background-image: ' +
					"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg1.png')" +
					'"><p class="name123" style="font-size: 30px">' + name +  '</p>' + '<p class="time" style="top: 50%;font-size: 30px"> '+ time +'</p></div>'
				console.log(itemhtml)
				break;
			case 1:
				itemhtml = '<div class="time-item" style="height:50px;background-image: ' +
					"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg2.png')" +
					'"><p class="name123" style="font-size: 25px">' + name +  '</p>' + '<p class="time" style="font-size: 25px"> '+ time +'</p></div>'
				console.log(itemhtml)
				break;
			case 2:
				itemhtml = '<div class="time-item" style="height:35px;background-image: ' +
					"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg3.png')" +
					'"><p class="name123" style="font-size: 25px">' + name +  '</p>' + '<p class="time" style="font-size: 25px"> '+ time +'</p></div>'
				console.log(itemhtml)
				break;
			default :
				itemhtml = '<div class="time-item" style="background-image: ' +
					"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg.png')" +
					'"><p class="rank">'+(new_order+1).toString()+'</p><p class="name">' + name +  '</p>' + '<p class="time"> '+ time +'</p></div>'
				console.log(itemhtml)
				break;
		}


		if(danmu_length==0){
			$('.cs-douyu-time-list').append(itemhtml)
		}
		else{
			if(new_order==0){
				$('.time-item:eq(0)').before(itemhtml);
			}
			else{
				var position = '.time-item:eq('+(new_order-1).toString() + ')'
				console.log(position)
				$(position).after(itemhtml);
			}
		}

		$('.time-item').addClass('animated fadeInRightBig');
		var reformat = function(){
			$('.time-item:eq(0)').css('height','80px')
			$('.time-item:eq(0)').css('background-image',"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg1.png')")
			$('.time-item:eq(0) p:eq(0)').addClass('name123')
			$('.time-item:eq(0) p:eq(0)').removeClass('name')
			$('.time-item:eq(0) p:eq(0)').css('font-size','30px')
			$('.time-item:eq(0) p:eq(1)').css('font-size','30px')
			$('.time-item:eq(0) p:eq(1)').css('top','50%')


			$('.time-item:eq(1)').css('height','50px')
			$('.time-item:eq(1)').css('background-image',"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg2.png')")
			$('.time-item:eq(1) p:eq(0)').removeClass('name')
			$('.time-item:eq(1) p:eq(0)').addClass('name123')
			$('.time-item:eq(1) p:eq(0)').css('font-size','25px')
			$('.time-item:eq(1) p:eq(1)').css('font-size','25px')
			$('.time-item:eq(1) p:eq(1)').css('top','10%')

			$('.time-item:eq(2)').css('height','35px')
			$('.time-item:eq(2)').css('background-image',"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg3.png')")
			$('.time-item:eq(2) p:eq(0)').removeClass('name')
			$('.time-item:eq(2) p:eq(0)').addClass('name123')
			$('.time-item:eq(2) p:eq(0)').css('font-size','25px')
			$('.time-item:eq(2) p:eq(1)').css('font-size','25px')
			$('.time-item:eq(2) p:eq(1)').css('top','10%')


			$('.time-item:gt(2)').css('height','30px')
			$('.time-item:gt(2)').css('background-image',"url('chrome-extension://mphnhgpimbpdnipgjjojcfipmmkmmbpe/img/bg.png')")
			$('.time-item:gt(2)').each(function(){
					if($(this).children('p').size()==2){
						$(this).children('p:eq(0)').removeClass('name123')
						$(this).children('p:eq(0)').addClass('name')
						html_add = '<p class="rank">'+($(this).index()+1).toString()+'</p>'
						$(this).children('p:eq(0)').before(html_add)
					}
					else{
						$(this).children('p:eq(0)').text(($(this).index()+1).toString())
					}
					$(this).children('p').css('font-size','20px')
					$(this).children('p').css('top','10%')
			})



		}
		setTimeout(reformat,300)


	},
	addZHButton:function(){
		mainhtml = '<div class="zh-douyu-live"><div class="zh-scramble-section"><p style="font-size: 30px;text-align: center">弹幕大神:</p></div>' +
			'<div class="zh-douyu-time-list" ></div></div>';
		//mainhtml = '<div class="cs-douyu-live"><div class="cs-scramble-section"><p>弹幕大神:</p><button id="addbutton">add</button></div>' +
		//	'<div class="cs-douyu-time-list" ></div></div>';
		$('body').append(mainhtml)
		$('.zh-douyu-live').attr('data-status','preparing')
		$('#addbutton').on('click', function () {
			var time = (Math.random()*20).toFixed(3)
			content.addTimeItem('kira',time)
		})
		document.addEventListener('keydown', function (e) {
			if(e.keyCode == 32){
				//var scramble_text = $('#scrambleTxt').text()
				//$('.cs-scramble-section').text(scramble_text)
				if($('.zh-douyu-live').attr('data-status')=='ending'){
					$('.zh-douyu-live').css('display','none')
					$('.zh-douyu-live .time-item').remove()
					$('.zh-douyu-live').attr('data-status','preparing')
					setTimeout($('#disarrange_section').css('z-index','10') , 100)
				}
				if($('.zh-douyu-live').attr('data-status')=='preparing'){
					setTimeout($('#disarrange_section').css('z-index','10') , 100)
				}

			}
		});
		document.addEventListener('keyup',function(e){
			if(e.keyCode==32) {
				if($('.zh-douyu-live').attr('data-status')=='preparing'){
					$('.zh-douyu-live').css('display','block')
					$('.zh-douyu-live').attr('data-status','starting')
					chrome.runtime.sendMessage({action: "timer-starting",timer:"zhtimer"}, function(response) {
						console.log(response);
					});
				}
				else if($('.zh-douyu-live').attr('data-status')=='starting'){
					$('.zh-douyu-live').attr('data-status','ending')
					chrome.runtime.sendMessage({action: "timer-end",timer:"zhtimer",time_result:$('#msms').text()}, function(response) {
						console.log(response);
					});
				}
			}
		})
	}
}
var nickId,nickName,chatId,chatMessage
$(document).ready(function(){
	content.init()
	if (document.domain.indexOf('douyu')>=0) {content.addDouyuButton()};
	if(document.domain.indexOf('cstimer')>=0){content.addCSButton()};
	if(document.domain.indexOf('zhtimer')>=0){content.addZHButton()};

	
})

