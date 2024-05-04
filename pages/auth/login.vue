<script lang="ts" setup>
import {Button} from '~/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card'
import {Input} from '~/components/ui/input'
import {FormControl, FormItem, FormLabel,} from '~/components/ui/form'
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {useForm} from "vee-validate";
import {Alert, AlertDescription} from "~/components/ui/alert";
import {AlertCircle, Loader2} from "lucide-vue-next";

definePageMeta({
  layout: false
})

const router = useRouter();
const isLoading = ref(false)
const errorMessage = ref('');
const user = useSupabaseUser()
const client = useSupabaseClient()
const loginSchema = toTypedSchema(z.object({
  email: z.string({required_error: "Obrigatório"}).email(FormConstants.EMAIL_FIELD),
  password: z.string({required_error: "Obrigatório"})
      .min(6, "Precisa ter pelo menos 6 caracteres")
      .max(18, "Precisa ter no máximo 12 caracteres"),
}))

const {handleSubmit} = useForm({
  validationSchema: loginSchema
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  const {data, error} = await client.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error?.message === 'Invalid auth credentials') {
    errorMessage.value = 'Usuário/senha incorretos'
  }
  isLoading.value = false
})

const onSubmitWithProvider = async (provider: any) => {
  isLoading.value = true
  await client.auth.signInWithOAuth({
    provider: provider
  });

  isLoading.value = false
}

watchEffect(async () => {
  if (user?.value) {
    console.log('watchEffect', user.value)
    await router.push("/")
  }
})

</script>

<template>
  <div class="min-h-screen flex flex-wrap items-center">
    <Card class="mx-auto w-96">
      <CardHeader>
        <CardTitle class="text-2xl">
          Entrar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit="onSubmit">
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
            Entrar
          </Button>
          <Button :disabled="isLoading" class="w-full" variant="outline" @click="onSubmitWithProvider('github')">
            Entrar com GitHub
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Ainda não tem uma conta?
          <NuxtLink class="underline" to="/auth/register">
            Crie uma
          </NuxtLink>
        </div>
      </CardContent>
      <CardFooter v-if="errorMessage">
        <Alert variant="destructive">
          <AlertCircle class="w-4 h-4"/>
          <AlertDescription>
            {{ errorMessage }}
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>


  </div>
</template>