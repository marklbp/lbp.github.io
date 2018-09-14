import wurl from 'wurl'
import trace, {pageview, debug, config} from '@/services/trace'

const before = (to, from, next) => {
  trace.pageview(`/${wurl(1)}/#${to.path}`, from.path === '/' ? '' : wurl())
  next()
}

export default {
  install (vue, opts) {
    window.location.href.indexOf('h5.yingheying.com') !== -1 || debug()
    config(opts)
    vue.prototype.$trace = trace
    vue.prototype.$trace.debug = debug
    vue.prototype.$trace.pageview = pageview

    opts.router && opts.router.beforeEach(before)
  }
}
