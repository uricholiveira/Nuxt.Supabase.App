<script lang="ts" setup>
import {Upload} from "lucide-vue-next";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import type {HTMLAttributes} from "vue";

const props = defineProps<{
  disabled?: boolean,
  class?: HTMLAttributes['class'],
  onChange?: (file: File | null) => void
}>()

const emit = defineEmits(["change"]);

const handleChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  props.onChange?.(file);
  emit('change', file);
}

</script>

<template>
  <div class="upload-btn-wrapper rounded-md hover:bg-muted">
    <Button class="border border-dashed" variant="ghost">
      <Upload :disabled="disabled"
              class="w-12 text-muted-foreground"/>
      <span class="sr-only">Upload</span>
    </Button>
    <Input type="file" @change="handleChange"/>
  </div>
</template>

<style scoped>
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>