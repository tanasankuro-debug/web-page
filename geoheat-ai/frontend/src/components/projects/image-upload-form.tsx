"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { apiUpload } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function ImageUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("project_id", projectId);
      formData.append("image_type", "before");
      await apiUpload("/images/upload", formData);
      toast.success("อัปโหลดรูปสำเร็จ");
      setFile(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="อัปโหลดรูปพื้นที่"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-foreground"
      />
      <Button
        type="button"
        size="sm"
        className="rounded-xl"
        disabled={!file || loading}
        onClick={handleUpload}
      >
        <Upload className="size-4" />
        {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปพื้นที่"}
      </Button>
    </div>
  );
}
