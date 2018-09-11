<template>
    <div>
        <titleField>
            <h1 slot='title' class="leg-text">{{title}}</h1>
            <div slot='con'>
                <el-form :inline="true" class="patb">
                    <el-form-item :label="item.name" v-for="(item,index) in searchForm" :key="index">
                        <el-input v-if="!item.formtype" v-model="params[`${item.key}`]" :placeholder="item.placeholder||item.name||''"></el-input>
                        <el-select v-if="item.formtype==='select'" v-model="params[`${item.key}`]" placeholder="请选择">
                            <el-option v-for="list in callbackList(item.selectOption)" :key="list.value" :label="list.name"
                                       :value="list.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getTableData">查询</el-button>
                        <el-button type="primary" @click="resetGetTableData">重置</el-button>
                    </el-form-item>
                </el-form>
                <elTablePage :fit="true" :params="params"
                             :url="table.url" ref="tablePagination">
                    <el-table-column v-for="(item,index) in tableSource" :key="index"  :label="item.name">
                        <template slot-scope="scope" >
                            <p v-if="index!=='applier'">{{!item.custom?scope['row'][index]:eventBus1(`_${index}_fn`,scope)}}</p>
                            <el-button v-if="index==='applier'" @click="eventBus(item.value,scope.row)" type="text"
                                       size="small">{{otherList.trackName}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button v-for="(item,index) in menuBtnsList.tabButtonList" :key="index"
                                       @click="eventBus(item.value,scope.row)" type="text"
                                       size="small">{{item.name}}
                            </el-button>
                        </template>
                    </el-table-column>
                </elTablePage>
            </div>
        </titleField>
    </div>
</template>

<script>
    /**
     * 模板引擎采用渲染
     * 格式为：code:{name:'用户名',custom:true}
     * custom为是否开启自定义模板，默认关闭则用 'code'
     * 如果开启自定义则需要对应方法，格式为：_'code'_fn 来操作
     */
    // import {titleField, elTablePage} from '~/components/common'
    import titleField from '~/components/common/title-field/title-field'
    import elTablePage from '@/components/common/table-pagination/table-pagination'
    import {mapState} from 'vuex';
    import defaultOption from '~/config/options'


    export default {
        props: {
            searchForm: {
                type: Object,
                default: () => ({
                    labelCode: '申请编号',
                    labelName: '名称',
                    labelType: '状态',
                    showType: true
                })
            },
            table: {
                type: Object,
                default: () => ({
                    module: '',
                    url: '',
                    params: {}
                })
            },
            tableSource: {
                type: Object,
                default: () => ({

                })
            },
            detailurl: String,
            urltype: String,
            detail : Function,
            otherList: Object,
            title:{
                type: String,
                default:() => ('综合查询')
            }
        }
        ,
        data() {
            return {
                reviewEnterOptionType: defaultOption.reviewEnterOptionType,
                approvalOptionType: defaultOption.approvalOptionType,
                params: {
                    ...this.table.params
                },
            }
        },
        created() {
            this.$store.dispatch('getMenuButtonList', this.$route.query && this.$route.query.buttonId);
        },
        components: {
            titleField,
            elTablePage
        },
        methods: {
            resetGetTableData(){
                //this.$refs.tablePagination.reset();
                Object.keys(this.searchForm).forEach(sk=>{
                    this.params[this.searchForm[sk].key] = '';
                })
                this.$refs.tablePagination.getTableData()
            },
            getTableData() {
                this.$refs.tablePagination.getTableData()
            },
            eventBus(event, item) {
                if(this[event])return this[event](item);
            },
            eventBus1(event, item) {
                return this[event](item)
            },
            callbackList(item){
                return this[item]
            },
            _code_fn(item) {
                return '此为示例'
            },
            _status_fn(item) {
                let row = item.row;
                let status = row.status;
                let data = defaultOption['checkEnterOption'];
                for(let i in data){
                    if(status === data[i].value){
                        return data[i]['name']
                    }
                }
            },
            _regCapital_fn(item) {
                let row = item.row;
                let nowData = new Date();
                let createdAt = new Date(row.createdAt);
                return (nowData-createdAt).formatDate()||''
            },
            handleApplier(item){
                let url = this.otherList.trackUrl+'detail/'+item.id+'?currTab=1';
                this.$router.push(url)
            }
        },
        computed: {
            ...mapState({
                menuBtnsList: state => state.global.menuBtnsList
            })
        }
    }
</script>
