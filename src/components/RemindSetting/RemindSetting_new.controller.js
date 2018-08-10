import { Utils } from '@/model/util';
let utils = new Utils();

export default {
    name: "RemindSetting",
    props: ["id", "name"],
    data() {
        return {
            phone1: "",
            phone2: "",
            email1: "",
            email2: "",
            id_name: "",
            params: {
                clientid: '',
                alarmAmount: '',
            },
        }
    },
    mounted() {
        this.params.clientid = this.id;
        this.id_name = this.id + "-" + this.name;
        this.initData();
    },
    methods: {
        close() {
            this.$emit('close');
        },
        initData() {
            utils.post("/recharge/rollback/remindDateOfZK", { clientid: this.params.clientid }).then(res => {
                if (res.data.length > 0) {
                    let data = res.data[0];
                    this.params.alarmAmount = data.alarmAmount;
                    this.phone1 = data.alarmPhone.split(",")[0] || "";
                    this.phone2 = data.alarmPhone.split(",")[1] || "";
                    this.email1 = data.alarmEmail.split(",")[0] || "";
                    this.email2 = data.alarmEmail.split(",")[1] || "";
                }
            }, res => {

            })
        },
        confirm() {
            if (!/^\d+(?:\.\d{1,2})?$/.test(this.params.alarmAmount)) {
                this.$message.error("金额只能为数字,最多保留两位小数,且不能为空");
                return;
            }
            if ((!/^1\d{10}$/.test(this.phone1)) && this.phone1 !== "" && this.phone1 !== undefined) {
                this.$message.error("手机号码格式不正确");
                return;
            }
            if ((!/^1\d{10}$/.test(this.phone2)) && this.phone2 !== "" && this.phone2 !== undefined) {
                this.$message.error("手机号码格式不正确");
                return;
            }
            if ((!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email1)) && this.email1 !== "" && this.email1 !== undefined) {
                this.$message.error("邮箱格式不正确1");
                return;
            }
            if (!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email2)) && this.email2 !== "" && this.email2 !== undefined) {
                this.$message.error("邮箱格式不正确2");
                return;
            }
            if ((this.phone1 == "" || this.phone1 == undefined) && (this.phone2 == "" || this.phone2 == undefined)) {
                this.$message.error("至少填一个手机号码");
                return;
            }
            if ((this.email1 == "" || this.email1 == undefined) && (this.email2 == "" || this.email2 == undefined)) {
                this.$message.error("至少填一个邮箱信息");
                return;
            }
            if (this.email1 == "" || this.email1 == undefined) {
                this.params.alarmEmail = this.email2;
            } else if (this.email2 == "" || this.email2 == undefined) {
                this.params.alarmEmail = this.email1;
            } else {
                this.params.alarmEmail = this.email1 + "," + this.email2;
            }
            if (this.phone1 == "" || this.phone1 == undefined) {
                this.params.alarmPhone = this.phone2;
            } else if (this.phone2 == "" || this.phone2 == undefined) {
                this.params.alarmPhone = this.phone1;
            } else {
                this.params.alarmPhone = this.phone1 + "," + this.phone2;
            }


            utils.post("/recharge/rollback/remindSetOfZK", this.params).then(res => {
                this.close();
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
            }, res => {

            })
        }
    }
}
