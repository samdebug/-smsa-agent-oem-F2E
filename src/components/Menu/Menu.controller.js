export default {
    name: "menu",
    methods: {
        openMenu(key, source) {
            let menu = this.menu;
            for (let k in menu) {
                if (k == key) {
                    // menu[k] = true;
                    if (menu[k] == false) {
                        menu[k] = true;
                    } else if (!source) {
                        menu[k] = false;
                    }
                } else {
                    menu[k] = false;
                }
            }

            //特殊处理基本信息
            if (key == "customer"){
                menu["account"] = true;
            }
        },
        routeOpera(key) {
            let keywords = this.keywords;
            for (let k in keywords) {
                if (k == key) {
                    keywords[k] = true;
                } else {
                    keywords[k] = false;
                }
            }
        }
    },
    watch: {
        '$route' (newVal, oldVal) {
            let keyword = newVal.name.split("_")[0];
            let keyword_ = oldVal.name.split("_")[0];
            if (keyword != keyword_) {
                this.openMenu(keyword, 'route')
            }

        }
    },
    mounted() {
        let route = this.$route;
        let keyword = route.name.split("_")[0];

        this.openMenu(keyword)
    },
    data() {
        return {
            menu: {
                sms: false,
                customer: false,
                account: false,
                finance: false,
                service: false,
                help:false
            },
            keywords: {
                sms: false,
                customer: false,
                account: false,
                finance: false,
                service: false,
                help:false
            },
            route: this.$route
        }
    },
    computed: {
        indexData: function () {
            return this.$store.getters.user;
        }
    }
}
