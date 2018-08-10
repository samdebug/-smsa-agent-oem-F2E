import { Utils } from '@/model/util';
let utils = new Utils();
export default {
    name: 'base',
    data() {
        return {
            loading: false,
            ismodify : false,
            baseInfo: {},
            account: {},
            params : {
                email : '',
                realName : '',
                mobile : '',
                name:'',
                address:'',
                deliveryurl:'',
                mourl:''
            },
            params_new : {
                agent_name : '',
                address : '',
                mobile : '',
                auto_template_callback_url:"",
            }
        }
    },
    mounted() {
        this.loading = true;
    },
    methods: {
        getBaseInfo() {
            utils.get('/admin/baseinfo').then(res => {
                this.loading = false;
                this.baseInfo = res.data;
            }, res => {
                this.$message.error(res.msg);
            })
        },
        changeInfo (){
            this.params.email = this.indexData.email;
            this.params.realName = this.indexData.realname;
            this.params.mobile = this.indexData.mobile;
            this.params.name = this.indexData.name;
            this.params.address = this.indexData.province + this.indexData.city + this.indexData.province + this.indexData.area + this.indexData.address;
            this.params.deliveryurl  = this.indexData.deliveryurl;
            this.params.mourl = this.indexData.mourl;
            this.ismodify = true;
        },
        changeInfo_new (){
            this.params_new.agent_name = this.baseInfo.agent_name;
            this.params_new.mobile = this.baseInfo.mobile;
            this.params_new.address = this.baseInfo.address;
            this.params_new.auto_template_callback_url = this.baseInfo.auto_template_callback_url;
            this.ismodify = true;
        },
        cancle_new (){
            this.params_new.mobile = "";
            this.params_new.address = "";
            this.params_new.agent_name = "";
            this.params_new.auto_template_callback_url = "";
            this.ismodify = false;
        },
        cancle (){
            this.params.email = "";
            this.params.realName = "";
            this.params.mobile = "";
            this.params.name = "";
            this.params.address = "";
            this.params.deliveryurl = "";
            this.params.mourl = "";
            this.ismodify = false;
        },
        confirmChange (){
            for(let k in this.params){
                if(this.params[k] === '' || this.params[k] === undefined || this.params[k] === null){
                    this.$message.error(`请完善输入内容之后再提交`);
                    return;
                }
            }
            if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.params.email)) { 
                this.$message.error("邮箱格式不正确");
                return false; 
            } 
            if (!/^[1][0-9][0-9]{9}$/.test(this.params.mobile)) { 
                this.$message.error("联系方式为正确的手机号码");
                return false; 
            }

            utils.post('/account/updateClient', this.params, { emulateJSON: false }).then(res => {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.$store.dispatch("getUserInfo");
                this.cancle();
            }, res => {
                this.$message.error(res.msg)
            })
        },
        confirmChange_new (){
            for(let k in this.params_new){
                if(this.params_new[k] === '' || this.params_new[k] === undefined || this.params_new[k] === null){
                    this.$message.error(`请完善输入内容之后再提交`);
                    return;
                }
            }
            if (!/^[1][0-9][0-9]{9}$/.test(this.params_new.mobile)) { 
                this.$message.error("联系方式为正确的手机号码");
                return false; 
            }

            utils.post('/admin/baseinfo/edit', this.params_new, { emulateJSON: true }).then(res => {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.$store.dispatch("getUserInfo");
                this.cancle();
            }, res => {
                this.$message.error(res.msg)
            })
        }
    },
    computed: {
        bill_data: function () {
            return this.$store.getters.bill_data;
        },
        indexData: function () {
            if (this.$store.getters.user.userType == "1"){
                this.getBaseInfo();
            }else{
                this.loading = false;
            }
            return this.$store.getters.user;
        }
    }
}
