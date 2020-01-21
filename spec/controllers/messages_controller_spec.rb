require 'rails_helper'

describe MessagesController do
  # letを利用してテスト中使用するインスタンスを定義
  let(:group) { create(:group) }
  let(:user) { create(:user) }

  describe '#index' do

    # ログインしている場合
    # アクション内で定義しているインスタンス変数があるか
    # 該当するビューが描画されているか
    context 'log in' do
      # before ブロック内に記述された処理は各 example が実行される直前に毎回実行されるため
      # テストに共通な処理はここにまとめておく。
      before do
        # ログインする
        login user
        # index アクションを動かす
        get :index, params: { group_id: group.id }
      end

      it 'assigns @message' do
        # assingns(:message)でインスタンス変数 @message を参照できる
        expect(assigns(:message)).to be_a_new(Message)
      end

      it 'assigns @group' do
        expect(assigns(:group)).to eq group
      end

      it 'renders index' do
        # response はexample内でリクエストが行われた後の遷移先のビューをもつインスタンス
        # message#indexアクションのViewと同じかを確認する
        expect(response).to render_template :index
      end
    end

    # ログインしていない場合
    # 意図したビューにリダイレクトできているか
    context 'not log in' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end


  describe '#create' do
    # attributes_for はfactoryの対象の属性を Hashで返す という振る舞いをするストラテジ
    # https://tech.grooves.com/entry/2015/04/28/173025#attributes_for_strategy
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }

    context 'log in' do
      before do
        login user
      end

      # ログインしているかつ、保存に成功した場合
      # メッセージの保存はできたのか
      # 意図した画面に遷移しているか
      context 'can save' do
        # subject は postメソッドでcreateアクションを擬似的にリクエストした結果、という意味
        subject {
          post :create,
          params: params
        }

        it 'count up message' do
          # changeマッチャで、Messageモデルのレコードの総数が1つ増えたかどうかを確かめる
          # 保存に成功した場合は、レコードが必ず1つ増えているため
          expect{ subject }.to change(Message, :count).by(1)
        end

        it 'redirects to group_messages_path' do
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end

      # ログインしているが、保存に失敗した場合
      # メッセージの保存は行われなかったか
      # 意図したビューが描画されているか
      context 'can not save' do
        # createアクションをリクエストする際に invalid_params を引数として渡すことで、意図的にメッセージの保存を失敗させる
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }

        subject {
          post :create,
          params: invalid_params
        }

        it 'does not count up' do
          # not_to は、〜でないこと、を意味する。
          expect{ subject }.not_to change(Message, :count)
        end

        it 'renders index' do
          subject
          expect(response).to render_template :index
        end
      end
    end

    # ログインしていない場合
    # 意図した画面にリダイレクトできているか
    context 'not log in' do

      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end