
$(function() {

  function buildHTML(message) {
    // 画像とメッセージがあるとき
    if (message.content && message.image) {
      var html =
        `<div class="main-items" data-message-id=` + message.id + `>` +
          `<div class="main-items__title">` +
            `<div class="main-items__title--name">` +
              message.user_name +
            `</div>` +
            `<div class="main-items__title--time">` +
              message.created_at +
            `</div>` +
          `</div>` +
          `<div class="main-items__body">` +
            `<p class="main-items__body--message">` +
              message.content +
            `</p>` +
          `</div>` +
          `<img src="` + message.image + `" class="main-items__body--image" >` +
        `</div>`
    } else if (message.content) {
    // メッセージがあるとき（画像なし）
      var html =
        `<div class="main-items" data-message-id=` + message.id + `>` +
        `<div class="main-items__title">` +
          `<div class="main-items__title--name">` +
            message.user_name +
          `</div>` +
          `<div class="main-items__title--time">` +
            message.created_at +
          `</div>` +
        `</div>` +
        `<div class="main-items__body">` +
          `<p class="main-items__body--message">` +
            message.content +
          `</p>` +
        `</div>` +
      `</div>`
    } else if (message.image) {    
    // 画像があるとき（メッセージなし）
      var html =
        `<div class="main-items" data-message-id=` + message.id + `>` +
          `<div class="main-items__title">` +
            `<div class="main-items__title--name">` +
              message.user_name +
            `</div>` +
            `<div class="main-items__title--time">` +
              message.created_at +
            `</div>` +
          `</div>` +
          `<div class="main-items__body">` +
            `<img src="` + message.image + `" class="main-items__body--image" >` +
          `</div>` +
        `</div>`
    }
    return html;
  };

  var reloadMessages = function() {
    // jQueryで使える:lastを使って、main-itemsが付いたクラスの最後のノードからmessage-idを取得
   //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $('.main-items:last').data("message-id");
    $.ajax({
     //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
     //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
     //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      // console.log('success');
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.main-items').append(insertHTML);
        $('.main-items').animate({ scrollTop: $('.main-items')[0].scrollHeight});
        $("#new_message")[0].reset();
        $(".new-message__btn").prop("disabled", false);
      }
    })
    .fail(function() {
      alert("メッセージの読み込みに失敗しました");
    })
  };

  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    // FormDataオブジェクトを作成し、フォームの内容を入れる
    var formData = new FormData(this);
    // 行き先はFormのアクションに記載されている
    var url = $(this).attr('action');
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: 'POST',  //同期通信でいう『HTTPメソッド』
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data) {
      var html = buildHTML(data);
      $('.main__middle').append(html);
      $('.main__middle').animate({ scrollTop: $('.main__middle')[0].scrollHeight});
      $('#new_message')[0].reset();
      $('.new-message__btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    })
  })
  // reloadMessages関数を7000ミリ秒間隔で呼び出す
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});