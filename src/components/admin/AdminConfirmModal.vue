<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

const props = withDefaults(
    defineProps<{
        show: boolean;
        title: string;
        message: string;
        confirmLabel?: string;
        isLoading?: boolean;
        danger?: boolean;
    }>(),
    {
        confirmLabel: "Konfirmasi",
        isLoading: false,
        danger: false,
    },
);

const emit = defineEmits<{
    confirm: [];
    cancel: [];
}>();

function handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && props.show && !props.isLoading) {
        emit("cancel");
    }
}

onMounted(() => window.addEventListener("keydown", handleEscape));
onBeforeUnmount(() => window.removeEventListener("keydown", handleEscape));
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="show"
                class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgba(18,18,20,0.42)] p-4"
                @click.self="!isLoading && emit('cancel')"
            >
                <section
                    class="w-full max-w-lg rounded-lg border border-[#E2E2E4] bg-white p-6 shadow-xl sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-confirm-title"
                >
                    <h2
                        id="admin-confirm-title"
                        class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]"
                    >
                        {{ title }}
                    </h2>
                    <p class="mt-4 text-sm leading-6 text-[#68686C]">
                        {{ message }}
                    </p>
                    <div v-if="$slots.default" class="mt-4">
                        <slot />
                    </div>
                    <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            :disabled="isLoading"
                            class="inline-flex h-11 items-center justify-center rounded border border-[#E2E2E4] bg-white px-5 text-sm font-semibold text-[#121214] transition hover:bg-[#F6F6F5] disabled:cursor-not-allowed disabled:opacity-60"
                            @click="emit('cancel')"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            :disabled="isLoading"
                            :class="[
                                'inline-flex h-11 items-center justify-center gap-2 rounded px-5 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-60',
                                danger
                                    ? 'bg-[#9A3D32] hover:bg-[#7F3028]'
                                    : 'bg-[#121214] hover:bg-[#343438]',
                            ]"
                            @click="emit('confirm')"
                        >
                            <span
                                v-if="isLoading"
                                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                aria-hidden="true"
                            />
                            {{ isLoading ? "Memproses..." : confirmLabel }}
                        </button>
                    </div>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>
