//crm 集团、经销商、公司 开户申请(pages/agency/account/add/_type)
import titleField from '~/components/common/title-field/title-field'
import setAdmin from '~/components/common/set-admin/set-admin'
import {Validator} from 'vee-validate'
import {API_SERVER, UPLOAD_SERVER, UPLOAD_IMGS} from '~/config/config'
import {mapState, mapActions} from 'vuex'
import defaultOption from '~/config/options'
import vDistpicker from '~/components/common/v-distpicker/v-distpicker'
import api from '@/api'
import dictionary from './dictionary';

export default {
  components: {
    titleField,
    setAdmin,
    vDistpicker
  },
  props: {
    initpage: {
      type: Object,
      default: {
        codeName: '',
        formName: '',
        formShortName: '',
        regCapitalName: '',
        regCapitalNameHolder: '',
        module: ''
      }
    },
    dictionary: Object
  },
  data() {
    let br = process.browser;
    let form = br && this.getAgencyFormTemp();
    let data = {
      setAdminRef: this.$route.params.code ? 'setAdminUpate' : 'setAdminAdd',
      isUpdate: this.$route.params.code ? true : false,
      pageTitle: this.$route.params.code ? '编辑' : this.parseBreadcrumb(),
      typeOption: defaultOption.select,
      placeholders: defaultOption.placeholders,
      formData: defaultOption.formData,
      addressValidate: '',
      uploadImgurl: UPLOAD_SERVER,
      uploadimgs: '',
      dialogImageUrl: '',
      dialogVisible: false,
      page: '',
      pageCode: '',
      onlyCheck: false,
      form: {
        code: '',
        name: form.name || '',
        shortName: form.shortName || '',
        type: '',
        cardType: form.cardType || '',
        cardNo: form.cardNo || '',
        businessStartDate: form.businessStartDate || '',
        businessEndDate: form.businessEndDate || '',
        cooperativeStartDate: '',
        cooperativeEndDate: '',
        email: form.email || '',
        regCapital: form.regCapital || '',
        legalPerson: '',
        province: form.province || '',
        city: form.city || '',
        area: form.area || '',
        address: form.address || '',
        contactsList: form.contactsList || [{
          utype: '',
          realName: '',
          mobile: '',
          email: '',
          remark: '',
          admin: false
        }],
        fileIds: form.fileIds || []
      },
      attachments: [],
      user: {
        userName: '',
        realName: ''
      }
    }
    if (this.initpage.module == "agency") {
      //delete data.form.code;
      delete data.form.type;
      delete data.form.cooperativeStartDate;
      delete data.form.cooperativeEndDate;
      delete data.form.legalPerson;

      Object.assign(data.form, {
        parentId: 0
        , agencyType: this.$store.state.select.agencyTypesNames[this.$route.params.type]
        , taxPayerType: ''
        , taxPayerCode: ''
        , nationality: form.nationality || ''
        , parentId: form.parentId || ''
      })
    }
    if (br) this.clearAgencyFormTemp()
    return data;
  },
  computed: {
    ...mapState({
      lender_type: state => state.select.lender_type,
      company_type: state => state.select.company_type,
      cardList: state => state.select.interview_Credentials_Type,
      companyList: state => state.select.company_Nature,
      contactType: state => state.select.contactType,
      loan_type: state => state.select.loan_type
      , taxerTypes: state => state.select.taxerTypes
      , groups: state => state.select.groups
      , agencyTypes: state => state.select.agencyTypes
      , agencyTypesNames: state => state.select.agencyTypesNames
      , taxPayerTypes: state => state.select.taxPayerTypes
    })
  },
  created() {
    this.dictionary.zh_CN.messages = Object.assign(dictionary.messages, this.dictionary.zh_CN.messages);
    this.dictionary.zh_CN.attributes = Object.assign(dictionary.attributes, this.dictionary.zh_CN.attributes);
    Validator.localize(this.dictionary);

    this.page = this.$route.query.page;
    let getType, getDetail;
    switch (this.initpage.module) {
      case 'lender':
        getType = 'getCompany_Nature';
        getDetail = 'getLenderDetail';
        break;
      case 'guarantor':
        getType = 'getInterview_Credentials_Type';
        getDetail = 'getGuarantorDetail';
        break;
      case 'sp':
        getType = 'getLoan_Type';
        getDetail = 'getSpDetail';
        break;
      default:
        getType = 'toString';
        getDetail = 'toString';
        break
    }

    if (this.isUpdate) {
      this.pageTitle = "编辑"
      if (api[getDetail]) api[getDetail](this.$route.params.code).then((res) => {
        if (!res.data) return false;
        let result = res.data;
        for (let k in result) {
          if ((k + 'Name') in result && result.hasOwnProperty(k + 'Name')) {
            result[k] = isNaN(Number(result[k])) ? result[k] : Number(result[k])
          }
        }
        this.form = result;
        this.attachments = result.fileUpLoads || this.attachments;
        this.form.fileIds = this.attachments.map(f => f.id);
        this.uploadimgs = this.form.fileIds;
        if (this.form.contactsList) this.form.contactsList.forEach((o,i) => {
          o.type = Number(o.type);
          o.index = i;
        })
        this.user = result.user || this.user;
      }).catch(err => this.$router.back())
    }
    this.getLender_Type()
    this.getContactType()
    this.addIndex()
    if (this.initpage.module != 'guarantor') this.getCompany_type();
    if (this[getType]) this[getType]();

    if ('agency' == this.initpage.module) {
      if ('agency' == this.$route.params.type) {
        this.$store.dispatch("getGroupsListByAgencyType")
      } else if ('group' == this.$route.params.type) {
        this.$store.dispatch('commonGetType', {
          type: 'TaxPayerType',
          mutation: 'SAVE_TAX_TYPE'
        }).then(res => res)
      }
    }
  },
  methods: {
    ...mapActions(['getLender_Type', 'getCompany_type', 'getContactType', 'getLoan_Type', 'getCompany_Nature', 'getInterview_Credentials_Type']),
    changeDate(endDate, startDate, str, typeStr) {
      //日期变化
      let endParse = Date.parse(endDate),
        startParse = Date.parse(startDate);
      if (endParse <= startParse) {
        typeStr === 'start' ? startParse = endParse - 24 * 60 * 60 * 1000 : endParse = startParse + 24 * 60 * 60 * 1000;
        endDate = new Date(endParse);
        startDate= new Date(startParse);
        this.form[str] = typeStr === 'start' ? startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+ startDate.getDate(): endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+ endDate.getDate();
        this.$message({type: 'warning', message: typeStr === 'start' ? '起始日要小于到期日!' : '到期日要大于起始日!'});
      }
    },
    changeSelect(data) {
      //三级联动校验赋值
      this.addressValidate = [parseInt(data.province.code), parseInt(data.city.code), parseInt(data.area.code)]
    },
    addIndex() {
      //添加index用作name动态
      if (!this.form.contactsList) return false
      this.form.contactsList.map(function (el, ind) {
        if (el.index) delete el.index;
        return el.index = ind
      })
    },
    addRow() {
      //新增一行
      if (!this.form.contactsList || this.form.contactsList.length < 0) this.form.contactsList = [];
      this.form.contactsList.push({
        type: '',
        realName: '',
        mobile: '',
        email: '',
        remark: '',
        admin: false
      })
      this.addIndex()
    },
    removeRow(data) {
      //删除行
      let index = data.$index,
        row = data.row;
      this.form.contactsList.splice(index, 1)
    },
    addAdmin(data) {
      //设置管理员
      let index = data.$index,
        row = data.row;
      this.onlyCheck = row.admin
    },
    searchAdmin() {
      this.$validator.validate("userName").then(ok => {
        if (!ok) return;
        api.getInfoByUserName(this.user.userName).then((res) => {
          let result = res.data;
          if (result) {
            this.user = result
            this.$message({
              message: '选择管理员成功',
              type: 'success'
            });
          } else {
            this.resetUser();
            this.showModal()
          }
        })
      })
    },
    resetUser() {
      this.user = {
        userName: this.user.userName
      }
    },
    handleRemove(file, fileList) {
      if (file) {
        let id = file.id
        this.form.fileIds.splice(this.form.fileIds.indexOf(id), 1);
        this.uploadimgs = this.form.fileIds
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    upbefore(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isImg) {
        this.$message.error('请上传有效图片')
        return false
      }
      if (parseInt(file.size) >= UPLOAD_IMGS.val) {
        this.$message.error('图片不能超过' + UPLOAD_IMGS.msg + ', 请重新上传!')
        return false
      }
    },
    uploadSuccess(response, file, fileList) {
      //上传成功
      let self = this,
        id = response.data.id;
      if (this.form.fileIds.indexOf(id) < 0) this.form.fileIds.push(id);
      this.uploadimgs = this.form.fileIds
    },
    upError(err) {
      this.$message.error('图片上传失败')
    },
    onSubmit() {

      this.$validator.validateAll().then((result) => {
        if (!result) {
          //if(this.errors.has)
          return;
        }

        let promise,
          url = '/' + this.initpage.module + '/list';
        if(this.$route.query.buttonId)url = url+'?buttonId=' + this.$route.query.buttonId;
        //if(this.initpage.module == 'agency')url = '/' + this.initpage.module + 'apply'
        if (this.addressValidate) {
          [this.form.province, this.form.city, this.form.area] = this.addressValidate
        }

        this.user.sex = parseInt(this.user.sex)
        this.user.status = parseInt(this.user.status)
        // this.form.user = this.user;

        let user = {
          userName:this.user.userName,
          realName:this.user.realName,
          idNumber:this.user.idNumber,
          sex:this.user.sex,
          birthday:this.user.birthday,
          email:this.user.email,
          status:this.user.status,
          remark:this.user.remark
        };

        this.form.user = user;

        if (this.isUpdate) {
          if (this.form && this.form.user) delete this.form.user;
        } else {
          for (let key in this.form.contactsList) {
            delete this.form.contactsList[key].index
          }
        }
        let spLenderGuarantorList,spLenderGuarantorListMenu,spLenderGuarantorListId;
        if(/lender|guarantor|sp/i.test(this.initpage.module)){
          spLenderGuarantorList = this.$store.state.menus.find(m=>this.$route.path.indexOf(m.value) == 0);
          spLenderGuarantorListMenu = spLenderGuarantorList && spLenderGuarantorList.menu && spLenderGuarantorList.menu.find(m=>m.value == '/'+this.initpage.module+'/list')
          spLenderGuarantorListId = spLenderGuarantorListMenu && spLenderGuarantorListMenu.id;
        }
        if ('lender' == this.initpage.module) {
          promise = this.$store.dispatch(this.isUpdate ? 'putLender' : 'postLenderAdd', this.form);
          url = "/lender/list?buttonId=" + spLenderGuarantorListId
        } else if ('guarantor' == this.initpage.module) {
          promise = api[this.isUpdate ? 'putGuarantor' : 'postGuarantor'](this.form);
          url = "/guarantor/list?buttonId=" + spLenderGuarantorListId;
        } else if ('sp' == this.initpage.module) {
          promise = api[this.isUpdate ? 'putSp' : 'postSp'](this.form);
          url = "/sp/list?buttonId=" + spLenderGuarantorListId;
        } else {
          url = '/' + this.initpage.module + '/account/list';
          if(this.$route.query.buttonId)url = url+'?buttonId=' + this.$route.query.buttonId;
          let form = this.handlePreAgencySubmit();
          promise = api['agency']['postAgencyData'](form)
        }

        promise.then(res => {
          if (res && res.error) return;
          this.$message({
            type: 'success',
            message: res && res.msg || (this.isUpdate ? '更新成功' : '新增成功'),
            duration: 3000,
            onClose: () => {
              if (!this.isUpdate) this.$store.commit('CLEAN_ADMIN_INFO', '');
              this.$router.push(url);
            }
          })
        }).catch(err => err)
      });
    },
    showModal() {
      this.$modal.show('set-admin-modal');
    },
    qr() {
      this.$refs.setAdminAdd.$validator.validateAll().then((result) => {
        if (!result) return
        this.$refs.setAdminAdd.$emit("setAdminEvt", this.$refs.setAdminAdd.user);
        this.hideModal()
      })
    },
    setAdmin(user) {
      this.user = user;
    },
    hideModal() {
      this.$modal.hide('set-admin-modal');
    }
    , renderDiffAgencyType(v) {
      let type = Object.keys(this.agencyTypesNames).find(n => this.agencyTypesNames[n] == v);
      this.getAgencyFormTemp(1);
      let path = this.$route.path;
      let query = this.$route.query;
      let q = '?';
      for (var k in query) {
        q += k + '=' + query[k] + '&'
      }
      q = q.substring(0, q.length - 1)
      location.href = path.substring(0, path.lastIndexOf("/") + 1) + type + q;
    }
    , getAgencyFormTemp(flag) {
      if (flag) {
        [this.form.province, this.form.city, this.form.area] = this.addressValidate;
        localStorage.setItem('agencyFormTemp', JSON.stringify(this.form));
      } else {
        return JSON.parse(localStorage.getItem('agencyFormTemp') || '{}')
      }
    }
    , clearAgencyFormTemp() {
      localStorage.removeItem('agencyFormTemp')
    }
    , parseBreadcrumb() {
      let type = this.$route.params.type;
      switch (type) {
        case 'group':
          return '集团开户';
          break;
        case 'agency':
          return '经销商开户';
          break;
        case 'company':
          return '公司开户'
          break;
        default:
          return '开户';
          break;
      }
    }
    , handlePreAgencySubmit() {
      let form = {
        agencyDetail: {},
        contactsList: [],
        user: {},
        fileIds: []
      };
      let keys = Object.keys(this.form);
      keys.forEach(k => {
        if (k == 'contactsList' || k == 'fileIds') {
          form[k] = [...this.form[k]];
          if (k == 'contactsList') {
            form[k] = form[k].map(c => {
              if (c.utype) c.type = c.utype;
              delete c.utype
              return c
            })
          }
        } else if (k == 'user') {
          form[k] = {...this.form[k]}
        } else {
          form.agencyDetail[k] = this.form[k]
        }
      })
      return form
    }
  }
}
