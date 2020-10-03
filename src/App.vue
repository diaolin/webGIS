<template>
  <div id="app">
    <router-view></router-view>
    <!-- <report_query/>
    <piebarbar/> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import report_query from './components/report_query.vue'
// import piebarbar from './components/piebarbar.vue'

export default {
  name: 'App',
  components: {
    // report_query,
    // piebarbar,
    // HelloWorld,
    // SelectBox,
    // echart,
    // Map
    // list,
    // login
  },
  // mounted(){
  //   window.addEventListener('hashchange', () => {
  //     let currentPath = window.location.hash.slice(1)
  //     if (this.$route.path !== currentPath) {
  //       this.$router.push(currentPath)
  //     }
  //   }, false)
  // } 
}
</script>

<style>
.SelectBox{
  margin-left:20px;
}
.container{
  margin:20px;
  display: flex;
  flex-direction: row
}
/* .map{
  width: 800px;
  height: 600px;
  background-color: bisque;
  flex-grow:1.5
} */
.echart{
  flex-grow:3
}
</style>
