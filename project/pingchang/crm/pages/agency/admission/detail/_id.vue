<template>
  <Detail :detail="detail" :apis="apis"/>
</template>
<script>
  //集团、经销商、公司、门店、展厅 准入列表的详情 & 集团、公司、经销商的申请记录列表的详情
  import Detail from '@/components/common/agency/crm/agency-detail.vue'

  export default {
    data() {
      let getBase = this[this.$route.query.agencyType + 'Base'];
      let base = getBase && getBase() || this.getDefaultBase();

      let detailType = this.$route.query.detailType;
      base.content = detailType ? {
        lenderName: '所属资方',
        cooperativeStartDate: '合作起始日',
        cooperativeEndDate: '合作到期日',
        ...base.content
      } : base.content;

      let obj = {
        detail: [
          {
            title: '基本信息'
            , module: 'base'
            , data: {//api数据模拟
              type: 'object' //类型
              , name: 'agencyDetail' // 获取对应的字段对象
              , fns: ['parseAddress','regCapitalHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
              , fnArgs: [['address', 'province', 'city', 'area'],['regCapital', 'regCapitalTypeName']]//对应加工处理需传入的字段参数
            }
            , ...base
          }
          , {
            title: '联系人信息'
            , module: 'contact'
            , content: [
              {prop: 'realName', label: '姓名'}
              , {prop: 'typeName', label: '职位'}
              , {prop: 'mobile', label: '手机号码'}
              , {prop: 'email', label: '电子邮箱'}
              , {prop: 'remark', label: '备注'}
            ]
            , data: {
              type: 'array'
              , name: 'contactsList'
            }
          }
        ]
      };

      obj = this.handlerApis(obj);

      obj = this.handlerLeaderList(obj);

      obj = this.handlerGuarantorInfo(obj);

      obj = this.handlerOutAccountInfo(obj);

      obj = this.handlerAccountInfo(obj);

      obj = this.handlerFileList(obj);

      return obj;
    }
    , methods: {
      getDefaultBase() {
        return {
          content: {
            code: "集团编码",
            name: "集团名称",
            cardTypeName: "证件类型",
            cardNo: "证件号码",
            businessStartDate: "营业起始日",
            businessEndDate: "营业到期日",
            email: "电子邮件",
            regCapital: "资产资本",
            taxPayerTypeName: '纳税人类型',
            taxPayerCode: '纳税人识别号',
            nationality: '国籍',
            address: "注册地址"
          }
        }
      },
      groupBase() {
        return {
          content: {
            code: "集团编码",
            name: "集团名称",
            cardTypeName: "证件类型",
            cardNo: "证件号码",
            businessStartDate: "营业起始日",
            businessEndDate: "营业到期日",
            email: "电子邮件",
            regCapital: "资产资本",
            taxPayerTypeName: '纳税人类型',
            taxPayerCode: '纳税人识别号',
            nationality: '国籍',
            address: "注册地址"
          }
        }
      }
      , agencyBase() {
        return {
          content: {
            code: '经销商编码'
            , name: '经销商名称'
            , parentName: '所属集团'
            , agencyTypeName: '类型'
            , cardTypeName: '证件类型'
            , cardNo: '证件号码'
            , businessStartDate: '营业起始日'
            , businessEndDate: '营业到期日'
            , email: '电子邮件'
            , regCapital: '注册资本'
            , nationality: '国籍'
            , address: '注册地址'
          }
        }
      }
      , companyBase() {
        return {
          content: {
            code: '公司编码'
            , name: '公司名称'
            , agencyTypeName: '类型'
            , cardTypeName: '证件类型'
            , cardNo: '证件号码'
            , businessStartDate: '营业起始日'
            , businessEndDate: '营业到期日'
            , email: '电子邮件'
            , regCapital: '注册资本'
            , nationality: '国籍'
            , address: '注册地址'
          }
        }
      }
      , storeBase() {
        return {
          content: {
            parentName: '所属经销商'
            , groupName: '所属集团'
            , lenderName: '所属资方'
            , name: '展厅名称'
            , area: '展厅面积（平米）'
            , belongCity: '所属城市'
            , belongCarFactoryName: '所属车厂'
            , hierarchyName: '展厅层级'
            , bussTypeName: '业务类型'
            , representUserName: '融资代表'
            , email: '电子邮箱'
            , nationality: '国别'
            , address: '经营地址-省市区'
          },
          data: {//api数据模拟
            type: 'object' //类型
            , name: 'storeDetail' // 获取对应的字段对象
            , fns: ['parseAddress'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
            , fnArgs: [['address', 'provinceId', 'cityId', 'areaId']]//对应加工处理需传入的字段参数
          }
        }
      }
      , shopBase() {
        return {
          content: {
            parentName: '所属公司'
            , lenderName: '所属资方'
            , name: '门店名称'
            , area: '门店面积（平米）'
            , belongCity: '所属城市'
            , carCount: '车辆数量'
            , hierarchyName: '门店层级'
            , bussTypeName: '业务类型'
            , representUserName: '融资代表'
            , email: '电子邮箱'
            , nationality: '国别',
            address:"经营地址省市区"
          },
          data: {//api数据模拟
            type: 'object' //类型
            , name: 'storeDetail' // 获取对应的字段对象
            , fns: ['parseAddress'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
            , fnArgs: [['address', 'provinceId', 'cityId', 'areaId']]//对应加工处理需传入的字段参数
          }
        }
      }
      , handlerApis(obj) {
        obj.apis = this.$route.query.detailType ? [{
          url: 'agency.getRecordDetailId'
          , params: {
            agencyId: this.$route.params.id
          }
        }] : (this.$route.query.agencyType === 'shop' || this.$route.query.agencyType === 'store' ? [
          {
            url: 'agency.getStoreOrShopRegDetail'
            , params: {
              agencyId: this.$route.params.id
            }
          }
        ] : [
          {
            url: 'agency.getDetailBaseByAgencyId'
            , params: {
              agencyId: this.$route.params.id
            }
          }
        ]);
        return obj;
      }
      , handlerFileList(obj) {
        let filelist = {};
        let detailType = this.$route.query.detailType;
        filelist = detailType|| this.$route.query.agencyType === 'shop' || this.$route.query.agencyType === 'store'? {
          title: '影像信息'
          , module: 'file'
          , content: [{prop: 'typeName', label: '资料名称'}]
          , data: {
            type: 'array'
            , name: 'filesList'
          }
        } : {};
        filelist.title ? obj.detail.push(filelist) : null;
        return obj;
      },
      handlerLeaderList(obj) {
        let leaderlist = {};
        let detailType = this.$route.query.detailType;
        leaderlist = !detailType&&this.$route.query.agencyType !== 'shop' && this.$route.query.agencyType !== 'store' ? {
          title: '资方信息'
          , module: 'lender'
          , content: [
            {prop: 'lenderCode', label: '资方编码'}
            , {prop: 'lenderName', label: '资方名称'}
            , {prop: 'statusName', label: '状态'}
            , {prop: 'cooperativeStartDate', label: '合作开始日'}
            , {prop: 'cooperativeEndDate', label: '合作到期日'}
          ]
          , data: {
            type: 'array'
            , name: 'hasBindLenderList'
          }
        } : {};
        leaderlist.title ? obj.detail.push(leaderlist) : null;
        return obj;
      },
      handlerGuarantorInfo(obj) {
        let gaurantorInfo = {};
        let detailType = this.$route.query.detailType;
        let agencyType = this.$route.query.agencyType;
        if (detailType && (agencyType === 'agency' || agencyType === 'company')) {
          gaurantorInfo = {
            title: '担保信息'
            , module: 'guarantor'
            , content: {
              applyMaxLimit: '申请最高担保额',
              agreeLimit: '协议担保额度/保证金',
              bondBegin: '担保起始日期',
              bondEnd: '担保结束日期',
              tempAgreeLimit: '协议担保额度/保证金',
              tempLimitBegin: '担保起始日期',
              tempLimitEnd: '担保结束日期',
              bail: '临时担保额度',
              openBank: '开户行',
              branchBank: '所属支行',
              bailNo: '经销商保证金账号',
              accountName: '户名',
              bailAmount: "保证金额",
              bondPercent: "担保占比",
              advancePay: "是否需要垫付"
            }
            , data: {//api数据模拟
              type: 'object' //类型
              , name: 'guarantorInfo' // 获取对应的字段对象
              , fns: ['guarantorDataHandler', 'guarantorDataHandler', 'guarantorDataHandler','bondPercentHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
              , fnArgs: [['applyMaxLimit'], ['bail'], ['advancePay'],['bondPercent']]//对应加工处理需传入的字段参数
            }
          }
        } else if (this.$route.query.agencyType === 'shop' || this.$route.query.agencyType === 'store') {
          gaurantorInfo = {
            title: '担保信息'
            , module: 'guarantor'
            , content: {
              applyMaxLimit: '申请最高担保额',
              agreeLimit: '协议担保额度/保证金',
              bondBegin: '担保起始日期',
              bondEnd: '担保结束日期',
              tempAgreeLimit: '协议担保额度/保证金',
              tempLimitBegin: '担保起始日期',
              tempLimitEnd: '担保结束日期',
              bail: '临时担保额度',
              openBank: '开户行',
              branchBank: '所属支行',
              bailNo: '经销商保证金账号',
              accountName: '户名',
              bailAmount: "保证金额",
              bondPercent: "担保占比"
            }
            , data: {//api数据模拟
              type: 'object' //类型
              , name: 'guarantorInfo' // 获取对应的字段对象
              , fns: ['guarantorDataHandler', 'guarantorDataHandler','bondPercentHandler'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
              , fnArgs: [['applyMaxLimit'], ['bail'],['bondPercent']]//对应加工处理需传入的字段参数
            }
          }
        } else {
          gaurantorInfo = {};
        }
        gaurantorInfo.title ? obj.detail.push(gaurantorInfo) : null;
        return obj;
      },
      handlerAccountInfo(obj) {
        let accountlist = {};
        let detailType = this.$route.query.detailType;
        let agencyType = this.$route.query.agencyType;
        if(detailType && (agencyType === 'agency' || agencyType === 'company')){
          accountlist =  {
            title: '账户信息'
            , module: 'account'
            , content: [
              {prop: 'accountType', label: '账户类型'}
              , {prop: 'bankName', label: '开户银行'}
              , {prop: 'branchBank', label: '所属支行'}
              , {prop: 'accountName', label: '户名'}
              , {prop: 'accountCode', label: '开户账号'}
            ]
            , data: {
              type: 'array'
              , name: 'accountInfoList'
            }
          } ;
        }

        if (this.$route.query.agencyType === 'shop' || this.$route.query.agencyType === 'store') {
          accountlist = {
            title: '账户信息'
            , module: 'account'
            , content: {
              accountType: '账户类型',
              bankName: '开户银行',
              branchBank: '所属支行',
              accountName: '户名',
              accountCode: '开户账号'
            }
            , data: {//api数据模拟
              type: 'object' //类型
              , name: 'agencyAccountInfo' // 获取对应的字段对象
              , fns: [] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
              , fnArgs: []//对应加工处理需传入的字段参数
            }

          }
        }
        accountlist.title ? obj.detail.push(accountlist) : null;
        return obj;
      }
      ,handlerOutAccountInfo(obj){
        let accountlist = {};
        let detailType = this.$route.query.detailType;
        let agencyType = this.$route.query.agencyType;
        if (this.$route.query.agencyType === 'shop' || this.$route.query.agencyType === 'store') {
          accountlist = {
            title: '出账信息'
            , module: 'outaccount'
            , content: {
              accountLevelName: '出账等级',
              accountModelName: '出账模式'
            }
            , data: {//api数据模拟
              type: 'object' //类型
              , name: 'storeDetail2' // 获取对应的字段对象
              , fns: [] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
              , fnArgs: []//对应加工处理需传入的字段参数
            }

          }
        }

        accountlist.title ? obj.detail.push(accountlist) : null;
        return obj;
      }
    }
    , components: {
      Detail
    }
  }
</script>
