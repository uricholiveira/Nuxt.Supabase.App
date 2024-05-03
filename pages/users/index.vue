<script lang="ts" setup>
import {Eye, File, ListFilter, MoreHorizontal, PlusCircle} from 'lucide-vue-next'

import {Badge} from '@/components/ui/badge'
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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Tabs, TabsContent, TabsList, TabsTrigger,} from '@/components/ui/tabs'
import {Skeleton} from "~/components/ui/skeleton";
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
import type {Pagination as SupabasePagination, User} from "@supabase/auth-js";

definePageMeta({
  middleware: ['auth']
})

const client = useSupabaseClient()
const page = ref(1)
const perPage = ref(10)

const {data, error} = await useAsyncData("users",
    async () => await client.auth.admin.listUsers({page: page.value, perPage: perPage.value}) as {
      data: { users: User[]; aud: string; } & SupabasePagination;
      error: null;
    },
    {
      deep: true,
      watch: [page, perPage]
    }
)
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
                <TableRow v-for="user in data?.data?.users">
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
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter class="flex justify-end">
            <Pagination v-slot="{ page }" :items-per-page="perPage" :page="page"
                        :sibling-count="1" :total="data?.data.total" show-edges
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