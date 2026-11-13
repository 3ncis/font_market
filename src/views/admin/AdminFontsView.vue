<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal.vue";
import AdminPagination from "@/components/admin/AdminPagination.vue";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge.vue";
import AdminToast from "@/components/admin/AdminToast.vue";
import AdminFontApi from "@/core/api/adminFont.api";
import type { CreatorFont } from "@/core/api/fontSubmission.api";
import { useAuthStore } from "@/core/auth/authStores";
import {
    getApiErrorStatus,
    getUserFacingApiError,
} from "@/core/utils/userFacingApiError";

type ReviewDecision = "approved" | "changes_requested" | "rejected";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const fonts = ref<CreatorFont[]>([]);
const selectedFont = ref<CreatorFont | null>(null);
const page = ref(1);
const totalPages = ref(0);
const total = ref(0);
const isLoading = ref(false);
const isDetailLoading = ref(false);
const isSubmitting = ref(false);
const downloadingFamily = ref<number | null>(null);
const hasError = ref(false);
const errorMessage = ref("");
const note = ref("");
const selectedDecision = ref<ReviewDecision>("approved");
const isReviewModalOpen = ref(false);
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");

function showToast(message: string, variant: "success" | "error" = "success") {
    toastMessage.value = message;
    toastVariant.value = variant;
}

function redirectForAuthorizationError(status: number | undefined) {
    if (status === 401) {
        authStore.clearAuth();
        void router.replace({ name: "login", query: { redirect: route.fullPath } });
        return true;
    }
    if (status === 403) {
        void router.replace({ name: "home" });
        return true;
    }
    return false;
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatBytes(bytes: number) {
    return bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getCategoryName(font: CreatorFont) {
    return typeof font.category_id === "object"
        ? font.category_id.name ?? "—"
        : "—";
}

function getCreator(font: CreatorFont) {
    const value = font.user_id;
    if (typeof value === "object" && value !== null && "name" in value) {
        return typeof value.name === "string" ? value.name : "—";
    }
    return "—";
}

async function loadFonts() {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";
    try {
        const result = await AdminFontApi.list(page.value, 10);
        fonts.value = result.items;
        total.value = result.meta.total;
        totalPages.value = result.meta.total_pages;
        page.value = result.meta.page;
        if (selectedFont.value && !result.items.some((font) => font.id === selectedFont.value?.id)) {
            selectedFont.value = null;
        }
    } catch (error) {
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        hasError.value = true;
        errorMessage.value = getUserFacingApiError(
            error,
            "Antrean font gagal dimuat. Periksa koneksi lalu coba lagi.",
        );
    } finally {
        isLoading.value = false;
    }
}

async function openFont(font: CreatorFont) {
    selectedFont.value = font;
    isDetailLoading.value = true;
    try {
        selectedFont.value = await AdminFontApi.getDetail(font.id);
        note.value = "";
    } catch (error) {
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        showToast(
            getUserFacingApiError(error, "Detail font gagal dimuat."),
            "error",
        );
    } finally {
        isDetailLoading.value = false;
    }
}

function openReview(decision: ReviewDecision) {
    if (!selectedFont.value || selectedFont.value.status !== "pending_review") return;
    selectedDecision.value = decision;
    note.value = "";
    isReviewModalOpen.value = true;
}

function closeReview() {
    if (isSubmitting.value) return;
    isReviewModalOpen.value = false;
    selectedDecision.value = "approved";
    note.value = "";
}

async function submitReview() {
    const font = selectedFont.value;
    if (!font || font.status !== "pending_review" || isSubmitting.value) return;
    if (selectedDecision.value !== "approved" && !note.value.trim()) {
        showToast("Catatan wajib diisi untuk permintaan revisi atau penolakan.", "error");
        return;
    }

    isSubmitting.value = true;
    try {
        await AdminFontApi.review(font.id, selectedDecision.value, note.value.trim());
        showToast(
            selectedDecision.value === "approved"
                ? "Font berhasil disetujui."
                : selectedDecision.value === "rejected"
                  ? "Pengajuan font ditolak."
                  : "Revisi font berhasil diminta.",
        );
        selectedFont.value = null;
        closeReview();
        await loadFonts();
    } catch (error) {
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        showToast(
            getUserFacingApiError(error, "Review font gagal disimpan."),
            "error",
        );
    } finally {
        isSubmitting.value = false;
    }
}

async function downloadFamily(font: CreatorFont, index: number) {
    const family = font.font_families[index];
    if (!family || downloadingFamily.value !== null) return;
    downloadingFamily.value = index;
    try {
        await AdminFontApi.downloadFamily(font.id, index, family.original_name);
    } catch (error) {
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        showToast(
            getUserFacingApiError(error, "File family font gagal diunduh."),
            "error",
        );
    } finally {
        downloadingFamily.value = null;
    }
}

function statusTone(status: string) {
    if (status === "approved") return "success" as const;
    if (status === "rejected") return "danger" as const;
    return "warning" as const;
}

watch(page, () => void loadFonts());
onMounted(() => void loadFonts());
</script>

<template>
    <section>
        <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">ADMIN MANAGEMENT</p>
        <div class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">Manajemen Font</h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[#68686C]">
                    Periksa deskripsi, set karakter, dan setiap file family sebelum font dipublikasikan.
                </p>
            </div>
            <span class="rounded-full bg-[#FFF5D9] px-3 py-1.5 text-xs font-semibold text-[#745710]">
                {{ total }} menunggu review
            </span>
        </div>

        <div v-if="hasError" class="mt-6 rounded border border-[#D9A49D] bg-[#FFF8F6] p-4" role="alert">
            <p class="text-sm text-[#9A3D32]">{{ errorMessage }}</p>
            <button type="button" class="mt-3 text-sm font-semibold underline" @click="loadFonts">
                Coba lagi
            </button>
        </div>

        <div class="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
            <div class="overflow-hidden rounded-lg border border-[#E2E2E4] bg-white">
                <div v-if="isLoading" class="space-y-3 p-5" role="status" aria-label="Memuat antrean font">
                    <div v-for="line in 4" :key="line" class="h-14 animate-pulse rounded bg-[#F1F1F0]" />
                </div>
                <div v-else-if="fonts.length === 0" class="px-5 py-14 text-center">
                    <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">Antrean kosong</h2>
                    <p class="mt-2 text-sm text-[#68686C]">Belum ada font baru untuk diperiksa.</p>
                </div>
                <div v-else class="divide-y divide-[#E2E2E4]">
                    <button
                        v-for="font in fonts"
                        :key="font.id"
                        type="button"
                        class="block w-full px-5 py-4 text-left transition hover:bg-[#FAF8F5]"
                        :class="selectedFont?.id === font.id ? 'bg-[#FAF8F5]' : ''"
                        @click="openFont(font)"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <h2 class="truncate text-sm font-semibold text-[#121214]">{{ font.name }}</h2>
                                <p class="mt-1 text-xs text-[#68686C]">
                                    {{ getCreator(font) }} · {{ getCategoryName(font) }}
                                </p>
                                <p class="mt-1 text-xs text-[#8F897F]">{{ formatDate(font.created_at) }}</p>
                            </div>
                            <AdminStatusBadge label="Pending" :tone="statusTone(font.status)" />
                        </div>
                    </button>
                </div>
                <AdminPagination
                    v-if="totalPages > 1"
                    v-model:page="page"
                    :total="total"
                    :total-pages="totalPages"
                />
            </div>

            <aside class="min-h-72 rounded-lg border border-[#E2E2E4] bg-white p-5 sm:p-6">
                <div v-if="!selectedFont" class="flex min-h-60 flex-col items-center justify-center text-center">
                    <p class="text-sm text-[#68686C]">Pilih font dari antrean untuk melihat detail pengajuan.</p>
                </div>
                <div v-else-if="isDetailLoading" class="space-y-3" role="status" aria-label="Memuat detail font">
                    <div class="h-7 w-2/3 animate-pulse rounded bg-[#F1F1F0]" />
                    <div class="h-24 animate-pulse rounded bg-[#F1F1F0]" />
                </div>
                <div v-else>
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="font-mono text-[10px] tracking-wide text-[#8F897F]">DETAIL PENGAJUAN</p>
                            <h2 class="mt-1 font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                                {{ selectedFont.name }}
                            </h2>
                        </div>
                        <button type="button" class="text-sm text-[#68686C] underline" @click="selectedFont = null">
                            Tutup
                        </button>
                    </div>
                    <dl class="mt-5 grid gap-4 border-y border-[#E2E2E4] py-4 text-sm sm:grid-cols-2">
                        <div>
                            <dt class="text-xs text-[#8F897F]">Creator</dt>
                            <dd class="mt-1 font-medium text-[#121214]">{{ getCreator(selectedFont) }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs text-[#8F897F]">Kategori</dt>
                            <dd class="mt-1 font-medium text-[#121214]">{{ getCategoryName(selectedFont) }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs text-[#8F897F]">Slug</dt>
                            <dd class="mt-1 break-all font-mono text-xs text-[#121214]">{{ selectedFont.slug }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs text-[#8F897F]">Harga</dt>
                            <dd class="mt-1 font-medium text-[#121214]">
                                {{ new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedFont.price) }}
                            </dd>
                        </div>
                    </dl>
                    <section class="mt-5">
                        <h3 class="text-xs font-semibold uppercase tracking-wide text-[#68686C]">Deskripsi font</h3>
                        <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#121214]">
                            {{ selectedFont.description || "Creator belum menambahkan deskripsi." }}
                        </p>
                    </section>
                    <section class="mt-5">
                        <h3 class="text-xs font-semibold uppercase tracking-wide text-[#68686C]">Set karakter</h3>
                        <p class="mt-2 whitespace-pre-wrap break-words rounded bg-[#FAF8F5] p-3 font-mono text-xs leading-5 text-[#121214]">
                            {{ selectedFont.character_set || "Creator belum menjelaskan set karakter." }}
                        </p>
                    </section>
                    <section class="mt-5">
                        <h3 class="text-xs font-semibold uppercase tracking-wide text-[#68686C]">Font family yang diunggah</h3>
                        <div class="mt-2 space-y-2">
                            <div
                                v-for="(family, index) in selectedFont.font_families"
                                :key="`${family.name}-${family.original_name}`"
                                class="flex flex-wrap items-center justify-between gap-3 rounded border border-[#E2E2E4] p-3"
                            >
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold text-[#121214]">{{ family.name }}</p>
                                    <p class="mt-1 break-all text-xs text-[#68686C]">
                                        {{ family.original_name }} · {{ family.format.toUpperCase() }} · {{ formatBytes(family.size) }}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    class="text-xs font-semibold text-[#D35230] underline disabled:opacity-50"
                                    :disabled="downloadingFamily !== null"
                                    @click="downloadFamily(selectedFont, index)"
                                >
                                    {{ downloadingFamily === index ? "Mengunduh..." : "Unduh untuk periksa" }}
                                </button>
                            </div>
                        </div>
                    </section>
                    <p v-if="selectedFont.review_note" class="mt-4 rounded border border-[#D9A49D] bg-[#FFF8F6] p-3 text-sm text-[#9A3D32]">
                        Catatan sebelumnya: {{ selectedFont.review_note }}
                    </p>
                    <div v-if="selectedFont.status === 'pending_review'" class="mt-6 grid gap-3 sm:grid-cols-3">
                        <button type="button" class="h-10 rounded bg-[#28633B] px-3 text-sm font-semibold text-white" @click="openReview('approved')">
                            Setujui
                        </button>
                        <button type="button" class="h-10 rounded border border-[#B98A20] px-3 text-sm font-semibold text-[#745710]" @click="openReview('changes_requested')">
                            Minta revisi
                        </button>
                        <button type="button" class="h-10 rounded border border-[#D9A49D] px-3 text-sm font-semibold text-[#9A3D32]" @click="openReview('rejected')">
                            Tolak
                        </button>
                    </div>
                </div>
            </aside>
        </div>

        <AdminConfirmModal
            :show="isReviewModalOpen"
            :title="selectedDecision === 'approved' ? 'Setujui font?' : selectedDecision === 'rejected' ? 'Tolak font?' : 'Minta revisi font?'"
            :message="selectedDecision === 'approved'
                ? `Font ${selectedFont?.name ?? ''} akan dipublikasikan setelah disetujui.`
                : 'Tambahkan catatan yang akan diterima creator.'"
            :confirm-label="selectedDecision === 'approved' ? 'Ya, setujui' : selectedDecision === 'rejected' ? 'Ya, tolak' : 'Kirim catatan'"
            :danger="selectedDecision === 'rejected'"
            :is-loading="isSubmitting"
            @confirm="submitReview"
            @cancel="closeReview"
        >
            <label
                v-if="selectedDecision !== 'approved'"
                class="block text-xs font-medium text-[#68686C]"
            >
                Catatan untuk creator
                <textarea
                    v-model="note"
                    rows="4"
                    maxlength="2000"
                    :disabled="isSubmitting"
                    class="mt-2 w-full resize-y rounded border border-[#D1C9B8] px-3 py-2 text-sm text-[#121214] outline-none focus:border-[#121214]"
                    placeholder="Jelaskan bagian yang perlu diperbaiki atau alasan penolakan"
                />
            </label>
        </AdminConfirmModal>

        <AdminToast
            :show="Boolean(toastMessage)"
            :message="toastMessage"
            :variant="toastVariant"
            @dismiss="toastMessage = ''"
        />
    </section>
</template>
