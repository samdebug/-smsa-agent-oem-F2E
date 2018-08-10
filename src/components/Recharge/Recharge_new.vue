<template lang="pug">
div.page-recharge
    .mask
        div.mask-ctx.result
            div.mask-header 给子账户 【{{id_name}}】 充值
                span.fa.fa-close(v-on:click="close")     

            .ctx
                .clearfix.mb10(v-if="indexData.paytype == '0'")
                    .title.fl 您的可用额度:
                    .desc.fl {{balanceOfAgent}} 元

                .clearfix.mb10
                    .title.fl 账户余额:
                    .desc.fl {{balance}} 元
                
                .clearfix.mb10
                    .title.fl 本次充值金额:
                    .desc.fl
                        input(type="text",v-model="params.recharge_amount").input
                        span.ml10 元
              
                .clearfix.mb10
                    .title.fl 
                    .desc.fl 
                        a(href="javascript:;",v-on:click="confirm").btn.btn-green.btn-md.confirm 确定
                        
</template>
<script src="./Recharge_new.controller.js"></script>
<style lang="scss" scoped>
.page-recharge{
    .mask-ctx{
        width:700px;
    }
    .ctx{
        padding:20px;
    }
    .title{
        width:200px;
        text-align: right;
        line-height: 36px;
        height:36px;
    }
    .desc{
        line-height: 36px;
        .input{
            width:255px;
            display: inline-block;
        }
        .input-sm{
            width:180px;
        }
        .confirm{
            width:270px;
        }
    }
}
</style>
