export default defineNuxtRouteMiddleware(async (to) => {
    const router = useRouter()
    const user = useSupabaseUser()
    console.log(user.value)
    // As rotas que serão acessíveis por usuários não autenticados
    const openRoutes = ['/auth/register']

    if (!user.value && !openRoutes.includes(to.path)) {
        await router.push("/auth/login")
    }
})