<script lang="ts" setup>

definePageMeta({
  middleware: ['auth']
})

const client = useSupabaseClient()

async function logout() {
  await client.auth.signOut()
  navigateTo("/login")
}
</script>

<template>
  <div>
    <h1>aaa</h1>
  </div>
</template>

<style scoped>

</style>