
$(function() {

  function buildHTML(message) {
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image) {
      var html =
        `<div class="main-items" data-message-id=${message.id}>
          <div class="main-items__title">
            <div class="main-items__title--name">
              ${message.user_name}
            </div>
            <div class="main-items__title--time">
              ${message.created_at}
            </div>
          </div>
          <div class="main-items__body">
            <p class="main-items__body--message">
              ${message.content}
            </p>
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html =
        `<div class="main-items" data-message-id=${message.id}>
          <div class="main-items__title">
            <div class="main-items__title--name">
              ${message.user_name}
            </div>
            <div class="main-items__title--time">
              ${message.created_at}
            </div>
          </div>
          <div class="main-items__body">
            <p class="main-items__body--message">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }

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
      $('form')[0].reset();
      $('.new-message__btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  })
})