<template>
  <!-- <div id="login" v-show="showLogin"> -->
  <div id="login" ref="login">
    <div class="xttitle">国土调查成果管理与数据共享服务平台</div>
    <div class="loginToHome">
      <!-- <div>webGIS</div> -->
      <div class="logincon">
        <el-form ref="form" :model="form" :rules="ruleForm" status-icon label-width="80px" class="loginForm">
          <!-- <h3 style="color:white;">登录</h3> -->
          <el-form-item label="用户名" prop="name" class="formlabel">
            <el-input type="text" v-model="form.name" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="formlabel">
            <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="homeBut" type="primary" plain @click="submit" :loading="logining">登录</el-button>
            <el-button class="loginBut" type="primary" plain @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>
<script>
  import {
    post
  } from '../api/post.js'
  import {
    eventBus
  } from '../main'
  export default {
    data() {
      return {
        // showLogin:true,
        logining: false,
        form: {
          name: 'admin1',
          password: '123'
        },
        ruleForm: {
          name: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }, ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, ]
        },
        rescode: '',
        clientHeight: '',
        clientWidth: ''
      }
    },
    watch: {
      // 如果 clientHeight 发生改变，这个函数就会运行
      clientHeight() {
        this.changeFixed(this.clientHeight);
      },
      clientWidth() {
        this.changeFixedw(this.clientWidth);
      }
    },
    mounted() {
      // 获取浏览器可视区域高度
      this.clientHeight = document.documentElement.clientHeight; // document.body.clientWidth;
      this.clientWidth = window.screen.availWidth // document.body.clientWidth;
      window.onresize = function temp() { // 在窗口或框架被调整大小时触发
        this.clientHeight = document.documentElement.clientHeight;
        this.clientWidth = window.screen.availWidth
      };
    },
    methods: {
      changeFixed(clientHeight) { // 动态修改样式
        this.$refs.login.style.height = clientHeight + 'px';
      },
      changeFixedw(clientWidth) { // 动态修改样式
        // this.$refs.login.style.width = clientWidth + 'px';
      },
      submit(event) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = new FormData();
            params.append("username", this.form.name);
            params.append("password", this.form.password);
            this.postData("login.do", params);
            // this.postData("http://192.168.100.115:8080/logout",params);
            // this.logining = true;
          } else {
            console.log('error submit!');
            return false;
          }
        })
      },
      resetForm() {
        this.$refs.form.resetFields();
      },
      postData(url, params) {
        let that = this;
        post(url, params).then(res => {
          console.log("res", res);
          that.rescode = res.code;
          if (that.rescode === 0) {
            that.logining = false;
            // that.showLogin = false;
            sessionStorage.setItem('user', this.form.name);
            // const {href} = this.$router.resolve(
            // { 
            //   path: '/list'
            // })
            // window.open(href, '_blank')
            new Promise((resolve, reject) => {
              that.$router.push({ //你需要接受路由的参数再跳转
                  path: '/list'
                })
                .then(res => {
                  eventBus.$emit("username", that.form.name)
                  console.log("登录成功");
                  resolve(res.data);
                })
                .catch(err => {
                  reject(err.data);
                })
            });
          } else {
            this.$message({
              showClose: true,
              message: '用户名或密码错误',
              type: 'error'
            });
          }
        }).catch(err => {
          console.log("失败");
        });
      }
    }
  }
</script>
<style>
  /* url("../assets/images/1.jpg") no-repeat */
  #login {
    background: url("../assets/images/2.jpg");
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
  }

  .xttitle {
    position: absolute;
    /* left: 0px;
    right: 0;
    top: 0;
    bottom: 0; */
    width:600px;
    height: 100px;
    color:white;
    /* margin: 0 auto; */
    text-align: center;
    left: 50%;
    top:30%;
    font-size: 24px;
    margin-left: -300px;
    z-index: 9999;
    /* left: 50%;
    top: 30%; */
  }

  .loginToHome {
    position: absolute;
    left: 0px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    
  }
  .logincon{
    position: absolute;
    left: 0px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 260px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #dcdfe6;
  }
  .loginForm {
    text-align: right;
    padding-top: 15px;
    padding-right: 30px;
    top: 10px;
    margin: 30px;
  }

  .homeBut {
    position: absolute;
    left: 0px;
  }

  .loginBut {
    position: absolute;
    right: 0px;
  }

  .formlabel .el-form-item__label {
    color: white;
  }
</style>