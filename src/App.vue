<template>
  <div id="app">
    <nav
      class="w-full flex bg-blue-300 lg:px-8 px-4 py-4 text-white items-center relative justify-between md:justify-start"
    >
      <div class="tracking-tighter mx-2 md:w-96">
        <router-link to="/" class="text-xl md:text-3xl ">
          Machigae Sagashi
        </router-link>
      </div>

      <div class="text-white flex  top-full w-full">
        <div class="">
          <div class="flex mx-auto">
            <router-link
              to="/upload"
              class="font-bold px-4 py-2 hover:text-blue-100"
            >
              問題投稿
            </router-link>
            <button
              @click="gotoContact()"
              class="font-bold px-4 py-2 hover:text-blue-100 focus:outline-none"
            >
              お問い合わせ
            </button>
          </div>
        </div>
        <router-link
          to="/upload"
          class="font-bold px-4 py-2 hover:text-blue-100 ml-auto"
        >
          ログイン
        </router-link>
      </div>
    </nav>

    <router-view />

    <div class="bg-blue-300 h-44 text-white p-10">
      <p class="text-sm">© 2021 ペンギン丸</p>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import VueMeta from "vue-meta"
import VueClipboard from "vue-clipboard2"
Vue.use(VueMeta)
Vue.use(VueClipboard)
export default {
  metaInfo: {
    title: "Machigae Sagashi",
    meta: [{ name: "viewport", content: "width=420px,user-scalable=no" }],
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
.min_button {
  @apply inline-block px-1 py-1 w-16 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-400 rounded shadow hover:shadow-lg focus:bg-indigo-500 focus:outline-none;
}
.upload_button {
  @apply inline-block px-4 py-2 font-medium leading-6 text-center text-blue-500 uppercase transition bg-transparent border-2 border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none;
}
</style>
