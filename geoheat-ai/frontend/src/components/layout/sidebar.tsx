"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Leaf, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Dashboard now includes the full project list on one page, so there's only
// one top-level nav item. AI Scanner / Garden Design are project-scoped
// (under /dashboard/projects/[id]/...), reachable from a project's detail
// page. Heat Map / Settings are out of MVP scope per
// Prompt camera/00_MVP_Specification_FINAL.md §5.
const menu = [{ href: "/dashboard", label: "Dashboard", icon: Home }];

function SidebarNav({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {menu.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              collapsed && "justify-center px-0",
              active && "text-primary",
            )}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-xl bg-primary/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {!active && (
              <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
            <Icon className="relative z-10 size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && <span className="relative z-10">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 px-5 py-5 font-bold",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-4" />
      </span>
      {!collapsed && <span>GeoHeat AI</span>}
    </Link>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="glass sticky top-3 mb-3 ml-3 hidden h-[calc(100vh-1.5rem)] shrink-0 flex-col overflow-hidden rounded-3xl md:flex"
    >
      <SidebarBrand collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
      >
        {collapsed ? (
          <ChevronsRight className="size-4" />
        ) : (
          <>
            <ChevronsLeft className="size-4" />
            ย่อเมนู
          </>
        )}
      </button>
    </motion.aside>
  );
}

export function SidebarMobileNav() {
  return (
    <div className="flex h-full flex-col">
      <SidebarBrand />
      <SidebarNav />
    </div>
  );
}
