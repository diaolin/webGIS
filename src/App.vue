<template>
  <div id="app" ref="app">
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
    data() {
      return {
        clientHeight: '',
        clientWidth: '',
      }
    },
    watch: {
      clientHeight() {
        // this.$refs.sycontent.style.background = this.clientHeight + ' '+this.clientWidth;
        this.changeFixed(this.clientHeight);
        // this.initMap();
      },
      clientWidth() {
        this.changeFixedw(this.clientWidth);
      },
    },
    methods: {
      changeFixed(clientHeight) { // 动态修改样式
        this.$refs.app.style.height = clientHeight + 'px';
      },
      changeFixedw(clientWidth) { // 动态修改样式

      },
    }
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
  .SelectBox {
    margin-left: 20px;
  }

  .container {
    margin: 20px;
    display: flex;
    flex-direction: row
  }

  /* .map{
  width: 800px;
  height: 600px;
  background-color: bisque;
  flex-grow:1.5
} */
  .echart {
    flex-grow: 3
  }

  .foot {
    bottom: 0;
    position: absolute;
    /* margin-left:40%; */
    right: 38%;
    /* text-align: center; */
  }

  #app {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    height: 100%;
  }
</style>