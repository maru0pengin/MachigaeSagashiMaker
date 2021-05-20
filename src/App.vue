<template>
  <div id="app">
    <Navigation />
    <router-view />

    <div class="bg-blue-300 h-44 text-white p-10">
      <p class="text-sm">© 2021 ペンギン丸</p>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import VueClipboard from "vue-clipboard2"
import Navigation from "@/components/Navigation.vue"
Vue.use(VueClipboard)
export default {
  // metaInfo: {
  //   title: "まちがいさがしメーカー",
  //   meta: [
  //     { name: "viewport", content: "width=420px,user-scalable=no" },
  //     {
  //       name: "description",
  //       content:
  //         "誰でも間違い探しクイズを作成、投稿、シェアできるWebアプリケーションです。",
  //     },
  //     {
  //       property: "og:description",
  //       content:
  //         "誰でも間違い探しクイズを作成、投稿、シェアできるWebアプリケーションです。",
  //     },
  //   ],
  // },
  components: {
    Navigation,
  },
  methods: {
    gotoContact() {
      window.open(`https://forms.gle/1uCV8gduy8PZu4jE9`)
    },
  },
}
</script>
<style>
#app {
  text-align: center;
  color: #2c3e50;
  font-family: arial black;
  @apply bg-gray-100;
}
.description {
  @apply font-bold text-gray-900 text-xl text-blue-500;
}
.main_button {
  @apply mt-4 inline-block px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-400 rounded shadow hover:shadow-lg hover:bg-indigo-500 focus:outline-none;
}
.submit_button {
  @apply mt-4 inline-block px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-indigo-500 rounded shadow hover:shadow-lg hover:bg-indigo-800 focus:outline-none;
}
.delete-button {
  @apply mt-4 inline-block px-4 py-1 font-medium leading-6 text-center transition text-red-500 border-4 transition border-red-500  transition bg-transparent rounded shadow hover:shadow-lg hover:bg-red-500 hover:text-white focus:shadow-lg focus:bg-red-500 focus:text-white focus:outline-none;
}
.min_button {
  @apply inline-block px-1 py-1 w-16 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-400 rounded shadow hover:shadow-lg focus:bg-indigo-500 focus:outline-none;
}
.upload_button {
  @apply inline-block px-4 py-2 font-medium leading-6 text-center text-blue-500 uppercase transition bg-transparent border-2 border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none;
}
</style>
