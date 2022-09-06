<template>
  <div class="home">
    <div
      class="home_fixed"
      :style="{ 'background-color': showFixed ? '#ffffff' : 'transparent' }"
    >
      <div
        class="home_fixed_inner"
        :style="{ color: showFixed ? '#333333' : '' }"
      >
        <div class="home_fixed_inner_left">
          <img
            v-if="showFixed"
            draggable="false"
            class="home_fixed_inner_left_logo"
            src="~/assets/img/logo.svg"
          />
          <img
            v-else
            draggable="false"
            class="home_fixed_inner_left_logo"
            src="~/assets/img/home/logo.png"
          />
          <div draggable="false" class="home_fixed_inner_left_name">ROSS</div>
          <div
            class="home_fixed_inner_left_text"
            :style="{ color: showFixed ? '#666666' : '' }"
          >
            智能运营服务平台
          </div>
        </div>
        <div
          class="home_fixed_inner_right"
          :class="[showFixed ? 'showFixed' : '']"
        >
          <a href="/dashboard">
            <el-button class="home_fixed_inner_right_button" size="medium" plain
              >登录</el-button
            >
          </a>
        </div>
      </div>
    </div>

    <div class="home_swiper" v-if="apps.length > 0">
      <el-carousel
        :interval="5000"
        :arrow="swiperBg.length > 1 ? 'always' : 'never'"
        height="570px"
        :autoplay="false"
      >
        <el-carousel-item
          v-for="(item, index) in swiperBg"
          :key="'img' + index"
          :style="{ 'background-image': `url(${item.img})` }"
        >
          <div class="home_swiper_item">
            <div class="home_swiper_item_titile">智能运营 决胜未来</div>
            <div class="home_swiper_item_extra">
              运营门户ㆍ设计家ㆍ商品家ㆍ活动家ㆍ数据家
            </div>
            <a href="/dashboard">
              <el-button
                class="home_swiper_item_extra_button"
                size="medium"
                plain
                >立即进入</el-button
              >
            </a>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="home_content">
      <div class="home_content_title">智能产品家族</div>
      <div class="home_content_apps">
        <div
          class="home_content_apps_item"
          v-for="(item, index) in apps"
          :key="'app' + index"
          @click="openHostHandle(item)"
        >
          <div class="home_content_apps_item_logo">
            <img draggable="false" :src="item.icon" alt />
          </div>
          <div class="home_content_apps_item_name">{{ item.appName }}</div>
          <div class="home_content_apps_item_extra">{{ item.extra }}</div>
        </div>
      </div>
      <div class="home_content_brand_wall">
        <img draggable="false" src="~/assets/img/home/brand-wall.jpg" />
      </div>
    </div>
    <div class="home_footer" :style="{ 'background-image': `url(${footer})` }">
      <img draggable="false" src="~/assets/img/home/footer.jpg" />
    </div>
  </div>
</template>
<script>
import apps from '~/components/ross-links/ross'
let pre = 0
export default {
  name: 'home',
  data() {
    return {
      swiperBg: [
        {
          img: require('~/assets/img/home/banner0.jpg')
        },
        {
          img: require('~/assets/img/home/banner0.jpg')
        }
      ],
      apps: this.makeRossLink(),
      footer: require('~/assets/img/home/footer_repeat.jpg'),
      showFixed: false
    }
  },
  computed: {
    env() {
      const env = this.$constant.RUN_ENV.env
      return env
        ? env.toLowerCase() === 'prod'
          ? 'pro'
          : env.toLowerCase()
        : 'sit'
    }
  },
  created() {
    this.removeScroll()
    this.addEventScroll() // 监听document滚动
  },
  beforeDestroy() {
    this.removeScroll()
  },
  methods: {
    addEventScroll() {
      document.addEventListener('scroll', this.listenScroll)
    },
    removeScroll() {
      this.showFixed = false
      document.removeEventListener('scroll', this.listenScroll)
    },
    listenScroll() {
      const now = new Date()
      if (now - pre >= 100) {
        pre = now
      }
      let h = document.body.scrollTop || document.documentElement.scrollTop
      if (h > 50) {
        this.showFixed = true
      } else {
        this.showFixed = false
      }
    },
    openHostHandle({ hosts }) {
      window.open(`${hosts[this.env] || hosts.pro}`)
    },
    makeRossLink() {
      return apps.map(item => {
        switch (item.app) {
          case 'portal':
            item.extra = '运营管理专家'
            item.hosts.sit += '/dashboard'
            item.hosts.uat += '/dashboard'
            item.hosts.pro += '/dashboard'
            break
          case 'design':
            item.extra = '图像设计和处理专家'
            break
          case 'speedraw':
            item.extra = '商品处理专家'
            break
          case 'activity':
            item.extra = '活动运营和管理专家'
            break
          case 'bizwise':
            item.extra = '数据化运营专家'
            break
          default:
            item.extra = ''
            break
        }
        return item
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin header {
  width: 80%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  color: #ffffff;
  position: fixed;
  z-index: 3;
  top: 0;
  left: 10%;
  &_left {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_logo {
      display: block;
      width: 30px;
      height: 30px;
    }
    &_name {
      font-size: 24px;
      padding: 0 16px 0 11px;
    }
  }
  &_right {
    /deep/ .el-button.is-plain {
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0);
      &:hover {
        border-color: #ffffff;
        opacity: 0.8;
      }
      &:focus {
        border-color: #ffffff;
        opacity: 0.8;
      }
    }
  }
}
.home {
  min-width: 1175px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
  &_swiper {
    position: relative;
    width: 100%;
    background-color: #3280ff;
    &_item {
      padding-top: 170px;
      text-align: center;
      color: #ffffff;
      &_titile {
        font-size: 44px;
      }
      &_extra {
        padding-top: 24px;
        font-size: 20px;
        &_button {
          width: 140px;
          font-size: 14px;
          color: #136dff;
          margin-top: 40px;
        }
      }
    }
    /deep/ .el-carousel {
      overflow: hidden;
      .el-carousel__indicators {
        .el-carousel__indicator {
          .el-carousel__button {
            width: 8px;
            height: 8px;
            border-radius: 100%;
          }
        }
      }
      .el-carousel__container {
        .el-carousel__arrow {
          background-color: transparent;
          font-size: 30px;
          color: #ffffff;
          opacity: 0.8;
          &:hover {
            opacity: 1;
          }
        }
        .el-carousel__arrow--left {
          left: 10%;
        }
        .el-carousel__arrow--right {
          right: 10%;
          background-color: transparent;
        }
        .el-carousel__item {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: auto 100%;
          background-position: center top;
        }
      }
    }
  }
  &_content {
    padding-top: 145px;
    text-align: center;
    &_title {
      font-size: 24px;
      font-weight: bold;
    }
    &_apps {
      display: flex;
      justify-content: center;
      padding-top: 75px;
      &_item {
        cursor: pointer;
        width: 235px;
        &:hover {
          opacity: 0.9;
        }
        &_logo {
          img {
            width: 54px;
            height: 54px;
          }
        }
        &_name {
          padding-top: 30px;
          font-size: 20px;
          font-weight: bold;
        }
        &_extra {
          padding-top: 20px;
          font-size: 14px;
          color: #87888b;
        }
      }
    }
    &_brand_wall {
      padding-top: 144px;
      text-align: center;
      img {
        width: 1175px;
        vertical-align: middle;
      }
    }
  }
  &_footer {
    margin-top: 144px;
    background-color: #262a39;
    background-repeat: repeat-x;
    background-size: auto 100%;
    img {
      display: block;
      margin: 0 auto;
      width: 1175px;
    }
  }
  &_fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 68px;
    z-index: 4;
    &_inner {
      @include header;
      .showFixed {
        /deep/ .el-button.is-plain {
          color: #333333;
          background-color: rgba(0, 0, 0, 0);
          border-color: #333333;
          &:hover {
            border-color: #333333;
            opacity: 0.8;
          }
          &:focus {
            border-color: #333333;
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
