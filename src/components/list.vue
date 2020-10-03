<template>
  <div class="hello">
    <div class="line"></div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      router
      mode="horizontal"
      @select="handleSelect"
      background-color="#0E61A1"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item v-for="item in listArr" :key="item.href" :index="item.href" >{{item.title}}</el-menu-item>
      <!-- <el-menu-item index="/Map">test</el-menu-item> -->
      <span class="top" @click="loginOut()"><el-menu-item>退出</el-menu-item></span>
      <span class="top"><el-menu-item class="iconfont icon-weibiaoti562">{{' '+username}}</el-menu-item></span>
      <!-- <span class="iconfont icon-weibiaoti562"></span> -->
    </el-menu>
    <!-- <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      router
      mode="horizontal"
      @select="handleSelect"
      background-color="#0E61A1"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/first_page">首页</el-menu-item>
      <el-menu-item index="/data_manage">数据管理</el-menu-item>
      <el-menu-item index="/report_query">报表查询</el-menu-item>
      <el-menu-item index="/data_browser">数据浏览</el-menu-item>
      <el-menu-item index="/data_analysis">数据分析</el-menu-item>
      <el-menu-item index="/draw_multiple">制图综合</el-menu-item>
      <el-menu-item index="/user_manage">用户管理</el-menu-item>
      <el-menu-item index="/system_dispose">系统配置</el-menu-item>
    </el-menu> -->
    <router-view></router-view>
  </div>
</template>

<script>
import {post} from '../api/post.js'
import {dataget} from '../api/get.js'
import { eventBus } from '../main'
// import {axios} from 'axios'
  export default {
    created() {
        eventBus.$off("username");
        eventBus.$on('username', (message) => {
            // this.getUserName(message);
            this.username = message;
            console.log("username",message);
            window.sessionStorage.setItem('user',message)
            // console.log("message",message);
        })
    },
    data() {
      return {
        activeIndex: "/first_page",
        loginOuturl:"",
        listArr:[],
        username:'',
      };
    },
    watch:{
      '$route'(to,from){
        this.activeIndex=to.path
      }
    },
    mounted(){
      this.init();
      this.getMenu();
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      init(){
        let user = window.sessionStorage.getItem('user');
        this.username = user;
        if(this.activeIndex === "/first_page"){
          this.$router.push({//你需要接受路由的参数再跳转
              path: '/first_page'
          });
        }
      },
      getUserName(message){
         this.username = message;
      },
      loginOut(){
        let that = this;
        let params='1';
        post("logout", params).then(res=>{  
          that.rescode = res.code;
          if (that.rescode === 10) {
              that.logining = false;
              that.$router.push({//你需要接受路由的参数再跳转
                  path: '/loginPage'
              });
              console.log("退出成功");
            } else {
              // that.logining = false;
              // that.$alert('用户名或密码错误!', '', {
              //   confirmButtonText: 'ok'
              // })
            }
        }).catch(err=>{
          console.log("退出失败");
        });

      },
      getMenu(){
         let that = this;
         dataget("user/getMenu.do",'').then(res=>{ 
           if(res.code === 0){
             console.log("res.code",res.data);
             that.listArr = res.data;
             that.listArr.splice(1,1);
             that.listArr.splice(1,0,{href:"/data_manage1",id:12,title:'数据管理'});
             that.listArr.splice(5,0,{href:"/share_service",id:11,title:'共享服务'});
             that.listArr.push({href:"/content",id:13,title:'test'});
           } else if(res.code === 10){
             that.$router.push({//你需要接受路由的参数再跳转
                  path: '/login'
              });
           }
           console.log("ressss",res);
          }).catch(err=>{
              console.log("失败");
          });
      }
    }
  }
</script>

<style>
.top{
  float:right;
  right: 0;
}
</style>