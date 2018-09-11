const formData = [{
    type: 'input',
    label: '登录名',
    name: 'user.userName',
    data: '111',
    model: 'user.userName',
    scope: '5',
    disabled: true,
    defaultTip: '7'
},
    {
        type: 'input',
        label: '姓名',
        name: 'user.realName',
        data: '111',
        model: 'user.userName',
        scope: '5',
        disabled: true,
        defaultTip: '7'
    }, {
        type: 'input',
        label: '身份证号',
        name: 'user.idNumber',
        data: '111',
        model: '4',
        scope: '5',
        disabled: true,
        defaultTip: '7'
    }, {
        type: 'input',
        label: '性别',
        name: 'user.sex',
        data: '111',
        model: '4',
        scope: '5',
        disabled: true,
        defaultTip: '7'
    }, {
        type: 'input',
        label: '出生日期',
        name: 'user.birthday',
        data: '111',
        model: '4',
        scope: '5',
        disabled: true,
        defaultTip: '7'
    }, {
        type: 'date',
        label: '邮箱',
        name: 'user.email',
        className: '3',
        data: '111',
        model: '4',
        scope: '5',
        defaultTip: '7'
    }, {
        type: 'input',
        label: '部门',
        name: 'mbumen',
        data: '111',
        model: '4',
        scope: '5',
        disabled: true,
        defaultTip: '7'
    }, {
        type: 'input',
        label: '角色',
        name: 'muser',
        data: '系统管理员',
        model: '4',
        scope: '5',
        disabled: true,
        defaultTip: '7'
    }, {
        type: 'radio',
        label: '有效',
        name: 'user.status',
        className: '3',
        data: '111',
        model: 1,
        scope: '5',
        val: [{key: 1, val: '有效'}, {key: 0, val: '无效'}],
        defaultTip: '7'
    },
];

const select = [{
    value: 10,
    label: '银行'
}, {
    value: 20,
    label: '双皮奶'
}, {
    value: 30,
    label: '蚵仔煎'
}, {
    value: 40,
    label: '龙须面'
}, {
    value: 50,
    label: '北京烤鸭'
}]


const addselect = [{
    label: '江苏',
    cities: []
}, {
    label: '浙江',
    cities: []
}];

const tableData = [{
    date: '2016-05-03',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-02',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-04',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-01',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}];

const placeholders = {
    province: '请选择省',
    city: '请选择城市',
    area: '请选择区',
}

const orgType = [{
    value: 'COMPANY',
    label: '公司'
}, {
    value: 'DEPARTMENT',
    label: '部门'
}]

const phonevalidate = 11 && /^1[3|4|5|6|7|8|9]\d{9}$/

const Interview_Credentials_Type = [{
    "name": "身份证",
    "value": 10
},
    {
        "name": "户口簿",
        "value": 20
    },
    {
        "name": "中国护照",
        "value": 30
    },
    {
        "name": "士兵证",
        "value": 40
    },
    {
        "name": "港澳居民往来内地通行证",
        "value": 50
    },
    {
        "name": "台湾同胞往来内地通行证",
        "value": 60
    },
    {
        "name": "临时身份证",
        "value": 70
    },
    {
        "name": "外国人居留证",
        "value": 80
    },
    {
        "name": "警官证",
        "value": 90
    },
    {
        "name": "军人文职干部证",
        "value": 100
    },
    {
        "name": "武警士兵证",
        "value": 110
    },
    {
        "name": "武警文职干部证",
        "value": 120
    },
    {
        "name": "营业执照",
        "value": 130
    },
    {
        "name": "组织机构代码证",
        "value": 140
    },
    {
        "name": "其他个人证",
        "value": 150
    }
];


const Company_Nature = [
    {
        "name": "私营企业",
        "value": 10
    },
    {
        "name": "外资企业",
        "value": 20
    },
    {
        "name": "中外合资企业",
        "value": 30
    },
    {
        "name": "集体企业",
        "value": 40
    },
    {
        "name": "国家行政企业",
        "value": 50
    },
    {
        "name": "公私合作企业",
        "value": 60
    },
    {
        "name": "社会组织机构",
        "value": 70
    },
    {
        "name": "国际组织机构",
        "value": 80
    }
];

const ContactType = [{
    "name": "业务联系人",
    "value": 10
},
    {
        "name": "业务主管",
        "value": 20
    },
    {
        "name": "财务主管",
        "value": 30
    },
    {
        "name": "法人代表",
        "value": 40
    },
    {
        "name": "股东",
        "value": 50
    }
];

const Lender_Type = [{
    "name": "银行",
    "value": 10
},
    {
        "name": "金融机构",
        "value": 20
    },
    {
        "name": "第三方",
        "value": 30
    }
];
const Loan_Type = [{
    "name": "标准",
    "value": 10
},
    {
        "name": "车王",
        "value": 20
    },
    {
        "name": "4要素",
        "value": 30
    }
];
const company_type = [{
    "name": "营业执照",
    "value": 10
},
    {
        "name": "税务登记证",
        "value": 20
    },
    {
        "name": "组织机构代码证",
        "value": 30
    }
];
const recordStatus = [
    {name: '所有', value: -1},
    {name: '待提交', value: 0},
    {name: '待审查', value: 10},
    {name: '审查通过', value: 20},
    {name: '审查不通过', value: -20},
    {name: '审批通过', value: 30},
    {name: '审批不通过', value: -30}
]

const reviewEnterOptionType = [
    /*{
        name: '待审核',
        value: 10
    },*/
    {
        name: '审查通过',
        value: 20
    },
    {
        name: '审查不通过',
        value: -20
    }];
const approvalOptionType =
    [/*{
        name: '待审核',
        value: 20
    },*/
    {
        name: '审批通过',
        value: 30
    },
        {
            name: '审批不通过',
            value: -30
        }];

const checkEnterOption = [
    {
        name: '草稿',
        value: 0
    },
    {
        name: '待审查',
        value: 10
    },
    {
        name: '审查通过',
        value: 20
    },
    {
        name: '审查不通过',
        value: -20
    }, {
        name: '审批通过',
        value: 30
    },
    {
        name: '审批不通过',
        value: -30
    }];

const accountOption = [
  {
    name: "结算账户",
    value: "10"
  },
  {
    name: "内部账户",
    value: "20"
  },
  {
    name: "现金单",
    value: "30"
  },
  {
    name: "挂账单",
    value: "40"
  },
  {
    name: "借记卡",
    value: "50"
  },
  {
    name: "存折",
    value: "60"
  },
  {
    name: "保证金账户",
    value: "70"
  }
];


const defaultOption = {
    formData: formData,
    recordStatus: recordStatus,
    select: select,
    addselect: addselect,
    tableData: tableData,
    placeholders: placeholders,
    phonevalidate: phonevalidate,
    orgType: orgType,
    Interview_Credentials_Type: Interview_Credentials_Type,
    Company_Nature: Company_Nature,
    ContactType: ContactType,
    Lender_Type: Lender_Type,
    Loan_Type: Loan_Type,
    company_type: company_type,
    reviewEnterOptionType: reviewEnterOptionType,
    approvalOptionType: approvalOptionType,
    checkEnterOption: checkEnterOption,
    accountOption:accountOption
}

export default defaultOption
