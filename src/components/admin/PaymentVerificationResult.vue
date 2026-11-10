<script setup lang="ts">
import AdminStatusBadge from "@/components/admin/AdminStatusBadge.vue";
import type { PaymentVerificationResult } from "@/core/api/adminPayment.api";

defineProps<{
    show: boolean;
    result: PaymentVerificationResult | null;
}>();

const emit = defineEmits<{
    close: [];
}>();

function formatDate(value: string | null) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="show && result"
            class="fixed inset-0 z-[105] flex items-center justify-center overflow-y-auto bg-[rgba(18,18,20,0.42)] p-4"
            @click.self="emit('close')"
        >
            <section
                class="w-full max-w-xl rounded-lg border border-[#E2E2E4] bg-white p-6 shadow-xl sm:p-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-verification-title"
            >
                <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">
                    PAYMENT TESTING
                </p>
                <h2
                    id="payment-verification-title"
                    class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]"
                >
                    Hasil Verifikasi
                </h2>
                <p class="mt-2 text-sm leading-6 text-[#68686C]">
                    Hasil berikut berasal dari backend setelah proses testing payment.
                </p>

                <dl class="mt-6 grid gap-4 rounded border border-[#E2E2E4] p-4 text-sm sm:grid-cols-2">
                    <div>
                        <dt class="text-xs text-[#68686C]">ID payment</dt>
                        <dd class="mt-1 break-all font-mono text-xs text-[#121214]">
                            {{ result.payment.id }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-[#68686C]">Status payment</dt>
                        <dd class="mt-1">
                            <AdminStatusBadge
                                :label="result.payment.gateway_status"
                                tone="success"
                            />
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-[#68686C]">ID order</dt>
                        <dd class="mt-1 break-all font-mono text-xs text-[#121214]">
                            {{ result.order.id }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-[#68686C]">Status order</dt>
                        <dd class="mt-1">
                            <AdminStatusBadge
                                :label="result.order.status"
                                tone="success"
                            />
                        </dd>
                    </div>
                    <div class="sm:col-span-2">
                        <dt class="text-xs text-[#68686C]">Waktu pembayaran</dt>
                        <dd class="mt-1 text-[#121214]">
                            {{ formatDate(result.payment.paid_at) }}
                        </dd>
                    </div>
                </dl>

                <div
                    class="mt-4 rounded border p-4"
                    :class="
                        result.collection.confirmed
                            ? 'border-[#B8D9C1] bg-[#F4FAF5]'
                            : 'border-[#D9A49D] bg-[#FFF8F6]'
                    "
                    role="status"
                >
                    <p
                        class="text-sm font-semibold"
                        :class="
                            result.collection.confirmed
                                ? 'text-[#28633B]'
                                : 'text-[#9A3D32]'
                        "
                    >
                        {{
                            result.collection.confirmed
                                ? "Data berhasil diverifikasi di collection."
                                : "Jumlah data di collection belum sesuai."
                        }}
                    </p>
                    <p class="mt-1 text-sm text-[#68686C]">
                        Ditemukan {{ result.collection.found_items }} dari
                        {{ result.collection.expected_items }} item order.
                    </p>
                </div>

                <div class="mt-7 flex justify-end">
                    <button
                        type="button"
                        class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 text-sm font-semibold text-white hover:bg-[#343438]"
                        @click="emit('close')"
                    >
                        Selesai
                    </button>
                </div>
            </section>
        </div>
    </Teleport>
</template>
