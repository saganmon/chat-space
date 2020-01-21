require 'rails_helper'

RSpec.describe Message, type: :model do
  describe '#create' do
    context 'can save' do

      # 1. メッセージがあれば保存できること
      it 'is valid with content' do
        expect(build(:message, image: nil)).to be_valid
      end

      # 2. 画像があれば保存できること
      it 'is valid with image' do
        expect(build(:message, content: nil)).to be_valid
      end

      # 3. メッセージと画像があれば保存できること
      it 'is valid with content and image' do
        expect(build(:message)).to be_valid
      end
    end

    context 'can not save' do
      # 4. メッセージも画像も無いと保存できないこと
      it 'is invalid without content and image' do
        message = build(:message, content: nil, image: nil)
        message.valid?
        expect(message.errors[:content]).to include("を入力してください")
      end

      # 5. group_idが無いと保存できないこと
      it 'is invalid without group_id' do
        message = build(:message, group_id: nil)
        message.valid?
        expect(message.errors[:group]).to include("を入力してください")
      end

      # 6. user_idが無いと保存できないこと
      it 'is invaid without user_id' do
        message = build(:message, user_id: nil)
        message.valid?
        expect(message.errors[:user]).to include("を入力してください")
      end
    end
  end
end