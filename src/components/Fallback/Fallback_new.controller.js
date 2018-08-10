import { Utils } from '@/model/util';
let utils = new Utils();

export default {
    props: {
        id: String,
        name: String,
        balance: Number,
    },
    data() {
        return {
            id_name:"",
            params: {
                amount: '',
            },
        }
    },
    mounted() {
        this.id_name = this.id + "-" + this.name;
    },
    methods: {
        close() {
            this.$emit("close");
        },
        confirm() {
            if (!/^[0-9]+$/.test(this.params.yzmAlarmNumber) || !/^[0-9]+$/.test(this.params.tzAlarmNumber) || !/^[0-9]+$/.test(this.params.yxAlarmNumber)) {
                this.$message.error("普通短信提醒阀值只能为整数,且不能为空");
                return;
            }
            if (!/^\d+(?:\.\d{1,2})?$/.test(this.params.gjAlarmAmount)) {
                this.$message.error("国际短信提醒阀值只能为数字,最多保留两位小数,且不能为空");
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
            console.log(this.email2)
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


            utils.post("/recharge/rollback/remindSet", this.params).then(res => {
                this.close();
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
            }, res => {

            })
        },
        goBack() {
            this.$emit("close");
            this.$emit("refresh", '1');
        }
    },
    computed: {
        indexData: function () {
            return this.$store.getters.user;
        }
    },
}
