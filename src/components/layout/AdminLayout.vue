<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/core/auth/authStores'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const navigation = [
  { label: 'User Management', route: { name: 'admin-users' } },
  { label: 'Request Creator', route: { name: 'admin-creator-requests' } },
  { label: 'Font Management', route: { name: 'admin-fonts' } },
  { label: 'Payment Management', route: { name: 'admin-payments' } },
]
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] text-[#121214] lg:flex">
    <aside class="border-b border-[#E2E2E4] bg-white lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div class="flex min-h-16 items-center justify-between gap-3 px-5 lg:min-h-20">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-md bg-[#121214] font-serif text-xl font-bold text-white">
            A
          </div>
          <div>
            <p class="text-sm font-bold">AksaraNusa</p>
            <p class="font-mono text-[10px] tracking-wide text-[#68686C]">ADMIN MANAGEMENT</p>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded border border-[#E2E2E4] px-3 text-xs font-semibold text-[#121214] lg:hidden"
          :aria-expanded="mobileMenuOpen"
          aria-controls="admin-navigation"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          {{ mobileMenuOpen ? 'Tutup menu' : 'Menu' }}
        </button>
      </div>

      <nav
        id="admin-navigation"
        aria-label="Navigasi admin"
        :class="[
          'gap-2 px-3 pb-3 lg:flex lg:flex-col lg:overflow-visible lg:px-3 lg:pt-5',
          mobileMenuOpen ? 'flex flex-col' : 'hidden',
        ]"
      >
        <RouterLink
          v-for="item in navigation"
          :key="item.label"
          :to="item.route"
          class="shrink-0 rounded-md px-3 py-2.5 text-sm text-[#68686C] transition-colors hover:bg-[#FAF8F5] hover:text-[#121214]"
          active-class="!bg-[#121214] !text-white"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
        <div class="border-t border-[#E2E2E4] px-2 py-4 lg:hidden">
          <p class="text-xs text-[#68686C]">{{ authStore.user?.name || 'Administrator' }}</p>
          <button
            type="button"
            class="mt-2 text-sm font-medium text-[#121214] underline underline-offset-4 hover:text-[#68686C]"
            @click="authStore.logout()"
          >
            Keluar
          </button>
        </div>
      </nav>

      <div class="hidden border-t border-[#E2E2E4] px-5 py-4 lg:block">
        <p class="text-xs text-[#68686C]">{{ authStore.user?.name || 'Administrator' }}</p>
        <button
          type="button"
          class="mt-2 text-sm font-medium text-[#121214] underline underline-offset-4 hover:text-[#68686C]"
          @click="authStore.logout()"
        >
          Keluar
        </button>
      </div>
    </aside>

    <main class="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <RouterView />
    </main>
  </div>
</template>
