<template>
    <div class="h-[180px] w-full overflow-hidden sm:h-[200px] lg:h-[240px]">
        <img :src="bannerSource" :alt="`${designerName} banner`" class="h-full w-full object-cover"
            @error="useDefaultBanner" />
    </div>
</template>

<script>
import defaultBanner from '@/assets/Image/basicBaner.png';

export default {
    name: 'DesignerProfileBanner',

    props: {
        designerName: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: defaultBanner,
        },
    },

    data() {
        return {
            hasBannerError: false,
        };
    },

    computed: {
        bannerSource() {
            return this.image && !this.hasBannerError ? this.image : defaultBanner;
        },
    },

    watch: {
        image() {
            this.hasBannerError = false;
        },
    },

    methods: {
        useDefaultBanner() {
            this.hasBannerError = true;
        },
    },
};
</script>
