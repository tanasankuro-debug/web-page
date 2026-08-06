"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu as MenuIcon, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { SidebarMobileNav } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/dashboard/command-palette";

export function Topbar({
  user,
}: {
  user: { email: string; fullName?: string | null };
}) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = user.fullName || user.email;

  return (
    <header className="glass sticky top-3 z-30 mx-3 mt-3 flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 md:mr-3 md:ml-0">
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="md:hidden" />}>
          <MenuIcon className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="glass w-72 rounded-none border-0 p-0">
          <SidebarMobileNav />
        </SheetContent>
      </Sheet>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="hidden flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/10 sm:flex sm:max-w-xs"
      >
        <Search className="size-4" />
        ค้นหาโครงการ...
        <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="ค้นหาโครงการ"
        className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground sm:hidden"
      >
        <Search className="size-4" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 rounded-full pr-3" />}>
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/15 text-primary">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">{displayName}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="size-4" />
            ออกจากระบบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
