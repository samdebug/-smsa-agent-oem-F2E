<template lang="pug">
    div.deliver
        .col-5.item
            div.titleBox
                div.title(v-if="modalMode == 0") 收件人（{{validNumNew}}）
                div.title(v-if="modalMode == 1") 收件人（{{fileMobile.submitTotal}}）

                div(style="padding: 25px 0px 0px;text-align: center;")
                    a(href="javascript:;",v-on:click="openManualModal").btn.btn-md.btn-green.search-btn 手动输入
                    a(href="javascript:;",v-on:click="openFileModal").btn.btn-md.btn-green.search-btn 批量导入
                    a(href="javascript:;",v-on:click="exportPhoneToExcel").btn.btn-md.btn-green.search-btn 导出号码
                    a(href="javascript:;",v-on:click="clearMobileContent").btn.btn-md.btn-green.search-btn 清空号码

                    //空链接，用于导出excel
                    a(href="javascript:;",id="dlink",style="display:none")
                div.test-body.ml10(style="text-align: center;")
                    el-input.sms-textarea(
                        disabled,
                        type="textarea",
                        :rows="15",
                        placeholder="例如：18889462200,16656208020；以“,”号分隔",
                        v-model="params.mobile",v-show="modalMode == 0")
                    
                    div(v-show="modalMode == 1",style="padding-bottom: 50px;")
                        div(style="text-align:center;padding-bottom:20px")
                            img(src="./images/icon-excel.png",v-if="fileInfo.ext == 1")
                            img(src="./images/icon-txt.png",v-if="fileInfo.ext == 2")
                            img(src="./images/icon-csv.png",v-if="fileInfo.ext == 3")

                        a(href="javascript:;",v-on:click="downloadUploadFile",style="line-height: 32px;").link-green.underline.fl.mr10 {{fileInfo.params.fileName}} 
                            span (点击导出号码)
                        //a(href="javascript:;",v-on:click="beforeClearUploadFile").btn.btn-md.btn-green-block.fl.mr10 删除
                        p.zhushi.fl(v-show="isFileResolve") 共计号码数：
                            span.bt-green {{fileMobile.submitTotal + fileMobile.repeatNum + fileMobile.errNum}}
                            | 个，格式有效号码：
                            span.bt-green {{fileMobile.submitTotal}}
                            | 个，已过滤错误号码：
                            span.bt-green.bt-red {{fileMobile.errNum + fileMobile.repeatNum}}
                            | 个


                div.test-body.ml10
                    span.relative(style="margin-bottom:20px") 运营商
                    div(style="margin: 15px 0;")
                    el-checkbox(:indeterminate="isIndeterminate",v-model="smsSubTypeCheckAll",@change="handleCheckAllChange(smsSubTypeCheckAll)") 全选
                    div(style="margin: 15px 0;")
                    el-checkbox-group(v-model="smsSubTypeChecked",@change="handleCheckedSmsTypeChange")
                        el-col(:xs="12",:sm="12",:md="12",:lg="12",:xl="12",v-for="indexType in smsSubType")
                            el-checkbox(:label="indexType.smsType",:key="indexType.smsType") {{indexType.smsType}} ( {{indexType.num}} )


        .col-7.item
            div.titleBox
                div.title 发送消息
                div.test-body.ml10
                    .clientDow(v-if="indexData.userType == '1'")
                        span.bt-star *
                        span &nbsp;子&nbsp;&nbsp;账&nbsp;&nbsp;号:&nbsp;&nbsp;
                            el-select.border.sel(
                                            v-model="params.clientId",
                                            placeholder="可输入搜索",
                                            filterable,
                                            @change="accountChange"
                                         )
                                 el-option(
                                     v-for="item in options",
                                     :key="item.value"
                                     :label="item.label",
                                     :value="item.value"
                                 )
                    //.clearfix.relative
                    //    .fl
                    //        span.bt-star *
                    //        span 号&nbsp;&nbsp;码&nbsp;&nbsp;池:&nbsp;&nbsp;
                    //    .fl
                    //        div.mb10
                    //            el-radio-group(v-model="importMode")
                    //                el-radio(:label="1") 批量导入
                    //                el-radio(:label="0") 手动输入
                    //        div(v-show="importMode == 0")
                    //            div.clearfix
                    //                .fl
                    //                    el-input.sms-textarea(
                    //                        type="textarea",
                    //                        :rows="10",
                    //                        placeholder="例如：18889462200,16656208020；以“,”号分隔",
                    //                        v-model="params.mobile")
                    //                .fl.ml10(v-if="mobile.filterNum != 0")
                    //                    a(href="javascript:;",v-on:click="clearMobile").btn.btn-md.btn-green 清除无效号码
                    //            p.zhushi.mt10 支持批量输入和批量导入，批量输入以","号分隔，批量导入提供导入表模板下载。
                    //                span 共计号码
                    //                span.bt-green {{mobile.checkNum}}
                    //                span 个，格式有效号码：
                    //                span.bt-green {{mobile.validNum}}
                    //                | 个，格式无效号码：
                    //                span.bt-green.bt-red {{mobile.filterNum}}
                    //                | 个。
                    //        div(v-show="importMode == 1")
                    //            div.clearfix.fileResult(v-show="isUploadSuccess").mb20
                    //                a(href="javascript:;",v-on:click="downloadUploadFile").link-green.underline.fl.mr10 {{fileInfo.params.fileName}}
                    //                a(href="javascript:;",v-on:click="beforeClearUploadFile").btn.btn-md.btn-green-block.fl.mr10 删除
                    //                p.zhushi.fl(v-show="isFileResolve") 共计号码数：
                    //                    span.bt-green {{fileMobile.submitTotal + fileMobile.repeatNum + fileMobile.errNum}}
                    //                    | 个，格式有效号码：
                    //                    span.bt-green {{fileMobile.submitTotal}}
                    //                    | 个，已过滤错误号码：
                    //                    span.bt-green.bt-red {{fileMobile.errNum + fileMobile.repeatNum}}
                    //                    | 个
                    //            div.mb20.clearfix(v-show="!isUploadSuccess")
                    //                div#uploader-demo.fl
                    //                    div#fileList.uploader-list
                    //                    div#filePicker 批量导入手机号码
                    //                div.fl(style="line-height:33px;font-size:12px").ml10.link-red 请优先选择txt或csv模板
                    //            div.mb20
                    //                a(href="javascript:;" v-on:click="openDownload").btn.btn-md.btn-green 下载批量导入模板

                    .clearfix.mt10
                        span.fff **
                        span 选择模板：
                        a(href="javascript:;" v-on:click="selectTemplate").btn.btn-md.btn-green.search-btn 选择模板
                    .clearfix.mt10
                        span.bt-star *
                        span 短信类型：
                        el-select.border.sel.mb15(
                                        v-model="params.smstype",
                                        placeholder="请选择"
                                     )
                            el-option(
                                v-for="item in smstypes",
                                :key="item.value"
                                :label="item.label",
                                :value="item.value"
                            )
                        //el-select.border.sel.mb15(
                                        v-model="params.smstype",
                                        placeholder="请选择",
                                        v-if='ishy'
                                     )
                            el-option(
                                v-for="item in hysmstypes",
                                :key="item.value"
                                :label="item.label",
                                :value="item.value"
                            )
                        //el-select.border.sel.mb15(
                                        v-model="params.smstype",
                                        placeholder="请选择",
                                        v-if='isyx'
                                     )
                             el-option(
                                 v-for="item in yxsmstypes",
                                 :key="item.value"
                                 :label="item.label",
                                 :value="item.value"
                             )
                    .clearfix.mt10
                        span.bt-star *
                        span 短信签名：
                        el-input.border.sel(
                                v-model="sign",
                                placeholder="长度范围2-12个字符"
                            )
                        div(style="padding:10px 0px 10px 80px")
                            span.zhushi 例如：【云之讯】,签名长度范围2-12个字符，模板内容字符范围5-500字符
                    .clearfix
                        .fl
                            span.bt-star *
                            span.relative 短信内容：
                        .fl
                            el-input.sms-textarea(
                                     type="textarea",
                                     :rows="10",
                                     placeholder="不得超过500个字符",
                                     v-model="params.content")
                            div(style="font-size:12px;padding: 10px 0px;")
                                span 短信拆分条数:
                                    span.bt-green {{charge.smsNum}}
                                    | 条  ,    
                                span 总计费条数：
                                    span.bt-green {{charge.chargeNum}}
                                    span 条


                            //span.sign
                                span 【
                                span {{sign}}
                                span 】
                    .clearfix.mt10
                        span.bt-star *
                        span 发送时间：
                            el-radio(v-model="timeSend" ,label="0") 立即发送
                            el-radio(v-model="timeSend" ,label="1") 定时发送
                            el-date-picker.border.ml10(v-show="timeSend == 1",format="yyyy-MM-dd HH:mm:ss",v-model="sendtime.time",:editable="false", type="datetime", placeholder="请选择开始时间", align="right", @change="changeSendTime", :picker-options="pickerOptions")
                    

                selectTemplate(v-on:refresh="getTemplate", v-on:goBack="closeSelect",v-if="isShowSelect",:clientId="clientId")
                DownloadTemp(v-on:goBack="closeDownload",v-if="isShowDownlaod")
                div.mask(v-show="isUploading",:element-loading-text="fileInfo.uploadTip",element-loading-spinner="el-icon-loading",element-loading-background="rgba(0, 0, 0, 0.8)",v-loading="fileInfo.loadingFile")
                    div.mask-ctx.uploadProgress
                        div.mask-header 上传附件
                            span.fa.fa-close(v-on:click="closeFileUpload")
                        div.ctx()
                            el-table(:data="fileInfo.data", style="width:100%")
                                el-table-column(prop="name", label="文件名称", width="200")
                                    template(scope="scope")
                                        div.ellipsis {{scope.row.name}}
                                el-table-column(prop="size", label="文件大小")
                                el-table-column(prop="percent", label="进度/状态",width="180")
                                    template(scope="scope")
                                        div.p-10
                                            .progress
                                                span.percent {{scope.row.percent}} %
                                                .bar(v-bind:style="{width: scope.row.percent + '%' }")
                                el-table-column(label="操作")
                                    template(scope="scope")
                                        a(href="javascript:;",v-on:click="pauseUploadFile", v-if="fileInfo.state == 'uploading'") 暂停
                                        a(href="javascript:;",v-on:click="startUploadFile", v-if="fileInfo.state == 'paused'") 继续
                                        a(href="javascript:;",v-on:click="delUploadFile").ml20 取消

        div.mask(v-show="timeSendLoading",v-loading="timeSendLoading",element-loading-text="正在校验中")
        div(style="text-align:center")
            a(href="javascript:;" v-on:click="sending",:disabled="submit_flag").btn.btn-lg.btn-green.search-btn.ml80 短信发送

        //手动输入
        el-dialog(
          title="手动输入"
          :visible.sync="manualVisible"
          width="30%")
          div.clearfix
            div.head-tips
                span.ml10 注意：多个手机号码使用逗号(英文或中文)隔开。点击确定后将自动清除无效号码！
            div(style="margin: 15px 0;")
            el-input.sms-textarea(
                type="textarea",
                :rows="10",
                placeholder="例如：18889462200,16656208020；以“,”号分隔",
                v-model="params.mobileContent")
            //p.zhushi.mt10 支持批量输入和批量导入，批量输入以","号分隔，批量导入提供导入表模板下载。
            p.zhushi.mt10 
                span 共计号码
                span.bt-green {{mobile.checkNum}}
                span 个，格式有效号码：
                span.bt-green {{mobile.validNum}}
                | 个，格式无效号码：
                span.bt-green.bt-red {{mobile.filterNum}}
                | 个。
            //.ml10.clearButton(v-if="mobile.filterNum != 0")
               a(href="javascript:;",v-on:click="clearMobile").btn.btn-md.btn-green 清除无效号码

          span(slot="footer",class="dialog-footer")
            el-button(@click="manualCancel") 取消
            el-button(type="success",@click="manualConfirm") 确定


        //模板导入
        el-dialog(
          title="批量导入"
          v-loading="mmd5_loading"
          element-loading-text="加密中"
          :visible.sync="fileVisible")
            el-tabs(type="card")
              el-tab-pane(label="批量导入")
                div.mb20.clearfix
                    div#uploader-demo.fl
                        div#fileList.uploader-list
                        div#filePicker 批量导入手机号码
                    div.fl(style="line-height:33px;font-size:12px").ml10.link-red
              el-tab-pane(label="下载导入模板")
                div.mb20
                    .col-12.clearfix.downloadTemp        
                        .col-4.tx-c
                            img(src="./images/icon-csv.png")
                            div.downloadTempDiv
                                a(href="javascript:;",v-on:click="exportCsv").btn.btn-green.btn-sm 下载模板
                            div.link-red.btn-md.f-sm 推荐
                        .col-4.tx-c
                            img(src="./images/icon-txt.png")
                            div.downloadTempDiv
                                a(href="javascript:;",v-on:click="exportTxt").btn.btn-green.btn-sm 下载模板
                            div.link-red.btn-md.f-sm 推荐
                        .col-4.tx-c
                            img(src="./images/icon-excel.png")
                            div.downloadTempDiv
                                a(href="javascript:;",v-on:click="exportExcel").btn.btn-green.btn-sm 下载模板

            span(slot="footer",class="dialog-footer")
                el-button(@click="fileVisible = false") 取消
                //el-button(type="success",@click="fileConfirm") 确定

</template>
<script src="./Deliver.controller.js"></script>
<style lang="scss">
@import '../../assets/styles/config.scss';
.deliver{
    .downloadTemp{
        .downloadTempDiv{
            display:block;
            text-align:center;
            padding-top: 30px;
        }
    }
    .mask{
        z-index:999999;
    }
    .maskNew{
        z-index:2002 !important;
    }
    .webuploader-pick{
        padding:8px 12px;
    }
    .titleBox {
        border: 1px solid #2fb26a;
        margin: 20px;
        min-height: 700px;
        .title{
            background: #2fb26a;
            color: #fff;
            padding: 15px;
        }
        .search-btn{
            margin:0px 10px;
        }
    }
    .test-body{
        padding: 25px;
        font-size: 15px;
        .sel{
            width: 500px !important;
        }
        .clearfix{
            .sms-textarea{
                width: 500px !important;
                vertical-align:top;
            }
            .ml67{
                margin-left: 67px;
            }
        }

    }
    .clearButton{
        margin-top:10px;
    }
    .download{
        position: absolute;
        top: 60px;
        left: 765px;
    }
    .fileResult{
        line-height: 30px;
        .del{
            width:100px;
        }
    }
    .bt-green{
        color:#00c358;
        font-size: 18px;
        font-weight: 700;
    }
    .bt-red{
        color:#ef0000;
    }
    .zhushi{
        font-size:12px;
        color: #999999;
        font-size:12px;
        text-align: left;
    }
    /*.sign{
        position: absolute;
        left: 82px;
        top: 8px;
    }*/
    .uploadProgress{
        width:680px;
        .ctx{
            padding:20px;
            .progress{
                position: relative;
                text-align: center;
                line-height: 20px;
                height:20px;
                overflow: hidden;
                border-radius: 10px;
                border:1px solid $border-color;
                .percent{
                    position: relative;
                    z-index:10;
                    color:#ffffff;
                }
            }
            .bar{
                z-index:1;
                position: absolute;
                left:0;
                top:0;
                width:0%;
                height: 100%;
                transition: all .3s linear;
                border-radius: 10px;
                background-color: $btn-green;
            }
        }

    }
}
</style>

