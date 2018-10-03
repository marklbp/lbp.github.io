<template>
  <form class="page-publish">
    <div class="input-field input-inline">
      <span class="label">标题：</span>
      <div class="input">
        <input placeholder="请输入项目名称">
      </div>
    </div>
    <div class="input-field input-block">
      <div class="label">描述：</div>
      <div class="input">
        <textarea placeholder="请详细描述你的项目内容，提高项目合作成功率"></textarea> 
      </div>
    </div>
    <div class="input-field input-block">
      <div class="label">需求：</div>
      <div class="input">
        <textarea placeholder="请输入你所需要的资源"></textarea> 
      </div>
    </div>
    <div class="input-field input-block">
      <div class="label">提供：</div>
      <div class="input">
        <textarea placeholder="请输入你能提供的资源"></textarea> 
      </div>
    </div>
    <div class="input-group">
      <div class="input-field input-select">
        <span class="label">有效时间：</span>
        <div class="input">
          <select>
            <option>请选择</option>
          </select>
        </div>
      </div>
      <div class="input-field input-select">
        <span class="label">公司：</span>
        <div class="input">
          <select>
            <option>今日头条</option>
          </select>
        </div>
      </div>
    </div>
    <button class="input-submit" type="submit">发布</button>
  </form>
</template>

<script>
  export default {
    name: 'project',
    data () {
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-publish {
    padding-bottom: 1.12rem;
    background-color: #eee;
  }
  .input-field {
    display: flex;
    margin-bottom: .16rem;
    padding: .3rem .4rem;
    font-size: .28rem;
    background-color: #fff;
    .label {
      display: inline-block;
      font-size: .32rem;
      color: #333;
      white-space: nowrap;
    }
    .input{
      flex: 1
    }
    textarea, input {
      margin: 0;
      padding: 0;
      border: 0 none;
      width: 100%;
      font-size: .28rem;
      outline: none;  
    }
    textarea {
      min-height: .8rem;
      resize: vertical;
    }
    &.input-block {
      display: block;
      padding: 0 0 .3rem 0;
      .label {
        display: block;
        padding: .3rem 0 .27rem .4rem;
        border-bottom: .01rem solid #E5E5E5;
      }
      .input {
        margin: .27rem .4rem 0 .4rem;
      }
    }
    &.input-select {
      padding: 0;
      border-bottom: .01rem solid #E5E5E5;
      .label {
        padding: .3rem 0 .3rem .4rem;
      }
      .input {
        position: relative;
        select {
          -webkit-appearance: none;
          border: 0;
          outline: 0;
          background-color: transparent;
          width: 100%;
          font-size: inherit;
          height: .96rem;
          line-height: .96rem;
          position: relative;
          z-index: 1;
          padding-left: .4rem;
          padding-right: .8rem;
          color: #F07979;
        }
        &:after {
          content: " ";
          height: .2rem;
          width: .2rem;
          border-width: .02rem .02rem 0 0;
          border-color: #8C8C8C;
          border-style: solid;
          -webkit-transform: translateY(-50%) rotate(45deg);
          transform: translateY(-50%) rotate(45deg);
          position: relative;
          top: -.02rem;
          position: absolute;
          top: 50%;
          right: .4rem;
        }
      }
    }
  }
  .input-group {
    margin-bottom: .16rem;
    .input-field {
      margin-bottom: 0;
    }
  }
  .input-submit {
    position: fixed;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    padding: 0;
    border: 0 none;
    height: .96rem;
    background-color: #4B9EEA;
    font-size: .36rem;
    text-align: center;
    color: #fff;
  }
</style>