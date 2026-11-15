<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/core/cart/cartStore';
import { useAuthStore } from '@/core/auth/authStores';

export default defineComponent({
  name: 'AppHeader',

  setup() {
    const isVisible = ref(true);
    const isUserMenuOpen = ref(false);
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    let lastScrollY = 0;
    let ticking = false;

    const closeUserMenu = () => {
      isUserMenuOpen.value = false;
    };

    const handleDocumentClick = (event) => {
      if (!event.target.closest('[data-user-menu]')) {
        closeUserMenu();
      }
    };

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeUserMenu();
      }
    };

    const handleLogout = async () => {
      closeUserMenu();
      await authStore.logout();
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;

        // Navbar selalu terlihat saat berada di bagian paling atas.
        if (currentScrollY <= 10) {
          isVisible.value = true;
        }
        // Scroll ke bawah: sembunyikan navbar.
        else if (scrollDifference > 0) {
          isVisible.value = false;
        }
        // Scroll ke atas: tampilkan kembali navbar.
        else if (scrollDifference < 0) {
          isVisible.value = true;
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
    };

    onMounted(() => {
      lastScrollY = window.scrollY;

      window.addEventListener('scroll', handleScroll, {
        passive: true,
      });
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleKeydown);

      if (authStore.token && !authStore.user) {
        authStore.loadCurrentUser().catch((error) => {
          console.error('Gagal memuat profil pengguna untuk navigasi akun.', error);
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeydown);
    });

    return {
      isVisible,
      isUserMenuOpen,
      cartStore,
      authStore,
      closeUserMenu,
      handleLogout,
    };
  },

  components: {
    RouterLink,
  },
});
</script>

<template>
  <nav
    :class="[
      'fixed left-0 top-0 z-50 w-full border-b border-[#E2E2E4] bg-white transition-transform duration-300 ease-in-out',
      isVisible ? 'translate-y-0' : '-translate-y-full',
    ]"
  >
    <div
      class="mx-auto flex min-h-[76px] w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-[90px] lg:px-20"
    >
      <RouterLink :to="{ name: 'home' }" class="flex shrink-0 items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-[#121214]">
          <span class="font-serif text-[22px] font-bold text-white">
            A
          </span>
        </div>

        <div class="flex flex-col gap-[3px]">
          <span class="text-lg font-bold leading-tight text-[#121214]">
            AksaraNusa
          </span>

          <span class="whitespace-nowrap font-mono text-[9px] font-normal tracking-wide text-[#68686C]">
            PERUPA HURUF INDONESIA
          </span>
        </div>
      </RouterLink>

      <div class="hidden items-center gap-7 lg:flex">
        <RouterLink
          :to="{ name: 'catalog' }"
          class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]"
        >
          Eksplorasi
        </RouterLink>

        <RouterLink
          :to="{ name: authStore.isCreator ? 'creator-fonts' : 'request-designer' }"
          class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]"
        >
          Hasil Pencarian
        </RouterLink>

        <RouterLink
          :to="{ name: 'home' }"
          class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]"
        >
          Detail Font
        </RouterLink>

        <RouterLink
          :to="{ name: 'designer-search' }"
          class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]"
        >
          Daftar Desainer
        </RouterLink>
      </div>

      <div class="flex shrink-0 items-center gap-3 sm:gap-[18px]">
        <RouterLink
          :to="{ name: 'collections' }"
          class="hidden text-[13px] font-normal text-[#68686C] transition-colors hover:text-[#121214] sm:block"
        >
          Koleksi Saya
        </RouterLink>

        <RouterLink
          :to="{ name: 'cart' }"
          aria-label="Keranjang belanja"
          class="relative flex h-9 w-9 items-center justify-center rounded-md text-[#121214] transition-colors hover:bg-[#FAF8F5]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>

          <span
            class="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#121214] px-1 font-mono text-[10px] text-white"
          >
            {{ cartStore.itemCount }}
          </span>
        </RouterLink>

        <div v-if="authStore.isAuthenticated" class="relative" data-user-menu>
          <button
            type="button"
            aria-label="Menu akun"
            aria-haspopup="menu"
            :aria-expanded="isUserMenuOpen"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E2E4] text-[#121214] transition-colors hover:bg-[#FAF8F5]"
            @click.stop="isUserMenuOpen = !isUserMenuOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </button>

          <div
            v-if="isUserMenuOpen"
            role="menu"
            aria-label="Menu akun"
            class="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border border-[#E2E2E4] bg-white py-2 shadow-lg"
          >
            <p class="truncate px-4 py-2 text-xs text-[#68686C]">
              {{ authStore.user?.name || 'Akun saya' }}
            </p>
            <RouterLink
              :to="{ name: authStore.isCreator ? 'creator-fonts' : 'request-designer' }"
              role="menuitem"
              class="block px-4 py-2.5 text-sm font-medium text-[#121214] transition-colors hover:bg-[#FAF8F5]"
              @click="closeUserMenu"
            >
              {{ authStore.isCreator ? 'Submit Karya' : 'Jadi Designer' }}
            </RouterLink>
            <div class="my-1 border-t border-[#E2E2E4]"></div>
            <button
              type="button"
              role="menuitem"
              class="block w-full px-4 py-2.5 text-left text-sm font-medium text-[#68686C] transition-colors hover:bg-[#FAF8F5] hover:text-[#121214]"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>

        <RouterLink
          v-else
          :to="{ name: 'login' }"
          class="inline-flex items-center justify-center rounded bg-[#121214] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#343438] sm:text-[13px]"
        >
          Login
        </RouterLink>
      </div>
    </div>
  </nav>
</template>