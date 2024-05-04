import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const {id} = getQuery(event)


    const {data, error} = await client.auth.admin.getUserById(id as string);

    return {data, error}
})
