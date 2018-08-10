import { Utils } from '@/model/util';
let utils = new Utils();

export default {
    props: {
        id: String,
        name: String,
        balance:Number,
        balanceOfAgent:Number,
    },
    data() {
        return {
            id_name:"",
            params: {
                clientid: '',
                recharge_amount: '',
            },
        }
    },
    mounted() {
        this.params.clientid = this.id;        
        this.id_name = this.id + "-" + this.name;
    },
    methods: {
        close() {
            this.$emit("close");
        },
        confirm() {
            if (!/^\d+(?:\.\d{1,2})?$/.test(this.params.recharge_amount)) {
                this.$message.error("金额只能为数字,最多保留两位小数,且不能为空");
                return;
            }

            utils.post("/recharge/rollback/rechargeOfZK", this.params).then(res => {
                this.close();
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
            }, res => {
                this.$message({
                    message: res.msg,
                    type: 'error'
                });
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
