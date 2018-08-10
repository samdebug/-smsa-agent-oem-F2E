import {Utils} from '@/model/util';
let utils = new Utils();


export default {
    name : 'ReportLayout',
  
    mounted (){},
    data () {
        return {}
    },
    methods : {},
    computed: {
        indexData: function () {
            return this.$store.getters.user;
        }
    }
}