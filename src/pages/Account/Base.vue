<template lang="pug">
    div.page-base-info
        .clearfix(v-loading="loading")
            div(v-if="indexData.userType == '1'")
                div.fl.base-left
                    div.clearfix.item
                        div.title.char
                            span 用户ID
                            | :
                        div.desc {{baseInfo.agent_id}}
                    div.clearfix.item
                        div.title
                            span 用户名称
                            | :
                        div.desc  
                            span(v-if="!ismodify") {{baseInfo.agent_name}}
                            input.input.input-md(type="text", v-model="params_new.agent_name",v-else ) 

                    //- div.clearfix.item
                    //-     div.title
                    //-         span 代理商简称
                    //-         | :
                    //-     div.desc {{baseInfo.shorter_name}}
                    div.clearfix.item
                        div.title
                            span 用户状态
                            | :
                        div.desc {{baseInfo.status}}
                    div.clearfix.item
                        div.title.char4
                            span 认证状态
                            | :
                        div.desc {{baseInfo.oauth_status}}
                    div.clearfix.item.char4
                        div.title
                            span 认证时间
                            | :
                        div.desc {{baseInfo.oauth_date}}

                    div.clearfix.item.char4
                        div.title
                            span 联系地址
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{baseInfo.address}}
                            input.input.input-md(type="text", v-model="params_new.address",v-else ) 
                    div.clearfix.item.char4
                        div.title
                            span 证件类型
                            | :
                        div.desc {{baseInfo.id_type}}
                    div.clearfix.item.char4
                        div.title
                            span 证件号码
                            | :
                        div.desc {{baseInfo.id_nbr}}

                    div.clearfix.item.char4.btnItem
                        a.btn.btn-md.btn-green.change(href="javascript:;", v-on:click="changeInfo_new", v-if="!ismodify") 修改资料
                        div.clearfix.btn-group(v-else)
                            a.btn.btn-green.btn-md(href="javascript:;", v-on:click="confirmChange_new").fl.mr10 确认修改
                            a.btn.btn-green-block.btn-md(href="javascript:;", v-on:click="cancle_new").fl 取消


                div.fl.base-right
                    div.clearfix.item
                        div.title.char4
                            span 联系电话
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{baseInfo.mobile}}
                            input.input.input-md(type="text", v-model="params_new.mobile",v-else ) 
                    div.clearfix.item
                        div.title.char4
                            span 创建时间
                            | :
                        div.desc {{baseInfo.create_time}}
                    div.clearfix.item
                        div.title.char4
                            span 修改时间
                            | :
                        div.desc {{baseInfo.update_time}}

                    div.clearfix.item
                        div.title.char4
                            span 智能模板回调地址
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{baseInfo.auto_template_callback_url}}
                            input.input.input-md(type="text", v-model="params_new.auto_template_callback_url",v-else ) 

            div(v-if="indexData.userType == '2'")
                div.fl.base-left
                    div.clearfix.item
                        div.title.char
                            span 客户ID
                            | :
                        div.desc {{indexData.clientid}}
                    div.clearfix.item
                        div.title
                            span 客户名称
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{indexData.name}}
                            input.input.input-md(type="text", v-model="params.name",v-else ) 

                    div.clearfix.item
                        div.title
                            span 客户账户状态
                            | :
                        div.desc(v-if="indexData.status == 0") 注册未激活
                        div.desc(v-if="indexData.status == 1") 注册完成
                        div.desc(v-if="indexData.status == 5") 冻结
                        div.desc(v-if="indexData.status == 6") 注销
                        div.desc(v-if="indexData.status == 7") 锁定

                    div.clearfix.item
                        div.title
                            span 创建时间
                            | :
                        div.desc {{indexData.createtime}}
                    
                    div.clearfix.item
                        div.title.char4
                            span 认证状态
                            | :
                        div.desc(v-if="indexData.oauth_status == 2") 待认证
                        div.desc(v-if="indexData.oauth_status == 3") 已认证
                        div.desc(v-if="indexData.oauth_status == 4") 认证不通过
                    
                    div.clearfix.item.char4
                        div.title
                            span 认证时间
                            | :
                        div.desc {{indexData.oauth_date}}

                    div.clearfix.item.char4
                        div.title
                            span 手机
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{indexData.mobile}}
                            input.input.input-md(type="text", v-model="params.mobile",v-else )

                    div.clearfix.item.char4
                        div.title
                            span 邮件
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{indexData.email}}
                            input.input.input-md(type="text", v-model="params.email",v-else )

                    div.clearfix.item.char4
                        div.title
                            span 公司名称
                            | :
                        div.desc {{indexData.realname}}

                    div.clearfix.item.char4
                        div.title
                            span 公司地址
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{indexData.province + indexData.city + indexData.province + indexData.area + indexData.address}}
                            textarea.input.input-md(style="min-height: 100px;min-width: 300px;",type="text", v-model="params.address",v-else ) 

                    div.clearfix.item.char4.btnItem
                        a.btn.btn-md.btn-green.change(href="javascript:;", v-on:click="changeInfo", v-if="!ismodify") 修改资料
                        div.clearfix.btn-group(v-else)
                            a.btn.btn-green.btn-md(href="javascript:;", v-on:click="confirmChange").fl.mr10 确认修改
                            a.btn.btn-green-block.btn-md(href="javascript:;", v-on:click="cancle").fl 取消

                div.fl.base-right
                    div.clearfix.item
                        div.title.char4
                            span 代理商ID
                            | :
                        div.desc {{indexData.agent_id}}

                    div.clearfix.item
                        div.title.char4
                            span 是否需要状态报告
                            | :
                        div.desc(v-if="indexData.needreport == 0") 不需要
                        div.desc(v-if="indexData.needreport == 1") 需要简单状态报告
                        div.desc(v-if="indexData.needreport == 2") 需要透传状态报告
                        div.desc(v-if="indexData.needreport == 3") 用户来拉取状态报告

                    div.clearfix.item
                        div.title.char4
                            span 是否需要审核
                            | :
                        div.desc(v-if="indexData.needaudit == 0") 不需要
                        div.desc(v-if="indexData.needaudit == 1") 营销需要
                        div.desc(v-if="indexData.needaudit == 2") 全部需要
                        div.desc(v-if="indexData.needaudit == 3") 关键字审核
                    
                    div.clearfix.item
                        div.title.char4
                            span 上行
                            | :
                        div.desc(v-if="indexData.needmo == 0") 不需要
                        div.desc(v-if="indexData.needmo == 1") 需要
                        div.desc(v-if="indexData.needmo == 3") 用户拉取上行

                    div.clearfix.item
                        div.title.char4
                            span 白名单IP
                            | :
                        div.desc {{indexData.ip}}

                    div.clearfix.item
                        div.title.char4
                            span 状态报告回调地址
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{indexData.deliveryurl}}
                            input.input.input-md(type="text", v-model="params.deliveryurl",v-else ) 

                    div.clearfix.item
                        div.title.char4
                            span 上行回调地址
                            | :
                        div.desc 
                            span(v-if="!ismodify") {{indexData.mourl}}
                            input.input.input-md(type="text", v-model="params.mourl",v-else ) 

                    div.clearfix.item
                        div.title.char4
                            span 自扩展
                            | :
                        div.desc(v-if="indexData.needextend == 0") 不支持
                        div.desc(v-if="indexData.needextend == 1") 支持

                    div.clearfix.item
                        div.title.char4
                            span 备注
                            | :
                        div.desc {{indexData.remarks}}


</template>
<script src="./Base.controller.js"></script>
<style lang="scss">
.page-base-info {
    padding: 25px 30px;
    .item {
        margin-bottom: 20px;
        height:32px;
        .title {
            float: left;
            height:32px;
            line-height: 32px;
            text-align: right;
            padding-right: 20px;
        }
        .desc {
            width:230px;
            float: left;
            height:32px;
            line-height: 32px;
            
            .input-md{
                min-width:250px;
                padding: 5px 10px;
            }
        }
    }
    .btnItem{
        padding-left:50px;
        padding-top:100px;
    }
    .base-left {
        width:395px;
        .title {
            width: 150px;
        }
        .char {
            span {
                letter-spacing: 3px;
            }
        }
        .char4 {
            position: relative;
            left:1px;
            span {
                letter-spacing: 3px;
            }
        }
    }
    .base-right{
        width:600px;
        padding-left: 100px;
        .title{
            width:180px;
        }
        .char4{
            span{
                letter-spacing: 3px;
            }
        }
    }
}
</style>
