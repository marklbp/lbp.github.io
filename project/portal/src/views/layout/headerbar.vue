<template>
  <el-header class="headerbar">
    <div class="left">
      <a
        class="nav-item nav-collapse"
        href="javascript:void(0)"
        @click="toggleMenu"
        ><i
          :class="[
            'font-icon',
            collapsed ? 'new-menu-fold' : 'new-menu-unfold'
          ]"
        ></i
      ></a>
      <router-link
        class="nav-item nav-dashboard"
        to="/dashboard"
        :class="{
          dashbgcolor: this.$route.path == '/dashboard' ? true : false
        }"
        ><i class="font-icon dashboard"></i
      ></router-link>
    </div>
    <div class="middle">
      <shop-nav v-if="$route.params.storeId || $route.path === '/store'" />
    </div>
    <div class="right">
      <el-dropdown>
        <div class="tool-box">
          <i class="font-icon view-cardlist icon-size"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="tool-box-list">
          <rossLinks app="design" :env="env" />
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 帮助中心 -->

      <el-dropdown @visible-change="handleShowTip">
        <div class="tool-box">
          <i class="font-icon help icon-size"></i>
        </div>
        <!-- 帮助中心提示 -->
        <div
          class="help-tip-box"
          :class="{
            isshowtip: this.$route.path !== '/dashboard' ? true : false
          }"
          v-if="!noShowTip"
        >
          <p class="help-tip-title">「帮助中心」</p>
          <p class="help-tip-text">
            点击图标可跳转至帮助中心查看产品的新手指引、常见问题、更新日志哦～
          </p>
          <span class="help-tip-ok" @click="handleTip">
            ok
          </span>
          <div class="triangle"></div>
        </div>
        <el-dropdown-menu slot="dropdown" class="help-center-panel">
          <div class="help-center-content">
            <p class="color3">
              <img
                src="~/assets/img/headerbar/ross_logo.svg"
                width="20"
                class="vertical"
              />
              <span class="vertical help-title">运营门户</span>
            </p>
            <p>
              <span>
                <a
                  href="http://ross-portal-sit.baozun.com/static/pdf/新手指南.pdf"
                  class="down-pdf"
                  target="_blank"
                >
                  常见问题FAQ
                </a>
              </span>
              <span style="margin-left:40px">
                <a
                  href="http://ross-portal-sit.baozun.com/static/pdf/新手指南.pdf"
                  class="down-pdf"
                  target="_blank"
                >
                  操作使用说明
                </a>
              </span>
            </p>
            <ul class="contact">
              <li class="color3">联系我们</li>
              <li class="service">
                <span>孔婵娟（客服）</span>
                <span style="margin-left:20px">顾生磊（PM）</span>
              </li>
              <li>电话：021-8026 6000-4711</li>
              <li>邮箱：ross@baozun.com</li>
            </ul>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 通知消息 -->
      <el-dropdown>
        <div class="tool-box">
          <i class="font-icon notice icon-size"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="notice-panel">
          <div class="notice-content">
            <h5>通知</h5>
            <img src="~/assets/img/goujian.svg" />
            <p>通知中心努力构建中，敬请期待！</p>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="user-info">
        <el-dropdown class="acctount-dropdown" @command="cmd">
          <div class="acctount-dropdown-text">
            <span class="avatar">
              <img :src="avatar" v-if="avatar" />
              <img src="~/assets/img/headerbar/avatar.jpg" v-else />
            </span>
            <span class="text">{{ userName }}</span>
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="acctount-dropdown-menu"
            style="width: 198px;"
          >
            <el-dropdown-item command="0">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>
<script>
import settingCache from '~/utils/SettingCache'
let { mapState } = Vuex

export default {
  name: 'headerbar',
  components: {
    rossLinks: _ => import('~/components/ross-links'),
    'shop-nav': _ => import('./components/shop-nav')
  },
  data() {
    let o = this.$cache.get('USER_INFO') || {}
    return {
      userName: o.realName || o.userName || '',
      avatar: false,
      noShowTip: settingCache.getItem('dashboard/noShowTip', false)
    }
  },
  computed: {
    ...mapState(['collapsed']),
    env() {
      const env = this.$constant.RUN_ENV.env
      return env
        ? env.toLowerCase() === 'prod'
          ? 'pro'
          : env.toLowerCase()
        : 'sit'
    }
  },
  created() {},
  methods: {
    handleShowTip() {
      this.noShowTip = true
    },
    handleTip() {
      this.noShowTip = true
      settingCache.setItem('dashboard/noShowTip', true)
    },
    toggleMenu() {
      this.$store.dispatch('toggleMenu', !this.collapsed)
    },
    cmd(t) {
      console.log(t)
      if (t == 0) {
        let close = this.$loading({ text: '登出中...' })
        this.$api
          .logout()
          .then(r => {
            this.$cache.remove('USER_INFO')
            this.$cache.remove('STORE_LIST')
            this.$message.success('登出成功')
            setTimeout(_ => {
              window.location.href =
                r.data +
                `&loutUrl=${encodeURIComponent(this.$constant.LOGIN())}`
            }, 1500)
          })
          .catch(e => {
            close.close()
            this.$message.error(e.msg || e.message || '登出失败')
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

/deep/ .popper__arrow {
  display: none;
}
/deep/ .ross-link {
  box-sizing: border-box;
  padding: 12px !important;
  width: 440px !important;
}

.acctount-dropdown-menu {
  margin-top: 0;
  left: unset !important;
  right: 0;
}

.headerbar {
  display: flex;
  height: 56px !important;
  padding-left: 0;
  padding-right: 0;
  background-color: #fff;
  .left {
    width: 112px;
    font-size: 0;
    white-space: nowrap;
    .nav-item {
      display: inline-block;
      width: 56px;
      height: 56px;
      line-height: 56px;
      text-align: center;
      vertical-align: middle;
      color: #666;
      text-decoration: none;
      &:hover {
        background-color: #f5f5f5;
      }
      .font-icon {
        font-size: 21px;
      }
    }
    .dashbgcolor {
      background-color: #f5f5f5;
    }
  }
  .middle {
    flex: 1;
    position: relative;
    padding-left: 16px;
    padding-right: 16px;
    &:before {
      content: '';
      position: absolute;
      width: 2px;
      height: 100%;
      top: 0;
      background-color: #e8e8e8;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
  .right {
    @include flex;
    align-items: center;
    .tool-box {
      position: relative;
      cursor: pointer;
      width: 56px;
      height: 56px;
      line-height: 56px;
      text-align: center;
      color: #666666;
      font-size: 16px;
      .icon-size {
        font-size: 20px;
      }
      &:hover {
        background-color: #f5f5f5;
      }
    }
    .user-info {
      // width: 198px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        width: 2px;
        height: 100%;
        top: 0;
        background-color: #e8e8e8;
      }
    }
  }
  .acctount-dropdown {
    display: block;
    height: 56px;
    line-height: 56px;
    padding-left: 16px;
    padding-right: 16px;
    outline: none;
    cursor: pointer;

    &-text {
      white-space: nowrap;
      overflow: hidden;
      .text {
        float: right;
        display: inline-block;
        vertical-align: middle;
        max-width: 112px;
        margin-right: 16px;
        margin-left: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: #333;
      }
      .avatar {
        float: right;
        margin-top: 12px;
        display: inline-block;
        vertical-align: middle;
        width: 32px;
        height: 32px;
        overflow: hidden;
        border-radius: 50%;
        background-color: #ccc;
      }
    }
    &-menu {
      width: 198px;
    }
  }
}
.tool-box-list {
  flex-wrap: wrap;
  // transform: translateX(180px);
  padding: 12px;
  margin-top: 0;
  @include flex;
  .jump-tool {
    color: #333333;
    &:hover {
      color: #5c85ff;
    }
  }
  // .popper__arrow {
  //   margin-left: -320px;
  // }
}
// 帮助中心
.help-center-panel {
  margin-top: 0;
  width: 303px;
  height: 212px;
  padding: 16px 24px;
  font-size: 12px;
  color: #999;
  .color3 {
    color: #333;
  }
  .vertical {
    vertical-align: middle;
  }
  .help-title {
    font-size: 14px;
    color: #333;
    padding: 0;
    margin: 0 0 0 8px;
  }
  .down-pdf {
    color: #999;
    &:hover {
      color: #333;
    }
  }
  .contact {
    border-top: 1px solid #eee;
    margin-top: 16px;
    margin-left: 0;
    padding-left: 0;
    li {
      list-style: none;
      padding: 0;
      margin: 0;
      &:first-child {
        margin-top: 16px;
      }
      &:last-child {
        margin-top: 6px;
      }
    }
    .service {
      margin: 10px 0;
    }
  }
}
// 帮助中心提示
.isshowtip {
  display: none;
}
.help-tip-box {
  position: absolute;
  width: 274px;
  height: 152px;
  background: #36f;
  -webkit-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  padding: 0 24px;
  top: 68px;
  right: -27px;
  z-index: 100;
  .help-tip-title {
    margin-top: 22px;
    margin-left: -4px;
  }
  .help-tip-text {
    font-weight: 200;
    margin: 8px 0 20px;
    font-size: 12px;
    line-height: 18px;
  }
  .help-tip-ok {
    position: absolute;
    right: 24px;
    bottom: 18px;
    cursor: pointer;
  }
  .triangle {
    border: 7px solid transparent;
    border-bottom-color: #36f;
    position: absolute;
    left: 212px;
    top: -14px;
  }
}
// 通知消息
.notice-panel {
  margin-top: 0;
  width: 330px;
  height: 280px;
  .notice-content {
    text-align: center;
    padding: 0px 24px;
    h5 {
      font-size: 14px;
      text-align: left;
      margin-top: 0px;
      padding-top: 16px;
    }
    p {
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
