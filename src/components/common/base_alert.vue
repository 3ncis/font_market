<template>
    <div :class="['rounded-xl border p-4', variantClasses[variant].container]">
        <div class="flex items-start gap-3">
            <div :class="['-mt-0.5', variantClasses[variant].icon]">
                <component :is="icons[variant]" />
            </div>
            <div class="flex-1">
                <h4 class="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                    {{ title }}
                </h4>

                <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
                <router-link v-if="showLink" :to="linkHref"
                    class="inline-block mt-3 text-sm font-medium text-gray-700 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    {{ linkText }}
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import {
    errorIcon,
    successIcon,
    warningIcon,
    infoIcon
} from '@/services/icons/index_icon'
export default {
    name: 'base alert',
    props: {
        type: {
            type: String,
            default: 'success'
        },
        variant: {
            type: String,
            default: 'success',
            validator: (value) => [
                'success',
                'warning',
                'error'
            ].includes(value)
        },
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        },
        linkHref: {
            type: String,
            default: ''
        },
        linkText: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showLink: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            icons: {
                success: successIcon,
                warning: warningIcon,
                error: errorIcon,
                info: infoIcon
            },
            variantClasses: {
                success: {
                    container: 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/15',
                    icon: 'text-emerald-500',
                },
                error: {
                    container: 'border-rose-500 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/15',
                    icon: 'text-rose-500',
                },
                warning: {
                    container: 'border-amber-500 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/15',
                    icon: 'text-amber-500',
                },
                info: {
                    container: 'border-sky-500 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/15',
                    icon: 'text-sky-500',
                },
            },
        }
    },
}
</script>