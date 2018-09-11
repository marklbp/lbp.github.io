<template>
  <Edit :initpage="page" :dictionary="dictionary" />
</template>
<script>
  import Edit from '@/components/common/lender2guarantor2sp/edit.vue'
  export default {
    data(){
      return {
        page: {
          codeName:"SP编码",
          formName:"SP名称",
          formShortName:"SP简称",
          isSp:true,
          regCapitalName:"资产资本",
          regCapitalNameHolder:"资产资本（万元美金）",
          module: "sp"
        },
        dictionary: {
          zh_CN: {
            attributes: {
              name: 'sp名称',
              shortName: 'sp简称',
              regCapital: '资产资本（万元美金）',
              loanType: '进件类型'
            }
          }
        }
      }
    },
    components: {
      Edit
    }
  }
</script>