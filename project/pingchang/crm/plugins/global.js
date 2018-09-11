// const log = console.log
// window.log = log
// export default log
global.log = process.env.NODE_ENV !== 'production' ? console.log : ''
// import Vue from 'vue'
// Vue.prototype.log = process.env.NODE_ENV !== 'production' ?  console.log : ''
// import Message from 'element-ui'


// import sessionStorage from '@/src/sessionStorage';

// const STORAGE = {
//   install (Vue, options) {
//     Vue.prototype.$session = new sessionStorage()
//   }
// }