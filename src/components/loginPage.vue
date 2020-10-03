<template>
    <div >
        <div class="loginmain">
            <div class="loginheader">
                <div class="header-center fl">
                    <div class="header-title">
                        登录界面
                    </div>
                    <div class="header-img"></div>
                </div>
                <div class="header-bottom fl"></div>
            </div>

            <div class="content">
                <div class="content-left">
                    <!--<img src="images/d.png" alt="">-->
                </div>
                <!-- <el-form-item label="用户名" prop="name">
                    <el-input
                        type="text"
                        v-model="form.name"
                        auto-complete="off"
                        placeholder="请输入用户名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="form.password"
                        auto-complete="off"
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item> -->
                <div class="content-right">
                    <div class="right-infp">
                        <div class="right-infp-name">
                            <input type="text" name="username" id="user" placeholder="请输入用户名" maxlength="12"
                                @click="user" required="" value="admin1" autocomplete="off">
                        </div>
                        <div class="right-infp-name">
                            <input type="text" name="name" id="password" value="123" @click="passget"
                                placeholder="请输入密码" autocomplete="off">
                        </div>

                        <div class="right-infp-btn">
                            <button class="btn" @click="submit">登录</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import $ from 'jquery'
    // import "../assets/css/login.css"
    import {
        post
    } from '../api/post.js'
    // import { eventBus } from '../main'
   
    var str = ''; //定义一个空变量用来存储密码
    $('password').keyup(function () {
        var value = $(this).val(); //输入的时候获取输入框的值  
        str += value.substr(value.length - 1, 1); //获取最后一个字符加到到str,因为除了最后一个字符，其他的已经为*
        $(this).val(value.replace(/./g, '*')) //输入框内容全部变为*
        console.log(str); //str即为输入框的内容
    })
    export default {
        data() {
            return {
                username: 'admin1',
                password: '123',
                rescode: '',
                width:'',
                height:''
            }
        },
        created(){
        //     let that = this;
        //     $(document).ready(function () {
        //         // that.height = $(window).height();
        //     let whei = $(window).width()
        //     $("html").css({
        //         fontSize: whei / 24
        //     });
        //     $(window).resize(function () {
        //         let whei = $(window).width();
        //         $("html").css({
        //             fontSize: whei / 24
        //         })
        //     });
        // });
        },
        mounted(){
            // this.test();
        },
        methods: {
            test(){
                 $(document).ready(function () {
                        // that.height = $(window).height();
                    let whei = $(window).width()
                    $("html").css({
                        fontSize: whei / 24
                    });
                    // $(window).resize(function () {
                    //     let whei = $(window).width();
                    //     $("html").css({
                    //         fontSize: whei / 24
                    //     })
                    // });
                });
            },
            user() {
                this.username = document.getElementById('user').value;
                console.log("this.username", this.username);
            },
            passget() {
                this.password = document.getElementById('password').value;
            },
            submit() {
                console.log("this.username", this.username);
                console.log("this.password", this.password);
                let params = new FormData();
                params.append("username", this.username);
                params.append("password", this.password);
                let that = this;
                post("login.do", params).then(res => {
                    console.log("res", res);
                    that.rescode = res.code;
                    if (that.rescode === 0) {
                        console.log("lll");
                        that.logining = false;
                        // that.showLogin = false;
                        sessionStorage.setItem('user', this.username);
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
                                    // eventBus.$emit("username", this.username)
                                    // console.log("登录成功");
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

<style scoped>

    /* .loginmain {
        padding: 0px;
        margin: 0px;
        color: #ffffff;
    }

    .loginmain {
        background: url("../assets/images/bj.jpg") no-repeat;
        background-size: cover;
        font-size: .16rem;
        color: #ffffff;
        position: relative;
        width: 100%;
        height: 100%;
    } */
    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box
    }

    *,
    .loginmain {
        padding: 0px;
        margin: 0px;
        color: #ffffff;
    }

    .loginmain {
        background: url("../assets/images/bj.jpg") no-repeat;
        background-size: cover;
        font-size: .16rem;
        color: #ffffff;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .loginmain {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .loginheader {
        width: 100%;
        height: 1.5rem;

    }

    .loginheader .header-center {
        width: 50%;
        height: 1.2rem;
        position: relative;
        margin: 0 auto;
    }

    .loginheader .header-center .header-title {
        text-align: center;
        color: #ffffff;
        font-size: .4rem;
        text-shadow: 0 0 .3rem #00d8ff;
        line-height: 1.05rem;
    }

    .loginheader .header-img {
        background: url("../assets/images/head.gif") no-repeat center center;
        background-size: 100%;
        height: 100%;
        width: 100%;
        position: absolute;
        top: .8rem;
    }

    .content {
        width: 12rem;
        height: 7rem;
        margin: 1rem auto 0 auto;
    }

    .content .content-left {
        width: 6.2rem;
        height: 5.8rem;
        background: url("../assets/images/d.png") no-repeat;
        background-size: 100% 100%;
        padding: 0.4rem 0;
        box-sizing: border-box;
        margin-right: 2%;
        float: left;
    }

    @-webkit-keyframes rotation {
        from {
            -webkit-transform: rotate(0deg);
        }

        to {
            -webkit-transform: rotate(360deg);
        }
    }

    .content .content-left {
        -webkit-transform: rotate(360deg);
        animation: rotation 15s linear infinite;
        -moz-animation: rotation 15s linear infinite;
        -webkit-animation: rotation 15s linear infinite;
        -o-animation: rotation 15s linear infinite;
    }

    .content .content-right {
        width: 5.4rem;
        height: 5.8rem;
        background: url("../assets/images/e.png") no-repeat;
        background-size: 100% 100%;
        float: right;
        position: relative;

    }

    .right-infp {
        width: 4rem;
        height: 3rem;
        margin: auto auto;
        vertical-align: center;
        position: absolute;
        top: 1.6rem;
        left: 0.9rem;
    }

    .right-infp-name {
        background: url("../assets/images/b.png") no-repeat;
        width: 100%;
        height: 0.5rem;
        background-size: 100% 100%;
        line-height: 0.45rem;
        margin-bottom: 0.4rem;
        position: relative;
    }

    .right-infp-name input {
        width: 85%;
        border: none;
        box-sizing: border-box;
        height: 0.5rem;
        margin-left: 0.5rem;
        line-height: 0.4rem;
        background: none !important;
        color: #00eaff;
        padding-left: 0.15rem;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
        position: absolute;


    }

    input::-webkit-input-placeholder {
        color: #ccc;
    }

    .right-infp-btn {
        background: url("../assets/images/a.png") no-repeat;
        width: 100%;
        height: 0.5rem;
        background-size: 100% 100%;
        line-height: 0.5rem;
        margin-bottom: 0.4rem;
        position: relative;
    }

    .right-infp-btn .btn {
        width: 95%;
        border: none;
        box-sizing: border-box;
        height: 0.45rem;
        margin-left: 0.1rem;
        font-size: 0.22rem;
        cursor: pointer;
        background: none;
        outline: none;
        color: #fff;
        position: absolute;


    }

    .right-infp-btn .btn:hover {}
</style>