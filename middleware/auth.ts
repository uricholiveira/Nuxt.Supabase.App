export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

    // As rotas que serão acessíveis por usuários não autenticados
    const openRoutes = ['/register']

    if (!user.value && !openRoutes.includes(to.path)) {
        navigateTo("/login")
    } else {
        navigateTo(to)
    }
})