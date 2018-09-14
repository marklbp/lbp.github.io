<template lang="html">
  <div class="lottery-rule-page overflow-y f-28 column-flex">
    <article class="bg-white padding-lr-30 text-contain p-b20">
      <section class="margin-t-20">
        <p class="no font-b">一.玩法说明</p>
        <p class="flex-full">
          目前，竞猜足球推出2种玩法，分别为"胜平负"、"让球胜平负"、竞猜的比赛由国家体育总局体育彩票管理中心选定并向社会公布。竞猜足球的比赛对阵主队在前，客队在后。
        </p>
        <p class="margin-t-20">玩法 规则</p>
        <p class="flex-full">
          胜平负 竞猜两支球队，在90分钟内（含伤停补时）的胜平负结果。
          让球胜平负 竞猜两支球队，在90分钟内（含伤停补时）让球后的胜平负结果。
        </p>
        <p>注：</p>
        <p>1、 让球胜平负</p>
        <p>“-”表示主队让客队，主队的净胜球大于让球数才算主胜；“+”表示客队让主队，客队的净胜球大于让球数才算主负。</p>
        <p>2、竞猜足球混投 </p>
        <p>该玩法是指多场比赛之间不同玩法进行组合投注。同一场比赛的各种玩法不能组合成一注投注。 </p>
      </section>
      <section class="margin-t-20">
        <p class="no font-b">二、过关方式</p>
        <p class="flex-full">
          选择1场比赛进行投注的为单场投注；选择2场或2场以上比赛进行串联投注的为过关投注。<br>
          在过关投注中，所选比赛的结果全部竞猜正确才能中奖。<br>
          1、胜平负玩法：串关最高上限为8串1。<br>
          2、让球胜平负玩法：串关最高上限为8串1。<br>
        </p>
      </section>
      <section class="margin-t-20">
        <p class="no font-b">三、奖金计算</p>
        <p>
          1、 竞猜足球的过关投注奖金是根据用户购买时的赔率来计算奖金的，不受投注完成后的调整变化所影响，投注页面赔率也仅供参考。<br>
          2、 过关奖金=单注奖金*倍数；单注奖金=2*所选比赛赔率连乘（只取整数）<br>
          例如：用户购买2场比赛2串1过关且中奖，竞猜时的赔率奖金分别是2.65和2.48，倍数为2倍，单注奖金=2×2.65×2.48=13.14计14，方案总奖金=14×2倍=28。<br>
          3、 最高投注倍<br>
          单场投注，单注最高投注限额10万倍。
        </p>
      </section>
      <section class="margin-t-20">
        <p class="no font-b">四、无效比赛的处理</p>
        <p>由于比赛取消、延期（比赛时间推迟且超过原定时间36小时或无法获知具体推迟时间）等原因，导致某场比赛被官方认定为无效场次，涉及该场次的投注结果均视为正确，赔率按1计算。</p>
      </section>
      <section class="margin-t-20">
        <p class="no font-b">五、注意事项</p>
        <p>
          根据投注额、突发事件等因素，暂停或提前截止针对某场比赛的某些特定过关组合、特定结果选项的投注（也就是限号），暂停或提前截止针对某场比赛的所有投注（比赛延期等情况会提前截止）。
        </p>
      </section>
    </article>
  </div>
</template>

<script>
export default {
  name: 'rule',
  data () {
    return {
      entranceList: [
        {name: '竞猜足球'},
        {name: '竞猜足球'},
        {name: '竞猜足球'}
      ]
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  p{
    margin: 0px;
    line-height: 50px;
  }
  .padding-lr-30{
    padding-left: 30px;
    padding-right: 30px;
  }
  .lottery-rule-page{
    height: 100%;
    width: 100%;
    min-height: 100vh;
  }
  .text-contain{
    height: 100%;
  }
  .lottery-rule-page .flex-b{
    margin-bottom: 40px;
  }
  .margin-t-20{
    margin-top: 20px;
  }
</style>
