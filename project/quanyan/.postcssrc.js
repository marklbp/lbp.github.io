// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
    },
    /* "postcss-px2remvw": {
      exclude: /(\/|\\)(node_modules|member|memberBook|QAndA|upgradeStrategy|orderConfirm|qy-form-goods|qy-form-radio|cardBag|venueDiscount|bagList|ballotList|cardDetail|coupon|growth|inviteList|expenseList|tradeList|cardList|countCardDetail|disablebCardList|venueManage|inviteRecharge|index-list1)(\/|\\)/,
      forceRemProps: [ 'font', 'font-size']
    } */
    "postcss-write-svg": {},
    "postcss-px-to-viewport-c": { 
      viewportWidth: 750, 
      viewportHeight: 1334, 
      unitPrecision: 3, 
      viewportUnit: 'vw', 
      selectorBlackList: ['.ignore', '.hairlines'], 
      minPixelValue: 1, 
      mediaQuery: false,
      exclude: /(\/|\\)(node_modules(\/|\\)nprogress)(\/|\\)/
    }, 
    "postcss-viewport-units":{
      filterRule: (rule) => {          
        return rule.selector.indexOf('::after') < 0 && rule.selector.indexOf(':after') < 0 && rule.selector.indexOf('::before') < 0 && rule.selector.indexOf(':before') < 0 && rule.selector.indexOf('.vw-ignore') < 0;
      }
     }
  }
}
