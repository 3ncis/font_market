<template>
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <RouterLink :to="{ name: 'home' }" class="text-xl font-black tracking-tight text-primary-600">
          FONT<span class="text-gray-900">STORE</span>
        </RouterLink>

        <nav class="flex items-center gap-6 text-sm font-medium">
          <RouterLink 
            :to="{ name: 'home' }" 
            class="text-gray-600 hover:text-primary-600 transition"
            exact-active-class="text-primary-600 font-bold"
          >
            Katalog
          </RouterLink>
          <RouterLink 
            :to="{name: 'home'}" 
            class="text-gray-600 hover:text-primary-600 transition flex items-center gap-1"
            exact-active-class="text-primary-600 font-bold"
          >
            Keranjang
          </RouterLink>
          <RouterLink 
            :to="{ name: 'home' }" 
            class="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition"
          >
            Masuk
          </RouterLink>
        </nav>
      </div>
    </header>
</template>