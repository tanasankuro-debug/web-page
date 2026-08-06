"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Search, FolderKanban, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  is_demo: boolean;
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    if (!open || projects) return;
    const supabase = createClient();
    supabase
      .from("projects")
      .select("id, name, description, is_demo")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProjects(data ?? []));
  }, [open, projects]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = (projects ?? []).filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  function go(id: string) {
    router.push(`/dashboard/projects/${id}`);
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-28 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-popover shadow-2xl transition-all duration-150 data-ending-style:-translate-y-3 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:-translate-y-3 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาโครงการของคุณ..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              esc
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {projects === null ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                กำลังโหลด...
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                ไม่พบโครงการที่ตรงกับ &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(p.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderKanban className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{p.name}</span>
                    {p.is_demo && <span className="ml-1.5 text-xs text-sky-blue">Demo</span>}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-white/10 p-2">
            <button
              type="button"
              onClick={() => {
                router.push("/dashboard/projects/new");
                onOpenChange(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-primary transition-colors hover:bg-primary/10"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="size-4" />
              </span>
              สร้างโครงการใหม่
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
