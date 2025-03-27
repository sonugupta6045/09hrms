"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  FileText,
  LogOut,
  ChevronDown,
  BarChart,
  Calendar,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
  badge?: number | string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
    submenu: [
      { title: "All Candidates", href: "/dashboard/candidates" },
      { title: "Shortlisted", href: "/dashboard/shortlisted" },
      { title: "Interviews", href: "/dashboard/interviews" },
    ],
    badge: 5, // Example badge showing number of new candidates
  },
  {
    title: "Positions",
    href: "/dashboard/positions",
    icon: Briefcase,
    badge: 3, // Example badge showing number of open positions
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    badge: "New", // Example badge showing new messages
  },
  {
    title: "Guidelines",
    href: "/dashboard/guidelines",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Check if the current path is in a submenu and open that submenu
  useEffect(() => {
    if (!isMobile) {
      navItems.forEach((item) => {
        if (item.submenu && item.submenu.some((subItem) => pathname === subItem.href)) {
          setOpenSubmenu(item.title)
        }
      })
    }
  }, [pathname, isMobile])

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Reset collapsed state when switching between mobile and desktop
  useEffect(() => {
    if (isMobile) {
      setCollapsed(false)
    }
  }, [isMobile])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const handleSignOut = async () => {
    // Navigate to home page after sign out
    router.push("/")
  }

  const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  const renderSidebarContent = () => (
    <>
      <div className={cn("p-4 border-b", collapsed && !isMobile && "p-2")}>
        <Link href="/dashboard" className="flex items-center gap-2 justify-center">
          <div className="bg-primary p-1 rounded flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("text-primary-foreground", collapsed && !isMobile ? "h-5 w-5" : "h-6 w-6")}
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          {(!collapsed || isMobile) && <span className="font-bold text-xl">HRMS</span>}
        </Link>
      </div>

      {(!collapsed || isMobile) && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.fullName || "HR Manager"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress || "hr@example.com"}
              </p>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <motion.div
          className={cn("py-4 px-3", collapsed && !isMobile && "px-2")}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.href} className="mb-1">
                {item.submenu ? (
                  <div>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            variants={itemVariants}
                            onClick={() => toggleSubmenu(item.title)}
                            className={cn(
                              "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                              pathname.startsWith(item.href.split("/").slice(0, 3).join("/"))
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted",
                              collapsed && !isMobile && "justify-center px-2",
                            )}
                          >
                            <item.icon className={cn("h-5 w-5", !collapsed || isMobile ? "mr-3" : "mr-0")} />
                            {(!collapsed || isMobile) && (
                              <>
                                <span className="flex-1 text-left">{item.title}</span>
                                {item.badge && (
                                  <span className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform ml-1",
                                    openSubmenu === item.title ? "transform rotate-180" : "",
                                  )}
                                />
                              </>
                            )}
                          </motion.button>
                        </TooltipTrigger>
                        {collapsed && !isMobile && (
                          <TooltipContent side="right">
                            {item.title}
                            {item.badge && ` (${item.badge})`}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    <AnimatePresence>
                      {openSubmenu === item.title && (!collapsed || isMobile) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 mt-1 space-y-1"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                                pathname === subItem.href
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted text-muted-foreground",
                              )}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current mr-3" />
                              {subItem.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div variants={itemVariants}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                              pathname === item.href ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                              collapsed && !isMobile && "justify-center px-2",
                            )}
                          >
                            <item.icon className={cn("h-5 w-5", !collapsed || isMobile ? "mr-3" : "mr-0")} />
                            {(!collapsed || isMobile) && (
                              <>
                                <span>{item.title}</span>
                                {item.badge && (
                                  <span className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </Link>
                        </motion.div>
                      </TooltipTrigger>
                      {collapsed && !isMobile && (
                        <TooltipContent side="right">
                          {item.title}
                          {item.badge && ` (${item.badge})`}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </nav>
        </motion.div>
      </ScrollArea>

      <div className={cn("p-4 border-t", collapsed && !isMobile && "p-2")}>
        <SignOutButton signOutCallback={handleSignOut}>
          <Button
            variant="outline"
            className={cn(
              "w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20",
              collapsed && !isMobile ? "justify-center px-2" : "justify-start",
            )}
          >
            <LogOut className={cn("h-5 w-5", !collapsed || isMobile ? "mr-3" : "mr-0")} />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </Button>
        </SignOutButton>
      </div>
    </>
  )

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-background border-r shadow-lg"
              >
                {renderSidebarContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "h-full flex flex-col bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {renderSidebarContent()}

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronDown className={cn("h-3 w-3 transition-transform rotate-90", collapsed && "rotate-[270deg]")} />
      </Button>
    </div>
  )
}

