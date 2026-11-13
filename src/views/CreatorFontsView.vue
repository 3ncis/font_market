<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppLayout from "@/components/layout/applayout.vue";
import AdminToast from "@/components/admin/AdminToast.vue";
import FontSubmissionApi, {
    type CreatorFont,
    type FontCategory,
} from "@/core/api/fontSubmission.api";
import { useAuthStore } from "@/core/auth/authStores";
import {
    getApiErrorStatus,
    getUserFacingApiError,
} from "@/core/utils/userFacingApiError";

interface FamilyInput {
    name: string;
    file: File | null;
    existingName?: string;
}

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const fonts = ref<CreatorFont[]>([]);
const categories = ref<FontCategory[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isSubmittingFont = ref<string | null>(null);
const pageError = ref("");
const formError = ref("");
const toastMessage = ref("");
const toastVariant = ref<"success" | "error">("success");
const editingFontId = ref<string | null>(null);
const slugTouched = ref(false);
const form = reactive({
    category_id: "",
    name: "",
    slug: "",
    price: "0",
    description: "",
    character_set: "",
});
const families = ref<FamilyInput[]>([{ name: "", file: null }]);

const hasSelectedFiles = computed(() => families.value.some((family) => family.file));
const hasAllReplacementFiles = computed(
    () => families.value.length > 0 && families.value.every((family) => family.file),
);

function showToast(message: string, variant: "success" | "error" = "success") {
    toastMessage.value = message;
    toastVariant.value = variant;
}

function slugify(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 160);
}

function statusLabel(status: string) {
    const labels: Record<string, string> = {
        draft: "Draft",
        pending_review: "Menunggu review",
        changes_requested: "Perlu revisi",
        rejected: "Ditolak",
        approved: "Disetujui",
    };
    return labels[status] ?? status;
}

function statusTone(status: string) {
    if (status === "approved") return "bg-[#E7F4E9] text-[#28633B]";
    if (status === "rejected") return "bg-[#FFF0ED] text-[#9A3D32]";
    if (status === "changes_requested") return "bg-[#FFF5D9] text-[#745710]";
    if (status === "pending_review") return "bg-[#EAF1FF] text-[#34578C]";
    return "bg-[#F1F1F0] text-[#68686C]";
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatBytes(bytes: number) {
    return bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function loadData() {
    isLoading.value = true;
    pageError.value = "";
    try {
        const [categoryItems, fontItems] = await Promise.all([
            FontSubmissionApi.listCategories(),
            FontSubmissionApi.listMine(),
        ]);
        categories.value = categoryItems;
        fonts.value = fontItems;
        if (!form.category_id && categoryItems.length) {
            form.category_id = categoryItems[0]?.id ?? "";
        }
    } catch (error) {
        if (getApiErrorStatus(error) === 401) {
            authStore.clearAuth();
            await router.replace({
                name: "login",
                query: { redirect: route.fullPath },
            });
            return;
        }
        pageError.value = getUserFacingApiError(
            error,
            "Data font gagal dimuat. Periksa koneksi lalu coba lagi.",
        );
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    editingFontId.value = null;
    slugTouched.value = false;
    form.category_id = categories.value[0]?.id ?? "";
    form.name = "";
    form.slug = "";
    form.price = "0";
    form.description = "";
    form.character_set = "";
    families.value = [{ name: "", file: null }];
    formError.value = "";
}

function editFont(font: CreatorFont) {
    if (!["draft", "changes_requested"].includes(font.status)) return;
    editingFontId.value = font.id;
    slugTouched.value = true;
    form.category_id =
        typeof font.category_id === "object"
            ? font.category_id.id ?? ""
            : font.category_id ?? "";
    form.name = font.name;
    form.slug = font.slug;
    form.price = String(font.price);
    form.description = font.description;
    form.character_set = font.character_set;
    families.value = font.font_families.map((family) => ({
        name: family.name,
        file: null,
        existingName: family.original_name,
    }));
    formError.value = "";
    document.getElementById("font-form")?.scrollIntoView({ behavior: "smooth" });
}

function addFamily() {
    if (families.value.length < 8) families.value.push({ name: "", file: null });
}

function removeFamily(index: number) {
    if (families.value.length > 1) families.value.splice(index, 1);
}

function setFamilyFile(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file && file.size > 10 * 1024 * 1024) {
        formError.value = `${file.name} melebihi batas ukuran 10 MB.`;
        input.value = "";
        return;
    }
    const family = families.value[index];
    if (!family) return;
    family.file = file;
    formError.value = "";
}

function buildFormData(includeFiles: boolean) {
    const data = new FormData();
    data.append("category_id", form.category_id);
    data.append("name", form.name.trim());
    data.append("slug", form.slug.trim() || slugify(form.name));
    data.append("price", form.price);
    data.append("description", form.description.trim());
    data.append("character_set", form.character_set.trim());

    if (includeFiles) {
        for (const family of families.value) {
            if (!family.file) continue;
            data.append("family_names", family.name.trim());
            data.append("font_files", family.file);
        }
    }
    return data;
}

function validateForm() {
    if (!form.category_id) {
        formError.value = "Pilih kategori font.";
        return false;
    }
    if (form.name.trim().length < 1 || form.name.trim().length > 150) {
        formError.value = "Nama font harus berisi 1 sampai 150 karakter.";
        return false;
    }
    if (slugify(form.slug).length < 1) {
        formError.value = "Slug font tidak valid.";
        return false;
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
        formError.value = "Harga harus berupa angka nol atau lebih.";
        return false;
    }
    if (families.value.length < 1 || families.value.length > 8) {
        formError.value = "Tambahkan 1 sampai 8 file family font.";
        return false;
    }
    if (families.value.some((family) => !family.name.trim())) {
        formError.value = "Isi nama untuk setiap family font.";
        return false;
    }
    if (!editingFontId.value && families.value.some((family) => !family.file)) {
        formError.value = "Pilih file font untuk setiap family.";
        return false;
    }
    if (editingFontId.value && hasSelectedFiles.value && !hasAllReplacementFiles.value) {
        formError.value = "Untuk mengganti file, pilih file baru untuk semua family font.";
        return false;
    }
    formError.value = "";
    return true;
}

async function saveFont() {
    if (isSaving.value || !validateForm()) return;
    isSaving.value = true;
    try {
        const hasNewFiles = hasSelectedFiles.value;
        if (editingFontId.value) {
            await FontSubmissionApi.update(
                editingFontId.value,
                buildFormData(hasNewFiles),
            );
            showToast("Perubahan font berhasil disimpan sebagai draft.");
        } else {
            await FontSubmissionApi.create(buildFormData(true));
            showToast("Font berhasil diunggah sebagai draft. Kirim ke admin setelah siap.");
        }
        resetForm();
        fonts.value = await FontSubmissionApi.listMine();
    } catch (error) {
        if (getApiErrorStatus(error) === 403) {
            pageError.value = "Akun ini belum memiliki profil designer yang disetujui.";
        } else {
            formError.value = getUserFacingApiError(
                error,
                "Font gagal disimpan. Periksa data dan coba lagi.",
            );
        }
    } finally {
        isSaving.value = false;
    }
}

async function submitForReview(font: CreatorFont) {
    if (isSubmittingFont.value) return;
    isSubmittingFont.value = font.id;
    try {
        await FontSubmissionApi.submitForReview(font.id);
        fonts.value = await FontSubmissionApi.listMine();
        showToast("Font dikirim ke admin untuk diperiksa.");
    } catch (error) {
        showToast(
            getUserFacingApiError(error, "Font gagal dikirim untuk review."),
            "error",
        );
    } finally {
        isSubmittingFont.value = null;
    }
}

onMounted(() => void loadData());
</script>

<template>
    <AppLayout>
        <main class="min-h-screen bg-[#FAF8F5] px-4 py-10 sm:px-6 lg:px-20">
            <section class="mx-auto max-w-[1200px]">
                <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">CREATOR STUDIO</p>
                <div class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                            Karya font saya
                        </h1>
                        <p class="mt-2 max-w-2xl text-sm leading-6 text-[#68686C]">
                            Unggah metadata dan file family font. File disimpan privat
                            sampai admin menyelesaikan pemeriksaan.
                        </p>
                    </div>
                    <span class="rounded-full bg-[#FFF5D9] px-3 py-1.5 text-xs font-semibold text-[#745710]">
                        Font baru menunggu approval
                    </span>
                </div>

                <div v-if="pageError" class="mt-6 rounded border border-[#D9A49D] bg-[#FFF8F6] p-4" role="alert">
                    <p class="text-sm text-[#9A3D32]">{{ pageError }}</p>
                    <button class="mt-3 text-sm font-semibold underline" type="button" @click="loadData">
                        Coba lagi
                    </button>
                </div>

                <section id="font-form" class="mt-7 rounded-xl border border-[#E2E2E4] bg-white p-5 sm:p-7">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                                {{ editingFontId ? "Edit draft font" : "Unggah font baru" }}
                            </h2>
                            <p class="mt-1 text-sm leading-6 text-[#68686C]">
                                Format yang diterima: TTF, OTF, WOFF, WOFF2. Maksimal 10 MB per file dan 8 family.
                            </p>
                        </div>
                        <button
                            v-if="editingFontId"
                            type="button"
                            class="shrink-0 text-sm font-semibold text-[#68686C] underline"
                            @click="resetForm"
                        >
                            Batal edit
                        </button>
                    </div>

                    <div v-if="isLoading" class="mt-6 h-24 animate-pulse rounded bg-[#F1F1F0]" role="status" />
                    <form v-else class="mt-6 grid gap-5 md:grid-cols-2" @submit.prevent="saveFont">
                        <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                            Nama font
                            <input
                                v-model="form.name"
                                required
                                maxlength="150"
                                class="h-11 rounded border border-[#D1C9B8] px-3 text-sm outline-none focus:border-[#121214]"
                                placeholder="Contoh: Aksara Nusantara"
                                @input="!slugTouched && (form.slug = slugify(form.name))"
                            />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                            Slug
                            <input
                                v-model="form.slug"
                                required
                                maxlength="160"
                                pattern="[a-z0-9-]+"
                                class="h-11 rounded border border-[#D1C9B8] px-3 text-sm outline-none focus:border-[#121214]"
                                placeholder="aksara-nusantara"
                                @input="slugTouched = true; form.slug = slugify(form.slug)"
                            />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                            Kategori
                            <select
                                v-model="form.category_id"
                                required
                                class="h-11 rounded border border-[#D1C9B8] bg-white px-3 text-sm outline-none focus:border-[#121214]"
                            >
                                <option value="" disabled>Pilih kategori</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                            Harga (IDR)
                            <input
                                v-model="form.price"
                                type="number"
                                min="0"
                                step="1"
                                required
                                class="h-11 rounded border border-[#D1C9B8] px-3 text-sm outline-none focus:border-[#121214]"
                            />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-[#121214] md:col-span-2">
                            Deskripsi
                            <textarea
                                v-model="form.description"
                                rows="3"
                                maxlength="5000"
                                class="resize-y rounded border border-[#D1C9B8] px-3 py-2 text-sm outline-none focus:border-[#121214]"
                                placeholder="Jelaskan karakter visual dan kegunaan font"
                            />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-[#121214] md:col-span-2">
                            Set karakter
                            <textarea
                                v-model="form.character_set"
                                rows="3"
                                maxlength="2000"
                                class="resize-y rounded border border-[#D1C9B8] px-3 py-2 text-sm outline-none focus:border-[#121214]"
                                placeholder="Contoh: A-Z, a-z, 0-9, tanda baca, karakter khusus"
                            />
                        </label>

                        <div class="space-y-3 md:col-span-2">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 class="text-sm font-semibold text-[#121214]">Font family</h3>
                                    <p v-if="editingFontId" class="mt-1 text-xs text-[#68686C]">
                                        File yang sudah ada dipertahankan jika tidak memilih file pengganti.
                                    </p>
                                </div>
                                <button
                                    v-if="!editingFontId && families.length < 8"
                                    type="button"
                                    class="text-sm font-semibold text-[#D35230] underline underline-offset-4"
                                    @click="addFamily"
                                >
                                    + Tambah family
                                </button>
                            </div>
                            <div
                                v-for="(family, index) in families"
                                :key="index"
                                class="grid gap-3 rounded-lg border border-[#E2E2E4] p-4 sm:grid-cols-[1fr_1.2fr_auto] sm:items-end"
                            >
                                <label class="flex flex-col gap-2 text-xs font-medium text-[#68686C]">
                                    Nama family
                                    <input
                                        v-model="family.name"
                                        required
                                        maxlength="100"
                                        class="h-10 rounded border border-[#D1C9B8] px-3 text-sm text-[#121214]"
                                        placeholder="Contoh: Regular"
                                    />
                                </label>
                                <label class="flex flex-col gap-2 text-xs font-medium text-[#68686C]">
                                    {{ family.existingName ? `File saat ini: ${family.existingName}` : "File font" }}
                                    <input
                                        type="file"
                                        accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
                                        :required="!editingFontId"
                                        class="block w-full text-xs text-[#68686C] file:mr-3 file:rounded file:border-0 file:bg-[#F1F1F0] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#121214]"
                                        @change="setFamilyFile(index, $event)"
                                    />
                                    <span v-if="family.file" class="text-xs text-[#28633B]">
                                        {{ family.file.name }} · {{ formatBytes(family.file.size) }}
                                    </span>
                                </label>
                                <button
                                    v-if="!editingFontId && families.length > 1"
                                    type="button"
                                    class="h-9 text-sm font-semibold text-[#9A3D32]"
                                    @click="removeFamily(index)"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>

                        <p v-if="formError" class="rounded border border-[#D9A49D] bg-[#FFF8F6] px-3 py-2 text-sm text-[#9A3D32] md:col-span-2" role="alert">
                            {{ formError }}
                        </p>
                        <button
                            type="submit"
                            :disabled="isSaving || !categories.length"
                            class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 text-sm font-semibold text-white transition hover:bg-[#343438] disabled:cursor-wait disabled:opacity-50 md:col-span-2 md:justify-self-start"
                        >
                            {{ isSaving ? "Menyimpan..." : editingFontId ? "Simpan perubahan" : "Simpan sebagai draft" }}
                        </button>
                    </form>
                </section>

                <section class="mt-10">
                    <div class="flex items-end justify-between gap-4">
                        <div>
                            <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">Font yang diajukan</h2>
                            <p class="mt-1 text-sm text-[#68686C]">Periksa catatan admin dan status setiap pengajuan.</p>
                        </div>
                        <button type="button" class="text-sm font-semibold text-[#121214] underline" @click="loadData">
                            Muat ulang
                        </button>
                    </div>

                    <div v-if="isLoading" class="mt-5 h-28 animate-pulse rounded-lg bg-white" role="status" />
                    <div v-else-if="fonts.length === 0" class="mt-5 rounded-lg border border-dashed border-[#D1C9B8] bg-white px-5 py-12 text-center">
                        <h3 class="font-['Crimson_Pro'] text-xl font-semibold text-[#121214]">Belum ada font</h3>
                        <p class="mt-2 text-sm text-[#68686C]">Simpan draft pertama Anda melalui formulir di atas.</p>
                    </div>
                    <div v-else class="mt-5 grid gap-4">
                        <article v-for="font in fonts" :key="font.id" class="rounded-lg border border-[#E2E2E4] bg-white p-5 sm:p-6">
                            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-3">
                                        <h3 class="font-['Crimson_Pro'] text-xl font-semibold text-[#121214]">{{ font.name }}</h3>
                                        <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusTone(font.status)">
                                            {{ statusLabel(font.status) }}
                                        </span>
                                    </div>
                                    <p class="mt-1 break-all font-mono text-xs text-[#68686C]">/{{ font.slug }}</p>
                                    <p class="mt-3 text-sm leading-6 text-[#68686C]">{{ font.description || "Belum ada deskripsi." }}</p>
                                    <p class="mt-2 text-sm font-medium text-[#121214]">{{ formatPrice(font.price) }}</p>
                                    <div class="mt-3 flex flex-wrap gap-2">
                                        <span v-for="family in font.font_families" :key="`${family.name}-${family.original_name}`" class="rounded bg-[#F1F1F0] px-2.5 py-1 text-xs text-[#68686C]">
                                            {{ family.name }} · {{ family.format.toUpperCase() }}
                                        </span>
                                    </div>
                                    <p v-if="font.review_note" class="mt-4 rounded border border-[#D9A49D] bg-[#FFF8F6] p-3 text-sm leading-6 text-[#9A3D32]">
                                        Catatan admin: {{ font.review_note }}
                                    </p>
                                </div>
                                <div class="flex shrink-0 flex-wrap gap-3">
                                    <button
                                        v-if="['draft', 'changes_requested'].includes(font.status)"
                                        type="button"
                                        class="text-sm font-semibold text-[#121214] underline underline-offset-4"
                                        @click="editFont(font)"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        v-if="['draft', 'changes_requested'].includes(font.status)"
                                        type="button"
                                        class="text-sm font-semibold text-[#D35230] underline underline-offset-4 disabled:opacity-50"
                                        :disabled="isSubmittingFont === font.id"
                                        @click="submitForReview(font)"
                                    >
                                        {{ isSubmittingFont === font.id ? "Mengirim..." : "Kirim ke admin" }}
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </section>

            <AdminToast
                :show="Boolean(toastMessage)"
                :message="toastMessage"
                :variant="toastVariant"
                @dismiss="toastMessage = ''"
            />
        </main>
    </AppLayout>
</template>
