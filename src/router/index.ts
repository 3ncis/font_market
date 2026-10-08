import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
        title: 'home'
    }
    // children: [
    //   {
    //     path: '',
    //     name: 'home',
    //     component: () => import('@/views/HomeView.vue'),
    //     meta: { title: 'Katalog Font - E-Commerce' }
    //   },
    //   {
    //     path: 'font/:id',
    //     name: 'font-detail',
    //     component: () => import('@/views/FontDetailView.vue'),
    //     meta: { title: 'Detail Font' }
    //   },
    // ]
  },
  // Halaman Auth (Tanpa Navbar/Footer Utama)
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import('@/views/LoginView.vue'),
//     meta: { title: 'Masuk Akun' }
//   },
  // Catch-all route untuk 404 Not Found
//   {
//     path: '/:pathMatch(.*)*',
//     name: 'not-found',
//     component: () => import('@/views/NotFoundView.vue'),
//     meta: { title: 'Halaman Tidak Ditemukan' }
//   }
]

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

// Navigation Guard: Mengubah Judul Tab Browser Secara Otomatis
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | FontStore` : 'FontStore'
  next()
})

export default router