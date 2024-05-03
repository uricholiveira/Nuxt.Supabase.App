<script lang="ts" setup>
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";
import {useForm} from "vee-validate";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Alert, AlertDescription} from "~/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {AlertCircle, ChevronLeft, Loader2, Upload} from "lucide-vue-next";
import {Separator} from "~/components/ui/separator";
import {Label} from "~/components/ui/label";
import {Checkbox} from "~/components/ui/checkbox";
import {Button} from "~/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";

const route = useRoute()
const {id} = route.params

const isLoading = ref(false)
const isUpdating = ref(false)
const errorMessage = ref('')
const client = useSupabaseClient()
const {data: user} = await client.auth.admin.getUserById(id as string)
const registerSchema = toTypedSchema(z.object({
  firstName: z.string({required_error: "Obrigatório"})
      .min(3, "Precisa ter pelo menos 3 caracteres")
      .max(50, "Precisa ter no máximo 50 caracteres")
      .default(user.user?.user_metadata.full_name.split(' ')[0]),
  lastName: z.string({required_error: "Obrigatório"})
      .min(3, "Precisa ter pelo menos 3 caracteres")
      .max(50, "Precisa ter no máximo 50 caracteres")
      .default(user.user?.user_metadata.full_name.split(' ')[1]),
  email: z.string({required_error: "Obrigatório"})
      .email(FormConstants.EMAIL_FIELD)
      .default(user.user?.email),
  password: z.string({required_error: "Obrigatório"})
      .min(6, "Precisa ter pelo menos 6 caracteres")
      .max(18, "Precisa ter no máximo 12 caracteres"),
  acceptTerms: z.boolean({required_error: "Obrigatório"}).default(user.user?.user_metadata?.acceptTerms),
  status: z.string({required_error: "Obrigatório"}).default(user.user?.email_confirmed_at ? 'Ativo' : 'Inativo'),
  preferences: z.object({
    email: z.object({
      marketing: z.boolean().default(user.user?.user_metadata?.preferences?.email?.marketing),
      telemetry: z.boolean().default(user.user?.user_metadata?.preferences?.email?.marketing)
    })
  })
}))

const {handleSubmit} = useForm({
  validationSchema: registerSchema
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  const {data, error} = await client.auth.admin.createUser({
    email: values.email,
    password: values.password,
    email_confirm: values.status === 'Ativo',
    user_metadata: {
      name: values.firstName,
      full_name: `${values.firstName} ${values.lastName}`,
      accept_terms: values.acceptTerms,
      preferences: {
        email: {
          marketing: values.preferences.email.marketing,
          telemetry: values.preferences.email.telemetry,
        }
      }
    },
  }).finally(() => isLoading.value = false)
  console.log(data)
  console.log(error)

  if (error) {
    errorMessage.value = error.message
  } else {
    await navigateTo("/users")
  }
})

const handleUserDelete = async () => {
  isLoading.value = true
  const {data, error} = await client.auth.admin.deleteUser(id as string).finally(() => isLoading.value = false)

  await navigateTo('/users')
}
</script>

<template>
  <div class="grid flex-1 auto-rows-max gap-4">

    <div class="flex items-center gap-4">
      <Button size="icon" variant="outline" @click="navigateTo('/users')">
        <ChevronLeft class="h-4 w-4"/>
        <span class="sr-only">Back</span>
      </Button>
      <div class="hidden items-center gap-2 md:ml-auto md:flex">
        <Button size="sm" variant="outline" @click="navigateTo('/users')">
          Cancelar
        </Button>
        <Button v-if="!isUpdating" size="sm" variant="secondary" @click="isUpdating = true">
          Editar
        </Button>
        <Button v-if="isUpdating" size="sm" variant="secondary" @click="isUpdating = false">
          Visualizar
        </Button>
        <Button v-if="isUpdating" :disabled="isLoading" size="sm" @click="onSubmit">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin"/>
          Salvar usuário
        </Button>
      </div>
    </div>
    <Alert v-if="errorMessage" variant="destructive">
      <AlertCircle class="w-4 h-4"/>
      <AlertDescription>
        {{ errorMessage }}
      </AlertDescription>
    </Alert>
    <div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
      <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                <FormField v-slot="{componentField,errors }" name="firstName">
                  <FormItem class="grid gap-2">
                    <FormLabel class="text-white" for="firstName">Nome</FormLabel>
                    <FormControl>
                      <Input
                          id="firstName"
                          :class="errors.length > 0 ? 'ring-1 ring-red-500' : 'ring-0'"
                          :disabled="!isUpdating"
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
                          :class="errors.length > 0 ? 'ring-1 ring-red-500' : 'ring-0'"
                          :disabled="!isUpdating"
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
                        :class="errors.length > 0 ? 'ring-1 ring-red-500' : 'ring-0'"
                        :disabled="!isUpdating"
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
                        :class="errors.length > 0 ? 'ring-1 ring-red-500' : 'ring-0'"
                        disabled
                        type="password"
                        v-bind="componentField"/>
                  </FormControl>
                  <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
                </FormItem>
              </FormField>

              <div class="grid grid-cols-1 space-x-2">
                <FormField v-slot="{ value,errors,  handleChange }" name="acceptTerms" type="checkbox">
                  <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox :checked="value" :disabled="!isUpdating"
                                @update:checked="handleChange"/>
                    </FormControl>
                    <div class="space-y-1 leading-none">
                      <FormLabel class="text-white">Aceita os termos e condições?</FormLabel>
                      <FormDescription>
                        Ao aceitar com os termos e condições, o usuário está de acordo com ...
                      </FormDescription>
                      <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
                    </div>
                  </FormItem>
                </FormField>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Comunicações, permissões, etc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap justify-start gap-4">
              <div class="w-full flex items-center space-x-2">
                <Checkbox id="terms"
                          :disabled="!isUpdating"/>
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="terms"
                >
                  Notificações de marketing por email
                </label>
              </div>
              <div class="w-full flex items-center space-x-2">
                <Checkbox id="terms"
                          :disabled="!isUpdating"/>
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="terms"
                >
                  Permite coleta de dados
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6 sm:grid-cols-3">
              <div class="grid gap-3">
                <Label for="category">Permissão</Label>
                <Select
                    :disabled="!isUpdating">
                  <SelectTrigger
                      id="category"
                      aria-label="Selecione a permissão"
                  >
                    <SelectValue placeholder="Selecione a permissão"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">
                      Admin
                    </SelectItem>
                    <SelectItem value="electronics">
                      User
                    </SelectItem>
                    <SelectItem value="accessories">
                      Visitante
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField v-slot="{ componentField, errors }" name="status">
              <FormItem>
                <FormLabel class="text-white">Status</FormLabel>
                <Select :disabled="!isUpdating"
                        v-bind="componentField">
                  <FormControl>
                    <SelectTrigger :class="errors.length > 0 ? 'ring-1 ring-red-500' : 'ring-0'">
                      <SelectValue placeholder="Selecione um status válido"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Ativo">
                        Ativo
                      </SelectItem>
                      <SelectItem value="Inativo">
                        Inativo
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription class="text-center">
                  Ativo significa que o usuário terá o email verificado automaticamente
                </FormDescription>
                <FormMessage :class="errors.length > 0 ? 'text-red-500' : 'text-white'"/>
              </FormItem>
            </FormField>
          </CardContent>
        </Card>
        <Card class="overflow-hidden">
          <CardHeader>
            <CardTitle>Imagem de perfil</CardTitle>
            <CardDescription class="text-xs">
              Envie um arquivo menor que 10 MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid justify-center gap-2">
              <Avatar shape="square" size="lg">
                <AvatarImage :src="user?.user?.user_metadata?.avatar_url" alt="@radix-vue"/>
                <AvatarFallback>??</AvatarFallback>
              </Avatar>
              <div class="flex justify-center items-center gap-2">
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-center">
            <button class="aspect-square items-center justify-center rounded-md border border-dashed">
              <Upload :disabled="!isUpdating"
                      class="w-12 text-muted-foreground"/>
              <span class="sr-only">Upload</span>
            </button>
          </CardFooter>
        </Card>
        <Card v-if="$route.path != '/users/new'">
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>
              Arquivar, excluir, resetar senha, etc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-4">
              <Button size="sm" variant="outline">
                Resetar senha
              </Button>
              <Button size="sm" variant="secondary">
                Arquivar
              </Button>
              <Separator/>
              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button size="sm" variant="destructive">
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente seu
                      conta e remova seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction @click="handleUserDelete">Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <div class="flex items-center justify-center gap-2 md:hidden">
      <Button size="sm" variant="outline">
        Cancelar
      </Button>
      <Button size="sm">
        Salvar usuário
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>