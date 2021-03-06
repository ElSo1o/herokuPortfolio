
export default [
  {
    path: '/',
    component: () => import('layouts/main_section'),
    redirect: 'index',
    children: [
      {
        path: '/',
        component: () => import('layouts/default'),
        redirect: 'index',
        children: [
          {
            path: 'index',
            component: () => import('pages/index'),
            name: 'index',
            redirect: 'index/home',
            children: [
              {
                path: 'home',
                name: 'home',
                component: () => import('components/views/home')
              },
              {
                path: 'skills',
                name: 'skills',
                component: () => import('components/views/skills')
              },
              {
                path: 'portfolio',
                name: 'portfolio',
                component: () => import('components/views/portfolio')
              },
              {
                path: 'contacts',
                name: 'contacts',
                component: () => import('components/views/contacts')
              }
            ]
          }
        ]
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/login')
      }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
