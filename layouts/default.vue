<script lang="ts" setup>
import {Home, Package, Package2, PanelLeft, Search, Settings, ShoppingCart, Users2,} from 'lucide-vue-next'
import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {Input} from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {NuxtLink} from "#components";

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const client = useSupabaseClient()
const user = useSupabaseUser()
const crumbs = ref()

onMounted(() => {
  crumbs.value = route.path.split('/').filter(crumb => crumb !== '')
})

const logout = async () => {
  await client.auth.signOut()
  await navigateTo("/auth/login")
}

const getPath = (index: any) => {
  return '/' + crumbs.value.slice(0, index + 1).join('/')
}
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav class="flex flex-col items-center gap-4 px-2 py-4">
        <a
            class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            href="#"
        >
          <Package2 class="h-4 w-4 transition-all group-hover:scale-110"/>
          <span class="sr-only">Acme Inc</span>
        </a>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <NuxtLink
                  :class="$route.path == '/'? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                  to="/"
              >
                <Home class="h-5 w-5"/>
                <span class="sr-only">Dashboard</span>
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              Dashboard
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <NuxtLink
                  :class="$route.path == '/orders'? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                  to="/orders"
              >
                <ShoppingCart class="h-5 w-5"/>
                <span class="sr-only">Pedidos</span>
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              Pedidos
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <NuxtLink
                  :class="$route.path == '/products'? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                  to="/products"
              >
                <Package class="h-5 w-5"/>
                <span class="sr-only">Produtos</span>
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              Produtos
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <NuxtLink
                  :class="$route.path == '/users'? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                  to="/users"
              >
                <Users2 class="h-5 w-5"/>
                <span class="sr-only">Usuários</span>
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              Usuários
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <NuxtLink
                  :class="$route.path == '/settings'? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
                  class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                  to="/orders"
              >
                <Settings class="h-5 w-5"/>
                <span class="sr-only">Configurações</span>
              </NuxtLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              Configurações
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header
          class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger as-child>
            <Button class="sm:hidden" size="icon" variant="outline">
              <PanelLeft class="h-5 w-5"/>
              <span class="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent class="sm:max-w-xs" side="left">
            <nav class="grid gap-6 text-lg font-medium">
              <NuxtLink
                  class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  to="/"
              >
                <Package2 class="h-5 w-5 transition-all group-hover:scale-110"/>
                <span class="sr-only">Acme Inc</span>
              </NuxtLink>
              <NuxtLink
                  :class="$route.path == '/' ? 'text-accent-foreground' : 'text-muted-foreground'"
                  class="flex items-center gap-4 px-2.5 hover:text-foreground"
                  to="/"
              >
                <Home class="h-5 w-5"/>
                Dashboard
              </NuxtLink>
              <NuxtLink
                  :class="$route.path == '/orders' ? 'text-accent-foreground' : 'text-muted-foreground'"
                  class="flex items-center gap-4 px-2.5 hover:text-foreground"
                  to="/orders"
              >
                <ShoppingCart class="h-5 w-5"/>
                Pedidos
              </NuxtLink>
              <NuxtLink
                  :class="$route.path == '/products' ? 'text-accent-foreground' : 'text-muted-foreground'"
                  class="flex items-center gap-4 px-2.5 hover:text-foreground"
                  to="/products"
              >
                <Package class="h-5 w-5"/>
                Produtos
              </NuxtLink>
              <NuxtLink
                  :class="$route.path == '/users' ? 'text-accent-foreground' : 'text-muted-foreground'"
                  class="flex items-center gap-4 px-2.5 hover:text-foreground"
                  to="/users"
              >
                <Users2 class="h-5 w-5"/>
                Usuários
              </NuxtLink>
            </nav>
          </SheetContent>
        </Sheet>
        <Breadcrumb class="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem v-for="(crumb, i) in crumbs" :key="`breadcrumb-${i}`">
              <BreadcrumbLink as-child>
                <NuxtLink :to="getPath(i)">
                  {{ crumb }}
                </NuxtLink>
              </BreadcrumbLink>
              <BreadcrumbSeparator v-if="i !== crumbs.length - 1"/>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="relative ml-auto flex-1 md:grow-0">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input
              class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              placeholder="Procurar..."
              type="search"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Avatar>
              <AvatarImage :src="user?.user_metadata?.avatar_url" alt="@radix-vue"/>
              <AvatarFallback>??</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem @click="logout">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>

</style>