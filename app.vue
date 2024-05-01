<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
const colorMode = useColorMode()
colorMode.preference = 'dark'
</script>