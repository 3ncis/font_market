<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal.vue";
import AdminPagination from "@/components/admin/AdminPagination.vue";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge.vue";
import AdminToast from "@/components/admin/AdminToast.vue";
import AdminApi, {
    type AdminUser,
    type AdminUserRole,
} from "@/core/api/admin.api";
import { useAuthStore } from "@/core/auth/authStores";
import {
    getApiErrorStatus,
    getUserFacingApiError,
} from "@/core/utils/userFacingApiError";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const users = ref<AdminUser[]>([]);
const page = ref(1);
const totalPages = ref(0);
const total = ref(0);
const roleFilter = ref<"all" | "creator" | "customer">("all");
const statusFilter = ref<"all" | "active" | "inactive">("all");
const searchInput = ref("");
const debouncedSearch = ref("");
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const selectedUser = ref<AdminUser | null>(null);
const nextActiveState = ref(false);
const isSubmitting = ref(false);
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");
let searchTimer: ReturnType<typeof setTimeout> | undefined;
let requestSequence = 0;

const canChangeSelectedStatus = computed(
    () => selectedUser.value && !isAdmin(selectedUser.value),
);

function isAdmin(user: AdminUser) {
    return (
        user.role.toLowerCase() === "admin" ||
        user.roles?.some((role) => role.toLowerCase() === "admin") === true
    );
}

function isCurrentAdmin(user: AdminUser) {
    return (
        isAdmin(user) &&
        String(authStore.user?.id ?? "") === user.user_id
    );
}

function roleLabel(role: AdminUserRole | string) {
    if (role.toLowerCase() === "creator") return "Creator";
    if (role.toLowerCase() === "admin") return "Admin";
    return "User";
}

function roleTone(role: AdminUserRole | string) {
    if (role.toLowerCase() === "admin") return "dark" as const;
    return role.toLowerCase() === "creator" ? "warning" as const : "muted" as const;
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
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

async function loadUsers() {
    const sequence = ++requestSequence;
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    try {
        const result = await AdminApi.listUsers({
            role: roleFilter.value,
            status: statusFilter.value,
            search: debouncedSearch.value.trim(),
            page: page.value,
            limit: 10,
        });
        if (sequence !== requestSequence) return;

        users.value = result.items;
        total.value = result.meta.total;
        totalPages.value = result.meta.total_pages;
        page.value = result.meta.page;
    } catch (error) {
        if (sequence !== requestSequence) return;
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        hasError.value = true;
        errorMessage.value = getUserFacingApiError(
            error,
            "Daftar pengguna gagal dimuat. Periksa koneksi lalu coba lagi.",
        );
    } finally {
        if (sequence === requestSequence) isLoading.value = false;
    }
}

function openStatusConfirm(user: AdminUser) {
    if (isAdmin(user) || isSubmitting.value) return;
    selectedUser.value = user;
    nextActiveState.value = !user.is_active;
}

function closeStatusConfirm() {
    if (isSubmitting.value) return;
    selectedUser.value = null;
}

async function updateSelectedUserStatus() {
    const user = selectedUser.value;
    if (!user || !canChangeSelectedStatus.value || isSubmitting.value) return;

    isSubmitting.value = true;
    try {
        await AdminApi.updateUserStatus(user.user_id, nextActiveState.value);
        const row = users.value.find((item) => item.user_id === user.user_id);
        if (row) row.is_active = nextActiveState.value;
        showToast(
            nextActiveState.value
                ? "Akun berhasil diaktifkan."
                : "Akun berhasil dinonaktifkan.",
        );
        selectedUser.value = null;
    } catch (error) {
        if (redirectForAuthorizationError(getApiErrorStatus(error))) return;
        showToast(
            getUserFacingApiError(
                error,
                "Status akun gagal diperbarui. Silakan coba lagi.",
            ),
            "error",
        );
    } finally {
        isSubmitting.value = false;
    }
}

watch(searchInput, (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        page.value = 1;
        debouncedSearch.value = value;
    }, 350);
});

watch([roleFilter, statusFilter, page, debouncedSearch], () => {
    void loadUsers();
});

onMounted(() => void loadUsers());
onBeforeUnmount(() => {
    requestSequence += 1;
    if (searchTimer) clearTimeout(searchTimer);
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
                    User Management
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[#68686C]">
                    Kelola akun, role, dan status akses pengguna.
                </p>
            </div>
            <RouterLink
                :to="{ name: 'admin-creator-requests' }"
                class="inline-flex h-10 items-center justify-center rounded border border-[#D1C9B8] px-4 text-sm font-medium text-[#121214] transition hover:bg-white"
            >
                Request Creator
            </RouterLink>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_180px_180px]">
            <label class="flex flex-col gap-1.5 text-xs font-medium text-[#68686C]">
                Cari nama atau email
                <input
                    v-model="searchInput"
                    type="search"
                    autocomplete="off"
                    placeholder="Ketik nama atau email"
                    class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                />
            </label>
            <label class="flex flex-col gap-1.5 text-xs font-medium text-[#68686C]">
                Role
                <select
                    v-model="roleFilter"
                    class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                >
                    <option value="all">Semua role</option>
                    <option value="creator">Creator</option>
                    <option value="customer">User biasa</option>
                </select>
            </label>
            <label class="flex flex-col gap-1.5 text-xs font-medium text-[#68686C]">
                Status
                <select
                    v-model="statusFilter"
                    class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                >
                    <option value="all">Semua status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </label>
        </div>

        <div class="mt-6 overflow-hidden rounded-lg border border-[#E2E2E4] bg-white">
            <div
                v-if="isLoading"
                class="space-y-3 p-5"
                role="status"
                aria-label="Memuat daftar pengguna"
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
                    @click="loadUsers"
                >
                    Coba lagi
                </button>
            </div>
            <div
                v-else-if="users.length === 0"
                class="px-5 py-14 text-center"
            >
                <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                    Tidak ada pengguna
                </h2>
                <p class="mt-2 text-sm text-[#68686C]">
                    Coba ubah filter atau kata pencarian.
                </p>
            </div>
            <template v-else>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[850px] text-left text-sm">
                        <thead class="bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wide text-[#68686C]">
                            <tr>
                                <th class="px-5 py-4">Nama</th>
                                <th class="px-5 py-4">Email</th>
                                <th class="px-5 py-4">Role</th>
                                <th class="px-5 py-4">Status</th>
                                <th class="px-5 py-4">Tanggal daftar</th>
                                <th class="px-5 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E2E2E4]">
                            <tr v-for="user in users" :key="user.user_id">
                                <td class="px-5 py-4 font-medium text-[#121214]">
                                    {{ user.name }}
                                </td>
                                <td class="px-5 py-4 text-[#68686C]">
                                    {{ user.email }}
                                </td>
                                <td class="px-5 py-4">
                                    <AdminStatusBadge
                                        :label="roleLabel(user.role)"
                                        :tone="roleTone(user.role)"
                                    />
                                </td>
                                <td class="px-5 py-4">
                                    <AdminStatusBadge
                                        :label="user.is_active ? 'Aktif' : 'Nonaktif'"
                                        :tone="user.is_active ? 'success' : 'muted'"
                                    />
                                </td>
                                <td class="whitespace-nowrap px-5 py-4 text-[#68686C]">
                                    {{ formatDate(user.created_at) }}
                                </td>
                                <td class="px-5 py-4">
                                    <button
                                        type="button"
                                        :disabled="isAdmin(user) || isSubmitting"
                                        :title="
                                            isCurrentAdmin(user)
                                                ? 'Akun admin sendiri tidak dapat diubah.'
                                                : isAdmin(user)
                                                  ? 'Status akun admin tidak dapat diubah.'
                                                  : undefined
                                        "
                                        class="whitespace-nowrap text-sm font-semibold underline underline-offset-4 disabled:cursor-not-allowed disabled:text-[#A5A5A7] disabled:no-underline"
                                        :class="
                                            user.is_active
                                                ? 'text-[#9A3D32] hover:text-[#7F3028]'
                                                : 'text-[#28633B] hover:text-[#1D4B2D]'
                                        "
                                        @click="openStatusConfirm(user)"
                                    >
                                        {{ user.is_active ? "Nonaktifkan" : "Aktifkan" }}
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
            :show="selectedUser !== null"
            :title="nextActiveState ? 'Aktifkan akun?' : 'Nonaktifkan akun?'"
            :message="
                nextActiveState
                    ? `Akun ${selectedUser?.name ?? ''} akan dapat mengakses layanan kembali.`
                    : `Akun ${selectedUser?.name ?? ''} tidak dapat mengakses layanan sampai diaktifkan kembali.`
            "
            :confirm-label="nextActiveState ? 'Ya, aktifkan' : 'Ya, nonaktifkan'"
            :danger="!nextActiveState"
            :is-loading="isSubmitting"
            @confirm="updateSelectedUserStatus"
            @cancel="closeStatusConfirm"
        />
        <AdminToast
            :show="Boolean(toastMessage)"
            :message="toastMessage"
            :variant="toastVariant"
            @dismiss="toastMessage = ''"
        />
    </section>
</template>
