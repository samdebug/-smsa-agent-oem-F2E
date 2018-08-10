/**
 *
 * @authors caosiyuan (caosiyuan@ucpaas.com)
 * @date    2018-01-06 15:46:49
 * @version $Id$
 */


;
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // 使用AMD规范模式
        define(["JSMS"], factory);
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else {
        // 使用全局模式
        factory();
    }
}(function (undefined) {
    "use strict"
    var _global;

    // 工具类
    var isString = function (str) {
        return typeof str === 'string';
    }
    var isEmpty = function (str) {
        if (str === null || str === undefined || str === "") {
            return true;
        } else {
            return false;
        }
    }
    var normalize = function (arr) {
        if (arr && Array.isArray(arr)) {
            var i, len, map = {};
            for (i = arr.length; i >= 0; --i) {
                if (arr[i] in map) {
                    arr.splice(i, 1);
                } else {
                    map[arr[i]] = true;
                }
            }
        }
        return arr;
    }
    var getMobileArrTrueLenth = function (arr) {
        if (arr.length == 1 && isEmpty(arr[0])) {
            return 0;
        } else {
            return arr.length;
        }
    }

    function R() {
        this.ctx = {};
    }
    R.prototype.set = function (key, value) {
        this.ctx[key] = value;
    }
    R.prototype.ok = function () {
        return {
            code: 0,
            data: this.ctx,
            msg: '操作成功'
        }
    }
    R.prototype.res = function () {
        return this.ctx;
    }
    R.prototype.err = function (msg) {
        throw new Error(msg);
        return {
            code: 500,
            data: this.ctx,
            msg: msg
        }
    }
    var regMobileList = [/^00\d{8,20}$/, /^13\d{9}$/, /^14[5|7|9]\d{8}$/, /^15[0|1|2|3|5|6|7|8|9]\d{8}$/, /^170[0|1|2|3|4|5|6|7|8|9]\d{7}$/, /^17[1|5|6|7|8]\d{8}$/, /^173\d{8}$/, /^18\d{9}$/];
    var Validate = {
        isValidMobile: function (mobile) {
            for (var pos = 0; pos < regMobileList.length; pos++) {
                if (regMobileList[pos].test(mobile)) {
                    return true;
                }
            }
            return false;
        }
    }

    var isChinaMobile = /^(134|135|136|137|138|139|150|151|152|157|158|159|178|182|183|184|187|188|1703|1705|1706|198)[0-9]{8}$/; //移动
    var isChinaUnion = /^(130|131|132|145|155|156|171|175|176|185|186|1704|1707|1709|1708|166)[0-9]{8}$/; //联通
    var isChinaTelcom = /^(133|149|153|173|177|180|181|189|1700|1701|1702|1731|199)[0-9]{8}$/; // 电信      
    var isOtherTelphone = /^170([059])\\d{7}$/;//其他运营商

    var JSMS = {
        checkMobileType: function(telphone){
            if(telphone.length !== 11){
                return this.setReturnJson(false, '未检测到正确的手机号码');
            }else{
                if(isChinaMobile.test(telphone)){
                    return 0;
                }else if(isChinaUnion.test(telphone)){
                   return 1;
                }else if(isChinaTelcom.test(telphone)){
                   return 2;
                }else if(isOtherTelphone.test(telphone)){
                   var num = isOtherTelphone.exec(telphone);
                   return 3;
                }else{
                   return 4;
                }
            }
        },
        setReturnJson: function(telphoneList){
            var CM = [],
                CU = [],
                CT = [],
                OTHER = [];

            for (var i = 0; i < telphoneList.length; i++) {
                var smsType = this.checkMobileType(telphoneList[i]);
                if (smsType == 0){
                    CM.push(telphoneList[i]);
                }else if (smsType == 1){
                    CU.push(telphoneList[i]);
                }else if (smsType == 2){
                    CT.push(telphoneList[i]);
                }else{
                    OTHER.push(telphoneList[i]);
                }
            }
            return [
                {smsType:"移动",num:CM.length,telList:CM},
                {smsType:"联通",num:CU.length,telList:CU},
                {smsType:"电信",num:CT.length,telList:CT},
                {smsType:"国际",num:OTHER.length,telList:OTHER},
            ]
        },
        getValiMobile: function (mobile) {
            
            var r = new R();

            //新增中文逗号
            var mobilelist_ = mobile.split(/[,，]/),
                mobilelist_new = [],
                validlist_ = [],
                checkNum;

            for (var i = 0; i < mobilelist_.length; i++) {
                var item = mobilelist_[i];
                if (item !== ""){
                    mobilelist_new.push(item);
                    if (Validate.isValidMobile(item)){
                        validlist_.push(item);
                    }
                }
                /*if (Validate.isValidMobile(item)) {
                    validlist_.push(item);
                }*/
            }
            var validlist = normalize(validlist_);
            var smsType = this.setReturnJson(validlist);

            r.set('checkNum', getMobileArrTrueLenth(mobilelist_new)); // 所有号码个数
            r.set('validlist', validlist.join(",")); // 有效号码 string
            r.set('validNum', getMobileArrTrueLenth(validlist)); // 有效号码个数
            r.set('smsTypeCount', smsType); // 运营商统计
            return r.res();
        },
        getMobileInfo: function (mobile) {
            var r = new R();

            if (!isString(mobile) || isEmpty(mobile)) {
                var smsTypeCount = [{smsType:"移动",num:0,telList:[]},{smsType:"联通",num:0,telList:[]},{smsType:"电信",num:0,telList:[]},{smsType:"国际",num:0,telList:[]}];
                r.set('checkNum', 0); //所有号码个数
                r.set('validNum', 0); //有效号码个数
                r.set('validNumNew', 0); //有效号码个数
                r.set('filterNum', 0); //过滤条数
                r.set('validlist', ''); //有效号码 string
                r.set('smsTypeCount',smsTypeCount); //运营商统计
                return r.res();
            }
            var validMobile = this.getValiMobile(mobile);

            var checkNum = validMobile.checkNum,
                validNum = validMobile.validNum,
                filterNum = checkNum - validNum;

            r.set('checkNum', checkNum); //所有号码个数
            r.set('validNum', validNum); //有效号码个数
            r.set('filterNum', filterNum); //过滤条数
            r.set('validlist', validMobile.validlist); //有效号码 string
            r.set('smsTypeCount', validMobile.smsTypeCount); //运营商统计

            return r.res();

        },
        getSmsChargeNum: function (mobile, sign, cont) {
            var r = new R();
            var smsNum = 0,
                chargeNum;

            //签名两个括号占两个字符
            var letterLength = sign.length + cont.length;
            if (letterLength === 0 ){
                smsNum = 0;
            }else if(letterLength <= 70 && letterLength > 0 ) {
                smsNum = 1;
            }else {
                smsNum = Math.ceil((letterLength + 2) / 67);
            }

            var mobileLen = this.getValiMobile(mobile).validNum;
            chargeNum = parseInt(smsNum * mobileLen);
            r.set('smsNum', smsNum); //短信拆分条数
            r.set('chargeNum', chargeNum); //总计费条数

            return r.res();
        }
    }

    _global = (function () { return this || (0, eval)('this'); }());
    !('JSMS' in _global) && (_global.JSMS = JSMS);

    return JSMS;

}));
