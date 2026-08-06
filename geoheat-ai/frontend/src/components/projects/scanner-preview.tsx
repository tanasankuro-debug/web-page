"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AnalyzeButton } from "@/components/projects/analyze-button";

export function ScannerPreview({
  projectId,
  imageId,
  imageUrl,
  alt,
  hasAnalysis,
  analysisHref,
}: {
  projectId: string;
  imageId: string;
  imageUrl: string;
  alt: string;
  hasAnalysis: boolean;
  analysisHref: string;
}) {
  const [processing, setProcessing] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-border">
        <Image src={imageUrl} alt={alt} fill className="object-cover" unoptimized priority />
        {processing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 backdrop-blur-sm">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
            <div
              className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_16px_2px_rgba(16,185,129,0.7)]"
              style={{ animation: "laser-sweep 1.8s ease-in-out infinite" }}
            />
            <Sparkles className="relative size-8 animate-pulse text-primary" />
            <p className="relative text-sm font-medium">AI กำลังวิเคราะห์พื้นที่...</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <AnalyzeButton projectId={projectId} imageId={imageId} onLoadingChange={setProcessing} />
        {hasAnalysis && (
          <Link
            href={analysisHref}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ดูผลวิเคราะห์ล่าสุด →
          </Link>
        )}
      </div>
    </div>
  );
}
