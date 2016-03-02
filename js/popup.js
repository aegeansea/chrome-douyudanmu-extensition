/*popup.js*/
var popup ={
	init:function(){
		//初始化
		popup.styleInit()
		//监听保存

		$('.default-setting').on('click',function(){
			popup.Default()
		})
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
		$('.timer-save').on('click',function(){
			var options = {}
			options.timer_display = $('#timer-display').is(':checked')
			options.timer__auto_danmu = $('#timer-auto-danmu').is(':checked')
			chrome.storage.local.set({'timer_option':options},function(){
				popup.HtmlAlert("更新完成")
				popup.styleInit()
			})
		})
		$('.reply-save').on('click',function(){
			var options = {}
			options.reply = $('#auto-reply-switch').is(':checked')
			options.min_interval = $('#min-reply-interval').val()
			options.scramble = $('#reply-scramble-response-allowed').is(':checked')
			options.competitor = $('#reply-competitor-info-allowed').is(':checked')
			options.wcaitem = $('#reply-wca-query-allowed').is(':checked')
			options.manager = $('#manager-no-limited').is(':checked')
			chrome.storage.local.set({'reply_option':options},function(){
				popup.HtmlAlert("更新完成")
				popup.styleInit()
			})
		})
		$('.result-save').on('click',function(){
			var options = {}
			options.monitor = $('#result-monitor').is(':checked')
			options.upload = $('#result-upload').is(':checked')
			chrome.storage.local.set({'result_option':options},function(){
				popup.HtmlAlert("更新完成")
				popup.styleInit()
			})
		})
		$('.voting-save').on('click',function(){
			var options = {}
			console.log('djfksdjkf')
		})
		$('.lucky-save').on('click',function(){
			var options = {}
			options.awardname = $('#lucky-award-name').val()
			options.manuallist = $('#lucky-manual-list').val()
			chrome.storage.local.set({'lucky_option':options},function(){
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
		});
		chrome.storage.local.get('sendmsg',function(items){
			$("#send-msg").val(items.sendmsg)
		});
		chrome.storage.local.get('wellcomemsg',function(items){
			$("#wellcome-msg").val(items.wellcomemsg)
		});
		chrome.storage.local.get('timer_option',function(options){
			$('#timer-display').prop('checked',options.timer_option.timer_display)
			$('#timer-auto-danmu').prop('checked',options.timer_option.timer__auto_danmu)
		});
		chrome.storage.local.get('reply_option',function(options){
			$('#auto-reply-switch').prop('checked',options.reply_option.reply)
			$('#min-reply-interval').val(options.reply_option.min_interval)
			$('#reply-scramble-response-allowed').prop('checked',options.reply_option.scramble)
			$('#reply-competitor-info-allowed').prop('checked',options.reply_option.competitor)
		  	$('#reply-wca-query-allowed').prop('checked',options.reply_option.wcaitem)
			$('#manager-no-limited').prop('checked',options.reply_option.manager)
		});
		chrome.storage.local.get('result_option',function(options){
			$('#result-monitor').prop('checked',options.result_option.monitor)
			$('#result-upload').prop('checked',options.result_option.upload)
		});
		chrome.storage.local.get('voting_option',function(options){

		});
		chrome.storage.local.get('lucky_option',function(options){

		});
	},
	HtmlAlert:function(message,msgcat){
		var msgcat = arguments[0]?arguments[0]:'success';
		$('#htmlalert').text(message);
		$('#htmlalert').addClass('alert-'+msgcat).show();
		$('#htmlalert').fadeOut(5000);
	},
	Default:function(){
		$('#timer-display').prop('checked',true)
		$('#timer-auto-danmu').prop('checked',false)
		$('#auto-reply-switch').prop('checked',false)
		$('#min-reply-interval').val(1)
		$('#reply-scramble-response-allowed').prop('checked',true)
		$('#reply-competitor-info-allowed').prop('checked',true)
		$('#reply-wca-query-allowed').prop('checked',true)
		$('#manager-no-limited').prop('checked',true)
		$('#result-monitor').prop('checked',false)
		$('#result-upload').prop('checked',false)
		$('#lucky-award-name').val('')
		$('#lucky-manual-list').val('')
		$('.timer-save').click()
		$('.reply-save').click()
		$('.result-save').click()
		$('.voting-save').click()
		$('.lucky-save').click()
	}
}
//setInterval(walkloops, 2000);


$(document).ready(function(){
	popup.init()
})