<script lang="ts" setup>
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {useForm} from "vee-validate";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Loader2} from 'lucide-vue-next'
import type {Provider} from "@supabase/auth-js";

definePageMeta({
  layout: false
})

const isLoading = ref(false)
const client = useSupabaseClient()
const registerSchema = toTypedSchema(z.object({
  firstName: z.string({required_error: "Obrigatório"})
      .min(3, "Precisa ter pelo menos 3 caracteres")
      .max(50, "Precisa ter no máximo 50 caracteres"),
  lastName: z.string({required_error: "Obrigatório"})
      .min(3, "Precisa ter pelo menos 3 caracteres")
      .max(50, "Precisa ter no máximo 50 caracteres"),
  email: z.string({required_error: "Obrigatório"}).email(FormConstants.EMAIL_FIELD),
  password: z.string({required_error: "Obrigatório"})
      .min(6, "Precisa ter pelo menos 6 caracteres")
      .max(18, "Precisa ter no máximo 12 caracteres"),
}))

const {handleSubmit} = useForm({
  validationSchema: registerSchema
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  const {data, error} = await client.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
      },
    }
  })
  await client.auth.signInWithPassword({
    email: values.email,
    password: values.password
  })

  isLoading.value = false
})

const onSubmitWithProvider = async (provider: Provider) => {
  isLoading.value = true
  await client.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: "/"
    }
  });
  isLoading.value = false
}

const user = useSupabaseUser()
onMounted(() => {
  watchEffect(() => {
    if (user.value) {
      navigateTo("/")
    }
  })
})
</script>

<template>
  <div class="min-h-screen flex items-center">
    <Card class="mx-auto w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
      <CardHeader>
        <CardTitle class="text-xl">
          Registre-se
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit="onSubmit">
          <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            <FormField v-slot="{componentField,errors }" name="firstName">
              <FormItem class="grid gap-2">
                <FormLabel class="text-white" for="firstName">Nome</FormLabel>
                <FormControl>
                  <Input
                      id="firstName"
                      :class="errors.length > 0 ? 'ring-2 ring-red-500' : 'ring-0'"
                      placeholder="Urich"
                      type="text"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
              </FormItem>
            </FormField>
            <FormField v-slot="{componentField,errors }" name="lastName">
              <FormItem class="grid gap-2">
                <FormLabel class="text-white" for="lastName">Sobrenome</FormLabel>
                <FormControl>
                  <Input
                      id="lastName"
                      :class="errors.length > 0 ? 'ring-2 ring-red-500' : 'ring-0'"
                      placeholder="Oliveira"
                      type="text"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
              </FormItem>
            </FormField>
          </div>
          <FormField v-slot="{componentField,errors }" name="email">
            <FormItem class="grid gap-2">
              <FormLabel class="text-white" for="email">Email</FormLabel>
              <FormControl>
                <Input
                    id="email"
                    :class="errors.length > 0 ? 'ring-2 ring-red-500' : 'ring-0'"
                    placeholder="m@example.com"
                    type="email"
                    v-bind="componentField"
                />
              </FormControl>
              <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
            </FormItem>
          </FormField>
          <FormField v-slot="{componentField, errors }" name="password">
            <FormItem class="grid gap-2">
              <FormLabel class="text-white" for="password">Senha</FormLabel>
              <FormControl>
                <Input
                    id="password"
                    :class="errors.length > 0 ? 'ring-2 ring-red-500' : 'ring-0'"
                    type="password"
                    v-bind="componentField"/>
              </FormControl>
              <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
            </FormItem>
          </FormField>
          <Button :disabled="isLoading" class="w-full" type="submit">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin"/>
            Criar conta
          </Button>
          <Button class="w-full" variant="outline" @click.prevent="onSubmitWithProvider('github')">
            Criar conta com GitHub
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Já tem uma conta?
          <NuxtLink class="underline" to="/login">
            Entre
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>

</style>