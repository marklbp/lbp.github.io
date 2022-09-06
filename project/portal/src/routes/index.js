import Layout from '@/layout'
import customRoutes from './custom'
let custom = []
if (customRoutes) {
  custom = customRoutes.filter(
    c => !c.meta || (typeof c.meta === 'object' && c.meta && !c.meta.top)
  )
}
let topRoutes = customRoutes.filter(
  c => typeof c.meta === 'object' && c.meta && c.meta.top
)
let asyncLoad = n => _ => import(`@/${n}`)
const routes = [
  ...topRoutes,
  {
    path: '/',
    component: Layout,
    children: [
      ...custom,
      {
        path: '*',
        component: asyncLoad('error')
      }
    ]
  }
]
export default {
  mode: 'history',
  routes
}
