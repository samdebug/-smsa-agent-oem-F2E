<template lang="pug">
div.page-fallback
    .mask
        div.mask-ctx.result
            div.mask-header 回退子账户 【{{id_name}}】 的余额
                span.fa.fa-close(v-on:click="close")     

            .ctx
                .clearfix.mb10
                    .title.fl 子账户余额:
                    .desc.fl {{balance}} 元
                
                .clearfix.mb10
                    .title.fl 本次回退金额:
                    .desc.fl
                        input(type="text",v-model="params.amount").input
                        span.ml10 元
              
                .clearfix.mb10
                    .title.fl 
                    .desc.fl 
                        a(href="javascript:;",v-on:click="confirm").btn.btn-green.btn-md.confirm 确定
                        
</template>
<script src="./Fallback_new.controller.js"></script>
<style lang="scss" scoped>
.page-fallback{
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
