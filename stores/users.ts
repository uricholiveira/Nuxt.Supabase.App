import type {Pagination, User} from "@supabase/auth-js";

export const useUsersStore = defineStore("users", {
    state: () => ({
        isLoading: ref(false),
        pagination: {
            nextPage: ref(),
            lastPage: ref(),
            total: ref()
        },
        users: ref([] as User[]),
        user: ref(null as User | null)
    }),
    actions: {
        async fetchUsers(page: number = 1, perPage: number = 10) {
            this.isLoading = true
            const {data, error} = await useFetch("/api/users", {
                params: {
                    page: page,
                    perPage: perPage
                }
            }).finally(() => this.isLoading = false)

            if (error.value) {
                console.log("error:", error)
            }

            const response = data.value?.data as { users: User[]; aud: string; } & Pagination

            // TODO: push to this.user if not in there
            this.users = []
            this.users.push(...response.users)
            this.pagination.nextPage = response.nextPage
            this.pagination.lastPage = response.lastPage
            this.pagination.total = response.total
        },

        async fetchUserById(id: string) {
            this.isLoading = true
            const {data, error} = await useFetch("/api/user", {
                params: {
                    id: id
                }
            }).finally(() => this.isLoading = false)

            if (error.value) {
                console.log("error:", error)
            }

            const response = data.value?.data
            this.user = response?.user as User

            // return {data: response?.user as User, error}
        },

        async deleteUserById(id: string, soft: boolean = false) {
            this.isLoading = true
            const {data, error} = await useFetch("/api/user", {
                method: "DELETE",
                params: {
                    id: id,
                    soft: soft
                }
            }).finally(() => this.isLoading = false)

            if (error.value) {
                console.log("error:", error)
            }

            return {data, error}
        }
    }
})