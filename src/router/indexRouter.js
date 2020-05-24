import Layout from '@/layout'
const indexRouter = [
  {
    path: '/',
    component: Layout,
    redirect: '/billDashboard',
    meta: { icon: 'dashboard', title: '首页', noCache: true },
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/qy-snm/pay-management'),
        name: 'Dashboard',
        meta: { title: '交易', icon: 'dashboard', noCache: true },
        hidden: true
      }
    ]
  }
]
export default indexRouter
