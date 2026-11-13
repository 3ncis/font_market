import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/core/auth/authStores'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: { title: 'Beranda' }
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/font/:id',
    name: 'font-detail',
    component: () => import('@/views/fontdetail.vue'),
    meta: { title: 'Detail Font' }
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/catalog',
    name: 'catalog',
    component: () => import('@/views/Catalog.vue'),
    meta: { title: 'Catalog' }
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/fontdetail.vue'),
    meta: { title: 'Detail' }
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Keranjang' }
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Checkout' }
  },
  {
    path: '/payment-confirmation',
    name: 'payment-confirmation',
    component: () => import('@/views/auth/PaymentConfirmation.vue'),
    meta: { title: 'Konfirmasi Pembayaran' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: { title: 'Masuk Akun' }
  },
  {
    path: '/register/creator',
    alias: '/register/designer',
    name: 'register-creator',
    component: () => import('@/views/auth/RegisterCreatorView.vue'),
    meta: { title: 'Daftar sebagai Creator' }
  },
  {
    path: '/request-designer',
    name: 'request-designer',
    component: () => import('@/views/RequestDesignerView.vue'),
    meta: { title: 'Request Designer', requiresAuth: true },
  },
  {
    path: '/creator/fonts',
    name: 'creator-fonts',
    component: () => import('@/views/CreatorFontsView.vue'),
    meta: { title: 'Karya Font Saya', requiresAuth: true, requiresCreator: true },
  },
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    redirect: { name: 'admin-users' },
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: {
          title: 'Manajemen Pengguna',
          description: 'Kelola akun pengguna dan status akses.',
        },
      },
      {
        path: 'creator-requests',
        alias: 'designer-requests',
        name: 'admin-creator-requests',
        component: () => import('@/views/admin/AdminCreatorRequestsView.vue'),
        meta: {
          title: 'Request Creator',
          description: 'Tinjau permintaan pembuatan akun creator.',
        },
      },
      {
        path: 'fonts',
        name: 'admin-fonts',
        component: () => import('@/views/admin/AdminFontsView.vue'),
        meta: {
          title: 'Manajemen Font',
          description: 'Kelola font yang diajukan oleh creator.',
        },
      },
      {
        path: 'payments',
        name: 'admin-payments',
        component: () => import('@/views/admin/AdminPaymentsView.vue'),
        meta: {
          title: 'Manajemen Payment',
          description: 'Area pengujian verifikasi payment.',
        },
      },
    ],
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/collections',
    name: 'collections',
    component: () => import('@/views/Collections.vue'),
    meta: { title: 'Koleksi Saya' }
  },
  {
    // :id adalah parameter dinamis -> /font/sinerva, /font/swaraga, dst.
    path: '/designer',
    name: 'designer-search',
    component: () => import('@/views/DesignerSearch.vue'),
    meta: { title: 'Daftar Desainer' }
  },
  {
    path: '/designer/:id',
    name: 'designer-profile',
    component: () => import('@/views/DesignerProfileView.vue'),
    meta: { title: 'Profil Desainer' }
  },
]
  // Catch-all route untuk 404 Not Found
//   {
//     path: '/:pathMatch(.*)*',
//     name: 'not-found',
//     component: () => import('@/views/NotFoundView.vue'),
//     meta: { title: 'Halaman Tidak Ditemukan' }
//   }


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Otomatis scroll ke paling atas setiap pindah halaman
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined
  }
  const response = error.response
  if (typeof response !== 'object' || response === null || !('status' in response)) {
    return undefined
  }
  return typeof response.status === 'number' ? response.status : undefined
}

router.beforeEach(async (to) => {
  document.title = to.meta.title ? `${to.meta.title} | FontStore` : 'FontStore'

  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const requiresAuth = requiresAdmin || to.matched.some((record) => record.meta.requiresAuth)
  const requiresCreator = to.matched.some((record) => record.meta.requiresCreator)
  if (!requiresAuth) {
    return true
  }

  const authStore = useAuthStore()
  if (!authStore.token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (!authStore.user) {
    try {
      await authStore.loadCurrentUser()
    } catch (error) {
      if (getErrorStatus(error) === 401) {
        return { name: 'login', query: { redirect: to.fullPath } }
      }
      throw error
    }
  }

  if (requiresAdmin && !authStore.isAdmin) return { name: 'home' }
  if (requiresCreator && !authStore.isCreator) return { name: 'request-designer' }
  if (to.name === 'request-designer' && authStore.isCreator) {
    return { name: 'creator-fonts' }
  }
  return true
})

export default router