# まちがいさがしメーカー

間違い探しクイズを、作成・シェア・プレイできるWebアプリケーションです。<br>
2枚の画像を用意するだけで間違い探しが作成でき、他の人の投稿作品で遊ぶこともできます。<br>
レスポンシブ対応しているため、スマホからでも利用することができます。

<img src=https://user-images.githubusercontent.com/75305753/118792797-f4860980-b8d2-11eb-9e02-43271be31d93.JPG width=100%>

|トップページ|プレイ画面|
|---|---|
|![](https://user-images.githubusercontent.com/75305753/118792399-96592680-b8d2-11eb-93c3-e4ae32fad48a.jpg)|![](https://user-images.githubusercontent.com/75305753/118792292-7d507580-b8d2-11eb-8e2a-2ab165b111b1.jpg)|

# URL

https://machigaesagashi.site <br>
開発途中であるため、不具合等があるかもしれません。<br>
お気づきの際は[問い合わせフォーム](https://docs.google.com/forms/d/e/1FAIpQLSdHpcv83hmHh9XvRN5a35k-aEQ7UbGYJ93s5YDHQkUNkwERkw/viewform)等へ連絡頂けると幸いです。

# 使用技術
- Vue.js 2.6.12
- pixi.js 5.3.7
- tailwind
- Firebase
  - Cloud Firestore
  - Firebase Hosting
  - Firebase Authentication
- GitHub Actions CI/CD

# CI/CD

GitHub Actions を用いて以下のことを行っています。
- Pull Request の作成時にプレビューサイトをデプロイ
- Pull Request をマージ時に、本番サイトにデプロイ

# 機能一覧

- 投稿機能
  - 2枚の画像(正解画像と間違え画像)を投稿
  - 画像のトリミング(coropperjs)
  - 間違え位置の設定(pixijs)
- Twitterシェア機能
- 検索機能
- 投稿作品で遊ぶ機能(pixijs)
- Twitterアカウントを用いたログイン機能

# 今後実装予定の機能

- 間違い位置を点ではなく手書き範囲で設定できる機能
- ライフや時間制限の機能を設け、ゲームオーバーの概念を作る
