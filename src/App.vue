<template>
  <div id="app">
    <nav
      class="w-full flex bg-blue-300 lg:px-8 px-4 py-4 text-white items-center relative justify-between md:justify-start"
    >
      <div
        class="flex text-xl font-bold tracking-wider space-x-2 md:mx-0 mx-auto"
      >
        <router-link to="/"
          ><p
            class="text-4xl no-underline text-grey-darkest hover:text-blue-dark font-bold"
          >
            Machigae Sagashi
          </p></router-link
        >
      </div>
      <div
        class="text-white flex md:space-x-2 p-0 md:px-0 md:space-y-0 space-y-1 md:ml-4 md:relative absolute top-full bg-blue-300 flex-col md:flex-row left-0 right-0"
      >
        <router-link to="/upload"
          ><p
            class="text-xl font-bold px-4 py-2 hover:text-blue-100 rounded-lg block"
          >
            問題投稿
          </p></router-link
        >
      </div>
    </nav>
    <router-view class="h-screen" />
  </div>
</template>

<script>
//routerで設定したタイトルとめたタグを反映する
export default {
  methods : {
    createTitleDesc : function(routeInstance){
      // タイトルを設定
      if(routeInstance.meta.title){
          let setTitle = routeInstance.meta.title;
          document.title = setTitle;
      } else {
          document.title = 'title is not set'
      }
      // メタタグdescription設定
      if(routeInstance.meta.desc){
          let setDesc = routeInstance.meta.desc;
          document.querySelector("meta[name='description']").setAttribute('content', setDesc)
      } else {
          document.querySelector("meta[name='description']").setAttribute('content', 'description is not set')
      }
    }
  },
  mounted : function(){
    let routeInstance = this.$route;
    this.createTitleDesc(routeInstance);
  },
  watch: {
    '$route' (routeInstance) {
        this.createTitleDesc(routeInstance);
    }
  }
}
</script>
<style>
#app {
  text-align: center;
  color: #2c3e50;
  font-family: arial black;
  @apply bg-gray-50;
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
.upload_button {
  @apply inline-block px-4 py-2 font-medium leading-6 text-center text-blue-500 uppercase transition bg-transparent border-2 border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none;
}
</style>