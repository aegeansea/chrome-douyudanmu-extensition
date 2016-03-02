/*popup.js*/
var popup ={
	init:function(){
		//初始化
		popup.styleInit()
		//监听保存
		$('.tts-save').on('click',function(event){
			chrome.storage.local.get('ttsoption',function(items){
				items.ttsoption.volume=parseFloat($("#volume").val())
				items.ttsoption.rate=parseFloat($("#rate").val())
				items.ttsoption.pitch=parseFloat($("#pitch").val())
				chrome.storage.local.set({'ttsoption':items.ttsoption},function(){
						popup.HtmlAlert("更新完成")
						popup.styleInit()
						console.log(items.ttsoption)
				})
			});
		})
		$('.tts-clear').on('click',function(){
			chrome.tts.stop()
			popup.HtmlAlert("已清空")
		})
		$('.send-msg-save').on('click',function(){
			sendmsg=$('#send-msg').val()
			wellcomemsg=$('#wellcome-msg').val()
			chrome.storage.local.set({'sendmsg':sendmsg,'wellcomemsg':wellcomemsg},function(){
				popup.HtmlAlert("更新完成")
				popup.styleInit()
			})
		})
		$('.doubanfm').on('click',function(){
			chrome.storage.local.set({'doubanfm':1})
			chrome.windows.create({url:"http://douban.fm/partner/uc",width:550,height:325,type:'panel'},function(window){
				console.log(window)
				chrome.storage.local.set({'doubanfmWindow':window})
			})
		})
	},
	styleInit:function(){
		chrome.storage.local.get('ttsoption',function(items){
			$("#volume").val(items.ttsoption.volume)
			$("#rate").val(items.ttsoption.rate)
			$("#pitch").val(items.ttsoption.pitch)
			var volume=items.ttsoption.volume*100
			var rate=items.ttsoption.rate*10
			var pitch=items.ttsoption.pitch*50
			$('.tts-volume .progress-bar').css('width',volume+'%')
			$('.tts-rate .progress-bar').css('width',rate+'%')
			$('.tts-pitch .progress-bar').css('width',pitch+'%')
		});
		chrome.storage.local.get('sendmsg',function(items){
			$("#send-msg").val(items.sendmsg)
		});
		chrome.storage.local.get('wellcomemsg',function(items){
			$("#wellcome-msg").val(items.wellcomemsg)
		});
	},
	HtmlAlert:function(message,msgcat){
		var msgcat = arguments[0]?arguments[0]:'success';
		$('#htmlalert').text(message);
		$('#htmlalert').addClass('alert-'+msgcat).show();
		$('#htmlalert').fadeOut(5000);
	}
}
//setInterval(walkloops, 2000);
popup.init()