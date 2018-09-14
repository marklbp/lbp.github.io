<template>
  <div class="guess-detail-page">
    <div class="flex-full overflow-y detail-contain" id="content">
      <div class="order-status-contain">
        <div class="bg-white">
          <div class="top-line handle-botton-color"></div>
          <!--<div class="f-30 c-31 text-center order-name">竞猜足球混合过关</div>-->
          <p class="f-30 c-31 center-flex order-no-desc text-center">
            {{detailModel.lotteryTypeDesc}}
            <!--<div class="center-flex-v column-flex">-->
              <!--<p class="center-flex-v"></p>-->
              <!--<p class="f-24 c-ad text-center order-timer" v-if="matchType==1">第235234期</p>-->
            <!--</div>-->
          </p>
          <div class="s-line center-flex-v relative-view">
            <div class="left-radus"></div>
            <div class="hairline--bottom-f1-d sline-contain"></div>
            <div class="right-radus"></div>
          </div>
          <div class="center-flex-h order-status-text center-flex">
            <!--<div class="column-flex">-->
              <div class="center-flex-v">
                <img class="order-status-icon" v-if="detailModel.lotteryStatus==2" src="../../../assets/footballgame/guess-win.svg"/>
                <img class="order-status-icon" v-if="detailModel.lotteryStatus==3" src="../../../assets/footballgame/guesss-agian.svg"/>
                <!--<img class="order-status-icon" v-if="orderStatusText=='待支付'" src="../../../assets/footballgame/"/>-->
                <img class="order-status-icon" v-if="detailModel.lotteryStatus==1" src="../../../assets/footballgame/guess-waite.svg"/>
                <span class="c-f0" v-if="detailModel.lotteryStatus==2||detailModel.lotteryStatus==3">
                  {{detailModel.lotteryStatus==2?'恭喜中奖':'再接再厉'}}
                </span>
                <span class="c-ad" v-if="detailModel.lotteryStatus==1">
                 待开奖
                </span>
              </div>
              <!--<div class="status-time text-center">-->
                <!--<span class="time c-31 f-30">-->
                  <!--<span class="f-26 text">剩余</span>24:10:04-->
                <!--</span>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>
        <div class="order-apply-award center-flex-v">
          <div class="flex-full f-28 c-86 white-space center-flex-v">订单金额
            <span class="c-31 m-l20">{{detailModel.orderPoint}}积分</span>
          </div>
          <div class="f-28 award flex-full white-space" :class="isWin?'c-f0':'c-31'"><span class="award-count c-86">中奖金额</span>{{resultText}}</div>
        </div>
      </div>
      <p class="guess-info-title c-31 f-26">
        投注信息：
        <span class="type-name" v-if="detailModel.betDetailInfoText">{{detailModel.betDetailInfoText}}</span>
        <span class="bet-multiple">{{detailModel.betDetailCount}}注{{detailModel.multiple}}</span>倍
      </p>
      <div class="order-detail-info-contain bg-white">
        <div class="tab-title -detial-item center-flex-v c-86 f-26 hairline--bottom-f6">
          <div v-if="detailModel.lotteryType=='1'" class="center-flex-b flex-full">
            <p class="width-20">场次</p>
            <p class="width-20">赛事</p>
            <p class="width-20">玩法</p>
            <p class="width-20">投注</p>
            <p class="width-20">彩果</p>
          </div>
          <div v-else class="center-flex-v flex-full campion">
            <p class="width-40">球队</p>
            <p class="width-20">赔率</p>
            <p class="width-20">概率</p>
            <p class="width-20">彩票</p>
          </div>
        </div>
        <div class="-guess-item center-flex-v f-24 c-31" :class="index<matchList.length-1?'hairline--bottom-f1-d':''" v-for="(match,index) in matchList" :key="index">
          <div v-if="detailModel.lotteryType=='1'" class="center-flex-b flex-full">
            <div class="width-20 timer c-86">
              <p>{{match.matchNum}}</p>
              <p>{{match.matchDateText}}</p>
              <p>{{match.matchTime}}</p>
            </div>
            <div class="width-20 teams">
              <p>{{match.hostTeam}}</p>
              <p>{{match.score?match.score:'VS'}}</p>
              <p>{{match.guestTeam}}</p>
            </div>
            <div class="width-40">
              <div class="center-flex-v" v-for="(play,index) in match.playList" :key="index">
                <div class="width-50 play-type flex-wa-cv p-tb-10">
                    <p>{{play.playWayDesc}}</p>
                    <p v-if="play.playWay ==2">[{{play.giveBallNum}}]</p>
                </div>
                <div class="width-50 guess-rate">
                  <div :class="bet.isWin?'c-f0':''" v-for="(bet,index) in play.betInfoList" :key="index" class="p-tb-10">
                    <p>{{bet.betInfoDesc}}</p>
                    <p>{{bet.lossPercent}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="width-20 guess-result" v-if="match.isWaite">
              <p class="c-ad" >未开出</p>
            </div>
            <div class="width-20 guess-result" v-else>
              <div class="p-tb-10 h-82 center-flex" :class="result.isWin?'c-f0':''" v-for="(result,index) in match.resultList" :key="index">
                {{result.lotteryResultDesc}}
              </div>
            </div>
          </div>
          <div v-else class="center-flex-b flex-full campion f-24 c-31">
            <div class="width-40 teams">
              <p class="center-flex">{{match.hostTeam?match.hostTeam:match.team}}<span v-if="match.guestTeam"> VS {{match.guestTeam}}</span></p>
            </div>
            <div class="width-20 play-type">
              <p>{{match.rewardCount}}</p>
            </div>
            <div class="width-20 guess-rate">
              <p>{{match.probability}}</p>
            </div>
            <div class="width-20 guess-result">
              <p class="c-ad" v-if="match.isWaite">未开出</p>
              <p :class="match.isWin?'c-f0':''" v-else>{{match.guessResultText}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="order-base-info bg-white f-26 c-ad margin-t-20">
        <p class="order-no">订单编号<span>{{detailModel.orderId}}</span></p>
        <p class="create-time">下单时间<span>{{detailModel.orderDateText}}</span></p>
        <p class="end-time" v-if="detailModel.lotteryType=='1'">截止时间<span>{{detailModel.cutoffDateText}}</span></p>
      </div>
      <!-- 分享二维码部分 -->
      <div id="qrcodeWrapper">
        <div class="center-flex-v m-t20">
          <div class="flex-full center-flex-v">
            <img class="yhy-logo vw-ignore" src="@/domain/quiz/assets/qrcode-logo.png" alt="" srcset="">
            <div class="c-31 f-24">不是针对谁，你敢跟我来一注？</div>
          </div>
          <div class="code relative-view" ref="code">
            <img class="logo-icon vw-ignore" src="@/domain/quiz/assets/qrcode-logo.png" alt="" srcset="">
          </div>
        </div>
      </div>
    </div>
    <button class="handle-botton-color continue-apply c-f f-32 center-flex qrcode-ignore" @click.stop="clickBtnHandler">继续投注</button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import toggleLoading from '@/components/loading'
import { upload } from '@/services/upload.js'
import { sharePicture, register, setNavButton } from '@/services/native.js'
import { SHARE_ICON } from 'quiz/tools/contants/index.js'
import QRCode from '@/utils/qrcode.js'
export default {
  name: 'Index',
  data () {
    return {
      isWin: false,
      isPublic: true,
      apply: true,
      matchList: [1, 2, 3],
      detailModel: {},
      orderStatusText: '',
      resultText: '',
      isFromPayPage: false,
      //  分享图片地址
      saveImgSrc: null,
      //  二维码数据
      qrcode: {}
    }
  },
  computed: {
  },
  beforeMount () {
    this.$trace('jcorder_xianqingpage')
    let recordId = this.$route.params.id
    this.$store.dispatch('getGuessDetailModel', {recordId}).then((res) => {
      if (res && res.content && res.content.length > 0 && res.content[0]) {
        let { lotteryType, passSelect, orderDate, cutoffDate } = res.content[0]
        this.detailModel = res.content[0]
        this.detailModel.lotteryTypeDesc = this.detailModel.lotteryTypeDesc.replace(/竞彩/, '竞猜')
        this.detailModel.orderDateText = this.formateTime(orderDate)
        this.detailModel.cutoffDateText = this.formateTime(cutoffDate)
        let betDetailInfoText = ''
        if (passSelect) {
          if (passSelect.indexOf(',') > -1) {
            passSelect.split(',').forEach(item => {
              betDetailInfoText = betDetailInfoText + item + '串1, '
            })
            betDetailInfoText = betDetailInfoText.substring(0, betDetailInfoText.length - 2)
          } else {
            betDetailInfoText = passSelect + '串1'
          }
        }
        this.detailModel.betDetailInfoText = betDetailInfoText
        let matchList = []
        if (lotteryType === '1') {
          matchList = this.detailModel.matchInfo
        } else if (lotteryType === '3') {
          matchList = this.detailModel.championInfo
        } else if (lotteryType === '2') {
          matchList = this.detailModel.championGuessInfo
        }
        //  生成二维码
        let url = lotteryType === '1' ? `${location.protocol}//${location.host}/quiz/#/footballgame/play` : `${location.protocol}//${location.host}/quiz/#/worldcup`
        this.createQrcode(url)
        this.matchList = matchList.map(match => {
          let { lotteryResultDesc, lotteryResult, team, hostTeam, guestTeam, betInfo, matchDate } = match
          if (lotteryResultDesc === '待定' || (lotteryType !== '1' && !lotteryResult)) {
            match.isWaite = true
          }
          match.guessResultText = '淘汰'
          if (matchDate) {
            match.matchDateText = this.formateTime(Number(matchDate), 'MM-DD')
            match.matchTime = this.formateTime(Number(matchDate), 'HH:mm')
          }
          if (lotteryResult === betInfo) {
            match.isWin = true
          } else if (team && lotteryResult === team) {
            match.isWin = true
            match.guessResultText = '冠军'
          } else if (hostTeam && guestTeam && lotteryResult && lotteryResult.indexOf(',')) {
            let matchCount = 0
            lotteryResult.split(',').forEach(team => {
              if (team === guestTeam) {
                matchCount++
              } else if (team === hostTeam) {
                matchCount++
              }
            })
            if (matchCount === 2) {
              match.isWin = true
              match.guessResultText = '冠亚军'
            }
          }
          return match
        })
        // this.matchList = this.matchList.concat(this.matchList)
        if (lotteryType === '1') {
          this.matchList = this.fromateNormalMatch(this.matchList)
        }
        console.log(this.matchList)
        this.initResultText()
      }
    })
  },
  mounted () {
    //  分享图片
    register('shareImg', () => {
      //  如果图片已经生成过,直接调用分享
      if (this.saveImgSrc && this.saveImgSrc !== '') {
        sharePicture(this.saveImgSrc)
        return false
      }
      this.handleCreatePic(() => {
        this.saveImgSrc && this.saveImgSrc !== '' && sharePicture(this.saveImgSrc)
      })
    })
    setNavButton('分享', SHARE_ICON, 'shareImg')
  },
  methods: {
    formateTime (timestamp, type) {
      let time = new Date(timestamp)
      let month = time.getMonth() + 1
      let date = time.getDate()
      let hour = time.getHours()
      let min = time.getMinutes()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (min < 10) {
        min = '0' + min
      }
      let text = time.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + min
      if (type === 'MM-DD') {
        text = month + '-' + date
      } else if (type === 'HH:mm') {
        text = hour + ':' + min
      }
      return text
    },
    initResultText () {
      let result = this.detailModel.lotteryStatus
      if (result === 2) {
        this.resultText = this.detailModel.winPoint + ' 积分'
        this.isWin = true
        this.orderStatusText = '恭喜中奖'
      } else if (result === 3) {
        this.resultText = '0'
        this.orderStatusText = '再接再厉'
      } else if (result === 1) {
        this.resultText = '---'
        this.isPublic = false
        this.orderStatusText = '待开奖'
      }
    },
    clickBtnHandler () {
      if (this.detailModel.lotteryType !== '1') {
        this.$router.push({
          name: 'worldCup'
        })
      } else {
        this.$router.push({
          name: 'FootballGamePlay'
        })
      }
    },
    //  生成分享图片
    handleCreatePic (callback = function () {}) {
      toggleLoading(true, {
        delay: 1
      })
      var shareContent = document.body
      var width = shareContent.offsetWidth
      var height = shareContent.offsetHeight + 100
      var canvas = document.createElement('canvas')
      var scale = 3

      canvas.width = width * scale
      canvas.height = height * scale
      canvas.getContext('2d').scale(scale, scale)

      var opts = {
        scale: scale,
        canvas: canvas,
        // logging: true,
        width: width,
        height: height,
        useCORS: true,
        ignoreElements (ele) {
          return (ele && ele.classList && ele.classList.contains('qrcode-ignore'))
        },
        onclone (documents) {
          //  显示二维码
          let qrcodeDOM = documents && documents.getElementById('qrcodeWrapper')
          if (qrcodeDOM) qrcodeDOM.style.visibility = 'visible'
        }
      }
      let self = this
      html2canvas(shareContent, opts).then(function (canvas) {
        let imgurl = canvas.toDataURL('image/jpeg')
        self.$nextTick(() => {
          // img.style = 'position:absolute;top:0;left:0;z-index:9999;width:100%;'
          toggleLoading(false)
          upload(imgurl).then(res => {
            self.saveImgSrc = res.data
            callback && callback()
          })
        })
      }).catch(er => {
        self.isShareImg = false
        toggleLoading(false)
      })
    },
    //  生成二维码
    createQrcode (url) {
      if (url) {
        this.qrcode = QRCode({
          target: this.$refs.code,
          url: url,
          width: 100,
          height: 100,
          foreground: '#1D2831',
          background: '#ffffff'
        })
      }
    },
    fromateNormalMatch (matchList) {
      let newMatchList = []
      matchList.forEach(match => {
        let { lotteryResultDesc, betInfoDesc, lossPercent, playWayDesc, giveBallNum, playWay, isWin } = match
        let isNotExistMatch = true
        let isNotExistPlay = true
        let matchBetInfo = {betInfoDesc, lossPercent, isWin}
        let betInfoList = [matchBetInfo]
        newMatchList.map(match2 => {
          if (match2.hostTeam === match.hostTeam && match2.guestTeam === match.guestTeam && match2.matchDate === match.matchDate) {
            isNotExistMatch = false
            match2.playList.map(play => {
              if (play.playWayDesc === playWayDesc) {
                isNotExistPlay = false
                play.betInfoList.push(matchBetInfo)
              }
              return play
            })
            if (isNotExistPlay) {
              match2.playList.push({playWayDesc, giveBallNum, playWay, isWin, betInfoList})
            }
            // match2.betList.push({betInfoDesc, lossPercent, isWin})
            match2.resultList.push({lotteryResultDesc, isWin})
          }
          return match2
        })
        if (isNotExistMatch) {
          match.playList = [{playWayDesc, giveBallNum, playWay, isWin, betInfoList}]
          // match.betList = betInfoList
          match.resultList = [{lotteryResultDesc, isWin}]
          newMatchList.push(match)
        }
      })
      return newMatchList
    }
  }
}
</script>
<style lang="scss" scoped>
  $hairline-color-f6:#f6f6f6;
  .hairline--bottom-f6{
    position: relative;
    border-bottom: 1px dashed $hairline-color-f6;
  }
  $hairline-color-f1:#f1f1f1;
  .hairline--bottom-f1{
    position: relative;
    border-bottom: 1px solid $hairline-color-f1;
  }
  .hairline--bottom-f1-d{
    position: relative;
    border-bottom: 1px dashed $hairline-color-f1;
  }
  p{
    margin: 0px;
  }
  .width-33{
    width: 33.33%;
  }
  .width-50{
    width: 50%;
  }
  .width-60{
    width: 60%;
  }
  .p-tb-10{
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .guess-detail-page{
    height: 100%;
  }
  .detail-contain{
    max-height: inherit;
    margin-bottom: 110px;
  }
  .top-line{
    height: 6px;
    border-radius: 2px 2px 0px 0px;
  }
  .order-status-contain{
    margin:30px 24px 0px 24px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
    border-radius: 2px;
  }
  .h-82{
    height: 82px;
  }
  .order-name{
    margin-top: 18px;
  }
  .order-no-desc{
    height: 110px;
  }
  .s-line{
    height: 1px;
    .sline-contain{
      flex: 1;
      height: 1px;
    }
    .left-radus,.right-radus{
      width: 25px;
      height: 25px;
      border: none;
      background-color: #F0F0F0;
      border-radius: 9999px;
      position: absolute;
    }
    .left-radus{
      border-radius: 0 28px 28px 0;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%)
    }
    .right-radus{
      right: 0;
      top: 50%;
      transform: translate(50%, -50%)
    }
  }
  .order-status-text{
    height: 160px;
    .order-status-icon{
      height: 42px;
      width: 38px;
      margin-right: 20px;
      border: none;
    }
  }
  .status-time{
    margin-top: 10px;
    .text{
      margin-right: 14px;
    }
  }
  .order-apply-award{
    height: 80px;
    padding: 0 30px;
    background-color:#fbfbfb;
    .apply{
      margin-left: 34px;
      margin-right: 150px;
    }
    .apply-count,.award-count{
      margin-right: 20px;
    }
  }
  .guess-info-title{
    margin-top: 38px;
    margin-left: 24px;
    .bet-multiple{
      margin-left: 20px;
    }
  }
  .order-detail-info-contain{
    margin-top: 14px;
  }
  .tab-title{
    height: 74px;
    padding-left: 46px;
    padding-right: 56px;
    p{
      margin: 0px;
      text-align: center;
    }
  }
  .-guess-item{
    padding-left: 46px;
    padding-right: 56px;
    min-height: 150px;
    p{
      text-align: center;
    }
  }
  .width-20{
    width: 20%;
  }
  .width-40{
    width: 40%;
  }
  .order-base-info{
    padding-top: 24px;
    padding-bottom: 34px;
    padding-left: 46px;
    span{
      margin-left: 28px;
    }
  }
  .create-time{
    margin-top: 8px;
  }
  .continue-apply{
    height: 100px;
    width: 100%;
    border: none;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    text-align: center;
  }
.white-space {
  white-space: nowrap;
  text-overflow: ellipsis;
}
.m-l20 {
  margin-left: 20px;
}
.vw-ignore.logo-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
}
.m-t20 {
  margin-top: 20px;
}
#qrcodeWrapper {
  visibility: hidden;
  padding: 0 30px;
}
.vw-ignore.yhy-logo {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
img {
  content: normal !important;
}
</style>
