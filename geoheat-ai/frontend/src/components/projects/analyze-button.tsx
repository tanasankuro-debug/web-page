"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface AnalysisResponse {
  id: string;
}

export function AnalyzeButton({
  projectId,
  imageId,
  onLoadingChange,
}: {
  projectId: string;
  imageId: string;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function setLoadingState(next: boolean) {
    setLoading(next);
    onLoadingChange?.(next);
  }

  async function handleAnalyze() {
    setLoadingState(true);
    try {
      await apiPost<AnalysisResponse>("/ai/analyze", { project_id: projectId, image_id: imageId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "วิเคราะห์พื้นที่ไม่สำเร็จ");
      setLoadingState(false);
      return;
    }

    // Green Score depends on the analysis above already existing, so
    // calculate it right after — one click covers both steps. If just this
    // part fails, the analysis itself still succeeded and is worth showing,
    // so warn instead of claiming the whole action failed.
    try {
      await apiPost("/green-score/calculate", { project_id: projectId });
      toast.success("วิเคราะห์พื้นที่สำเร็จ");
    } catch (error) {
      toast.warning(
        `วิเคราะห์พื้นที่สำเร็จ แต่คำนวณ Green Score ไม่สำเร็จ: ${error instanceof Error ? error.message : "ลองใหม่ภายหลัง"}`,
      );
    }

    router.push(`/dashboard/projects/${projectId}/analysis`);
    router.refresh();
    setLoadingState(false);
  }

  return (
    <Button type="button" className="rounded-xl" disabled={loading} onClick={handleAnalyze}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
      {loading ? "กำลังวิเคราะห์..." : "เริ่มวิเคราะห์ด้วย AI"}
    </Button>
  );
}
