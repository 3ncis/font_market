<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/core/auth/authStores";
import { readErrorResponse } from "@/core/utils/apiResponse";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref("");

onMounted(async () => {
    const token = route.query.token;
    const redirect = route.query.redirect;

    await router.replace({
        path: route.path,
        query: typeof redirect === "string" ? { redirect } : {},
    });

    if (typeof token !== "string" || !token.trim()) {
        errorMessage.value = "Google tidak mengembalikan token login yang valid.";
        return;
    }

    try {
        await authStore.completeGoogleLogin(token);
    } catch (error) {
        errorMessage.value = readErrorResponse(
            error,
            "Login dengan Google gagal. Silakan coba lagi.",
        );
    }
});
</script>

<template>
    <main class="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-12">
        <section class="w-full max-w-md rounded-xl border border-[#E2E2E4] bg-white p-6 text-center shadow-sm sm:p-8">
            <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                Masuk dengan Google
            </h1>
            <p
                v-if="!errorMessage"
                class="mt-3 font-['Geist'] text-sm text-[#68686C]"
                role="status"
            >
                Memverifikasi akun Anda...
            </p>
            <div
                v-else
                class="mt-4"
            >
                <p role="alert" class="rounded border border-[#D9A49D] bg-[#FFF8F6] px-3 py-2 font-['Geist'] text-sm text-[#9A3D32]">
                    {{ errorMessage }}
                </p>
                <RouterLink
                    :to="{ name: 'login' }"
                    class="mt-5 inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 font-['Geist'] text-sm font-medium text-white transition hover:bg-[#343438]"
                >
                    Kembali ke login
                </RouterLink>
            </div>
        </section>
    </main>
</template>
