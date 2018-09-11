/**
 * Created by mokong on 18/02/23.
 */
//import STORAGE from './sessionstorage'
//import recrysuve from './recrysuve'
import defaultOption from '~/config/options'

const getNode = () => {
    var returnedItem;
}

//根据身份证获取用户信息
const getUserInfoCard = (UUserCard) => {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(UUserCard)) {
        let obj = { birth: '',sex: '', age: ''}
        //获取生日
        obj.birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
        //获取性别
        obj.sex = parseInt(UUserCard.substr(16, 1)) % 2 == 1 ? '1' : '0'
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        obj.age = age
        return obj
    }
}

/**
 * 获取上层级目标数据，现用于部门id模块
 * @param json 数据
 * @param nodeName 需要匹配的key
 * @param val 目标值
 * @param children 子集key
 * @param target  目标返回
 */
const getJsonParents = (json, nodeName, val, children, target) => {
    let result = '';
    let getList = (data) => {
        for (let i in data) {
            if (data[i][nodeName] === val) {
                result = data[i][target]
                break
            } else {
                if (data[i][children]) {
                    getList(data[i][children])
                }
            }
        }
        return result;
    }
    return getList(json)
}

// defaultOption
const getOptionsTypeVal = (type,val) =>{
    let result = ''
    let obj = defaultOption[type]
    for(let i in obj){
        if(obj[i]['value'] == val){
            result =  obj[i]['name']
        }
    }
    return result
}

const a = 1;


const isPlainObject = copy=>copy &&'object' == typeof copy && !(copy instanceof Array);
const merge = function(...args){
    var options, name, src, copy, copyIsArray, clone,
        target = args[ 0 ] || {},
        i = 1,
        length = args.length,
        deep = false;
    if ( typeof target === "boolean" ) {
        deep = target;
        target = args[ i ] || {};
        i++;
    }
    if ( typeof target !== "object" && 'function' != typeof target) {
        target = {};
    }
    if ( i === length ) {
        target = this;
        i--;
    }
    for ( ; i < length; i++ ) {
        if ( ( options = args[ i ] ) != null ) {
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                if ( target === copy ) {
                    continue;
                }
                if ( deep && copy && ( isPlainObject(copy) ||
                    ( copyIsArray = Array.isArray( copy ) ) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && Array.isArray( src ) ? src : [];
                    } else {
                        clone = src && isPlainObject( src ) ? src : {};
                    }
                    target[ name ] = merge( deep, clone, copy );
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }
    return target;
}

const regCapitalHandler = (regCapital,regCapitalTypeName='(万)美金')=>{
  regCapital+='';
  let arr = regCapital.split('.');
  let re = /(?=(?!\b)(\d{3})+$)/g;
  return arr[0].replace(re, ',')+(arr[1]?'.'+arr[1]:'')+regCapitalTypeName;
}

const utils = {
    merge: merge,
    //recrysuve: recrysuve,
    //STORAGE: STORAGE,
    getUserInfoCard: getUserInfoCard,
    getJsonParents: getJsonParents,
    getOptionsTypeVal: getOptionsTypeVal,
    a:a,
    regCapitalHandler:regCapitalHandler
}

export default utils
