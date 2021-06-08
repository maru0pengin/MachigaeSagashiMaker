# まちがいさがしメーカー

間違い探しクイズを、作成・シェア・プレイできるWebアプリケーションです。<br>
2枚の画像を用意するだけで間違い探しが作成でき、他の人の投稿作品で遊ぶこともできます。<br>
レスポンシブ対応しているため、スマホからでも利用することができます。
![まちがいさがしメーカー](https://user-images.githubusercontent.com/75305753/120919306-d18d8f00-c6f3-11eb-836f-ebb028cd32d8.JPG)


|トップページ|プレイ画面|
|---|---|
|![](https://user-images.githubusercontent.com/75305753/120919307-d5211600-c6f3-11eb-89b3-efcdf7c40018.jpg)|![](https://user-images.githubusercontent.com/75305753/120919351-17e2ee00-c6f4-11eb-8cb0-2294a125e04f.jpg)|

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
  - Firebase Authentication(Twitter ログイン)
- GitHub Actions(CI/CD)
- Rollbar(エラーモニタリング)

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
