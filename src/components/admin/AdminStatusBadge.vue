<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        tone?: "success" | "muted" | "warning" | "danger" | "dark";
    }>(),
    { tone: "muted" },
);

const tones = {
    success: "bg-[#EAF5EE] text-[#28633B]",
    muted: "bg-[#F1F1F0] text-[#68686C]",
    warning: "bg-[#FFF5DF] text-[#855B0A]",
    danger: "bg-[#FFF0ED] text-[#9A3D32]",
    dark: "bg-[#121214] text-white",
};
</script>

<template>
    <span
        :class="[
            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
            tones[tone],
        ]"
    >
        {{ label }}
    </span>
</template>
