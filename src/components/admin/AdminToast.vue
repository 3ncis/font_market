<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";

const props = withDefaults(
    defineProps<{
        show: boolean;
        message: string;
        variant?: "success" | "error";
    }>(),
    { variant: "success" },
);

const emit = defineEmits<{
    dismiss: [];
}>();

let timer: ReturnType<typeof setTimeout> | undefined;

watch(
    () => props.show,
    (show) => {
        if (timer) clearTimeout(timer);
        if (show) timer = setTimeout(() => emit("dismiss"), 4500);
    },
);

onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
});
</script>

<template>
    <Transition
        enter-active-class="transition duration-200"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="show"
            class="fixed bottom-5 right-5 z-[110] flex max-w-[calc(100vw-2.5rem)] items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg sm:max-w-sm"
            :class="
                variant === 'success'
                    ? 'border-[#B8D9C1]'
                    : 'border-[#D9A49D]'
            "
            role="status"
            aria-live="polite"
        >
            <p
                class="flex-1 text-sm leading-5"
                :class="variant === 'success' ? 'text-[#28633B]' : 'text-[#9A3D32]'"
            >
                {{ message }}
            </p>
            <button
                type="button"
                class="text-xs font-semibold text-[#68686C] hover:text-[#121214]"
                aria-label="Tutup notifikasi"
                @click="emit('dismiss')"
            >
                Tutup
            </button>
        </div>
    </Transition>
</template>
