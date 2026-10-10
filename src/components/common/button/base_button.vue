<template>
    <button 
        :type="type" 
        :disabled="disabled || isLoading" 
        :class="[
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses,
        sizeClasses,
        (disabled || isLoading) 
            ? 'opacity-60 cursor-not-allowed' 
            : 'cursor-pointer'
    ]" @click="$emit('click', $event)">
        <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        <slot>Submit</slot>
    </button>
</template>

<script>
export default {
    name: 'base button',
    props: {
        type: {
            type: String,
            default: 'submit'
        },
        variant: {
            type: String,
            default: 'primary',
            validatpr: (value) => [
                'primary',
                'secondary',
                'danger',
                'success'
            ].includes(value)
        },
        size: {
            type: String,
            default: 'md',
            validator: (value) => [
                'md',
                'sm',
                'lg'
            ].includes(value)
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        disabled: {
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
        sizeClasses() {
            switch (this.size) {
                case 'sm':
                    return 'px-3 py-1.5 text-xs'
                case 'md':
                    return 'px-4 py-2.5 text-sm'
                case 'lg':
                    return 'px-6 py-3.5 text-base'
                default:
                    return 'px-4 py-2.5 text-sm'
            }
        }
    }
}
</script>