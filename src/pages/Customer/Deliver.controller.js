import { Utils } from '@/model/util';
import { fail } from 'assert';
let utils = new Utils();
const TIME_COUNT = 3;

export default {
    name: 'test',
    data() {
        return {
            pickerOptions: {
                disabledDate: (time) => {
                    let min_time = new Date().getTime() + 1000 * 60 * 5;
                    let year = new Date().getFullYear() + 1;

                    let max_time = new Date(year + "-12-31" + " 23:59").getTime();
                    return time.getTime() < min_time || time.getTime() > max_time;
                }
            },
            params: {
                clientId: '',
                content: '',
                mobile: '',
                mobileContent:'',
            },
            cerinfo: {},
            form: {
                smsType: '10',
                templateType: '1',
            },
            uploader: null,
            fileInfo: {
                data: [{
                    name: '',
                    percent: '',
                    size: '',
                }],
                params: {
                    fileMd5: '',
                    jindutiao: 0,
                    fileName: '',
                },
                byte: "",
                state: 'pending',
                id: '',
                url: '',
                ext: '',
                uploadTip: "等待文件上传中...",
                loadingFile: false,
            },
            sendtime: {
                time: "",
                formatTime: ""
            },
            taskId: "",
            timeSend: '0',
            isUploadSuccess: false,
            isUploading: false,
            isFileResolve: false,
            options: [],
            list: [],
            clientId: "",
            sign: '',
            smstypes: [{
                value: '4',
                label: '验证码'
            }, {
                value: '0',
                label: '通知'
            }, {
                value: '5',
                label: '营销'
            }],
            hysmstypes: [{
                value: '4',
                label: '验证码'
            }, {
                value: '0',
                label: '通知'
            }],
            yxsmstypes: [{
                value: '5',
                label: '营销'
            }],
            importMode: 1,
            mobilecount: 0,
            fileMobile: {
                err_num: '0',
                submit_total: '0',
                repeat_num: '0',
                submitTotal: '0'
            },
            validNumNew:0,
            modalMode:0,
            mobile: {
                checkNum: 0,
                validNum: 0,
                filterNum: 0,
                validlist: "",
            },
            charge: {
                chargeNum: 0,
                smsNum: 0
            },
            showMask: false,
            isyx: false,
            ishy: false,
            istype: true,
            isShowSelect: false,
            isShowImport: false,
            isShowDownlaod: false,
            dialogVisible: false,
            timer: null,
            timeSendLoading:false,
            submit_flag: false,
            api: {
                uploadServerUrl: "",
                progressUrl: "",
                checkUrl: "",
                mergeUrl: "",
                delUrl: "",
                downloadUrl: ""
            },
            mmd5_loading:false,

            //新版本
            manualVisible:false,
            fileVisible:false,
            smsSubTypeCheckAll: true,
            smsSubTypeChecked: ["移动","联通","电信","国际"],
            smsSubType: [{smsType:"移动",num:0,telList:[]},{smsType:"联通",num:0,telList:[]},{smsType:"电信",num:0,telList:[]},{smsType:"国际",num:0,telList:[]}],
            isIndeterminate: false,
            hrefs:""
        }
    },
    mounted() {
        //this.getCerInfo();
        this.getUser();

        //初始化时间
        let init_date = new Date().getTime() + 1000 * 60 * 30;
        this.sendtime.time = init_date;

        let taskId = this.$route.query.id;
        this.taskId = taskId;
        if (taskId) {
            this.getSmsInfo(taskId);
        }
    },
    watch: {
        params: {
            handler: function (val, oldVal) {
                let num = this.getChargeNum(val);
            },
            deep: true
        },
        sign: function (val, oldVal) {
            let num = this.getChargeNum();
        },
    },
    methods: {
        accountChange(selVal){
            utils.post("/send/getsmstypes", { clientid: selVal }, { emulateJSON: true }).then(res => {
                let smstype = [];
                for (var i = 0; i < res.data.length; i++) {
                    smstype.push({value:res.data[i].value,label:res.data[i].label});
                }
                this.smstypes = smstype;
            }, res => {
                this.$message.error(res.msg);
            })
        },
        exportExcel() {
            if (this.isexport) {
                return;
            }
            this.isexport = true;
            utils.get("/send/downloadtemplate", {}).then(res => {
                this.isexport = false;
            }, res => {
                this.isexport = false;
                if (res.length > 0) {
                    utils.exportGet({}, "/send/downloadtemplate");
                } else {
                    this.$message.error("当前无法导出");
                }
            });
            this.goBack();
        },
        exportCsv() {
            if (this.isexport) {
                return;
            }
            this.isexport = true;
            utils.get("/send/downloadtemplateCSV", {}).then(res => {
                this.isexport = false;
            }, res => {
                this.isexport = false;
                if (res.length > 0) {
                    utils.exportGet({}, "/send/downloadtemplateCSV");
                } else {
                    this.$message.error("当前无法导出");
                }
            });
            this.goBack();
        },
        exportTxt() {
            if (this.isexport) {
                return;
            }
            this.isexport = true;
            utils.get("/send/downloadtemplateTXT", {}).then(res => {
                this.isexport = false;
            }, res => {
                this.isexport = false;
                if (res.length > 0) {
                    utils.exportGet({}, "/send/downloadtemplateTXT");
                } else {
                    this.$message.error("当前无法导出");
                }
            });
            this.goBack();
        },
        exportPhoneToExcel(){
            var that = this;
            if (this.mobile.validlist === ""){
                this.$message.error('无手动输入的号码');
                return false;
            }else{
                this.$message('将会导出手动输入的所有号码');
            }
            var jsonData = [];
            var mobileList = this.mobile.validlist.split(",");
            for (var i = 0; i < mobileList.length; i++) {
                jsonData.push({mobile:mobileList[i]})
            }
            //列标题
            var str = '';

            for(let i = 0 ; i < jsonData.length ; i++ ){
                str+='<tr>';
                for(let item in jsonData[i]){
                    str+=`<td x:str>${ jsonData[i][item] + '\t'}</td>`;     
                }
                str+='</tr>';
            }
            var worksheet = 'Sheet1'
            var uri = 'data:application/vnd.ms-excel;base64,';
            var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
            <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
              <x:Name>${worksheet}</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
              </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
              </head><body><table>${str}</table></body></html>`;

            document.getElementById("dlink").href = uri + that.base64(template);
            document.getElementById("dlink").download = "导出号码.xls";
            document.getElementById("dlink").click();
            //window.location.href = uri + that.base64(template);
        },
        clearMobileContent(){   
            this.$confirm('确认要清空所有号码吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.clearUploadFile();
                this.params.mobile = "";
                this.params.mobileContent = "";
                this.importMode = 0;
                this.getChargeNum();
                this.smsSubType = this.mobile.smsTypeCount
                this.validNumNew = this.mobile.validNum;
                this.modalMode = 0;
            }).catch(() => {       
            });   
        },
        base64(s){
            return window.btoa(unescape(encodeURIComponent(s)));
        },
        openManualModal() {
            this.importMode = 0;
            this.manualVisible = true;
        },
        openFileModal() {
            this.importMode = 1;
            if (this.api.uploadServerUrl === ""){
                this.getCerInfo();
            }
            this.fileVisible = true;
        },
        handleCheckAllChange(val) {
            this.smsSubTypeChecked = val ? ["移动","联通","电信","国际"] : [];
            this.isIndeterminate = false;
            //重新计算计费条数
            this.handleCheckedSmsTypeChange(this.smsSubTypeChecked);
        },
        handleCheckedSmsTypeChange(value) {
            //数据
            let newMobileList = [],
                newSubmitTotal = 0;
            for (var i = 0; i < this.smsSubType.length; i++) {
                for (var j = 0; j < value.length; j++) {
                    if (value[j] === this.smsSubType[i].smsType){
                        newMobileList = newMobileList.concat(this.smsSubType[i].telList);
                        newSubmitTotal = newSubmitTotal + this.smsSubType[i].num;
                    }
                }
            }

            if (this.modalMode === 0){
                this.params.mobileContent = newMobileList.join(",");
                this.params.mobile = newMobileList.join(",");
            }else{
                this.fileMobile.submitTotal = newSubmitTotal
            }
            //实时更新计费条数
            this.getChargeNum();

            //显示
            let checkedCount = value.length;
            this.smsSubTypeCheckAll = checkedCount === this.smsSubType.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.smsSubType.length;
        },
        manualConfirm(){
            this.modalMode = 0;
            this.validNumNew = this.mobile.validNum;
            var mobileRes = JSMS.getMobileInfo(this.params.mobileContent);
            this.params.mobile = mobileRes.validlist;
            this.smsSubType = mobileRes.smsTypeCount;
            //清空文件
            this.clearUploadFile();
            this.smsSubTypeChecked = ["移动","联通","电信","国际"];
            this.manualVisible = false;
        },
        fileConfirm(){
            this.modalMode = 1;
            this.fileVisible = false;
        },
        manualCancel(){
            //this.params.mobileContent = this.params.mobile;
            this.manualVisible = false;
        },
        getCerInfo() {
            utils.get("/admin/cer/info").then(res => {
                this.cerinfo = res.data;
                let img_url = res.data.smsp_img_url;
                // let img_url = "http://172.16.1.190:8080/;
                this.api.uploadServerUrl = img_url + "/chunks/file_save.html";
                this.api.progressUrl = img_url + "/chunks/progress.html";
                this.api.checkUrl = img_url + "/chunks/check.html";
                this.api.mergeUrl = img_url + "/chunks/merge.html";
                this.api.delUrl = img_url + "/chunks/del_chunks.html";
                this.api.downloadUrl = img_url + "/file/downloadFile.html";
                this.initWebUploader();
            }, res => {

            })
        },
        getSmsInfo(id) {
            utils.post("/send/edit", { uid: id }, { emulateJSON: true }).then(res => {
                this.params.content = res.data.content;
                this.params.smstype = res.data.smstype + "";
                this.sign = res.data.sign;
                this.timeSend = '1';
                this.params.clientId = res.data.clientid;
                this.editClientid = res.data.clientid;

                let fileType = res.data.fileType;
                if (fileType != 0) {
                    this.isUploadSuccess = true;
                    this.isFileResolve = true;
                    this.fileInfo.url = res.data.importFilePath;
                    this.fileInfo.ext = fileType;
                    this.fileInfo.params.fileName = res.data.fileName;
                    this.fileMobile.errNum = res.data.errNum;
                    this.fileMobile.repeatNum = res.data.repeatNum;
                    this.fileMobile.submitTotal = res.data.submitTotal;
                } else {
                    this.importMode = 0;
                    this.params.mobile = res.data.phoneStr;
                }
            }, res => {
                this.$message.error(res.msg);
            })
        },
        downloadUploadFile() {
            let turnForm = document.createElement("form");
            document.body.appendChild(turnForm);
            turnForm.method = 'get';
            turnForm.action = this.api.downloadUrl;
            //turnForm.target = '_blank';
            let params = {
                path: this.fileInfo.url
            };

            for (let k in params) {
                let newElement = document.createElement("input");
                newElement.setAttribute("name", k);
                newElement.setAttribute("type", "hidden");
                newElement.setAttribute("value", params[k]);
                turnForm.appendChild(newElement);
            }
            turnForm.submit();
        },
        initWebUploader() {
            let that = this;
            //注册事件
            WebUploader.Uploader.register({
                    "before-send-file": "beforeSendFile", //整个文件上传前
                    "before-send": "beforeSend", //每个分片上传前
                    "after-send-file": "afterSendFile", //分片上传完毕
                }, {
                    //时间点1：所有分块进行上传之前调用此函数
                    beforeSendFile: function (file) {
                    },
                    //时间点2：如果有分块上传，则每个分块上传之前调用此函数
                    beforeSend: function (block) {
                        var deferred = WebUploader.Deferred();
                        $.ajax({
                            type: "POST",
                            url: that.api.checkUrl, //ajax验证每一个分片
                            data: {
                                fileName: that.fileInfo.params.fileName,
                                progress: that.fileInfo.params.jindutiao,
                                fileMd5: that.fileInfo.params.fileMd5, //文件唯一标记
                                chunk: block.chunk, //当前分块下标
                                chunkSize: block.end - block.start, //当前分块大小
                                flag: that.cerinfo.agent_id
                            },
                            cache: false,
                            async: false, // 与js同步
                            timeout: 1000, //todo 超时的话，只能认为该分片未上传过
                            dataType: "json",
                            success: function (response) {
                                if (response.isExist) {
                                    //分块存在，跳过
                                    deferred.reject();
                                } else {
                                    //分块不存在或不完整，重新发送该分块内容
                                    deferred.resolve();
                                }
                            }
                        });
                        this.owner.options.formData.fileMd5 = that.fileInfo.params.fileMd5;
                        deferred.resolve();
                        return deferred.promise();
                    },
                    //时间点3：所有分块上传成功后调用此函数
                    afterSendFile: function () {
                        //如果分块上传成功，则通知后台合并分块
                        $.ajax({
                            type: "POST",
                            url: that.api.mergeUrl, //ajax将所有片段合并成整体
                            data: {
                                fileName: that.fileInfo.params.fileName,
                                fileMd5: that.fileInfo.params.fileMd5,
                                flag: that.cerinfo.agent_id
                            },
                            success: function (data) {
                                if (data != '' && data != undefined && data != null) {
                                    let res = JSON.parse(data);
                                    that.fileInfo.url = res.pathFileName;
                                    if (that.fileInfo.url) {
                                        that.resolveFile(); //解析文件
                                    }

                                }
                            }
                        });

                    }
                })
                //初始化
            let uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: false,

                // swf文件路径
                swf: '/static/upload/Uploader.swf',

                //表单name
                fileVal: "photoFile",
                formData: { flag: that.cerinfo.agent_id },
                chunked: true, //开启分片上传
                chunkSize: 1 * 1024 * 1024, // 如果要分片，分多大一片？默认大小为5M
                chunkRetry: 3, //如果某个分片由于网络问题出错，允许自动重传多少次
                threads: 3, //上传并发数。允许同时最大上传进程数[默认值：3]
                duplicate: true, //是否重复上传（同时选择多个一样的文件），true可以重复上传
                prepareNextFile: true, //上传当前分片时预处理下一分片
                server: that.api.uploadServerUrl, // 文件接收服务端
                fileSizeLimit: 2500 * 1024 * 1024, //250M 验证文件总大小是否超出限制, 超出则不允许加入队列
                fileSingleSizeLimit: 250 * 1024 * 1024, //250M 验证单个文件大小是否超出限制, 超出则不允许加入队列
                pick: {
                    id: '#filePicker', //这个id是你要点击上传文件按钮的外层div的id
                    multiple: false //是否可以批量上传，true可以同时选择多个文件
                },
                accept: [{
                    extensions: "txt,xlsx,xlsx,csv",
                    mimeTypes: '.txt,.xls,.xlsx,.csv'
                }]
            });

            //当有文件被添加进队列的时候（点击上传文件按钮，弹出文件选择框，选择完文件点击确定后触发的事件）
            uploader.on('fileQueued', function (file) {
                try{
                    //that.clearUploadFile();
                    if (that.uploader.getFiles().length > 1){
                        that.uploader.removeFile(that.uploader.getFiles()[that.uploader.getFiles().length - 2].id, true);
                    }
                }catch(err){
                    that.$message.error("尝试上传次数过多，请刷新后重试");
                }
               
                //限制单个文件的大小 超出了提示
                if (file.size > 250 * 1024 * 1024) {
                    that.$message.error("单个文件大小不能超过250M");
                    return false;
                }

                if (file.name.length > 30) {
                    that.$message.error("文件名称不能超过30个字符");
                    return false;
                }
                that.fileInfo.uploadTip = "等待文件上传中..."
                that.fileInfo.loadingFile = true;

                //执行上传
                
                //uploader.md5File(file, 0, 10 * 1024 * 1024)
                uploader.md5File(file)
                    // 及时显示进度
                    .progress(function (percentage) {
                        that.mmd5_loading = true;
                    }).then(function (val) {
                        that.mmd5_loading = false;
                        let ext = file.ext,
                            extStr = '';
                        if (ext == 'txt') {
                            extStr = 2
                        } else if (ext == 'csv') {
                            extStr = 3
                        } else if (ext == 'xls' || ext == 'xlsx') {
                            extStr = 1
                        }
                        that.isUploading = true;
                        that.fileInfo.ext = extStr;
                        that.fileInfo.data[0].name = file.name;
                        that.fileInfo.data[0].size = (file.size / 1024 / 1024).toFixed(2) + "M";
                        that.fileInfo.data[0].percent = 0;
                        that.fileInfo.params.fileMd5 = val;
                        that.fileInfo.id = file.id;
                        that.fileInfo.byte = file.size;
                        that.fileInfo.params.fileName = file.name; //为自定义参数文件名赋值
                        that.fileInfo.loadingFile = false;
                        $.ajax({
                            type: "POST",
                            url: that.api.progressUrl, //先检查该文件是否上传过，如果上传过，上传进度是多少
                            data: {
                                fileName: file.name, //文件名
                                flag: that.cerinfo.agent_id,
                                fileSize: file.size,
                                fileMd5: val
                            },
                            cache: false,
                            async: false, // 同步
                            dataType: "json",
                            success: function (data) {
                                var progress = data.progress;
                                var filePath = data.pathFileName;
                                if (progress == 100) {
                                    that.fileInfo.params.jindutiao = progress;
                                    that.fileInfo.data[0].percent = progress;

                                    that.fileInfo.url = filePath;
                                    that.isUploadSuccess = true; //显示结果
                                    that.resolveFile();
                                } else {

                                    uploader.upload(file.id);
                                }
                            }
                        });
                    });
            });
            //文件上传过程中创建进度条实时显示
            uploader.on('uploadProgress', function (file, percentage) {
                console.log(`percentage:${percentage}`);
                that.fileInfo.data[0].percent = (percentage * 100).toFixed(2);
                that.fileInfo.params.jindutiao = percentage;
                //根据fielId获得当前要上传的文件的进度
                // var oldJinduValue = map[file.id];

                // if (percentage < oldJinduValue && oldJinduValue != 1) {
                //     $li.find('p.state').text('上传中' + Math.round(oldJinduValue * 100) + '%');
                //     $percent.css('width', oldJinduValue * 100 + '%');
                // } else {
                //     $li.find('p.state').text('上传中' + Math.round(percentage * 100) + '%');
                //     $percent.css('width', percentage * 100 + '%');
                // }
            });
            //上传成功后执行的方法
            uploader.on('uploadSuccess', function (file) {


            });
            uploader.on("error", function (type) {
                if (type == "Q_TYPE_DENIED") {
                    that.$message.error("请上传txt,xls,xlxs,csv格式文件");
                } else if (type == "Q_EXCEED_SIZE_LIMIT") {
                    that.$message.error("文件大小不能超过250M");
                } else {
                    that.$message.error("上传出错！请检查后重新上传！错误代码");
                }
            });
            //上传出错后执行的方法
            uploader.on('uploadError', function (file) {
                // errorUpload = true;
                // $btn.text('开始上传');
                this.$message.error("上传出错，请检查网络连接");
                this.pauseUploadFile();
            });

            //文件上传成功失败都会走这个方法
            uploader.on('uploadComplete', function (file) {

            });

            uploader.on('all', function (type) {

                if (type === 'startUpload') {
                    that.fileInfo.state = 'uploading';
                } else if (type === 'stopUpload') {
                    that.fileInfo.state = 'paused';
                } else if (type === 'uploadFinished') {
                    that.fileInfo.state = 'done';
                }
            });

            that.uploader = uploader;
        },
        pauseUploadFile() {
            if (this.fileInfo.state == "uploading") {
                this.uploader.stop(true);
            }

        },
        startUploadFile() {
            let that = this;
            $.ajax({
                type: "POST",
                url: that.api.progressUrl, //先检查该文件是否上传过，如果上传过，上传进度是多少
                data: {
                    fileName: that.fileInfo.params.fileName, //文件名
                    flag: that.cerinfo.agent_id,
                    fileSize: that.fileInfo.byte,
                    fileMd5: that.fileInfo.params.fileMd5
                },
                cache: false,
                async: false, // 同步
                dataType: "json",
                success: function (data) {
                    if (data > 0 && data) {
                        that.fileInfo.params.jindutiao = data;
                        that.fileInfo.data[0].percent = data;

                    }
                    //执行上传
                    that.uploader.upload(that.fileInfo.id);
                }
            });
        },
        closeFileUpload() {
            let that = this;
            this.$confirm('此操作将取消该文件的上传, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    url: that.api.delUrl, //先检查该文件是否上传过，如果上传过，上传进度是多少
                    data: {
                        fileName: that.fileInfo.params.fileName, //文件名
                        flag: that.cerinfo.agent_id,
                        fileMd5: that.fileInfo.params.fileMd5,
                    },
                    cache: false,
                    async: false, // 同步
                    dataType: "json",
                    success: function (res) {
                        that.uploader.stop(true);
                        that.isUploading = false;
                        that.clearUploadFile();
                    }
                });
            }).catch(() => {

            });

        },
        delUploadFile() {
            let that = this;
            this.$confirm('此操作将取消该文件的上传, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    url: that.api.delUrl, //先检查该文件是否上传过，如果上传过，上传进度是多少
                    data: {
                        fileName: that.fileInfo.params.fileName, //文件名
                        flag: that.cerinfo.agent_id,
                        fileMd5: that.fileInfo.params.fileMd5
                    },
                    cache: false,
                    async: false, // 同步
                    dataType: "json",
                    success: function (res) {
                        if (res.isDeleted == 1) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.isUploading = false; //关闭弹窗
                            that.uploader.stop(true);
                            that.clearUploadFile();

                        } else {
                            that.$message.error('删除失败')
                        }
                    }
                });
            }).catch(() => {

            });


        },
        clearUploadFile() {
            if (this.isUploadSuccess === false){
                return
            }
            this.fileInfo.url = "";
            this.isUploadSuccess = false;
            this.isFileResolve = false;
            this.uploader.removeFile(this.fileInfo.id, true);

            //清除解析号码缓存
            this.fileMobile.submitTotal = "0";
            this.fileMobile.err_num = "0";
            this.fileMobile.err_num = "0";
            this.getChargeNum();
        },
        beforeClearUploadFile() {
            this.$confirm('确定删除导入号码?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.clearUploadFile();
            }).catch(() => {

            });
        },
        formatSmsType(countData){
            let mobileNum = countData.mobileNum || 0;
            let unicomNum = countData.unicomNum || 0;
            let telecomNum = countData.telecomNum || 0;
            let internationalPhoneNum = countData.internationalPhoneNum || 0;

            let mobileSet = countData.mobileSet || [];
            let unicomSet = countData.unicomSet || [];
            let telecomSet = countData.telecomSet || [];
            let internationalPhoneSet = countData.internationalPhoneSet || [];
            
            this.smsSubType = [
                {smsType:"移动",num:mobileNum,telList:mobileSet},
                {smsType:"联通",num:unicomNum,telList:unicomSet},
                {smsType:"电信",num:telecomNum,telList:telecomSet},
                {smsType:"国际",num:internationalPhoneNum,telList:internationalPhoneSet},
            ]
        },
        resolveFile() {
            this.fileInfo.uploadTip = "正在拼命解析文件..."
            this.fileInfo.loadingFile = true;
            utils.post("/send/parsefile", { filePath: this.fileInfo.url }, { emulateJSON: true }).then(res => {
                this.isFileResolve = true;
                this.fileMobile.submitTotal = res.data.submitTotal;
                this.fileMobile.errNum = res.data.errNum;
                this.fileMobile.repeatNum = res.data.repeatNum;

                this.fileInfo.loadingFile = false;
                this.isUploading = false; //关闭弹窗
                this.isUploadSuccess = true; //显示结果

                this.fileVisible = false;//关闭弹窗
                this.modalMode = 1;//显示收件人数量
                this.smsSubTypeChecked = ["移动","联通","电信","国际"];

                //运营商统计
                this.formatSmsType(res.data);
                this.getChargeNum();
            }, res => {
                let msg = res.msg || "文件解析超时";
                this.$message.error(msg);
                this.fileInfo.loadingFile = false;
                this.isUploading = false; //关闭弹窗
                this.isUploadSuccess = true; //显示结果

            }).catch(res => {
                this.$message.error("文件解析失败");
                this.fileInfo.loadingFile = false;
                this.isUploading = false; //关闭弹窗
                this.isUploadSuccess = true; //显示结果
            })
        },
        clearMobile() {
            let mobile = this.params.mobile;
            let result = JSMS.getMobileInfo(mobile);
            this.mobile = result;
            this.params.mobile = result.validlist;
        },
        changeSendTime(val) {
            this.sendtime.formatTime = val || '';
        },
        getmobileList(val) {
            this.params.mobile = val;
            this.mobilecount = val.split(',').length;
        },

        selectTemplate() {
            let _params = {};
            if (!this.params.clientId && this.indexData.userType == "1") {
                this.$message.error('请选择子账号');
                return;
            }
            this.isShowSelect = true;
            this.clientId = this.params.clientId;
        },
        exportReport() {
            if (this.isexport) {
                return;
            }
            this.isexport = true;
            utils.get("/send/downloadtemplate", {}).then(res => {
                this.isexport = false;
            }, res => {
                this.isexport = false;
                if (res.length > 0) {
                    utils.exportGet({}, "/send/downloadtemplate");
                } else {
                    this.$message.error("当前无法导出");
                }
            })
        },
        closeSelect() {
            this.isShowSelect = false;
        },
        closeDownload() {
            this.isShowDownlaod = false;
        },
        openDownload() {
            this.isShowDownlaod = true;
        },
        getTemplate(val) {
            if (val.smsType == '10') {
                this.ishy = true
                this.istype = false
                this.isyx = false
                //this.params.smstype = '';
            } else if (val.smsType == '11') {
                this.isyx = true
                this.istype = false
                this.ishy = false
                this.params.smstype = '5';
            }
            console.log(val,887);
            this.sign = val.sign;
            this.params.content = val.content;
            this.accountChange(this.params.clientId);
            this.isShowSelect = false;
        },
        getChargeNum(obj) {
            let params = obj || this.params;
            let mobileStr = params.mobileContent,
                content = params.content,
                sign = this.sign,
                importMode = this.importMode;
            let charge = 0,
                mobileArr = mobileStr.split(","),
                mobilecount = mobileArr.length;

            if (importMode == '1') {
                //等于1，上传文件
                var chargeRes = JSMS.getSmsChargeNum(mobileStr, sign, content);
                this.charge.smsNum = chargeRes.smsNum;
                this.charge.chargeNum = this.fileMobile.submitTotal * chargeRes.smsNum;
            } else {
                //不等于1，手动输入号码池
                var mobileRes = JSMS.getMobileInfo(mobileStr);
                this.mobile = mobileRes;
                var chargeRes = JSMS.getSmsChargeNum(mobileStr, sign, content);
                //收件人
                //this.validNumNew = mobileRes.validNum;
                this.charge = chargeRes;
            }
        },
        getUser() {
            let params = {};
            utils.post('/send/getclients').then(res => {
                let _options = [];
                for (var i = 0; i < res.data.length; i++) {
                    _options[i] = {};
                    _options[i].value = res.data[i].clientid;
                    _options[i].label = res.data[i].clientid + "-" + res.data[i].name;
                }
                this.options = _options
            }).catch(res => {

            })
        },
        close() {
            this.showMask = false
        },
        mobileFilter(){
            let totalMobile = [];
            if (this.smsSubTypeChecked.length){
                for (var i = 0; i < this.smsSubType.length; i++) {
                    for (var j = 0; j < this.smsSubTypeChecked.length; j++) {
                        if (this.smsSubTypeChecked[j] === this.smsSubType[i].smsType){
                            totalMobile = totalMobile.concat(this.smsSubType[i].telList);
                        }
                    }
                }
            }
            return totalMobile.join(",")
        },
        fileFilter(){
            let totalMobile = [];
            for (var i = 0; i < this.smsSubTypeChecked.length; i++) {
                if (this.smsSubTypeChecked[i] === "移动"){
                    totalMobile.push(1);
                }
                if (this.smsSubTypeChecked[i] === "联通"){
                    totalMobile.push(2);
                }
                if (this.smsSubTypeChecked[i] === "电信"){
                    totalMobile.push(3);
                }
                if (this.smsSubTypeChecked[i] === "国际"){
                    totalMobile.push(4);
                }
            }
            return totalMobile
        },
        sending() {
            let _params = {},
                importFilePath;
            this.clearMobile();
            
            if (this.params.smstype == "") {
                this.$message.error("短信类型不能为空");
                return;
            }
            if (this.sign.length > 12 || this.sign.length < 2) {
                this.$message.error("签名长度为2-12之间");
                return;
            }
            if (this.params.content.length == 0 && this.modalMode == 0) {
                this.$message.error("短信内容不能为空");
                return;
            }
            if (this.params.mobileContent.length == 0 && this.modalMode == 0) {
                this.$message.error("号码池不能为空");
                return;
            }
            if (this.modalMode == 0) {
                let mobileArr = this.params.mobile.split(",");
                /*for (let i = 0; i < mobileArr.length; i++) {
                    if (!/^(00\d{8,18})|(13\d{9})|(14[5|7|9]\d{8})|(15[0|1|2|3|5|6|7|8|9]\d{8})|(170[0|1|2|3|4|5|6|7|8|9]\d{7})|(17[1|5|6|7|8]\d{8})|(173\d{8})|(18\d{9})(?=,|$)$/.test(mobileArr[i])) {
                        this.$message.error("手机号码验证不正确");
                        return;
                    }
                }*/
            }
            //批量导入校验文件是否上传
            if (this.modalMode == 1 && this.fileInfo.url == "") {
                this.$message.error("请先上传号码");
                return;
            }
            //批量导入校验文件有效号码个数
            if (this.modalMode == 1 && this.fileMobile.submitTotal == 0) {
                this.$message.error("导入文件的有效号码个数为0");
                return;
            }
            _params.clientId = this.params.clientId;
            _params.content = "【" + this.sign + "】" + this.params.content;
            _params.smstype = this.params.smstype;
            if (this.modalMode == 0) {
                //手动输入模式
                _params.mobile = this.params.mobile;
                importFilePath = '';
            } else {
                //批量导入发送
                _params.mobile = '';
                importFilePath = this.fileInfo.url;
            }
            let sendParams = {};

            sendParams = this.params;

            //判断运营商
            if (this.modalMode === 0){
                sendParams.mobile = this.mobileFilter();
            }else{
                sendParams.operater = this.fileFilter();
            }

            if (this.modalMode == 1) {
                sendParams.fileType = this.fileInfo.ext;
            } else {
                sendParams.fileType = 0;
            }

            sendParams.importFilePath = importFilePath;
            sendParams.sign = this.sign;
            sendParams.chargeNum = this.charge.smsNum;


            if (this.submit_flag) {
                this.$message("不可重复提交");
                return;
            }
            if (this.timer) {
                this.$message("3秒内不可重复提交");
                return;
            }
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.submit_flag = true;
                if (this.timeSend == '1') {
                    this.timeSendHandle(sendParams, true);
                } else {
                    this.normalSendHandle(sendParams);
                }

                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                    } else {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000)
            }


        },
        normalSendHandle(sendParams) {
            utils.post("/send/sending", sendParams).then(res => {
                this.$message({
                    message: res.msg,
                    type: 'success'
                })
                if (this.modalMode == 1) {
                    this.clearUploadFile();
                }

                this.submit_flag = false;
                for (var k in this.params) {
                    this.params[k] = ''
                }
                this.sign = '';
                this.$router.push("/customer/deliverlayout/deliver/smstask");
            }, res => {
                this.submit_flag = false;
                this.$message.error(res.msg);
                clearInterval(this.timer);
                this.timer = null;
            })
        },
        timeSendHandle(sendParams, flag) {
            let params = {};

            params.clientId = sendParams.clientId;
            params.content = "【" + sendParams.sign + "】" + sendParams.content;
            params.fileType = sendParams.fileType;
            params.importFilePath = sendParams.importFilePath;
            params.mobilelist = sendParams.mobile;
            params.smstype = sendParams.smstype;


            params.sendtime = this.sendtime.formatTime;
            params.uid = this.taskId || "";
            params.chargeNum = this.charge.smsNum;
            params.isCheckAvailableCredit = flag;

            //选择运营商
            if (this.modalMode === 1){
                params.operater = sendParams.operater;
            }
            this.timeSendLoading = true;
            utils.post("/send/send_time_sms", params, { emulateJSON: false }).then(res => {
                this.timeSendLoading = false;
                this.$alert(res.msg, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.submit_flag = true;
                        this.$router.push("/customer/deliverlayout/deliver/timingdeliver");
                    }
                })
            }, res => {
                this.timeSendLoading = false;
                if (res.code == '403') {
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if (action != 'cancel') {
                                this.timeSendLoading = true;
                                this.timeSendHandle(sendParams, false);
                            }
                        }
                    })
                } else {
                    this.submit_flag = false;
                    this.$message.error(res.msg);
                    clearInterval(this.timer);
                    this.timer = null;
                }

            })
        }

    },
    computed: {
        cer_info: function () {
            return this.$store.getters.cer_info;
        },
        indexData: function () {
            let userData = this.$store.getters.user;
            if (userData.userType == "2"){
                this.accountChange(userData.clientid);
            }
            return this.$store.getters.user;
        }
    },
    components: {
        'selectTemplate': (resolve) => {
            require(['@/components/SelectTemplate/SelectTemplate.vue'], resolve)
        },
        'DownloadTemp': (resolve) => {
            require(['@/components/DownloadTemp/DownloadTemp.vue'], resolve)
        }
    },
}
