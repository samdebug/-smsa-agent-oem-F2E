import {Utils} from '@/model/util';
let utils = new Utils();


export default {
    name : 'SelfSeviceLayout',
  
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