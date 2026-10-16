<template>
    <footer class="w-full bg-white px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 lg:px-20 lg:pt-20">
        <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-10 sm:gap-12 lg:gap-[60px]">

            <!-- Footer Main Content -->
            <div class="flex flex-col justify-between gap-10 lg:flex-row lg:gap-12">

                <!-- Brand & Description -->
                <div class="flex w-full flex-col items-start gap-5 lg:max-w-[405px]">
                    <!-- Logo -->
                    <a href="/" class="inline-flex items-center gap-3">
                        <div class="flex h-9 w-9 items-center justify-center rounded-md bg-[#121214]">
                            <span class="font-serif text-[22px] font-bold text-[#FAF8F5]">
                                A
                            </span>
                        </div>

                        <span class="text-xl font-bold text-[#121214]">
                            AksaraNusa
                        </span>
                    </a>

                    <!-- Description -->
                    <p class="text-[15px] leading-6 text-[#6B7280]">
                        Arsip digital inklusif yang mendokumentasikan, merayakan, dan
                        mendistribusikan berkas rupa huruf (typeface) karya perupa huruf
                        andal dari berbagai penjuru Nusantara.
                    </p>
                </div>

                <!-- Footer Navigation -->
                <div
                    class="grid grid-cols-1 gap-8 min-[400px]:grid-cols-2 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-3 lg:gap-10 xl:gap-20">

                    <!-- Direktori -->
                    <div class="flex flex-col gap-4">
                        <h3 class="font-mono text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                            Direktori
                        </h3>

                        <div class="flex flex-col items-start gap-3">
                            <a href="/fonts" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Daftar Rupa Huruf
                            </a>

                            <a href="/designers" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Desainer Lokal
                            </a>

                            <a href="/licenses" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Lisensi Aksara
                            </a>

                            <a href="/categories" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Kategori Budaya
                            </a>
                        </div>
                    </div>

                    <!-- Sumber Daya -->
                    <div class="flex flex-col gap-4">
                        <h3 class="font-mono text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                            Sumber Daya
                        </h3>

                        <div class="flex flex-col items-start gap-3">
                            <a href="/contribute" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Pedoman Kontribusi
                            </a>

                            <a href="/typography-guide"
                                class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Buku Panduan Tipografi
                            </a>

                            <a href="/articles" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Artikel Jurnal
                            </a>

                            <a href="/interviews" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Wawancara Eksklusif
                            </a>
                        </div>
                    </div>

                    <!-- Kerjasama -->
                    <div class="flex flex-col gap-4">
                        <h3 class="font-mono text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                            Kerjasama
                        </h3>

                        <div class="flex flex-col items-start gap-3">
                            <a href="/about" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Tentang Kami
                            </a>

                            <a href="/partnership"
                                class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Kemitraan Studio
                            </a>

                            <a href="/contact" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Kontak Redaksi
                            </a>

                            <a href="/privacy" class="text-sm text-[#6B7280] transition-colors hover:text-[#121214]">
                                Kebijakan Privasi
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Footer Bottom -->
            <div
                class="flex flex-col gap-6 border-t border-[#E5E7EB] pt-6 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">

                <!-- Copyright -->
                <p class="max-w-full font-mono text-[10px] leading-5 text-[#6B7280] sm:text-xs">
                    © 2026 AKSARANUSA ARCHIVE. DIKEMBANGKAN OLEH KOMUNITAS PERUPA HURUF INDONESIA.
                </p>

                <!-- Social Media -->
                <div class="flex items-center gap-5">

                    <!-- Instagram -->
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                        aria-label="Instagram AksaraNusa" class="text-[#6B7280] transition-colors hover:text-[#121214]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                        </svg>
                    </a>

                    <!-- TikTok -->
                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer"
                        aria-label="TikTok AksaraNusa" class="text-[#6B7280] transition-colors hover:text-[#121214]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M9 12a4 4 0 1 0 4 4V3c1.2 2.5 3 4 6 4" />
                        </svg>
                    </a>

                    <!-- Facebook -->
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
                        aria-label="Facebook AksaraNusa" class="text-[#6B7280] transition-colors hover:text-[#121214]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path
                                d="M15 21v-8h3l.5-4H15V7c0-1.2.4-2 2-2h2V1.5C18.3 1.3 17.3 1 16 1c-3.2 0-5 1.9-5 5.4V9H8v4h3v8h4Z" />
                        </svg>
                    </a>

                </div>
            </div>

        </div>
    </footer>
</template>