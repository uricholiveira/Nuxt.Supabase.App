import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const {id} = getQuery(event)
    const formData = await readMultipartFormData(event)

    const {data, error} = await client.storage.from('avatars')
        .upload(`${id as string}.png`, formData![0].data, {
            cacheControl: '3600',
            upsert: true,
        })

    if (error) {
        console.log(error)
    }

    const {data: storageFile} = client.storage.from('avatars').getPublicUrl(`${id}.png`)

    console.log(storageFile.publicUrl)
    await client.auth.admin.updateUserById(id as string, {
        user_metadata: {
            avatar_url: storageFile.publicUrl
        }
    })
})
