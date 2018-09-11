import api from '@/api'
import parseAddress from '@/plugins/parseAddress';

export default function(fn, fun){
  let promise, arr;
  if(fn.indexOf(".") > -1,arr = fn.split("."),api[arr[0]][arr[1]])promise = api[arr[0]][arr[1]]({id: this.$route.params.id})
  else	promise = api[fn](this.$route.params.id)
  promise.then((res) => {
      if(res.error){
        return this.$message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000,
          onClose:()=>{
            this.$router.back();
          }
        })
      }

      let result = res.success || res.data;

      if('function' == typeof fun)result = fun(result)

      let pca = [];
      try{
          pca = parseAddress(result.province, result.city, result.area)
      }catch(e){
          pca.push("无效地址")
      }
      result.province = pca.join("") + result.address;
      result.fileUpLoads.forEach(ft=>ft.url = (ft.url||ft.fileUrl));

      let temp;
      for(let k in result){
      if((k + 'Name') in result && result.hasOwnProperty(k + 'Name')){
          temp = result[k];
          result[k] = result[k + 'Name'];
          result[k + 'Name'] = temp;
        } 
      }
      this.form = result;
      if(this.hasBindList&&typeof this.hasBindList ==='function'){
          this.hasBindList(result.id)
      }

    }).catch(err=>{this.$router.back()})
}