<template>
  <div>
    <h3 class="description mt-32 mb-2 text-3xl tracking-widest">
      よくある質問
    </h3>
    <hr class="mx-auto border-b-2 border-fuchsia-600 w-[300px]" />

    <div
      class="bg-white py-6 px-6 my-10  rounded-xl border-4 max-w-2xl mx-auto h-screen text-lg"
    >
      <div class="mb-8">
        <div class="q_box">
          <span class="question">Q.</span>このサービスは何ですか？
        </div>
        <div class="a_box">
          <p class="text-left">
            <span class="answer">A.</span
            >間違い探しを作って遊べるプラットフォームサービスです。
          </p>
        </div>
      </div>
      <div class="mb-8">
        <div class="q_box">
          <p class="text-left">
            <span class="question">Q.</span>無料で利用できますか？
          </p>
        </div>
        <div class="a_box">
          <p class="text-left">
            <span class="answer">A.</span>無料で利用できます。
          </p>
        </div>
      </div>
      <div class="mb-8">
        <div class="q_box">
          <p class="text-left">
            <span class="question">Q.</span>会員登録は必要ですか？
          </p>
        </div>
        <div class="a_box">
          <p class="text-left">
            <span class="answer">A.</span
            >会員登録不要で利用することができます。しかし、Twitterログインを行って頂くと、作成した間違い探しの一覧表示を行う事ができます。
          </p>
        </div>
      </div>
      <div class="mb-8">
        <div class="q_box">
          <p class="text-left">
            <span class="question">Q.</span>投稿した間違い探しを削除したいです。
          </p>
        </div>
        <div class="a_box">
          <p class="text-left">
            <span class="answer">A.</span
            >Twitterログインを行って投稿した間違い探しであれば、マイページから削除することができます。ログインを行わずに投稿した間違い探しに関しては、お問い合わせフォームから管理者へ削除を依頼して頂ければ削除致します。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Playへすぐにリダイレクト
export default {
  mounted: async function() {
    //スクロール位置を指定
    scrollTo(0, 0)
  },
}
</script>
<style lang="sass" scoped>
.q_box
  @apply flex justify-items-start items-end font-bold
.a_box
  @apply flex justify-items-start items-end
.question
  @apply text-2xl text-blue-400 font-bold mr-2
.answer
  @apply text-2xl text-red-400 font-bold mr-2
</style>
