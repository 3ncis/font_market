<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal.vue";
import AdminPagination from "@/components/admin/AdminPagination.vue";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge.vue";
import AdminToast from "@/components/admin/AdminToast.vue";
import PaymentVerificationResult from "@/components/admin/PaymentVerificationResult.vue";
import AdminPaymentApi, {
    type AdminPayment,
    type PaymentStatus,
    type PaymentVerificationResult as VerificationResult,
} from "@/core/api/adminPayment.api";
import { useAuthStore } from "@/core/auth/authStores";
import {
    getApiErrorCode,
    getApiErrorStatus,
} from "@/core/utils/userFacingApiError";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const payments = ref<AdminPayment[]>([]);
const page = ref(1);
const totalPages = ref(0);
const total = ref(0);
const statusFilter = ref<"all" | PaymentStatus>("all");
const searchInput = ref("");
const debouncedSearch = ref("");
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const testingEnabled = ref<boolean | null>(null);
const selectedPayment = ref<AdminPayment | null>(null);
const submittingPaymentId = ref<string | null>(null);
const verificationResult = ref<VerificationResult | null>(null);
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");
const clock = ref(Date.now());

let searchTimer: ReturnType<typeof setTimeout> | undefined;
let clockTimer: ReturnType<typeof setInterval> | undefined;
let requestSequence = 0;

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

function formatPrice(value: number | null) {
    if (value === null || !Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
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

function expirationTime(payment: AdminPayment) {
    const timestamp = Date.parse(payment.expired_at);
    return Number.isFinite(timestamp) ? timestamp : Number.NaN;
}

function isExpired(payment: AdminPayment) {
    const expiresAt = expirationTime(payment);
    return !Number.isFinite(expiresAt) || expiresAt <= clock.value;
}

function remainingTime(payment: AdminPayment) {
    const expiresAt = expirationTime(payment);
    if (!Number.isFinite(expiresAt)) return "Waktu tidak tersedia";

    const remaining = expiresAt - clock.value;
    if (remaining <= 0) return "Kedaluwarsa";

    const totalSeconds = Math.floor(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0
        ? `${hours}j ${minutes}m ${seconds} dtk`
        : `${minutes}m ${seconds} dtk`;
}

function statusTone(status: PaymentStatus) {
    if (status === "success") return "success" as const;
    if (status === "pending") return "warning" as const;
    return "danger" as const;
}

function userLabel(payment: AdminPayment) {
    if (payment.user) {
        return `${payment.user.name} (${payment.user.email})`;
    }
    return payment.user_id;
}

function showToast(message: string, variant: "success" | "error" = "success") {
    toastMessage.value = message;
    toastVariant.value = variant;
}

function getErrorMessage(error: unknown, action: "list" | "approve") {
    const status = getApiErrorStatus(error);
    if (status === 404 || status === 410) {
        return "Payment atau order sudah kedaluwarsa atau telah dihapus oleh backend.";
    }
    if (status === 409) {
        return "Payment sudah dibayar atau sudah diproses sebelumnya.";
    }
    if (
        status === 403 &&
        action === "approve"
    ) {
        return "Fitur testing payment tidak aktif di environment ini.";
    }
    if (status === 500 || status === 502 || status === 503) {
        return "Terjadi gangguan pada server. Silakan coba lagi.";
    }
    return action === "list"
        ? "Daftar payment gagal dimuat. Periksa koneksi lalu coba lagi."
        : "Payment testing gagal diproses. Silakan coba lagi.";
}

async function loadPayments() {
    const sequence = ++requestSequence;
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    try {
        const result = await AdminPaymentApi.list({
            status: statusFilter.value,
            search: debouncedSearch.value.trim(),
            page: page.value,
            limit: 10,
        });
        if (sequence !== requestSequence) return;

        payments.value = result.items;
        testingEnabled.value = result.testing_enabled;
        total.value = result.meta.total;
        totalPages.value = result.meta.total_pages;
        page.value = result.meta.page;
    } catch (error) {
        if (sequence !== requestSequence) return;
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        hasError.value = true;
        errorMessage.value = getErrorMessage(error, "list");
    } finally {
        if (sequence === requestSequence) isLoading.value = false;
    }
}

function canApprove(payment: AdminPayment) {
    return (
        testingEnabled.value === true &&
        payment.gateway_status === "pending" &&
        !isExpired(payment) &&
        submittingPaymentId.value === null
    );
}

function openApproval(payment: AdminPayment) {
    if (!canApprove(payment)) return;
    selectedPayment.value = payment;
}

function closeApproval() {
    if (submittingPaymentId.value) return;
    selectedPayment.value = null;
}

async function approveSelectedPayment() {
    const payment = selectedPayment.value;
    if (!payment || !canApprove(payment)) return;

    submittingPaymentId.value = payment.id;
    try {
        verificationResult.value = await AdminPaymentApi.approveForTesting(
            payment.id,
        );
        selectedPayment.value = null;
        showToast("Payment testing selesai.");
        await loadPayments();
    } catch (error) {
        const status = getApiErrorStatus(error);
        if (status === 401) {
            redirectForAuthorizationError(status);
            return;
        }
        if (
            status === 403 &&
            getApiErrorCode(error) === "PAYMENT_TESTING_DISABLED"
        ) {
            testingEnabled.value = false;
            selectedPayment.value = null;
            showToast(getErrorMessage(error, "approve"), "error");
            return;
        }
        if (status === 403) {
            redirectForAuthorizationError(status);
            return;
        }
        showToast(getErrorMessage(error, "approve"), "error");
        if (status === 404 || status === 410 || status === 409) {
            selectedPayment.value = null;
            await loadPayments();
        }
    } finally {
        submittingPaymentId.value = null;
    }
}

watch(searchInput, (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        page.value = 1;
        debouncedSearch.value = value;
    }, 350);
});

watch([statusFilter, debouncedSearch, page], () => void loadPayments());

onMounted(() => {
    void loadPayments();
    clockTimer = setInterval(() => {
        clock.value = Date.now();
    }, 1000);
});

onBeforeUnmount(() => {
    requestSequence += 1;
    if (searchTimer) clearTimeout(searchTimer);
    if (clockTimer) clearInterval(clockTimer);
});
</script>

<template>
    <section>
        <div
            class="rounded-lg border border-[#D9A49D] bg-[#FFF4F1] p-4 sm:p-5"
            role="alert"
        >
            <p class="font-mono text-xs font-bold tracking-[0.12em] text-[#9A3D32]">
                FITUR TESTING - JUST ONLY FOR TESTING THE PAYMENT.
            </p>
            <p class="mt-1 text-sm font-semibold text-[#7F3028]">
                Jangan digunakan untuk transaksi nyata.
            </p>
        </div>

        <div class="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">
                    ADMIN MANAGEMENT
                </p>
                <h1 class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Payment Management
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[#68686C]">
                    Uji konfirmasi payment dan verifikasi data order pada collection.
                </p>
            </div>
        </div>

        <div
            v-if="testingEnabled === false"
            class="mt-5 rounded border border-[#E2E2E4] bg-white px-4 py-3 text-sm text-[#68686C]"
            role="status"
        >
            Fitur testing payment tidak aktif di environment ini.
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[200px_minmax(240px,1fr)]">
            <label class="flex flex-col gap-1.5 text-xs font-medium text-[#68686C]">
                Status
                <select
                    v-model="statusFilter"
                    class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                >
                    <option value="all">Semua status</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="expired">Expired</option>
                </select>
            </label>
            <label class="flex flex-col gap-1.5 text-xs font-medium text-[#68686C]">
                Cari ID payment, ID order, atau user
                <input
                    v-model="searchInput"
                    type="search"
                    autocomplete="off"
                    placeholder="Masukkan ID, nama, atau email"
                    class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                />
            </label>
        </div>

        <div class="mt-5 overflow-hidden rounded-lg border border-[#E2E2E4] bg-white">
            <div
                v-if="isLoading"
                class="space-y-3 p-5"
                role="status"
                aria-label="Memuat daftar payment"
            >
                <div
                    v-for="line in 5"
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
                    @click="loadPayments"
                >
                    Coba lagi
                </button>
            </div>
            <div
                v-else-if="payments.length === 0"
                class="px-5 py-14 text-center"
            >
                <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                    Tidak ada payment
                </h2>
                <p class="mt-2 text-sm text-[#68686C]">
                    Belum ada payment yang sesuai dengan filter ini.
                </p>
            </div>
            <template v-else>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1080px] text-left text-sm">
                        <thead class="bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wide text-[#68686C]">
                            <tr>
                                <th class="px-5 py-4">ID payment</th>
                                <th class="px-5 py-4">ID order</th>
                                <th class="px-5 py-4">User</th>
                                <th class="px-5 py-4">Nominal</th>
                                <th class="px-5 py-4">Status</th>
                                <th class="px-5 py-4">Waktu dibuat</th>
                                <th class="px-5 py-4">Waktu expired</th>
                                <th class="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E2E2E4]">
                            <tr v-for="payment in payments" :key="payment.id">
                                <td class="max-w-40 break-all px-5 py-4 font-mono text-xs text-[#121214]">
                                    {{ payment.id }}
                                </td>
                                <td class="max-w-40 break-all px-5 py-4 font-mono text-xs text-[#68686C]">
                                    {{ payment.order_id }}
                                </td>
                                <td class="max-w-56 px-5 py-4 text-[#68686C]">
                                    {{ userLabel(payment) }}
                                </td>
                                <td class="whitespace-nowrap px-5 py-4 text-[#121214]">
                                    {{ formatPrice(payment.amount) }}
                                </td>
                                <td class="px-5 py-4">
                                    <AdminStatusBadge
                                        :label="payment.gateway_status"
                                        :tone="statusTone(payment.gateway_status)"
                                    />
                                </td>
                                <td class="whitespace-nowrap px-5 py-4 text-[#68686C]">
                                    {{ formatDate(payment.created_at) }}
                                </td>
                                <td class="whitespace-nowrap px-5 py-4 text-[#68686C]">
                                    <p>{{ formatDate(payment.expired_at) }}</p>
                                    <p
                                        v-if="payment.gateway_status === 'pending'"
                                        class="mt-1 text-xs"
                                        :class="
                                            isExpired(payment)
                                                ? 'text-[#9A3D32]'
                                                : 'text-[#855B0A]'
                                        "
                                    >
                                        {{ remainingTime(payment) }}
                                    </p>
                                </td>
                                <td class="px-5 py-4">
                                    <button
                                        type="button"
                                        :disabled="!canApprove(payment)"
                                        :title="
                                            testingEnabled !== true
                                                ? 'Fitur testing tidak aktif'
                                                : isExpired(payment)
                                                  ? 'Payment sudah expired'
                                                  : 'Approve untuk testing saja'
                                        "
                                        class="whitespace-nowrap rounded border border-[#121214] bg-[#121214] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#343438] disabled:cursor-not-allowed disabled:border-[#D1C9B8] disabled:bg-[#F1F1F0] disabled:text-[#A5A5A7]"
                                        @click="openApproval(payment)"
                                    >
                                        Approve (Testing)
                                    </button>
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
            :show="selectedPayment !== null"
            title="Approve payment untuk testing?"
            message="Aksi ini hanya untuk testing payment. Backend akan menjalankan fulfillment seperti konfirmasi pembayaran, membuat data collection, dan menghapus dokumen Font sumber yang dibeli."
            confirm-label="Approve (Testing)"
            :is-loading="
                selectedPayment !== null &&
                submittingPaymentId === selectedPayment.id
            "
            @confirm="approveSelectedPayment"
            @cancel="closeApproval"
        />
        <PaymentVerificationResult
            :show="verificationResult !== null"
            :result="verificationResult"
            @close="verificationResult = null"
        />
        <AdminToast
            :show="Boolean(toastMessage)"
            :message="toastMessage"
            :variant="toastVariant"
            @dismiss="toastMessage = ''"
        />
    </section>
</template>
