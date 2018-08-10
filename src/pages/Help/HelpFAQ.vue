<template lang="pug">
.page-help.p10
    .grid-list-head
        .grid-tab.active 常见问题FAQ
    .mt10
        .title 1、能发三网吗？
        .paragraph 能，我们和三大运营商都有合作关系，短信能发三网（170号段也支持）。
        
        .title 2、三网显什么号码？
        .paragraph 我们用的是106、1069三网合一通道（1069工信部申请特批，三大运商落地，三网手机统一显示1069）。

        .title 3、能自定义签名吗？
        .paragraph 可以自定义签名，但需要报备。

        .title 4、短信发送几秒收到？
        .paragraph 最快3-5秒，平均10秒。

        .title 5、会不会有延时？
        .paragraph 我们短信通道最大下发能力可扩展至1000条/秒，所以不会造成堵塞延时，一般延时都是手机端信号原因造成的，不会到1%。

        .title 6、会不会有收不到的情况？
        .paragraph 手机号码黑名单、第三方软件拦截、手机收件箱满等，会有1%左右的概率。

        .title 7、怎么保障短信的稳定？
        .paragraph 我们公司和全国30多个地市的运营商都有合作，短信通道充足，确保某条通道出问题能随时有备份。另外，我们公司有系统自动监测机制（系统根据回执自动统计短信发送数度和成功率）和人工自动监测机制（设置短信每1小时发送到监控人员手机，随时了解短信发送情况）通过智能路由功能自动切换优质通道。

        .title 8、你们公司有哪些知名客户？
        .paragraph 阿里、触宝、嗒嗒巴士、优步（和优步美国供应商合作）、聚美优品（语音短信）等。

        .title 9、怎么和你们对接？
        .paragraph 我们有HTTP、API、rest等接口可以对接，通过双方对接人建QQ讨论组沟通。

      
</template>
<script src="./HelpFAQ.controller.js"></script>
<style lang="scss">
@import '../../assets/styles/config.scss';
.page-help{
    .title{
        line-height: 45px;
        background-color: #F8F8F8;
        border:1px solid $border-color;
        padding-left:10px;
    }
    .paragraph{
        line-height: 60px;
        border:1px solid $border-color;
        padding-left:30px;
        border-top:0;
        a{
            color:$green;
            &:hover{
                text-decoration: underline;
            }
        }

    }
}
</style>
