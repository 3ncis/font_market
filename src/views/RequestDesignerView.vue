<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/components/layout/applayout.vue";
import AdminToast from "@/components/admin/AdminToast.vue";
import DesignerRequestApi, {
    type DesignerRequest,
} from "@/core/api/designerRequest.api";
import { useAuthStore } from "@/core/auth/authStores";
import {
    getApiErrorStatus,
    getUserFacingApiError,
} from "@/core/utils/userFacingApiError";

const authStore = useAuthStore();
const router = useRouter();
const request = ref<DesignerRequest | null>(null);
const phone = ref("");
const isLoading = ref(true);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const errorMessage = ref("");
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");

function showToast(message: string, variant: "success" | "error" = "success") {
    toastMessage.value = message;
    toastVariant.value = variant;
}

async function loadRequest() {
    isLoading.value = true;
    errorMessage.value = "";
    try {
        request.value = await DesignerRequestApi.getMine();
        phone.value = request.value?.phone ?? "";
    } catch (error) {
        if (getApiErrorStatus(error) === 401) {
            authStore.clearAuth();
            await router.replace({
                name: "login",
                query: { redirect: router.currentRoute.value.fullPath },
            });
            return;
        }
        errorMessage.value = getUserFacingApiError(
            error,
            "Status request designer gagal dimuat. Coba lagi.",
        );
    } finally {
        isLoading.value = false;
    }
}

async function submitRequest() {
    const normalizedPhone = phone.value.trim();
    if (isSubmitting.value || normalizedPhone.length < 7 || normalizedPhone.length > 30) {
        return;
    }

    isSubmitting.value = true;
    try {
        request.value = await DesignerRequestApi.submit(normalizedPhone);
        isModalOpen.value = false;
        showToast("Request designer berhasil dikirim ke admin.");
    } catch (error) {
        showToast(
            getUserFacingApiError(
                error,
                "Request designer gagal dikirim. Coba lagi.",
            ),
            "error",
        );
    } finally {
        isSubmitting.value = false;
    }
}

function statusLabel(status: DesignerRequest["status"]) {
    if (status === "approved") return "Disetujui";
    if (status === "rejected") return "Ditolak";
    if (status === "expired") return "Undangan kedaluwarsa";
    return "Menunggu pemeriksaan";
}

onMounted(() => void loadRequest());
</script>

<template>
    <AppLayout>
    <main class="min-h-screen bg-[#FAF8F5] px-4 py-10 sm:px-6 lg:px-20">
        <section class="mx-auto max-w-3xl rounded-xl border border-[#E2E2E4] bg-white p-6 sm:p-9">
            <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">
                CREATOR PROGRAM
            </p>
            <h1 class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                Ajukan diri menjadi designer
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-[#68686C]">
                Admin akan memeriksa data Anda. Setelah disetujui, tautan pendaftaran
                satu kali akan dikirim ke email akun untuk melengkapi profil toko.
            </p>

            <div v-if="isLoading" class="mt-8 space-y-3" role="status">
                <div class="h-14 animate-pulse rounded bg-[#F1F1F0]" />
                <div class="h-14 animate-pulse rounded bg-[#F1F1F0]" />
            </div>
            <div v-else-if="errorMessage" class="mt-7 rounded border border-[#D9A49D] bg-[#FFF8F6] p-4" role="alert">
                <p class="text-sm text-[#9A3D32]">{{ errorMessage }}</p>
                <button class="mt-3 text-sm font-semibold underline" type="button" @click="loadRequest">
                    Coba lagi
                </button>
            </div>
            <div v-else class="mt-7 rounded-lg border border-[#E2E2E4] bg-[#FAF8F5] p-5">
                <dl class="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                        <dt class="text-xs text-[#68686C]">Nama akun</dt>
                        <dd class="mt-1 font-medium text-[#121214]">{{ authStore.user?.name }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs text-[#68686C]">Email akun</dt>
                        <dd class="mt-1 break-all font-medium text-[#121214]">{{ authStore.user?.email }}</dd>
                    </div>
                </dl>

                <div v-if="request" class="mt-5 border-t border-[#E2E2E4] pt-5">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p class="text-xs text-[#68686C]">Status pengajuan</p>
                            <p class="mt-1 font-semibold text-[#121214]">{{ statusLabel(request.status) }}</p>
                        </div>
                        <span
                            class="rounded-full px-3 py-1 text-xs font-semibold"
                            :class="request.status === 'approved'
                                ? 'bg-[#E7F4E9] text-[#28633B]'
                                : request.status === 'rejected' || request.status === 'expired'
                                  ? 'bg-[#FFF0ED] text-[#9A3D32]'
                                  : 'bg-[#FFF5D9] text-[#745710]'"
                        >
                            {{ statusLabel(request.status) }}
                        </span>
                    </div>
                    <p v-if="request.review_note" class="mt-3 text-sm leading-6 text-[#68686C]">
                        Catatan admin: {{ request.review_note }}
                    </p>
                    <p class="mt-3 text-xs text-[#68686C]">Nomor telepon: {{ request.phone }}</p>
                </div>

                <div v-if="!request || request.status === 'rejected' || request.status === 'expired'" class="mt-6">
                    <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 text-sm font-semibold text-white transition hover:bg-[#343438]"
                        @click="isModalOpen = true"
                    >
                        {{ request ? "Ajukan kembali" : "Verifikasi designer" }}
                    </button>
                </div>
                <p v-else-if="request.status === 'approved'" class="mt-5 text-sm leading-6 text-[#28633B]">
                    Request disetujui. Periksa email Anda untuk tautan pendaftaran profil toko.
                </p>
                <p v-if="request?.status === 'expired'" class="mt-5 text-sm leading-6 text-[#9A3D32]">
                    Tautan pendaftaran sudah kedaluwarsa. Ajukan kembali untuk meminta persetujuan baru.
                </p>
            </div>
        </section>

        <div
            v-if="isModalOpen"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
            role="presentation"
            @click.self="isModalOpen = false"
        >
            <section
                class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="designer-request-title"
            >
                <h2 id="designer-request-title" class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                    Data request designer
                </h2>
                <p class="mt-2 text-sm leading-6 text-[#68686C]">
                    Nama dan email diambil dari akun Anda. Admin akan menggunakan
                    nomor telepon berikut untuk menghubungi Anda.
                </p>
                <form class="mt-5 flex flex-col gap-4" @submit.prevent="submitRequest">
                    <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                        Nama
                        <input
                            :value="authStore.user?.name ?? ''"
                            disabled
                            class="h-11 rounded border border-[#D1C9B8] bg-[#F6F6F5] px-3 text-sm"
                        />
                    </label>
                    <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                        Email
                        <input
                            :value="authStore.user?.email ?? ''"
                            type="email"
                            disabled
                            class="h-11 rounded border border-[#D1C9B8] bg-[#F6F6F5] px-3 text-sm"
                        />
                    </label>
                    <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                        Nomor telepon
                        <input
                            v-model="phone"
                            type="tel"
                            autocomplete="tel"
                            required
                            minlength="7"
                            maxlength="30"
                            pattern="[+0-9() .-]+"
                            class="h-11 rounded border border-[#D1C9B8] px-3 text-sm outline-none focus:border-[#121214]"
                            placeholder="+62 812 3456 7890"
                        />
                    </label>
                    <div class="mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            class="h-10 rounded border border-[#D1C9B8] px-4 text-sm font-medium text-[#121214]"
                            :disabled="isSubmitting"
                            @click="isModalOpen = false"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="h-10 rounded bg-[#121214] px-4 text-sm font-semibold text-white disabled:opacity-50"
                            :disabled="isSubmitting"
                        >
                            {{ isSubmitting ? "Mengirim..." : "Kirim request" }}
                        </button>
                    </div>
                </form>
            </section>
        </div>

        <AdminToast
            :show="Boolean(toastMessage)"
            :message="toastMessage"
            :variant="toastVariant"
            @dismiss="toastMessage = ''"
        />
    </main>
    </AppLayout>
</template>
