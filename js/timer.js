/**
 * Created by hanzhao on 16/3/7.
 */

$(function() {
    var press_time = 100,  // 计时器启动时间
        timing_step = '',  // 计时阶段, 未准备: '', 已准备: 'prepare', 计时中: 'timing'
        timing_record = 0,
        pressed_timer_flag = false,
        start_record = 0;
    //var timer_stopwatch_color = $('.timer-color input').val();

    function display_timing_record(t) {
        $("#s2").text(t / 1000 % 60 % 10 | 0)
        $("#s1").text(t / 1000 % 60 / 10 | 0)
        $("#m2").text(t / 1000 / 60 % 10 | 0)
        $("#m1").text(t / 1000 / 60 / 10 | 0)
        $("#h2").text(t/  1000 / 60 / 60 % 10 | 0)
    }

    document.addEventListener("keydown", function(e) {
        if($(".cs-textarea").not(':focus').length == 1 && $('.sloving-panel').data('status')==1){
            e.preventDefault()
            if (e.keyCode == 90 && !timing_step && !pressed_timer_flag) {
                pressed_timer_flag = true
                $("#htimer>.msms").css("color", "red")
                pressed_timer = setTimeout(function() {
                    timing_step = "prepare"
                    $("#htimer>.msms").css("color", "green")
                    display_timing_record(0)
                    clearTimeout(pressed_timer)
                    pressed_timer_flag = false
                    timing_record = 0
                }, press_time)
            }


            if (e.keyCode == 90) {
                if (timing_step == "timing") {
                    timing_step = "finishing"
                    clearTimeout(start_timer)
                }
            }
        }

    }, false);
    document.addEventListener("keyup", function(e) {
        if($(".cs-textarea").not(':focus').length == 1){
            e.preventDefault()
            if (e.keyCode == 90) {
                if (timing_step == "prepare" || timing_step == "observing") {
                    timing_step = "timing"
                    start_record = (new Date()).valueOf()
                    $("#htimer>.msms").css("color", 'red')
                    start_timer = setInterval(function () {
                        timing_record = (new Date()).valueOf() - start_record
                        display_timing_record(timing_record)
                    }, 1)
                } else {
                    if (pressed_timer_flag) {
                        clearTimeout(pressed_timer)
                        $("#htimer>.msms").css("color", 'green')
                        pressed_timer_flag = false
                    }
                }
            }


            if(e.keyCode == 32 && timing_step == "timing"){
                    $("#htimer-sloved").text(Number($("#htimer-sloved").text()) + 1)
                    $("#htimer-unsloved").text(Number($("#htimer-unsloved").text()) - 1)
            }

            if (timing_step == "finishing") timing_step = ""
        }

    }, false);
});

