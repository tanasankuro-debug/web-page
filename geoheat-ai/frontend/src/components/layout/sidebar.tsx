"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

// AI Scanner / Garden Design are project-scoped (under /dashboard/projects/[id]/...),
// not standalone pages, so they're not listed here — reachable from a project's
// detail page instead. Heat Map / Settings are out of MVP scope per
// Prompt camera/00_MVP_Specification_FINAL.md §5.
const menu = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/projects", label: "My Projects", icon: FolderKanban },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-sidebar/60 backdrop-blur-xl md:flex md:flex-col">
      <Link href="/" className="flex items-center gap-2 px-6 py-5 font-bold">
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Leaf className="size-4" />
        </span>
        <span>GeoHeat AI</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {menu.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
                active && "bg-primary/15 text-primary",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
