<template>
    <div class="pch-detail">
        <div v-for="( item , index) in infoDataCustom" :key="index">
            <titleField>
                <h1 slot='title' class="leg-text">{{item.title}}</h1>
                <div slot='con'>
                    <el-row :gutter="24">
                        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" v-for="(list,ind) in item.list" :key="ind">
                            <div class="pch-detail-item">
                                <div class="pch-detail-name">
                                    {{list}}：
                                </div>
                                <div class="pch-detail-con" v-if="ind==='province'">
                                    {{ list && getProvince(detailData[item.listName]) }}
                                </div>
                                <div class="pch-detail-con" v-else-if="/regCapital/.test(ind)">
                                    {{ (list && detailData[item.listName] && detailData[item.listName][ind]) | parseMoney((list && detailData[item.listName] && detailData[item.listName]['regCapitalTypeName']))}}
                                </div>
                                <div class="pch-detail-con" v-else-if="/^(?:applyMaxLimit|bail|advancePay)$/.test(ind)">
                                    {{ list && detailData[item.listName] && (detailData[item.listName][ind] == 1 ? '是':'否' ) }}
                                </div>
                                <div class="pch-detail-con" v-else>
                                    <!-- 
                                    applyMaxLimit: "申请最高担保额",
                            agreeLimit: "协议担保额度/保证金",
                            bondBegin: "担保起始日期",
                            bondEnd: "担保结束日期",
                            tempAgreeLimit: "临时担保额度",
                            tempLimitBegin: "临时额度开始日期",
                            tempLimitEnd: "临时额度结束日期",

                            bail: "是否需要公司保证金",
                            openBank: "开户行",
                            branchBank: "所属支行",
                            bailNo: "公司保证金账号",
                            accountName: "户名",
                            bailAmount: "保证金金额",
                            bondPercent: "担保占比(%)",
                            
                                     -->
                                    {{ list && detailData[item.listName] && (((/agreeLimit|bondBegin|bondEnd|tempAgreeLimit|tempLimitBegin|tempLimitEnd/.test(ind) && detailData[item.listName]['applyMaxLimit'] == 0) || (/openBank|branchBank|bailNo|accountName|bailAmount|bondPercent/.test(ind) && detailData[item.listName]['bail'] == 0))? '-' : detailData[item.listName][ind] || '-') }}
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </titleField>
        </div>
        <div v-for="( item , index) in tableData" :key="`${index+'1'}`">
            <titleField v-if="blackList.indexOf(item.listName)">
                <h1 slot='title' class="leg-text">{{item.title}}</h1>
                <div slot='con'>
                    <el-table :fit=true :data="detailData[item.listName]" style="width: 100%" class='pch-table' stripe>
                        <el-table-column v-for="(list,ind) in item.list" :key="ind" :label="list.name">
                            <template slot-scope="scope">
                                <p v-if="ind!=='setting'">
                                    {{!list.custom?scope['row'][ind]:eventBus1(`_${ind}_fn`,scope)}}</p>
                                <el-button v-if="ind==='setting'" v-for="(ll,ii) in list.list" :key="ii"
                                           @click="eventBus(ll.value,scope.row)" type="text"
                                           size="small">{{ll.name}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </titleField>
        </div>
        <!--图片查看器-->
        <ImageViewer
                :images="images"
                :defaultIndex="defaultIndex"
                :visible.sync="imgViewerVisible"
        />
    </div>
</template>

<script>
    // import  from '~/components/common/title-field/title-field'
    import parseAddress from '@/plugins/parseAddress';
    import Utils from '~/utils/index'
    import {ImageViewer,titleField} from '@/components/common/'
    //console.log(ImageViewer)
    export default {
        data() {
            return {
                images: [],
                defaultIndex: 0,
                imgViewerVisible: false
            }
        },
        props: {
            detailData: Object,
            infoDataCustom: Array,
            tableData: Array,
            blackList: Array
        },
        components: {
            titleField,
            ImageViewer
        },
        filters: {
            parseMoney(m, u){
                if(!m)m = 0;
                if(!u)u = '（万）美金';
                //console.log(m, u, Utils.regCapitalHandler)
                if(Utils.regCapitalHandler)return Utils.regCapitalHandler(m, u)
                return m + u;
                //return regCapitalHandler(m, u);
            }
        },
        computed: {},
        created() {
        },
        methods: {
            getProvince(data) {
                let pca = [], result = '';
                try {
                    pca = parseAddress(data.province, data.city, data.area)
                } catch (e) {
                    pca.push("无效地址")
                }
                if (data) {
                    result = pca.join("") + data.address;
                }
                return result;
            },
            eventBus(event, item) {
                this[event](item)
            },
            eventBus1(event, item) {
                return this[event](item)
            },
            isEmptyArray(data) {
                //console.log(data)
                //return false;
                //return data.length
            },
            detail(row) {
                //目前单张，后续可以循环table获取
                this.images = [row.fileUrl]
                this.imgViewerVisible = true
                // window.open(row.fileUrl,row.fileName)
                // this.$message({
                //     message: '暂不开放哦！',
                //     type: 'warning'
                // });
            }
        }
    }
</script>
