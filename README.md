# Machigae_sagashi

間違え探しクイズを、作成・シェア・プレイできるアプリケーションです。<br>
2枚の画像を用意するだけで間違え探しが作成でき、他の人の投稿作品で遊ぶこともできます。<br>
レスポンシブ対応しているため、スマホからでも利用することができます。

<img src=https://user-images.githubusercontent.com/75305753/116813982-8252bc80-ab91-11eb-97d4-91168adce050.JPG width=100%>
<img src=https://user-images.githubusercontent.com/75305753/116814015-9ac2d700-ab91-11eb-8d9c-667013c2b213.jpg width=50%>

# URL

https://machigaesagashi.site <br>
開発途中であるため、不具合等があるかもしれません。<br>
お気づきの際は[問い合わせフォーム](https://docs.google.com/forms/d/e/1FAIpQLSdHpcv83hmHh9XvRN5a35k-aEQ7UbGYJ93s5YDHQkUNkwERkw/viewform)等へ連絡頂けると幸いです。

# 使用技術
- Vue.js 2.6.12
- pixi.js 5.3.7
- tailwind
- firebase
  - firebase storage
  - cloud firestore
  - firebase hosting
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

# 今後実装予定の機能

- Twitterアカウントを用いたログイン機能(firebase Auth)
- アハ体験ゲームを投稿する機能
