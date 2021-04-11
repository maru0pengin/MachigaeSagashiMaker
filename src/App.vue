<template>
  <div id="app">
    <nav class="w-full flex bg-blue-300 lg:px-8 px-4 py-4 text-white items-center relative justify-between md:justify-start">
      <div class="flex text-xl font-bold tracking-wider space-x-2 md:mx-0 mx-auto">
        <router-link to="/"><p class="text-4xl no-underline text-grey-darkest hover:text-blue-dark font-bold">Machigae Sagashi</p></router-link>
      </div>
      <div class="text-white flex md:space-x-2 p-0 md:px-0 md:space-y-0 space-y-1 md:ml-4 md:relative absolute top-full bg-blue-300 flex-col md:flex-row left-0 right-0">
        <router-link to="/upload"><p class="text-xl font-bold px-4 py-2 hover:bg-blue-400 hover:text-white rounded-lg block">問題投稿</p></router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
</script>
<style>
#app {
  text-align: center;
  color: #2c3e50;
  font-family: arial black;
  @apply bg-gray-50
}
.description{
  @apply font-bold text-gray-900 text-xl
}
</style>