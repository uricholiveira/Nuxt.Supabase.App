<script lang="ts" setup>
import type {HTMLAttributes} from 'vue'
import {cn} from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class'],
  colspan?: number
}>()
</script>

<template>
  <td
      :class="
      cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        props.class,
      )
    "
      :colspan="colspan"
  >
    <slot/>
  </td>
</template>
