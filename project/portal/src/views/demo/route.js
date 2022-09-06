import X from './routes/x'
export default [
  {
    path: '/demo',
    component: _ => import('./index'),
    meta: { top: true, free: true }
  },
  {
    path: '/rich-text',
    component: _ => import('./editor'),
    meta: { top: true, free: true }
  },
  {
    path: '/ui',
    component: _ => import('./views/ui'),
    meta: { top: true, free: true }
  },
  {
    path: '/icon',
    component: _ => import('./views/icon'),
    meta: { top: true }
  },
  {
    path: '/gantt',
    component: _ => import('./views/gantt'),
    meta: { top: true, free: true }
  },
  ...X
]
