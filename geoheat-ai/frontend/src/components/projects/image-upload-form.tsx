"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2, ImageIcon, X, Camera } from "lucide-react";
import { apiUpload } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImageUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
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
      {!previewUrl && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-auto flex-col gap-1.5 rounded-2xl py-4"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="size-5" />
            ถ่ายภาพ
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-auto flex-col gap-1.5 rounded-2xl py-4"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="size-5" />
            เลือกจากเครื่อง
          </Button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            aria-label="ถ่ายภาพพื้นที่ด้วยกล้อง"
            onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>
      )}

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
          "relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary/5",
          dragOver && "border-primary bg-primary/10",
        )}
      >
        {/* Vision-grid overlay — reinforces the "AI vision system" feel */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

        {/* Scanning laser sweep, only while actively dragging a file over */}
        {dragOver && (
          <div
            className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_16px_2px_rgba(16,185,129,0.7)]"
            style={{ animation: "laser-sweep 1.4s ease-in-out infinite" }}
          />
        )}

        {previewUrl ? (
          <div
            key={previewUrl}
            className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl"
            style={{ animation: "reveal-wipe 0.5s cubic-bezier(0.16,1,0.3,1)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="ตัวอย่างรูปที่เลือก" className="size-full object-cover" />
          </div>
        ) : (
          <>
            <span className="relative flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload className="size-6" />
            </span>
            <p className="relative text-sm font-medium">หรือลากรูปมาวาง</p>
            <p className="relative text-xs text-muted-foreground">JPG, PNG, WEBP</p>
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
