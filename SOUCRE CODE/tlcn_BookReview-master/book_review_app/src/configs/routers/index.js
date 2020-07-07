
export const routers = [
  {
    exact: true,
    path: '/admin',
    component: 'admin'
  },
  {
    exact: true,
    path: '/login',
    component: 'login'
  },
  {
    exact: true,
    path: '/',
    component: 'main'
  },
  {
    exact: true,
    path: '/newsFeed',
    component: 'newsFeed'
  },
  {
    exact: true,
    path: '/profile/:userID',
    component: 'profile'
  },
  {
    exact: true,
    path: '/main',
    component: 'main'
  },
  {
    exact: true,
    path: '/test/:idQuiz',
    component: 'test'
  },

  {
    exact: true,
    path: '/quiz',
    component: 'quiz'
  },
  {
    exact: true,
    path:'/doquiz/:idQuiz',
    component:'doquiz'
  },
  {
    exact:true,
    path:'/result',
    component:'result'
  },
  {
    exact:true,
    path:'/training',
    component:'training'
  },
  {
    exact:true,
    path:'/dotraining/:idQuiz',
    component:'dotraining'
  },
  {
    exact:true,
    path:'/pay',
    component:'pay'
  },
  {
    exact:true,
    path:'/aboutme',
    component:'aboutme'
  },
  {
    exact:true,
    path:'/document',
    component:'tailieu'
  }
]
