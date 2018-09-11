<template>
    <div class="pch-detail pch-two-columns pch-check-detail">
        <div class="pch-tab pch-left-colums">
            <el-tabs class="pch-tab" v-model="currTab" >
                <el-tab-pane class="pch-tab-title" v-for="(item,index) in tabOption" :key="index" :label="item.value"
                             :name="item.name">
                    <pubDetail :blackList="blackList" v-if="index===0" :detailData="detailData" :tableData="tableData" :infoDataCustom="infoDataCustom" :hiddenAccountInfo="$route.path.indexOf('group') > -1" />
                    <Track v-if="index===1" :trackList="trackList"/>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="pch-right-colums">
            <div class="pch-right-header">
                <h5 class="header-title">{{$route.path.indexOf('review') > -1 ? '审查':'审批'}}信息</h5>
            </div>
            <div class="check-form-scroller pch-form">
                <div v-for="(item,index) in checkRight" :key="index">
                    <section class="check-form-section">
                        <div class="check-form-title" v-if="item.name">
                            <span class="leg-line"></span>
                            {{item.name}}
                        </div>
                        <div class="pch-detail-item-sm" v-for="(list,ind) in item.list" :key="ind"
                             v-if="index==='info'">
                            <div class="pch-detail-name-sm">{{list.value}}：</div>
                            <div class="pch-detail-con-sm">{{lenderAgency[list.name]||'未知'}}</div>
                        </div>

                        <div class="pch-detail-item-sm" v-if="index==='form'" v-for="(list,ind) in item.list"
                             :key="ind">
                            <div class="pch-detail-name-sm">{{list.value}}：</div>
                            <div class="pch-detail-con-sm" v-if="list.name === 'remark'">
                                <el-input  v-if="lenderAgency['status']===pageStatus" v-model="form.remark" placeholder="请输入内容" type="textarea"
                                          :rows="2"></el-input>
                                <span v-if="lenderAgency['status']!==pageStatus">{{lenderAgency['remark']}}</span>
                            </div>
                            <div class="pch-detail-con-sm" v-if="list.name === 'status'">
                                <el-select v-if="lenderAgency['status']===pageStatus" v-model="form.status" placeholder="请选择">
                                    <el-option
                                            v-for="ll in list.list"
                                            :key="ll.value"
                                            :label="ll.name"
                                            :value="ll.value">
                                    </el-option>
                                </el-select>
                                <span v-if="lenderAgency['status']!==pageStatus">{{renderStatus(lenderAgency['status'])}}</span>
                            </div>
                        </div>
                    </section>
                </div>
                <div class='pch-bottom-btns' v-if="lenderAgency['status']===pageStatus">
                    <el-button class='default-sm-btn' :disabled="onSubmit.loading" type="primary" @click="onSubmit">完成</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export {default} from "./detail"
</script>
