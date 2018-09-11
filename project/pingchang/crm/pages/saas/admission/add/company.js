export default {
	showGuarantorForm: true,
  showAccountForm: true,
  baseForm: {
    title: '基础信息'
    ,table: [
      [
          {
              label: '所属资方'
              ,type: 'select'
              ,htmlFor: 'lenderId'
              ,veeControl: true
              ,html: [
                 {
                      name: 'lenderId'
                      ,disabled: true
                      ,placeholder: '请选择'
                  }
              ]
          }
          ,{
             label: '合作开始日期'
              ,htmlFor: 'cooperativeStartDate'
              ,type: 'date'
              ,veeControl: true
              ,html: [
                  {
                      name: 'cooperativeStartDate'
                      ,placeholder: '担保起始日期'
                  }
              ]
          },
          {
             label: '合作结束日期'
              ,htmlFor: 'cooperativeEndDate'
              ,type: 'date'
              ,veeControl: true
              ,html: [
                  {
                      name: 'cooperativeEndDate'
                      ,placeholder: '担保结束日期'
                  }
              ]
          }
      ]
      ,[
          {
             label: '所属集团'
              ,htmlFor: 'parentName'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'parentName'
                      ,disabled: true
                      ,placeholder: '所属集团'
                  }
              ]
          },
          {
             label: '经销商编码'
              ,htmlFor: 'code'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'code'
                      ,disabled: true
                      ,placeholder: '经销商编码'
                  }
              ]
          },
          {
             label: '经销商名称'
              ,htmlFor: 'name'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'name'
                      ,disabled: true
                      ,placeholder: '经销商名称'
                  }
              ]
          },
      ]
      ,[
          {
             label: '证件类型'
              ,htmlFor: 'cardType'
              ,type: 'select'
              ,veeControl: true
              ,html: [
                  {
                      name: 'cardType'
                      ,placeholder: '证件类型'
                  }
              ]
          },
          {
             label: '证件号码'
              ,htmlFor: 'cardNo'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'cardNo'
                      ,placeholder: '证件号码'
                      ,attach: {
                        text: '查询',
                        type: 'button'
                      }
                  }
              ]
          },
          {
             label: '营业起始日期'
              ,htmlFor: 'businessStartDate'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'businessStartDate'
                       ,disabled: true
                      ,placeholder: '营业起始日期'
                  }
              ]
          }
        ]
      ,[
          {
             label: '营业到期日'
              ,htmlFor: 'businessEndDate'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'businessEndDate'
                       ,disabled: true
                      ,placeholder: '营业到期日'
                  }
              ]
          }
          ,{
             label: '电子邮件'
              ,htmlFor: 'email'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'email'
                       ,disabled: true
                      ,placeholder: '电子邮件'
                  }
              ]
          },
          {
             label: '注册资本'
              ,htmlFor: 'regCapital'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'regCapital'
                       ,disabled: true
                      ,placeholder: '注册资本'
                  }
              ]
          }
        ]
      ,[
          {
             label: '国籍'
              ,htmlFor: 'nationality'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'nationality'
                      ,disabled: true
                      ,placeholder: '国籍'
                  }
              ]
          }
          ,{
             label: '注册地址'
              ,htmlFor: 'address'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'address'
                      ,disabled: true
                      ,placeholder: '国籍'
                  }
              ]
          }
      ],
      [
          {
              prop: 'realName',
              label: '姓名'
          }
          ,{
              prop: 'typeName',
              label: '职位'
          }
          ,{
              prop: 'mobile',
              label: '手机号码'
          }
          ,{
              prop: 'email',
              label: '电子邮件'
          }
          ,{
              prop: 'remark',
              label: '备注'
          }
      ]
    ]
    ,fields: ['lenderId','cooperativeStartDate','cooperativeEndDate']
    ,fieldsDisabled: ['parentName','code','name','businessStartDate','businessEndDate','email','regCapital','nationality','address']
  }
  ,guarantorForm: {
    title: '担保信息'
    ,table: [
      [
        {
            label: '申请最高担保额'
            ,type: 'radio'
            ,veeControl: true
            ,htmlFor: 'applyMaxLimit'
            ,html: [
             {
                name: 'applyMaxLimit'
                ,html:[
                    {
                      name: 'applyMaxLimit'
                      ,label: 1
                      ,text: '是'
                    },
                    {
                      name: 'applyMaxLimit'
                      ,label: 0
                      ,text: '否'
                    }
                ]
              }
            ]
        }
      ]
      ,[
          {
             label: '协议担保额度/保证金'
              ,htmlFor: 'agreeLimit'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'agreeLimit'
                      ,placeholder: '协议担保额度/保证金'
                  }
              ]
              ,devs: ['applyMaxLimit']
            ,maxLength:18
          },
          {
             label: '担保起始日期'
              ,htmlFor: 'bondBegin'
              ,type: 'date'
              ,veeControl: true
              ,html: [
                  {
                      name: 'bondBegin'
                      ,placeholder: '担保起始日期'
                  }
              ]
              ,devs: ['applyMaxLimit']
          },
          {
             label: '担保结束日期'
              ,htmlFor: 'bondEnd'
              ,type: 'date'
              ,veeControl: true
              ,html: [
                  {
                      name: 'bondEnd'
                      ,placeholder: '担保结束日期'
                  }
              ]
              ,devs: ['applyMaxLimit']
          }
      ]
      ,[
          {
             label: '临时担保额度'
              ,htmlFor: 'tempAgreeLimit'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'tempAgreeLimit'
                      ,placeholder: '临时担保额度'
                  }
              ]
              ,devs: ['applyMaxLimit']
            ,maxLength:18
          },
          {
             label: '临时额度开始日期'
              ,htmlFor: 'tempLimitBegin'
              ,type: 'date'
              ,veeControl: true
              ,html: [
                  {
                      name: 'tempLimitBegin'
                      ,placeholder: '临时额度开始日期'
                  }
              ]
              ,devs: ['applyMaxLimit']
          },
          {
             label: '临时额度结束日期'
              ,htmlFor: 'tempLimitEnd'
              ,type: 'date'
              ,veeControl: true
              ,html: [
                  {
                      name: 'tempLimitEnd'
                      ,placeholder: '临时额度结束日期'
                  }
              ]
              ,devs: ['applyMaxLimit']
          }
      ]
      ,[
          {
              label: '是否需要经销商保证金'
              ,type: 'radio'
              ,veeControl: true
              ,htmlFor: 'bail'
              ,html: [
                 {
                      name: 'bail'
                      ,html:[
                          {

                              name: 'bail'
                              ,label: 1
                              ,text: '是'
                          },
                          {
                              name: 'bail'
                              ,label: 0
                              ,text: '否'
                          }
                      ]
                  }
              ]
          }
      ]
      ,[
          {
             label: '开户行'
              ,htmlFor: 'openBank'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'openBank'
                      ,placeholder: '开户行'
                  }
              ]
              ,devs: ['bail']
            ,maxLength:64
          },
          {
             label: '所属支行'
              ,htmlFor: 'branchBank'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'branchBank'
                      ,placeholder: '所属支行'
                  }
              ]
              ,devs: ['bail']
            ,maxLength:64
          },
          {
             label: '经销商保证金账号'
              ,htmlFor: 'bailNo'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'bailNo'
                      ,placeholder: '经销商保证金账号'
                  }
              ]
              ,devs: ['bail']
            ,maxLength:64
          }
      ]
      ,[
          {
             label: '户名'
              ,htmlFor: 'accountName'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'accountName'
                      ,placeholder: '户名'
                  }
              ]
              ,devs: ['bail']
            ,maxLength:64
          },
          {
             label: '保证金金额'
              ,htmlFor: 'bailAmount'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'bailAmount'
                      ,placeholder: '保证金金额'
                  }
              ]
              ,devs: ['bail']
            ,maxLength:18
          },
          {
             label: '担保占比'
              ,htmlFor: 'bondPercent'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'bondPercent'
                      ,placeholder: '担保占比'
                  }
              ]
              ,devs: ['bail']
            ,maxLength:10
          }
      ]
      ,[
        {
            label: '是否需要垫付'
            ,type: 'radio'
            ,veeControl: true
            ,htmlFor: 'advancePay'
            ,html: [
               {
                    name: 'advancePay'
                    ,html:[
                        {
                            name: 'advancePay'
                            ,label: 1
                            ,text: '是'
                        },
                        {
                            name: 'advancePay'
                            ,label: 0
                            ,text: '否'
                        }
                    ]
                }
            ]
        }
      ]
    ]
    ,fields: ['applyMaxLimit', 'agreeLimit', 'bondBegin',
              'bondEnd', 'tempAgreeLimit', 'tempLimitBegin',
              'tempLimitEnd', 'bail', 'openBank', 'branchBank',
              'bailNo', 'accountName', 'bailAmount',
              'bondPercent', 'advancePay']
    ,transform: (form)=>{
      if(form.applyMaxLimit == 0){
        delete form.agreeLimit;
        delete form.bondBegin;
        delete form.bondEnd;
        delete form.tempAgreeLimit;
        delete form.tempLimitBegin;
        delete form.tempLimitEnd;
      }
      if(form.bail == 0){
        delete form.openBank;
        delete form.branchBank;
        delete form.bailNo;
        delete form.accountName;
        delete form.bailAmount;
        delete form.bondPercent;
      }
    }
  }
  ,accountForm: {
    title: '账户信息'
    ,table: [
      {
          prop: 'accountType',
          label: '账户类型'
      }
      ,{
          prop: 'bankName',
          label: '开户银行'
      }
      ,{
          prop: 'branchBank',
          label: '所属支行'
      }
      ,{
          prop: 'accountName',
          label: '户名'
      }
      ,{
          prop: 'accountCode',
          label: '开户账号'
      }
    ]
    ,fields: ['accountInfoFormList']
  }
  ,attachForm: {
    title: "附件"
    ,fields: ['formList']
  }
  ,steps:['baseForm', 'guarantorForm', 'accountForm', 'attachForm']
}
