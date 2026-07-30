"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Sprout, TreeDeciduous, Flower2, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import { GARDEN_STYLE_IMAGE, GARDEN_STYLE_LABEL, type GardenStyle } from "@/lib/garden-styles";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
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
              "flex flex-col items-center gap-2 rounded-2xl border border-border bg-white/[0.02] p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected === style.value && "border-primary bg-primary/10",
            )}
          >
            <style.icon className="size-6 text-primary" />
            <span className="text-sm font-semibold">{GARDEN_STYLE_LABEL[style.value]}</span>
          </button>
        ))}
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          กำลังแนะนำแบบสวน...
        </p>
      )}

      {recommendation && (
        <GlassCard className="p-6">
          <CardContent className="flex flex-col gap-6 p-0">
            {beforeImageUrl ? (
              <div className="ring-1 ring-border rounded-[2rem]">
                <BeforeAfterSlider
                  beforeSrc={beforeImageUrl}
                  afterSrc={GARDEN_STYLE_IMAGE[recommendation.style]}
                  beforeAlt="ก่อนออกแบบสวน"
                  afterAlt={GARDEN_STYLE_LABEL[recommendation.style]}
                  afterLabel={`หลัง (${GARDEN_STYLE_LABEL[recommendation.style]})`}
                />
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-border">
                <Image
                  src={GARDEN_STYLE_IMAGE[recommendation.style]}
                  alt={GARDEN_STYLE_LABEL[recommendation.style]}
                  fill
                  className="object-cover"
                  priority
                />
                <span className="absolute right-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
                  หลัง (ตัวอย่างสไตล์)
                </span>
              </div>
            )}

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
