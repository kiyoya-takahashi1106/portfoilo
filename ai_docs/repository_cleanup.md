# portfolio_kiyoya リポジトリ整理・修正指示

対象リポジトリ：`kiyoya-takahashi1106/portfoilo_kiyoya`

## 目的

現在のポートフォリオリポジトリには、Google AI Studio / Gemini由来と思われる不要な設定や、未使用ファイル、型定義の不整合などが残っています。

ポートフォリオとしてGitHub上で見られた際に、構成が分かりやすく、不要なファイルがなく、React + TypeScript + Vite + Firebase Hostingのシンプルな構成になるよう整理してください。

既存の画面デザインや表示内容は、原則として変更しないでください。

---

## 1. `.firebase/` をGit管理から除外

`.firebase/` 配下にFirebase CLIが生成したキャッシュファイルが入っています。

現在確認できているもの：

```text
.firebase/
├── hosting.ZGlzdA.cache
└── hosting.cHVibGlj.cache
```

### 対応

- `.firebase/` ディレクトリをGit管理対象から削除する
- `.gitignore` に以下を追加する

```gitignore
.firebase/
```

### 注意

以下はFirebase Hostingで使用しているため削除しないこと。

```text
firebase.json
.firebaserc
```

---

## 2. 未使用画像を削除

現在のコードから参照されていない以下の画像を削除してください。

```text
public/project/_.jpg
public/research/_.jpg
```

一方、以下は現在使用されているため削除しないでください。

```text
public/project/JPHACK2025.jpg
public/research/common_space.png
public/research/psychology_erc.png
public/heroSection.jpg
public/profile.jpg
public/educationWork/*
```

---

## 3. Gemini / Google AI Studio由来の不要コードを削除

現在のポートフォリオではGemini APIを使用していません。

そのため、Gemini関連の依存関係・環境変数・import mapを削除し、通常のVite + React構成にしてください。

### 3.1 `package.json`

以下の依存関係を削除してください。

```json
"@google/genai": "^1.34.0"
```

削除後、必要に応じてlockファイルも更新してください。

```bash
npm install
```

または適切なnpmコマンドを使用し、`package-lock.json` と `package.json` の整合性を保ってください。

`package-lock.json` 自体は削除しないでください。

---

### 3.2 `index.html`

現在ある `importmap` を削除してください。

特に以下のようなReact / ReactDOM / GeminiのCDN定義は不要です。

```html
<script type="importmap">
{
  "imports": {
    "react": "...",
    "react/": "...",
    "react-dom/": "...",
    "@google/genai": "..."
  }
}
</script>
```

React / ReactDOMはnpm + Vite経由で読み込む構成に統一してください。

---

### 3.3 `vite.config.ts`

現在Gemini用として以下の処理があります。

```ts
const env = loadEnv(mode, '.', '');

define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
},
```

これらを削除してください。

既存の開発サーバー設定やaliasに意味がある場合は維持してください。

---

## 4. README.md をポートフォリオ用に全面修正

現在のREADMEにはGoogle AI Studio生成時の内容が残っています。

例：

```text
Run and deploy your AI Studio app
Set the GEMINI_API_KEY ...
```

これらはすべて削除してください。

### READMEに最低限含める内容

以下の構成をベースに、実際のリポジトリ内容に合わせてREADMEを書き直してください。

```md
# Kiyoya Takahashi Portfolio

髙橋清彌のポートフォリオサイトです。

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase Hosting

## Deploy

Firebase Hostingを利用していることが分かる程度の簡潔な説明を記載する。
```

AI Studioへのリンク、Gemini APIキー設定、AI Studio用バナーなどは不要です。

READMEは「このリポジトリが何なのか」「どう起動するのか」がすぐ分かる内容にしてください。

---

## 5. `types.ts` の不要型・不整合を整理

### 5.1 `ChatMessage`

現在のポートフォリオで使用していなければ、以下を削除してください。

```ts
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
```

削除前にリポジトリ全体を検索し、本当に未使用であることを確認してください。

---

### 5.2 `Skill`

現在以下の型があります。

```ts
export interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools';
}
```

さらに `ProfileData` に、

```ts
skills: Skill[];
```

があります。

一方で、現在の `PROFILE_DATA` には `skills` が存在していないように見えます。

### 対応

リポジトリ全体を確認し、Skills機能を現在使っていない場合は、

- `Skill` interfaceを削除
- `ProfileData` の `skills: Skill[]` を削除

してください。

将来用という理由だけで未使用コードを残さず、現在使っている型だけに整理してください。

---

## 6. `shortWork` をbooleanに修正

現在、

```ts
shortWork?: 'true' | 'false';
```

という文字列型になっています。

これを、

```ts
shortWork?: boolean;
```

に変更してください。

また、`constants.tsx` 側の、

```ts
shortWork: 'true'
shortWork: 'false'
```

を、

```ts
shortWork: true
shortWork: false
```

へ変更してください。

`EducationWork.tsx` などで、

```ts
item.shortWork === 'true'
```

のような比較をしている場合は、

```ts
item.shortWork
```

など、boolean前提の実装に修正してください。

---

## 7. Newsの空リンクを修正

`constants.tsx` のNewsには、

```ts
link: ''
```

となっているデータがあります。

一方、`Hero.tsx` ではNewsを常に `<a>` タグとして描画している可能性があります。

リンクが空の場合に、

```html
<a href="">
```

を生成しないようにしてください。

### 期待する挙動

- `item.link` が存在する → `<a>` で描画
- `item.link` がない / 空文字 → `<div>` 等の非リンク要素で描画

見た目は現在と変えないでください。

可能であればデータ側についても、

```ts
link: ''
```

ではなく、リンクがない場合は `link` 自体を省略する形に統一してください。

---

## 8. HTMLの言語設定を修正

サイトの主要コンテンツが日本語なので、

```html
<html lang="en">
```

を、

```html
<html lang="ja">
```

へ変更してください。