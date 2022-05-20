$(function () {

    var ua = navigator.userAgent;
    var isMobile = (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0) && ua.indexOf('Mobile') > 0;
    var isAndroid = (ua.indexOf('Android') > 0)
    var isIPhone = (ua.indexOf('iPhone') > 0)

    $('.line__container').draggable({
     	// containment: "parent",
        // 	axis: 'x'
     	// helper: 'clone'
        handle: $('.line__title'),
        // start: function(e, ui){
        //     $(this).css('bottom', 'auto').addClass('moving');
        // },
        // zIndex: 99
    });

    //通常のスクリプト///////////////////////////////////////////////////////////////////////////////////
    //iPhoneの顎にスペースを確保
    if (isIPhone) {
        $('#chat-input').focus(function () {
            $('.line__container .scroll').css('height', 'calc(100vh - 50px - 56px)');
            $('#chat-input').css('height', '50px');
            $('#chat-input').css('padding-bottom', '10px');
            $('.chat-submit').css('bottom', '0px');
        })
        $('#chat-input').blur(function () {
            $('.line__container .scroll').css('height', '');
            $('#chat-input').css('height', '');
            $('#chat-input').css('padding-bottom', '');
            $('.chat-submit').css('bottom', '');
        })
    }

    // var INDEX = 0;
    function generate_message(msg, type, posttime) {
        // INDEX++;
        var str = "";
        if (!posttime) {
            var today = new Date();
            // $weekday = ['日', '月', '火', '水', '木', '金', '土'];
            // month = today.getMonth() + 1;
            // var posttime = month + "月" + today.getDate() + "日（" + $weekday[today.getDay()] + "） " + today.getHours() + ":" + ('0' + today.getMinutes()).slice(-2);
            posttime = today.getHours() + ":" + ('0' + today.getMinutes()).slice(-2);
        }
        if (type == 'self') {
            str = '<div class="line__right">'
                + '<div class="text">' + msg + '</div>'
                + '<span class="date">既読<br>' + posttime + '</span></div>'
        } else if (type == 'user'){
            str = '<div class="line__left">'
                + '  <figure><img src="/icon.png" /></figure>'
                + '  <div class="line__left-text">'
                + '  <div class="name">てすとイチゴウ</div>'
                + '  <div class="text">'+ msg + '</div>'
                + '  </div>'
                + '</div>'
        } else if (type = 'stamp') {
            str = '<div class="line__left"><figure><img src="/icon.png" /></figure><div class="stamp"><div class="name">てすとイチゴウ</div><img src="/stamp/14.png" /></div></div>'
        }
        
        $(".line__contents").append(str);
        // $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type == 'self') {
            $("#chat-input").val('');
        }
        $(".line__contents").stop().animate({
            scrollTop: $(".line__contents")[0].scrollHeight
        }, 1000);
    }

    $('#chat-submit').click(function(e){
        e.preventDefault();
        var inputtext = $('#chat-input').val();
        generate_message(inputtext, 'self', null);
        $('#chat-input').val('');

        var timerId = setTimeout(function () {
            generate_message('システムが休眠から目覚めています、少々お待ちください...', 'user', null);
            generate_message('', 'stamp', null);
            clearTimeout(timerId);
        }, 3000);

        $.ajax({
        type: 'post',
        url: '/chat',
        data: {
            inputtext: inputtext,
        },
        dataType: 'json'
        }).done(function (json, textStatus, jqXHR) {
            console.log(json);
            generate_message(JSON.parse(json), 'user', null);
            clearTimeout(timerId);
            
        // 通信に失敗した時に実行される
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("jqXHR.status: " + jqXHR.status); //例：404
            console.log("textStatus: " + textStatus); //例：error
            console.log("errorThrown: " + errorThrown); //例：NOT FOUND
        // 成功/失敗に関わらず実行される
        }).always(function () {
            console.log("Ajax通信完了。");
        })
    })
})
