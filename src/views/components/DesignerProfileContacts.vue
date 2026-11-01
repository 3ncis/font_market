<template>
    <div v-if="contactsList.length" class="flex flex-col gap-3">
        <a v-for="contact in contactsList" :key="contact.type" :href="contact.href"
            :target="contact.external ? '_blank' : undefined"
            :rel="contact.external ? 'noopener noreferrer' : undefined"
            class="break-all font-mono text-[13px] text-[#6B7280] transition hover:text-[#121214]">
            {{ contact.value }}
        </a>
    </div>
</template>

<script>
function externalHref(value) {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default {
    name: 'DesignerProfileContacts',

    props: {
        contacts: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        contactsList() {
            const items = [];
            const instagram = this.contacts.instagram?.trim();
            const website = this.contacts.website?.trim();
            const email = this.contacts.email?.trim();

            if (instagram) {
                items.push({
                    type: 'instagram',
                    value: instagram,
                    href: externalHref(instagram.startsWith('@')
                        ? `https://instagram.com/${instagram.slice(1)}`
                        : instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`),
                    external: true,
                });
            }

            if (website) {
                items.push({
                    type: 'website',
                    value: website,
                    href: externalHref(website),
                    external: true,
                });
            }

            if (email) {
                items.push({
                    type: 'email',
                    value: email,
                    href: `mailto:${email}`,
                    external: false,
                });
            }

            return items;
        },
    },
};
</script>
