<template>
  <div class="page-share">
    <span class="btn-love">
      <img src="./assets/img/rd-love.png">
      收藏
    </span>
    <span class="btn-share">
      <img src="./assets/img/rd-share.png">
      分享
    </span>
    <span v-if="showContact" class="btn-contact">联系</span>
    <span v-if="showAdd" class="btn-add-resource">加入资源库</span>
  </div>
</template>

<script>
  export default {
    name: 'share',
    props: {
      showContact: {
        type: Boolean,
        default: false
      },
      showAdd: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-share {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .98rem;
    line-height: .98rem;
    background:rgba(255,255,255,1);
    box-shadow:0 -.05rem 0 0 rgba(41,41,41,0.07);
    font-size: .28rem;
    overflow: hidden;
    span {
      float: left;
    }
    img {
      vertical-align: middle;
      margin-right: .22rem;
    }
    .btn-love {
      margin-left: .41rem;
      color: #F07979;
      img {
        width: .54rem;
      }
    }
    .btn-share {
      margin-left: .59rem;
      margin-right: .76rem;
      color: #999;
      img {
        width: .44rem;
      }
    }
    .btn-add-resource, .btn-contact {
      width: 3rem;
      background-color: #4B9EEA;
      font-size: .32rem;
      color: #fff;
      text-align: center;
    }
  }
</style>