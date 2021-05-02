# Machigae_sagashi

間違え探しクイズを、作成・シェア・プレイできるアプリケーションです。
2枚の画像を用意するだけで間違え探しが作成でき、他の人の投稿作品で遊ぶこともできます。

レスポンシブ対応しているため、スマホからでも利用することができます。

# URL

https://machigaesagashi.site

開発途中であるため、不具合等があるかもしれません。

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
