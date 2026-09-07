import { createRouter, createWebHistory } from 'vue-router'
import { API_BASE } from '@/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/orders',
      name: 'Dashboard',
      component: () => import('../views/Orders/ViewOrders.vue'),
      meta: {
        title: 'Amcotts Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Orders/ViewOrders.vue'),
      meta: {
        title: 'Amcotts Dashboard',
        requiresAuth: true,
      },
    },

    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
        requiresAuth: true,
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
        requiresAuth: false,
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
        requiresAuth: false,
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
        requiresAuth: false,
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
        requiresAuth: true,
      },
    },
    {
      path: '/orders',
      name: 'View Orders',
      component: () => import('../views/Orders/ViewOrders.vue'),
      meta: {
        title: 'Orders',
        requiresAuth: true,
      },
    },
    {
      path: '/create-order',
      name: 'Create Order',
      component: () => import('../views/Orders/CreateOrder.vue'),
      meta: {
        title: 'Create Order',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id/edit',
      name: 'Edit Order',
      component: () => import('../views/Orders/EditOrder.vue'),
      meta: {
        title: 'Edit Order',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id/sign',
      name: 'Sign Order',
      component: () => import('../views/Orders/SignOrder.vue'),
      meta: {
        title: 'Sign Order',
        requiresAuth: true,
      },
    },
    {
      path: '/contracts',
      name: 'View Contracts',
      component: () => import('../views/Contracts/ViewContracts.vue'),
      meta: {
        title: 'Contracts',
        requiresAuth: true,
      },
    },
    {
      path: '/contracts/create',
      name: 'Create Contract',
      component: () => import('../views/Contracts/CreateContract.vue'),
      meta: {
        title: 'Create Contract',
        requiresAuth: true,
      },
    },
    {
      path: '/contracts/:id/sign',
      name: 'Sign Contract',
      component: () => import('../views/Contracts/SignContract.vue'),
      meta: {
        title: 'Sign Contract',
        requiresAuth: true,
      },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
        requiresAuth: true,
      },
    }
  ],
})

export default router

router.beforeEach(async (to) => {
  document.title = `Amcotts ${to.meta.title} | `

  const token = localStorage.getItem('token')
  console.log('Token from localStorage:', token) // Debugging line to check the token value
  const isAuthPage = to.path === '/signin' || to.path === '/signup'

  const validateToken = async () => {
    if (!token) {
      return false
    }

    try {
      const response = await fetch(`${API_BASE}/token/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: token }),
      })

      if (!response.ok) {
        localStorage.removeItem('token')
        return false
      }

      return true
    } catch (error) {
      console.error('Token validation failed:', error)
      localStorage.removeItem('token')
      return false
    }
  }

  if (isAuthPage) {
    const isTokenValid = await validateToken()
    if (isTokenValid) {
      return '/'
    }
    return true
  }

  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    return true
  }

  if (!token) {
    return '/signin'
  }

  const isTokenValid = await validateToken()
  if (!isTokenValid) {
    return '/signin'
  }

  return true
})
