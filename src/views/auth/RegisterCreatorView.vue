<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminToast from "@/components/admin/AdminToast.vue";
import CreatorRegistrationApi from "@/core/api/creatorRegistration.api";
import { getApiErrorStatus, getUserFacingApiError } from "@/core/utils/userFacingApiError";

const route = useRoute();
const router = useRouter();

const token = computed(() =>
    typeof route.query.token === "string" ? route.query.token.trim() : "",
);
const isValidating = ref(true);
const isTokenValid = ref(false);
const hasValidationError = ref(false);
const invalidMessage = ref("");
const validationError = ref("");
const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const validationMessage = ref("");
const isSubmitting = ref(false);
const isRegistered = ref(false);
let validationSequence = 0;
let redirectTimer: ReturnType<typeof setTimeout> | undefined;

async function validateToken() {
    const sequence = ++validationSequence;
    isValidating.value = true;
    isTokenValid.value = false;
    hasValidationError.value = false;
    invalidMessage.value = "";
    validationError.value = "";

    if (!token.value) {
        isValidating.value = false;
        invalidMessage.value =
            "Token register tidak ditemukan. Gunakan link undangan yang dikirim ke email Anda.";
        return;
    }

    try {
        const valid = await CreatorRegistrationApi.validateToken(token.value);
        if (sequence !== validationSequence) return;
        if (valid) {
            isTokenValid.value = true;
        } else {
            invalidMessage.value =
                "Token tidak valid, sudah digunakan, atau sudah kedaluwarsa. Minta link undangan baru kepada administrator.";
        }
    } catch (error) {
        if (sequence !== validationSequence) return;
        const status = getApiErrorStatus(error);
        if (status === 401 || status === 403 || status === 404 || status === 409) {
            invalidMessage.value =
                "Token tidak valid, sudah digunakan, atau sudah kedaluwarsa. Minta link undangan baru kepada administrator.";
        } else {
            hasValidationError.value = true;
            validationError.value = getUserFacingApiError(
                error,
                "Token gagal diperiksa. Periksa koneksi lalu coba lagi.",
            );
        }
    } finally {
        if (sequence === validationSequence) isValidating.value = false;
    }
}

function validateForm() {
    const normalizedEmail = email.value.trim();
    const passwordIsValid =
        password.value.length >= 8 &&
        password.value.length <= 72 &&
        /[a-z]/.test(password.value) &&
        /[A-Z]/.test(password.value) &&
        /\d/.test(password.value);

    if (name.value.trim().length < 2 || name.value.trim().length > 100) {
        validationMessage.value = "Nama harus berisi 2 sampai 100 karakter.";
        return false;
    }

    if (
        normalizedEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
        validationMessage.value = "Masukkan alamat email yang valid.";
        return false;
    }

    if (!passwordIsValid) {
        validationMessage.value =
            "Password harus berisi 8–72 karakter, huruf besar, huruf kecil, dan angka.";
        return false;
    }

    validationMessage.value = "";
    return true;
}

async function submitRegistration() {
    if (isSubmitting.value || !isTokenValid.value || !validateForm()) return;

    isSubmitting.value = true;
    try {
        await CreatorRegistrationApi.register({
            token: token.value,
            name: name.value.trim(),
            email: email.value.trim().toLowerCase(),
            password: password.value,
        });
        isRegistered.value = true;
        redirectTimer = setTimeout(
            () => void router.replace({ name: "login" }),
            2400,
        );
    } catch (error) {
        const status = getApiErrorStatus(error);
        if (status === 401 || status === 403 || status === 404 || status === 409) {
            isTokenValid.value = false;
            invalidMessage.value =
                status === 409
                    ? "Email sudah terdaftar atau token sudah digunakan. Periksa kembali atau minta link undangan baru."
                    : "Token tidak valid, sudah digunakan, atau sudah kedaluwarsa. Minta link undangan baru kepada administrator.";
        } else {
            validationMessage.value = getUserFacingApiError(
                error,
                "Pendaftaran gagal. Periksa koneksi lalu coba lagi.",
            );
        }
    } finally {
        isSubmitting.value = false;
    }
}

watch(token, () => void validateToken(), { immediate: true });

onBeforeUnmount(() => {
    validationSequence += 1;
    if (redirectTimer) clearTimeout(redirectTimer);
});
</script>

<template>
    <main class="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-10">
        <section class="w-full max-w-xl rounded-xl border border-[#E2E2E4] bg-white p-6 shadow-sm sm:p-8">
            <RouterLink
                :to="{ name: 'home' }"
                class="text-sm font-semibold text-[#121214]"
            >
                AksaraNusa
            </RouterLink>

            <div class="mt-8">
                <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">
                    AKUN CREATOR
                </p>
                <h1 class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Daftar sebagai creator
                </h1>
                <p class="mt-2 text-sm leading-6 text-[#68686C]">
                    Lengkapi data di bawah untuk membuat akun creator Anda.
                </p>
            </div>

            <div
                v-if="isValidating"
                class="mt-7 space-y-3"
                role="status"
                aria-label="Memeriksa token"
            >
                <div class="h-11 animate-pulse rounded bg-[#F1F1F0]" />
                <div class="h-11 animate-pulse rounded bg-[#F1F1F0]" />
                <div class="h-11 animate-pulse rounded bg-[#F1F1F0]" />
            </div>

            <div
                v-else-if="hasValidationError"
                class="mt-7 rounded border border-[#D9A49D] bg-[#FFF8F6] p-4"
                role="alert"
            >
                <p class="text-sm text-[#9A3D32]">{{ validationError }}</p>
                <button
                    type="button"
                    class="mt-4 rounded bg-[#121214] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#343438]"
                    @click="validateToken"
                >
                    Coba lagi
                </button>
            </div>

            <div
                v-else-if="!isTokenValid && !isRegistered"
                class="mt-7 rounded border border-[#D9A49D] bg-[#FFF8F6] p-4"
                role="alert"
            >
                <p class="text-sm leading-6 text-[#9A3D32]">{{ invalidMessage }}</p>
                <RouterLink
                    :to="{ name: 'home' }"
                    class="mt-4 inline-flex h-10 items-center rounded bg-[#121214] px-4 text-sm font-medium text-white hover:bg-[#343438]"
                >
                    Kembali ke beranda
                </RouterLink>
            </div>

            <div
                v-else-if="isRegistered"
                class="mt-7 rounded border border-[#B8D9C1] bg-[#F4FAF5] p-4"
                role="status"
                aria-live="polite"
            >
                <p class="text-sm leading-6 text-[#28633B]">
                    Pendaftaran berhasil. Anda akan diarahkan ke halaman login.
                </p>
            </div>

            <form
                v-else
                class="mt-7 flex flex-col gap-5"
                novalidate
                @submit.prevent="submitRegistration"
            >
                <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                    Nama
                    <input
                        v-model="name"
                        type="text"
                        name="name"
                        autocomplete="name"
                        required
                        minlength="2"
                        maxlength="100"
                        :disabled="isSubmitting"
                        class="h-11 rounded border border-[#D1C9B8] px-3 text-sm outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                        placeholder="Nama lengkap"
                    />
                </label>

                <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                    Email
                    <input
                        v-model="email"
                        type="email"
                        name="email"
                        autocomplete="email"
                        required
                        maxlength="254"
                        :disabled="isSubmitting"
                        class="h-11 rounded border border-[#D1C9B8] px-3 text-sm outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                        placeholder="nama@email.com"
                    />
                </label>

                <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                    Password
                    <span class="relative">
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            name="password"
                            autocomplete="new-password"
                            required
                            minlength="8"
                            maxlength="72"
                            :disabled="isSubmitting"
                            class="h-11 w-full rounded border border-[#D1C9B8] px-3 pr-20 text-sm outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                            placeholder="Buat password"
                        />
                        <button
                            type="button"
                            :disabled="isSubmitting"
                            class="absolute inset-y-0 right-3 text-xs font-semibold text-[#68686C] hover:text-[#121214] disabled:opacity-50"
                            @click="showPassword = !showPassword"
                        >
                            {{ showPassword ? "Sembunyikan" : "Tampilkan" }}
                        </button>
                    </span>
                    <span class="text-xs font-normal text-[#68686C]">
                        Minimal 8 karakter, huruf besar, huruf kecil, dan angka.
                    </span>
                </label>

                <p
                    v-if="validationMessage"
                    role="alert"
                    class="rounded border border-[#D9A49D] bg-[#FFF8F6] px-3 py-2 text-sm text-[#9A3D32]"
                >
                    {{ validationMessage }}
                </p>

                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#121214] px-4 text-sm font-medium text-white transition hover:bg-[#343438] disabled:cursor-wait disabled:opacity-60"
                >
                    <span
                        v-if="isSubmitting"
                        class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-hidden="true"
                    />
                    {{ isSubmitting ? "Memproses..." : "Daftar" }}
                </button>
            </form>

            <AdminToast
                :show="isRegistered"
                message="Pendaftaran berhasil. Mengarahkan ke login..."
            />
        </section>
    </main>
</template>
