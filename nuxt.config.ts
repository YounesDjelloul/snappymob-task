// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
        '@nuxt/test-utils/module',
        '@nuxtjs/tailwindcss',
        'nuxt-icon'
    ],
    app: {
        pageTransition: {
            name: 'page',
            mode: 'out-in'
        },
        baseURL: '/snappymob-task/',
    },
    nitro: {
        preset: 'github_pages'
    },
})
