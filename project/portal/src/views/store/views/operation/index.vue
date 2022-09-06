<template>
  <div class="container">
    <h2 class="title">运营流程</h2>
    <div class="search">
      <el-input
        v-model="searchWords"
        placeholder="输入内容后按回车键搜索"
        style="width:254px;float:right;"
        @change="searchHandler"
        ><i slot="prefix" class="el-input__icon el-icon-search"></i
      ></el-input>
    </div>
    <div class="dialog-content">
      <el-tabs
        v-if="items.length"
        tabPosition="left"
        class="slider-tab"
        v-model="itemIndex"
        @tab-click="clickHandler"
      >
        <el-tab-pane
          v-for="(val, i) in items"
          :key="i + ''"
          :label="val.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="all-items" ref="itemWrap">
        <page-init :loading="loading" :message="message">
          <div class="item-detail" v-for="(val, k) in items" :key="k" :ref="k">
            <h4>{{ val.name }}</h4>
            <ul>
              <li
                v-for="(item, i) in val.list"
                :key="i"
                @click="checkoutHandle(item)"
              >
                <div>
                  <h5 class="item-title">{{ item.name }}</h5>
                  <p class="item-instruc" v-if="item.description">
                    {{
                      (item.description || '').slice(0, 20) +
                        ((item.description || '').length > 20 ? '...' : '')
                    }}
                  </p>
                </div>
                <el-button
                  type="primary"
                  @click.stop="useHandle(item)"
                  style="width:60px"
                  >启用</el-button
                >
              </li>
            </ul>
          </div>
        </page-init>
      </div>
    </div>
  </div>
</template>
<script src="./index.js"></script>
<style lang="scss" scoped src="./index.scss"></style>
<style>
.el-main {
  position: relative;
}
</style>
