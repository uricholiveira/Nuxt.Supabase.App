<script lang="ts" setup>

definePageMeta({
  middleware: "auth"
})

const user = useSupabaseUser()
const session = useSupabaseSession()

console.log('user', user.value)

</script>

<template>
  <div>
    <h1>Olá, {{ user?.email }}</h1>
  </div>
</template>

<style scoped>

</style>