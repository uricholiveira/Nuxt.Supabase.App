import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const {page, perPage} = getQuery(event)


    const {data, error} = await client.auth.admin.listUsers(
        {page: page as number, perPage: perPage as number});

    return {data, error}
})
