<template>
  <div :class="['rounded-xl border p-4', variantClasses[variant].container]">
    <div class="flex items-start gap-3">
      <div :class="['-mt-0.5', variantClasses[variant].icon]">
        <component :is="icons[variant]" />
      </div>

      <div>
        <h4 class="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
          {{ title }}
        </h4>

        <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>

        <router-link
          v-if="showLink"
          :to="linkHref"
          class="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
        >
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
export default{
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
    computed: {
        variantClasses() {
            switch (this.variant) {
                case 'primary':
                    return 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500 shadow-sm'
                case 'secondary':
                    return 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700 shadow-sm'
                case 'danger':
                    return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm'
                case 'outline':
                    return 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-violet-500'
                default:
                    return 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500'
            }
        },
    }
}
</script>