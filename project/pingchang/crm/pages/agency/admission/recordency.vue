<template>
  <List :list="list"/>
</template>

<script>
  //集团、经销商、公司 申请列表
  import List from '@/components/common/agency/crm/agency-list.vue';
  import DefaultOpts from '~/config/options'
  export default {
    components: {
      List
    },
    data() {
      let agencyType = this.$route.query.agencyType;
      let list = this.genDataByType(agencyType);
      let admissionBaseId = this.$route.query.admissionBaseId;
      list.module = "recordency";
      list.isAcountModule = true;
      list.table.actions={
        detail: (item, agencyTypes)=>{
          let url = "/agency/admission/detail/" + item.id + '?agencyType=' + agencyType+"&detailType=recordDetail";
          if(!admissionBaseId)url += '&admissionBaseId='+item.id;
          this.$router.push(url);
        },
        edit: (item, agencyTypes)=>{
          let url = "/agency/admission/edit?agencyId=" + item.agencyId
            + '&agencyType=' + agencyType+"&lenderId="+item.lenderId+"&buttonId="+this.$route.query.buttonId
          +"&itemId="+item.id;
          if(!admissionBaseId)url += '&admissionBaseId='+item.id;
          this.$router.push(url);
        }
      };
      return {list};
    },
    methods: {
      genDataByType(agencyType) {
        let data = {}
        switch (agencyType) {
          case "group":
            data = this.genGroupData();
            break;
          case "agency":
            data = this.genAgencyData();
            break;
          case "company":
            data = this.genCompanyData();
            break;
          default:
            data = {};
            break;
        }
        return data;
      }
      , genGroupData() {
        return {
          params: {
            status: -1
            , queryDate: ''
            ,id: this.$route.query.agencyId
          }
          , search: [
            {
              type: 'select'
              , label: '状态'
              , name: 'status'
              , placeholder: '请选择'
              , options: DefaultOpts.recordStatus
            }
            , {
              type: 'date'
              , label: '申请日期'
              , name: 'queryDate'
              , placeholder: '申请日期'
            }
          ]
          , table: {
            url: 'agency.getAdmissionRecordList'
            , cols: [
              {
                prop: 'code'
                , label: '集团编码'
              }
              , {
                prop: 'name'
                , label: '集团名称'
              }
              , {
                prop: 'businessStartDate'
                , label: '营业起始日'
              }
              , {
                prop: 'businessEndDate'
                , label: '营业到期日'
              }
              , {
                prop: 'cooperativeStartDate'
                , label: '合作开始日'
              }
              , {
                prop: 'cooperativeEndDate'
                , label: '合作到期日'
              }
              , {
                prop: 'regCapital'
                , label: '注册资本'
              }
              , {
                prop: 'lenderName'
                , label: '所属资方'
              }
              , {
                prop: 'statusName'
                , label: '状态'
              }
              , {
                prop: 'createdAt'
                , label: '申请时间'
              }
              , {
                prop: 'createdUser'
                , label: '申请人'
              }
            ]
          }
        }
      }
      , genAgencyData() {
        return {
          params: {
            status: -1
            , queryDate: ''
            ,id: this.$route.query.agencyId
          }
          , search: [
            {
              type: 'select'
              , label: '状态'
              , name: 'status'
              , placeholder: '请选择'
              , options: DefaultOpts.recordStatus
            }
            , {
              type: 'date'
              , label: '申请日期'
              , name: 'queryDate'
              , placeholder: '申请时间'
            }
          ]
          , table: {
            url: 'agency.getAdmissionRecordList'
            , params: {
              id: this.$route.query.agencyId
            }
            , cols: [
              {
                prop: 'code'
                , label: '经销商编码'
              }
              , {
                prop: 'name'
                , label: '经销商名称'
              }
              , {
                prop: 'businessStartDate'
                , label: '营业起始日'
              }
              , {
                prop: 'businessEndDate'
                , label: '营业到期日'
              }
              , {
                prop: 'cooperativeStartDate'
                , label: '合作开始日'
              }
              , {
                prop: 'cooperativeEndDate'
                , label: '合作到期日'
              }
              , {
                prop: 'regCapital'
                , label: '注册资本'
              }
              , {
                prop: 'parentName'
                , label: '所属集团'
              }
              , {
                prop: 'lenderName'
                , label: '所属资方'
              }
              , {
                prop: 'statusName'
                , label: '状态'
              }
              , {
                prop: 'createdAt'
                , label: '申请时间'
              }
              , {
                prop: 'createdUser'
                , label: '申请人'
              }
            ]
          }
        }
      }
      , genCompanyData() {
        return {
          params: {
            status: -1
            , queryDate: ''
            ,id: this.$route.query.agencyId
          }
          , search: [
            {
              type: 'select'
              , label: '状态'
              , name: 'status'
              , placeholder: '请选择'
              , options: DefaultOpts.recordStatus
            }
            , {
              type: 'date'
              , label: '申请日期'
              , name: 'queryDate'
              , placeholder: '申请日期'
            }
          ]
          , table: {
            url: 'agency.getAdmissionRecordList'
            , params: {
              id: this.$route.query.id
            }
            , cols: [
              {
                prop: 'code'
                , label: '公司编码'
              }
              , {
                prop: 'name'
                , label: '公司名称'
              }
              , {
                prop: 'businessStartDate'
                , label: '营业起始日'
              }
              , {
                prop: 'businessEndDate'
                , label: '营业到期日'
              }
              , {
                prop: 'cooperativeStartDate'
                , label: '合作开始日'
              }
              , {
                prop: 'cooperativeEndDate'
                , label: '合作到期日'
              }
              , {
                prop: 'regCapital'
                , label: '注册资本'
              }
              , {
                prop: 'lenderName'
                , label: '所属资方'
              }
              , {
                prop: 'statusName'
                , label: '状态'
              }
              , {
                prop: 'createdAt'
                , label: '申请时间'
              }
              , {
                prop: 'createdUser'
                , label: '申请人'
              }
            ]
          }
        }
      }
    }
  }
</script>

<style>

</style>
