"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu as MenuIcon } from "lucide-react";
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

export function Topbar({
  user,
}: {
  user: { email: string; fullName?: string | null };
}) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = user.fullName || user.email;

  return (
    <header className="glass sticky top-3 z-30 mx-3 mt-3 flex items-center justify-between rounded-2xl px-3 py-2.5 md:mr-3 md:ml-0">
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="md:hidden" />}>
          <MenuIcon className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="glass w-72 rounded-none border-0 p-0">
          <SidebarMobileNav />
        </SheetContent>
      </Sheet>

      <span className="hidden text-sm font-medium text-muted-foreground md:block">
        GeoHeat AI Green Designer
      </span>

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
    </header>
  );
}
