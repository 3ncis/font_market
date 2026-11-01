<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/core/auth/authStores";
import { readErrorResponse } from "@/core/utils/apiResponse";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

async function submitLogin() {
    if (isSubmitting.value) return;

    errorMessage.value = "";
    isSubmitting.value = true;

    try {
        await authStore.login(email.value.trim(), password.value);
    } catch (error) {
        errorMessage.value = readErrorResponse(
            error,
            "Login gagal. Periksa email dan password Anda, lalu coba lagi.",
        );
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <main class="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-12">
        <section class="w-full max-w-md rounded-xl border border-[#E2E2E4] bg-white p-6 shadow-sm sm:p-8">
            <RouterLink
                :to="{ name: 'home' }"
                class="font-['Geist'] text-sm font-semibold text-[#121214]"
            >
                AksaraNusa
            </RouterLink>

            <div class="mt-8">
                <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Masuk ke akun
                </h1>
                <p class="mt-2 font-['Geist'] text-sm leading-relaxed text-[#68686C]">
                    Masuk untuk mengakses koleksi dan data akun Anda.
                </p>
            </div>

            <form class="mt-7 flex flex-col gap-5" @submit.prevent="submitLogin">
                <div class="flex flex-col gap-2">
                    <label for="login-email" class="font-['Geist'] text-sm font-medium text-[#121214]">
                        Email
                    </label>
                    <input
                        id="login-email"
                        v-model="email"
                        type="email"
                        name="email"
                        autocomplete="email"
                        required
                        :disabled="isSubmitting"
                        class="h-11 rounded border border-[#D1C9B8] px-3 font-['Geist'] text-sm text-[#121214] outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                        placeholder="nama@email.com"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="login-password" class="font-['Geist'] text-sm font-medium text-[#121214]">
                        Password
                    </label>
                    <input
                        id="login-password"
                        v-model="password"
                        type="password"
                        name="password"
                        autocomplete="current-password"
                        required
                        :disabled="isSubmitting"
                        class="h-11 rounded border border-[#D1C9B8] px-3 font-['Geist'] text-sm text-[#121214] outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                        placeholder="Masukkan password"
                    />
                </div>

                <p
                    v-if="errorMessage"
                    role="alert"
                    class="rounded border border-[#D9A49D] bg-[#FFF8F6] px-3 py-2 font-['Geist'] text-sm text-[#9A3D32]"
                >
                    {{ errorMessage }}
                </p>

                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-4 font-['Geist'] text-sm font-medium text-white transition hover:bg-[#343438] disabled:cursor-wait disabled:opacity-60"
                >
                    {{ isSubmitting ? "Memproses..." : "Masuk" }}
                </button>
            </form>
        </section>
    </main>
</template>