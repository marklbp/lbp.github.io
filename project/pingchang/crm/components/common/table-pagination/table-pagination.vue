<template>
    <div class='table-pagination' v-loading="loading">
        <el-table :data="sourceData" style="width: 100%" class='pch-table' stripe>
            <slot></slot>
        </el-table>
        <el-pagination style="padding: 7px;" @size-change="handleSizeChange" @current-change="handleIndexChange"
                       :page-size="limit" :page-sizes="[10, 20, 50]" :current-page="start"
                       layout="total,sizes, prev, pager, next,jumper" :total="sourceTotal"></el-pagination>
    </div>
</template>
<style lang="scss">
// @import "./Breadcrumb.scss"
</style>
<script>
export {default} from "./table_pagination"
</script>
