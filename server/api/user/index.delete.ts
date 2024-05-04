import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const {id, soft} = getQuery(event)

    const {data, error} = await client.auth.admin.deleteUser(id as string, soft as boolean);

    return {data, error}
})
