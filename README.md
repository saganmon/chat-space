# README

## usersテーブル
|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|email|string|null: false|
|group_id|integer|null: false, foreign_key: true|
|chat_id|integer|foreign_key: true|

### Association
- has_many :groups, through: :groups_users
- has_many :groups_users
- has_many :chats


## groupsテーブル
|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|user_id|integer|null: false, foreign_key: true|
|chat_id|integer|foreign_key: true|

### Association
- has_many :users, through: :groups_users
- has_many :groups_users
- has_many :chats


## groups_usersテーブル
|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false, foreign_key: true|
|group_id|integer|null: false, foreign_key: true|

### Association
- belongs_to :group
- belongs_to :user


## chatsテーブル
|Column|Type|Options|
|------|----|-------|
|message|text|null: false|
|image_id|integer|foreign_key: true|

### Association
- belongs_to :user
- belongs_to :group
- has_one :image


## imagesテーブル
|Column|Type|Options|
|------|----|-------|
|image|string|null: false|
|message_id|integer|null: false, foreign_key: true|

### Association
- has_one :chat