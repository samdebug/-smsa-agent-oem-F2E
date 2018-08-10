import { Utils } from '@/model/util';
let utils = new Utils();
export default {
    name: 'help',
    data() {
        return {}
    },
    mounted() {},
    methods: {},
    computed: {
        indexData: function () {
            return this.$store.getters.user;
        }
    }
}