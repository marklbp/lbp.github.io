<template>
    <div class="page-messages">
      <div class="messages">
        <ul class="list">
          <li class="has-new">
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li>
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li class="has-new">
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li>
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li class="has-new">
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li>
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li class="has-new">
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li>
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
          <li class="has-new">
            <div class="avatar">
            </div>
            <div class="content">
              <div class="user">
                <span class="nick">我是小猫</span>
                <span class="d">|</span>
                <span class="job">职务.公司名称</span>
                <span class="time">12:00</span>
              </div>
              <div class="message">发送消息的内容，上次合作怎么样？</div>
            </div>
          </li>
        </ul>
      </div>
      <Foot />
    </div>
</template>

<script>
  import Foot from './footer'
  export default {
    name: 'messages',
    components: {Foot}
  }
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-bottom: 1.08rem;
  li {
    position: relative;
    overflow: hidden;
    padding: .27rem 0;
    border-bottom: .1rem solid #eee;
    background-color: #fff;
    &.has-new {
      &:after {
        content: '';
        position: absolute;
        left: 1.45rem;
        top: .27rem;
        width: .08rem;
        height: .08rem;
        border-radius: 50%;
        border: .06rem solid #3BDD57;
      }
    }
  }
  .avatar {
    float: left;
    width: .98rem;
    height: .98rem;
    margin-left: .47rem;
    border-radius: 50%;
    background-color: #ccc;
  }
  .content {
    margin-left: 1.94rem;
    margin-right: .33rem;
    .user {
      position: relative;
      padding-right: .2rem;
      margin-bottom: .23rem;
      height: .33rem;
      font-size: .32rem;
      .nick , .d{
        color: #21262C
      }
      .d {
        color: #999;
      }
      .job, .time {
        font-size: .24rem;
        color: #999;
      }
      .time {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .message {
      color: #999;
      font-size: .24rem;
    }
  }
}
</style>