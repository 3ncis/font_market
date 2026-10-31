<script>
export default {
    name: 'ConfirmRemoveModal',

    props: {
        show: {
            type: Boolean,
            default: false,
        },
        font: {
            type: Object,
            default: null,
        },
    },

    emits: ['cancel', 'confirm'],

    computed: {
        styleCount() {
            return this.font?.styles || this.font?.styleCount || this.font?.stylesCount || 1;
        },

        licenseLabel() {
            return this.font?.licenseLabel ||
                this.font?.license ||
                this.font?.licenseType ||
                'Lisensi belum dicantumkan';
        },
    },

    methods: {
        handleEscape(event) {
            if (event.key === 'Escape' && this.show) {
                this.$emit('cancel');
            }
        },
    },

    mounted() {
        window.addEventListener('keydown', this.handleEscape);
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.handleEscape);
    },
};
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show && font"
                class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgba(18,18,20,0.09)] p-5 sm:p-10"
                @click.self="$emit('cancel')">
                <div class="w-full max-w-[560px] rounded-lg border border-[#E2E2E4] bg-white p-6 shadow-xl sm:p-8"
                    role="dialog" aria-modal="true" aria-labelledby="remove-modal-title">
                    <h2 id="remove-modal-title"
                        class="font-['Crimson_Pro'] text-[28px] font-semibold leading-[1.12] text-[#121214] sm:text-[32px]">
                        Hapus {{ font.name }} dari koleksi?
                    </h2>

                    <p class="mt-5 font-['Geist'] text-sm leading-[21.7px] text-[#68686C]">
                        {{ font.name }} · {{ font.designer }} ·
                        {{ styleCount }} gaya · {{ licenseLabel }}.
                        Font ini belum dihapus. Penghapusan hanya dilakukan setelah
                        Anda memilih “Ya, Hapus”.
                    </p>

                    <div class="my-6 h-px w-full bg-[#E2E2E4]"></div>

                    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button type="button"
                            class="inline-flex h-12 items-center justify-center rounded border border-[#E2E2E4] bg-white px-5 font-['Geist'] text-sm font-semibold text-[#121214] transition hover:bg-[#F6F6F5]"
                            @click="$emit('cancel')">
                            Batal
                        </button>
                        <button type="button"
                            class="inline-flex h-12 items-center justify-center rounded border border-[#121214] bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white transition hover:bg-[#343438]"
                            @click="$emit('confirm')">
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
