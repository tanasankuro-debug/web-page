"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Sprout, TreeDeciduous, Flower2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import { GARDEN_STYLE_IMAGE, GARDEN_STYLE_LABEL, type GardenStyle } from "@/lib/garden-styles";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecommendedPlant {
  plant_id: string;
  name_th: string;
  quantity: number;
}

interface Recommendation {
  style: GardenStyle;
  plants: RecommendedPlant[];
  estimated_cost: number;
  cooling_effect: string;
  reasoning: string | null;
}

const STYLES: { value: GardenStyle; icon: typeof Sprout }[] = [
  { value: "tropical", icon: TreeDeciduous },
  { value: "minimal", icon: Sprout },
  { value: "low_maintenance", icon: Flower2 },
];

export function GardenStyleSelector({
  projectId,
  area,
  beforeImageUrl,
}: {
  projectId: string;
  area: number;
  beforeImageUrl: string | null;
}) {
  const [selected, setSelected] = useState<GardenStyle | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSelect(style: GardenStyle) {
    setSelected(style);
    setLoading(true);
    try {
      const result = await apiPost<Recommendation>("/garden/recommend", {
        project_id: projectId,
        area,
        style,
      });
      setRecommendation(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "แนะนำแบบสวนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {STYLES.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => handleSelect(style.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected === style.value && "border-primary bg-primary/10",
            )}
          >
            <style.icon className="size-6 text-primary" />
            <span className="text-sm font-semibold">{GARDEN_STYLE_LABEL[style.value]}</span>
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">กำลังแนะนำแบบสวน...</p>}

      {recommendation && (
        <GlassCard className="p-6">
          <CardContent className="flex flex-col gap-6 p-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs text-muted-foreground">ก่อน</div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                  {beforeImageUrl ? (
                    <Image src={beforeImageUrl} alt="before" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      ไม่มีรูปพื้นที่
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs text-muted-foreground">หลัง (ตัวอย่างสไตล์)</div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={GARDEN_STYLE_IMAGE[recommendation.style]}
                    alt={GARDEN_STYLE_LABEL[recommendation.style]}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/15">
                ค่าใช้จ่ายโดยประมาณ ฿{recommendation.estimated_cost.toLocaleString()}
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                ผลลดความร้อน: {recommendation.cooling_effect}
              </Badge>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-muted-foreground">ต้นไม้แนะนำ</div>
              <div className="flex flex-wrap gap-2">
                {recommendation.plants.map((plant) => (
                  <Badge key={plant.plant_id} variant="secondary" className="rounded-full">
                    {plant.name_th} × {plant.quantity}
                  </Badge>
                ))}
              </div>
            </div>

            {recommendation.reasoning && (
              <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
            )}
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
