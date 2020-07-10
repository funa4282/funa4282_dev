// スクロール用
$(function () {
    $('a[href^="#"]').click(function () {
        var speed = 500;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position;
        position = target.offset().top - 70;
        $("html, body").animate({ scrollTop: position }, speed, "swing");
        return false;
    });
});
// // スクロールで発火するアニメーション
// $(window).on('load scroll', function(){
//     let elem = $('.img-wrap');
//     elem.each(function () {
//         let fadeOut = 'fade-out';
//         let elemOffset = $(this).offset().top;
//         let scrollPos = $(window).scrollTop();
//         let wh = $(window).height();
//         if(scrollPos > elemOffset - wh + (wh / 3)){
//             $(this).addClass(fadeOut);
//         }
//     });
// });
$(function () {
    // ナビゲーションのリンクを指定
    var navLink = $('.menu__horizontal a');
    // 各コンテンツのページ上部からの開始位置と終了位置を配列に格納しておく
    var contentsArr = new Array();
    for (var i = 0; i < navLink.length; i++) {
        // コンテンツのIDを取得
        var targetContents = navLink.eq(i).attr('href');
        // ページ内リンクでないナビゲーションが含まれている場合は除外する
        if (targetContents.charAt(0) == '#') {
            // ページ上部からコンテンツの開始位置までの距離を取得
            var targetContentsTop = $(targetContents).offset().top;
            // ページ上部からコンテンツの終了位置までの距離を取得
            var targetContentsBottom = targetContentsTop + $(targetContents).outerHeight(true) - 1;
            // 配列に格納
            contentsArr[i] = [targetContentsTop, targetContentsBottom];
        };
    };
    // 現在地をチェックする
    function currentCheck() {
        // 現在のスクロール位置を取得
        var windowScrolltop = $(window).scrollTop();
        var wh = $(window).height();
        for (var i = 0; i < contentsArr.length; i++) {
            // 現在のスクロール位置が、配列に格納した開始位置と終了位置の間にあるものを調べる
            if (contentsArr[i][0] - wh + (wh / 2) <= windowScrolltop && contentsArr[i][1] + wh + (wh / 2) >= windowScrolltop) {
                // 開始位置と終了位置の間にある場合、ナビゲーションにclass="current"をつける
                navLink.removeClass('current');
                navLink.eq(i).addClass('current');
                i == contentsArr.length;
            };
            if (contentsArr[0][0] - wh + (wh / 2) >= windowScrolltop) {
                navLink.eq(0).removeClass('current');
            };
        };
    };
    // ページ読み込み時とスクロール時に、現在地をチェックする
    $(window).on('load scroll', function () {
        currentCheck();
    });
});
// $('a[href^="#"]').hover(function() {
//     $(this).removeClass('current');
// });
// ハンバーガーメニュー
$(function () {
    $('#js-buttonHamburger').click(function () {
        $('body').toggleClass('is-drawerActive');
        if ($(this).attr('aria-expanded') == 'false') {
            $(this).attr('aria-expanded', 'true');
        }
        else {
            $(this).attr('aria-expanded', 'false');
        };
    });
});
// ハンバーガーメニューから遷移したとき
$(function () {
    $('.drawer__menu a[href^="#"]').click(function () {
        $('body').toggleClass('is-drawerActive');
        if ($('#js-buttonHamburger').attr('aria-expanded') == 'false') {
            $('#js-buttonHamburger').attr('aria-expanded', 'true');
        }
        else {
            $('#js-buttonHamburger').attr('aria-expanded', 'false');
        };
    });
});