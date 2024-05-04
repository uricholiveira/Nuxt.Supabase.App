<script lang="ts" setup>
import {Database, Eye, File, ListFilter, Loader2, MoreHorizontal, PlusCircle} from 'lucide-vue-next'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {Table, TableBody, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Tabs, TabsContent, TabsList, TabsTrigger,} from '@/components/ui/tabs'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import {useUsersStore} from "~/stores/users";

definePageMeta({
  middleware: ['auth']
})

const page = ref(1)
const perPage = ref(10)
const store = useUsersStore()
const {users, pagination, isLoading} = storeToRefs(store);

watchEffect(async () => {
  await store.fetchUsers(page.value, perPage.value)
})

const handleUserDelete = async (id: string) => {
  await store.deleteUserById(id).finally(async () => await store.fetchUsers(page.value, perPage.value))
}
</script>

<template>
  <div>
    <Tabs default-value="all">
      <div class="flex items-center">
        <TabsList>
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          <TabsTrigger class="hidden sm:flex" disabled value="archived">
            Arquivados
          </TabsTrigger>
        </TabsList>
        <div class="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button class="gap-1" size="sm" variant="outline">
                <ListFilter class="h-3.5 w-3.5"/>
                <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem checked>
                Status
              </DropdownMenuItem>
              <DropdownMenuItem>
                Permissão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button class="gap-1" size="sm" variant="outline">
            <File class="h-3.5 w-3.5"/>
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar
                </span>
          </Button>
          <Button class="gap-1 border-blue-900" size="sm" variant="default" @click="navigateTo('/users/new')">
            <PlusCircle class="h-3.5 w-3.5"/>
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar Usuário
                </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              ...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="hidden w-[100px] sm:table-cell">
                    <span class="sr-only">img</span>
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <TableHead>
                          Status
                        </TableHead>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Email/Número verificado?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TableHead class="hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead class="hidden md:table-cell">
                    Número
                  </TableHead>
                  <TableHead class="hidden md:table-cell">
                    Permissão
                  </TableHead>
                  <TableHead class="hidden md:table-cell">
                    Criado em
                  </TableHead>
                  <TableHead>
                    <span class="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in users" v-if="users.length > 0">
                  <TableCell class="hidden sm:table-cell">
                    <NuxtImg
                        v-if="user.user_metadata?.avatar_url"
                        :src="user.user_metadata?.avatar_url"
                        alt="Product image"
                        class="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                    />
                    <Skeleton v-else class="aspect-square rounded-md w-[64px] h-[64px]"/>
                  </TableCell>
                  <TableCell class="font-medium">
                    {{ user.user_metadata?.full_name }}
                  </TableCell>
                  <TableCell>
                    <Badge v-if="user.user_metadata?.email_verified" variant="default">
                      Ativo
                    </Badge>
                    <Badge v-else variant="destructive">Inativo</Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ user?.email }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ user.phone }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ user.role }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    2023-07-12 10:42 AM
                  </TableCell>
                  <TableCell class="text-right">
                    <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        @click="navigateTo(`/users/${user.id}`)"
                    >
                      <Eye class="h-4 w-4"/>
                      <span class="sr-only">Toggle menu</span>
                    </Button>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                          >
                            <MoreHorizontal class="h-4 w-4"/>
                            <span class="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem>Alterar senha</DropdownMenuItem>
                          <DropdownMenuItem>Enviar email de recuperação</DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem>Arquivar</DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <AlertDialogTrigger as-child>
                            <DropdownMenuItem>Excluir</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                          <AlertDialogAction @click="handleUserDelete(user.id)">Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
                <TableRow v-else-if="isLoading" class="text-center">
                  <TableCell :colspan="8">
                    <div class="grid gap-4 justify-center items-center my-12">
                      <Loader2 class="w-24 h-24 text-foreground animate-spin"/>
                      <p class="animate-pulse">Carregando</p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-else class="text-center">
                  <TableCell :colspan="8">
                    <div class="grid gap-4 justify-center items-center my-12 animate-pulse">
                      <Database class="w-24 h-24 text-foreground"/>
                      <p>Não há dados</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter class="flex justify-end">
            <Pagination v-slot="{ page }" :items-per-page="perPage" :page="page"
                        :sibling-count="1" :total="pagination.total" show-edges
                        @update:page="value => page = value">
              <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <PaginationFirst/>
                <PaginationPrev/>

                <template v-for="(item, index) in items">
                  <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                    <Button :variant="item.value === page ? 'default' : 'outline'" class="w-10 h-10 p-0">
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index"/>
                </template>

                <PaginationNext/>
                <PaginationLast/>
              </PaginationList>
            </Pagination>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<style scoped>

</style>