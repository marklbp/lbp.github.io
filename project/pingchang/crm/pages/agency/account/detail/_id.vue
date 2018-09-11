<template>
<Detail :detail="detail" :apis="apis" />
</template>
<script>
  //开户列表的查看详情
import Detail from '@/components/common/agency/crm/agency-detail.vue'
export default {
  data(){
    let getBase =  this[this.$route.query.agencyType +'Base'];
    let base = getBase && getBase() || this.getDefaultBase();
    return {
      detail: [
        {
          title: '基本信息'
          ,module: 'base'
          ,...base
        }
        ,{
          title: '联系人信息'
          ,module: 'contact'
          ,content: [
            {prop: 'realName', label: '姓名'}
            ,{prop: 'typeName', label: '职位'}
            ,{prop: 'mobile', label: '手机号码'}
            ,{prop: 'email', label: '电子邮箱'}
            ,{prop: 'remark', label: '备注'}
          ]
          ,data: {
            type: 'array'
            ,name: 'contactsList'
          }
        }
        ,{
          title: '营业执照信息'
          ,module: 'files'
          ,content: [
            {prop: 'code', label: '姓名'}
            ,{prop: 'name', label: '职位'}
            ,{prop: 'status', label: '状态'}
            ,{prop: 'cooperativeStartDate', label: '合作开始日'}
            ,{prop: 'cooperativeEndDate', label: '合作结束日'}
          ]
          ,data: {
            type: 'array'
            ,name: 'filesList'
          }
        }
      ],
      apis: [
        {
          url: 'agency.getDetailById'
          ,params: {
            id: this.$route.params.id
          }
        }
      ]
    }
  }
  ,methods: {
    getDefaultBase(){
      return {
        content: {
          code: '机构编码'
          ,name: '机构名称'
          ,agencyTypeName: '类型'
          ,cardTypeName: '证件类型'
          ,cardNo: '证件号码'
          ,businessStartDate: '营业起始日'
          ,businessEndDate: '营业到期日'
          ,email: '电子邮件'
          ,regCapital: '注册资本'
          ,taxPayerTypeName: '纳税人类型'
          ,taxPayerCode: '纳税人识别号'
          ,nationality: '国籍'
          ,address: '注册地址'
        }
        ,data: {//api数据模拟
          type: 'object' //类型
          ,name: 'agencyDetail' // 获取对应的字段对象
          , fns: ['parseAddress','regCapitalHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          , fnArgs: [['address', 'province', 'city', 'area'],['regCapital', 'regCapitalTypeName']]//对应加工处理需传入的字段参数
        }
      }
    },
    groupBase(){
      return {
        content: {
          code: '机构编码'
          ,name: '机构名称'
          ,agencyTypeName: '类型'
          ,cardTypeName: '证件类型'
          ,cardNo: '证件号码'
          ,businessStartDate: '营业起始日'
          ,businessEndDate: '营业到期日'
          ,email: '电子邮件'
          ,regCapital: '注册资本'
          ,taxPayerTypeName: '纳税人类型'
          ,taxPayerCode: '纳税人识别号'
          ,nationality: '国籍'
          ,address: '注册地址'
        }
        ,data: {//api数据模拟
          type: 'object' //类型
          ,name: 'agencyDetail' // 获取对应的字段对象
          , fns: ['parseAddress','regCapitalHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          , fnArgs: [['address', 'province', 'city', 'area'],['regCapital', 'regCapitalTypeName']]//对应加工处理需传入的字段参数
        }
      }
    }
    ,agencyBase(){
      return {
        content: {
            code: '机构编码'
            ,name: '机构名称'
            ,parentName: '所属集团'
            ,agencyTypeName: '类型'
            ,cardTypeName: '证件类型'
            ,cardNo: '证件号码'
            ,businessStartDate: '营业起始日'
            ,businessEndDate: '营业到期日'
            ,email: '电子邮件'
            ,regCapital: '注册资本'
            ,nationality: '国籍'
            ,address: '注册地址'
          }
          ,data: {//api数据模拟
            type: 'object' //类型
            ,name: 'agencyDetail' // 获取对应的字段对象
          , fns: ['parseAddress','regCapitalHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          , fnArgs: [['address', 'province', 'city', 'area'],['regCapital', 'regCapitalTypeName']]//对应加工处理需传入的字段参数
          }
      }
    }
    ,companyBase(){
      return {
        content: {
            code: '机构编码'
            ,name: '机构名称'
            ,agencyTypeName: '类型'
            ,cardTypeName: '证件类型'
            ,cardNo: '证件号码'
            ,businessStartDate: '营业起始日'
            ,businessEndDate: '营业到期日'
            ,email: '电子邮件'
            ,regCapital: '注册资本'
            ,nationality: '国籍'
            ,address: '注册地址'
          }
          ,data: {//api数据模拟
            type: 'object' //类型
            ,name: 'agencyDetail' // 获取对应的字段对象
          , fns: ['parseAddress','regCapitalHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          , fnArgs: [['address', 'province', 'city', 'area'],['regCapital', 'regCapitalTypeName']]//对应加工处理需传入的字段参数
          }
      }
    }
  }
  ,components: {
    Detail
  }
}
</script>
