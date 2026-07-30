"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
              collapsed && "justify-center px-0",
              active && "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && item.label}
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
    <aside
      className={cn(
        "glass sticky top-3 mb-3 ml-3 hidden h-[calc(100vh-1.5rem)] shrink-0 flex-col rounded-3xl transition-all duration-200 md:flex",
        collapsed ? "w-[76px]" : "w-64",
      )}
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
    </aside>
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
