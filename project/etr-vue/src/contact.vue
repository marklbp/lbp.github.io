<template>
  <div class="page-im">
    <div class="im-container">
      <ul class="list">
        <li>
          <div class="avatar"></div>
          <div class="text">你好啊！</div>
        </li>
        <li class="me">
          <div class="avatar"></div>
          <div class="text">你现在如何呢？</div>
        </li>
      </ul>
    </div>
    <form class="im-form">
      <div class="im-input">
        <div class="input">
          <input type="text" @focus="showFaces = showMedia = false">
        </div>
        <img class="btn-face" src="./assets/img/c-face.png" @click="showFaces = !showFaces; showMedia = false;">
        <img class="btn-add" src="./assets/img/c-add.png" @click="showMedia = !showMedia; showFaces = false;">
      </div>
      <div class="im-compt">
        <div class="im-faces" :class="{'focus': showFaces}">
          这里是表情
        </div>
        <div class="im-media" :class="{'focus': showMedia}">
          这里是多媒体
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'contact',
    data () {
      return {
        showFaces: false,
        showMedia: false
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .page-im {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #eee;
    font-size: .3rem;
  }
  .im {
    &-container {
      flex: 1;
      .list {
        padding: .32rem;
        margin: 0;
        list-style: none;
        li {
          position: relative;
          padding-left: .8rem;
          margin-top: .64rem;
          color: #fff;
          &.me {
            padding-left: 0;
            padding-right: .8rem;
            text-align: right;
            .avatar {
              left: auto;
              right: 0;
            }
            .text {
              border-radius: .2rem .2rem 0 .2rem;
              background-color: #F07979;
              &:before {
                left: auto;
                right: -.1rem;
                background-color: #F07979;
              }
            }
          }
        }
        .avatar {
          position: absolute;
          left: 0;
          bottom: 0;
          width: .64rem;
          height: .64rem;
          overflow: hidden;
          border-radius: 50%;
          background-color: #ccc;
        }
        .text {
          position: relative;
          display: inline-block;
          padding: .3rem .4rem;
          border-radius: .2rem .2rem .2rem 0;
          box-shadow:0px 1px 3px 0px rgba(0, 0, 0, 0.35);
          background-color: #4B9EEA;
          &:before {    
            content: '';
            position: absolute;
            bottom: 0;
            left: -.1rem;
            width: .2rem;
            height: .1rem;
            background-color: #4B9EEA;
            border-radius: 50%;
          }
        }
      }
    }
    &-form {
      width: 100%;
      background-color: #fff;
      font-size: .3rem;
      .im-input {
        position: relative;
        padding: .13rem 1.78rem .13rem .18rem;
        box-shadow: 0 .01rem 0 rgba(0,0,0, .15);
        .input {
          height: .72rem;
        }
        input {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: .06rem .12rem;
          box-sizing: border-box;
          border: .02rem solid rgba(210,210,210,1);
          border-radius: .06rem;
        }
        img {
          position: absolute;
          width: .54rem;
          right: 1.03rem;
          top: .21rem;
        }
        .btn-add {
          right: .28rem;
        }
      }
      .im-faces ,
      .im-media{
        display: none;
        padding: .4rem;
        text-align: center;
        &.focus {
          display: block
        }
      }
    }
  }
</style>