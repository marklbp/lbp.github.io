// 这里由build/prepare.js自动生成，无需手动修改
import dashboard from '@/dashboard/api.js'
import demo from '@/demo/api.js'
import knowledge from '@/knowledge/api.js'
import store from '@/store/api.js'
import task from '@/task/api.js'
export default {
  ...dashboard,
  ...demo,
  ...knowledge,
  ...store,
  ...task
}