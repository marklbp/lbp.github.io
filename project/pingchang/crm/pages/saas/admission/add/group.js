import defaultOption from '~/config/options'
export default {
	showGuarantorForm: false,
  showAccountForm: false,
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
                      ,placeholder: '所属资方'
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
             label: '集团编码'
              ,htmlFor: 'code'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'code'
                      ,disabled: true
                      ,placeholder: '集团编码'
                  }
              ]
          },
          {
             label: '集团名称'
              ,htmlFor: 'name'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'name'
                      ,disabled: true
                      ,placeholder: '集团名称'
                  }
              ]
          },
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
          }
      ]
      ,[
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
          },
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
      ]
      ,[
          {
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
          },
          {
             label: '纳税人类型'
              ,htmlFor: 'taxPayerTypeName'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'taxPayerTypeName'
                       ,disabled: true
                      ,placeholder: '注册资本'
                  }
              ]
          }

      ]
      ,[
          {
             label: '纳税人识别号'
              ,htmlFor: 'taxPayerCode'
              ,type: 'text'
              ,veeControl: true
              ,html: [
                  {
                      name: 'taxPayerCode'
                      ,disabled: true
                      ,placeholder: '纳税人识别号'
                  }
              ]
          }
          ,{
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
    ,fieldsDisabled: ['code','name','businessStartDate','businessEndDate','email','regCapital','taxPayerCode','taxPayerTypeName','nationality','address']
  }
  ,attachForm: {
    title: "附件"
    ,fields: ['formList']
  }
  ,steps:['baseForm', 'attachForm']
}
