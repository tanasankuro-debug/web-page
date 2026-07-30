"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import { apiUpload } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImageUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function selectFile(next: File | null) {
    setFile(next);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) selectFile(dropped);
  }

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
      selectFile(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary/5",
          dragOver && "border-primary bg-primary/10",
        )}
      >
        {previewUrl ? (
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="ตัวอย่างรูปที่เลือก" className="size-full object-cover" />
          </div>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload className="size-6" />
            </span>
            <p className="text-sm font-medium">ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="อัปโหลดรูปพื้นที่"
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </div>

      {file && (
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" className="rounded-xl" disabled={loading} onClick={handleUpload}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
            {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปพื้นที่"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl"
            disabled={loading}
            onClick={() => selectFile(null)}
          >
            <X className="size-4" />
            ยกเลิก
          </Button>
        </div>
      )}
    </div>
  );
}
