<template>
  <div class="hello">
    <!-- <div class="line"></div> -->
    <!-- class="el-menu-demo" -->
    <!-- #0E61A1 -->
    <el-menu
      :default-active="activeIndex"
      router
      mode="horizontal"
      @select="handleSelect"
      background-color="#0083ce"
      text-color="#fff"
      style="z-index:999;top:0;left:0px;"
      active-text-color="#ffd04b">
      <el-menu-item v-for="item in listArr" :key="item.href" :index="item.href" style="border-right:1px solid white;"><span style="margin-right:5px;font-size:20px;border:1px solid white;" :class="item.icon"></span><span>{{item.title}}</span></el-menu-item>
      <!-- <span style="font-size:24px;">广安市国土调查成果管理与数据共享服务平台</span> -->
      <span class="top" @click="loginOut()"><el-menu-item>退出</el-menu-item></span>
      <span class="top"><el-menu-item class="iconfont icon-weibiaoti562">{{' '+username}}</el-menu-item></span>
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
        icons:['iconfont icon-shouye','iconfont icon-guanli','iconfont icon-shujufenxi','iconfont icon-ditu','iconfont icon-icon-diejiafenxi','','iconfont icon-yonghuguanli','iconfont icon-xitongpeizhi'],
        listrouter:['/user_management','/system_dispose']
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
                  path: '/login'
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
            //  that.listArr = res.data;
             for(let i in res.data){
               if( res.data[i].title !== '制图综合' && res.data[i].title !== '用户管理' && res.data[i].title !== '系统配置'){
                 let obj = {
                  href:res.data[i].href,
                  id:res.data[i].id,
                  title:res.data[i].title,
                  icon:this.icons[i]
                }
                that.listArr.push(obj);
               } else if(res.data[i].title === '用户管理'){
                 let obj = {
                  href:this.listrouter[0],
                  id:res.data[i].id,
                  title:res.data[i].title,
                  icon:this.icons[i]
                }
                that.listArr.push(obj);
               } else if(res.data[i].title === '系统配置'){
                 let obj = {
                  href:this.listrouter[1],
                  id:res.data[i].id,
                  title:res.data[i].title,
                  icon:this.icons[i]
                }
                that.listArr.push(obj);
               }
             }
             console.log("that.listArr",that.listArr);
            //  that.listArr.splice(1,1);
            //  that.listArr.splice(1,0,{href:"/data_manage1",id:12,title:'数据管理'});
             that.listArr.splice(5,0,{href:"/share_service",id:11,title:'共享服务',icon:'iconfont icon-icon_xinyong_xianxing_jijin-'});
            //  that.listArr.push({href:"/content",id:13,title:'test'});
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
.nav{
  /* background: linear-gradient(135deg, transparent 15px,  #0080ff 0)
                top left,
                linear-gradient(-135deg, transparent 15px,  #0080ff 0)
                top right,
                linear-gradient(-45deg, transparent 15px,#0080ff 0)
                bottom right,
                linear-gradient(45deg, transparent 15px,#0080ff 0)
                bottom left; */
    /* background: linear-gradient(135deg, transparent 15px,   rgb(4, 62, 138) 0)
                top left,
                linear-gradient(-135deg, transparent 0px,   rgb(4, 62, 138) 0)
                top right,
                linear-gradient(-45deg, transparent 15px, rgb(4, 62, 138) 0)
                bottom right,
                linear-gradient(45deg, transparent 0px, rgb(4, 62, 138) 0)
                bottom left;             */
    background-size: 50% 50%;
    background-repeat: no-repeat;
    left:5px;
}
/* .nav:before{
	content: '';
	position: absolute;
  left: 0px;
	height: 10px;
  width: 10px;
  border-top: 2px solid white;
  border-left: 2px solid white;
} */
.nav:before{
	content: '';
	position: absolute;
  left: 0px;
  bottom:0px;
	height: 10px;
  width: 10px;
  border-bottom: 2px solid white;
  border-left: 2px solid white;
	/* background-color: white; */
}

/* .nav:after{
	content: '';
	position: absolute;
  right: 0;
  bottom:0;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
	height: 10px;
  width: 10px;
} */
.nav:after{
	content: '';
	position: absolute;
  right: 0;
  top:0;
  border-right: 2px solid white;
  border-top: 2px solid white;
	height: 10px;
  width: 10px;
	/* background-color: white; */
}
.el-menu-item:hover {
    background-color: #FD9E29 !important;
}

.hello{
  width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    height: 100%;
}
</style>