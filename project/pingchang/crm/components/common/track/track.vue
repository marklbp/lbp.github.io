<template>
    <div class="track ">
        <ul class="track-time-line" v-if="trackList">
            <li class="track-timeline" v-for="(item,index) in trackList" :key="index">
                <span :class="{'track-status':true,'interview':item.state===10,'rollback':item.state===20}">{{item.stateName||'-'}}</span>
                <el-row class="track-con">
                    <!--<el-col :span="3"><span class="checkout-state">贷款申请</span></el-col>-->
                    <el-col :span="8">
                        <span class="checkout-user">
                            <b>办理人：</b>{{item.approvalUserName || '-'}}({{item.realName || '-'}})
                        </span>
                    </el-col>
                    <el-col :span="8">
                        <span class="checkout-result">
                            审核结论：{{item.remark}}
                        </span>
                    </el-col>
                    <el-col :span="8">
                        <div class="checkout-time">开始时间：{{item.startDate}}</div>
                        <div class="checkout-time">结束时间：{{item.endDate}}</div>
                    </el-col>
                </el-row>
            </li>
        </ul>
        <div v-if="!trackList.length">
            暂无可查询的轨迹
        </div>
    </div>
</template>
<style lang="scss">
    @import "./track";
</style>
<script>
    export default {
        props: {
            trackList: {
                type: Array,
                default: () => ({})
            }
        },
        created() {
        },
        watch: {}
    }

</script>
