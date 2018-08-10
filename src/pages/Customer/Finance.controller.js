import { Utils } from '@/model/util';
let utils = new Utils();

export default {
    name: 'customerFinance',
    data() {
        return {
            params: {
                customerInfo: ""
            },
            isexport: false,
            client_name: "",
            client_id: "",
            balance:"",
            sms_type: "",
            showSetting: false,
            showRecharge: false,
            showFallback: false,
            showSetting_new: false,
            showRecharge_new: false,
            showFallback_new: false,
            showExpiration: false,
        }
    },
    mounted() {
        this.getFinaceList("1");
    },
    methods: {
        exportReport() {
            if (this.isexport) {
                return;
            }
            this.isexport = true;
            let turnForm = document.createElement("form");
            document.body.appendChild(turnForm);
            turnForm.method = 'post';
            turnForm.action = '/api/recharge/rollback/recharge/export';
            //turnForm.target = '_blank';
            let params = this.params;
            let output = {
                customerInfo: params.customerInfo,
            }
            for (let k in output) {
                let newElement = document.createElement("input");
                newElement.setAttribute("name", k);
                newElement.setAttribute("type", "hidden");
                newElement.setAttribute("value", output[k]);
                turnForm.appendChild(newElement);
            }

            utils.post("/client/account/export", output, { emulateJSON: true }).then(res => {
                this.isexport = false;
            }, res => {
                this.isexport = false;
                if (res.length > 0) {
                    turnForm.submit();
                } else {
                    this.$message.error("当前条件没有数据，无法导出");
                }
            })
        },
        getFinaceList(val) {
            let params = this.params;
            params.currentPage = val;
            this.$store.commit("PARAMS", { params: params });
            this.$store.commit('LOAD_LIST', { loading: true });
            this.$store.dispatch("getFinaceList");
        },
        recharge(id, name) {
            this.client_id = id;
            this.client_name = name;
            this.showRecharge = true;
        },
        fallback(id, name) {
            this.client_id = id;
            this.client_name = name;
            this.showFallback = true;
        },
        remind(id, name) {
            this.client_id = id;
            this.client_name = name;
            this.showSetting = true;
        },
        recharge_new(id, name, balance, balanceOfAgent) {
            this.client_id = id;
            this.client_name = name;
            this.balance = balance;
            this.balanceOfAgent = balanceOfAgent;
            this.showRecharge_new = true;
        },
        fallback_new(id, name, balance) {
            this.client_id = id;
            this.client_name = name;
            this.balance = balance;
            this.showFallback_new = true;
        },
        remind_new(id, name) {
            this.client_id = id;
            this.client_name = name;
            this.showSetting_new = true;
        },
        getExpiration(id, type) {
            this.client_id = id;
            this.sms_type = type;
            this.showExpiration = true;
        },
        closeSetting() {
            this.showSetting = false;
        },
        closeRecharge() {
            this.showRecharge = false;
        },
        closeFallback() {
            this.showFallback = false;
        },
        closeSetting_new() {
            this.showSetting_new = false;
        },
        closeRecharge_new() {
            this.showRecharge_new = false;
        },
        closeFallback_new() {
            this.showFallback_new = false;
        },
        closeExpiration() {
            this.showExpiration = false;
        },
        handleCurrentChange(val) {
            this.getFinaceList(val);
        }
    },
    computed: {
        loading: function () {
            return this.$store.getters.load_list;
        },
        finace_list: function () {
            return this.$store.getters.finace_list;
        },
        indexData: function () {
            return this.$store.getters.user;
        }
    },
    components: {
        'RemindSetting': (resolve) => {
            require(['@/components/RemindSetting/RemindSetting.vue'], resolve)
        },
        'Fallback': (resolve) => {
            require(['@/components/Fallback/Fallback.vue'], resolve)
        },
        'Recharge': (resolve) => {
            require(['@/components/Recharge/Recharge.vue'], resolve)
        },
        'RemindSetting_new': (resolve) => {
            require(['@/components/RemindSetting/RemindSetting_new.vue'], resolve)
        },
        'Fallback_new': (resolve) => {
            require(['@/components/Fallback/Fallback_new.vue'], resolve)
        },
        'Recharge_new': (resolve) => {
            require(['@/components/Recharge/Recharge_new.vue'], resolve)
        },
        'Expiration': (resolve) => {
            require(['@/components/Expiration/Expiration.vue'], resolve)
        }
    },
}
