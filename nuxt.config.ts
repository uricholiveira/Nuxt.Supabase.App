// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        '@nuxtjs/color-mode',
        "@nuxtjs/supabase",
        "@vee-validate/nuxt",
        "@nuxt/image",
        '@pinia/nuxt'
    ],
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui'
    },
    colorMode: {
        classSuffix: ''
    },
    supabase: {
        redirectOptions: {
            login: '/auth/login',
            callback: '/',
            exclude: ['/auth/register'],
        }
    }
})