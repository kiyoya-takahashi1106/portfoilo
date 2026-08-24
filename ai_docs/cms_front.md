# Portfolio CMS フロントエンド仕様書

## 1. 概要

ポートフォリオのコンテンツを、コードを直接変更せずに管理できるCMS管理画面を実装する。

フロントエンドは **React / Vite** を使用し、`/admin` 配下にCMSを構築する。

CMSでは主に以下を行えるようにする。

- 各コンテンツの一覧表示
- 検索・絞り込み
- 新規追加
- 編集
- 削除
- 公開 / 非公開の切り替え
- 画像の選択・プレビュー・変更
- 管理者一覧の確認
- 管理者の追加・削除
- Googleアカウントによるログイン
- ログアウト

---

## 2. URL設計

CMSは基本的に以下の3階層で構成する。

/admin
/admin/X
/admin/X/:id

それぞれの役割は以下。

| URL | 役割 |
| --- | --- |
| `/admin` | CMS全体のダッシュボード |
| `/admin/X` | 各コンテンツの一覧・管理画面 |
| `/admin/X/:id` | 特定データの編集画面 |

管理対象コンテンツ：

- profile
- news
- education-work
- research
- projects
- qualifications
- admins

-
`Profile` は1件固定のため、`/admin/profile/:id` は作成せず、`/admin/profile` 自体を編集画面とする。
---



---

## 3. `/admin` ダッシュボード

CMS全体のトップページ。

各コンテンツの管理画面へ移動するためのカードを表示する。

表示項目：

- Profile
- News
- Education / Work
- Research
- Projects
- Qualifications

カード全体をクリック可能にする。



---

## 4. 一覧画面 `/admin/X`

対象：

- `/admin/news`
- `/admin/education-work`
- `/admin/research`
- `/admin/projects`
- `/admin/qualifications`

一覧画面では以下の操作を提供する。

- データ一覧表示
- 検索
- 絞り込み
- 新規追加
- 編集画面への遷移
- 削除
- 公開 / 非公開状態の確認

### 検索

タイトルなどから対象データを検索できるようにする。

### 絞り込み

コンテンツに応じて以下のようなフィルターを用意する。

- Published
- Category
- Type
- Current

### 編集

一覧の「編集」から各編集画面へ移動する。

例：

/admin/research/2

### 新規追加

「+ 新規追加」から新規作成フォームへ移動する。

例：

/admin/research/new

---

## 7. Profile 編集画面

URL：

/admin/profile

Profileは一覧画面を持たず、直接編集フォームを表示する。

### 管理項目

- Name
- English Name
- Role
- Email
- University Name
- Department Name
- Department URL
- Lab Name
- Lab URL
- GitHub
- Twitter
- Profile Image
- Hero Image



---

## 8. News 管理画面

一覧：

/admin/news

編集：

/admin/news/:id

新規作成：

/admin/news/new

### フォーム項目

- Category
- Date
- Title
- Description
- Link
- Published
- Display Order


---

## 9. Education / Work 管理画面

一覧：

/admin/education-work

編集：

/admin/education-work/:id

新規作成：

/admin/education-work/new

### フォーム項目

- Type
- Short Work
- Date
- Title
- Subtitle
- Logo
- Material URL
- Tags
- Current
- Published
- Display Order

### Type

以下から選択する。

- Education
- Work

`Select` または `Radio` 形式を使用する。

### Boolean項目

以下はSwitch形式を推奨する。

- Current
- Published

---

## 10. Research 管理画面

一覧：

/admin/research

編集：

/admin/research/:id

新規作成：

/admin/research/new

### フォーム項目

- Title
- Description
- Image
- Tags
- Link
- Current
- Published
- Display Order

### Image

現在の画像を表示し、編集画面から変更できるようにする。

---

## 11. Projects 管理画面

一覧：

/admin/projects

編集：

/admin/projects/:id

新規作成：

/admin/projects/new

### フォーム項目

- Title
- Description
- Image
- Tech
- Link
- Published
- Display Order

### Tech

タグ形式の入力UIを使用する。

Tech

[ React × ] [ TypeScript × ] [ Supabase × ]

[ 技術を追加... ]

---

## 12. Qualifications 管理画面

一覧：

/admin/qualifications

編集：

/admin/qualifications/:id

新規作成：

/admin/qualifications/new

### フォーム項目

- Name
- Label
- Date
- Published
- Display Order

---

## 13. 画像変更UI

画像を扱うコンテンツ：

- Profile
- Education / Work
- Research
- Projects

編集画面では現在の画像を表示する。

Image

┌──────────────────┐
│                  │
│   現在の画像       │
│                  │
└──────────────────┘

[ 画像を変更 ]

新しい画像を選択した後はプレビューを表示する。

新しい画像

┌──────────────────┐
│                  │
│   プレビュー       │
│                  │
└──────────────────┘

[ 選び直す ]

### UIフロー

画像を変更
↓
画像を選択
↓
プレビュー表示
↓
必要であれば選び直し
↓
保存

保存が完了するまでは現在の画像を維持する。

---

## 14. 削除UI

一覧画面または編集画面から削除できる。

削除ボタンを押した時点では削除せず、確認ダイアログを表示する。

このデータを削除しますか？

この操作は取り消せません。

[ キャンセル ] [ 削除 ]

削除成功後は一覧画面へ戻る。

---

## 15. 公開 / 非公開

対象データでは `Published` を編集できるようにする。

### 編集画面

Switch形式を使用する。

公開状態

Published     [ ON ]

### 一覧画面

Badgeなどで状態を表示する。

- 公開
- 非公開

公開状態が視認しやすいUIにする。

---

## 16. 管理者一覧

URL：

/admin/admins

### UIイメージ

管理者一覧

                       [ + 管理者を追加 ]

------------------------------------------
example1@gmail.com
------------------------------------------
example2@gmail.com                   [ 削除 ]
------------------------------------------

現在ログインしているユーザー自身については、

- 削除ボタンを表示しない
- またはDisabledにする





---

## 19. 認証画面

CMSはGoogleアカウントによるログインを前提とする。

### ログイン画面

Portfolio CMS

ポートフォリオ管理画面

[ Googleでログイン ]

### 未ログイン時

認証されていない状態で `/admin` 配下へアクセスした場合、ログイン画面へ遷移させる。

対象例：

- `/admin`
- `/admin/research`
- `/admin/projects`
- `/admin/news`

### 権限なし

管理者として利用できないGoogleアカウントの場合は以下のような画面を表示する。

このアカウントには管理画面へのアクセス権限がありません。

必要に応じて以下を表示する。

[ 別のGoogleアカウントでログイン ]



## 
必須項目や入力形式に問題がある場合は、該当項目の近くにエラーを表示する。

Title
[                         ]

タイトルを入力してください

