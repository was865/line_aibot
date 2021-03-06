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
            $('#chat-input-form').css('height', '60px');
        })
        $('#chat-input').blur(function () {
            $('.line__container .scroll').css('height', '');
            $('#chat-input-form').css('height', '');

            // $('.chat-submit').css('bottom', '');
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
            str = '<div class="line__right animate__animated animate__fadeInUp animate__faster animate__repeat-1">'
                + '<div class="text">' + msg + '</div>'
                + '<span class="date">既読<br>' + posttime + '</span></div>'
        } else if (type == 'user'){
            str = '<div class="line__left animate__animated animate__fadeInUp animate__faster animate__repeat-1">'
                + '  <figure><img src="/icon.png" /></figure>'
                + '  <div class="line__left-text">'
                + '  <div class="name">てすとイチゴウ</div>'
                + '  <div class="text">'+ msg + '</div>'
                + '  </div>'
                + '</div>'
        } else if (type = 'stamp') {
            str = '<div class="line__left animate__animated animate__fadeInUp animate__faster animate__repeat-1"><figure><img src="/icon.png" /></figure><div class="stamp"><div class="name">てすとイチゴウ</div><img src="/stamp/14.png" /></div></div>'
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
        if ($('#chat-input').val().length == 0) {
            $('#chat-input').addClass('animate__animated animate__headShake animate__faster animate__repeat-1');
            $('#chat-input').on('animationend webkitAnimationEnd', function(){
                // CSSのanimationプロパティで設定したものが終了した時に実行する内容
                $(this).removeClass('animate__animated animate__headShake animate__faster animate__repeat-1');
            });
            return false;
        }
        var inputtext = $('#chat-input').val();
        generate_message(inputtext, 'self', null);
        $('#chat-input').val('');

        var timerId = setTimeout(function () {
            generate_message('システムが休眠から目覚めています、少々お待ちください...', 'user', null);
            generate_message('', 'stamp', null);
            clearTimeout(timerId);
        }, 12000);

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

    // 右クリック機能
    $.contextMenu({
        // define which elements trigger this menu
        selector: ".text",
        items: {
            copy: {
                name: "コピー",
                // disabled: function(){
                //     return this.data('showAllDisabled'); 
                // }, 
                // icon: "fa-eye", 
                callback: function(key, opt){
                    // コピーする文章の取得
                    let text = $(this).text();
                    // テキストエリアの作成
                    let $textarea = $('<textarea></textarea>');
                    // テキストエリアに文章を挿入
                    $textarea.text(text);
                    //　テキストエリアを挿入
                    $(this).append($textarea);
                    //　テキストエリアを選択
                    $textarea.select();
                    // コピー
                    document.execCommand('copy');
                    // テキストエリアの削除
                    $textarea.remove();
                    // アラート文の表示
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000,
                        // timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'コピーしました。',
                        showClass: {
                            // backdrop: 'swal2-noanimation', // disable backdrop animation
                            popup: '',                     // disable popup animation
                            icon: ''                       // disable icon animation
                        },
                    })
                }
            }
        }
    });
})
