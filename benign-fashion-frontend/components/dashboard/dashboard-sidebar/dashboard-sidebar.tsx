'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BriefcaseBusiness,
  ChevronDown,
  FileChartColumn,
  Home,
  NotebookText,
  Plus,
  Settings,
  SquarePlus,
  UserCog,
} from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Dashboard Overview',
      icon: Home,
      href: '/dashboard/dashboard-overview',
    },
    {
      title: 'Categories',
      icon: Plus,
      href: '/dashboard/categories',
    },
    // {
    //   title: 'Setup',
    //   icon: Settings,
    //   href: '/dashboard/setup',
    //   subItems: [
    //     {
    //       title: 'Items',
    //       href: '/dashboard/setup/items',
    //     },
    //     {
    //       title: 'Bank Accounts',
    //       href: '/dashboard/setup/bank-accounts',
    //     },
    //     {
    //       title: 'Vendors',
    //       href: '/dashboard/setup/vendors',
    //     },
    //     {
    //       title: 'Customers',
    //       href: '/dashboard/setup/customers',
    //     },
    //     {
    //       title: 'Account Heads',
    //       href: '/dashboard/setup/account-heads',
    //     },
    //   ],
    // },
    // {
    //   title: 'Trade Management',
    //   icon: BriefcaseBusiness,
    //   href: '/dashboard/trade-management',
    //   subItems: [
    //     {
    //       title: 'Purchases',
    //       href: '/dashboard/trade-management/purchases',
    //     },
    //     {
    //       title: 'Sorting',
    //       href: '/dashboard/trade-management/sorting',
    //     },
    //     {
    //       title: 'Sales',
    //       href: '/dashboard/trade-management/sales',
    //     },
    //     {
    //       title: 'Expenses',
    //       href: '/dashboard/trade-management/expenses',
    //     },
    //     {
    //       title: 'Transactions',
    //       href: '/dashboard/trade-management/transactions',
    //     },
    //     {
    //       title: 'Bank Transactions',
    //       href: '/dashboard/trade-management/bank-transactions',
    //     },
    //     {
    //       title: 'Opening Balance',
    //       href: '/dashboard/trade-management/opening-balance',
    //     },
    //     {
    //       title: 'Wastages',
    //       href: '/dashboard/trade-management/wastages',
    //     },
    //   ],
    // },
    // {
    //   title: 'Reports',
    //   icon: FileChartColumn,
    //   href: '/dashboard/report',
    //   subItems: [
    //     {
    //       title: 'Cash Report',
    //       href: '/dashboard/report/cash-report',
    //     },
    //     {
    //       title: 'Party Report',
    //       href: '/dashboard/report/party-report',
    //     },
    //     {
    //       title: 'Stock Ledger',
    //       href: '/dashboard/report/stock-ledger',
    //     },
    //   ],
    // },
  ]

  // Check if the current path is in the submenu items
  const isSubItemActive = (item: any) => {
    if (!item.subItems) return false
    return item.subItems.some((subItem: any) => pathname === subItem.href)
  }

  // Check if the current path matches the main item or its sub-items
  const isItemActive = (item: any) => {
    return pathname.startsWith(item.href) || isSubItemActive(item)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="p-2">
            <h1 className="text-xl font-bold">My Dashboard</h1>
          </div>
          <div>
            <Link href={'/'}>
              <Home />
            </Link>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${isItemActive(item) ? 'bg-blue-400 text-black hover:bg-blue-400' : ''}  `}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
