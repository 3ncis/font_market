<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal.vue";
import AdminPagination from "@/components/admin/AdminPagination.vue";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge.vue";
import AdminToast from "@/components/admin/AdminToast.vue";
import AdminApi, {
    type CreatorRequest,
    type CreatorRequestStatus,
} from "@/core/api/admin.api";
import { useAuthStore } from "@/core/auth/authStores";
import {
    getApiErrorStatus,
    getUserFacingApiError,
} from "@/core/utils/userFacingApiError";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const requests = ref<CreatorRequest[]>([]);
const page = ref(1);
const totalPages = ref(0);
const total = ref(0);
const statusFilter = ref<"all" | CreatorRequestStatus>("pending");
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const selectedRequest = ref<CreatorRequest | null>(null);
const selectedDecision = ref<"approve" | "reject">("approve");
const rejectionReason = ref("");
const isSubmitting = ref(false);
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");
let requestSequence = 0;

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function statusLabel(status: CreatorRequestStatus) {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
}

function statusTone(status: CreatorRequestStatus) {
    if (status === "approved") return "success" as const;
    if (status === "rejected") return "danger" as const;
    return "warning" as const;
}

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

async function loadRequests() {
    const sequence = ++requestSequence;
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    try {
        const result = await AdminApi.listCreatorRequests({
            status: statusFilter.value,
            page: page.value,
            limit: 10,
        });
        if (sequence !== requestSequence) return;

        requests.value = result.items;
        total.value = result.meta.total;
        totalPages.value = result.meta.total_pages;
        page.value = result.meta.page;
    } catch (error) {
        if (sequence !== requestSequence) return;
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        hasError.value = true;
        errorMessage.value = getUserFacingApiError(
            error,
            "Request creator gagal dimuat. Periksa koneksi lalu coba lagi.",
        );
    } finally {
        if (sequence === requestSequence) isLoading.value = false;
    }
}

function openDecision(request: CreatorRequest, decision: "approve" | "reject") {
    if (request.status !== "pending" || isSubmitting.value) return;
    selectedRequest.value = request;
    selectedDecision.value = decision;
    rejectionReason.value = "";
}

function closeDecision() {
    if (isSubmitting.value) return;
    selectedRequest.value = null;
    rejectionReason.value = "";
}

async function submitDecision() {
    const request = selectedRequest.value;
    if (!request || request.status !== "pending" || isSubmitting.value) return;

    isSubmitting.value = true;
    try {
        await AdminApi.reviewCreatorRequest(
            request.request_id,
            selectedDecision.value,
            selectedDecision.value === "reject"
                ? rejectionReason.value.trim() || undefined
                : undefined,
        );

        const row = requests.value.find(
            (item) => item.request_id === request.request_id,
        );
        if (row) {
            row.status =
                selectedDecision.value === "approve" ? "approved" : "rejected";
        }
        showToast(
            selectedDecision.value === "approve"
                ? "Request creator berhasil disetujui."
                : "Request creator berhasil ditolak.",
        );
        selectedRequest.value = null;
        rejectionReason.value = "";
    } catch (error) {
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        showToast(
            getUserFacingApiError(
                error,
                "Request creator gagal diproses. Silakan coba lagi.",
            ),
            "error",
        );
    } finally {
        isSubmitting.value = false;
    }
}

watch([statusFilter, page], () => void loadRequests());
onMounted(() => void loadRequests());
onBeforeUnmount(() => {
    requestSequence += 1;
});
</script>

<template>
    <section>
        <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">
            ADMIN MANAGEMENT
        </p>
        <div class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Request Creator
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[#68686C]">
                    Tinjau permintaan pembuatan akun creator.
                </p>
            </div>
            <RouterLink
                :to="{ name: 'admin-users' }"
                class="inline-flex h-10 items-center justify-center rounded border border-[#D1C9B8] px-4 text-sm font-medium text-[#121214] transition hover:bg-white"
            >
                Kembali ke User Management
            </RouterLink>
        </div>

        <label class="mt-6 flex max-w-xs flex-col gap-1.5 text-xs font-medium text-[#68686C]">
            Status request
            <select
                v-model="statusFilter"
                class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
            >
                <option value="all">Semua status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        </label>

        <div class="mt-5 overflow-hidden rounded-lg border border-[#E2E2E4] bg-white">
            <div
                v-if="isLoading"
                class="space-y-3 p-5"
                role="status"
                aria-label="Memuat request creator"
            >
                <div
                    v-for="line in 4"
                    :key="line"
                    class="h-12 animate-pulse rounded bg-[#F1F1F0]"
                />
            </div>
            <div
                v-else-if="hasError"
                class="flex flex-col items-center px-5 py-12 text-center"
                role="alert"
            >
                <p class="text-sm text-[#9A3D32]">{{ errorMessage }}</p>
                <button
                    type="button"
                    class="mt-4 rounded bg-[#121214] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#343438]"
                    @click="loadRequests"
                >
                    Coba lagi
                </button>
            </div>
            <div
                v-else-if="requests.length === 0"
                class="px-5 py-14 text-center"
            >
                <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                    Tidak ada request
                </h2>
                <p class="mt-2 text-sm text-[#68686C]">
                    Belum ada request dengan status ini.
                </p>
            </div>
            <template v-else>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[980px] text-left text-sm">
                        <thead class="bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wide text-[#68686C]">
                            <tr>
                                <th class="px-5 py-4">Nama</th>
                                <th class="px-5 py-4">Email</th>
                                <th class="px-5 py-4">No. telepon</th>
                                <th class="px-5 py-4">User ID</th>
                                <th class="px-5 py-4">Tanggal request</th>
                                <th class="px-5 py-4">Status</th>
                                <th class="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E2E2E4]">
                            <tr
                                v-for="request in requests"
                                :key="request.request_id"
                            >
                                <td class="px-5 py-4 font-medium text-[#121214]">
                                    {{ request.name }}
                                </td>
                                <td class="px-5 py-4 text-[#68686C]">
                                    {{ request.email }}
                                </td>
                                <td class="whitespace-nowrap px-5 py-4 text-[#68686C]">
                                    {{ request.phone }}
                                </td>
                                <td class="max-w-40 truncate px-5 py-4 font-mono text-xs text-[#68686C]" :title="request.user_id">
                                    {{ request.user_id }}
                                </td>
                                <td class="whitespace-nowrap px-5 py-4 text-[#68686C]">
                                    {{ formatDate(request.created_at) }}
                                </td>
                                <td class="px-5 py-4">
                                    <AdminStatusBadge
                                        :label="statusLabel(request.status)"
                                        :tone="statusTone(request.status)"
                                    />
                                </td>
                                <td class="px-5 py-4">
                                    <div
                                        v-if="request.status === 'pending'"
                                        class="flex gap-3"
                                    >
                                        <button
                                            type="button"
                                            :disabled="isSubmitting"
                                            class="text-sm font-semibold text-[#28633B] underline underline-offset-4 hover:text-[#1D4B2D] disabled:cursor-wait disabled:opacity-50"
                                            @click="openDecision(request, 'approve')"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            :disabled="isSubmitting"
                                            class="text-sm font-semibold text-[#9A3D32] underline underline-offset-4 hover:text-[#7F3028] disabled:cursor-wait disabled:opacity-50"
                                            @click="openDecision(request, 'reject')"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                    <span v-else class="text-xs text-[#A5A5A7]">
                                        Sudah diproses
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <AdminPagination
                    v-model:page="page"
                    :total="total"
                    :total-pages="totalPages"
                />
            </template>
        </div>

        <AdminConfirmModal
            :show="selectedRequest !== null"
            :title="
                selectedDecision === 'approve'
                    ? 'Setujui request creator?'
                    : 'Tolak request creator?'
            "
            :message="
                selectedDecision === 'approve'
                    ? `Request ${selectedRequest?.name ?? ''} akan disetujui. Link register sekali pakai akan dikirim ke email creator.`
                    : `Request ${selectedRequest?.name ?? ''} akan ditolak.`
            "
            :confirm-label="selectedDecision === 'approve' ? 'Ya, approve' : 'Ya, reject'"
            :danger="selectedDecision === 'reject'"
            :is-loading="isSubmitting"
            @confirm="submitDecision"
            @cancel="closeDecision"
        >
            <label
                v-if="selectedDecision === 'reject'"
                class="block text-xs font-medium text-[#68686C]"
            >
                Alasan (opsional)
                <textarea
                    v-model="rejectionReason"
                    rows="3"
                    maxlength="1000"
                    :disabled="isSubmitting"
                    class="mt-2 w-full resize-y rounded border border-[#D1C9B8] px-3 py-2 text-sm text-[#121214] outline-none focus:border-[#121214] disabled:bg-[#F6F6F5]"
                    placeholder="Tambahkan alasan jika diperlukan"
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
