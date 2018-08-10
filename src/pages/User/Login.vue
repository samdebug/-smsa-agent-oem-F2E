<template lang="pug">
    div.forget-page
        div.login-header
            .w1000.clearfix
                img.fl.logoImg(v-bind:src="imgUrl")
                .cont.fl.logoTitle 用户中心
                router-link(to="/register").btn.btn-green.btn-md.fr(v-if="isTp") 注册
                //router-link(to="/login").btn.btn-green-block.btn-md.fr.mr10(v-if="isTp") 登录
        div.container.clearfix.w1000
            .fl.login-bg
                img(src="./images/login-bg.png",style="width: 550px;")
            div.grid-login.fr
                div.ctx
                    h2 登录用户中心
                    .grid-input.border
                        input(type="text",placeholder="账号",  style="position:fixed;top:-99999999999999px;opacity:0;")
                        input(type="password", style="position:fixed;top:-99999999999999px;opacity:0;")
                        input(type="text",placeholder="账号", v-model="username", @keyup.enter="login")
                    .grid-input.border
                        input(type="password",placeholder="密码", v-model="password", @keyup.enter="login")     
                    
                    .clearfix.mt10
                        el-checkbox(v-model="checked", @change="changeRemember").fl.col-6 记住密码
                        router-link(to="/forget").fr.link-green() 忘记密码
                        //span.fr.link-green.ml5.mr5 |  
                        //router-link(to="/register").fr.link-green 新用户注册  
                    a(href="javascript:;", v-on:click="login").btn.btn-lg.btn-green.btn-bk.login 登录
        div.icp
            p.tx-c {{icpText}}
</template>
<script src="./Login.controller.js"></script>
<style lang="scss" scoped>
@import '../../assets/styles/config.scss';
.forget-page {
    position: fixed;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    top: 60px;
    left: 0;
    .login-header {
        background-color:#FFF;
        height:60px;
        position: fixed;
        border-bottom: 1px solid #dbdbdb;
        box-shadow: 0px -1px 1px 2px rgba(202, 202, 202, 0.5);
        width:100%;
        left:0;
        top:0;
        .cont{
            display: inline-block;
            font-weight:800;
            color:#263646;
            line-height: 60px;
            text-align: left;
            font-size:24px;
        }
        img{
            width:30px;
            height:30px;
            margin-top:15px;
            display: inline-block;
            margin-right:5px;
        }
        .btn{
            width:85px;
            margin-top:15px;
        }
    }
    .login-bg{
        margin-top:86px;
    }
    .grid-login {
        margin-top:110px;
        width: 400px;
        box-shadow: 1px 1px 5px 2px rgba(202, 202, 202, 0.5);
        padding: 24px 35px  50px;
        background-color: #FFF;
        border-top:3px solid $green;
        h2 {
            text-align: center;
            font-weight: normal;
            line-height: 60px;
            font-size: 18px;
        }
        input {
            border: 0 none;
            padding: 0 10px;
        }
        .grid-input {
            height: 40px;
            margin-top:20px;
            input {
                height: 38px;
                line-height: 38px;
                width: 100%;
            }
        }
        .ctx {
            border-bottom:1px solid $border-color;
            padding-bottom:15px;
            .login{
                margin-top:25px;
                margin-bottom: 50px;
            }
        }
    }
}
.icp{
    border-top:none;
    background-color: transparent;
}
</style>

