export var HEAD = {
  version: '1.0',
  'access-token': '',
  'user-token': ''
}

export var BASE_URL = '/api/'

export var BASE_URL_PRO = 'http://api.etrbd.com/api/'

export var API = {
  getAccessToken: {
    "name": "获取access_token",
    "method": "GET",
    "url": "5b149d496f1c5",
    "desc": "BuildToken/getAccessToken"
  },
  redirectUrl: {
    "name": "回调地址",
    "method": "GET",
    "url": "5be6c450a289d",
    "params": {
      "code": "",
      "state": ""
    },
    "desc": "BuildToken/oauth_redirect"
  },
  getUserToken: {
    "name": "获取用户UserToken",
    "method": "不限",
    "url": "5b25e319e44c0",
    "desc": "BuildToken/getUserToken"
  },
  getAds: {
    "name": "广告adplace",
    "method": "POST",
    "url": "5be6e097e4706",
    "params": {
      adplace: 1 //微信公众号顶部轮播图
    },
    "desc": "Ad/index"
  },
  getUserInfo: {
    "name": "获取用户信息",
    "method": "POST",
    "url": "5be6e587c4921",
    "desc": "User/get_user_info"
  },
  getCode: {
    "name": "发送验证码",
    "method": "POST",
    "url": "5be6e72986115",
    "params": {
      tel: '' //phone number
    },
    "desc": "User/send_sms"
  },
  getPhoneBind: {
    "name": "绑定手机",
    "method": "POST",
    "url": "5be6e748a6f07",
    "params": {
      tel: '', //phone number
      telcode: ''
    },
    "desc": "User/binding_tel"
  },
  updateAvatar: {
    "name": "修改用户头像接口",
    "method": "POST",
    "url": "5be6ea2f7479c",
    "params": {
      user_pic: null // file
    },
    "desc": "User/add_user_pic"
  },
  updateUserInfo: {
    "name": "个人信息保存",
    "method": "POST",
    "url": "5be6ec6ba4536",
    "params": {
      realname: '',
      wechat: '',
      company: '',
      position: ''
    },
    "desc": "User/user_info_save"
  },
  updatePublish: {
    "name": "发布信息保存",
    "method": "POST",
    "url": "5be6edea55814",
    "params": {
      deadline: '',
      hezuo_type: '',
      project_type: '',
      name: '',
      description: '',
      needed: '',
      supply: ''
    },
    "desc": "User/publish_save"
  },
  getProjectType: {
    "name": "获取项目类型",
    "method": "GET",
    "url": "5be6f2a07dd67",
    "desc": "User/project_type"
  },
  getCooperateType: {
    "name": "合作类型",
    "method": "GET",
    "url": "5be6f3068966c",
    "desc": "User/hezuo_type"
  }
}