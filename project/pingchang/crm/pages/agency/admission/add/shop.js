import defaultOpts from '~/config/options'
export default {
  showGuarantorForm: true,
  showAccountForm: true,
  showOuterForm: true,
  showContactForm: true,
  baseForm: {
      title: '基础信息'
      ,table: [
        [
            {
                label: '所属公司'
                ,type: 'select'
                ,htmlFor: 'parentId'
                ,veeControl: true
                ,html: [
                   {
                        name: 'parentId'
                        ,placeholder: '请选择'
                    }
                ]
                ,attach: ['lenderId']
            }
            ,{
               label: '所属资方'
                ,htmlFor: 'lenderId'
                ,type: 'select'
                ,veeControl: true
                ,html: [
                    {
                        name: 'lenderId'
                        //,disabled: true
                        ,readonly: true
                        ,placeholder: '请选择'
                    }
                ]
                ,attach: ['representUserId']
            },
            {
               label: '门店名称'
                ,htmlFor: 'name'
                ,type: 'text'
                ,veeControl: true
                ,html: [
                    {
                        name: 'name'
                        ,placeholder: '门店名称'
                    }
                ]
            }
        ]
        ,[
            {
               label: '门店面积'
                ,htmlFor: 'area'
                ,type: 'text'
                ,veeControl: true
                ,html: [
                    {
                        name: 'area'
                        ,placeholder: '门店面积'
                    }
                ]
            },
            {
               label: '所属城市'
                ,htmlFor: 'belongCity'
                ,type: 'text'
                ,veeControl: true
                ,html: [
                    {
                        name: 'belongCity'
                        ,placeholder: '所属城市'
                    }
                ]
            },
            {
               label: '车辆数量'
                ,htmlFor: 'carCount'
                ,type: 'text'
                ,veeControl: true
                ,html: [
                    {
                        name: 'carCount'
                        ,placeholder: '车辆数量'
                    }
                ]
            }
        ]
        ,[
            {
               label: '门店层级'
                ,htmlFor: 'hierarchy'
                ,type: 'select'
                ,veeControl: true
                ,html: [
                    {
                        name: 'hierarchy'
                        ,placeholder: '请选择'
                    }
                ]
            },
            {
               label: '业务类型'
                ,htmlFor: 'bussType'
                ,type: 'select'
                ,veeControl: true
                ,html: [
                    {
                        name: 'bussType'
                        ,placeholder: '请选择'
                    }
                ]
            },
            {
               label: '融资代表'
                ,htmlFor: 'representUserId'
                ,type: 'select'
                ,veeControl: true
                ,html: [
                    {
                        name: 'representUserId'
                        ,placeholder: '请选择'
                    }
                ]
            }
        ]
        ,[
            {
               label: '电子邮箱'
                ,htmlFor: 'email'
                ,type: 'text'
                ,veeControl: true
                ,html: [
                    {
                        name: 'email'
                        ,placeholder: '电子邮箱'
                    }
                ]
            },
            {
               label: '国籍'
                ,htmlFor: 'nationality'
                ,type: 'text'
                ,veeControl: true
                ,html: [
                    {
                        name: 'nationality'
                        ,placeholder: '国籍'
                    }
                ]
            }
        ]
        ,[
            {
              label: '经营地址-省市区'
              ,htmlFor: 'areaId'
              ,type: 'dispicker'
              ,veeControl: true
              ,html: [
                {
                  name: 'areaId'
                  ,placeholders: defaultOpts.placeholders
                }
              ]
            },
            {
              label: '详细地址'
              ,htmlFor: 'address'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                {
                  name: 'address'
                  ,placeholder: '详细地址'
                }
              ]
            }
        ]
      ]
      ,fields: ['parentId','lenderId',
                'name', 'area', 'belongCity', 'carAmount', 'hierarchy', 'bussType',
                'representUserId', 'email', 'nationality',
                'provinceId', 'cityId', 'areaId', 'address']
      ,hiddenContact: true
  },
  guarantorForm: {
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
    ]
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
    ,fields: ['applyMaxLimit', 'agreeLimit', 'bondBegin',
            'bondEnd', 'tempAgreeLimit', 'tempLimitBegin',
            'tempLimitEnd', 'bail', 'openBank', 'branchBank',
            'bailNo', 'accountName', 'bailAmount',
            'bondPercent']
  },
  outerForm: {
    title: '出账信息',
    table: [
      [
        {
            label: '出账等级'
            ,type: 'select'
            ,veeControl: true
            ,htmlFor: 'accountLevel'
            ,html: [
             {
                name: 'accountLevel'
                ,options: [
                  {name: '一级', value: "10"},
                  {name: '二级', value:"20"},
                  {name: '三级', value: "30"}
                ]
              }
            ]
        }
      ],
      [
        {
            label: '出账模式'
            ,type: 'radio'
            ,veeControl: true
            ,htmlFor: 'accountMode'
            ,html: [
             {
                name: 'accountMode'
                ,devs: ['accountLevel']
                ,html:[
                  {
                    name: 'accountMode',
                    "text": "抵押登记后放款",
                    "label": "10"
                  },
                  {
                    name: 'accountMode',
                    "text": "抵押登记后放款（凭收件收据）",
                    "label": "20"
                  },

                  {
                    name: 'accountMode',
                    "text": "收妥抵押资料放款",
                    "label": "30"
                  },
                  {
                    name: 'accountMode',
                    "text": "担保放款（凭担保协议/补充协议）",
                    "label": "40"
                  },
                  {
                    name: 'accountMode',
                    "text": "担保提前放款",
                    "label": "50"
                  },
                  {
                    name: 'accountMode',
                    "text": "收妥上牌资料放款",
                    "label": "60"
                  },
                  {
                    name: 'accountMode',
                    "text": "保证金放款",
                    "label": "70"
                  },
                  {
                    name: 'accountMode',
                    "text": "无担保放款",
                    "label": "80"
                  }
                ]
              }
            ]
        }
      ]
    ],
    fields: ['accountMode', 'accountLevel']
  },
  accountForm: {
      title: '账户信息'
      ,name: 'accountInfoFormList'
      ,model: 'form.accountForm.accountInfoFormList'
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
  },
  contactForm: {
      title: '联系人信息'
      ,name: 'contactsList'
      ,model: 'form.contactForm.contactsList'
      ,table: [
        {
            prop: 'realName',
            label: '姓名',
            type: 'text',
            rule: 'required'
        }
        ,{
            prop: 'type',
            label: '职位',
            type: 'select',
            rule: 'required'
        }
        ,{
            prop: 'mobile',
            label: '手机号码',
            type: 'text',
            rule: 'required|mobile'
        }
        ,{
            prop: 'email',
            label: '电子邮箱',
            type: 'text',
            rule: 'required|email'
        }
        ,{
            prop: 'remark',
            label: '备注',
            type: 'text'
        }
      ]
      ,contactTypes: defaultOpts.ContactType
  },
  attachForm: {
    title: '附件'
    ,fields: ['formList']
  },
  steps:['baseForm', 'guarantorForm', 'outerForm', 'accountForm', 'contactForm', 'attachForm']
}
